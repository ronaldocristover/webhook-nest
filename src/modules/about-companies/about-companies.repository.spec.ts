import { Test, TestingModule } from '@nestjs/testing';
import { AboutCompanyRepository } from './about-companies.repository';
import { PrismaService } from '../shared/prisma/prisma.service';
import { AboutCompany } from '@prisma/client';

describe('AboutCompanyRepository', () => {
  let repository: AboutCompanyRepository;
  let prismaService: any;

  const mockAboutCompany: AboutCompany = {
    id: 1,
    title: 'Test Company',
    subtitle: 'Test Subtitle',
    content: 'Test content',
    images: { hero: 'test.jpg' },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUpdateData = {
    title: 'Updated Company',
    subtitle: 'Updated Subtitle',
    content: 'Updated content',
    images: { hero: 'updated.jpg' },
  };

  beforeEach(async () => {
    const mockPrismaService = {
      aboutCompany: {
        findUnique: jest.fn() as any,
        update: jest.fn() as any,
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AboutCompanyRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<AboutCompanyRepository>(AboutCompanyRepository);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(prismaService).toBeDefined();
    expect(prismaService.aboutCompany).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a company when found', async () => {
      // Arrange
      prismaService.aboutCompany.findUnique.mockResolvedValue(mockAboutCompany);

      // Act
      const result = await repository.findOne(1);

      // Assert
      expect(prismaService.aboutCompany.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockAboutCompany);
    });

    it('should return null when company not found', async () => {
      // Arrange
      prismaService.aboutCompany.findUnique.mockResolvedValue(null);

      // Act
      const result = await repository.findOne(999);

      // Assert
      expect(prismaService.aboutCompany.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      // Arrange
      const error = new Error('Database connection failed');
      prismaService.aboutCompany.findUnique.mockRejectedValue(error);

      // Act & Assert
      await expect(repository.findOne(1)).rejects.toThrow('Database connection failed');
      expect(prismaService.aboutCompany.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should accept different ID values', async () => {
      // Arrange
      const testIds = [1, 5, 42, 999];
      for (const id of testIds) {
        prismaService.aboutCompany.findUnique.mockResolvedValue(null);

        // Act
        await repository.findOne(id);

        // Assert
        expect(prismaService.aboutCompany.findUnique).toHaveBeenCalledWith({
          where: { id },
        });
      }
      expect(prismaService.aboutCompany.findUnique).toHaveBeenCalledTimes(testIds.length);
    });
  });

  describe('update', () => {
    it('should update and return the company', async () => {
      // Arrange
      const updatedCompany = { ...mockAboutCompany, ...mockUpdateData };
      prismaService.aboutCompany.update.mockResolvedValue(updatedCompany);

      // Act
      const result = await repository.update(1, mockUpdateData);

      // Assert
      expect(prismaService.aboutCompany.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: mockUpdateData,
      });
      expect(result).toEqual(updatedCompany);
    });

    it('should handle partial updates', async () => {
      // Arrange
      const partialUpdate = { title: 'New Title Only' };
      const partiallyUpdatedCompany = { ...mockAboutCompany, ...partialUpdate };
      prismaService.aboutCompany.update.mockResolvedValue(partiallyUpdatedCompany);

      // Act
      const result = await repository.update(1, partialUpdate);

      // Assert
      expect(prismaService.aboutCompany.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: partialUpdate,
      });
      expect(result).toEqual(partiallyUpdatedCompany);
    });

    it('should handle empty update data', async () => {
      // Arrange
      const unchangedCompany = mockAboutCompany;
      prismaService.aboutCompany.update.mockResolvedValue(unchangedCompany);

      // Act
      const result = await repository.update(1, {});

      // Assert
      expect(prismaService.aboutCompany.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {},
      });
      expect(result).toEqual(unchangedCompany);
    });

    it('should handle database errors during update', async () => {
      // Arrange
      const error = new Error('Update failed');
      prismaService.aboutCompany.update.mockRejectedValue(error);

      // Act & Assert
      await expect(repository.update(1, mockUpdateData)).rejects.toThrow('Update failed');
      expect(prismaService.aboutCompany.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: mockUpdateData,
      });
    });

    it('should handle record not found during update', async () => {
      // Arrange
      const error = new Error('Record to update not found');
      prismaService.aboutCompany.update.mockRejectedValue(error);

      // Act & Assert
      await expect(repository.update(999, mockUpdateData)).rejects.toThrow('Record to update not found');
      expect(prismaService.aboutCompany.update).toHaveBeenCalledWith({
        where: { id: 999 },
        data: mockUpdateData,
      });
    });
  });

  describe('Data handling', () => {
    it('should handle complex JSON images data', async () => {
      // Arrange
      const complexImages = {
        hero: '/hero.jpg',
        gallery: ['/img1.jpg', '/img2.jpg'],
        meta: {
          count: 3,
          categories: ['exterior', 'interior'],
          tags: ['scaffolding', 'construction', 'safety']
        }
      };
      const updateDataWithComplexImages = {
        title: 'Company with complex images',
        images: complexImages,
      };
      prismaService.aboutCompany.update.mockResolvedValue({
        ...mockAboutCompany,
        ...updateDataWithComplexImages,
      });

      // Act
      const result = await repository.update(1, updateDataWithComplexImages);

      // Assert
      expect(prismaService.aboutCompany.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDataWithComplexImages,
      });
      expect(result.images).toEqual(complexImages);
    });

    it('should handle null and undefined values in update data', async () => {
      // Arrange
      const updateDataWithNulls = {
        subtitle: null as any,
        content: undefined as any,
        title: 'Valid title',
      };
      prismaService.aboutCompany.update.mockResolvedValue({
        ...mockAboutCompany,
        title: 'Valid title',
        subtitle: null,
      });

      // Act
      const result = await repository.update(1, updateDataWithNulls);

      // Assert
      expect(prismaService.aboutCompany.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDataWithNulls,
      });
      expect(result.title).toBe('Valid title');
      expect(result.subtitle).toBeNull();
    });
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { AboutCompanyService } from './about-companies.service';
import { AboutCompanyRepository } from './about-companies.repository';
import { AboutCompany } from '@prisma/client';

describe('AboutCompanyService', () => {
  let service: AboutCompanyService;
  let repository: jest.Mocked<AboutCompanyRepository>;

  const mockAboutCompany: AboutCompany = {
    id: 1,
    title: 'Test Company',
    subtitle: 'Test Subtitle',
    content: 'Test content',
    images: { hero: 'test.jpg' },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUpdatedData = {
    title: 'Updated Company',
    subtitle: 'Updated Subtitle',
    content: 'Updated content',
    images: { hero: 'updated.jpg' },
  };

  beforeEach(async () => {
    const mockRepository = {
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AboutCompanyService,
        {
          provide: AboutCompanyRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AboutCompanyService>(AboutCompanyService);
    repository = module.get(AboutCompanyRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('findOne', () => {
    it('should return company data with success wrapper', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(mockAboutCompany);

      // Act
      const result = await service.findOne();

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        success: true,
        content: mockAboutCompany,
      });
    });

    it('should return null content when company not found', async () => {
      // Arrange
      repository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.findOne();

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        success: true,
        content: null,
      });
    });

    it('should handle repository errors', async () => {
      // Arrange
      const error = new Error('Database error');
      repository.findOne.mockRejectedValue(error);

      // Act & Assert
      await expect(service.findOne()).rejects.toThrow('Database error');
      expect(repository.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should call repository update with correct parameters', async () => {
      // Arrange
      const updatedCompany = { ...mockAboutCompany, ...mockUpdatedData };
      repository.update.mockResolvedValue(updatedCompany);

      // Act
      await service.update(mockUpdatedData);

      // Assert
      expect(repository.update).toHaveBeenCalledWith(1, mockUpdatedData);
    });

    it('should handle repository update errors', async () => {
      // Arrange
      const error = new Error('Update failed');
      repository.update.mockRejectedValue(error);

      // Act & Assert
      await expect(service.update(mockUpdatedData)).rejects.toThrow('Update failed');
      expect(repository.update).toHaveBeenCalledWith(1, mockUpdatedData);
    });
  });

  describe('DEFAULT_ID constant', () => {
    it('should use correct default ID', () => {
      // The service should always use ID = 1 as default
      expect((service as any).DEFAULT_ID).toBe(1);
    });
  });
});

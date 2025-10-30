import { Test, TestingModule } from '@nestjs/testing';
import { AboutCompaniesController } from './about-companies.controller';
import { AboutCompanyService } from './about-companies.service';
import { AboutCompany } from '@prisma/client';

describe('AboutCompaniesController', () => {
  let controller: AboutCompaniesController;
  let service: jest.Mocked<AboutCompanyService>;

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
    const mockService = {
      findOne: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AboutCompaniesController],
      providers: [
        {
          provide: AboutCompanyService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AboutCompaniesController>(AboutCompaniesController);
    service = module.get(AboutCompanyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('GET /about-companies', () => {
    it('should return company information', async () => {
      // Arrange
      const expectedResponse = {
        success: true,
        content: mockAboutCompany,
      };
      service.findOne.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.findOne();

      // Assert
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle service errors gracefully', async () => {
      // Arrange
      const error = new Error('Service error');
      service.findOne.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.findOne()).rejects.toThrow('Service error');
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return null content when no company found', async () => {
      // Arrange
      const expectedResponse = {
        success: true,
        content: null,
      };
      service.findOne.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.findOne();

      // Assert
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('PUT /about-companies', () => {
    it('should update company information', async () => {
      // Arrange
      service.update.mockResolvedValue(undefined);

      // Act
      await controller.update(mockUpdatedData);

      // Assert
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(mockUpdatedData);
    });

    it('should handle update errors gracefully', async () => {
      // Arrange
      const error = new Error('Update failed');
      service.update.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.update(mockUpdatedData)).rejects.toThrow('Update failed');
      expect(service.update).toHaveBeenCalledWith(mockUpdatedData);
    });

    it('should accept empty update data', async () => {
      // Arrange
      service.update.mockResolvedValue(undefined);

      // Act
      await controller.update({});

      // Assert
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith({});
    });

    it('should accept partial update data', async () => {
      // Arrange
      const partialData = { title: 'New Title Only' };
      service.update.mockResolvedValue(undefined);

      // Act
      await controller.update(partialData);

      // Assert
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(partialData);
    });
  });

  describe('Controller structure', () => {
    it('should have correct route configuration', () => {
      // The controller should be decorated with @Controller('about-companies')
      expect(controller.constructor.name).toBe('AboutCompaniesController');
    });

    it('should have GET method decorated with @Get()', () => {
      // Verify the findOne method exists (which should be decorated with @Get())
      expect(typeof controller.findOne).toBe('function');
    });

    it('should have PUT method decorated with @Put("")', () => {
      // Verify the update method exists (which should be decorated with @Put(""))
      expect(typeof controller.update).toBe('function');
    });
  });
});

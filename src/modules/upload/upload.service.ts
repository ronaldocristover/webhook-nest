import { Injectable } from '@nestjs/common';
import { S3Service } from './s3.service';

@Injectable()
export class UploadService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadSingleFile(file: Express.Multer.File, folder?: string) {
    try {
      const result = await this.s3Service.uploadFile(file, folder);
      return {
        success: true,
        message: 'File uploaded successfully',
        content: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to upload file',
        error: error.message,
      };
    }
  }

  async uploadMultipleFiles(files: Express.Multer.File[], folder?: string) {
    try {
      const results = await this.s3Service.uploadMultipleFiles(files, folder);
      return {
        success: true,
        message: 'Files uploaded successfully',
        content: results,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to upload files',
        error: error.message,
      };
    }
  }
}
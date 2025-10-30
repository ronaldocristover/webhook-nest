import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  INestApplication,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomLoggerService } from '../custom-logger/custom-logger.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private static instance: PrismaService;
  private isConnected = false;

  constructor(private logger: CustomLoggerService) {
    super({
      log: ['error', 'warn'],
    });

    // Prevent multiple instances
    if (PrismaService.instance) {
      return PrismaService.instance;
    }
    PrismaService.instance = this;
  }

  async onModuleInit() {
    // Prevent multiple connections
    if (this.isConnected) {
      return;
    }

    try {
      this.logger.log('🔵 Connecting to database...');
      await this.$connect();
      this.isConnected = true;
      this.logger.log('✅ Database connected');
    } catch (error) {
      this.logger.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.isConnected) {
      this.logger.log('🔵 Disconnecting from database...');
      await this.$disconnect();
      this.isConnected = false;
      this.logger.log('✅ Database disconnected');
    }
  }

  // Important: Enable shutdown hooks
  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}

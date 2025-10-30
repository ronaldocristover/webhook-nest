import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { PrismaService } from './modules/shared/prisma/prisma.service';
import { CustomLoggerService } from './modules/shared/custom-logger/custom-logger.service';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { flattenValidationErrors } from './utils/validation';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const customLogger = app.get(CustomLoggerService);
  app.useLogger(customLogger);

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    customLogger.log('SIGTERM received, closing app...');
    await app.close();
  });

  process.on('SIGINT', async () => {
    customLogger.log('SIGINT received, closing app...');
    await app.close();
  });

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: '*', // In production, specify allowed origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Increase body size limit for webhook receiver
  const maxBodySize = configService.get('webhook.maxBodySizeMb') || 10;
  app.use(bodyParser.json({ limit: `${maxBodySize}mb` }));
  app.use(bodyParser.urlencoded({ limit: `${maxBodySize}mb`, extended: true }));
  app.use(bodyParser.raw({ limit: `${maxBodySize}mb`, type: 'application/octet-stream' }));
  app.use(bodyParser.text({ limit: `${maxBodySize}mb`, type: 'text/*' }));

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      exceptionFactory: (errors) => {
        const detailedErrors = flattenValidationErrors(errors);
        return new BadRequestException({ message: detailedErrors });
      },
      stopAtFirstError: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  customLogger.log(`🚀 Application is running on port ${port}`);
  customLogger.log(`📱 Server URL: http://localhost:${port}`);
  customLogger.log(`📝 Webhook endpoint: http://localhost:${port}/oh-my-hook/:token`);
  customLogger.log(`🔐 Auth endpoint: http://localhost:${port}/api/v1/auth`);
}
bootstrap();

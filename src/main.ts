import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { PrismaService } from './modules/shared/prisma/prisma.service';
import { CustomLoggerService } from './modules/shared/custom-logger/custom-logger.service';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { flattenValidationErrors } from './utils/validation';

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

  app.enableCors({
    origin: '*',
    methods: 'GET,PUT,POST,DELETE',
    credentials: true, // Allow credentials if needed
  });

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
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
}
bootstrap();

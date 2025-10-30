import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { CustomLoggerModule } from './modules/shared/custom-logger/custom-logger.module';
import { PrismaModule } from './modules/shared/prisma/prisma.module';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

// Webhook Modules
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { WebhookReceiverModule } from './modules/webhook-receiver/webhook-receiver.module';
import { WebhookRequestsModule } from './modules/webhook-requests/webhook-requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 100, // 100 requests per minute
      },
    ]),
    CustomLoggerModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    // Webhook Modules
    WebhooksModule,
    WebhookReceiverModule,
    WebhookRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

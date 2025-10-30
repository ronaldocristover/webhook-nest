import { Module } from '@nestjs/common';
import { WebhookRequestsService } from './webhook-requests.service';
import { WebhookRequestsController } from './webhook-requests.controller';

@Module({
  controllers: [WebhookRequestsController],
  providers: [WebhookRequestsService],
})
export class WebhookRequestsModule {}
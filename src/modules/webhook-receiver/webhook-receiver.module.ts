import { Module } from '@nestjs/common';
import { WebhookReceiverService } from './webhook-receiver.service';
import { WebhookReceiverController } from './webhook-receiver.controller';

@Module({
  controllers: [WebhookReceiverController],
  providers: [WebhookReceiverService],
})
export class WebhookReceiverModule {}
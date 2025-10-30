import {
  All,
  Controller,
  Param,
  Req,
  Res,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WebhookReceiverService } from './webhook-receiver.service';
import { WebhookResponseDto } from '../shared/dto/api-response.dto';

@Controller('oh-my-hook')
export class WebhookReceiverController {
  private readonly logger = new Logger(WebhookReceiverController.name);

  constructor(
    private readonly webhookReceiverService: WebhookReceiverService,
  ) {}

  @All(':token')
  async receiveWebhook(
    @Param('token') token: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const startTime = Date.now();

    try {
      this.logger.debug(`🎯 Controller received webhook request`, {
        token: token.substring(0, 8) + '...',
        method: req.method,
        path: req.path,
        ip: req.ip,
      });

      const result = await this.webhookReceiverService.receiveWebhook(
        token,
        req.method,
        req.path,
        req.query,
        req.headers,
        req.body,
        req.ip,
      );

      const response: WebhookResponseDto = {
        success: true,
        message: 'Webhook received',
        requestId: result.requestId,
        timestamp: result.timestamp,
      };

      const totalTime = Date.now() - startTime;
      this.logger.log(`✅ Webhook response sent: ${req.method} ${req.path} in ${totalTime}ms`);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      const totalTime = Date.now() - startTime;

      if (error.status === 404) {
        this.logger.warn(`⚠️  Webhook not found: ${token.substring(0, 8)}... (${totalTime}ms)`);
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: error.message,
        });
        return;
      }

      this.logger.error(`💥 Controller error handling webhook: ${error.message}`, error.stack);

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}
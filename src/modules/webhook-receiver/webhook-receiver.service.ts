import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { WebhookResponseDto } from '../shared/dto/api-response.dto';
import { CustomLoggerService } from '../shared/custom-logger/custom-logger.service';

@Injectable()
export class WebhookReceiverService {
  private readonly logger = new Logger(WebhookReceiverService.name);

  constructor(
    private prisma: PrismaService,
    private customLogger: CustomLoggerService,
  ) {}

  async receiveWebhook(
    token: string,
    method: string,
    path: string,
    query: any,
    headers: any,
    body: any,
    ip: string,
  ): Promise<WebhookResponseDto> {
    const startTime = Date.now();

    // Log incoming webhook request
    this.logger.log(`🔥 Incoming webhook: ${method} ${path}`, {
      token: token.substring(0, 8) + '...',
      method,
      path,
      ip,
      userAgent: headers['user-agent'],
      contentLength: headers['content-length'] || '0',
    });

    try {
      // 1. Find webhook
      const webhook = await this.prisma.webhook.findUnique({
        where: { token },
      });

      if (!webhook) {
        this.logger.warn(`❌ Webhook not found for token: ${token.substring(0, 8)}...`);
        throw new NotFoundException('Webhook not found or inactive');
      }

      if (!webhook.isActive) {
        this.logger.warn(`⏸️  Inactive webhook accessed: ${webhook.name} (${webhook.id})`);
        throw new NotFoundException('Webhook not found or inactive');
      }

      this.logger.debug(`✅ Webhook found: ${webhook.name} (${webhook.id})`);

    // 2. Sanitize headers (remove sensitive data)
      const sanitizedHeaders = this.sanitizeHeaders(headers);

      // 3. Calculate body size
      const bodyString = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : '';
      const bodySize = Buffer.byteLength(bodyString || '');

      this.logger.debug(`📝 Processing webhook payload`, {
        bodySize,
        hasQuery: Object.keys(query || {}).length > 0,
        headersCount: Object.keys(sanitizedHeaders || {}).length,
      });

      // 4. Store request
      const webhookRequest = await this.prisma.webhookRequest.create({
        data: {
          webhookId: webhook.id,
          method,
          path,
          queryParams: query,
          headers: sanitizedHeaders,
          body: bodyString,
          bodySize: BigInt(bodySize),
          ipAddress: ip,
          userAgent: headers['user-agent'],
          processingTimeMs: Date.now() - startTime,
        },
      });

      // 5. Update statistics
      await this.updateStatistics(webhook.id, method);

      const processingTime = Date.now() - startTime;

      this.customLogger.log(`✅ Webhook processed successfully`, {
        webhookId: webhook.id,
        webhookName: webhook.name,
        requestId: webhookRequest.id,
        method,
        path,
        processingTimeMs: processingTime,
        bodySize,
        ip,
      });

      this.logger.log(`✅ Webhook processed: ${webhook.name} in ${processingTime}ms`);

      return {
        success: true,
        message: 'Webhook received',
        requestId: webhookRequest.id,
        timestamp: webhookRequest.receivedAt,
      };

    } catch (error) {
      const processingTime = Date.now() - startTime;

      this.customLogger.error(`❌ Failed to process webhook`, {
        token: token.substring(0, 8) + '...',
        method,
        path,
        ip,
        processingTimeMs: processingTime,
        error: error.message,
        stack: error.stack,
      });

      this.logger.error(`❌ Webhook processing failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  private sanitizeHeaders(headers: any): any {
    const sensitive = [
      'authorization',
      'cookie',
      'x-api-key',
      'api-key',
      'token',
      'password',
    ];
    const sanitized = { ...headers };

    for (const key of Object.keys(sanitized)) {
      if (sensitive.some(s => key.toLowerCase().includes(s))) {
        sanitized[key] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  private async updateStatistics(webhookId: string, method: string) {
    try {
      const stats = await this.prisma.webhookStatistic.findUnique({
        where: { webhookId },
      });

      const methodsCount = (stats?.methodsCount as any) || {};
      methodsCount[method] = (methodsCount[method] || 0) + 1;

      const newTotal = stats ? (stats.totalRequests as bigint) + BigInt(1) : BigInt(1);

      await this.prisma.webhookStatistic.upsert({
        where: { webhookId },
        create: {
          webhookId,
          totalRequests: BigInt(1),
          lastRequestAt: new Date(),
          methodsCount,
        },
        update: {
          totalRequests: { increment: BigInt(1) },
          lastRequestAt: new Date(),
          methodsCount,
        },
      });

      this.logger.debug(`📊 Statistics updated for webhook ${webhookId}`, {
        totalRequests: newTotal.toString(),
        methodCount: methodsCount[method],
      });
    } catch (error) {
      this.logger.error(`❌ Failed to update statistics for webhook ${webhookId}`, error.stack);
      // Don't throw here - statistics update failure shouldn't break webhook processing
    }
  }
}
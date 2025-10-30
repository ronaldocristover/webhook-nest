import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { WebhookResponseDto } from './dto/webhook-response.dto';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from '../shared/custom-logger/custom-logger.service';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private customLogger: CustomLoggerService,
  ) {}

  async create(
    userId: string,
    createWebhookDto: CreateWebhookDto,
  ): Promise<WebhookResponseDto> {
    this.logger.log(`🆕 Creating new webhook for user: ${userId}`, {
      name: createWebhookDto.name,
      hasDescription: !!createWebhookDto.description,
    });

    try {
      const token = this.generateToken();

      const webhook = await this.prisma.webhook.create({
        data: {
          userId,
          token,
          name: createWebhookDto.name,
          description: createWebhookDto.description,
        },
        select: {
          id: true,
          token: true,
          name: true,
          description: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Generate full URL
      const appUrl = this.configService.get('app.url');
      const webhookUrl = `${appUrl}/oh-my-hook/${webhook.token}`;

      this.customLogger.log(`✅ Webhook created successfully`, {
        webhookId: webhook.id,
        userId,
        name: webhook.name,
        url: webhookUrl,
        token: token.substring(0, 8) + '...',
      });

      this.logger.log(`✅ Webhook created: ${webhook.name} (${webhook.id})`);

      return {
        ...webhook,
        url: webhookUrl,
      };
    } catch (error) {
      this.customLogger.error(`❌ Failed to create webhook`, {
        userId,
        name: createWebhookDto.name,
        error: error.message,
        stack: error.stack,
      });

      this.logger.error(
        `❌ Failed to create webhook: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(userId: string): Promise<WebhookResponseDto[]> {
    this.logger.debug(`📋 Fetching all webhooks for user: ${userId}`);

    try {
      const webhooks = await this.prisma.webhook.findMany({
        where: { userId },
        include: {
          statistics: true,
          _count: {
            select: { requests: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const appUrl = this.configService.get('app.url');
      const result = webhooks.map((webhook) => ({
        id: webhook.id,
        token: webhook.token,
        name: webhook.name,
        description: webhook.description,
        isActive: webhook.isActive,
        createdAt: webhook.createdAt,
        updatedAt: webhook.updatedAt,
        url: `${appUrl}/oh-my-hook/${webhook.token}`,
        statistics: webhook.statistics
          ? {
              id: webhook.statistics.webhookId, // Using webhookId as id since that's the primary key
              webhookId: webhook.statistics.webhookId,
              totalRequests: webhook.statistics.totalRequests.toString(),
              lastRequestAt: webhook.statistics.lastRequestAt,
              methodsCount:
                (webhook.statistics.methodsCount as Record<string, number>) ||
                {},
            }
          : undefined,
        _count: webhook._count,
      }));

      this.logger.debug(
        `✅ Found ${webhooks.length} webhooks for user: ${userId}`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `❌ Failed to fetch webhooks for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: string, userId: string): Promise<WebhookResponseDto> {
    this.logger.debug(`🔍 Fetching webhook: ${id} for user: ${userId}`);

    try {
      const webhook = await this.prisma.webhook.findFirst({
        where: { id, userId },
        include: {
          statistics: true,
          _count: {
            select: { requests: true },
          },
        },
      });

      if (!webhook) {
        this.logger.warn(`⚠️  Webhook not found: ${id} for user: ${userId}`);
        throw new NotFoundException('Webhook not found');
      }

      const appUrl = this.configService.get('app.url');
      const result: WebhookResponseDto = {
        id: webhook.id,
        token: webhook.token,
        name: webhook.name,
        description: webhook.description,
        isActive: webhook.isActive,
        createdAt: webhook.createdAt,
        updatedAt: webhook.updatedAt,
        url: `${appUrl}/oh-my-hook/${webhook.token}`,
        statistics: webhook.statistics
          ? {
              id: webhook.statistics.webhookId, // Using webhookId as id since that's the primary key
              webhookId: webhook.statistics.webhookId,
              totalRequests: webhook.statistics.totalRequests.toString(),
              lastRequestAt: webhook.statistics.lastRequestAt,
              methodsCount:
                (webhook.statistics.methodsCount as Record<string, number>) ||
                {},
            }
          : undefined,
        _count: webhook._count,
      };

      this.logger.debug(`✅ Found webhook: ${webhook.name} (${webhook.id})`);

      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(
        `❌ Failed to fetch webhook ${id} for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByToken(token: string) {
    return this.prisma.webhook.findUnique({
      where: { token },
    });
  }

  async update(id: string, userId: string, updateWebhookDto: UpdateWebhookDto) {
    this.logger.log(`📝 Updating webhook: ${id} for user: ${userId}`, {
      updateFields: Object.keys(updateWebhookDto),
    });

    try {
      // First check if webhook exists and belongs to user
      const existingWebhook = await this.findOne(id, userId);

      const updatedWebhook = await this.prisma.webhook.update({
        where: { id },
        data: updateWebhookDto,
      });

      this.customLogger.log(`✅ Webhook updated successfully`, {
        webhookId: id,
        userId,
        webhookName: existingWebhook.name,
        updateFields: Object.keys(updateWebhookDto),
        updatedFields: updateWebhookDto,
      });

      this.logger.log(`✅ Webhook updated: ${existingWebhook.name} (${id})`);

      return updatedWebhook;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.customLogger.error(`❌ Failed to update webhook`, {
        webhookId: id,
        userId,
        updateFields: Object.keys(updateWebhookDto),
        error: error.message,
        stack: error.stack,
      });

      this.logger.error(
        `❌ Failed to update webhook ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: string, userId: string) {
    this.logger.log(`🗑️  Deleting webhook: ${id} for user: ${userId}`);

    try {
      // First check if webhook exists and belongs to user
      const existingWebhook = await this.findOne(id, userId);

      const deletedWebhook = await this.prisma.webhook.delete({
        where: { id },
      });

      this.customLogger.log(`✅ Webhook deleted successfully`, {
        webhookId: id,
        userId,
        webhookName: existingWebhook.name,
        token: existingWebhook.token?.substring(0, 8) + '...',
      });

      this.logger.log(`✅ Webhook deleted: ${existingWebhook.name} (${id})`);

      return deletedWebhook;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.customLogger.error(`❌ Failed to delete webhook`, {
        webhookId: id,
        userId,
        error: error.message,
        stack: error.stack,
      });

      this.logger.error(
        `❌ Failed to delete webhook ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }
}

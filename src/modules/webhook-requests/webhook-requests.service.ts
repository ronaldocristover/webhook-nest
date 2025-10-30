import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { QueryRequestsDto } from './dto/query-requests.dto';
import { WebhookRequestResponseDto } from './dto/webhook-request-response.dto';
import { ApiResponseDto } from '../shared/dto/api-response.dto';

@Injectable()
export class WebhookRequestsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    webhookId: string,
    userId: string,
    queryDto: QueryRequestsDto,
  ): Promise<ApiResponseDto<WebhookRequestResponseDto[]>> {
    // Verify webhook belongs to user
    const webhook = await this.prisma.webhook.findFirst({
      where: { id: webhookId, userId },
    });

    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }

    const { page = 1, limit = 50, method, sortOrder = 'desc' } = queryDto;
    const skip = (page - 1) * limit;

    const where = {
      webhookId,
      ...(method && { method }),
    };

    const [requests, total] = await Promise.all([
      this.prisma.webhookRequest.findMany({
        where,
        orderBy: { receivedAt: sortOrder },
        skip,
        take: limit,
        select: {
          id: true,
          method: true,
          path: true,
          queryParams: true,
          headers: true,
          bodySize: true,
          ipAddress: true,
          userAgent: true,
          receivedAt: true,
          processingTimeMs: true,
          // Don't include full body in list for performance
        },
      }),
      this.prisma.webhookRequest.count({ where }),
    ]);

    // Convert BigInt to string for JSON serialization
    const serializedRequests = requests.map(request => ({
      ...request,
      bodySize: request.bodySize ? request.bodySize.toString() : null,
    }));

    return {
      data: serializedRequests,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string, webhookId: string, userId: string): Promise<WebhookRequestResponseDto> {
    // Verify webhook belongs to user
    const webhook = await this.prisma.webhook.findFirst({
      where: { id: webhookId, userId },
    });

    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }

    const request = await this.prisma.webhookRequest.findFirst({
      where: { id, webhookId },
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    // Convert BigInt to string for JSON serialization
    return {
      ...request,
      bodySize: request.bodySize ? request.bodySize.toString() : null,
    };
  }

  async removeAll(webhookId: string, userId: string) {
    // Verify webhook belongs to user
    const webhook = await this.prisma.webhook.findFirst({
      where: { id: webhookId, userId },
    });

    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }

    const result = await this.prisma.webhookRequest.deleteMany({
      where: { webhookId },
    });

    // Reset statistics
    await this.prisma.webhookStatistic.update({
      where: { webhookId },
      data: {
        totalRequests: 0,
        lastRequestAt: null,
        methodsCount: {},
      },
    });

    return {
      success: true,
      deletedCount: result.count,
    };
  }

  async getStatistics(webhookId: string, userId: string) {
    // Verify webhook belongs to user
    const webhook = await this.prisma.webhook.findFirst({
      where: { id: webhookId, userId },
    });

    if (!webhook) {
      throw new NotFoundException('Webhook not found');
    }

    const statistics = await this.prisma.webhookStatistic.findUnique({
      where: { webhookId },
    });

    const defaultStats = {
      webhookId,
      totalRequests: 0,
      lastRequestAt: null,
      methodsCount: {},
    };

    if (!statistics) {
      return defaultStats;
    }

    // Convert BigInt to string for JSON serialization
    return {
      ...statistics,
      totalRequests: statistics.totalRequests ? statistics.totalRequests.toString() : '0',
    };
  }
}
import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { WebhookRequestsService } from './webhook-requests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QueryRequestsDto } from './dto/query-requests.dto';
import { WebhookRequestResponseDto } from './dto/webhook-request-response.dto';
import { ApiResponseDto } from '../shared/dto/api-response.dto';

@Controller('api/v1/webhooks/:webhookId/requests')
@UseGuards(JwtAuthGuard)
export class WebhookRequestsController {
  constructor(
    private readonly webhookRequestsService: WebhookRequestsService,
  ) {}

  @Get()
  findAll(
    @Request() req,
    @Param('webhookId') webhookId: string,
    @Query() queryDto: QueryRequestsDto,
  ) {
    return this.webhookRequestsService.findAll(
      webhookId,
      req.user.userId,
      queryDto,
    );
  }

  @Get('statistics')
  getStatistics(@Request() req, @Param('webhookId') webhookId: string) {
    return this.webhookRequestsService.getStatistics(
      webhookId,
      req.user.userId,
    );
  }

  @Get(':id')
  findOne(
    @Request() req,
    @Param('webhookId') webhookId: string,
    @Param('id') id: string,
  ) {
    return this.webhookRequestsService.findOne(id, webhookId, req.user.userId);
  }

  @Delete()
  removeAll(@Request() req, @Param('webhookId') webhookId: string) {
    return this.webhookRequestsService.removeAll(webhookId, req.user.userId);
  }
}
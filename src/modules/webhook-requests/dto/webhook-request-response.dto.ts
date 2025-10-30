import { ApiProperty } from '@nestjs/swagger';

export class WebhookRequestResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  webhookId: string;

  @ApiProperty()
  method: string;

  @ApiProperty()
  path: string;

  @ApiProperty({ required: false })
  queryParams?: any;

  @ApiProperty({ required: false })
  headers?: any;

  @ApiProperty({ required: false })
  body?: string;

  @ApiProperty()
  bodySize: string;

  @ApiProperty()
  ipAddress: string;

  @ApiProperty({ required: false })
  userAgent?: string;

  @ApiProperty()
  receivedAt: Date;

  @ApiProperty()
  processingTimeMs: number;
}
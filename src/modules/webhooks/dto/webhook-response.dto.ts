import { ApiProperty } from '@nestjs/swagger';

export class WebhookResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  url: string;

  @ApiProperty({ required: false })
  statistics?: {
    id: string;
    webhookId: string;
    totalRequests: string;
    lastRequestAt?: Date;
    methodsCount: Record<string, number>;
  };

  @ApiProperty({ required: false })
  _count?: {
    requests: number;
  };
}
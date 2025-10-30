export class WebhookRequestResponseDto {
  id: string;

  webhookId: string;

  method: string;

  path: string;

  queryParams?: any;

  headers?: any;

  body?: string;

  bodySize: string;

  ipAddress: string;

  userAgent?: string;

  receivedAt: Date;

  processingTimeMs: number;
}

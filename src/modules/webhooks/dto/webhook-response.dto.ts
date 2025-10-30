export class WebhookResponseDto {
  id: string;

  token: string;

  name: string;

  description?: string;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;

  url: string;

  statistics?: {
    id: string;
    webhookId: string;
    totalRequests: string;
    lastRequestAt?: Date;
    methodsCount: Record<string, number>;
  };

  _count?: {
    requests: number;
  };
}

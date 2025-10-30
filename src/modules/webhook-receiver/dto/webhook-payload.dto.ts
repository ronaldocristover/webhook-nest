import { IsString, IsObject, IsOptional } from 'class-validator';

export class WebhookPayloadDto {
  @IsString()
  method: string;

  @IsString()
  path: string;

  @IsObject()
  @IsOptional()
  query?: any;

  @IsObject()
  @IsOptional()
  headers?: any;

  @IsOptional()
  body?: any;

  @IsString()
  @IsOptional()
  ip?: string;
}
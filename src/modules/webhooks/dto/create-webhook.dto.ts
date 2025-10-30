import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateWebhookDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;
}
import { IsString, IsOptional, MaxLength, IsBoolean } from 'class-validator';

export class UpdateWebhookDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
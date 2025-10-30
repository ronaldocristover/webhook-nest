import { Module } from '@nestjs/common';
import { BannerService } from './banners.service';
import { BannersController } from './banners.controller';
import { BannerRepository } from './banners.repository';

@Module({
  controllers: [BannersController],
  providers: [BannerService, BannerRepository],
})
export class BannersModule {}

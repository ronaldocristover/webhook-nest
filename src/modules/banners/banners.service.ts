import { BannerRepository } from './banners.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BannerService {
  private DEFAULT_ID = 1;

  constructor(private readonly bannerRepository: BannerRepository) {}

  async findOne(): Promise<any> {
    const banner = await this.bannerRepository.findOne(this.DEFAULT_ID);
    return {
      success: true,
      content: banner,
    };
  }

  async update(data): Promise<void> {
    await this.bannerRepository.update(this.DEFAULT_ID, data);
  }
}

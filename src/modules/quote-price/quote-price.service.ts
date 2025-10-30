import { QuotePriceRepository } from './quote-price.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuotePriceService {
  private DEFAULT_ID = 1;

  constructor(
    private readonly quotePriceRepository: QuotePriceRepository,
  ) {}

  async findOne(): Promise<any> {
    const quotePrice = await this.quotePriceRepository.findOne(this.DEFAULT_ID);
    return {
      success: true,
      content: quotePrice,
    };
  }

  async update(data): Promise<void> {
    await this.quotePriceRepository.update(this.DEFAULT_ID, data);
  }
}
import { Body, Controller, Get, Put } from '@nestjs/common';
import { QuotePriceService } from './quote-price.service';

@Controller('quote-price')
export class QuotePriceController {
  constructor(private readonly quotePriceService: QuotePriceService) {}

  @Get()
  async findOne(): Promise<any> {
    return this.quotePriceService.findOne();
  }

  @Put('')
  async update(@Body() data): Promise<void> {
    await this.quotePriceService.update(data);
  }
}

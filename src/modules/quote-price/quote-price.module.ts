import { Module } from '@nestjs/common';
import { QuotePriceService } from './quote-price.service';
import { QuotePriceController } from './quote-price.controller';
import { QuotePriceRepository } from './quote-price.repository';

@Module({
  controllers: [QuotePriceController],
  providers: [QuotePriceService, QuotePriceRepository],
})
export class QuotePriceModule {}
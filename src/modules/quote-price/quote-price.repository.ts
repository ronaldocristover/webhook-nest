import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { QuotePrice } from '@prisma/client';

@Injectable()
export class QuotePriceRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(id: number): Promise<QuotePrice | null> {
    return this.prismaService.quotePrice.findUnique({ where: { id } });
  }

  async update(id: number, data): Promise<QuotePrice> {
    return this.prismaService.quotePrice.update({ where: { id }, data });
  }
}
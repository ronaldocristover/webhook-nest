import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { Banner } from '@prisma/client';

@Injectable()
export class BannerRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(id: number): Promise<Banner | null> {
    return this.prismaService.banner.findUnique({ where: { id } });
  }

  async update(id: number, data): Promise<Banner> {
    return this.prismaService.banner.update({ where: { id }, data });
  }
}

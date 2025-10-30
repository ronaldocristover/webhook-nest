import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { AboutCompany } from '@prisma/client';

@Injectable()
export class AboutCompanyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(id: number): Promise<AboutCompany | null> {
    return this.prismaService.aboutCompany.findUnique({ where: { id } });
  }

  async update(id: number, data): Promise<AboutCompany> {
    return this.prismaService.aboutCompany.update({ where: { id }, data });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { ContactUs } from '@prisma/client';

@Injectable()
export class ContactUsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(id: number): Promise<ContactUs | null> {
    return this.prismaService.contactUs.findUnique({ where: { id } });
  }

  async update(id: number, data: any): Promise<ContactUs> {
    return this.prismaService.contactUs.update({ where: { id }, data });
  }
}

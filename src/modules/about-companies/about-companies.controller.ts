import { Controller, Get, Put } from '@nestjs/common';
import { AboutCompanyService } from './about-companies.service';

@Controller('about-companies')
export class AboutCompaniesController {
  constructor(private readonly aboutCompanyService: AboutCompanyService) {}

  @Get()
  async findOne(): Promise<any> {
    return this.aboutCompanyService.findOne();
  }

  @Put('')
  async update(data): Promise<void> {
    await this.aboutCompanyService.update(data);
  }
}

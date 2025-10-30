import { Module } from '@nestjs/common';
import { AboutCompanyService } from './about-companies.service';
import { AboutCompaniesController } from './about-companies.controller';
import { AboutCompanyRepository } from './about-companies.repository';

@Module({
  controllers: [AboutCompaniesController],
  providers: [AboutCompanyService, AboutCompanyRepository],
})
export class AboutCompaniesModule {}

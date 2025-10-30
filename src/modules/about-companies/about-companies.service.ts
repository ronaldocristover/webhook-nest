import { AboutCompanyRepository } from './about-companies.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AboutCompanyService {
  private DEFAULT_ID = 1;

  constructor(
    private readonly AboutCompanyRepository: AboutCompanyRepository,
  ) {}

  async findOne(): Promise<any> {
    const company = await this.AboutCompanyRepository.findOne(this.DEFAULT_ID);
    return {
      success: true,
      content: company,
    };
  }

  async update(data): Promise<void> {
    await this.AboutCompanyRepository.update(this.DEFAULT_ID, data);
  }
}

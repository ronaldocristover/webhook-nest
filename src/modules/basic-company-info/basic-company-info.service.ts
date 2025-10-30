import { BasicCompanyInfoRepository } from './basic-company-info.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BasicCompanyInfoService {
  private DEFAULT_ID = 1;

  constructor(
    private readonly basicCompanyInfoRepository: BasicCompanyInfoRepository,
  ) {}

  async findOne(): Promise<any> {
    const companyInfo = await this.basicCompanyInfoRepository.findOne(
      this.DEFAULT_ID,
    );
    return {
      success: true,
      content: companyInfo,
    };
  }

  async update(data): Promise<void> {
    await this.basicCompanyInfoRepository.update(this.DEFAULT_ID, data);
  }
}

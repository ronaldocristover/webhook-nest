import { Module } from '@nestjs/common';
import { BasicCompanyInfoService } from './basic-company-info.service';
import { BasicCompanyInfoController } from './basic-company-info.controller';
import { BasicCompanyInfoRepository } from './basic-company-info.repository';

@Module({
  controllers: [BasicCompanyInfoController],
  providers: [BasicCompanyInfoService, BasicCompanyInfoRepository],
})
export class BasicCompanyInfoModule {}
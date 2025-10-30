import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { CustomLoggerModule } from './modules/shared/custom-logger/custom-logger.module';
import { PrismaModule } from './modules/shared/prisma/prisma.module';

import { AboutCompaniesModule } from './modules/about-companies/about-companies.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BannersModule } from './modules/banners/banners.module';
import { ContactUsModule } from './modules/contact-us/contact-us.module';
import { BasicCompanyInfoModule } from './modules/basic-company-info/basic-company-info.module';
import { UploadModule } from './modules/upload/upload.module';
import { QuotePriceModule } from './modules/quote-price/quote-price.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CustomLoggerModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    AboutCompaniesModule,
    BannersModule,
    ContactUsModule,
    BasicCompanyInfoModule,
    UploadModule,
    QuotePriceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

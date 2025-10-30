import { Module } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { ContactUsController } from './contact-us.controller';
import { ContactUsRepository } from './contact-us.repository';

@Module({
  controllers: [ContactUsController],
  providers: [ContactUsService, ContactUsRepository],
})
export class ContactUsModule {}

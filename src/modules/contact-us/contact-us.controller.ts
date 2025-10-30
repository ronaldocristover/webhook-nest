import { Controller, Get, Put, Body } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';

@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  @Get()
  async findOne(): Promise<any> {
    return this.contactUsService.findOne();
  }

  @Put('')
  async update(@Body() data: any): Promise<void> {
    await this.contactUsService.update(data);
  }
}

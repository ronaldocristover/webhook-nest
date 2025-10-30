import { ContactUsRepository } from './contact-us.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ContactUsService {
  private DEFAULT_ID = 1;

  constructor(private readonly contactUsRepository: ContactUsRepository) {}

  async findOne(): Promise<any> {
    const contactUs = await this.contactUsRepository.findOne(this.DEFAULT_ID);
    return {
      success: true,
      data: contactUs,
    };
  }

  async update(data: any): Promise<void> {
    await this.contactUsRepository.update(this.DEFAULT_ID, data);
  }
}

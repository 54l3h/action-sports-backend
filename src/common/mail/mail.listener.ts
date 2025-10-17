import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { Events } from './utils';

@Injectable()
export class MailListener {
  constructor(private readonly mailerService: MailerService) {
    Events.on('sendEmail', async (payload) => {
      const { to, subject, otp, name } = payload;
      try {
        await this.mailerService.sendOtpEmail(to, name, otp, subject);
      } catch (error) {
        throw new BadRequestException(
          'An error occured while sending an otp email',
        );
      }
    });
  }
}

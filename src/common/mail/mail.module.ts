import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailListener } from './mail.listener';

@Module({
  providers: [MailerService, MailListener],
  exports: [MailerService],
})
export class MailModule {}

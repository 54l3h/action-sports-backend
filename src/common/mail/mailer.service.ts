import { BadRequestException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';
import { SentMessageInfo, Options } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter<SentMessageInfo, Options>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  private getOtpTemplate(name: string, otp: string): string {
    const possiblePaths = [
      path.join(process.cwd(), 'src/common/mail/templates/otp.html'),
      path.join(process.cwd(), 'dist/common/mail/templates/otp.html'),
      path.join(__dirname, 'templates/otp.html'),
      path.join(__dirname, '../templates/otp.html'),
      path.join(__dirname, '../../templates/otp.html'),
    ];
    const filePath = possiblePaths.find((p) => fs.existsSync(p));

    if (!filePath) {
      throw new Error('OTP template file not found.');
    }

    let html = fs.readFileSync(filePath, 'utf8');

    // Replace placeholders
    html = html.replace(/{{name}}/g, name);
    html = html.replace(/{{otp}}/g, otp);

    return html;
  }

  async sendOtpEmail(to: string, name: string, otp: string, subject?: string) {
    const possibleLogoPaths = [
      path.join(process.cwd(), 'src/common/mail/assets/ActionSports.jpeg'),
      path.join(process.cwd(), 'dist/common/mail/assets/ActionSports.jpeg'),
      path.join(__dirname, 'assets/ActionSports.jpeg'),
    ];

    const logoPath = possibleLogoPaths.find((p) => fs.existsSync(p));

    const html = this.getOtpTemplate(name, otp);

    const attachments = logoPath
      ? [
          {
            filename: 'logo.png',
            path: logoPath,
            cid: 'logo',
          },
        ]
      : [];

    try {
      const info = await this.transporter.sendMail({
        from: `"Action Sports" <${process.env.MAIL_USER}>`,
        to,
        subject: subject || 'Your OTP Code',
        html,
        attachments,
      });

      return info;
    } catch (error) {
      throw new BadRequestException('An error occured while sending the email');
    }
  }
}

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'localhost',
    port: Number(process.env.SMTP_PORT ?? 1025),
    secure: false,
  });

  async sendPasswordReset(email: string, token: string) {
    await this.transporter.sendMail({
      to: email,
      from: process.env.MAIL_FROM ?? 'support@bluepeakcapital.com',
      subject: 'Reset your BluePeak Capital password',
      text: `Use this reset token: ${token}`,
    });
  }
}

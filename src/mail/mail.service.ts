import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendDynamicEmail(
    to: string,
    subject: string,
    content: string,
    template?: string,
    context?: Record<string, any>,
    attachments?: any[] // Novo parâmetro para anexos
  ) {
    const mailOptions: any = {
      to,
      subject,
    };
    // Adicione anexos se existirem
    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments;
    }


    if (template) {
      mailOptions.template = template;
      mailOptions.context = context;
    } else {
      mailOptions.html = content;
    }

    try {
      await this.mailerService.sendMail(mailOptions);
      return { success: true, message: 'Email enviado' };
    } catch (error) {
      throw new Error(`Falha no envio: ${error.message}`);
    }
  }

  async sendActivationEmail(
    email: string,
    name: string,
    otp: string
  ) {
    const logoPath = join(__dirname, 'templates', 'assets', 'logo.png');
    await this.sendDynamicEmail(
      email,
      'Ative sua conta',
      '',
      'activation',
      {
        name,
        otp,
        currentYear: new Date().getFullYear(),
        appName: 'SESMT',
        supportEmail: 'sesmt@treslagoas.ms.gov.br'
      },
      [{
        filename: 'logoBranca.png',
        path: logoPath,
        cid: 'logo' // Deve corresponder ao cid:logo no template
      }]
    );
  }
}
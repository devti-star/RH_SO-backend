// mail.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendDynamicEmail(
    to: string,
    subject: string,
    content: string,
    template?: string,
    context?: Record<string, any>
  ) {
    const mailOptions: any = {
      to,
      subject,
    };

    // Usa template se fornecido, senão usa conteúdo direto
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
}
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
    activationToken: string
  ) {
    const activationLink = `${process.env.APP_URL}/auth/activate?token=${activationToken}`;

    await this.sendDynamicEmail(
      email,
      'Ative sua conta',
      '',
      'activation',
      {
        name,
        activationLink
      }
    );
  }
}
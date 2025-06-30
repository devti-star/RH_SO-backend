import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail.service';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.treslagoas.ms.gov.br', // Ex: smtp.gmail.com
        port: 587,
        secure: false, // true para 465
        auth: {
          user: 'dev.ti@treslagoas.ms.gov.br',
          pass: 'Dev-ti@2025.DTI',
        },
      },
      defaults: {
        from: '"No Reply" <dev.ti@treslagoas.ms.gov.br>',
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
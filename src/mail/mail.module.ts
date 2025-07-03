import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'smtp.treslagoas.ms.gov.br',
          port: 587,
          secure: false,
          auth: {
            user: "dev.ti@treslagoas.ms.gov.br",
            pass: 'Dev-ti@2025.DTI',
          },
          // Adicione estas opções:
          tls: {
            rejectUnauthorized: false // Ignora erros de certificado
          },
          logger: false, // Para ver logs detalhados
          debug: false // Ativa modo debug
        },
        defaults: {
          from: '"No Reply" <dev.ti@treslagoas.ms.gov.br>',
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
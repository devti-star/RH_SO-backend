import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';
import { AppModule } from './app.module';
import { MailModule } from './mail/mail.module'; // Importe o MailModule
import { MailService } from './mail/mail.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Servir arquivos estáticos da pasta ImagemPerfil
  app.use('/ImagemPerfil', express.static(join(__dirname, '..', 'ImagemPerfil')));
  
  // Obtenha a instância do MailService
  const mailService = app.select(MailModule).get(MailService);
  
  // Teste o envio de email
  
  await mailService.sendDynamicEmail(
    'viniciusbarbosaribeiro12@gmail.com', // Use um email real aqui
    'Teste SMTP - Funcionou!',
    '<h1>Sucesso!</h1><p>Este é um teste de configuração SMTP</p>'
  );
  

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

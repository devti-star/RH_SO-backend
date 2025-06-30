import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MailModule } from './mail/mail.module'; // Importe o MailModule
import { MailService } from './mail/mail.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Obtenha a instância do MailService
  const mailService = app.select(MailModule).get(MailService);
  
  // Teste o envio de email
  await mailService.sendDynamicEmail(
    'teste@email.com', // Use um email real aqui
    'Teste SMTP - Funcionou!',
    '<h1>Sucesso!</h1><p>Este é um teste de configuração SMTP</p>'
  );
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
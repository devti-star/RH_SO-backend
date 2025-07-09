import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MailModule } from './mail/mail.module'; // Importe o MailModule
import { MailService } from './mail/mail.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // <--- ESSENCIAL!
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

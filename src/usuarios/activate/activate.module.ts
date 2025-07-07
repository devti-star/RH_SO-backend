// activate.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { ActivationController } from './activate.controller';
import { ActivateService } from './activate.service';
import { SharedModule } from '../../shared/services/shared.module'; // Importe o SharedModule
import { UsuariosService } from '../usuarios.service';
import { UsuariosModule } from '../usuarios.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [SharedModule, forwardRef (() => UsuariosModule), MailModule], // Adicione aqui
  controllers: [ActivationController, ],
  providers: [ActivateService],
  exports: [ActivateService]
})
export class ActivateModule {}
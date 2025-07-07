// activate.module.ts
import { Module } from '@nestjs/common';
import { ActivationController } from './activate.controller';
import { ActivateService } from './activate.service';
import { SharedModule } from '../../shared/services/shared.module'; // Importe o SharedModule
import { UsuariosService } from '../usuarios.service';

@Module({
  imports: [SharedModule], // Adicione aqui
  controllers: [ActivationController],
  providers: [ActivateService, UsuariosService],
})
export class ActivateModule {}
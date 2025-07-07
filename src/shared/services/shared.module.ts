// shared.module.ts
import { Module } from '@nestjs/common';
import { CachedService } from './cached.service';
import { CacheModule } from '@nestjs/cache-manager';
import { OtpGenerateService } from './otp-generate.service';

@Module({
  imports: [CacheModule.register()], // Configuração do cache
  providers: [CachedService, OtpGenerateService],
  exports: [CachedService, OtpGenerateService], // Exporte o serviço!
})
export class SharedModule {}
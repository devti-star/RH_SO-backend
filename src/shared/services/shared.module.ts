// shared.module.ts
import { Module } from '@nestjs/common';
import { CachedService } from './cached.service';
import { CacheModule } from '@nestjs/cache-manager';
import { TokenGenerateService } from './token-generate.service';

@Module({
  imports: [CacheModule.register()], // Configuração do cache
  providers: [CachedService, TokenGenerateService],
  exports: [CachedService, TokenGenerateService], // Exporte o serviço!
})
export class SharedModule {}
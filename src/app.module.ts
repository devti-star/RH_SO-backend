import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsuariosModule } from "./usuarios/usuarios.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { RequerimentosModule } from "./requerimentos/requerimentos.module";
import { HistoricosModule } from "./historicos/historicos.module";
import { RGModule } from "./rg/rg.module";
import { MailModule } from "./mail/mail.module";
import { AuthModule } from "./auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { CacheModule } from '@nestjs/cache-manager';
import { ActivationController } from './usuarios/activate/activate.controller';
import { ActivateModule } from "./usuarios/activate/activate.module";
import { SharedModule } from "./shared/services/shared.module";
import { ActivateService } from "./usuarios/activate/activate.service";
import { DocumentosModule } from './documentos/documentos.module';
import { DefaultIdGuard } from "./auth/guards/check-id-default-user.guard";
import { RelatorioAtestado } from "./relatorio-atestado/entities/relatorio-atestado.viewentity";
import { RelatorioAtestadoModule } from "./relatorio-atestado/module/relatorio-atestado.module";
import { IsUserActivated } from "./auth/guards/is-user-activated.guard";



@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env"],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
      autoLoadEntities: true,
      synchronize: true,
    }),
    CacheModule.register({
      ttl: 54000000
    }),
    UsuariosModule,
    MailModule,
    RequerimentosModule,
    HistoricosModule,
    RGModule,
    AuthModule,
    RelatorioAtestadoModule,
    SharedModule, // Módulo compartilhado
    ActivateModule, // Módulo do controller
    DocumentosModule,
  ],

  controllers: [AppController, ActivationController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide : APP_GUARD, useClass: IsUserActivated},
   // { provide: APP_GUARD, useClass: DefaultIdGuard },

  ],
})
export class AppModule {}


console.log("JWT_SECRET:", process.env.JWT_SECRET);

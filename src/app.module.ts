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
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { ActivationController } from './usuarios/activation.controller';
import { DocumentosModule } from './documentos/documentos.module';


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
    UsuariosModule,
    MailModule,
    RequerimentosModule,
    HistoricosModule,
    RGModule,
    AuthModule,
    DocumentosModule,
  ],

  controllers: [AppController, ActivationController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}

console.log("JWT_SECRET:", process.env.JWT_SECRET);
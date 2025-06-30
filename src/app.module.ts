import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsuariosModule } from "./usuarios/usuarios.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { MailModule } from './mail/mail.module';
import { RequerimentosModule } from './requerimentos/requerimentos.module';
import { HistoricosModule } from './historicos/historicos.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env"],
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

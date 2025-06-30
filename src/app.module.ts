import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsuariosModule } from "./usuarios/usuarios.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { RequerimentosModule } from "./requerimentos/requerimentos.module";
import { DocumentosModule } from "./documentos/documentos.module";
import { AtestadosModule } from "./atestados/atestados.module";
import { HistoricosModule } from "./historicos/historicos.module";
import { RGModule } from "./rg/rg.module";

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
    RequerimentosModule,
    DocumentosModule,
    AtestadosModule,
    HistoricosModule,
    RGModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { TypeOrmModule } from "@nestjs/typeorm";
import { RG } from "./entities/rg.entity";
import { Module } from "@nestjs/common";
import { RgService } from "./rg.service";

@Module({
  controllers: [],
  providers: [RgService],
  imports: [TypeOrmModule.forFeature([RG])],
})
export class RGModule {}

// src/usuarios/dto/update-usuario.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  nomeCompleto?: string;

  @IsOptional()
  @IsString()
  departamento?: string;

  @IsOptional()
  @IsString()
  secretaria?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsString()
  cargo?: string;

  @IsOptional()
  @IsString()
  senha?: string;

  @IsOptional()
  @IsString()
  foto?: string;
  
  @IsOptional()
  @IsString()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  activatedAt?: Date;
}

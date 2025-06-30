import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsNumberString,
  Length,
} from 'class-validator';
import { Role } from '../../enums/role.enum';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 128)
  nomeCompleto: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(5, 100)
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(11, 14)
  cpf: string;

  @IsOptional()
  @IsString()
  @Length(5, 25)
  rg?: string;

  @IsOptional()
  @IsString()
  @Length(5, 25)
  crm?: string;

  @IsOptional()
  @IsString()
  @Length(5, 25)
  cre?: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 25)
  matricula: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  departamento: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  secretaria: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 25)
  telefone: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  cargo: string;

  @IsNotEmpty()
  @IsString()
  senha: string;

  @IsOptional()
  @IsString()
  foto?: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}

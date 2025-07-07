export class UsuarioResponseDto {
  id?: number;
  nomeCompleto: string;
  email: string;
  cpf?: string;
  matricula?: string;
  departamento?: string;
  secretaria?: string;
  telefone?: string;
  cargo?: string;
  foto?: string;
  role?: number; // Ou 'Role' se quiser importar o enum

  // Dados do RG (quando existirem)
  rgNumero?: string;
  rgOrgaoExpeditor?: string;

  // Campos exclusivos para médico
  crm?: string;

  // Campos exclusivos para enfermeiro
  cre?: string;
}

import { Role } from "src/enums/role.enum";


export interface UserPayload {
    sub: number;
    email: string;
    nome: string;
    role: Role;
    iat?: number;
    exp?: number;
}
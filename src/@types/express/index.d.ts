import { Usuario } from "src/usuarios/entities/usuario.entity";

declare global {
  namespace Express {
    interface User extends Usuario {} // ou defina manualmente os campos que você quer
  }
}
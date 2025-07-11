import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "src/enums/role.enum";
import { ROLES_KEY } from "src/shared/decorators/roles.decorator";
import { Usuario } from "src/usuarios/entities/usuario.entity";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest(); // Curiosidade: JwtAuthGuard implementa AuthGuard("jwt"), colocando o usuário no request automaticamente

    if (!user) return false;

    return requiredRoles.includes(user.role);
  }
}

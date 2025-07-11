import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Role } from "src/enums/role.enum";
import { IS_PUBLIC_KEY } from "src/shared/decorators/is-public.decorator";
import { Roles } from "src/shared/decorators/roles.decorator";
import { UsuarioUnauthenticate } from "src/shared/exceptions/unauthenticate-user.exception";
import { UsuarioNotFoundException } from "src/shared/exceptions/usuario-not-found.exception";
import { Usuario } from "src/usuarios/entities/usuario.entity";

@Injectable()
export class DefaultIdGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const id_petitioner_body = request.body
      ? Number(request.body.idUsuario)
      : undefined;
    const id_petitioner_params = request.params
      ? Number(request.params.idUsuario)
      : undefined;
    const user = request.user;

    // A rota é pública, não é necessário verificar roles
    if (isPublic) return true;

    // Não há usuário no sistema. Não é nem para chegar aqui, mas vai que, né?
    if (!user) throw new UsuarioUnauthenticate();

    // A rota não possui id nem como parâmetro nem no body da requisição, logo, a verificação não se faz necessária
    if (!id_petitioner_body && !id_petitioner_params) return true; // CHECK

    // O usuário não é do tipo padrão, logo, pode acessar informações que pertencem a outros
    if (user.role !== Role.PADRAO) return true;

    // O usuário é padrão e tentou acessar dados que não lhe pertencem. Safado, achou que podia burlar o front
    if (user.id !== id_petitioner_body && user.id !== id_petitioner_params)
      throw new UnauthorizedException();

    return true;
  }
}

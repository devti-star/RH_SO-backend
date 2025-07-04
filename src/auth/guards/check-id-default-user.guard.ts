import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Role } from "src/enums/role.enum";
import { Roles } from "src/shared/decorators/roles.decorator";
import { Usuario } from "src/usuarios/entities/usuario.entity";

@Injectable()
export class DefaultIdGuard implements CanActivate{
    constructor(private readonly reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean {
        const request: Request = context.switchToHttp().getRequest();

        const id_petitioner = Number(request.params.id);
        const user = request.user;

        // Não há usuário no sistema. Não é nem para chegar aqui, mas vai que, né?
        if (!user) return false; 

        // O usuário não é do tipo padrão, logo, pode acessar informações que pertencem a outros
        if (user.role !== Role.PADRAO) return true; 

        // O usuário é padrão e tentou acessar dados que não lhe pertencem. Safado, achou que podia burlar o front
        if (user.id !== id_petitioner) throw new UnauthorizedException();

        return true;
    }
}
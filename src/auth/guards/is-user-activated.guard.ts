import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Observable } from "rxjs";
import { IS_PUBLIC_KEY } from "src/shared/decorators/is-public.decorator";
import { DisableUser } from "src/shared/exceptions/disable-suer.exception";
import { UsuarioUnauthenticate } from "src/shared/exceptions/unauthenticate-user.exception";

@Injectable()
export class IsUserActivated implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request: Request = context.switchToHttp().getRequest();

    const user = request.user;

    if (user === undefined) throw new UsuarioUnauthenticate();
    
    if (!user.isActive) throw new DisableUser();

    return true;
  }
}

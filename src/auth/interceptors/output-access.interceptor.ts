import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Role } from "src/enums/role.enum";
import { UnauthorizedResource } from "src/shared/exceptions/unauthorized-resource.exception";
import { Usuario } from "src/usuarios/entities/usuario.entity";

@Injectable()
export class OutputAccessInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user: Usuario = request.user;

    return next.handle().pipe(
      map((data: any) => {
        if (
          data?.usuario &&
          data.usuario.id !== user.id &&
          user.role === Role.PADRAO
        ) {
          throw new UnauthorizedResource();
        }

        return data;
      })
    );
  }
}

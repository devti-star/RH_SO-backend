import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
  canActivate(context: ExecutionContext) {
    console.log("🔥 LocalAuthGuard canActivate");
    return super.canActivate(context);
  }
}

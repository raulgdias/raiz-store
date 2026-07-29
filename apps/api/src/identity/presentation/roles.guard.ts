import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { UserRole } from "@raizstore/contracts";
import { DomainError } from "../../shared/domain/domain.error";
import type { AuthenticatedRequest } from "./auth-user";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) return true;

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!roles.includes(request.user.role)) {
      throw new DomainError(
        "Você não tem permissão para esta ação.",
        "FORBIDDEN",
      );
    }
    return true;
  }
}

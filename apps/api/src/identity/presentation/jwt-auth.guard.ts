import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { TokenVerifier } from "../application/auth.ports";
import { DomainError } from "../../shared/domain/domain.error";
import { TOKEN_VERIFIER } from "../../shared/infrastructure/tokens";
import type { AuthenticatedRequest } from "./auth-user";
import { IS_PUBLIC_KEY } from "./public.decorator";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(TOKEN_VERIFIER) private readonly tokens: TokenVerifier,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ])
    ) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const [scheme, token] = request.headers.authorization?.split(" ") ?? [];
    if (scheme !== "Bearer" || !token) {
      throw new DomainError("Autenticação necessária.", "UNAUTHORIZED");
    }
    try {
      request.user = await this.tokens.verify(token);
      return true;
    } catch {
      throw new DomainError("Sessão inválida ou expirada.", "UNAUTHORIZED");
    }
  }
}

import type { TokenPayload } from "../application/auth.ports";

export interface AuthenticatedRequest {
  headers: { authorization?: string };
  user: TokenPayload;
}

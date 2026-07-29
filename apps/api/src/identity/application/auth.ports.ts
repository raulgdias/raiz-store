import type { UserRole } from "@raizstore/contracts";

export interface PasswordHasher {
  compare(value: string, hash: string): Promise<boolean>;
}

export interface TokenPayload {
  sub: string;
  username: string;
  role: UserRole;
}

export interface TokenIssuer {
  issue(payload: TokenPayload): Promise<string>;
}

export interface TokenVerifier {
  verify(token: string): Promise<TokenPayload>;
}

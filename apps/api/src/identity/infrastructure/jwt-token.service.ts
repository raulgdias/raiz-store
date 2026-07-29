import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type {
  TokenIssuer,
  TokenPayload,
  TokenVerifier,
} from "../application/auth.ports";

@Injectable()
export class JwtTokenService implements TokenIssuer, TokenVerifier {
  constructor(private readonly jwt: JwtService) {}

  issue(payload: TokenPayload): Promise<string> {
    return this.jwt.signAsync(payload);
  }

  verify(token: string): Promise<TokenPayload> {
    return this.jwt.verifyAsync<TokenPayload>(token);
  }
}

import type { AuthResponse } from "@raizstore/contracts";
import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import type { UserRepository } from "../domain/user.repository";
import { DomainError } from "../../shared/domain/domain.error";
import {
  PASSWORD_HASHER,
  TOKEN_ISSUER,
  USER_REPOSITORY,
} from "../../shared/infrastructure/tokens";
import type { PasswordHasher, TokenIssuer } from "./auth.ports";
import { LoginCommand } from "./login.command";

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<
  LoginCommand,
  AuthResponse
> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(PASSWORD_HASHER) private readonly passwordHasher: PasswordHasher,
    @Inject(TOKEN_ISSUER) private readonly tokens: TokenIssuer,
  ) {}

  async execute(command: LoginCommand): Promise<AuthResponse> {
    const user = await this.users.findByUsername(
      command.username.trim().toLowerCase(),
    );
    if (
      !user ||
      !(await this.passwordHasher.compare(command.password, user.passwordHash))
    ) {
      throw new DomainError("Usuário ou senha inválidos.", "UNAUTHORIZED");
    }

    const accessToken = await this.tokens.issue({
      sub: user.id,
      username: user.username,
      role: user.role,
    });

    return {
      accessToken,
      user: { id: user.id, username: user.username, role: user.role },
    };
  }
}

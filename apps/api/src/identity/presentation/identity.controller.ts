import type { AuthResponse } from "@raizstore/contracts";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LoginCommand } from "../application/login.command";
import { LoginDto } from "./login.dto";

@ApiTags("Autenticação")
@Controller("auth")
export class IdentityController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Entrar com usuário e senha" })
  @ApiOkResponse({ description: "Token e usuário autenticado." })
  login(@Body() body: LoginDto): Promise<AuthResponse> {
    return this.commandBus.execute<LoginCommand, AuthResponse>(
      new LoginCommand(body.username, body.password),
    );
  }
}

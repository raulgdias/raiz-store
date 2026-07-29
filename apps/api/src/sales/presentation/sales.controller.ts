import type { OrderDto } from "@raizstore/contracts";
import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../../identity/presentation/jwt-auth.guard";
import type { AuthenticatedRequest } from "../../identity/presentation/auth-user";
import {
  CheckoutCommand,
  ListMyOrdersQuery,
} from "../application/sales.messages";
import { CheckoutDto } from "./checkout.dto";

@ApiTags("Pedidos")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("orders")
export class SalesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post("checkout")
  @ApiOperation({ summary: "Finalizar compra" })
  @ApiCreatedResponse()
  checkout(
    @Req() request: AuthenticatedRequest,
    @Body() body: CheckoutDto,
  ): Promise<OrderDto> {
    return this.commandBus.execute<CheckoutCommand, OrderDto>(
      new CheckoutCommand(request.user.sub, body.items),
    );
  }

  @Get("mine")
  @ApiOperation({ summary: "Listar meus pedidos" })
  @ApiOkResponse()
  listMine(@Req() request: AuthenticatedRequest): Promise<OrderDto[]> {
    return this.queryBus.execute<ListMyOrdersQuery, OrderDto[]>(
      new ListMyOrdersQuery(request.user.sub),
    );
  }
}

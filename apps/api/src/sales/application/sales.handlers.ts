import type { OrderDto } from "@raizstore/contracts";
import { Inject } from "@nestjs/common";
import {
  CommandHandler,
  ICommandHandler,
  IQueryHandler,
  QueryHandler,
} from "@nestjs/cqrs";
import { ORDER_REPOSITORY } from "../../shared/infrastructure/tokens";
import type { OrderRepository } from "../domain/order.repository";
import { CheckoutCommand, ListMyOrdersQuery } from "./sales.messages";

@CommandHandler(CheckoutCommand)
export class CheckoutHandler implements ICommandHandler<
  CheckoutCommand,
  OrderDto
> {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
  ) {}

  execute(command: CheckoutCommand): Promise<OrderDto> {
    return this.orders.checkout(command.userId, command.items);
  }
}

@QueryHandler(ListMyOrdersQuery)
export class ListMyOrdersHandler implements IQueryHandler<
  ListMyOrdersQuery,
  OrderDto[]
> {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orders: OrderRepository,
  ) {}

  execute(query: ListMyOrdersQuery): Promise<OrderDto[]> {
    return this.orders.listByUser(query.userId);
  }
}

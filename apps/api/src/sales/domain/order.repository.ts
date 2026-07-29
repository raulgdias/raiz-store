import type { CheckoutItemRequest, OrderDto } from "@raizstore/contracts";

export interface OrderRepository {
  checkout(userId: string, items: CheckoutItemRequest[]): Promise<OrderDto>;
  listByUser(userId: string): Promise<OrderDto[]>;
}

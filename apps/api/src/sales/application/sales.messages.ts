import type { CheckoutItemRequest } from "@raizstore/contracts";

export class CheckoutCommand {
  constructor(
    public readonly userId: string,
    public readonly items: CheckoutItemRequest[],
  ) {}
}

export class ListMyOrdersQuery {
  constructor(public readonly userId: string) {}
}

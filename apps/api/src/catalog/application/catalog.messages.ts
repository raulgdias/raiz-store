import type {
  CreateProductRequest,
  CreatePromotionRequest,
  ProductFilters,
} from "@raizstore/contracts";

export class ListCategoriesQuery {}

export class ListProductsQuery {
  constructor(public readonly filters: ProductFilters) {}
}

export class CreateCategoryCommand {
  constructor(public readonly name: string) {}
}

export class CreateProductCommand {
  constructor(public readonly input: CreateProductRequest) {}
}

export class UpdateProductPriceCommand {
  constructor(
    public readonly productId: string,
    public readonly priceInCents: number,
  ) {}
}

export class CreatePromotionCommand {
  constructor(public readonly input: CreatePromotionRequest) {}
}

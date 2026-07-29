import type {
  CategoryDto,
  ProductDto,
  PromotionDto,
} from "@raizstore/contracts";
import { Inject } from "@nestjs/common";
import {
  CommandHandler,
  ICommandHandler,
  IQueryHandler,
  QueryHandler,
} from "@nestjs/cqrs";
import { CATALOG_REPOSITORY } from "../../shared/infrastructure/tokens";
import { DomainError } from "../../shared/domain/domain.error";
import { Money } from "../../shared/domain/money";
import { Product } from "../domain/product";
import type { CatalogRepository } from "../domain/catalog.repository";
import {
  CreateCategoryCommand,
  CreateProductCommand,
  CreatePromotionCommand,
  ListCategoriesQuery,
  ListProductsQuery,
  UpdateProductPriceCommand,
} from "./catalog.messages";

const slugify = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

@QueryHandler(ListCategoriesQuery)
export class ListCategoriesHandler implements IQueryHandler<
  ListCategoriesQuery,
  CategoryDto[]
> {
  constructor(
    @Inject(CATALOG_REPOSITORY) private readonly catalog: CatalogRepository,
  ) {}
  execute(): Promise<CategoryDto[]> {
    return this.catalog.listCategories();
  }
}

@QueryHandler(ListProductsQuery)
export class ListProductsHandler implements IQueryHandler<
  ListProductsQuery,
  ProductDto[]
> {
  constructor(
    @Inject(CATALOG_REPOSITORY) private readonly catalog: CatalogRepository,
  ) {}
  execute(query: ListProductsQuery): Promise<ProductDto[]> {
    return this.catalog.listProducts(query.filters);
  }
}

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements ICommandHandler<
  CreateCategoryCommand,
  CategoryDto
> {
  constructor(
    @Inject(CATALOG_REPOSITORY) private readonly catalog: CatalogRepository,
  ) {}

  execute(command: CreateCategoryCommand): Promise<CategoryDto> {
    const name = command.name.trim();
    const slug = slugify(name);
    if (name.length < 2 || !slug) {
      throw new DomainError(
        "Informe um nome de categoria válido.",
        "VALIDATION",
      );
    }
    return this.catalog.createCategory(name, slug);
  }
}

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<
  CreateProductCommand,
  ProductDto
> {
  constructor(
    @Inject(CATALOG_REPOSITORY) private readonly catalog: CatalogRepository,
  ) {}

  execute(command: CreateProductCommand): Promise<ProductDto> {
    const product = Product.create(command.input);
    return this.catalog.createProduct({
      ...command.input,
      name: product.name,
      description: product.description,
      priceInCents: product.price.inCents,
      stock: product.stock,
    });
  }
}

@CommandHandler(UpdateProductPriceCommand)
export class UpdateProductPriceHandler implements ICommandHandler<
  UpdateProductPriceCommand,
  ProductDto
> {
  constructor(
    @Inject(CATALOG_REPOSITORY) private readonly catalog: CatalogRepository,
  ) {}

  execute(command: UpdateProductPriceCommand): Promise<ProductDto> {
    const price = Money.fromCents(command.priceInCents);
    return this.catalog.updateProductPrice(command.productId, price.inCents);
  }
}

@CommandHandler(CreatePromotionCommand)
export class CreatePromotionHandler implements ICommandHandler<
  CreatePromotionCommand,
  PromotionDto
> {
  constructor(
    @Inject(CATALOG_REPOSITORY) private readonly catalog: CatalogRepository,
  ) {}

  execute(command: CreatePromotionCommand): Promise<PromotionDto> {
    const startsAt = new Date(command.input.startsAt);
    const endsAt = new Date(command.input.endsAt);
    Money.fromCents(100).applyPercentageDiscount(
      command.input.discountPercentage,
    );
    if (
      Number.isNaN(startsAt.getTime()) ||
      Number.isNaN(endsAt.getTime()) ||
      startsAt >= endsAt ||
      command.input.productIds.length === 0
    ) {
      throw new DomainError(
        "Informe período e produtos válidos para a promoção.",
        "VALIDATION",
      );
    }
    return this.catalog.createPromotion(command.input);
  }
}

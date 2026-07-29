import type {
  CategoryDto,
  CreateProductRequest,
  CreatePromotionRequest,
  ProductDto,
  ProductFilters,
  PromotionDto,
} from "@raizstore/contracts";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import type { CatalogRepository } from "../domain/catalog.repository";
import { DomainError } from "../../shared/domain/domain.error";
import { Money } from "../../shared/domain/money";
import { PrismaService } from "../../shared/infrastructure/prisma.service";

const productInclude = {
  category: true,
  promotions: {
    include: { promotion: true },
  },
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: typeof productInclude;
}>;

const mapCategory = (category: {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}): CategoryDto => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  createdAt: category.createdAt.toISOString(),
});

const activePromotion = (product: ProductWithRelations, now = new Date()) =>
  product.promotions
    .map((relation) => relation.promotion)
    .filter((promotion) => promotion.startsAt <= now && promotion.endsAt >= now)
    .sort((a, b) => b.discountPercentage - a.discountPercentage)[0] ?? null;

const mapProduct = (product: ProductWithRelations): ProductDto => {
  const promotion = activePromotion(product);
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    priceInCents: product.priceInCents,
    finalPriceInCents: promotion
      ? Money.fromCents(product.priceInCents).applyPercentageDiscount(
          promotion.discountPercentage,
        ).inCents
      : product.priceInCents,
    stock: product.stock,
    imageUrl: product.imageUrl,
    featured: product.featured,
    category: mapCategory(product.category),
    promotion: promotion
      ? {
          id: promotion.id,
          name: promotion.name,
          discountPercentage: promotion.discountPercentage,
          startsAt: promotion.startsAt.toISOString(),
          endsAt: promotion.endsAt.toISOString(),
          active: true,
        }
      : null,
    createdAt: product.createdAt.toISOString(),
  };
};

@Injectable()
export class PrismaCatalogRepository implements CatalogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listCategories(): Promise<CategoryDto[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    return categories.map(mapCategory);
  }

  async listProducts(filters: ProductFilters): Promise<ProductDto[]> {
    const where: Prisma.ProductWhereInput = {
      ...(filters.search
        ? {
            OR: [
              { name: { contains: filters.search, mode: "insensitive" } },
              {
                description: { contains: filters.search, mode: "insensitive" },
              },
            ],
          }
        : {}),
      ...(filters.category ? { category: { slug: filters.category } } : {}),
      ...(filters.minPriceInCents !== undefined ||
      filters.maxPriceInCents !== undefined
        ? {
            priceInCents: {
              ...(filters.minPriceInCents !== undefined
                ? { gte: filters.minPriceInCents }
                : {}),
              ...(filters.maxPriceInCents !== undefined
                ? { lte: filters.maxPriceInCents }
                : {}),
            },
          }
        : {}),
      ...(filters.onPromotion
        ? {
            promotions: {
              some: {
                promotion: {
                  startsAt: { lte: new Date() },
                  endsAt: { gte: new Date() },
                },
              },
            },
          }
        : {}),
    };
    const products = await this.prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });
    return products.map(mapProduct);
  }

  async createCategory(name: string, slug: string): Promise<CategoryDto> {
    try {
      return mapCategory(
        await this.prisma.category.create({ data: { name, slug } }),
      );
    } catch (error) {
      this.rethrowKnownError(error, "Esta categoria já existe.");
    }
  }

  async createProduct(input: CreateProductRequest): Promise<ProductDto> {
    try {
      const product = await this.prisma.product.create({
        data: {
          name: input.name,
          description: input.description,
          priceInCents: input.priceInCents,
          stock: input.stock,
          categoryId: input.categoryId,
          imageUrl: input.imageUrl ?? null,
          featured: input.featured ?? false,
        },
        include: productInclude,
      });
      return mapProduct(product);
    } catch (error) {
      this.rethrowKnownError(error, "Não foi possível criar o produto.");
    }
  }

  async updateProductPrice(
    productId: string,
    priceInCents: number,
  ): Promise<ProductDto> {
    try {
      const product = await this.prisma.product.update({
        where: { id: productId },
        data: { priceInCents },
        include: productInclude,
      });
      return mapProduct(product);
    } catch (error) {
      this.rethrowKnownError(error, "Produto não encontrado.");
    }
  }

  async createPromotion(input: CreatePromotionRequest): Promise<PromotionDto> {
    const uniqueProductIds = [...new Set(input.productIds)];
    const existingCount = await this.prisma.product.count({
      where: { id: { in: uniqueProductIds } },
    });
    if (existingCount !== uniqueProductIds.length) {
      throw new DomainError("Um ou mais produtos não existem.", "NOT_FOUND");
    }
    const promotion = await this.prisma.promotion.create({
      data: {
        name: input.name.trim(),
        discountPercentage: input.discountPercentage,
        startsAt: new Date(input.startsAt),
        endsAt: new Date(input.endsAt),
        products: {
          create: uniqueProductIds.map((productId) => ({ productId })),
        },
      },
    });
    const now = new Date();
    return {
      id: promotion.id,
      name: promotion.name,
      discountPercentage: promotion.discountPercentage,
      startsAt: promotion.startsAt.toISOString(),
      endsAt: promotion.endsAt.toISOString(),
      active: promotion.startsAt <= now && promotion.endsAt >= now,
    };
  }

  private rethrowKnownError(error: unknown, message: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const kind = error.code === "P2025" ? "NOT_FOUND" : "CONFLICT";
      throw new DomainError(message, kind);
    }
    throw error;
  }
}

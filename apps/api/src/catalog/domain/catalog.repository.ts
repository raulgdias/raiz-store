import type {
  CategoryDto,
  CreateProductRequest,
  CreatePromotionRequest,
  ProductDto,
  ProductFilters,
  PromotionDto,
} from "@raizstore/contracts";

export interface CatalogRepository {
  listCategories(): Promise<CategoryDto[]>;
  listProducts(filters: ProductFilters): Promise<ProductDto[]>;
  createCategory(name: string, slug: string): Promise<CategoryDto>;
  createProduct(input: CreateProductRequest): Promise<ProductDto>;
  updateProductPrice(
    productId: string,
    priceInCents: number,
  ): Promise<ProductDto>;
  createPromotion(input: CreatePromotionRequest): Promise<PromotionDto>;
}

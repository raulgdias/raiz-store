export type UserRole = "ADMIN" | "CUSTOMER";

export interface UserSummary {
  id: string;
  username: string;
  role: UserRole;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserSummary;
}

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface PromotionDto {
  id: string;
  name: string;
  discountPercentage: number;
  startsAt: string;
  endsAt: string;
  active: boolean;
}

export interface ProductDto {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  finalPriceInCents: number;
  stock: number;
  imageUrl: string | null;
  featured: boolean;
  category: CategoryDto;
  promotion: PromotionDto | null;
  createdAt: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPriceInCents?: number;
  maxPriceInCents?: number;
  onPromotion?: boolean;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  priceInCents: number;
  stock: number;
  categoryId: string;
  imageUrl?: string;
  featured?: boolean;
}

export interface UpdateProductPriceRequest {
  priceInCents: number;
}

export interface CreatePromotionRequest {
  name: string;
  discountPercentage: number;
  startsAt: string;
  endsAt: string;
  productIds: string[];
}

export interface CheckoutItemRequest {
  productId: string;
  quantity: number;
}

export interface CheckoutRequest {
  items: CheckoutItemRequest[];
}

export type OrderStatus = "CONFIRMED";

export interface OrderItemDto {
  id: string;
  productId: string;
  productName: string;
  unitPriceInCents: number;
  quantity: number;
  subtotalInCents: number;
}

export interface OrderDto {
  id: string;
  status: OrderStatus;
  totalInCents: number;
  createdAt: string;
  items: OrderItemDto[];
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}

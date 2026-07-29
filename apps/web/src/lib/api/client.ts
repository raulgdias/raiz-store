import type {
  ApiError,
  AuthResponse,
  CategoryDto,
  CheckoutRequest,
  CreateCategoryRequest,
  CreateProductRequest,
  CreatePromotionRequest,
  LoginRequest,
  OrderDto,
  ProductDto,
  ProductFilters,
  PromotionDto,
  UpdateProductPriceRequest
} from "@raizstore/contracts";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

const request = async <T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string
): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers
    }
  });
  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as ApiError | null;
    throw new ApiClientError(error?.message ?? "Não foi possível concluir a operação.", response.status);
  }
  return response.json() as Promise<T>;
};

const toQueryString = (filters: ProductFilters): string => {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.minPriceInCents !== undefined) {
    params.set("minPriceInCents", String(filters.minPriceInCents));
  }
  if (filters.maxPriceInCents !== undefined) {
    params.set("maxPriceInCents", String(filters.maxPriceInCents));
  }
  if (filters.onPromotion) params.set("onPromotion", "true");
  const query = params.toString();
  return query ? `?${query}` : "";
};

export const api = {
  login: (body: LoginRequest) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  listCategories: () => request<CategoryDto[]>("/catalog/categories"),
  listProducts: (filters: ProductFilters = {}) =>
    request<ProductDto[]>(`/catalog/products${toQueryString(filters)}`),
  createCategory: (body: CreateCategoryRequest, token: string) =>
    request<CategoryDto>(
      "/catalog/categories",
      { method: "POST", body: JSON.stringify(body) },
      token
    ),
  createProduct: (body: CreateProductRequest, token: string) =>
    request<ProductDto>(
      "/catalog/products",
      { method: "POST", body: JSON.stringify(body) },
      token
    ),
  updateProductPrice: (id: string, body: UpdateProductPriceRequest, token: string) =>
    request<ProductDto>(
      `/catalog/products/${id}/price`,
      { method: "PATCH", body: JSON.stringify(body) },
      token
    ),
  createPromotion: (body: CreatePromotionRequest, token: string) =>
    request<PromotionDto>(
      "/catalog/promotions",
      { method: "POST", body: JSON.stringify(body) },
      token
    ),
  checkout: (body: CheckoutRequest, token: string) =>
    request<OrderDto>(
      "/orders/checkout",
      { method: "POST", body: JSON.stringify(body) },
      token
    ),
  listMyOrders: (token: string) => request<OrderDto[]>("/orders/mine", {}, token)
};

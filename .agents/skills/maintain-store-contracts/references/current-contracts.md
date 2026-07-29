# Inventário atual de contratos

A fonte única é `packages/contracts/src/index.ts`.

## Autenticação

- `UserRole`: `ADMIN | CUSTOMER`.
- `UserSummary`: identidade pública sem hash.
- `LoginRequest`: username e password somente na entrada.
- `AuthResponse`: Bearer token e usuário resumido.

Produtor: `identity/presentation` e `LoginHandler`.

Consumidores: `lib/api/client.ts`, `AuthProvider`, header e rotas protegidas visualmente.

## Catálogo

- `CategoryDto`: categoria com slug e data ISO.
- `PromotionDto`: percentual, período ISO e estado ativo.
- `ProductDto`: preço-base, preço final, estoque, categoria e promoção.
- `ProductFilters`: busca, categoria, faixa em centavos e promoção.
- `CreateCategoryRequest`.
- `CreateProductRequest`.
- `UpdateProductPriceRequest`.
- `CreatePromotionRequest`.

Produtores: `PrismaCatalogRepository` e `CatalogController`.

Consumidores: cliente HTTP, storefront, product card e formulários administrativos.

## Pedidos

- `CheckoutItemRequest` e `CheckoutRequest`.
- `OrderStatus`: atualmente apenas `CONFIRMED`.
- `OrderItemDto`: snapshot de nome e preço no momento da compra.
- `OrderDto`: status, total, data ISO e itens.

Produtor: `PrismaOrderRepository`.

Consumidores: carrinho, checkout, histórico e cliente HTTP.

## Erros

- `ApiError`: statusCode, message e error.

Produtor: filtros/exceptions do backend.

Consumidor: função `request` em `apps/web/src/lib/api/client.ts`.

## Convenções de compatibilidade

- Adição opcional em request: normalmente compatível.
- Adição obrigatória em request: exige atualização simultânea do frontend.
- Adição em response: compatível apenas se consumidores não validarem objeto fechado.
- Remoção ou renomeação: incompatível; atualizar todos os usos na mesma alteração.
- Mudança de centavos para decimal, ISO para `Date` ou `null` para opcional: mudança semântica incompatível.
- Novo papel ou status: atualizar guards, branches de UI e persistência.

## Comandos de rastreamento

```bash
rg 'ProductDto|CreateProductRequest' apps packages
rg 'OrderDto|CheckoutRequest' apps packages
rg 'AuthResponse|UserRole' apps packages
rg 'from "@raizstore/contracts"' apps packages
```

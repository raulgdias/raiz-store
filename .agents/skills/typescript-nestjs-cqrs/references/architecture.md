# Arquitetura do backend

## Bounded contexts

- `identity`: autenticação e papéis.
- `catalog`: categorias, produtos, preços e promoções.
- `sales`: carrinho confirmado, pedido, itens e total.

## Camadas por contexto

- `domain`: entidades, value objects, erros e portas de repositório.
- `application`: commands, queries, handlers e portas de serviço.
- `infrastructure`: Prisma, JWT, bcrypt e adaptadores.
- `presentation`: controllers, guards e mapeamento HTTP.

## Direção de dependências

`presentation -> application -> domain`

`infrastructure -> application/domain`

O módulo Nest conecta portas a adaptadores. Domínio e aplicação não conhecem controller, Prisma ou transporte.

## CQRS

- Commands usam verbos: `CreateProductCommand`, `CheckoutCommand`.
- Queries descrevem leitura: `ListProductsQuery`, `GetOrderQuery`.
- Um handler orquestra um caso de uso e delega persistência a uma porta.
- Queries podem usar read models otimizados sem expor modelos do ORM.

## Persistência

- Manter schema Prisma e migrations em `apps/api/prisma`.
- Converter explicitamente entre tipos Prisma e domínio/read models.
- Usar tokens em `infrastructure/tokens.ts`.
- Executar checkout através de uma porta transacional de pedidos.

## HTTP

- Prefixar API com `/api`.
- Documentar Swagger em `/docs`.
- Retornar valores monetários em centavos.
- Usar `Authorization: Bearer <token>`.
- Mapear validação para 400, autenticação para 401, autorização para 403 e ausência para 404.

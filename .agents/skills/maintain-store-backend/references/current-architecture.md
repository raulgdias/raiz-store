# Mapa atual do backend

Usar estes arquivos como referência viva. Confirmar o conteúdo no repositório antes de copiar um padrão.

## Composition root e compartilhados

- `apps/api/src/app.module.ts`: registra buses, handlers, guards, serviços, tokens e adaptadores.
- `shared/infrastructure/tokens.ts`: identidades das portas de injeção.
- `shared/infrastructure/prisma.service.ts`: ciclo de vida do Prisma.
- `shared/domain/domain.error.ts`: categorias de erro esperadas.
- `shared/domain/money.ts`: value object de dinheiro e desconto.
- `shared/presentation/domain-error.filter.ts`: tradução de domínio para HTTP.
- `main.ts`: CORS, prefixo `/api`, validação global e Swagger `/docs`.

## Identity

- `identity/application/login.command.ts`: mensagem de escrita/autenticação.
- `identity/application/login.handler.ts`: orquestra usuário, hash e emissão de token.
- `identity/application/auth.ports.ts`: portas para hash e tokens.
- `identity/domain/user.repository.ts`: porta de usuário.
- `identity/infrastructure/*`: adaptadores Prisma, bcrypt e JWT.
- `identity/presentation/*`: DTO, controller, usuário autenticado, decorators e guards.

## Catalog

- `catalog/domain/product.ts`: invariantes de criação do produto.
- `catalog/domain/catalog.repository.ts`: porta completa do catálogo.
- `catalog/application/catalog.messages.ts`: Commands e Queries.
- `catalog/application/catalog.handlers.ts`: validação/orquestração e dependência da porta.
- `catalog/infrastructure/prisma-catalog.repository.ts`: filtros, persistência, promoções e mapeamento.
- `catalog/presentation/catalog.dto.ts`: validação HTTP e Swagger.
- `catalog/presentation/catalog.controller.ts`: rotas públicas e mutações administrativas.

## Sales

- `sales/domain/order.ts`: criação do pedido e total.
- `sales/domain/order.repository.ts`: porta de checkout e histórico.
- `sales/application/sales.messages.ts`: mensagens CQRS.
- `sales/application/sales.handlers.ts`: delegação à porta.
- `sales/infrastructure/prisma-order.repository.ts`: transação, preço vigente e estoque.
- `sales/presentation/*`: DTO de checkout e controller autenticado.

## Direção real de dependências

`presentation -> application -> domain`

`infrastructure -> application/domain`

O Nest conecta as camadas em `app.module.ts`. O domínio não importa Nest, Prisma ou contratos de transporte.

## Sequência para manter um caso de uso

1. Contrato público, se necessário.
2. Entidade/value object e porta.
3. Command ou Query.
4. Handler.
5. Adaptador Prisma ou outro adaptador.
6. DTO e controller.
7. Registro em `app.module.ts`.
8. Teste, Swagger, migration e seed quando aplicáveis.

## Sinais de desvio

- controller com regra de preço, estoque ou persistência;
- handler importando `@prisma/client`;
- domínio importando `@nestjs/*`;
- repositório concreto injetado diretamente no handler;
- escrita executada por QueryBus ou leitura executada por CommandBus;
- DTO público duplicado fora de `@raizstore/contracts`;
- operação de checkout fora de transação.

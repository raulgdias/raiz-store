---
name: maintain-store-backend
description: Manter, corrigir, revisar, refatorar ou evoluir o backend existente do RaizStore em apps/api preservando NestJS, CQRS, DDD, SOLID, Prisma, PostgreSQL, Swagger, autenticação e portas substituíveis. Usar em mudanças de identity, catalog, sales, controllers, handlers, domínio, repositórios, banco, guards ou composição de dependências.
---

# Manter o backend do RaizStore

## Preparar a alteração

1. Ler `AGENTS.md` e `references/current-architecture.md`.
2. Identificar o bounded context dono da mudança: `identity`, `catalog` ou `sales`.
3. Inspecionar o fluxo existente completo, do controller ao adaptador, sem inferir camadas ausentes.
4. Verificar mudanças locais com `git status --short` e preservar trabalho não relacionado.
5. Acionar `$maintain-store-contracts` antes do backend quando a forma pública da API mudar.

## Preservar o fluxo CQRS

- Modelar escrita como Command e leitura como Query.
- Manter controller fino: receber DTO, despachar bus e devolver contrato.
- Manter validação sintática em DTOs de apresentação.
- Manter regra e invariantes em domínio ou handler de aplicação.
- Fazer handler depender de porta abstrata injetada por token.
- Implementar Prisma, bcrypt e JWT somente como adaptadores de infraestrutura.
- Registrar adaptadores, tokens, guards e handlers no composition root `app.module.ts`.
- Mapear explicitamente Prisma para contratos; não retornar registro Prisma cru.

## Preservar invariantes existentes

- Representar dinheiro como inteiros em centavos e usar `Money`.
- Recalcular preço e promoção no backend durante checkout.
- Manter checkout e decremento de estoque na mesma transação.
- Manter senha apenas como hash e não registrar credenciais ou tokens.
- Proteger mutações administrativas com `JwtAuthGuard`, `RolesGuard` e `@Roles("ADMIN")`.
- Traduzir falhas esperadas para `DomainError`; deixar o filtro global definir a resposta HTTP.
- Atualizar Swagger junto com DTOs e controllers.

## Alterar persistência com segurança

1. Atualizar `prisma/schema.prisma` apenas quando o modelo persistido realmente mudar.
2. Criar migration; não editar migration já aplicada para representar mudança nova.
3. Atualizar seed somente para dados mínimos, idempotentes e úteis ao estudo.
4. Atualizar a porta antes ou junto do adaptador Prisma.
5. Cobrir invariantes e ramificações críticas com teste de domínio ou handler.

## Verificar regressões

1. Executar `npm run db:generate` após mudança de schema ou versão Prisma.
2. Executar `npm run typecheck --workspace=@raizstore/api`.
3. Executar `npm run lint --workspace=@raizstore/api`.
4. Executar `npm run test --workspace=@raizstore/api`.
5. Executar `npm run build --workspace=@raizstore/api`.
6. Testar endpoint afetado contra o PostgreSQL quando a alteração cruzar infraestrutura.

Não criar caminho paralelo que ignore CQRS, acessar Prisma em controller/handler ou acoplar domínio ao Nest.

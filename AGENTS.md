# RaizStore

Este repositório é mantido integralmente por agentes de IA. Antes de alterar código:

- Use `$maintain-store-frontend` para manter, corrigir, revisar, refatorar ou evoluir `apps/web`.
- Use `$maintain-store-backend` para manter, corrigir, revisar, refatorar ou evoluir `apps/api` ou Prisma.
- Use `$maintain-store-contracts` quando uma mudança afetar a comunicação entre frontend e backend.
- Use `$typescript-nextjs-store` junto da Skill de manutenção somente ao criar uma funcionalidade nova no frontend.
- Use `$typescript-nestjs-cqrs` junto da Skill de manutenção somente ao criar uma funcionalidade nova no backend.
- Se uma mudança atravessar frontend e backend, alterar primeiro `packages/contracts`.
- Preserve DDD, Clean Code, SOLID, CQRS no backend e as portas de infraestrutura.
- Nunca duplique DTOs públicos fora de `packages/contracts`.
- Conclua apenas após lint, typecheck, testes e build.

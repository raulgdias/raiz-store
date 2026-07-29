# RaizStore

MVP educacional de e-commerce criado em um monorepo Turborepo.

## Aplicações

- `apps/web`: Next.js, React e Tailwind CSS (`http://localhost:3000`)
- `apps/api`: NestJS, CQRS, DDD, Prisma, PostgreSQL no banco `RaizStore` e Swagger (`http://localhost:3001`)
- `packages/contracts`: interfaces e tipos compartilhados entre frontend e backend
- `.agents/skills`: regras reutilizáveis para agentes trabalharem em cada stack

## Primeira execução

```bash
npm install
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Swagger fica em `http://localhost:3001/docs`.

## Usuários de estudo

- Administrador: `admin` / `admin123`
- Cliente: `cliente` / `cliente123`

As contas são criadas pelo seed e as senhas ficam armazenadas como hash.

## Arquitetura

O backend é dividido nos contextos `identity`, `catalog` e `sales`. Controllers apenas convertem HTTP e despacham Commands/Queries. Handlers dependem de portas; Prisma, JWT e bcrypt são adaptadores substituíveis.

O carrinho é local ao navegador neste MVP. No checkout, o backend recalcula preços a partir do catálogo e cria o pedido em transação, evitando confiar nos totais enviados pelo cliente.

## Skills para agentes

As Skills de manutenção usam o código atual como referência e devem acompanhar a evolução do sistema:

- `$maintain-store-frontend`: preserva rotas, features, providers, cliente HTTP e padrões visuais.
- `$maintain-store-backend`: preserva bounded contexts, CQRS, domínio, portas e adaptadores.
- `$maintain-store-contracts`: coordena mudanças públicas entre backend e frontend.

As Skills `$typescript-nextjs-store` e `$typescript-nestjs-cqrs` ficam reservadas para funcionalidades realmente novas. As regras de acionamento estão em `AGENTS.md`.

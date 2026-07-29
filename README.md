<div align="center">

# RaizStore

**Um e-commerce full stack criado para explorar boas práticas de engenharia de software com Inteligência Artificial.**

Este projeto foi inteiramente construído com **ChatGPT/Codex**, a partir de requisitos e direção humana, usando **Skills versionadas** para orientar a implementação e preservar a arquitetura.

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/repo)

</div>

## Sobre o projeto

RaizStore é um MVP educacional de loja virtual com experiências para cliente e administrador. Mais do que demonstrar funcionalidades de e-commerce, o projeto mostra como a IA pode produzir e manter software organizado quando trabalha sob regras explícitas de qualidade.

A base foi construída com **Clean Code, SOLID, DDD e CQRS**, contratos compartilhados entre frontend e backend, infraestrutura desacoplada por interfaces e documentação interativa das APIs com **Swagger**.

## Visão do produto

<p align="center">
  <a href="./docs/screenshots/home.png">
    <img src="./docs/screenshots/home.png" alt="Catálogo de produtos da RaizStore" width="900" />
  </a>
</p>

<p align="center"><sub>Clique na imagem para visualizá-la em alta resolução.</sub></p>

<details>
  <summary><strong>Explorar login, carrinho, pedidos e painel administrativo</strong></summary>
  <br />

  <p><strong>Autenticação</strong></p>
  <a href="./docs/screenshots/login.png">
    <img src="./docs/screenshots/login.png" alt="Tela de login da RaizStore" width="900" />
  </a>

  <p><strong>Carrinho de compras</strong></p>
  <a href="./docs/screenshots/cart.png">
    <img src="./docs/screenshots/cart.png" alt="Carrinho de compras da RaizStore" width="900" />
  </a>

  <p><strong>Histórico de pedidos</strong></p>
  <a href="./docs/screenshots/orders.png">
    <img src="./docs/screenshots/orders.png" alt="Histórico de pedidos da RaizStore" width="900" />
  </a>

  <p><strong>Painel administrativo</strong></p>
  <a href="./docs/screenshots/admin.png">
    <img src="./docs/screenshots/admin.png" alt="Painel administrativo da RaizStore" width="900" />
  </a>
</details>

## Funcionalidades

**Experiência do cliente**

- Catálogo com busca e filtros por categoria, faixa de preço e promoções.
- Carrinho editável, finalização de compra e histórico de pedidos.
- Autenticação simples com perfis de cliente e administrador.

**Operação da loja**

- Cadastro de produtos com preço, estoque e categoria.
- Cadastro de categorias e atualização de preços.
- Criação de campanhas promocionais por período.
- Rotas e ações administrativas protegidas também no backend.

## Engenharia e arquitetura

| Área         | Decisões principais                                          |
| ------------ | ------------------------------------------------------------ |
| Frontend     | Next.js, React, TypeScript e Tailwind CSS                    |
| Backend      | NestJS, DDD, CQRS, SOLID e Clean Code                        |
| Dados        | PostgreSQL com Prisma ORM e migrations                       |
| Integração   | Contratos TypeScript compartilhados entre frontend e backend |
| Documentação | OpenAPI com Swagger em `/docs`                               |
| Monorepo     | npm workspaces e Turborepo                                   |

O backend é dividido nos contextos `identity`, `catalog` e `sales`. Controllers traduzem HTTP e despacham Commands ou Queries; regras de negócio permanecem no domínio e os handlers dependem de portas. Prisma, JWT e bcrypt são adaptadores substituíveis, facilitando testes e futuras trocas de infraestrutura.

No checkout, preços e promoções são recalculados pelo backend e o pedido é persistido em transação, sem confiar nos totais enviados pelo cliente.

```text
RaizStore/
├── apps/
│   ├── web/          # Next.js + Tailwind CSS
│   └── api/          # NestJS + CQRS + Swagger
├── packages/
│   └── contracts/    # Interfaces compartilhadas
└── .agents/
    └── skills/       # Regras de construção e manutenção por stack
```

## IA guiada por Skills

As Skills não foram usadas apenas para iniciar o projeto. Elas foram criadas a partir do próprio código e versionadas no repositório para orientar evoluções futuras sem degradar suas decisões arquiteturais:

- [`maintain-store-frontend`](./.agents/skills/maintain-store-frontend/SKILL.md): preserva rotas, features, providers, integração HTTP e linguagem visual.
- [`maintain-store-backend`](./.agents/skills/maintain-store-backend/SKILL.md): preserva DDD, CQRS, domínio, portas e adaptadores.
- [`maintain-store-contracts`](./.agents/skills/maintain-store-contracts/SKILL.md): coordena mudanças de contrato entre as aplicações.
- Skills específicas para novas implementações em [Next.js](./.agents/skills/typescript-nextjs-store/SKILL.md) e [NestJS](./.agents/skills/typescript-nestjs-cqrs/SKILL.md).

Essa abordagem transforma arquitetura, padrões e convenções em contexto reutilizável para a IA — tornando a manutenção mais previsível e consistente.

## Executando localmente

**Pré-requisitos:** Node.js 20+, npm e PostgreSQL.

```bash
git clone https://github.com/raulgdias/raiz-store.git
cd raiz-store
npm install

cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

createdb -h localhost -U postgres RaizStore
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

| Serviço | Endereço                     |
| ------- | ---------------------------- |
| Loja    | `http://localhost:3000`      |
| API     | `http://localhost:3001/api`  |
| Swagger | `http://localhost:3001/docs` |

Credenciais criadas pelo seed:

- Administrador: `admin` / `admin123`
- Cliente: `cliente` / `cliente123`

As senhas são armazenadas como hash e destinam-se exclusivamente ao ambiente de estudo.

## Qualidade

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

---

<div align="center">
  Projeto de estudo sobre engenharia de software, arquitetura sustentável e desenvolvimento assistido por IA.
</div>

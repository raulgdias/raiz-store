# Mapa atual do frontend

Usar estes arquivos como referência viva. Confirmar o conteúdo no repositório antes de copiar um padrão.

## Composição e rotas

- `apps/web/src/app/layout.tsx`: metadata, header, providers, conteúdo e footer.
- `apps/web/src/app/providers.tsx`: única composição dos providers globais.
- `apps/web/src/components/site-header.tsx`: navegação sensível a sessão, papel e carrinho.
- `apps/web/src/app/page.tsx`: composição mínima da home.
- `apps/web/src/app/login/page.tsx`: formulário, erro, sessão e redirecionamento.
- `apps/web/src/app/carrinho/page.tsx`: edição do carrinho e orquestração do checkout.
- `apps/web/src/app/pedidos/page.tsx`: leitura autenticada com estados de UI.
- `apps/web/src/app/admin/page.tsx`: barreira visual por papel e composição do dashboard.

## Features

- `features/catalog/storefront.tsx`: filtros, carregamento do catálogo e estados assíncronos.
- `features/catalog/product-card.tsx`: apresentação do contrato `ProductDto` e ação de carrinho.
- `features/admin/admin-dashboard.tsx`: atualização coordenada de produtos e categorias.
- `features/admin/*-form.tsx`: padrão de formulário administrativo com feedback e callback.
- `features/admin/admin-form-shell.tsx`: estrutura visual compartilhada pelos formulários.
- `features/auth/auth-provider.tsx`: fonte única da sessão persistida.
- `features/cart/cart-provider.tsx`: fonte única do carrinho persistido e de seus totais.

## Integração e apresentação

- `lib/api/client.ts`: URL, headers, Bearer token, normalização de erro e todos os endpoints.
- `lib/format.ts`: moeda e data em `pt-BR`.
- `app/globals.css`: Tailwind, tokens e classes semânticas reutilizadas.
- `packages/contracts/src/index.ts`: tipos públicos; importar com `import type`.

## Dependências permitidas

`app -> features -> lib/api -> @raizstore/contracts`

`app -> components`

`features -> components | lib | @raizstore/contracts`

Evitar:

- `fetch` fora de `lib/api/client.ts`;
- imports de `apps/api`, Prisma ou código interno do backend;
- DTO local com o mesmo formato de um contrato;
- acesso direto a `localStorage` fora dos providers;
- regra de total confiável no frontend durante checkout.

## Caminhos de manutenção

- Novo campo apenas visual: adaptar componente dono do dado.
- Novo endpoint: alterar contrato, cliente HTTP e feature consumidora.
- Novo estado global: ampliar provider existente quando pertencer a sessão ou carrinho; justificar outro provider.
- Novo formulário admin: reutilizar `AdminFormShell`, cliente HTTP e callbacks `onSaved`/`onError`.
- Mudança de identidade visual: atualizar primeiro tokens/classes de `globals.css`, depois exceções locais.

---
name: maintain-store-frontend
description: Manter, corrigir, revisar, refatorar ou evoluir o frontend existente do RaizStore em apps/web sem alterar seus limites arquiteturais. Usar em mudanças de rotas, componentes, formulários administrativos, catálogo, autenticação, carrinho, pedidos, cliente HTTP, estado React, Tailwind ou integração com @raizstore/contracts.
---

# Manter o frontend do RaizStore

## Preparar a alteração

1. Ler `AGENTS.md` e `references/current-architecture.md`.
2. Inspecionar o arquivo afetado e pelo menos um exemplar canônico indicado no mapa.
3. Verificar mudanças locais com `git status --short` e preservar trabalho não relacionado.
4. Identificar se a alteração muda somente apresentação, estado local ou contrato HTTP.
5. Acionar `$maintain-store-contracts` antes de editar o frontend quando a API pública mudar.

## Preservar os limites

- Manter rotas e composição em `apps/web/src/app`.
- Manter comportamento de domínio da interface em `apps/web/src/features/<dominio>`.
- Manter componentes visuais compartilháveis em `apps/web/src/components`.
- Manter toda comunicação HTTP em `apps/web/src/lib/api/client.ts`.
- Importar DTOs e requests somente de `@raizstore/contracts`; não recriar tipos equivalentes.
- Manter sessão em `AuthProvider` e carrinho em `CartProvider`; não criar estados globais paralelos.
- Manter Server Components como padrão e adicionar `"use client"` apenas no limite interativo.
- Reutilizar `.field`, `.label`, `.card`, `.button-primary`, `.button-secondary`, `.page-shell` e os tokens de `globals.css`.
- Preservar valores monetários em centavos fora dos campos de entrada e usar `formatCurrency`.

## Executar com mudança mínima

- Corrigir dentro do padrão atual antes de introduzir biblioteca ou abstração nova.
- Extrair componente apenas quando houver responsabilidade independente ou reutilização real.
- Representar carregamento, erro, vazio e sucesso em fluxos assíncronos.
- Preservar semântica HTML, rótulos, foco, teclado e `aria-live` quando o estado mudar.
- Tratar autorização visual como conveniência; nunca assumir que ela substitui o guard do backend.
- Não mover regra de preço, promoção, estoque ou checkout para o cliente.

## Verificar regressões

1. Conferir manualmente a rota afetada em largura móvel e desktop quando houver alteração visual.
2. Executar `npm run typecheck --workspace=@raizstore/web`.
3. Executar `npm run lint --workspace=@raizstore/web`.
4. Executar testes relevantes e `npm run build --workspace=@raizstore/web`.
5. Se contratos mudaram, executar as verificações no monorepo inteiro.

Não criar um novo frontend, duplicar infraestrutura ou substituir a arquitetura atual sem solicitação explícita.

---
name: maintain-store-contracts
description: Manter e evoluir os contratos TypeScript compartilhados do RaizStore em packages/contracts, coordenando produtores no backend e consumidores no frontend. Usar quando requests, responses, filtros, papéis, estados, campos, formatos ou compatibilidade HTTP mudarem entre apps/api e apps/web.
---

# Manter contratos compartilhados

## Avaliar o impacto

1. Ler `references/current-contracts.md`.
2. Localizar produtores e consumidores com `rg '<NomeDoContrato>' apps packages`.
3. Classificar a mudança como aditiva, compatível ou incompatível.
4. Confirmar se o dado é público. Manter entidades, hashes, modelos Prisma e detalhes internos fora do pacote.

## Aplicar na ordem correta

1. Alterar `packages/contracts/src/index.ts`.
2. Executar `npm run build --workspace=@raizstore/contracts`.
3. Atualizar DTO de apresentação do backend para implementar o request quando aplicável.
4. Atualizar Command/Query, porta e mapper que produzem a resposta.
5. Atualizar `apps/web/src/lib/api/client.ts`.
6. Atualizar features consumidoras sem redefinir o tipo.
7. Atualizar Swagger e testes.

## Preservar convenções

- Manter requests com sufixo `Request` e respostas públicas com `Dto` ou nome de resposta.
- Manter datas como strings ISO no transporte.
- Manter dinheiro como inteiros em centavos com sufixo `InCents`.
- Manter propriedades opcionais realmente opcionais; não enviar `undefined` com `exactOptionalPropertyTypes`.
- Manter `null` quando a ausência faz parte explícita da resposta, como `promotion` e `imageUrl`.
- Não exportar tipos do Prisma, Nest, React ou detalhes de infraestrutura.
- Preferir mudança aditiva. Tratar remoção, renomeação ou mudança de significado como alteração coordenada.

## Verificar ausência de divergência

1. Não aceitar interface equivalente criada em `apps/web` ou `apps/api`.
2. Confirmar serialização nos mappers Prisma e leitura no cliente HTTP.
3. Executar `npm run typecheck`.
4. Executar `npm run lint`.
5. Executar testes relevantes e `npm run build`.

Não usar o pacote de contratos como domínio compartilhado. Ele descreve transporte entre aplicações, não entidades ou regras de negócio.

---
name: typescript-nextjs-store
description: Implementar, revisar ou refatorar o frontend TypeScript do RaizStore em Next.js com App Router, React, Tailwind CSS, contratos compartilhados, acessibilidade, Clean Code, SOLID e separação por domínio. Usar em toda alteração dentro de apps/web ou em contratos consumidos pelo frontend.
---

# Frontend Next.js do RaizStore

## Fluxo obrigatório

1. Ler `AGENTS.md`, o `package.json` do workspace e a documentação da versão instalada em `node_modules/next/dist/docs/` antes de usar uma API do Next.js.
2. Ler `references/architecture.md` antes de criar ou mover arquivos.
3. Procurar primeiro um contrato em `@raizstore/contracts`; nunca redefinir DTOs da API no frontend.
4. Manter Server Components como padrão. Adicionar `"use client"` somente a componentes com estado, efeitos ou APIs do navegador.
5. Fazer componentes dependerem de funções de caso de uso ou clientes tipados, não de `fetch` espalhado.
6. Representar estados de carregamento, vazio, erro e sucesso.
7. Validar a alteração com `npm run typecheck`, `npm run lint` e os testes relevantes.

## Regras de implementação

- Usar TypeScript estrito; não introduzir `any`, assertions inseguras ou `@ts-ignore`.
- Manter uma responsabilidade por módulo e extrair regras reutilizáveis para funções puras.
- Preferir composição a condicionais extensas e herança.
- Injetar clientes e gateways por propriedades quando isso tornar o componente testável.
- Usar Tailwind CSS e os tokens definidos em `app/globals.css`; evitar estilos inline e cores arbitrárias repetidas.
- Manter componentes pequenos, sem misturar acesso HTTP, transformação de dados e renderização.
- Usar elementos semânticos, rótulos, foco visível, navegação por teclado e mensagens de erro claras.
- Formatar moeda e datas com `Intl`, respeitando `pt-BR`.
- Nunca persistir senha. Guardar somente o token de sessão necessário ao MVP.
- Não expor segredos ou variáveis sem o prefixo `NEXT_PUBLIC_`.

## Critérios de conclusão

- Não duplicar contratos.
- Não introduzir dependência do frontend em código interno do backend.
- Cobrir regra de negócio extraída com teste unitário quando houver ramificações.
- Confirmar layout responsivo nas larguras móvel e desktop.
- Manter lint, typecheck e build verdes.

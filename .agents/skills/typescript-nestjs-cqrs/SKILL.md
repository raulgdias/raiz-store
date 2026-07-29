---
name: typescript-nestjs-cqrs
description: Implementar, revisar ou refatorar o backend TypeScript do RaizStore em NestJS com CQRS, DDD, PostgreSQL, Swagger, Clean Code, SOLID, autenticação e adaptadores substituíveis. Usar em toda alteração dentro de apps/api, migrations Prisma ou contratos publicados pelo backend.
---

# Backend NestJS CQRS do RaizStore

## Fluxo obrigatório

1. Ler `AGENTS.md` e `references/architecture.md`.
2. Identificar o bounded context afetado e preservar seus limites.
3. Criar ou reutilizar contrato em `@raizstore/contracts` antes do controller.
4. Modelar alteração de estado como Command e leitura como Query.
5. Colocar invariantes em entidades/value objects do domínio, não no controller ou ORM.
6. Fazer handlers dependerem de portas abstratas registradas por tokens.
7. Implementar persistência e serviços externos como adaptadores de infraestrutura.
8. Documentar endpoints e respostas no Swagger.
9. Validar com `npm run typecheck`, `npm run lint`, testes e build.

## Regras de implementação

- Usar TypeScript estrito e evitar `any`, `@ts-ignore` e dependências globais ocultas.
- Manter controllers finos: validar entrada, despachar Command/Query e mapear resposta.
- Separar modelos de domínio dos modelos Prisma; nunca devolver registros Prisma diretamente.
- Usar interfaces/abstract classes para repositórios, relógio, hash e token.
- Garantir uma responsabilidade por classe e funções pequenas com nomes orientados ao negócio.
- Preservar valores monetários como inteiros em centavos.
- Executar comandos mutáveis de checkout em transação quando envolverem mais de um agregado.
- Nunca registrar senhas, hashes, tokens ou a URL completa do banco.
- Armazenar senha somente como hash forte.
- Autorizar endpoints administrativos no servidor, independentemente da interface.
- Atualizar migration, seed, contrato compartilhado e Swagger quando o modelo público mudar.

## Critérios de conclusão

- Cada escrita passa pelo CommandBus e cada leitura pelo QueryBus.
- Domínio e aplicação não importam Prisma, Nest HTTP ou detalhes de framework.
- Repositórios podem ser trocados sem alterar casos de uso.
- Erros de domínio são traduzidos em respostas HTTP consistentes.
- Testes cobrem invariantes e handlers relevantes.
- Lint, typecheck, testes e build permanecem verdes.

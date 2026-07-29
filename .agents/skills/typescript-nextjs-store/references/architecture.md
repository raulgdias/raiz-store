# Arquitetura do frontend

## Limites

- `app/`: rotas, layouts e composição.
- `features/<dominio>/components`: componentes específicos do domínio.
- `features/<dominio>/hooks`: orquestração client-side.
- `lib/api`: cliente HTTP e adaptação de erros.
- `lib/auth`: sessão e autorização de interface.
- `components/ui`: componentes visuais reutilizáveis sem regra de negócio.
- `@raizstore/contracts`: única fonte para DTOs, enums e filtros compartilhados.

## Direção de dependências

`app -> features -> lib/api -> @raizstore/contracts`

`components/ui` não depende de `features`.

## Convenções

- Nomear componentes em PascalCase e funções/arquivos utilitários em camelCase.
- Manter valores monetários do contrato em centavos.
- Usar formulários controlados apenas quando a interação exigir; preferir `FormData` para formulários simples.
- Centralizar URLs, headers e normalização de erro no cliente HTTP.
- Aplicar autorização também no backend; esconder controles no frontend é apenas experiência de uso.

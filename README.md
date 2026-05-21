# Sua Senha — clone full-stack

Plataforma de venda antecipada de senhas para vaquejadas. Clone
pixel-perfect (páginas públicas) com backend funcional.

## Stack

- **Next.js 16** (App Router, Server Actions, convenção `proxy`)
- **TypeScript** strict · **Tailwind v4** (design tokens do site original)
- **Prisma 7** + PostgreSQL (driver adapter `@prisma/adapter-pg`)
- **Auth.js v5** (Credentials + JWT httpOnly, RBAC: CLIENTE/PARQUE/ADMIN)
- Pagamento abstraído (`PaymentProvider` + `MockPaymentProvider`;
  integração real planejada para SumUp)
- **Playwright** (E2E)

## Setup local

Requer Node 20+ e PostgreSQL.

```bash
yarn
cp .env.example .env          # ajuste DATABASE_URL e gere AUTH_SECRET
npx prisma migrate dev        # cria o schema
npx prisma db seed            # popula dados de exemplo
yarn dev                      # http://localhost:3000
```

PostgreSQL local (Homebrew): `brew install postgresql@16 && pg_ctl -D
/opt/homebrew/var/postgresql@16 start && createdb suasenha`.

### Credenciais de exemplo (seed)

Senha de todos: `senha123`

| Perfil | Acesso | Login |
|---|---|---|
| Admin | `admin@suasenha.com.br` | `/admin` |
| Cliente | `cliente@teste.com` | `/cliente/login` |
| Parque | `parque0@suasenha.com.br` | `/parque` |

## Scripts

| Script | Ação |
|---|---|
| `yarn dev` / `build` / `start` | Next.js |
| `yarn typecheck` | `tsc --noEmit` |
| `yarn db:migrate` / `db:deploy` / `db:seed` / `db:studio` | Prisma |
| `yarn test:e2e` | Playwright (requer `npx playwright install chromium`) |

## Deploy (Vercel)

1. Banco gerenciado (Neon/Supabase). Use URL **com pool** para serverless.
2. Variáveis de ambiente no projeto Vercel:
   - `DATABASE_URL` — Postgres (pooled)
   - `AUTH_SECRET` — `npx auth secret`
   - `AUTH_URL` — URL pública (ex.: `https://app.suasenha.com.br`)
3. Build roda `prisma generate` via `postinstall`.
4. Aplicar schema em produção: `yarn db:deploy` (migrations) e,
   opcionalmente, `yarn db:seed`.

## Estrutura

```
src/
  app/(public)/        páginas públicas + área do cliente (com header)
  app/parque|admin/    áreas logadas (login + painel)
  app/api/auth/        Auth.js handlers
  auth.config.ts       config edge-safe + RBAC (authorized)
  auth.ts              Credentials provider (bcrypt + Prisma)
  proxy.ts             proteção de rotas (Next 16)
  server/              services, queries, actions, payment/
  components/          UI (design system + domínio)
  generated/prisma/    client Prisma (gitignored)
prisma/                schema, migrations, seed
e2e/                   testes Playwright
```

## Observações

- Textos legais/institucionais são **placeholders** — substituir pelos
  oficiais.
- Pagamento usa provider mock (gancho de recusa: valor com centavos `13`).
- Painéis logados seguem a identidade visual; ajustes pixel-perfect
  dependem de screenshots das telas logadas.

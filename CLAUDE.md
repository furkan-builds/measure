# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Measure** is a calorie counting and nutritional tracking app with weight tracking. It targets both web and mobile platforms from a single monorepo.

## Tech Stack

- **Language:** TypeScript (strict mode) throughout
- **Monorepo:** pnpm workspaces + Turborepo
- **Web:** Vite + React
- **Mobile:** Expo (React Native)
- **API:** Express + tRPC (end-to-end type safety)
- **Database:** PostgreSQL + Drizzle ORM
- **Validation:** Zod (shared schemas used by tRPC, forms, and DB)
- **Linting/Formatting:** Biome
- **Testing:** Vitest (web/api/shared/ui/db), Jest (mobile)

## Repository Structure

```
apps/
  web/          — Vite + React web app
  mobile/       — Expo React Native app
  api/          — Express + tRPC API server
packages/
  shared/       — Shared types, Zod schemas, constants
  db/           — Drizzle schema, migrations, database client
  ui/           — Shared React component library (web + mobile where possible)
```

## Common Commands

```bash
pnpm install                    # install all dependencies
pnpm dev                        # run all apps in dev mode (turborepo)
pnpm dev --filter=web           # run only the web app
pnpm dev --filter=api           # run only the API server
pnpm build                      # build all packages/apps
pnpm lint                       # biome check across all packages
pnpm lint:fix                   # biome check --write
pnpm format                     # biome format --write
pnpm test                       # run all tests
pnpm test --filter=web          # run tests for web only
pnpm typecheck                  # tsc --noEmit across all packages
```

### Database

```bash
pnpm docker:up                  # start PostgreSQL
pnpm docker:down                # stop PostgreSQL
pnpm --filter=db generate       # generate Drizzle migration from schema changes
pnpm --filter=db migrate        # apply pending migrations
pnpm --filter=db studio         # open Drizzle Studio (DB browser)
```

## Code Style

These conventions are enforced by Biome where possible (see `biome.json`). Follow them in all code.

- **Arrow functions only** — never use `function` declarations. Write `const foo = () => { ... }` everywhere. Enforced by `complexity/useArrowFunction`.
- **Named exports only** — never use `export default`. Enforced by `style/noDefaultExport`. Config files that require default exports (vite.config.ts, drizzle.config.ts) get a `biome-ignore` comment.
- **No barrel files** — never create `index.ts` files that re-export from other files. Enforced by `performance/noBarrelFile` and `performance/noReExportAll`.
- **Direct imports** — import from the specific file path, not from a package root. Packages use `exports` maps in package.json to expose individual modules (e.g., `@measure/shared/schemas/food`, not `@measure/shared`).
- **No `import * as`** — always use explicit named imports. Not yet a Biome rule, enforced by convention.
- **Exports at end of file** — declare everything without `export` inline, then add `export { ... }` at the bottom. Type exports go on a separate line: `export type { ... }`.
- **Descriptive prop names** — never name function parameters just `props`. Use a name that reflects the component, e.g. `buttonProps`, `foodFormProps`.

## Architecture Notes

- **tRPC routers** in `apps/api/src/routers/` define the API. The tRPC client is consumed by both web and mobile apps, providing full type inference from DB schema → API → UI with no codegen step.
- **Zod schemas** in `packages/shared/` are the single source of truth for validation. They are used by tRPC input validation, Drizzle schema definitions, and client-side form validation.
- **Drizzle schema** in `packages/db/src/schema/` defines all database tables. Migrations are generated from schema diffs, not hand-written.
- The `packages/ui/` library contains presentational components. Platform-specific components use `.web.tsx` / `.native.tsx` file extensions where needed.

## Git Hooks

A **pre-push** hook (via Husky) runs `pnpm lint`, `pnpm typecheck`, and `pnpm test` before every push. Hooks are installed automatically by `pnpm install`.

## Branch and PR Conventions

- Branch naming: `feat/`, `fix/`, `chore/`, `docs/` prefixes (e.g., `feat/food-search`)
- PRs require a summary and test plan
- Squash merge to `main`

## Environment Variables

The API server reads from `apps/api/.env` (not committed). Required vars:

- `DATABASE_URL` — PostgreSQL connection string
- `PORT` — API server port (default: 3001)

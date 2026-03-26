# Roadmap

Track of planned features and infrastructure for Measure.

## Phase 0: Project Setup
- [x] Initialize monorepo (pnpm workspaces, Turborepo)
- [x] Configure Biome (linting + formatting)
- [x] Set up TypeScript configs (base + per-package)
- [x] Scaffold `apps/web` (Vite + React)
- [x] Scaffold `apps/api` (Express + tRPC)
- [x] Scaffold `apps/mobile` (Expo)
- [x] Scaffold `packages/shared`, `packages/db`, `packages/ui`
- [x] Set up PostgreSQL + Drizzle ORM with initial schema
- [x] Set up Vitest for web/shared, Jest for api/mobile
- [x] GitHub repo setup (branch protection, PR template)

## Phase 1: Core Food Logging

### API
- [x] User authentication (sign up, log in, sessions)
- [ ] Food database schema (foods, servings, nutrients)
- [ ] Manual food entry (name, calories, macros)
- [ ] Daily food log (add, edit, remove entries)
- [ ] Daily calorie/macro summary
- [ ] Date navigation (view past days)

### Frontend
- [ ] Sign up / log in pages
- [ ] Food entry form
- [ ] Daily food log view
- [ ] Daily summary view
- [ ] Date navigation

## Phase 2: Weight Tracking

### API
- [ ] Weight log schema and endpoints
- [ ] Log daily weight entries
- [ ] Goal weight setting

### Frontend
- [ ] Weight entry form
- [ ] Weight history chart (trend over time)
- [ ] Goal weight display

## Phase 3: Nutritional Detail

### API
- [ ] Micronutrient tracking (vitamins, minerals)
- [ ] Meal categorization (breakfast, lunch, dinner, snacks)
- [ ] Daily nutritional goals (calories, protein, carbs, fat)
- [ ] Progress indicators (daily goals vs. actuals)

### Frontend
- [ ] Nutritional detail views
- [ ] Meal category filters
- [ ] Goals settings page
- [ ] Progress indicators and charts

## Phase 4: Food Search and Database
- [ ] Integrate external food database API (e.g., USDA FoodData Central, Open Food Facts)
- [ ] Food search with autocomplete
- [ ] Barcode scanning (mobile)
- [ ] Custom food creation and favorites
- [ ] Recent/frequent foods quick-add

## Phase 5: Mobile App
- [ ] Port core flows to Expo (food log, weight log)
- [ ] Offline support (local-first with sync)
- [ ] Push notifications (meal reminders)

## Phase 6: Insights and Reports
- [ ] Weekly/monthly nutrition summaries
- [ ] Calorie and weight correlation charts
- [ ] Streak tracking (logging consistency)
- [ ] Export data (CSV)

## Phase 7: CI/CD and Infrastructure
- [ ] GitHub Actions: lint, typecheck, test on PRs
- [ ] GitHub Actions: build and deploy on merge to main
- [ ] Containerize API (Docker)
- [ ] Database migrations in CI
- [ ] Preview deployments for PRs (web)

## Phase 8: Social and Advanced Features
- [ ] Meal plans and recipes
- [ ] Share meals / copy from other days
- [ ] Multi-user support with privacy controls
- [ ] Integration with fitness trackers (Apple Health, Google Fit)

# Contributing

## Code Style

These conventions are enforced by [Biome](https://biomejs.dev) where possible. Run `pnpm lint` to check and `pnpm lint:fix` to auto-fix.

### Arrow functions only

Never use `function` declarations. Always use arrow functions assigned to `const`.

```ts
// Good
const greet = (name: string) => {
	return `Hello, ${name}`;
};

// Bad
function greet(name: string) {
	return `Hello, ${name}`;
}
```

Enforced by Biome: `complexity/useArrowFunction`

### Named exports only

Never use `export default`. Always use named exports.

```ts
// Good
export { greet };

// Bad
export default greet;
```

Enforced by Biome: `style/noDefaultExport`

### Exports at end of file

Declare everything without the `export` keyword inline, then add exports at the bottom. Value and type exports go on separate lines.

```ts
// Good
const foo = 1;
type Bar = string;

export { foo };
export type { Bar };

// Bad
export const foo = 1;
export type Bar = string;

// Also bad — mixing values and types
export { foo, type Bar };
```

### Descriptive prop names

Never name function parameters just `props`. Use a name that reflects the component.

```ts
// Good
const Button = (buttonProps: ButtonHTMLAttributes<HTMLButtonElement>) => {
	return <button type="button" {...buttonProps} />;
};

// Bad
const Button = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
	return <button type="button" {...props} />;
};
```

### No barrel files

Never create `index.ts` files that re-export from other files. Never use `export * from`.

```ts
// Bad — index.ts
export * from "./foo";
export * from "./bar";
```

Enforced by Biome: `performance/noBarrelFile`, `performance/noReExportAll`

### Direct imports with explicit names

Import from the specific file path using named imports. Never use `import * as`.

```ts
// Good
import { foodSchema } from "@measure/shared/schemas/food";

// Bad
import { foodSchema } from "@measure/shared";
import * as schemas from "@measure/shared/schemas/food";
```

### Type imports

Use `import type` when importing only types.

```ts
import type { Food } from "@measure/shared/schemas/food";
```

## Git Workflow

Never commit directly to `main`. All changes go through branches and pull requests.

1. Create a branch from `main`: `git checkout -b feat/my-feature`
2. Make changes and commit
3. Push and open a PR: `git push -u origin feat/my-feature`
4. PR is reviewed, then squash merged to `main`

### Branch naming

Use prefixed branch names:

- `feat/` — new features (e.g., `feat/food-search`)
- `fix/` — bug fixes (e.g., `fix/weight-log-timezone`)
- `chore/` — tooling, deps, config (e.g., `chore/update-drizzle`)
- `docs/` — documentation changes

### Pull requests

- Keep PRs focused on a single change
- Include a summary and test plan in the PR description
- PRs are squash merged to `main`

## Updating a Shared Package

When you change code in a shared package (`packages/shared`, `packages/db`, `packages/ui`), here's what happens:

### During development

Nothing extra needed. Apps import directly from package source files via the `exports` map in each package's `package.json` — there's no intermediate build step. Vite (web) and tsx (API) resolve raw TypeScript directly, so changes are picked up instantly via HMR.

### During builds

Turborepo handles dependency ordering automatically. The `"dependsOn": ["^build"]` config in `turbo.json` means packages are always built before the apps that consume them.

### Typical workflow

1. Edit the schema/code in the shared package
2. TypeScript immediately flags any broken consumers in your editor
3. Fix the consumers
4. `pnpm lint` and `pnpm test` to verify
5. Commit the package change and consumer updates together as one atomic commit

### Adding a new export to an existing package

When you add a new file to a package, you must add it to the `exports` map in that package's `package.json`:

```json
"exports": {
  "./schemas/food": "./src/schemas/food.ts",
  "./schemas/newThing": "./src/schemas/newThing.ts"
}
```

Consumers can then import from it immediately:

```ts
import { something } from "@measure/shared/schemas/newThing";
```

## Adding a New Package

1. Create the directory under `packages/` or `apps/`
2. Add a `package.json` with an `exports` map (not `main`/`types`)
3. Add a `tsconfig.json` extending `../../tsconfig.base.json`
4. Add the package as a dependency where needed: `"@measure/new-pkg": "workspace:*"`
5. Run `pnpm install` to link it

## Adding a New Zod Schema

1. Create the file in `packages/shared/src/schemas/`
2. Add the export path to `packages/shared/package.json` `exports` map
3. Import directly from the new path in consumers

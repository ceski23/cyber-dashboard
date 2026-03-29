# Agent Development Guide — cyber-dashboard

**Stack:** TanStack Start (SSR), React 19, TypeScript 5.9, Bun, Vite, Vanilla Extract, better-auth, TanStack Query  
**NEVER COMMIT** — do not create git commits under any circumstances.

---

## Quick Commands

```bash
bun run dev            # Dev server on port 3000
bun run build          # Production build
bun run typecheck      # tsc --noEmit (catch type errors without building)
bun run lint           # oxlint (type-aware)
bun run lint:fix       # Auto-fix lint issues
bun run format         # oxfmt --write
bun run format:check   # Check formatting only
bun run generate:schema  # Regenerate config.schema.json from Zod schema
```

Pre-commit (husky enforced): `bun run lint && bun run format:check`

---

## Architecture Overview

This is a **homelab dashboard** rendered via TanStack Start (SSR). Widgets, config, and status data all flow server→client via server functions and TanStack Query streaming.

### Config System (`src/lib/config/`)

Dashboard is configured from a file at the project root (`config.jsonc`, `config.json`, `config.yaml`, or `config.yml`), with env variable overrides via `CONFIG_` prefix. Config is parsed and validated against `configSchema` (Zod, in `src/lib/config/schema.ts`) and cached server-side via `createServerOnlyFn`. Auth mode (basic or OIDC) and status providers are declared in this config, not in `.env`.

```bash
# Regenerate config.schema.json after editing schema.ts
bun run generate:schema
```

### Widget System (`src/widgets/`)

All widgets follow the same two-file pattern:

**`schema.ts`** — define options using `defineWidgetOptions(type, zodSchema)`:

```typescript
export const myWidgetOptions = defineWidgetOptions(
	'my-widget',
	z.strictObject({
		someField: z.string(),
	}),
)
```

**`index.tsx`** — register using `defineWidget({ type, optionsSchema, Component, provideLinks? })`:

```typescript
export const myWidget = defineWidget({
type: 'my-widget',
optionsSchema: myWidgetOptions,
Component: ({ options, columns }) => <div style={{ gridColumn: `span ${columns ?? 1}` }}>...</div>,
	// Optional: expose links to the Command Palette
	provideLinks: ({ url, name, icon }) => [{ type: 'Category', label: name, url, icon }],
})
```

`provideLinks` feeds the Command Palette — return an array of `{ type, label, url, icon? }` to make the widget's target URL discoverable via the palette. See `src/widgets/serviceLink/index.tsx` for a real example.

Server functions that stream use `async function*` generators. Client-side consumption uses `experimental_streamedQuery` from TanStack Query:

```typescript
// Server (inside createServerFn handler):
handler: async function* ({ data }) {
	while (!signal.aborted) {
		yield someData
		await Bun.sleep(interval)
	}
}

// Client:
queryFn: experimental_streamedQuery({
initialValue: [],
reducer: (_prev, next) => next,
	streamFn: ({ signal }) => myServerFn({ data: { ... }, signal }),
})
```

See `src/widgets/cpuLoad/index.tsx` and `src/services/status/index.ts` for full examples.

### Status Providers (`src/services/status/`)

Pluggable backends (docker, gatus, ping) returning `ServiceStatus[]`. The `streamStatus` server function dispatches to the correct provider based on `config.statusProviders[name].type`. Widget instances reference providers by name via `status.provider`.

### Authentication (`src/lib/auth/`)

Auth is **config-driven** — instantiated at runtime from `config.auth` (not hardcoded env vars). Supports `basic` or `oidc`. `tanstackStartCookies()` **must be the last plugin** in the better-auth plugins array.

---

## Styling

**Vanilla Extract only.** All styles are written in `.css.ts` files — any Tailwind `className` usage in the codebase is a leftover being removed, do not add new Tailwind classes.

Theme tokens live in `src/theme.css.ts` (`vars.color.*`, `vars.spacing.*`, `vars.text.*`, `vars.radius.*`, etc.). Always reference `vars` — never hardcode values in `.css.ts` files. See `.agents/skills/vanilla-extract/SKILL.md` for more information.

```typescript
// src/components/MyWidget.css.ts
import { style } from '@vanilla-extract/css'
import { vars } from '#theme.css'

export const root = style({
	background: vars.color.backgroundAlt,
	borderRadius: vars.radius.md,
	color: vars.color.foreground,
})
```

Import the class name into the component:

```typescript
import * as styles from './MyWidget.css'
// or for module CSS:
import style from './myWidget.module.css'
```

---

## Design Guidelines

Refer to `DESIGN.md` for detailed design guidelines, including visual style, color usage, typography, and code style conventions.

---

## Code Style (oxlint + oxfmt enforced)

- **`type` not `interface`** — oxlint enforced
- **Arrow function expressions**, not function declarations
- **Tabs** for indentation, single quotes (except JSX), 120-char line width
- **`#...` package subpath imports** for `src/` modules (e.g. `#lib/*`, `#components/*`, `#widgets`) — oxfmt auto-sorts imports into groups
- `noUnusedLocals`/`noUnusedParameters` strict — prefix intentionally unused with `_`
- `vite-plugin-circular-dependency` is active — avoid circular imports between modules
- `src/components/ui/*` (shadcn/ui) is excluded from oxlint
- **Don't use single-letter variable names** (e.g. `e`, `i`, `d`) — be descriptive for readability, even in small scopes like array methods

---

## Key Files

| File                       | Purpose                                          |
| -------------------------- | ------------------------------------------------ |
| `src/lib/config/schema.ts` | Master Zod schema for `config.jsonc`             |
| `src/widgets/helpers.ts`   | `defineWidget` / `defineWidgetOptions` factories |
| `src/widgets/index.ts`     | Widget registry (add new widgets here)           |
| `src/widgets/schemas.ts`   | Zod union of all widget option schemas           |
| `src/theme.css.ts`         | Vanilla Extract global theme tokens              |
| `src/routeTree.gen.ts`     | **Auto-generated** — never edit manually         |
| `config.jsonc`             | Live dashboard configuration (project root)      |

---

## File Structure

```
src/
  routes/           # TanStack file-based routing (createFileRoute)
  components/       # Reusable UI components
    ui/             # shadcn/ui (linting excluded)
  widgets/          # One folder per widget type: index.tsx + schema.ts
  services/         # Server-side data providers (status, location)
  lib/
    auth/           # better-auth setup (config-driven, not env-driven)
    config/         # Config loading, schema, server middleware
    utils/          # Shared utilities
  theme.css.ts      # Global Vanilla Extract theme tokens
  styles.css        # Global CSS reset
```

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, but it invokes Vite through `vp dev` and `vp build`.

## Vite+ Workflow

`vp` is a global binary that handles the full development lifecycle. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

### Start

- create - Create a new project from a template
- migrate - Migrate an existing project to Vite+
- config - Configure hooks and agent integration
- staged - Run linters on staged files
- install (`i`) - Install dependencies
- env - Manage Node.js versions

### Develop

- dev - Run the development server
- check - Run format, lint, and TypeScript type checks
- lint - Lint code
- fmt - Format code
- test - Run tests

### Execute

- run - Run monorepo tasks
- exec - Execute a command from local `node_modules/.bin`
- dlx - Execute a package binary without installing it as a dependency
- cache - Manage the task cache

### Build

- build - Build for production
- pack - Build libraries
- preview - Preview production build

### Manage Dependencies

Vite+ automatically detects and wraps the underlying package manager such as pnpm, npm, or Yarn through the `packageManager` field in `package.json` or package manager-specific lockfiles.

- add - Add packages to dependencies
- remove (`rm`, `un`, `uninstall`) - Remove packages from dependencies
- update (`up`) - Update packages to latest versions
- dedupe - Deduplicate dependencies
- outdated - Check for outdated packages
- list (`ls`) - List installed packages
- why (`explain`) - Show why a package is installed
- info (`view`, `show`) - View package information from the registry
- link (`ln`) / unlink - Manage local package links
- pm - Forward a command to the package manager

### Maintain

- upgrade - Update `vp` itself to the latest version

These commands map to their corresponding tools. For example, `vp dev --port 3000` runs Vite's dev server and works the same as Vite. `vp test` runs JavaScript tests through the bundled Vitest. The version of all tools can be checked using `vp --version`. This is useful when researching documentation, features, and bugs.

## Common Pitfalls

- **Using the package manager directly:** Do not use pnpm, npm, or Yarn directly. Vite+ can handle all package manager operations.
- **Always use Vite commands to run tools:** Don't attempt to run `vp vitest` or `vp oxlint`. They do not exist. Use `vp test` and `vp lint` instead.
- **Running scripts:** Vite+ built-in commands (`vp dev`, `vp build`, `vp test`, etc.) always run the Vite+ built-in tool, not any `package.json` script of the same name. To run a custom script that shares a name with a built-in command, use `vp run <script>`. For example, if you have a custom `dev` script that runs multiple services concurrently, run it with `vp run dev`, not `vp dev` (which always starts Vite's dev server).
- **Do not install Vitest, Oxlint, Oxfmt, or tsdown directly:** Vite+ wraps these tools. They must not be installed directly. You cannot upgrade these tools by installing their latest versions. Always use Vite+ commands.
- **Use Vite+ wrappers for one-off binaries:** Use `vp dlx` instead of package-manager-specific `dlx`/`npx` commands.
- **Import JavaScript modules from `vite-plus`:** Instead of importing from `vite` or `vitest`, all modules should be imported from the project's `vite-plus` dependency. For example, `import { defineConfig } from 'vite-plus';` or `import { expect, test, vi } from 'vite-plus/test';`. You must not install `vitest` to import test utilities.
- **Type-Aware Linting:** There is no need to install `oxlint-tsgolint`, `vp lint --type-aware` works out of the box.

## CI Integration

For GitHub Actions, consider using [`voidzero-dev/setup-vp`](https://github.com/voidzero-dev/setup-vp) to replace separate `actions/setup-node`, package-manager setup, cache, and install steps with a single action.

```yaml
- uses: voidzero-dev/setup-vp@v1
  with:
      cache: true
- run: vp check
- run: vp test
```

## Review Checklist for Agents

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to validate changes.
  <!--VITE PLUS END-->

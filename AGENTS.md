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
import { vars } from '@/theme.css'

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

## Code Style (oxlint + oxfmt enforced)

- **`type` not `interface`** — oxlint enforced
- **Arrow function expressions**, not function declarations
- **Tabs** for indentation, single quotes (except JSX), 120-char line width
- **`@/*` import alias** for `src/` — oxfmt auto-sorts imports into groups
- `noUnusedLocals`/`noUnusedParameters` strict — prefix intentionally unused with `_`
- `vite-plugin-circular-dependency` is active — avoid circular imports between modules
- `src/components/ui/*` (shadcn/ui) is excluded from oxlint

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

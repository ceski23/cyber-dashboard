---
description: 'Scaffold a new dashboard widget — schema, component, styles, and registration — for a specified service or data source.'
---

Read [AGENTS.md](../../AGENTS.md) in full before proceeding — it is the authoritative guide for this codebase.

## Task

Create a fully working widget for: **$ARGUMENTS**

## Required Files

Every widget lives under `src/widgets/<widget-name>/`:

### 1. `schema.ts` — Options schema

Use `defineWidgetOptions(type, z.strictObject({ ... }))`. Add `.describe()` to every field. Use `z.url()` for URLs, not `z.string()`. Include `refreshInterval` with `ms` package defaults for polling widgets.

### 2. `index.tsx` — Widget definition and component

Use `defineWidget({ type, optionsSchema, Component, provideLinks?, loader? })`.

- Destructure `{ options: { ... }, columns }` from props
- Apply `style={{ gridColumn: \`span ${columns ?? 1}\` }}` to outermost element
- Streaming data: use `createServerFn` with `async function*` generator + `experimental_streamedQuery` on client
- Static data: use regular `createServerFn` + standard `queryOptions`
- Use `lucide-react` for icons, never Tailwind classes
- `throw` errors rather than inline error states

Add `provideLinks` if the widget links to an external service URL.

### 3. `style.css.ts` — Vanilla Extract styles

- Import `vars` from `#theme.css` — never hardcode colors/spacing/radii
- Use `transparentize` from `#lib/utils/style` for semi-transparent colors
- Use `recipe` from `@vanilla-extract/recipes` for variant styles
- Glassmorphism base: `background: vars.color.panel`, `backdropFilter: 'blur(10px)'`, `border: 1px solid ${vars.color.borderSubtle}`, `borderRadius: vars.radius.xl`, `overflow: hidden`
- Standard padding: `vars.spacing[5]` inline, `vars.spacing[3]` block
- Common dimensions: `height: vars.spacing[32]` (compact), `vars.spacing[64]` (tall)
- Status dots: background color + `boxShadow` glow ring, not flat circles
- Hover: `transform: translateY(-2px)`, `borderColor`, transition on all animated props
- Always include `overflow: hidden` on root

## Visual Design Reference

See `DESIGN.md` for full design guidelines. Key points:

- **Glassmorphism** — frosted-glass panels on gradient background
- **Typography** — primary value `vars.text['4xl']` weight 700; label `vars.text.sm` weight 500-600; meta `vars.text.xs` weight 400; badge `vars.text.xxs` uppercase
- **Accent glows** — radial corner gradients or edge linear washes, always `position: absolute`, `pointerEvents: none`
- **Chart overlays** — ambient background charts at `opacity: 0.4` with mask gradients

## Registration

After creating the widget files, register in two places:

### `src/widgets/index.ts`

Add the import and register in the `widgets` object: `[myWidget.type]: myWidget`.

### `src/widgets/schemas.ts`

Add the options schema import and append to the `widgetsSchema` union.

## External API Integration

- Validate external API responses with Zod inside the server function
- Use `ky` for HTTP requests (already a dependency)
- Store validation schema near the server function, not exported to client
- If the service has a well-known icon on `cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons`, use it

## Validation

After creating all files, run:

```bash
bun run typecheck && bun run lint
```

Fix any type errors before finishing. Do not run `bun run build`.

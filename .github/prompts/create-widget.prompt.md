---
description: 'Scaffold a new dashboard widget — schema, component, styles, and registration — for a specified service or data source.'
agent: 'agent'
argument-hint: "Widget name or service (e.g. 'Proxmox CPU widget', 'Uptime Kuma status widget')"
---

You are implementing a new widget for the **cyber-dashboard** homelab dashboard.
Read [AGENTS.md](../../AGENTS.md) in full before proceeding — it is the authoritative guide for this codebase.

## Task

Create a fully working widget for: **$ARGUMENTS**

## Required Files

Every widget lives under `src/widgets/<widget-name>/` and consists of exactly three files:

### 1. `schema.ts` — Options schema

```typescript
import { z } from 'zod'
import { defineWidgetOptions } from '../helpers'

export const myWidgetOptions = defineWidgetOptions(
	'my-widget',
	z.strictObject({
		// Widget-specific options with .describe() on every field
	}),
)
```

- Use `z.strictObject` (not `z.object`)
- Add `.describe('...')` to every field — these become JSON Schema docs
- Include `refreshInterval` (default 5000ms, min 1000ms) for any polling/streaming widget
- Use `z.url()` for URLs, not `z.string()`

### 2. `index.tsx` — Widget definition and component

Use `defineWidget({ type, optionsSchema, Component, provideLinks?, loader? })`.

**For widgets that fetch remote data**, use a streaming server function:

```typescript
const streamMyData = createServerFn({ method: 'GET' })
	.inputValidator(z.object({ ... }))
	.handler(async function* ({ data }) {
		const { signal } = getRequest()
		while (!signal.aborted) {
			yield fetchSomeData()
			await Bun.sleep(data.refreshInterval)
		}
	})

const myDataQuery = (param: string, refreshInterval: number) =>
	queryOptions({
		queryKey: ['myData', { param, refreshInterval }] as const,
		queryFn: experimental_streamedQuery({
			initialValue: [] as MyDataType[],
			reducer: (_, chunk: MyDataType[]) => chunk,
			streamFn: ({ signal }) => streamMyData({ data: { param, refreshInterval }, signal }),
		}),
	})
```

**For static/one-time fetches**, use a regular `createServerFn` (not a generator) with standard `queryOptions`.

**Component rules:**

- Always apply `style={{ gridColumn: \`span ${columns ?? 1}\` }}` to the outermost element
- Destructure `{ options: { ... }, columns }` from props
- `throw` errors rather than rendering inline error states (TanStack Router handles boundaries)
- Use `lucide-react` for icons
- Never use Tailwind classes
- Follow the common layout pattern: header row (icon badge + label + meta) → main value/content

**Add `provideLinks`** if the widget links to an external service URL:

```typescript
provideLinks: ({ url, name, icon }) => [{ type: 'Services', label: name, url, icon }],
```

### 3. `style.css.ts` — Vanilla Extract styles

```typescript
import { vars } from '#theme.css'
import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const styles = {
	root: style({
		position: 'relative',
		borderRadius: vars.radius.xl,
		border: `1px solid ${vars.color.borderSubtle}`,
		background: vars.color.panel,
		backdropFilter: 'blur(10px)',
		// ...
	}),
}
```

**Rules:**

- Import `vars` from `#theme.css` — never hardcode colors, spacing, or radii
- Use `transparentize` from `#lib/utils/style` for semi-transparent colors
- Use `recipe` from `@vanilla-extract/recipes` for conditional/variant styles
- Common panel dimensions: `height: vars.spacing[32]` (128px) for compact, `vars.spacing[64]` (256px) for tall
- Standard padding: `vars.spacing[5]` (20px) inline, `vars.spacing[3]` (12px) block

## Visual Design Guidelines

The dashboard has a **glassmorphism** aesthetic on a multi-stop gradient background. Every widget must feel like a frosted-glass panel floating above the page — light, airy, never dense.

### The Glassmorphism Base

Every widget root **must** have all three of these properties:

```typescript
root: style({
	background: vars.color.panel, // semi-transparent (~55% on dark)
	backdropFilter: 'blur(10px)', // the core frosted-glass effect
	border: `1px solid ${vars.color.borderSubtle}`, // hairline border
	borderRadius: vars.radius.xl,
	overflow: 'hidden', // keep gradients/charts inside the radius
})
```

Use `blur(20px)` and `borderRadius: vars.radius['2xl']` for larger/featured widgets (weather, air quality style). Always include `overflow: hidden` on the root — without it, gradients and chart overlays bleed outside the border-radius.

### Accent Glows and Color Washes

Use subtle color to communicate state — never solid fills. Two main patterns:

**Radial corner glow** (ambient accent — weather, air quality):

```typescript
glow: style({
	position: 'absolute',
	top: 0,
	right: 0,
	width: '100%',
	height: '100%',
	background: `radial-gradient(ellipse at 0% 0%, ${transparentize(accentColor, 0.2)} 0%, transparent 70%)`,
	pointerEvents: 'none',
	zIndex: 0,
	transition: 'background 0.4s ease',
})
```

**Edge linear wash** (status indication — service links):

```typescript
background: `linear-gradient(to right, transparent 60%, ${transparentize(vars.color.success, 0.1)}), ${vars.color.panel}`,
```

Both are `position: absolute`, `zIndex: 0`, `pointerEvents: none`. The real content sits above at `position: relative`.

### Background Chart Overlays

Area/line charts used as background texture should be ambient, not the primary data carrier:

```typescript
chartOverlay: style({
	position: 'absolute',
	inset: 0,
	pointerEvents: 'none',
	zIndex: 0,
	opacity: 0.4,
	// fades the chart on the left so it doesn't compete with the primary value
	maskImage: 'linear-gradient(to right, transparent, transparent 140px, black 240px)',
})
```

### Status Dots

Colored dots with a matching glow ring — never plain flat circles:

```typescript
available: {
	backgroundColor: vars.color.success,
	boxShadow: `0 0 5px ${transparentize(vars.color.success, 0.6)}`,
},
pending: {
	backgroundColor: vars.color.foregroundMuted,
	animation: `${pulse} 1.5s ease-in-out infinite`,  // pulse keyframe, not a different color
},
```

### Hover and Interaction

Clickable widget cards must lift on hover:

```typescript
':hover': {
	borderColor: vars.color.border,
	transform: 'translateY(-2px)',
	boxShadow: vars.shadow.panel,
}
```

Row-level hover within a list: `background: transparentize(vars.color.foreground, 0.05)` — no transform.

Always declare `transition` for every animated property: `'border-color 0.2s ease, background 0.2s ease, transform 0.15s ease'`.

### Typography Hierarchy

| Role                           | Size               | Weight                                    | Color                        |
| ------------------------------ | ------------------ | ----------------------------------------- | ---------------------------- |
| Primary value (the big number) | `vars.text['4xl']` | 700                                       | `vars.color.foreground`      |
| Widget name / section label    | `vars.text.sm`     | 500–600                                   | `vars.color.foregroundAlt`   |
| Secondary / meta (unit, speed) | `vars.text.xs`     | 400                                       | `vars.color.foregroundMuted` |
| Tiny badge / uppercase label   | `vars.text.xxs`    | 600, uppercase, `letterSpacing: '0.08em'` | `vars.color.foregroundMuted` |

All numbers: `fontVariantNumeric: 'tabular-nums'`.

### Icon Badge (widget header)

```typescript
iconBadge: style({
	width: '30px',
	height: '30px',
	borderRadius: vars.radius.md,
	background: transparentize(vars.color.background, 0.4),
	border: `1px solid ${vars.color.border}`,
	color: vars.color.foregroundMuted,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexShrink: 0,
})
```

Use `lucide-react` icons at `size={16}` inside.

### Secondary Panel (stat chips / sub-sections)

For grouped stats or sub-cards inside a widget:

```typescript
statItem: style({
	padding: `${vars.spacing[2]} ${vars.spacing[3]}`,
	background: transparentize(vars.color.white, 0.03),
	borderRadius: vars.radius.lg,
	border: `1px solid ${transparentize(vars.color.white, 0.05)}`,
})
```

### What to Avoid

- **Density** — never pack more than 3–4 stats into a compact widget; use `gap: vars.spacing[4]` between sections and breathe
- **Flat opaque backgrounds** — always `vars.color.panel` (semi-transparent) + `backdropFilter`; never a fully opaque solid
- **Raw color literals** — no hex/rgb/oklch strings in `.css.ts` files; everything through `vars` or `transparentize`
- **Tables** — never `<table>`; use flex/grid rows
- **Missing `overflow: hidden`** — gradients and charts bleed outside border-radius without it
- **Silent loading states** — always show a skeleton or an empty/muted message while data loads; never render partial null data
- **Sharp corners** — minimum `vars.radius.xl` on the widget root, `vars.radius.md` on inner elements
- **Abrupt state changes** — all color/border/background changes must use transitions

## Registration (after creating the 3 files)

### `src/widgets/index.ts`

Add the import and register the widget in the `widgets` object:

```typescript
import { myWidget } from './myWidget'
// ...
export const widgets = {
	// existing entries...
	[myWidget.type]: myWidget,
}
```

### `src/widgets/schemas.ts`

Add the options schema to the union:

```typescript
import { myWidgetOptions } from './myWidget/schema'
// ...
export const widgetsSchema = z.union([
	// existing schemas...
	myWidgetOptions,
])
```

## External API Integration

- Validate all external API responses with Zod schemas inside the server function
- Use `ky` for HTTP requests (already a dependency), not `fetch`
- Store the Zod validation schema near the server function, not exported to the client
- If the service has a well-known icon on `cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons`, use it

## Validation

After creating all files, run:

```bash
bun run typecheck && bun run lint
```

Fix any type errors before finishing. Do not run `bun run build` — typecheck is sufficient.

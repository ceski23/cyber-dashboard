# Agent Development Guide - cyber-dashboard-v2

**Project:** Homelab Dashboard with TanStack Start, better-auth, and React  
**Tech Stack:** TanStack Start, React 19, TypeScript 5.9, Bun, Vite, TailwindCSS, oxlint, oxfmt  
**Last Updated:** 2026-02-01

---

## Quick Commands

### Development & Building

```bash
# Start dev server (port 3000)
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

### Linting & Formatting

```bash
# Run oxlint (linter based on rust-analyzer)
bun run lint

# Auto-fix linting issues
bun run lint:fix

# Format code with oxfmt
bun run format

# Check formatting without modifying
bun run format:check

# Run both lint and format checks (pre-commit hook)
bun run lint && bun run format:check
```

### Package Management

```bash
# Install dependencies
bun install

# Add dependency
bun add <package>

# Add dev dependency
bun add -d <package>
```

### shadcn/ui Components

```bash
# Add a new component (use bun dlx, not pnpm dlx)
bun dlx shadcn@latest add <component-name>

# Example: Add button component
bun dlx shadcn@latest add button
```

---

## Code Style Guidelines

### Linting & Formatting Configuration

**Linter:** oxlint (rust-analyzer based, faster than ESLint)

- Enforced rules: `typescript/consistent-type-definitions` (use `type`, not `interface`)
- Arrow functions: must use arrow body style when possible (`=>` not `{}`)
- Function style: must use function expressions, not declarations
- React rules: `react/recommended`, `react-hooks/recommended`, `react-perf`
- Ignored: `src/components/ui/*` (shadcn/ui components)

**Formatter:** oxfmt (Rust-based formatter)

- Line width: 120 characters
- Indentation: tabs (width 4)
- Quotes: single (except JSX where double)
- Trailing commas: all
- Imports: auto-sorted by oxfmt groups (side-effect → builtin → external → internal → parent → sibling → index)
- Tailwind: auto-sorts classes in `className` and `class` attributes

### TypeScript & Imports

- **Module Resolution:** Paths use `@/*` alias (e.g., `@/components/Header`)
- **Strict Mode:** TypeScript strict mode enabled - all types required
- **No Unused Vars:** Both `noUnusedLocals` and `noUnusedParameters` enforced
- **Type Definitions:** Use `type`, not `interface` (oxlint enforced)
- **Import Order:** Automatically sorted by oxfmt into groups:
    1. Side-effect imports
    2. Builtin imports
    3. External/third-party imports
    4. Internal imports (`@/*`)
    5. Parent imports (`../`)
    6. Sibling imports (`./`)
    7. Index imports

```typescript
// Correct pattern (oxfmt will auto-sort)
import { createFileRoute } from '@tanstack/react-router'
import { betterAuth } from 'better-auth'

import { auth } from '@/lib/auth'
import Header from '@/components/Header'

import { someHelper } from './utils'
```

### File & Folder Structure

- **Routes:** `src/routes/*.tsx` (TanStack Router file-based routing)
- **Components:** `src/components/*.tsx` (UI components)
- **UI Components:** `src/components/ui/*.tsx` (shadcn/ui components)
- **Libraries:** `src/lib/*.ts` (utilities, auth, config)
- **Styles:** `src/styles.css` (global Tailwind styles)

### Component Patterns

**React Components (TSX):**

- Use arrow function expressions (oxlint enforced)
- Define types at top of file
- Avoid `any` type - be explicit

```typescript
import { createFileRoute } from '@tanstack/react-router'

type MyComponentProps = {
	title: string
	count: number
}

export const Route = createFileRoute('/path')({
	component: MyComponent,
})

const MyComponent = ({ title, count }: MyComponentProps) => (
	<div className="space-y-4">
		<h1>{title}</h1>
		<p>{count}</p>
	</div>
)
```

**Server Functions (TanStack Start):**

```typescript
import { createServerFn } from '@tanstack/react-start'

export const myServerFn = createServerFn({ method: 'GET' }).handler(async () => {
	// Server-side only code
	return { data: 'value' }
})
```

### Styling

- **Framework:** TailwindCSS v4 via `@tailwindcss/vite` plugin
- **Classes:** Use Tailwind utility classes directly in JSX
- **Class Sorting:** oxfmt auto-sorts Tailwind classes in `className` and `class` attributes
- **Global Styles:** Add to `src/styles.css` if needed
- **Animations:** Use `tw-animate-css` library for CSS animations

```tsx
// Tailwind class usage (oxfmt will auto-sort classes)
<div className="min-h-screen bg-gray-900 p-6">
	<h1 className="text-3xl font-bold text-white">Title</h1>
</div>
```

### Type Safety

- Always use TypeScript for new files (`.tsx` for React, `.ts` for utilities)
- Use `type` keyword for type definitions (not `interface` - oxlint enforced)
- Use Zod for runtime validation (already in dependencies)
- Define types at top of component files or in separate `types/` files
- Avoid `any` type - be explicit about types

```typescript
type MyComponentProps = {
	title: string
	count: number
	onSubmit: (value: string) => void
}

const MyComponent = ({ title, count, onSubmit }: MyComponentProps) => {
	// ...
}
```

### Error Handling

- Use try-catch for async operations
- Provide user-friendly error messages in UI
- Log errors to console in development with descriptive context
- For server functions, throw errors that will be caught client-side
- Never silence errors silently - always log or propagate
- Use `console.error()` for errors, `console.warn()` for warnings

```typescript
try {
	const result = await serverFunction()
	// handle success
} catch (error) {
	console.error('Operation failed:', error instanceof Error ? error.message : String(error))
	// show error UI to user
	throw error // propagate if needed
}
```

### Naming Conventions

- **Files:** PascalCase for components (e.g., `Header.tsx`, `Card.tsx`)
- **Functions:** camelCase for utilities (e.g., `formatDate()`, `getUserData()`)
- **Constants:** UPPER_SNAKE_CASE for constants (e.g., `MAX_RETRIES`, `API_BASE_URL`)
- **React Components:** PascalCase (e.g., `const MyComponent = ...`)
- **Hooks:** camelCase starting with `use` (e.g., `useAuth()`, `useLocalStorage()`)
- **Private functions:** prefix with underscore if needed (e.g., `_internalHelper()`)
- **Boolean variables:** prefix with `is`, `has`, `can`, `should` (e.g., `isLoading`, `hasError`)

---

## Project-Specific Patterns

### Authentication (better-auth + TanStack Start)

The project uses **better-auth** with OIDC/OAuth2 for authentication.

**Key Files:**

- `src/lib/auth/index.ts` - Server auth config
- `src/lib/auth/client.ts` - Client auth config
- `src/lib/auth/middleware.ts` - Route protection
- `src/routes/api/auth/$.ts` - Auth handler

**Protected Routes Pattern:**

```typescript
import { authMiddleware } from '@/lib/auth/middleware'

export const Route = createFileRoute('/')({
	component: Dashboard,
	server: {
		middleware: [authMiddleware], // Protects this route
	},
})
```

**CRITICAL:** `tanstackStartCookies()` plugin **MUST** be the last plugin in the auth config's plugins array.

### File Structure

- **Routes:** `src/routes/*.tsx` (TanStack Router file-based routing)
- **Components:** `src/components/*.tsx` (Reusable UI components)
- **UI Components:** `src/components/ui/*.tsx` (shadcn/ui components)
- **Widgets:** `src/widgets/*.tsx` (Page-specific composed components)
- **Libraries:** `src/lib/*.ts` (utilities, auth, config)
- **Types:** `src/types/*.ts` (Shared type definitions)
- **Styles:** `src/styles.css` (global Tailwind styles)

### Environment Variables

Located in `.env` (gitignored). Template: `.env.example`

**Required Variables:**

```bash
BETTER_AUTH_SECRET      # Generate: openssl rand -base64 32
BETTER_AUTH_URL         # http://localhost:3000
OIDC_ISSUER             # OIDC provider issuer URL
OIDC_CLIENT_ID          # From OIDC provider
OIDC_CLIENT_SECRET      # From OIDC provider
```

**Accessing in Code:**

```typescript
// Server-side only
import { serverEnv } from '@/env'
const secret = serverEnv.BETTER_AUTH_SECRET
```

---

## Development Workflow

### Before Committing

Always run the pre-commit checks:

```bash
bun run lint && bun run format:check
```

These are enforced by husky hooks. To auto-fix issues:

```bash
bun run lint:fix && bun run format
```

### Common Development Tasks

**Adding a New Page:**

1. Create `src/routes/mypage.tsx`
2. Use file-based routing pattern
3. Import middleware if auth needed
4. Export `Route` created with `createFileRoute`

**Adding a New Component:**

1. Create `src/components/MyComponent.tsx`
2. Define `type MyComponentProps = { ... }`
3. Use TypeScript types throughout
4. Run `bun run format` before committing

**Adding shadcn/ui Components:**

```bash
bun dlx shadcn@latest add card button alert
```

Import and use:

```typescript
import { Card, CardContent, CardHeader } from '@/components/ui/card'
```

---

## Troubleshooting

| Error                      | Solution                                           |
| -------------------------- | -------------------------------------------------- |
| `Module not found '@/...'` | Check `tsconfig.json` paths alias                  |
| `unused variable`          | Remove or prefix with `_` if intentional           |
| Type errors                | Run `bun run build` to catch TypeScript errors     |
| Formatting issues          | Run `bun run format` to auto-fix                   |
| Linting issues             | Run `bun run lint:fix` to auto-fix                 |
| Pre-commit hook fails      | Run `bun run lint && bun run format:check` locally |

---

## Important Notes

0. **NEVER COMMIT:** Under no cirricumstances you should commit any changes, your job is not creating commits. FORBIDDEN!
1. **Bun Runtime:** Project uses Bun as package manager and runtime
2. **SSR Ready:** TanStack Start enables server-side rendering with built-in hydration
3. **Server Functions:** Use `createServerFn()` for secure server-only operations
4. **Route Tree:** Auto-generated in `src/routeTree.gen.ts` - never edit manually
5. **Devtools:** React Router and Query devtools included in dev mode only
6. **Pre-commit Hooks:** oxlint and oxfmt checks are required before committing
7. **Type Checking:** Strict TypeScript mode enforced - resolve all type errors before building

---

**For architecture details, see IMPLEMENTATION_PLAN.md**

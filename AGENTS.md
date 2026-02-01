# Agent Development Guide - cyber-dashboard-v2

**Project:** Homelab Dashboard with TanStack Start, better-auth, and React  
**Tech Stack:** TanStack Start, React 19, TypeScript 5.9, Bun, Vite, TailwindCSS  
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

### TypeScript & Imports

- **Module Resolution:** Paths use `@/*` alias (e.g., `@/components/Header`)
- **Strict Mode:** TypeScript strict mode enabled - all types required
- **No Unused Vars:** Both `noUnusedLocals` and `noUnusedParameters` enforced
- **Import Order:** Group imports (React/third-party → @/ imports → relative)

```typescript
// Correct pattern
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

```typescript
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/path')({
  component: MyComponent,
})

function MyComponent() {
  return <div>Content</div>
}
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
- **Global Styles:** Add to `src/styles.css` if needed
- **Animations:** Use `tw-animate-css` library for CSS animations

```tsx
// Tailwind class usage
<div className="min-h-screen bg-gray-900 p-6">
	<h1 className="text-3xl font-bold text-white">Title</h1>
</div>
```

### Type Safety

- Always use TypeScript for new files (`.tsx` for React, `.ts` for utilities)
- Use Zod for runtime validation (already in dependencies)
- Define interfaces at top of component files
- Avoid `any` type - be explicit about types

```typescript
interface MyProps {
	title: string
	count: number
	onSubmit: (value: string) => void
}

function MyComponent({ title, count, onSubmit }: MyProps) {
	// ...
}
```

### Error Handling

- Use try-catch for async operations
- Provide user-friendly error messages in UI
- Log errors to console in development
- For server functions, throw errors that will be caught client-side

```typescript
try {
	const result = await serverFunction()
	// handle success
} catch (error) {
	console.error('Operation failed:', error)
	// show error UI to user
}
```

### Naming Conventions

- **Files:** PascalCase for components (e.g., `Header.tsx`, `Card.tsx`)
- **Functions:** camelCase for utilities (e.g., `formatDate()`, `getUserData()`)
- **Constants:** UPPER_SNAKE_CASE for constants
- **React Components:** PascalCase (e.g., `function MyComponent()`)
- **Hooks:** camelCase starting with `use` (e.g., `useAuth()`)

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

**Important:** `tanstackStartCookies()` plugin **MUST** be the last plugin in the auth config's plugins array.

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

### Routing (TanStack Router)

- File-based routing in `src/routes/`
- Root route: `src/routes/__root.tsx`
- Index route: `src/routes/index.tsx`
- Nested routes: create subdirectories
- Dynamic segments: use `$param` syntax
- API routes: `src/routes/api/auth/$.ts`

---

## Common Development Tasks

### Adding a New Page

1. Create `src/routes/mypage.tsx`
2. Use the file-based routing pattern
3. Import middleware if auth is needed
4. Export `Route` created with `createFileRoute`

### Adding a New Component

1. Create `src/components/MyComponent.tsx`
2. Define props interface
3. Use TypeScript types throughout
4. Export as default or named export

### Adding a shadcn/ui Component

```bash
bun dlx shadcn@latest add card button alert
```

Then import and use:

```typescript
import { Card, CardContent, CardHeader } from '@/components/ui/card'
```

---

## Important Notes

1. **Bun Runtime:** Project uses Bun as package manager and runtime
2. **SSR Ready:** TanStack Start enables server-side rendering
3. **Streaming:** Use `createServerFn()` for server functions
4. **Type Generation:** Route tree auto-generated in `src/routeTree.gen.ts`
5. **Devtools:** React Router and Query devtools included in dev mode

---

## When You See Errors

| Error                      | Solution                                             |
| -------------------------- | ---------------------------------------------------- |
| `Module not found '@/...'` | Check tsconfig.json paths alias                      |
| `unused variable`          | Remove or prefix with `_` if intentional             |
| Type errors                | Run TypeScript in strict mode to catch early         |
| Import order issues        | Follow grouping: React → third-party → @/ → relative |

---

**For more details, see IMPLEMENTATION_PLAN.md**

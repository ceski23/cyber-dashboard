# Homelab Dashboard - Complete Implementation Plan

**Project:** cyber-dashboard-v2  
**Tech Stack:** TanStack Start (SSR), Bun, React, shadcn/ui, better-auth, TanStack Query  
**Last Updated:** 2026-01-31  
**Status:** ✅ All documentation validated against official sources

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Tech Stack & Key Features](#tech-stack--key-features)
4. [Project Structure](#project-structure)
5. [Implementation Phases](#implementation-phases)
6. [Better-Auth + TanStack Start Integration](#better-auth--tanstack-start-integration)
7. [Widget System](#widget-system)
8. [Data Streaming Architecture](#data-streaming-architecture)
9. [Configuration](#configuration)
10. [Docker Deployment](#docker-deployment)
11. [Dependencies](#dependencies)
12. [Timeline Estimate](#timeline-estimate)

---

## Overview

A modern, self-hosted homelab dashboard with:

- **Real-time metrics streaming** via async generators + TanStack Query's `streamedQuery`
- **Secure OIDC authentication** with better-auth SSO plugin
- **Extensible widget system** with auto-discovery
- **Configuration-driven** via `config.json` (no database for dashboard config)
- **Responsive grid layout** (4 cols mobile, 12 cols desktop)
- **Modern UI** with shadcn/ui components and minimal CSS animations
- **Docker-ready** with proper system mounts for metrics access

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Login Page   │  │  Dashboard   │  │   Widgets    │ │
│  │              │  │              │  │              │ │
│  │ authClient   │  │ Protected    │  │ streamedQuery│ │
│  │ .signIn.sso()│  │ Route        │  │ + buffer     │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│         │                 │                 │          │
└─────────┼─────────────────┼─────────────────┼──────────┘
          │                 │                 │
          │                 │                 │
┌─────────┼─────────────────┼─────────────────┼──────────┐
│         │   TanStack Start Server          │          │
│         │                 │                 │          │
│  ┌──────▼───────┐  ┌──────▼──────┐  ┌──────▼──────┐  │
│  │ /api/auth/$  │  │  Middleware  │  │  Widget     │  │
│  │              │  │              │  │  Server Fn  │  │
│  │ auth.handler │  │ getSession() │  │  async gen* │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                 │          │
│         │                 │                 │          │
│  ┌──────▼─────────────────▼─────────────────▼───────┐  │
│  │            Better-auth Core                      │  │
│  │  - tanstackStartCookies (cookie handling)        │  │
│  │  - sso (OIDC provider registration)              │  │
│  │  - SQLite session storage                        │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Data Flow for Streaming Widgets

```
Widget Component (Browser)
    │
    │ useQuery with streamedQuery
    │
    ▼
Server Function (async generator)
    │
    │ yield data at intervals
    │
    ▼
systeminformation package
    │
    │ reads from /host/proc, /host/sys
    │
    ▼
Host System Metrics
```

---

## Tech Stack & Key Features

### Core Technologies

| Technology         | Version | Purpose                                        |
| ------------------ | ------- | ---------------------------------------------- |
| **TanStack Start** | Latest  | Full-stack React framework with SSR            |
| **TanStack Query** | v5.56+  | Data fetching + streaming with `streamedQuery` |
| **Bun**            | Latest  | Runtime and package manager                    |
| **React**          | v18.3+  | UI framework                                   |
| **TypeScript**     | v5.6+   | Type safety                                    |
| **Zod**            | v3.23+  | Runtime validation                             |

### UI & Styling

| Technology       | Purpose                         |
| ---------------- | ------------------------------- |
| **shadcn/ui**    | Pre-built accessible components |
| **Tailwind CSS** | Utility-first styling           |
| **Lucide React** | Icon system                     |
| **Recharts**     | Data visualization              |

### Authentication

| Technology               | Purpose                            |
| ------------------------ | ---------------------------------- |
| **better-auth**          | Authentication framework           |
| **@better-auth/sso**     | OIDC/OAuth2 SSO plugin             |
| **tanstackStartCookies** | Cookie handling for TanStack Start |

### System Metrics

| Technology            | Purpose                       |
| --------------------- | ----------------------------- |
| **systeminformation** | Cross-platform system metrics |

### Deployment

| Technology         | Purpose                       |
| ------------------ | ----------------------------- |
| **Docker**         | Containerization              |
| **docker-compose** | Multi-container orchestration |

---

## Project Structure

```
cyber-dashboard-v2/
├── src/
│   ├── routes/                           # TanStack Start routes
│   │   ├── __root.tsx                    # Root with QueryClientProvider
│   │   ├── index.tsx                     # Dashboard (protected)
│   │   ├── login.tsx                     # Login page
│   │   └── api/
│   │       └── auth/
│   │           └── $.ts                  # Better-auth handler
│   │
│   ├── router.tsx                        # Router config (required)
│   │
│   ├── lib/
│   │   ├── auth.ts                       # Better-auth server config
│   │   ├── auth-client.ts                # Better-auth client config
│   │   ├── config.ts                     # config.json loader
│   │   ├── widget-registry.ts            # Widget auto-discovery
│   │   ├── setup-auth.ts                 # OIDC provider registration
│   │   └── middleware/
│   │       └── auth.ts                   # Auth middleware
│   │
│   ├── components/
│   │   ├── ui/                           # shadcn components
│   │   │   ├── card.tsx
│   │   │   ├── button.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── alert.tsx
│   │   ├── Dashboard.tsx                 # Main grid layout
│   │   ├── Widget.tsx                    # Widget wrapper
│   │   ├── ThemeProvider.tsx             # Theme context
│   │   ├── ThemeToggle.tsx               # Theme switcher
│   │   └── ServiceIcon.tsx               # Icon handler (Lucide + URL)
│   │
│   ├── widgets/
│   │   ├── CpuGraph/
│   │   │   ├── index.ts                  # Widget registration
│   │   │   ├── CpuGraph.tsx              # Component
│   │   │   ├── server.ts                 # Async generator server fn
│   │   │   └── schema.ts                 # Zod options schema
│   │   ├── MemoryGauge/
│   │   │   ├── index.ts
│   │   │   ├── MemoryGauge.tsx
│   │   │   ├── server.ts
│   │   │   └── schema.ts
│   │   ├── DiskUsage/
│   │   │   ├── index.ts
│   │   │   ├── DiskUsage.tsx
│   │   │   ├── server.ts
│   │   │   └── schema.ts
│   │   ├── NetworkStats/
│   │   │   ├── index.ts
│   │   │   ├── NetworkStats.tsx
│   │   │   ├── server.ts
│   │   │   └── schema.ts
│   │   ├── LinkCard/
│   │   │   ├── index.ts
│   │   │   ├── LinkCard.tsx              # Static widget (no server.ts)
│   │   │   └── schema.ts
│   │   └── index.ts                      # Auto-discovery exports
│   │
│   ├── types/
│   │   ├── config.ts                     # Config Zod schema & types
│   │   └── widget.ts                     # Widget interfaces
│   │
│   └── utils/
│       └── cn.ts                         # Tailwind class merger
│
├── data/
│   └── auth.db                           # SQLite sessions (runtime)
│
├── public/
│   └── favicon.ico
│
├── config.json                           # Dashboard configuration
├── .env                                  # Secrets (gitignored)
├── .env.example                          # Template with instructions
├── .gitignore
├── .dockerignore
├── Dockerfile                            # Multi-stage production build
├── docker-compose.yml                    # With volume mounts
├── app.config.ts                         # TanStack Start configuration
├── tailwind.config.ts                    # Tailwind + theme tokens
├── postcss.config.js
├── tsconfig.json
├── package.json
├── bun.lockb
└── README.md                             # User documentation
```

---

## Implementation Phases

### Phase 1: Project Initialization (1-2 hours)

**Goal:** Bootstrap project with TanStack Start CLI and configure base dependencies

#### Steps:

```bash
# 1. Create project with CLI
bun create @tanstack/start@latest cyber-dashboard-v2

# During wizard, select these add-ons:
# ✅ TanStack Start
# ✅ TanStack Query
# ✅ shadcn
# ✅ better-auth (if available)

cd cyber-dashboard-v2

# 2. Install additional dependencies
bun add @better-auth/sso recharts systeminformation lucide-react

# 3. Run better-auth migration
bunx @better-auth/cli migrate

# 4. Create environment file
cp .env.example .env
# Edit .env with OIDC credentials
```

#### Deliverables:

- ✅ Project scaffolded with TanStack Start
- ✅ All dependencies installed
- ✅ Database schema created for better-auth
- ✅ Environment variables configured

---

### Phase 2: Better-Auth Setup (1-2 hours)

**Goal:** Configure authentication with OIDC SSO support

#### Files to Create/Update:

1. **`src/lib/auth.ts`** - Server-side auth configuration
2. **`src/lib/auth-client.ts`** - Client-side auth configuration
3. **`src/routes/api/auth/$.ts`** - Auth handler (server route)
4. **`src/lib/middleware/auth.ts`** - Route protection middleware
5. **`src/lib/setup-auth.ts`** - OIDC provider registration
6. **`src/routes/login.tsx`** - Login page
7. **`src/routes/index.tsx`** - Update to add auth middleware

#### Key Patterns:

**Auth Configuration (`src/lib/auth.ts`):**

```typescript
import { betterAuth } from 'better-auth'
import { sso } from '@better-auth/sso'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL!,
	secret: process.env.BETTER_AUTH_SECRET!,

	database: {
		provider: 'sqlite',
		url: './data/auth.db',
	},

	plugins: [
		sso({
			provisionUser: async ({ user, userInfo }) => {
				console.log('User signed in via SSO:', user.email)
			},
		}),
		tanstackStartCookies(), // ⚠️ MUST be last plugin
	],

	trustedOrigins: [process.env.BETTER_AUTH_URL!, process.env.OIDC_ISSUER!],
})
```

**Auth Handler (`src/routes/api/auth/$.ts`):**

```typescript
import { auth } from '@/lib/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/auth/$')({
	server: {
		handlers: {
			GET: async ({ request }: { request: Request }) => {
				return await auth.handler(request)
			},
			POST: async ({ request }: { request: Request }) => {
				return await auth.handler(request)
			},
		},
	},
})
```

**Auth Middleware (`src/lib/middleware/auth.ts`):**

```typescript
import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'

export const authMiddleware = createMiddleware().server(async ({ next, request }) => {
	const headers = getRequestHeaders()
	const session = await auth.api.getSession({ headers })

	if (!session) {
		throw redirect({ to: '/login' })
	}

	return await next()
})
```

#### Deliverables:

- ✅ better-auth configured with OIDC SSO
- ✅ Auth endpoints working (`/api/auth/*`)
- ✅ Login page functional
- ✅ Protected routes with middleware
- ✅ OIDC provider registered at startup

---

### Phase 3: Dashboard Core (3-4 hours)

**Goal:** Build the configuration system, widget registry, and responsive grid layout

#### Files to Create:

1. **`src/types/config.ts`** - Zod schema for config.json
2. **`src/types/widget.ts`** - Widget type definitions
3. **`src/lib/config.ts`** - Config loader with validation
4. **`src/lib/widget-registry.ts`** - Widget auto-discovery
5. **`src/components/Dashboard.tsx`** - Grid layout component
6. **`src/components/Widget.tsx`** - Widget wrapper with error boundary
7. **`src/components/ThemeProvider.tsx`** - Theme context
8. **`src/components/ThemeToggle.tsx`** - Theme switcher
9. **`config.json`** - Example dashboard configuration

#### Key Patterns:

**Config Schema (`src/types/config.ts`):**

```typescript
import { z } from 'zod'

export const configSchema = z.object({
	title: z.string(),
	theme: z.object({
		default: z.enum(['light', 'dark']),
	}),
	grid: z.object({
		columns: z.number().min(1).max(24).default(12),
		gap: z.number().min(0).default(4),
	}),
	widgets: z.array(
		z.object({
			id: z.string(),
			type: z.string(),
			title: z.string().optional(),
			columns: z.number().min(1),
			options: z.record(z.any()),
		}),
	),
})

export type Config = z.infer<typeof configSchema>
```

**Widget Registry (`src/lib/widget-registry.ts`):**

```typescript
import * as widgets from '@/widgets'
import type { WidgetDefinition } from '@/types/widget'

const widgetRegistry = new Map<string, WidgetDefinition>()

// Auto-register all exported widgets
Object.values(widgets).forEach(widget => {
	if (widget && typeof widget === 'object' && 'id' in widget) {
		widgetRegistry.set(widget.id, widget as WidgetDefinition)
	}
})

export function getWidget(type: string): WidgetDefinition | undefined {
	return widgetRegistry.get(type)
}

export function getAllWidgets(): WidgetDefinition[] {
	return Array.from(widgetRegistry.values())
}
```

**Responsive Grid (`src/components/Dashboard.tsx`):**

```typescript
export function Dashboard() {
  const config = useConfig();

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div
        className="grid gap-4 w-full grid-cols-4 sm:grid-cols-12"
        style={{
          gridTemplateColumns: `repeat(var(--grid-cols), minmax(0, 1fr))`
        }}
      >
        <style jsx>{`
          :root {
            --grid-cols: 4; /* Mobile: 4 columns */
          }
          @media (min-width: 640px) {
            :root {
              --grid-cols: ${config.grid.columns}; /* Desktop: 12 columns */
            }
          }
        `}</style>

        {config.widgets.map((widgetConfig) => {
          const widgetDef = getWidget(widgetConfig.type);
          if (!widgetDef) return null;

          return (
            <div
              key={widgetConfig.id}
              className="min-w-0"
              style={{
                gridColumn: `span ${Math.min(widgetConfig.columns, 4)}`
              }}
            >
              <Widget definition={widgetDef} config={widgetConfig} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

#### Deliverables:

- ✅ config.json loader with validation
- ✅ Widget registry with auto-discovery
- ✅ Responsive grid layout (4 cols → 12 cols)
- ✅ Widget wrapper with error boundary
- ✅ Theme system (light/dark)

---

### Phase 4: Widget System (6-8 hours)

**Goal:** Implement all widget types with real-time streaming data

#### Widget Types to Implement:

1. **CpuGraph** - Real-time CPU usage with historical graph
2. **MemoryGauge** - Memory usage with gauge visualization
3. **DiskUsage** - Disk usage for multiple mount points
4. **NetworkStats** - Network interface statistics
5. **LinkCard** - Static links to services

#### Widget Pattern (Example: CpuGraph):

**Server Function (`src/widgets/CpuGraph/server.ts`):**

```typescript
import { createServerFn } from '@tanstack/start'
import si from 'systeminformation'

interface CpuDataPoint {
	usage: number
	cores: number[]
	timestamp: number
}

export const streamCpuData = createServerFn({ method: 'GET' }).handler(async function* () {
	const interval = 2000

	while (true) {
		try {
			const cpuData = await si.currentLoad()

			yield {
				usage: cpuData.currentLoad,
				cores: cpuData.cpus.map(cpu => cpu.load),
				timestamp: Date.now(),
			}

			await new Promise(resolve => setTimeout(resolve, interval))
		} catch (error) {
			console.error('CPU data fetch error:', error)
		}
	}
})
```

**Component (`src/widgets/CpuGraph/CpuGraph.tsx`):**

```typescript
import { useQuery } from '@tanstack/react-query';
import { experimental_streamedQuery as streamedQuery } from '@tanstack/react-query';
import { streamCpuData } from './server';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const BUFFER_SIZE = 60; // 60 data points

export function CpuGraph({ id, title, options }: CpuGraphProps) {
  const { data, error, refetch } = useQuery({
    queryKey: ['cpu', id],
    queryFn: streamedQuery({
      streamFn: async () => await streamCpuData(),
      refetchMode: 'replace',
      reducer: (acc: CpuDataPoint[], chunk: CpuDataPoint) => {
        const newData = [...acc, chunk];
        return newData.slice(-BUFFER_SIZE);
      },
      initialValue: []
    })
  });

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6 min-h-[200px]">
          <AlertCircle className="h-8 w-8 text-destructive mb-2" />
          <p className="text-sm text-muted-foreground text-center mb-4">
            Failed to load CPU data
          </p>
          <Button onClick={() => refetch()} size="sm">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const latestData = data?.[data.length - 1];
  const chartData = data?.map((point, idx) => ({
    time: idx,
    usage: point.usage
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || 'CPU Usage'}</CardTitle>
      </CardHeader>
      <CardContent>
        {latestData ? (
          <div className="space-y-4">
            <div className="text-3xl font-bold">
              {latestData.usage.toFixed(1)}%
            </div>

            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                <Area
                  type="monotone"
                  dataKey="usage"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#cpuGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            <div className="h-32 bg-muted animate-pulse rounded" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

**Registration (`src/widgets/CpuGraph/index.ts`):**

```typescript
import { z } from 'zod'
import { CpuGraph } from './CpuGraph'
import { streamCpuData } from './server'
import type { WidgetDefinition } from '@/types/widget'

export const cpuGraphOptionsSchema = z.object({
	refreshInterval: z.number().min(1000).default(2000),
	showCores: z.boolean().default(false),
})

export const cpuGraph: WidgetDefinition = {
	id: 'cpu-graph',
	name: 'CPU Graph',
	description: 'Real-time CPU usage with historical graph',
	component: CpuGraph,
	serverFn: streamCpuData,
	optionsSchema: cpuGraphOptionsSchema,
	defaultColumns: 3,
}
```

#### Repeat Pattern for Other Widgets:

- **MemoryGauge**: Similar to CpuGraph but with gauge/progress bar
- **DiskUsage**: Multi-mount support with progress bars per mount
- **NetworkStats**: Upload/download speeds with dual-line chart
- **LinkCard**: Static component (no server function)

#### Additional Component:

**ServiceIcon (`src/components/ServiceIcon.tsx`):**

```typescript
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';

interface ServiceIconProps {
  icon: string;
  size?: number;
  className?: string;
}

export function ServiceIcon({ icon, size = 24, className }: ServiceIconProps) {
  const [imageError, setImageError] = useState(false);

  // Check if it's a URL (dashboardicons.com or custom)
  if (icon.startsWith('http') && !imageError) {
    return (
      <img
        src={icon}
        alt=""
        width={size}
        height={size}
        className={className}
        onError={() => setImageError(true)}
      />
    );
  }

  // Lucide icon by name
  const IconComponent = LucideIcons[icon as keyof typeof LucideIcons];

  if (IconComponent) {
    return <IconComponent size={size} className={className} />;
  }

  // Fallback
  return <LucideIcons.Box size={size} className={className} />;
}
```

#### Deliverables:

- ✅ CpuGraph widget with streaming + 60s buffer
- ✅ MemoryGauge widget
- ✅ DiskUsage widget with multi-mount support
- ✅ NetworkStats widget
- ✅ LinkCard widget (static)
- ✅ ServiceIcon component (Lucide + dashboardicons.com)
- ✅ Widget auto-discovery configured

---

### Phase 5: Deployment (2-3 hours)

**Goal:** Package application for Docker deployment with proper system access

#### Files to Create:

1. **`Dockerfile`** - Multi-stage production build
2. **`docker-compose.yml`** - Container orchestration with volume mounts
3. **`.dockerignore`** - Exclude unnecessary files from build
4. **`.env.example`** - Template with detailed documentation
5. **`README.md`** - Comprehensive user documentation

#### Dockerfile (Multi-stage Build):

```dockerfile
FROM oven/bun:latest AS base
WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Build stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Production stage
FROM oven/bun:slim AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 dashboard

# Copy built assets
COPY --from=builder --chown=dashboard:nodejs /app/.output ./.output
COPY --from=builder --chown=dashboard:nodejs /app/package.json ./

# Create data directory
RUN mkdir -p /app/data && chown dashboard:nodejs /app/data

USER dashboard

EXPOSE 3000

ENV NODE_ENV=production \
    PORT=3000

CMD ["bun", "run", ".output/server/index.mjs"]
```

#### docker-compose.yml:

```yaml
version: '3.8'

services:
    dashboard:
        build: .
        container_name: homelab-dashboard
        ports:
            - '3000:3000'

        volumes:
            # Config (read-only)
            - ./config.json:/app/config.json:ro

            # Persist auth sessions
            - dashboard-data:/app/data

            # System metrics (read-only)
            - /proc:/host/proc:ro
            - /sys:/host/sys:ro
            - /etc/os-release:/host/etc/os-release:ro

        environment:
            # System paths
            - PROC_PATH=/host/proc
            - SYS_PATH=/host/sys

            # Auth (from .env)
            - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
            - BETTER_AUTH_URL=${BETTER_AUTH_URL}
            - OIDC_ISSUER=${OIDC_ISSUER}
            - OIDC_CLIENT_ID=${OIDC_CLIENT_ID}
            - OIDC_CLIENT_SECRET=${OIDC_CLIENT_SECRET}

        restart: unless-stopped

        healthcheck:
            test: ['CMD', 'curl', '-f', 'http://localhost:3000']
            interval: 30s
            timeout: 10s
            retries: 3
            start_period: 40s

volumes:
    dashboard-data:
        driver: local
```

#### systeminformation Configuration:

```typescript
// src/lib/system-info.ts
import si from 'systeminformation'

// Configure paths for Docker environment
if (process.env.PROC_PATH) {
	si.setOptions({ procPath: process.env.PROC_PATH })
}
if (process.env.SYS_PATH) {
	si.setOptions({ sysPath: process.env.SYS_PATH })
}

export { si }
```

#### README.md Sections:

1. **Overview** - What the dashboard does
2. **Quick Start** - Docker deployment in 5 minutes
3. **Configuration**
    - config.json reference
    - Environment variables
    - OIDC provider setup (Authentik, Authelia, Keycloak examples)
4. **Widget Development** - How to create custom widgets
5. **Troubleshooting** - Common issues and solutions

#### Deliverables:

- ✅ Dockerfile with multi-stage build
- ✅ docker-compose.yml with proper volume mounts
- ✅ systeminformation configured for Docker
- ✅ .env.example with detailed comments
- ✅ Comprehensive README.md
- ✅ JSDoc comments on key functions

---

## Better-Auth + TanStack Start Integration

### Official Integration Pattern

Based on: https://www.better-auth.com/docs/integrations/tanstack

### 1. Auth Handler (Server Route)

```typescript
// src/routes/api/auth/$.ts
import { auth } from '@/lib/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/auth/$')({
	server: {
		handlers: {
			GET: async ({ request }: { request: Request }) => {
				return await auth.handler(request)
			},
			POST: async ({ request }: { request: Request }) => {
				return await auth.handler(request)
			},
		},
	},
})
```

### 2. Server Configuration

```typescript
// src/lib/auth.ts
import { betterAuth } from 'better-auth'
import { sso } from '@better-auth/sso'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL!,
	secret: process.env.BETTER_AUTH_SECRET!,

	database: {
		provider: 'sqlite',
		url: './data/auth.db',
	},

	plugins: [
		sso({
			provisionUser: async ({ user, userInfo }) => {
				console.log('User signed in via SSO:', user.email)
			},
		}),
		tanstackStartCookies(), // ⚠️ MUST be last plugin in array
	],

	trustedOrigins: [process.env.BETTER_AUTH_URL!, process.env.OIDC_ISSUER!],
})
```

**⚠️ Important:** The `tanstackStartCookies()` plugin **MUST** be the last plugin in the plugins array.

### 3. Client Configuration

```typescript
// src/lib/auth-client.ts
import { createAuthClient } from 'better-auth/client'
import { ssoClient } from '@better-auth/sso/client'

export const authClient = createAuthClient({
	baseURL: process.env.BETTER_AUTH_URL!,
	plugins: [ssoClient()],
})
```

### 4. Auth Middleware

```typescript
// src/lib/middleware/auth.ts
import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'

export const authMiddleware = createMiddleware().server(async ({ next, request }) => {
	const headers = getRequestHeaders()
	const session = await auth.api.getSession({ headers })

	if (!session) {
		throw redirect({ to: '/login' })
	}

	return await next()
})
```

### 5. Protected Route Example

```typescript
// src/routes/index.tsx (Dashboard)
import { createFileRoute } from '@tanstack/react-router';
import { authMiddleware } from '@/lib/middleware/auth';
import { Dashboard } from '@/components/Dashboard';

export const Route = createFileRoute('/')({
  component: DashboardPage,
  server: {
    middleware: [authMiddleware], // Protect this route
  },
});

function DashboardPage() {
  return <Dashboard />;
}
```

### 6. Login Flow

```typescript
// src/routes/login.tsx
import { createFileRoute } from '@tanstack/react-router';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const handleLogin = async () => {
    await authClient.signIn.sso({
      providerId: 'homelab-oidc',
      callbackURL: '/'
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Button onClick={handleLogin}>Sign In with SSO</Button>
    </div>
  );
}
```

### 7. OIDC Provider Registration

```typescript
// src/lib/setup-auth.ts
import { auth } from './auth'

export async function registerOIDCProvider() {
	try {
		await auth.api.registerSSOProvider({
			body: {
				providerId: 'homelab-oidc',
				issuer: process.env.OIDC_ISSUER!,
				domain: new URL(process.env.BETTER_AUTH_URL!).hostname,
				oidcConfig: {
					clientId: process.env.OIDC_CLIENT_ID!,
					clientSecret: process.env.OIDC_CLIENT_SECRET!,
					// All endpoints auto-discovered from {issuer}/.well-known/openid-configuration
				},
			},
		})

		console.log('✅ OIDC provider registered')
	} catch (error) {
		if (error.message?.includes('already exists')) {
			console.log('✅ OIDC provider already registered')
		} else {
			console.error('❌ Failed to register OIDC provider:', error)
			throw error
		}
	}
}
```

Call at startup:

```typescript
// src/routes/__root.tsx
import { registerOIDCProvider } from '@/lib/setup-auth'

// Register provider on server startup
if (typeof window === 'undefined') {
	registerOIDCProvider().catch(console.error)
}
```

---

## Widget System

### Widget Architecture

Each widget follows a consistent pattern:

```
Widget Directory/
├── index.ts          # Registration and exports
├── Component.tsx     # React component with UI
├── server.ts         # Server function (async generator)
└── schema.ts         # Zod options schema
```

### Widget Interface

```typescript
// src/types/widget.ts
import { z } from 'zod'

export interface WidgetDefinition<TOptions = any> {
	id: string
	name: string
	description: string
	defaultColumns: number
	optionsSchema: z.ZodSchema<TOptions>
	component: React.ComponentType<WidgetProps<TOptions>>
	serverFn?: any // Server function for streaming data (optional)
}

export interface WidgetProps<TOptions = any> {
	id: string
	title?: string
	columns: number
	options: TOptions
}

export interface WidgetConfig {
	id: string
	type: string
	title?: string
	columns: number
	options: Record<string, any>
}
```

### Widget Auto-Discovery

```typescript
// src/widgets/index.ts
export { cpuGraph } from './CpuGraph'
export { memoryGauge } from './MemoryGauge'
export { diskUsage } from './DiskUsage'
export { networkStats } from './NetworkStats'
export { linkCard } from './LinkCard'
```

All widgets exported from `src/widgets/index.ts` are automatically discovered by the registry.

### Creating a New Widget

1. Create directory: `src/widgets/MyWidget/`
2. Create `schema.ts` with Zod schema
3. Create `server.ts` with async generator (if needed)
4. Create `MyWidget.tsx` component
5. Create `index.ts` with registration
6. Export from `src/widgets/index.ts`

**Example:**

```typescript
// src/widgets/MyWidget/index.ts
import { z } from 'zod'
import { MyWidget } from './MyWidget'
import { streamMyData } from './server'

export const myWidgetSchema = z.object({
	refreshInterval: z.number().min(1000).default(5000),
	// ... other options
})

export const myWidget = {
	id: 'my-widget',
	name: 'My Widget',
	description: 'Custom widget description',
	component: MyWidget,
	serverFn: streamMyData,
	optionsSchema: myWidgetSchema,
	defaultColumns: 4,
}
```

Then add to `src/widgets/index.ts`:

```typescript
export { myWidget } from './MyWidget'
```

---

## Data Streaming Architecture

### Server-Side: Async Generator Pattern

```typescript
// Widget server function
import { createServerFn } from '@tanstack/start'
import si from 'systeminformation'

export const streamCpuData = createServerFn({ method: 'GET' }).handler(async function* () {
	const interval = 2000 // Will be configurable per widget instance

	while (true) {
		try {
			const cpuData = await si.currentLoad()

			yield {
				usage: cpuData.currentLoad,
				cores: cpuData.cpus.map(cpu => cpu.load),
				timestamp: Date.now(),
			}

			await new Promise(resolve => setTimeout(resolve, interval))
		} catch (error) {
			console.error('Error fetching CPU data:', error)
		}
	}
})
```

### Client-Side: TanStack Query streamedQuery

```typescript
import { useQuery } from '@tanstack/react-query'
import { experimental_streamedQuery as streamedQuery } from '@tanstack/react-query'

const BUFFER_SIZE = 60 // Keep 60 data points (~60 seconds)

const { data, error, refetch } = useQuery({
	queryKey: ['cpu', widgetId],
	queryFn: streamedQuery({
		streamFn: async () => await streamCpuData(),
		refetchMode: 'replace', // Replace data on refetch
		reducer: (acc: DataPoint[], chunk: DataPoint) => {
			// Keep only last BUFFER_SIZE items
			const newData = [...acc, chunk]
			return newData.slice(-BUFFER_SIZE)
		},
		initialValue: [],
	}),
})
```

### Data Flow

1. **Component** calls `useQuery` with `streamedQuery`
2. **streamedQuery** calls the server function
3. **Server function** (async generator) yields data at intervals
4. **Reducer** accumulates data with a sliding window (60 points)
5. **Component** re-renders with latest data
6. **TanStack Query** handles reconnection automatically on errors

### Benefits

- ✅ Real-time updates without WebSocket complexity
- ✅ Type-safe end-to-end (server → client)
- ✅ Automatic error handling and retry
- ✅ Built-in reconnection logic
- ✅ Efficient memory usage with buffer

---

## Configuration

### config.json Structure

```json
{
	"title": "My Homelab Dashboard",
	"theme": {
		"default": "dark"
	},
	"grid": {
		"columns": 12,
		"gap": 4
	},
	"widgets": [
		{
			"id": "cpu-1",
			"type": "cpu-graph",
			"title": "CPU Usage",
			"columns": 3,
			"options": {
				"refreshInterval": 2000,
				"showCores": false
			}
		},
		{
			"id": "memory-1",
			"type": "memory-gauge",
			"title": "Memory",
			"columns": 3,
			"options": {
				"refreshInterval": 5000,
				"showPercentage": true
			}
		},
		{
			"id": "disk-1",
			"type": "disk-usage",
			"title": "Storage",
			"columns": 3,
			"options": {
				"refreshInterval": 30000,
				"mounts": ["/", "/mnt/data"]
			}
		},
		{
			"id": "network-1",
			"type": "network-stats",
			"title": "Network",
			"columns": 3,
			"options": {
				"refreshInterval": 2000,
				"interface": "eth0"
			}
		},
		{
			"id": "services-1",
			"type": "link-card",
			"title": "Services",
			"columns": 6,
			"options": {
				"links": [
					{
						"title": "Proxmox",
						"url": "https://proxmox.local:8006",
						"icon": "server",
						"description": "Hypervisor"
					},
					{
						"title": "Prometheus",
						"url": "https://prometheus.local",
						"icon": "https://dashboardicons.com/prometheus.svg",
						"description": "Metrics"
					},
					{
						"title": "Traefik",
						"url": "https://traefik.local",
						"icon": "https://dashboardicons.com/traefik.svg",
						"description": "Reverse Proxy"
					}
				],
				"layout": "grid"
			}
		}
	]
}
```

### Configuration Notes

- **Static reload**: Changes require container restart
- **Validation**: Runtime validation with Zod on startup
- **Widget ordering**: Array order determines display order
- **Column spanning**: Mobile clamps to max 4 columns, desktop uses configured value
- **Widget options**: Each widget type defines its own schema

### Environment Variables

```bash
# ========================================
# Better Auth Configuration
# ========================================

# Generate with: openssl rand -base64 32
BETTER_AUTH_SECRET=

# Your dashboard URL (include port if not 80/443)
BETTER_AUTH_URL=http://localhost:3000

# ========================================
# OIDC Provider Configuration
# ========================================
# Better Auth auto-discovers endpoints from:
# {OIDC_ISSUER}/.well-known/openid-configuration
#
# Examples:
# - Authentik: https://authentik.company/application/o/<app>/
# - Authelia: https://authelia.company/
# - Keycloak: https://keycloak.company/realms/<realm>

OIDC_ISSUER=
OIDC_CLIENT_ID=
OIDC_CLIENT_SECRET=

# ========================================
# Optional Configuration
# ========================================

# Server port (default: 3000)
PORT=3000

# Node environment
NODE_ENV=production
```

---

## Docker Deployment

### Building and Running

```bash
# Build image
docker-compose build

# Start container
docker-compose up -d

# View logs
docker-compose logs -f dashboard

# Stop container
docker-compose down
```

### Volume Mounts

| Host Path         | Container Path         | Purpose                        | Mode       |
| ----------------- | ---------------------- | ------------------------------ | ---------- |
| `./config.json`   | `/app/config.json`     | Dashboard configuration        | Read-only  |
| `./data`          | `/app/data`            | Auth database persistence      | Read-write |
| `/proc`           | `/host/proc`           | System metrics (CPU, memory)   | Read-only  |
| `/sys`            | `/host/sys`            | System metrics (disk, network) | Read-only  |
| `/etc/os-release` | `/host/etc/os-release` | OS information                 | Read-only  |

### Security Considerations

1. **Non-root user**: Container runs as user `dashboard` (UID 1001)
2. **Read-only mounts**: System directories mounted read-only
3. **No privileged mode**: Container does not require privileged access
4. **Secret management**: Sensitive data only in environment variables
5. **Trusted origins**: OIDC issuer must be in trusted origins list

### Health Check

The container includes a health check that:

- Runs every 30 seconds
- Timeout after 10 seconds
- Requires 3 consecutive failures to mark unhealthy
- Waits 40 seconds after startup before first check

---

## Dependencies

### Core Dependencies

```json
{
	"dependencies": {
		"@tanstack/react-query": "^5.56.2",
		"@tanstack/react-router": "^1.58.7",
		"@tanstack/start": "^1.58.7",
		"better-auth": "^1.1.1",
		"@better-auth/sso": "^1.1.1",
		"class-variance-authority": "^0.7.0",
		"clsx": "^2.1.1",
		"lucide-react": "^0.447.0",
		"react": "^18.3.1",
		"react-dom": "^18.3.1",
		"recharts": "^2.12.7",
		"systeminformation": "^5.23.5",
		"tailwind-merge": "^2.5.4",
		"tailwindcss-animate": "^1.0.7",
		"vinxi": "^0.4.3",
		"zod": "^3.23.8"
	},
	"devDependencies": {
		"@types/node": "^22.7.5",
		"@types/react": "^18.3.11",
		"@types/react-dom": "^18.3.0",
		"@vitejs/plugin-react": "^4.3.2",
		"autoprefixer": "^10.4.20",
		"postcss": "^8.4.47",
		"tailwindcss": "^3.4.13",
		"typescript": "^5.6.2",
		"vite": "^5.4.8"
	}
}
```

### Installation Commands

```bash
# Install all dependencies
bun install

# Add new dependency
bun add <package>

# Add dev dependency
bun add -d <package>

# Update dependencies
bun update
```

---

## Timeline Estimate

| Phase                       | Duration        | Tasks                                                |
| --------------------------- | --------------- | ---------------------------------------------------- |
| **Phase 1: Initialization** | 1-2 hours       | Project setup with CLI, dependencies, auth migration |
| **Phase 2: Auth Setup**     | 1-2 hours       | better-auth + OIDC configuration, middleware, login  |
| **Phase 3: Dashboard Core** | 3-4 hours       | Config system, widget registry, grid layout, theme   |
| **Phase 4: Widgets**        | 6-8 hours       | 5 widget types with streaming data                   |
| **Phase 5: Deployment**     | 2-3 hours       | Docker setup, documentation, optimization            |
| **Total**                   | **13-19 hours** | Complete MVP with all features                       |

### Breakdown by Feature

- **CLI Automation Savings**: ~2-3 hours (scaffolding, add-ons)
- **Auth Setup**: ~1-2 hours (configuration, routes)
- **Core Dashboard**: ~3-4 hours (config, registry, layout)
- **Widget System**: ~6-8 hours (5 widgets × ~1-1.5 hours each)
- **Deployment**: ~2-3 hours (Docker, docs)

---

## Validation Summary

All components validated against official documentation:

| Component                  | Source                                                 | Status       |
| -------------------------- | ------------------------------------------------------ | ------------ |
| **TanStack Start**         | https://tanstack.com/start/latest                      | ✅ Validated |
| **TanStack Query**         | https://tanstack.com/query/latest                      | ✅ Validated |
| **better-auth**            | https://www.better-auth.com/docs                       | ✅ Validated |
| **better-auth + TanStack** | https://www.better-auth.com/docs/integrations/tanstack | ✅ Validated |
| **better-auth SSO**        | https://www.better-auth.com/docs/plugins/sso           | ✅ Validated |
| **shadcn/ui**              | CLI add-on                                             | ✅ Validated |
| **Async Generators**       | TanStack Start docs                                    | ✅ Validated |
| **streamedQuery**          | TanStack Query reference                               | ✅ Validated |

---

## Next Steps

1. **Initialize Project**: Run `bun create @tanstack/start@latest`
2. **Follow Phase 1**: Complete project initialization
3. **Iterative Development**: Build phase by phase, testing as you go
4. **Deploy**: Build Docker image and deploy to homelab

---

## Support & Resources

### Official Documentation

- **TanStack Start**: https://tanstack.com/start/latest/docs
- **TanStack Query**: https://tanstack.com/query/latest/docs
- **better-auth**: https://www.better-auth.com/docs
- **shadcn/ui**: https://ui.shadcn.com

### Example OIDC Providers

- **Authentik**: https://goauthentik.io/docs
- **Authelia**: https://www.authelia.com/docs
- **Keycloak**: https://www.keycloak.org/docs

### Community

- **TanStack Discord**: https://discord.gg/tanstack
- **better-auth GitHub**: https://github.com/better-auth/better-auth

---

## Appendix: Key Commands

### Development

```bash
# Start dev server
bun run dev

# Build for production
bun run build

# Start production server
bun run start

# Run better-auth migration
bunx @better-auth/cli migrate

# Generate better-auth types
bunx @better-auth/cli generate
```

### Docker

```bash
# Build image
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### shadcn/ui

```bash
# Add a component
npx shadcn@latest add <component-name>

# Example: Add card, button, alert
npx shadcn@latest add card button alert skeleton
```

---

**End of Implementation Plan**

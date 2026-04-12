FROM oven/bun:1.3.10-alpine AS builder
WORKDIR /app

ENV VITE_GIT_HOOKS=0

COPY package.json bun.lock ./
COPY patches ./patches
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1.3.10-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["bun", ".output/server/index.mjs"]
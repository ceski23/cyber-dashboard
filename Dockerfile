FROM oven/bun:1.3.14-alpine AS builder
WORKDIR /app

ENV VITE_GIT_HOOKS=0

COPY package.json bun.lock ./
COPY patches ./patches
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1.3.14-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV SHELL=/bin/sh

COPY --from=builder /app/.output ./.output

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health > /dev/null || exit 1

CMD ["bun", ".output/server/index.mjs"]
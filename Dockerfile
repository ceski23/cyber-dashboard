FROM oven/bun:1.3.10 AS builder
WORKDIR /app

ENV VITE_GIT_HOOKS=0
ENV NODE_ENV=production

COPY package.json bun.lock ./
COPY patches ./patches
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build
RUN bun build \
	--compile \
	--minify \
	--target bun-linux-x64 \
	--outfile server \
	.output/server/index.mjs

FROM gcr.io/distroless/base:nonroot AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV SHELL=/bin/sh

COPY --from=builder /app/server server
COPY --from=busybox:1.35.0-uclibc /bin/sh /bin/df /bin/

EXPOSE 3000

ENTRYPOINT ["./server"]
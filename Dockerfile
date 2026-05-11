# =========================
# Base image
# =========================
FROM node:22-alpine AS base

RUN corepack enable
WORKDIR /app

# =========================
# Dependencies (IMPORTANT FIX HERE)
# =========================
FROM base AS deps

# copy workspace definition FIRST
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# copy ALL workspace packages (INI YANG KAMU LUPA SEBELUMNYA)
COPY docs ./docs
COPY packages ./packages

# install deps with strict lockfile
RUN pnpm install --frozen-lockfile

# =========================
# Build stage
# =========================
FROM base AS build

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm -F docs build

# =========================
# Runtime (vite preview server)
# =========================
FROM node:22-alpine AS runner

WORKDIR /app

RUN corepack enable

ENV NODE_ENV=production

# copy only needed output
COPY --from=build /app/docs ./docs
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

WORKDIR /app/docs

EXPOSE 4173

# production preview server
CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "4173"]
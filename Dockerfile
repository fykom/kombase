FROM node:20-alpine AS base

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

FROM base AS builder

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY docs/package.json ./docs/package.json
COPY packages/package.json ./packages/package.json

RUN pnpm fetch

COPY . .

RUN pnpm install --frozen-lockfile

RUN pnpm build:kombase
RUN pnpm build:docs

RUN pnpm deploy --filter docs --prod /prod

FROM node:20-alpine AS production

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

COPY --from=builder /prod .

COPY --from=builder /app/docs/build ./build

EXPOSE 3000

CMD ["pnpm", "start"]

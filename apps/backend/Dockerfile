FROM node:24-alpine as builder

WORKDIR /app
COPY pnpm-lock.yaml* pnpm-workspace.yaml package.json ./
RUN npm install -g pnpm

COPY packages/shared packages/shared
COPY apps/backend apps/backend
RUN pnpm install

# Generate Prisma Client
WORKDIR /app/apps/backend
RUN pnpm prisma generate

# Build
RUN pnpm build
WORKDIR /app/packages/shared
RUN pnpm build || true # usually pure type schemas don't strictly need a transpiled build if using ts-node but better safe

FROM node:24-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/apps/backend/package.json ./apps/backend/
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma

RUN npm install -g pnpm
RUN pnpm install --prod

WORKDIR /app/apps/backend

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]

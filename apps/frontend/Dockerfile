FROM node:24-alpine as builder

WORKDIR /app
RUN npm install -g pnpm

COPY pnpm-lock.yaml* pnpm-workspace.yaml package.json ./
COPY packages/shared packages/shared
COPY apps/frontend apps/frontend
RUN pnpm install

WORKDIR /app/apps/frontend
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

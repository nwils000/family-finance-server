# Kid Kapital: one container serves the API and the built web app from the same origin,
# so the refresh cookie stays first-party and no cross-site CORS is needed.
# Build from the repo root (shared/ is a workspace both sides import).

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY shared/package.json shared/
COPY server/package.json server/
COPY client/package.json client/
RUN npm ci -w shared -w server -w client --include-workspace-root
COPY shared shared
COPY server server
COPY client client
RUN npm run typecheck && npm run build -w client

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
COPY shared/package.json shared/
COPY server/package.json server/
COPY client/package.json client/
# Server runtime deps only (tsx runs the TypeScript, as in Mentis).
RUN npm ci -w shared -w server --include-workspace-root --omit=dev && npm cache clean --force
COPY shared shared
COPY server/src server/src
COPY server/tsconfig.json server/
COPY --from=build /app/client/dist client/dist
ENV SERVE_CLIENT_DIR=/app/client/dist
USER node
EXPOSE 8787
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s CMD wget -qO- http://127.0.0.1:${PORT:-8787}/api/health/ready || exit 1
CMD ["npm", "start", "-w", "server"]

FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run selfhost:build

FROM node:24-bookworm-slim AS runtime
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000 EGK_DATA_DIR=/data
WORKDIR /app
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/drizzle ./drizzle
COPY --from=build --chown=node:node /app/lib/runtime/storage.mjs ./lib/runtime/storage.mjs
COPY --from=build --chown=node:node /app/scripts/selfhost-migrate.mjs /app/scripts/selfhost-backup.mjs ./scripts/
RUN mkdir /data && chown node:node /data
USER node
EXPOSE 3000
CMD ["sh", "-c", "node scripts/selfhost-migrate.mjs && node server.js"]

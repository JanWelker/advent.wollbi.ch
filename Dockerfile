# Three stages, so the image that runs carries neither the toolchain nor the
# development dependencies. Built by .github/workflows/push-image.yml and
# deployed from JanWelker/homelab-apps.
FROM node:24-alpine@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1 AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# No database at build time: the schema is created on first connect.
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 1000 is node's own uid in this image; the deployment runs as the same one
# so the uploads volume needs no chown.
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# The upload directory Payload writes to; the deployment mounts a volume here.
RUN mkdir -p /app/media && chown node:node /app/media

USER node
EXPOSE 3000
CMD ["node", "server.js"]

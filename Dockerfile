# Three stages: install, build, and a distroless runtime that carries neither
# the toolchain nor a shell. Built by .github/workflows/push-image.yml and
# deployed from JanWelker/homelab-apps.
#
# The builder is Debian trixie, not Alpine, because the runtime is: sharp
# ships prebuilt binaries per libc, and a musl build would not load on glibc.
FROM node:24-trixie-slim@sha256:8ec5d7557396cfe32d21c3f9c13072355ceab22b584578ca4bb28af31120cffe AS base

FROM base AS deps
WORKDIR /app
# .npmrc too: it carries legacy-peer-deps, which is what the lockfile was
# resolved under. Without it `npm ci` resolves the peer graph strictly and
# rejects the lockfile as out of sync.
COPY package.json package-lock.json .npmrc ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# No database at build time: the schema is created by the migrations the
# adapter runs on its first connection.
RUN npm run build
# The upload directory the deployment mounts a volume over. It is created
# here because the runtime has no shell to create it later.
RUN mkdir -p /app/.next/standalone/media

# nonroot is uid 65532; the deployment runs as the same one, so the volume
# needs no chown.
FROM gcr.io/distroless/nodejs24-debian13:nonroot@sha256:9eeb7f5887d0e239e78264b06f7f11d2e14be534050481803a9e4728fcdd278e AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=65532:65532 /app/public ./public
COPY --from=builder --chown=65532:65532 /app/.next/standalone ./
COPY --from=builder --chown=65532:65532 /app/.next/static ./.next/static

EXPOSE 3000
# The image's entrypoint is node itself; there is no shell to wrap this in.
CMD ["server.js"]

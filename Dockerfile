# Three stages: install, build, and a distroless runtime that carries neither
# the toolchain nor a shell. Built by .github/workflows/push-image.yml and
# deployed from JanWelker/homelab-apps.
#
# The builder is Debian trixie, not Alpine, because the runtime is: sharp
# ships prebuilt binaries per libc, and a musl build would not load on glibc.
FROM node:24-trixie-slim@sha256:43b9ba1142b8dcf33fa8f922ca1be85714adc444e0586c7cf7726daaeabc1bea AS base

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
FROM gcr.io/distroless/nodejs24-debian13:nonroot@sha256:cb606325b7ec4af55462cb0b424a53b452a5b4a894ffe841fcf1048d216fb9f8 AS runner
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

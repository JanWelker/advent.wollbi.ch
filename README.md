# advent.wollbi.ch

The Wollbi Adventsfenster site, [Payload CMS](https://payloadcms.com/) on Next.js.
It replaces the Pelican site that used to live here: the pages are now rows in
Postgres and are edited at `/admin` rather than in Markdown in this repository.

## What is where

| Path | What |
| --- | --- |
| `src/collections/` | `pages`, `media`, `users` |
| `src/globals/Site.ts` | Title, subtitle, invitation, contact address, the OK and the footer |
| `src/blocks/` | What a page is made of: the year's windows, a callout, the OK, the archive teaser, and the old prose, images and download |
| `src/components/` | The night street, the hero and the block renderer |
| `src/lib/windows.ts` | Weekday, time and date range, derived from each window's date |
| `src/app/(frontend)/Snow.tsx` | The eight falling snowflakes the Pelican template drew inline |
| `src/app/(frontend)/` | The public site |
| `src/app/seed/` | The one-shot import of the Pelican content, and the content itself |
| `src/migrations/` | The schema. Applied on connect in production |
| `public/seed/images/` | The images the Pelican site shipped, imported once by the seed |

## Running it

```bash
cp .env.example .env          # and edit DATABASE_URL and PAYLOAD_SECRET
npm install
npm run dev
```

A Postgres to point it at, with Apple's `container` CLI:

```bash
container run -d --name adventpg -p 5432:5432 \
  -e POSTGRES_USER=payload -e POSTGRES_PASSWORD=payload -e POSTGRES_DB=advent \
  docker.io/library/postgres:18-alpine
```

## Seeding

The seed runs once, against an empty database, and does three things: creates
the first editor from `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`, imports
every file in `public/seed/images/` as media, and creates the three pages.

```bash
curl -X POST -H "x-seed-token: $PAYLOAD_SECRET" http://localhost:3000/seed
```

It refuses without the token and does nothing if any page already exists, so
the cluster can run it as a post-sync hook on every deploy.

## Changing the schema

The adapter runs the committed migrations on connect in production; `push` is
off, so a field added to a collection needs one:

```bash
npm run generate:types
npx payload migrate:create <name>
```

## Deployment

The image is built by `.github/workflows/push-image.yml` and published to
`ghcr.io/janwelker/advent-wollbi-ch`. What runs it is
[JanWelker/homelab-apps](https://github.com/JanWelker/homelab-apps), directory
`advent-wollbi/`; Renovate moves the tag there.

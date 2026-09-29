import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
import { Site } from './globals/Site'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || ''

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [Pages, Media, Users],
  globals: [Site],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  // CloudNativePG writes the whole connection string; nothing here assembles
  // one. See JanWelker/homelab-apps, advent-wollbi/.
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    // Migrations, not push: the adapter ignores `push` under NODE_ENV
    //=production, so a pushed schema would exist on a laptop and nowhere
    // else. `prodMigrations` runs the committed ones on connect, which is
    // what makes a fresh pod against an empty database come up on its own.
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
    prodMigrations: migrations,
  }),
  // TLS ends at the Gateway and the request arrives from Envoy, so the
  // origin Payload must trust is the public one, not the pod's.
  csrf: serverURL ? [serverURL] : [],
  cors: serverURL ? [serverURL] : [],
  sharp,
  plugins: [],
})

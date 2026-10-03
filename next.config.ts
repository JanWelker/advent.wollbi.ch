import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  // The Dockerfile copies .next/standalone; without this there is nothing
  // to copy. See the deployment in JanWelker/homelab-apps.
  output: 'standalone',
  images: {
    localPatterns: [{ pathname: '/api/media/file/**' }],
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })

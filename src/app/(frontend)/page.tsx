import { getPayload } from 'payload'
import { notFound } from 'next/navigation'

import config from '@/payload.config'
import { Hero } from '@/components/Hero'
import { PageBody } from '@/components/PageBody'

// Rendered per request: the content is in Postgres, and a build that
// prerendered it would need a database to build.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config: await config })
  const [found, site] = await Promise.all([
    payload.find({ collection: 'pages', where: { slug: { equals: 'home' } }, depth: 2, limit: 1 }),
    payload.findGlobal({ slug: 'site' }),
  ])
  const page = found.docs[0]
  if (!page) notFound()

  const layout = (page.layout ?? []) as Record<string, any>[]
  const windows = layout.find((block) => block.blockType === 'windows')

  return (
    <>
      <Hero title={page.title} site={site} windows={windows} />
      <PageBody layout={layout} site={site} />
    </>
  )
}

import { getPayload } from 'payload'
import { notFound } from 'next/navigation'

import config from '@/payload.config'
import { PageBody } from '@/components/PageBody'

// Rendered per request: the content is in Postgres, and a build that
// prerendered it would need a database to build.
export const dynamic = 'force-dynamic'

export default async function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: await config })
  const found = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })
  const page = found.docs[0]
  if (!page || page.slug === 'home') notFound()

  return (
    <>
      <h1>{page.title}</h1>
      <PageBody layout={page.layout as never} />
    </>
  )
}

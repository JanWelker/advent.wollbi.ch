import { calendar } from '@/lib/calendar'
import { pageWindows, yearOf } from '@/lib/content'
import { publicHost, slugOf } from '@/lib/host'
import { evenings } from '@/lib/windows'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const found = await pageWindows(slugOf(request))
  if (!found) return new Response('Not found', { status: 404 })
  const list = evenings(found.windows)
  const year = yearOf(list.map((e) => e.key))
  const body = calendar(list, found.site?.name ?? 'Adventsfenster', publicHost(request))
  return new Response(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="adventsfenster-${year}.ics"`,
      'Cache-Control': 'no-store',
    },
  })
}

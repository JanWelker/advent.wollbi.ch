import { renderToBuffer } from '@react-pdf/renderer'

import { pageWindows, yearOf } from '@/lib/content'
import { Flyer } from '@/lib/flyer'
import { publicHost, slugOf } from '@/lib/host'
import { dateRange, evenings } from '@/lib/windows'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const found = await pageWindows(slugOf(request))
  if (!found) return new Response('Not found', { status: 404 })
  const { page, site, windows } = found
  const list = evenings(windows)
  const times = [
    windows.weekdayTime ? `Mo–Fr ${windows.weekdayTime}` : null,
    windows.weekendTime ? `Sa & So ${windows.weekendTime}` : null,
  ]
    .filter(Boolean)
    .join('  ·  ')
  const pdf = await renderToBuffer(
    <Flyer
      title={page.title}
      range={dateRange(windows)}
      intro={site?.intro}
      evenings={list}
      times={times}
      line={windows.flyerLine}
      host={publicHost(request)}
      email={site?.email}
    />,
  )
  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="adventsfenster-${yearOf(list.map((e) => e.key))}.pdf"`,
      'Cache-Control': 'no-store',
    },
  })
}

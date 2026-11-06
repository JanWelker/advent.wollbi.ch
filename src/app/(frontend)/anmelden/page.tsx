import { getPayload } from 'payload'

import config from '@/payload.config'
import { codeMatches, dayLabel, daysBetween } from '@/lib/signup'
import { SignupForm } from './SignupForm'

// Rendered per request, so the taken days are the ones taken now.
export const dynamic = 'force-dynamic'

// Reached through the QR code on the flyer; not in the menu, not indexed.
export const metadata = { title: 'Anmeldung · Wollbi Adventsfenster', robots: { index: false } }

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>
}) {
  const { code } = await searchParams
  const payload = await getPayload({ config: await config })
  const signup = await payload.findGlobal({ slug: 'signup' })

  const message = !codeMatches(code, signup.code)
    ? 'Die Anmeldung geht über den QR-Code auf dem Flyer.'
    : !signup.open
      ? 'Die Anmeldung ist geschlossen.'
      : null

  let days: { day: string; label: string; house?: string | null }[] = []
  if (!message) {
    const all = daysBetween(signup.firstDay, signup.lastDay)
    const taken = await payload.find({
      collection: 'signups',
      where: { day: { in: all } },
      limit: all.length || 1,
      pagination: false,
    })
    const byDay = new Map(taken.docs.map((s) => [s.day, s.house]))
    days = all.map((day) => ({ day, label: dayLabel(day), house: byDay.get(day) }))
  }

  return (
    <>
      <header className="page-header wrap">
        <h1>Anmeldung</h1>
      </header>
      <section className="wrap signup">
        {message ? (
          <p className="lead">{message}</p>
        ) : (
          <>
            <p className="lead">
              {signup.intro ||
                'Wählt einen freien Tag. Pro Tag gibt es ein Fenster, und jedes Haus öffnet eines.'}
            </p>
            <SignupForm code={signup.code!} days={days} />
          </>
        )}
      </section>
    </>
  )
}

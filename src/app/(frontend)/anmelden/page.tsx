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
  searchParams: Promise<{ code?: string; tag?: string }>
}) {
  const { code, tag } = await searchParams
  const payload = await getPayload({ config: await config })
  const signup = await payload.findGlobal({ slug: 'signup' })

  // The street on the home page links here without the code, so it never
  // shows on a public page: without one, the page asks for it.
  const askCode = signup.open && !codeMatches(code, signup.code)
  const message = !signup.open ? 'Die Anmeldung ist geschlossen.' : null

  let days: { day: string; label: string; house?: string | null }[] = []
  if (!message && !askCode) {
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
        ) : askCode ? (
          <form className="signup-form" method="get">
            <p className="lead">
              {code
                ? 'Der Code stimmt nicht. Er steht auf dem Flyer unter dem QR-Code.'
                : 'Bitte den Code vom Flyer eingeben, oder den QR-Code auf dem Flyer scannen.'}
            </p>
            {tag ? <input type="hidden" name="tag" value={tag} /> : null}
            <label className="signup-field">
              <span>Code</span>
              <input
                name="code"
                defaultValue={code}
                required
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
              />
            </label>
            <button className="button button-primary" type="submit">
              Weiter
            </button>
          </form>
        ) : (
          <>
            <p className="lead">
              {signup.intro ||
                'Wählt einen freien Tag. Pro Tag gibt es ein Fenster, und jedes Haus öffnet eines.'}
            </p>
            <SignupForm code={signup.code!} days={days} chosen={tag} />
          </>
        )}
      </section>
    </>
  )
}

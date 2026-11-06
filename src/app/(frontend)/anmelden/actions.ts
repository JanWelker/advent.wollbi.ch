'use server'

import { getPayload } from 'payload'

import config from '@/payload.config'
import { codeMatches, dayDate, dayLabel, daysBetween, normaliseHouse } from '@/lib/signup'

export type SignupState = { ok?: boolean; error?: string; day?: string }

const text = (form: FormData, name: string, max: number) =>
  String(form.get(name) ?? '')
    .trim()
    .slice(0, max)

// First come, first served. The checks before the insert are for a friendly
// message; the unique indexes on the collection are what make it hold when
// two people press the button at the same moment.
export async function signUp(_: SignupState, form: FormData): Promise<SignupState> {
  const payload = await getPayload({ config: await config })
  const signup = await payload.findGlobal({ slug: 'signup' })

  if (!codeMatches(form.get('code'), signup.code)) {
    return { error: 'Der Code stimmt nicht. Bitte den QR-Code auf dem Flyer scannen.' }
  }
  if (!signup.open) return { error: 'Die Anmeldung ist geschlossen.' }

  const day = text(form, 'day', 10)
  const house = normaliseHouse(text(form, 'house', 12)) as string
  const names = text(form, 'names', 120)
  if (!daysBetween(signup.firstDay, signup.lastDay).includes(day)) {
    return { error: 'Bitte einen Tag wählen.' }
  }
  if (!house || !names) return { error: 'Bitte Hausnummer und Namen angeben.' }

  const year = Number(day.slice(0, 4))
  const taken = async () => {
    const [byDay, byHouse] = await Promise.all([
      payload.count({ collection: 'signups', where: { day: { equals: day } } }),
      payload.count({
        collection: 'signups',
        where: { and: [{ year: { equals: year } }, { house: { equals: house } }] },
      }),
    ])
    if (byDay.totalDocs) return { error: `Der ${dayLabel(day)} ist schon vergeben.` }
    if (byHouse.totalDocs) {
      return { error: `${house} hat schon einen Tag. Für eine Änderung bitte beim OK melden.` }
    }
    return null
  }

  const conflict = await taken()
  if (conflict) return conflict

  try {
    await payload.create({
      collection: 'signups',
      data: {
        date: dayDate(day),
        day,
        year,
        house,
        names,
        note: text(form, 'note', 120) || undefined,
        contact: text(form, 'contact', 120) || undefined,
      },
    })
  } catch (err) {
    const lost = await taken()
    if (lost) return lost
    payload.logger.error({ err }, 'sign-up failed')
    return { error: 'Das hat nicht geklappt. Bitte nochmals versuchen.' }
  }
  return { ok: true, day }
}

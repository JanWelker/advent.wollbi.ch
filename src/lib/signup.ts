import { randomBytes, timingSafeEqual } from 'crypto'
import type { Payload } from 'payload'

// The sign-up's helpers. A day is a `YYYY-MM-DD` string in Zurich time: the
// admin's day picker stores midnight local, which is the previous day in UTC,
// so the day a date means is read in Zurich, never from the ISO string.

type Block = Record<string, any>

export const dayKey = (iso: string | Date) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Zurich' }).format(new Date(iso))

// Noon UTC is the same calendar day in Zurich in summer and winter.
export const dayDate = (day: string) => `${day}T12:00:00.000Z`

export const daysBetween = (first?: string | null, last?: string | null): string[] => {
  if (!first || !last) return []
  const days: string[] = []
  const end = dayKey(last)
  for (
    let d = new Date(dayDate(dayKey(first)));
    dayKey(d) <= end;
    d.setUTCDate(d.getUTCDate() + 1)
  ) {
    days.push(dayKey(d))
    if (days.length > 62) break
  }
  return days
}

export const dayLabel = (day: string) =>
  new Intl.DateTimeFormat('de-CH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/Zurich',
  }).format(new Date(dayDate(day)))

// "w 43" and "W43" are the same house, or the one-house-one-day rule would
// let a household in twice.
export const normaliseHouse = (house: unknown) =>
  typeof house === 'string' ? house.replace(/\s+/g, '').toUpperCase() : house

// Twelve characters from an alphabet without 0/O and 1/I/L: printed under the
// QR code, it has to survive being typed off a flyer.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
export const newCode = () =>
  Array.from(randomBytes(12), (byte) => ALPHABET[byte % ALPHABET.length]).join('')

export const codeMatches = (given: unknown, expected?: string | null) => {
  if (typeof given !== 'string' || !expected) return false
  const a = Buffer.from(given.trim().toUpperCase())
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

// A windows block with `signupYear` set lists that year's sign-ups instead of
// its own rows. Resolved before rendering, so the street, the hero's dates
// and the list read one shape.
export const withSignups = async (payload: Payload, layout: Block[]): Promise<Block[]> =>
  Promise.all(
    layout.map(async (block) => {
      if (block.blockType !== 'windows' || !block.signupYear) return block
      const signups = await payload.find({
        collection: 'signups',
        where: { year: { equals: block.signupYear } },
        sort: 'day',
        limit: 100,
        pagination: false,
      })
      return {
        ...block,
        entries: signups.docs.map((signup) => ({
          date: dayDate(signup.day!),
          names: signup.names,
          house: signup.house,
          note: signup.note,
          time: signup.time,
        })),
      }
    }),
  )

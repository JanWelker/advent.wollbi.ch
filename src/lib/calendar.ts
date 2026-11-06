import type { Evening } from './windows'

// The windows as an iCalendar file, built per request from the same rows as
// the list, so the download never lags the page. One event per day with a
// stable UID: re-importing the file updates the events instead of doubling
// them.

// The houses are numbered W<n> on the Wollbacherstrasse; anything else is
// passed through as it was typed.
const STREET = 'Wollbacherstrasse'
const TOWN = '4058 Basel, CH'

const location = (house: string) => {
  const match = /^W\s*(\d+\w?)$/i.exec(house.trim())
  return match ? `${STREET} ${match[1]}, ${TOWN}` : house
}

const escape = (text: string) =>
  text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')

// RFC 5545 lines are at most 75 octets; longer ones continue on the next
// line after a space. Cut on characters, counting their UTF-8 bytes.
const fold = (line: string) => {
  const out: string[] = []
  let current = ''
  let bytes = 0
  for (const char of line) {
    const size = Buffer.byteLength(char)
    if (bytes + size > (out.length ? 74 : 75)) {
      out.push(current)
      current = ''
      bytes = 0
    }
    current += char
    bytes += size
  }
  out.push(current)
  return out.join('\r\n ')
}

// "19:00", "19.00", "19h" and "19 Uhr" all mean seven in the evening.
const startTime = (time: string) => {
  const match = /(\d{1,2})(?:[:.h](\d{2}))?/.exec(time)
  if (!match || Number(match[1]) > 23) return null
  return `${match[1].padStart(2, '0')}${match[2] ?? '00'}00`
}

const stamp = () =>
  new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')

// The Zurich rules, so a client that knows no TZID still places the events.
const VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  'TZID:Europe/Zurich',
  'BEGIN:DAYLIGHT',
  'DTSTART:19810329T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
  'TZNAME:CEST',
  'TZOFFSETFROM:+0100',
  'TZOFFSETTO:+0200',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'DTSTART:19961027T030000',
  'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
  'TZNAME:CET',
  'TZOFFSETFROM:+0200',
  'TZOFFSETTO:+0100',
  'END:STANDARD',
  'END:VTIMEZONE',
]

export const calendar = (evenings: Evening[], name: string, host: string) => {
  const now = stamp()
  const events = evenings.flatMap((evening) => {
    const date = evening.key.replace(/-/g, '')
    const time = startTime(evening.time)
    const summary =
      [evening.names, evening.house].join(' ') + (evening.note ? ` (${evening.note})` : '')
    return [
      'BEGIN:VEVENT',
      `UID:${evening.key}@${host}`,
      `DTSTAMP:${now}`,
      time ? `DTSTART;TZID=Europe/Zurich:${date}T${time}` : `DTSTART;VALUE=DATE:${date}`,
      time ? 'DURATION:PT1H' : 'DURATION:P1D',
      `SUMMARY:${escape(summary)}`,
      `LOCATION:${escape(location(evening.house))}`,
      `URL:https://${host}/`,
      'TRANSP:TRANSPARENT',
      'END:VEVENT',
    ]
  })
  return (
    [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      `PRODID:-//${host}//Adventsfenster//DE`,
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:${escape(name)}`,
      'X-WR-TIMEZONE:Europe/Zurich',
      ...VTIMEZONE,
      ...events,
      'END:VCALENDAR',
    ]
      .map(fold)
      .join('\r\n') + '\r\n'
  )
}

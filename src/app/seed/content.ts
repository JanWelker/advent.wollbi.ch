// What the site starts with: the Pelican pages' text, set in the night-street
// design's blocks. This file is the migration: after the first seed the
// database is the source of truth and editing happens in /admin.

export const site = {
  name: 'Wollbi Adventsfenster',
  subtitle: 'Jeden Dezember an der Wollbacherstrasse',
  intro:
    'Liebe Nachbarinnen und Nachbarn, wir laden euch herzlich zu unseren Adventsfenstern ein. Alle sind willkommen, mit uns die Adventszeit zu geniessen und gemeinsam schöne Momente zu erleben.',
  email: 'advent@wollbi.ch',
  team: [
    { house: 'W7', names: 'Andrea' },
    { house: 'W9', names: 'Sina & Jan' },
    { house: 'W42', names: 'Benj' },
  ],
  footer: '© wollbi.ch',
}

export const admin = {
  email: process.env.SEED_ADMIN_EMAIL || 'advent@wollbi.ch',
  name: 'Wollbi Adventsfenster OK',
}

// The 2025 flyer, row by row. Noon in Zurich, so the day is the same in
// every timezone the date passes through.
const day = (d: number) => `2025-12-${String(d).padStart(2, '0')}T11:00:00.000Z`

export const windows = {
  calendar: 'advent_2025.ics',
  flyer: 'flyer_2025.pdf',
  entries: [
    { date: day(7), names: 'Sabina & Raoul', house: 'W43' },
    {
      date: day(8),
      names: 'Matthias & Raphaela',
      house: 'W41',
      note: 'Apéro am 10.12., zusammen mit W45',
    },
    { date: day(9), names: 'Alain, Lisa, Emma & Gian', house: 'W26', note: 'ohne Apéro' },
    { date: day(10), names: 'Romy, Simone & Adrian', house: 'W45' },
    { date: day(11), names: 'Oliver & Andrea', house: 'W7' },
    { date: day(12), names: 'Rita & Silke', house: 'W1' },
    { date: day(13), names: 'Kathrin, Pascal & Aurelio', house: 'W52' },
    { date: day(14), names: 'Julian, Lucas, Céline & Kai', house: 'W6' },
    { date: day(16), names: 'Moscha, David & Loui', house: 'W37' },
    { date: day(17), names: 'Katrin, Dino, Leandra & Salome', house: 'W25' },
    { date: day(18), names: 'Monica & Peter', house: 'W39' },
    { date: day(20), names: 'Nerea, Maira, Maribel & Simon', house: 'W8' },
    { date: day(21), names: 'Sina & Jan', house: 'W9' },
  ],
}

export const cup = {
  title: 'Bring your own cup',
  text: 'Unter der Woche ab 19:00, am Wochenende ab 17:00. Bitte die eigene Tasse mitbringen.',
  image: 'advent_apero_2.jpg',
}

// The OK block on the same page already says where to write.
export const info = 'Wir freuen uns auf eine wunderbare Adventszeit mit euch!'

export const archiveIntro = 'Jeder Dezember hat seinen Flyer.'

// Year and the flyer that stands for it, oldest first.
export const archive: [string, string][] = [
  ['2023', 'flyer_2023.jpeg'],
  ['2024', 'flyer_2024.jpeg'],
  ['2025', 'flyer_2025.png'],
]

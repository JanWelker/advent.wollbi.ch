// The two Pelican pages, as they were in content/pages/*.md before the
// migration. This file is the migration: after the first seed the database
// is the source of truth and editing happens in /admin.

export const site = {
  name: 'Wollbi Adventsfenster',
  subtitle: 'Jeden Dezember an der Wollbacherstrasse',
  footer: '© wollbi.ch',
}

export const admin = {
  email: process.env.SEED_ADMIN_EMAIL || 'advent@wollbi.ch',
  name: 'Wollbi Adventsfenster OK',
}

export const welcome = {
  intro: `Liebe Nachbarinnen und Nachbarn

Wir laden euch herzlich zu unseren Adventsfenstern ein! Alle sind willkommen, mit uns die Adventszeit zu geniessen und gemeinsam schöne Momente zu erleben.

Im Flyer findet ihr die Termine unserer Apéros während der Adventszeit.`,
  flyerImage: 'flyer_2025.png',
  downloads: [
    { label: 'Flyer als PDF herunterladen', file: 'flyer_2025.pdf' },
    { label: 'Programm als Kalenderdatei herunterladen', file: 'advent_2025.ics' },
  ],
  closing: `Wir freuen uns auf eine wunderbare Adventszeit mit euch!

Benj (W42), Andrea (W7), Jan & Sina (W9)`,
}

export const info = `Im OK der diesjährigen Ausgabe sind:

* W7: Andrea
* W9: Sina & Jan
* W42: Benj

Anregungen und Fragen können gerne an [advent@wollbi.ch](mailto:advent@wollbi.ch) gesendet werden.`

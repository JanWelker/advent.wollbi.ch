import { Fredoka, Nunito } from 'next/font/google'
import { getPayload } from 'payload'
import React from 'react'

import { NavLinks } from '@/components/NavLinks'
import config from '@/payload.config'
import { Analytics } from './Analytics'
import { Snow } from './Snow'
import './styles.css'

// Rounded lettering for the night street, the same Nunito as the
// Wollbi-Fescht for the text. next/font downloads both at build time and
// serves them from this site, so a visitor's browser never asks Google.
const display = Fredoka({
  weight: ['500', '600'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})
const body = Nunito({
  weight: ['400', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata = {
  title: 'Wollbi Adventsfenster',
  description: 'Die Adventsfenster an der Wollbacherstrasse.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config: await config })
  const site = await payload.findGlobal({ slug: 'site' })
  const pages = await payload.find({
    collection: 'pages',
    where: { showInNav: { equals: true } },
    sort: 'order',
    limit: 50,
  })
  const links = pages.docs.map((page) => ({
    href: page.slug === 'home' ? '/' : `/${page.slug}`,
    label: page.navLabel || page.title,
  }))
  const name = site?.name ?? 'Adventsfenster'

  return (
    <html lang="de" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip" href="#inhalt">
          Zum Inhalt
        </a>
        <Snow />
        <header className="site-header">
          <nav className="nav wrap" aria-label="Hauptnavigation">
            <a className="brand" href="/">
              {name}
            </a>
            <NavLinks links={links} />
          </nav>
        </header>
        <main id="inhalt">{children}</main>
        <footer className="site-footer">
          <div className="footer-inner wrap">
            <span className="footer-brand">
              <span className="brand">{name}</span>
              {site?.subtitle ? <span>{site.subtitle}</span> : null}
            </span>
            <span>
              {site?.footer ?? '© wollbi.ch'}
              {site?.email ? (
                <>
                  {' · '}
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </>
              ) : null}
              {/* The sister site: same street, the other end of the year. */}
              {' · Im Sommer: '}
              <a href="https://fest.wollbi.ch/">Wollbi-Fescht</a>
            </span>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}

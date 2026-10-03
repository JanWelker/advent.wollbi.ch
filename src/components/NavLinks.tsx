'use client'

import { usePathname } from 'next/navigation'

// The only client component: it needs the current path to mark the page
// the visitor is on.
export const NavLinks = ({ links }: { links: { href: string; label: string }[] }) => {
  const pathname = usePathname()
  return (
    <ul className="nav-links">
      {links.map((link) => (
        <li key={link.href}>
          <a href={link.href} aria-current={pathname === link.href ? 'page' : undefined}>
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  )
}

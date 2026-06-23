'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import styles from './Nav.module.css'

export function Nav() {
  const pathname = usePathname()

  const links = [
    { href: '/exhibitions', label: '當期策展' },
    { href: '/artists', label: '藝術家' },
    { href: '/works', label: '典藏' },
    { href: '/about', label: '關於' },
  ]

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        <Image src="/logo.webp" alt="息壤" width={44} height={44} priority />
        <span className={styles.vdiv} aria-hidden />
        <span className={styles.logoText}>
          <span className={styles.zh}>息壤</span>
          <span className={styles.en}>Digital Art Museum</span>
        </span>
      </Link>

      <ul className={styles.links}>
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className={pathname.startsWith(l.href) ? styles.active : undefined}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <Link href="/apply" className={styles.apply}>
        申請加入
      </Link>
    </nav>
  )
}

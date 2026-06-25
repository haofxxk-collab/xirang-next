'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import styles from './Nav.module.css'

export function Nav({
  brandZh = '息壤',
  brandEn = 'Digital Art Museum',
}: {
  brandZh?: string
  brandEn?: string
} = {}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const links = [
    { href: '/exhibitions', label: '當期策展' },
    { href: '/artists', label: '藝術家' },
    { href: '/works', label: '典藏' },
    { href: '/about', label: '關於' },
  ]

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <Image src="/logo.png" alt={brandZh} width={52} height={76} priority />
          <span className={styles.vdiv} aria-hidden />
          <span className={styles.logoText}>
            <span className={styles.zh}>{brandZh}</span>
            <span className={styles.en}>{brandEn}</span>
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

        <Link href="/apply" className={styles.apply}>申請加入</Link>

        <button
          className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
          onClick={() => setOpen(!open)}
          aria-label={open ? '關閉選單' : '開啟選單'}
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ''}`} aria-hidden={!open}>
        <ul className={styles.mobileLinks}>
          {links.map((l, i) => (
            <li
              key={l.href}
              className={`${styles.mobileItem} ${open ? styles.mobileItemIn : ''}`}
              style={{ transitionDelay: open ? `${i * 60 + 80}ms` : '0ms' }}
            >
              <Link
                href={l.href}
                className={pathname.startsWith(l.href) ? styles.mobileActive : undefined}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/apply"
          className={`${styles.mobileApply} ${open ? styles.mobileItemIn : ''}`}
          style={{ transitionDelay: open ? '330ms' : '0ms' }}
          onClick={() => setOpen(false)}
        >
          申請加入
        </Link>
      </div>
    </>
  )
}

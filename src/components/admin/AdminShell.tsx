'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import styles from './AdminShell.module.css'

const navItems = [
  { href: '/admin/dashboard',    icon: '◈', label: '總覽' },
  { href: '/admin/artists',      icon: '人', label: '藝術家' },
  { href: '/admin/artworks',     icon: '畫', label: '作品典藏' },
  { href: '/admin/applications', icon: '申', label: '申請審核' },
]

export default function AdminShell({
  children,
  title,
  badge,
}: {
  children: React.ReactNode
  title: string
  badge?: string
}) {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/admin')
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoTitle}>息壤</div>
          <div className={styles.logoSub}>內容管理後台</div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname.startsWith(item.href) ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <div className={styles.navDivider} />
          <Link href="/" target="_blank" className={styles.navItem}>
            <span className={styles.navIcon}>↗</span>
            檢視網站
          </Link>
        </nav>

        <div className={styles.logoutBtn}>
          <button onClick={logout} className={styles.navItem} style={{ color: '#6e6860' }}>
            <span className={styles.navIcon}>⏻</span>
            登出
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <div className={styles.topbar}>
          <span className={styles.topbarTitle}>{title}</span>
          {badge && <span className={styles.topbarBadge}>{badge}</span>}
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}

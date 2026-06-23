'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import styles from './dashboard.module.css'

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({ artists: 0, artworks: 0, applications: 0 })

  useEffect(() => {
    async function load() {
      const [a, b] = await Promise.all([
        fetch('/api/admin/artists').then((r) => {
          if (r.status === 401) { router.push('/admin'); return [] }
          return r.json()
        }),
        fetch('/api/admin/applications').then((r) => r.ok ? r.json() : []),
      ])
      setStats({
        artists: Array.isArray(a) ? a.length : 0,
        artworks: 0,
        applications: Array.isArray(b) ? b.filter((x: any) => x.status === 'pending').length : 0,
      })
    }
    load()
  }, [router])

  const cards = [
    { label: '藝術家', value: stats.artists, icon: '人', href: '/admin/artists', color: '#b8935a' },
    { label: '待審申請', value: stats.applications, icon: '申', href: '/admin/applications', color: '#7a9e7e' },
  ]

  return (
    <AdminShell title="總覽">
      <div className={styles.grid}>
        {cards.map((c) => (
          <div key={c.label} className={styles.card} onClick={() => router.push(c.href)} style={{ cursor: 'pointer' }}>
            <div className={styles.cardIcon} style={{ color: c.color }}>{c.icon}</div>
            <div className={styles.cardValue} style={{ color: c.color }}>{c.value}</div>
            <div className={styles.cardLabel}>{c.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>快速操作</h2>
        <div className={styles.actions}>
          <button className={styles.action} onClick={() => router.push('/admin/artists')}>
            ＋ 新增藝術家
          </button>
          <button className={styles.action} onClick={() => router.push('/admin/applications')}>
            查看申請列表
          </button>
          <button className={styles.action} onClick={() => window.open('/', '_blank')}>
            ↗ 檢視網站
          </button>
        </div>
      </div>
    </AdminShell>
  )
}

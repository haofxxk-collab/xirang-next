'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import styles from './artworks.module.css'

type Artwork = {
  _id: string
  title: string
  year: number
  medium: string
  status: string
  artist: { name: string }
}

const statusLabel: Record<string, string> = {
  available:    '可洽購',
  inquire:      '詢價',
  'not-for-sale': '非賣品',
}

const statusColor: Record<string, string> = {
  available:    '#5a9e7a',
  inquire:      '#b8935a',
  'not-for-sale': '#6e6860',
}

export default function ArtworksPage() {
  const router = useRouter()
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/artworks')
      if (res.status === 401) { router.push('/admin'); return }
      if (res.ok) setArtworks(await res.json())
      setLoading(false)
    }
    load()
  }, [router])

  return (
    <AdminShell title="作品典藏" badge={`共 ${artworks.length} 件`}>
      {loading ? (
        <p style={{ color: '#6e6860' }}>載入中…</p>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>作品名稱</span>
            <span>藝術家</span>
            <span>年份</span>
            <span>媒材</span>
            <span>狀態</span>
          </div>
          {artworks.map((w) => (
            <div key={w._id} className={styles.tableRow}>
              <span className={styles.title}>{w.title}</span>
              <span className={styles.sub}>{w.artist?.name ?? '—'}</span>
              <span className={styles.sub}>{w.year}</span>
              <span className={styles.sub}>{w.medium}</span>
              <span
                className={styles.badge}
                style={{ color: statusColor[w.status], borderColor: statusColor[w.status] + '55', background: statusColor[w.status] + '11' }}
              >
                {statusLabel[w.status] ?? w.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  )
}

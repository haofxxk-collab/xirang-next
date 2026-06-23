'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import styles from './artists.module.css'

type Artist = {
  _id: string
  name: string
  nameEn: string
  location: string
  medium: string[]
  yearsActive: number
  featured: boolean
}

export default function ArtistsPage() {
  const router = useRouter()
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function load() {
    const res = await fetch('/api/admin/artists')
    if (res.status === 401) { router.push('/admin'); return }
    setArtists(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function toggleFeatured(artist: Artist) {
    await fetch('/api/admin/artists', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: artist._id, featured: !artist.featured }),
    })
    load()
  }

  async function deleteArtist(id: string, name: string) {
    if (!confirm(`確定刪除「${name}」？此操作無法復原。`)) return
    setDeleting(id)
    await fetch('/api/admin/artists', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    load()
    setDeleting(null)
  }

  return (
    <AdminShell title="藝術家管理" badge={`共 ${artists.length} 位`}>
      {loading ? (
        <p style={{ color: '#6e6860' }}>載入中…</p>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>姓名</span>
            <span>英文姓名</span>
            <span>所在地</span>
            <span>媒材</span>
            <span>資歷</span>
            <span>精選</span>
            <span>操作</span>
          </div>
          {artists.map((a) => (
            <div key={a._id} className={styles.tableRow}>
              <span className={styles.name}>{a.name}</span>
              <span className={styles.sub}>{a.nameEn}</span>
              <span className={styles.sub}>{a.location}</span>
              <span className={styles.sub}>{a.medium?.join('・') ?? '—'}</span>
              <span className={styles.sub}>{a.yearsActive} 年</span>
              <span>
                <button
                  className={`${styles.badge} ${a.featured ? styles.badgeOn : ''}`}
                  onClick={() => toggleFeatured(a)}
                >
                  {a.featured ? '精選中' : '設為精選'}
                </button>
              </span>
              <span className={styles.actions}>
                <button
                  className={styles.btnDanger}
                  onClick={() => deleteArtist(a._id, a.name)}
                  disabled={deleting === a._id}
                >
                  {deleting === a._id ? '刪除中…' : '刪除'}
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  )
}

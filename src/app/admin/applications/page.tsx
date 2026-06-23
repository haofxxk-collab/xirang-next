'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import styles from './applications.module.css'

type Application = {
  id: string
  created_at: string
  name: string
  name_en: string
  email: string
  phone: string
  region: string
  applicant_type: string
  media: string[]
  years_active: string
  bio: string
  exhibitions: string
  portfolio_url: string
  notes: string
  status: 'pending' | 'reviewing' | 'approved' | 'rejected'
  reviewer_notes: string
}

const statusLabel: Record<string, string> = {
  pending: '待審核',
  reviewing: '審核中',
  approved: '已通過',
  rejected: '已婉拒',
}

const statusColor: Record<string, string> = {
  pending: '#b8935a',
  reviewing: '#7a9e7e',
  approved: '#5a9e7a',
  rejected: '#9e5a5a',
}

const typeLabel: Record<string, string> = {
  artist: '藝術家本人',
  family: '家屬代理',
  agent: '經紀人',
  recommendation: '他人推薦',
}

export default function ApplicationsPage() {
  const router = useRouter()
  const [list, setList]         = useState<Application[]>([])
  const [filter, setFilter]     = useState('all')
  const [selected, setSelected] = useState<Application | null>(null)
  const [note, setNote]         = useState('')
  const [loading, setLoading]   = useState(true)

  async function load(status = filter) {
    const res = await fetch(`/api/admin/applications?status=${status}`)
    if (res.status === 401) { router.push('/admin'); return }
    if (res.ok) setList(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  async function updateStatus(id: string, status: string) {
    await fetch('/api/admin/applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, reviewer_notes: note }),
    })
    setSelected(null)
    setNote('')
    load()
  }

  const filters = ['all', 'pending', 'reviewing', 'approved', 'rejected']

  return (
    <AdminShell title="申請審核" badge={`${list.length} 筆`}>
      <div className={styles.filterRow}>
        {filters.map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? '全部' : statusLabel[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: '#6e6860' }}>載入中…</p>
      ) : list.length === 0 ? (
        <p style={{ color: '#6e6860' }}>目前沒有申請記錄。</p>
      ) : (
        <div className={styles.list}>
          {list.map((app) => (
            <div key={app.id} className={styles.card} onClick={() => { setSelected(app); setNote(app.reviewer_notes ?? '') }}>
              <div className={styles.cardTop}>
                <span className={styles.cardName}>{app.name}</span>
                {app.name_en && <span className={styles.cardSub}>{app.name_en}</span>}
                <span className={styles.statusBadge} style={{ color: statusColor[app.status], borderColor: statusColor[app.status] + '44', background: statusColor[app.status] + '11' }}>
                  {statusLabel[app.status]}
                </span>
              </div>
              <div className={styles.cardMeta}>
                <span>{app.region}</span>
                <span>·</span>
                <span>{typeLabel[app.applicant_type]}</span>
                <span>·</span>
                <span>{app.media?.join('、')}</span>
                <span>·</span>
                <span>創作資歷 {app.years_active}</span>
              </div>
              <p className={styles.cardBio}>{app.bio?.slice(0, 100)}{app.bio?.length > 100 ? '…' : ''}</p>
              <div className={styles.cardDate}>{new Date(app.created_at).toLocaleDateString('zh-TW')}</div>
            </div>
          ))}
        </div>
      )}

      {/* 詳細審核 Modal */}
      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <div className={styles.modalName}>{selected.name}</div>
                <div className={styles.modalSub}>{selected.email} · {selected.phone}</div>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}><span>地區</span><strong>{selected.region}</strong></div>
                <div className={styles.infoItem}><span>申請類型</span><strong>{typeLabel[selected.applicant_type]}</strong></div>
                <div className={styles.infoItem}><span>媒材</span><strong>{selected.media?.join('、')}</strong></div>
                <div className={styles.infoItem}><span>創作資歷</span><strong>{selected.years_active}</strong></div>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionLabel}>藝術家簡介</div>
                <p className={styles.sectionText}>{selected.bio}</p>
              </div>

              {selected.exhibitions && (
                <div className={styles.section}>
                  <div className={styles.sectionLabel}>展覽經歷</div>
                  <p className={styles.sectionText}>{selected.exhibitions}</p>
                </div>
              )}

              {selected.portfolio_url && (
                <div className={styles.section}>
                  <div className={styles.sectionLabel}>作品集連結</div>
                  <a href={selected.portfolio_url} target="_blank" rel="noreferrer" className={styles.link}>{selected.portfolio_url}</a>
                </div>
              )}

              <div className={styles.section}>
                <div className={styles.sectionLabel}>審核備注</div>
                <textarea
                  className={styles.noteInput}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="輸入審核備注（可留空）"
                  rows={3}
                />
              </div>

              <div className={styles.modalActions}>
                <button className={styles.btnApprove} onClick={() => updateStatus(selected.id, 'approved')}>✓ 通過</button>
                <button className={styles.btnReview}  onClick={() => updateStatus(selected.id, 'reviewing')}>◎ 審核中</button>
                <button className={styles.btnReject}  onClick={() => updateStatus(selected.id, 'rejected')}>✕ 婉拒</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}

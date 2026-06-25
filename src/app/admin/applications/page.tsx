'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import AdminShell from '@/components/admin/AdminShell'
import styles from './applications.module.css'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (res.status === 401) throw new Error('401')
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

type Application = {
  id: string; created_at: string; name: string; name_en: string; email: string
  phone: string; region: string; applicant_type: string; media: string[]
  years_active: string; bio: string; exhibitions: string; portfolio_url: string
  notes: string; status: 'pending' | 'reviewing' | 'approved' | 'rejected'; reviewer_notes: string
}

const statusLabel: Record<string, string> = { pending: '待審核', reviewing: '審核中', approved: '已通過', rejected: '已婉拒' }
const statusColor: Record<string, string> = { pending: '#b8935a', reviewing: '#7a9e7e', approved: '#5a9e7a', rejected: '#9e5a5a' }
const typeLabel: Record<string, string> = { artist: '藝術家本人', family: '家屬代理', agent: '經紀人', recommendation: '他人推薦' }

export default function ApplicationsPage() {
  const router = useRouter()
  const [filter, setFilter] = useState('all')
  const { data: list = [], mutate, isLoading, error } = useSWR<Application[]>(
    `/api/admin/applications?status=${filter}`, fetcher, { revalidateOnFocus: false }
  )
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkConfirm, setBulkConfirm] = useState(false)
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [viewing, setViewing] = useState<Application | null>(null)
  const [note, setNote] = useState('')

  if (error?.message === '401') { router.push('/admin'); return null }

  const allSelected = list.length > 0 && selected.size === list.length
  function toggleSelect(id: string) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(list.map(a => a.id)))
  }

  // Clear selection when filter changes
  useEffect(() => { setSelected(new Set()) }, [filter])

  async function updateStatus(id: string, status: string) {
    await fetch('/api/admin/applications', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, reviewer_notes: note }),
    })
    setViewing(null); setNote(''); mutate()
  }

  async function deleteOne(id: string) {
    mutate(list.filter(a => a.id !== id), false)
    await fetch('/api/admin/applications', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    mutate()
  }

  async function bulkDelete() {
    const ids = [...selected]; setBulkDeleting(true); setBulkConfirm(false)
    mutate(list.filter(a => !ids.includes(a.id)), false); setSelected(new Set())
    await fetch('/api/admin/applications', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    })
    setBulkDeleting(false); mutate()
  }

  const filters = ['all', 'pending', 'reviewing', 'approved', 'rejected']

  return (
    <AdminShell title="申請審核" badge={`${list.length} 筆`}>
      <div className={styles.topBar}>
        <div className={styles.filterRow}>
          {filters.map((f) => (
            <button key={f} className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? '全部' : statusLabel[f]}
            </button>
          ))}
        </div>
        {selected.size > 0 && (
          <div className={styles.bulkBar}>
            <span>已選取 {selected.size} 筆</span>
            {bulkConfirm ? (
              <>
                <span className={styles.bulkWarning}>確定刪除？</span>
                <button className={styles.btnDangerSm} onClick={bulkDelete} disabled={bulkDeleting}>{bulkDeleting ? '刪除中…' : '確定刪除'}</button>
                <button className={styles.btnCancelSm} onClick={() => setBulkConfirm(false)}>取消</button>
              </>
            ) : (
              <button className={styles.btnDangerSm} onClick={() => setBulkConfirm(true)}>批量刪除</button>
            )}
            <button className={styles.btnCancelSm} onClick={() => setSelected(new Set())}>清除</button>
          </div>
        )}
      </div>

      {isLoading ? (
        <p style={{ color: '#6e6860' }}>載入中…</p>
      ) : list.length === 0 ? (
        <p style={{ color: '#6e6860' }}>目前沒有申請記錄。</p>
      ) : (
        <div className={styles.list}>
          {list.map((app) => (
            <div key={app.id} className={`${styles.card} ${selected.has(app.id) ? styles.cardSelected : ''}`}>
              <div className={styles.cardCheck}>
                <input type="checkbox" checked={selected.has(app.id)} onChange={() => toggleSelect(app.id)} className={styles.checkbox} />
              </div>
              <div className={styles.cardBody} onClick={() => { setViewing(app); setNote(app.reviewer_notes ?? '') }}>
                <div className={styles.cardTop}>
                  <span className={styles.cardName}>{app.name}</span>
                  {app.name_en && <span className={styles.cardSub}>{app.name_en}</span>}
                  <span className={styles.statusBadge} style={{ color: statusColor[app.status], borderColor: statusColor[app.status] + '44', background: statusColor[app.status] + '11' }}>
                    {statusLabel[app.status]}
                  </span>
                </div>
                <div className={styles.cardMeta}>
                  <span>{app.region}</span><span>·</span><span>{typeLabel[app.applicant_type]}</span>
                  <span>·</span><span>{app.media?.join('、')}</span><span>·</span><span>創作資歷 {app.years_active}</span>
                </div>
                <p className={styles.cardBio}>{app.bio?.slice(0, 100)}{app.bio?.length > 100 ? '…' : ''}</p>
                <div className={styles.cardDate}>{new Date(app.created_at).toLocaleDateString('zh-TW')}</div>
              </div>
              <button className={styles.cardDeleteBtn} onClick={() => deleteOne(app.id)} title="刪除">✕</button>
            </div>
          ))}
        </div>
      )}

      {/* 全選欄 */}
      {list.length > 1 && (
        <div className={styles.selectAll}>
          <input type="checkbox" checked={allSelected} onChange={toggleAll} className={styles.checkbox} />
          <span>{allSelected ? '取消全選' : `全選 ${list.length} 筆`}</span>
        </div>
      )}

      {viewing && (
        <div className={styles.overlay} onClick={() => setViewing(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <div className={styles.modalName}>{viewing.name}</div>
                <div className={styles.modalSub}>{viewing.email} · {viewing.phone}</div>
              </div>
              <button className={styles.closeBtn} onClick={() => setViewing(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}><span>地區</span><strong>{viewing.region}</strong></div>
                <div className={styles.infoItem}><span>申請類型</span><strong>{typeLabel[viewing.applicant_type]}</strong></div>
                <div className={styles.infoItem}><span>媒材</span><strong>{viewing.media?.join('、')}</strong></div>
                <div className={styles.infoItem}><span>創作資歷</span><strong>{viewing.years_active}</strong></div>
              </div>
              <div className={styles.section}><div className={styles.sectionLabel}>藝術家簡介</div><p className={styles.sectionText}>{viewing.bio}</p></div>
              {viewing.exhibitions && <div className={styles.section}><div className={styles.sectionLabel}>展覽經歷</div><p className={styles.sectionText}>{viewing.exhibitions}</p></div>}
              {viewing.portfolio_url && <div className={styles.section}><div className={styles.sectionLabel}>作品集連結</div><a href={viewing.portfolio_url} target="_blank" rel="noreferrer" className={styles.link}>{viewing.portfolio_url}</a></div>}
              <div className={styles.section}>
                <div className={styles.sectionLabel}>審核備注</div>
                <textarea className={styles.noteInput} value={note} onChange={(e) => setNote(e.target.value)} placeholder="輸入審核備注（可留空）" rows={3} />
              </div>
              <div className={styles.modalActions}>
                <button className={styles.btnApprove} onClick={() => updateStatus(viewing.id, 'approved')}>✓ 通過</button>
                <button className={styles.btnReview} onClick={() => updateStatus(viewing.id, 'reviewing')}>◎ 審核中</button>
                <button className={styles.btnReject} onClick={() => updateStatus(viewing.id, 'rejected')}>✕ 婉拒</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}

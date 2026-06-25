'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import Image from 'next/image'
import AdminShell from '@/components/admin/AdminShell'
import styles from './exhibitions.module.css'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (res.status === 401) throw new Error('401')
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

type Exhibition = {
  _id: string; title: string; titleEn: string; type: string; status: string
  startDate: string; endDate: string; description: string; coverUrl?: string
}

const typeOptions = [
  { value: 'solo', label: '個展' }, { value: 'duo', label: '雙人展' },
  { value: 'group', label: '聯展' }, { value: 'annual', label: '年度大展' },
  { value: 'opening', label: '開幕首展' },
]
const statusOptions = [
  { value: 'current', label: '當期展出' }, { value: 'upcoming', label: '即將展出' },
  { value: 'past', label: '已結束' },
]
const statusColor: Record<string, string> = { current: '#5a9e7a', upcoming: '#b8935a', past: '#6e6860' }

export default function ExhibitionsPage() {
  const router = useRouter()
  const { data: exhibitions = [], mutate, isLoading, error } = useSWR<Exhibition[]>(
    '/api/admin/exhibitions', fetcher, { revalidateOnFocus: false, dedupingInterval: 5000 }
  )
  const [editing, setEditing] = useState<Exhibition | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [bulkConfirm, setBulkConfirm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [newAssetId, setNewAssetId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    title: '', titleEn: '', type: 'solo', status: 'current', startDate: '', endDate: '', description: '',
  })

  if (error?.message === '401') { router.push('/admin'); return null }

  const allSelected = exhibitions.length > 0 && selected.size === exhibitions.length
  function toggleSelect(id: string) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(exhibitions.map(e => e._id)))
  }

  async function deleteExhibition(id: string) {
    setDeleting(id); setConfirmId(null)
    mutate(exhibitions.filter(e => e._id !== id), false)
    const res = await fetch('/api/admin/exhibitions', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }),
    })
    if (!res.ok) { const d = await res.json().catch(() => ({})); alert(`刪除失敗：${d.error ?? res.status}`); mutate() }
    setDeleting(null); mutate()
  }

  async function bulkDelete() {
    const ids = [...selected]; setBulkDeleting(true); setBulkConfirm(false)
    mutate(exhibitions.filter(e => !ids.includes(e._id)), false); setSelected(new Set())
    const results = await Promise.all(ids.map(id =>
      fetch('/api/admin/exhibitions', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    ))
    const failed = results.filter(r => !r.ok).length
    if (failed > 0) alert(`${failed} 筆刪除失敗`)
    setBulkDeleting(false); mutate()
  }

  function openEdit(ex: Exhibition) {
    setEditing(ex)
    setForm({ title: ex.title ?? '', titleEn: ex.titleEn ?? '', type: ex.type ?? 'solo',
      status: ex.status ?? 'current', startDate: ex.startDate ?? '', endDate: ex.endDate ?? '', description: ex.description ?? '' })
    setPreviewUrl(ex.coverUrl ?? null); setNewAssetId(null)
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    if (res.ok) { const { assetId, url } = await res.json(); setNewAssetId(assetId); setPreviewUrl(url) }
    else alert('上傳失敗，請重試')
    setUploading(false)
  }

  async function saveEdit() {
    if (!editing) return; setSaving(true)
    const patch: Record<string, any> = { title: form.title, titleEn: form.titleEn, type: form.type,
      status: form.status, startDate: form.startDate, endDate: form.endDate, description: form.description }
    if (newAssetId) patch.coverImage = { _type: 'image', asset: { _type: 'reference', _ref: newAssetId } }
    await fetch('/api/admin/exhibitions', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing._id, ...patch }) })
    setSaving(false); setEditing(null); mutate()
  }

  return (
    <AdminShell title="策展管理" badge={`共 ${exhibitions.length} 個展覽`}>
      {selected.size > 0 && (
        <div className={styles.bulkBar}>
          <span>已選取 {selected.size} 個</span>
          {bulkConfirm ? (
            <>
              <span className={styles.bulkWarning}>確定刪除這 {selected.size} 個展覽？</span>
              <button className={styles.btnDangerSm} onClick={bulkDelete} disabled={bulkDeleting}>{bulkDeleting ? '刪除中…' : '確定刪除'}</button>
              <button className={styles.btnCancelSm} onClick={() => setBulkConfirm(false)}>取消</button>
            </>
          ) : (
            <button className={styles.btnDangerSm} onClick={() => setBulkConfirm(true)}>批量刪除</button>
          )}
          <button className={styles.btnCancelSm} onClick={() => setSelected(new Set())}>清除選取</button>
        </div>
      )}

      {isLoading ? (
        <p style={{ color: '#6e6860' }}>載入中…</p>
      ) : error ? (
        <p style={{ color: '#e07070' }}>載入失敗 <button onClick={() => mutate()} style={{ marginLeft: 8, color: '#b8935a', background: 'none', border: 'none', cursor: 'pointer' }}>重試</button></p>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span><input type="checkbox" checked={allSelected} onChange={toggleAll} className={styles.checkbox} /></span>
            <span>封面</span><span>展覽名稱</span><span>英文名稱</span>
            <span>類型</span><span>日期</span><span>狀態</span><span>操作</span>
          </div>
          {exhibitions.map((ex) => (
            <div key={ex._id} className={`${styles.tableRow} ${selected.has(ex._id) ? styles.rowSelected : ''}`}>
              <span><input type="checkbox" checked={selected.has(ex._id)} onChange={() => toggleSelect(ex._id)} className={styles.checkbox} /></span>
              <span>
                {ex.coverUrl
                  ? <Image src={ex.coverUrl} alt={ex.title} width={56} height={56} className={styles.thumb} />
                  : <div className={styles.thumbEmpty}>無封面</div>}
              </span>
              <span className={styles.title}>{ex.title}</span>
              <span className={styles.sub}>{ex.titleEn || '—'}</span>
              <span className={styles.sub}>{typeOptions.find(t => t.value === ex.type)?.label ?? ex.type}</span>
              <span className={styles.sub}>
                {ex.startDate ? ex.startDate.slice(0, 7) : '—'}{ex.endDate ? ` → ${ex.endDate.slice(0, 7)}` : ''}
              </span>
              <span>
                <span className={styles.badge} style={{ color: statusColor[ex.status], borderColor: statusColor[ex.status] + '55', background: statusColor[ex.status] + '11' }}>
                  {statusOptions.find(s => s.value === ex.status)?.label ?? ex.status}
                </span>
              </span>
              <span className={styles.actions}>
                <button className={styles.btnEdit} onClick={() => openEdit(ex)}>編輯</button>
                {confirmId === ex._id ? (
                  <>
                    <button className={styles.btnDanger} onClick={() => deleteExhibition(ex._id)} disabled={deleting === ex._id}>確定</button>
                    <button className={styles.btnCancelSm} onClick={() => setConfirmId(null)}>否</button>
                  </>
                ) : (
                  <button className={styles.btnDanger} onClick={() => setConfirmId(ex._id)}>刪除</button>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className={styles.modalBackdrop} onClick={e => { if (e.target === e.currentTarget) setEditing(null) }}>
          <div className={styles.modal}>
            <div className={styles.modalTitle}>編輯展覽：{editing.title}</div>
            <div className={styles.photoRow}>
              {previewUrl ? <Image src={previewUrl} alt="封面" width={100} height={66} className={styles.coverPreview} /> : <div className={styles.photoEmpty}>尚無封面</div>}
              <div>
                <button className={styles.uploadBtn} onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? '上傳中…' : '上傳封面圖'}</button>
                <p className={styles.uploadHint}>建議 16:9 橫向，JPG / PNG，3MB 以內</p>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverUpload} />
              </div>
            </div>
            <div className={styles.formGrid}>
              <div className={styles.formFull}><label className={styles.label}>展覽名稱（中文）</label><input className={styles.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
              <div className={styles.formFull}><label className={styles.label}>展覽名稱（英文）</label><input className={styles.input} value={form.titleEn} onChange={e => setForm(f => ({ ...f, titleEn: e.target.value }))} /></div>
              <div><label className={styles.label}>展覽類型</label><select className={styles.input} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>{typeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
              <div><label className={styles.label}>展覽狀態</label><select className={styles.input} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>{statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
              <div><label className={styles.label}>開始日期</label><input className={styles.input} type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} /></div>
              <div><label className={styles.label}>結束日期</label><input className={styles.input} type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} /></div>
              <div className={styles.formFull}><label className={styles.label}>展覽說明</label><textarea className={styles.textarea} rows={5} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.btnCancel} onClick={() => setEditing(null)}>取消</button>
              <button className={styles.btnSave} onClick={saveEdit} disabled={saving || uploading}>{saving ? '儲存中…' : '儲存'}</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}

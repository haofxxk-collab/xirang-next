'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import Image from 'next/image'
import AdminShell from '@/components/admin/AdminShell'
import styles from './artworks.module.css'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (res.status === 401) throw new Error('401')
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

type Artwork = {
  _id: string; title: string; year: number; medium: string; dimensions: string
  series: string; status: string; price: number; description: string
  artist: { _id: string; name: string }; imageUrl?: string
  workProcessLabel?: string; workProcessTitle?: string
  workProcess1Title?: string; workProcess1Body?: string
  workProcess2Title?: string; workProcess2Body?: string
  workProcess3Title?: string; workProcess3Body?: string
}

type Artist = { _id: string; name: string }

type WorkForm = {
  title: string; year: string; medium: string; dimensions: string
  series: string; status: string; price: string; description: string
  artistId: string
  wpLabel: string; wpTitle: string
  wp1Title: string; wp1Body: string
  wp2Title: string; wp2Body: string
  wp3Title: string; wp3Body: string
}

const EMPTY_FORM: WorkForm = {
  title: '', year: '', medium: '', dimensions: '', series: '',
  status: 'inquire', price: '', description: '', artistId: '',
  wpLabel: '', wpTitle: '',
  wp1Title: '', wp1Body: '',
  wp2Title: '', wp2Body: '',
  wp3Title: '', wp3Body: '',
}

const statusOptions = [
  { value: 'available', label: '開放收藏' },
  { value: 'inquire', label: '洽詢收藏' },
  { value: 'not-for-sale', label: '僅展覽' },
]
const statusColor: Record<string, string> = {
  available: '#5a9e7a', inquire: '#b8935a', 'not-for-sale': '#6e6860',
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^\w一-鿿]+/g, '-').replace(/^-|-$/g, '') || `work-${Date.now()}`
}

export default function ArtworksPage() {
  const router = useRouter()
  const { data: artworks = [], mutate, isLoading, error } = useSWR<Artwork[]>(
    '/api/admin/artworks', fetcher, { revalidateOnFocus: false, dedupingInterval: 5000 }
  )
  const { data: artists = [] } = useSWR<Artist[]>('/api/admin/artists', fetcher, { revalidateOnFocus: false })

  // Edit state
  const [editing, setEditing] = useState<Artwork | null>(null)
  const [form, setForm] = useState<WorkForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [newAssetId, setNewAssetId] = useState<string | null>(null)

  // Create state
  const [creating, setCreating] = useState(false)
  const [createForm, setCreateForm] = useState<WorkForm>(EMPTY_FORM)
  const [createSaving, setCreateSaving] = useState(false)
  const [createUploading, setCreateUploading] = useState(false)
  const [createPreviewUrl, setCreatePreviewUrl] = useState<string | null>(null)
  const [createAssetId, setCreateAssetId] = useState<string | null>(null)

  // Bulk / delete state
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [bulkConfirm, setBulkConfirm] = useState(false)

  if (error?.message === '401') { router.push('/admin'); return null }

  const allSelected = artworks.length > 0 && selected.size === artworks.length
  function toggleSelect(id: string) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(artworks.map(a => a._id)))
  }

  async function deleteArtwork(id: string) {
    setDeleting(id); setConfirmId(null)
    mutate(artworks.filter(w => w._id !== id), false)
    const res = await fetch('/api/admin/artworks', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }),
    })
    if (!res.ok) { alert('刪除失敗'); mutate() }
    setDeleting(null); mutate()
  }

  async function bulkDelete() {
    const ids = [...selected]; setBulkDeleting(true); setBulkConfirm(false)
    mutate(artworks.filter(w => !ids.includes(w._id)), false); setSelected(new Set())
    const results = await Promise.all(ids.map(id =>
      fetch('/api/admin/artworks', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    ))
    if (results.filter(r => !r.ok).length > 0) alert('部分刪除失敗')
    setBulkDeleting(false); mutate()
  }

  function openEdit(w: Artwork) {
    setEditing(w)
    setForm({
      title: w.title ?? '', year: String(w.year ?? ''), medium: w.medium ?? '',
      dimensions: w.dimensions ?? '', series: w.series ?? '', status: w.status ?? 'inquire',
      price: String(w.price ?? ''), description: w.description ?? '',
      artistId: w.artist?._id ?? '',
      wpLabel: w.workProcessLabel ?? '', wpTitle: w.workProcessTitle ?? '',
      wp1Title: w.workProcess1Title ?? '', wp1Body: w.workProcess1Body ?? '',
      wp2Title: w.workProcess2Title ?? '', wp2Body: w.workProcess2Body ?? '',
      wp3Title: w.workProcess3Title ?? '', wp3Body: w.workProcess3Body ?? '',
    })
    setPreviewUrl(w.imageUrl ?? null); setNewAssetId(null)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, target: 'edit' | 'create') {
    const file = e.target.files?.[0]; if (!file) return
    if (target === 'edit') setUploading(true); else setCreateUploading(true)
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    if (res.ok) {
      const { assetId, url } = await res.json()
      if (target === 'edit') { setNewAssetId(assetId); setPreviewUrl(url) }
      else { setCreateAssetId(assetId); setCreatePreviewUrl(url) }
    } else alert('上傳失敗，請重試')
    if (target === 'edit') setUploading(false); else setCreateUploading(false)
  }

  async function saveEdit() {
    if (!editing) return; setSaving(true)
    const patch: Record<string, any> = {
      title: form.title, year: Number(form.year), medium: form.medium,
      dimensions: form.dimensions, series: form.series, status: form.status,
      price: form.price ? Number(form.price) : undefined, description: form.description,
      workProcessLabel: form.wpLabel || undefined,
      workProcessTitle: form.wpTitle || undefined,
      workProcess1Title: form.wp1Title || undefined,
      workProcess1Body: form.wp1Body || undefined,
      workProcess2Title: form.wp2Title || undefined,
      workProcess2Body: form.wp2Body || undefined,
      workProcess3Title: form.wp3Title || undefined,
      workProcess3Body: form.wp3Body || undefined,
    }
    if (newAssetId) patch.images = [{ _type: 'image', _key: newAssetId.slice(-8), asset: { _type: 'reference', _ref: newAssetId } }]
    await fetch('/api/admin/artworks', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editing._id, ...patch }),
    })
    setSaving(false); setEditing(null); mutate()
  }

  async function saveCreate() {
    if (!createForm.title) { alert('作品名稱為必填'); return }
    if (!createForm.artistId) { alert('請選擇藝術家'); return }
    setCreateSaving(true)
    const slug = slugify(createForm.title)
    const doc: Record<string, any> = {
      _type: 'artwork',
      _id: `artwork-${slug}`,
      title: createForm.title,
      slug: { _type: 'slug', current: slug },
      artist: { _type: 'reference', _ref: createForm.artistId },
      year: Number(createForm.year) || undefined,
      medium: createForm.medium || undefined,
      dimensions: createForm.dimensions || undefined,
      series: createForm.series || undefined,
      status: createForm.status,
      price: createForm.price ? Number(createForm.price) : undefined,
      description: createForm.description || undefined,
      workProcessLabel: createForm.wpLabel || undefined,
      workProcessTitle: createForm.wpTitle || undefined,
      workProcess1Title: createForm.wp1Title || undefined,
      workProcess1Body: createForm.wp1Body || undefined,
      workProcess2Title: createForm.wp2Title || undefined,
      workProcess2Body: createForm.wp2Body || undefined,
      workProcess3Title: createForm.wp3Title || undefined,
      workProcess3Body: createForm.wp3Body || undefined,
    }
    if (createAssetId) {
      doc.images = [{ _type: 'image', _key: createAssetId.slice(-8), asset: { _type: 'reference', _ref: createAssetId } }]
    }
    const res = await fetch('/api/admin/artworks', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(doc),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(`新增失敗：${data.error ?? res.status}`)
    } else {
      setCreating(false); setCreateForm(EMPTY_FORM); setCreatePreviewUrl(null); setCreateAssetId(null)
      mutate()
    }
    setCreateSaving(false)
  }

  return (
    <AdminShell title="作品典藏" badge={`共 ${artworks.length} 件`}>
      {/* 頂部操作列 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className={styles.btnSave} onClick={() => { setCreateForm(EMPTY_FORM); setCreatePreviewUrl(null); setCreateAssetId(null); setCreating(true) }}>
          ＋ 新增作品
        </button>
      </div>

      {/* 批量操作列 */}
      {selected.size > 0 && (
        <div className={styles.bulkBar}>
          <span>已選取 {selected.size} 件</span>
          {bulkConfirm ? (
            <>
              <span className={styles.bulkWarning}>確定刪除這 {selected.size} 件作品？</span>
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
            <span>圖片</span><span>作品名稱</span><span>藝術家</span>
            <span>年份</span><span>媒材</span><span>狀態</span><span>操作</span>
          </div>
          {artworks.map((w) => (
            <div key={w._id} className={`${styles.tableRow} ${selected.has(w._id) ? styles.rowSelected : ''}`}>
              <span><input type="checkbox" checked={selected.has(w._id)} onChange={() => toggleSelect(w._id)} className={styles.checkbox} /></span>
              <span>
                {w.imageUrl ? <Image src={w.imageUrl} alt={w.title} width={56} height={56} className={styles.thumb} />
                  : <div className={styles.thumbEmpty}>無圖</div>}
              </span>
              <span className={styles.title}>{w.title}</span>
              <span className={styles.sub}>{w.artist?.name ?? '—'}</span>
              <span className={styles.sub}>{w.year}</span>
              <span className={styles.sub}>{w.medium}</span>
              <span>
                <span className={styles.badge} style={{ color: statusColor[w.status], borderColor: statusColor[w.status] + '55', background: statusColor[w.status] + '11' }}>
                  {statusOptions.find(s => s.value === w.status)?.label ?? w.status}
                </span>
              </span>
              <span className={styles.actions}>
                <button className={styles.btnEdit} onClick={() => openEdit(w)}>編輯</button>
                {confirmId === w._id ? (
                  <>
                    <button className={styles.btnDanger} onClick={() => deleteArtwork(w._id)} disabled={deleting === w._id}>確定</button>
                    <button className={styles.btnCancelSm} onClick={() => setConfirmId(null)}>否</button>
                  </>
                ) : (
                  <button className={styles.btnDanger} onClick={() => setConfirmId(w._id)}>刪除</button>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editing && (
        <WorkModal
          title={`編輯作品：${editing.title}`}
          form={form} setForm={setForm}
          artists={artists}
          previewUrl={previewUrl}
          uploading={uploading} saving={saving}
          onUpload={e => handleImageUpload(e, 'edit')}
          onSave={saveEdit}
          onCancel={() => setEditing(null)}
          mode="edit"
        />
      )}

      {/* ── Create Modal ── */}
      {creating && (
        <WorkModal
          title="新增作品"
          form={createForm} setForm={setCreateForm}
          artists={artists}
          previewUrl={createPreviewUrl}
          uploading={createUploading} saving={createSaving}
          onUpload={e => handleImageUpload(e, 'create')}
          onSave={saveCreate}
          onCancel={() => setCreating(false)}
          mode="create"
        />
      )}
    </AdminShell>
  )
}

function WorkModal({
  title, form, setForm, artists, previewUrl, uploading, saving,
  onUpload, onSave, onCancel, mode,
}: {
  title: string
  form: WorkForm
  setForm: React.Dispatch<React.SetStateAction<WorkForm>>
  artists: Artist[]
  previewUrl: string | null
  uploading: boolean
  saving: boolean
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSave: () => void
  onCancel: () => void
  mode: 'edit' | 'create'
}) {
  return (
    <div className={styles.modalBackdrop} onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div className={styles.modal} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className={styles.modalTitle}>{title}</div>

        {/* 圖片上傳 */}
        <div className={styles.photoRow}>
          {previewUrl
            ? <Image src={previewUrl} alt="預覽" width={80} height={80} className={styles.photoPreview} />
            : <div className={styles.photoEmpty}>尚無圖片</div>}
          <div>
            <label className={styles.uploadBtn} style={{ cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.5 : 1 }}>
              {uploading ? '上傳中…' : '上傳作品圖'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={onUpload} disabled={uploading} />
            </label>
            <p className={styles.uploadHint}>JPG / PNG，建議 2000px 以上，5MB 以內</p>
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formFull}>
            <label className={styles.label}>作品名稱 *</label>
            <input className={styles.input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>

          {/* 藝術家選擇（新增時必填，編輯時隱藏因不能更換） */}
          {mode === 'create' && (
            <div className={styles.formFull}>
              <label className={styles.label}>藝術家 *</label>
              <select className={styles.input} value={form.artistId} onChange={e => setForm(f => ({ ...f, artistId: e.target.value }))}>
                <option value="">— 請選擇藝術家 —</option>
                {artists.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className={styles.label}>創作年份</label>
            <input className={styles.input} type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="例：2023" />
          </div>
          <div>
            <label className={styles.label}>收藏狀態</label>
            <select className={styles.input} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className={styles.label}>媒材</label>
            <input className={styles.input} value={form.medium} onChange={e => setForm(f => ({ ...f, medium: e.target.value }))} placeholder="例：水墨、宣紙" />
          </div>
          <div>
            <label className={styles.label}>尺寸</label>
            <input className={styles.input} value={form.dimensions} onChange={e => setForm(f => ({ ...f, dimensions: e.target.value }))} placeholder="例：120×90 cm" />
          </div>
          <div>
            <label className={styles.label}>系列名稱</label>
            <input className={styles.input} value={form.series} onChange={e => setForm(f => ({ ...f, series: e.target.value }))} />
          </div>
          <div>
            <label className={styles.label}>價格（台幣，留空表示洽詢）</label>
            <input className={styles.input} type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0" />
          </div>
          <div className={styles.formFull}>
            <label className={styles.label}>作品描述</label>
            <textarea className={styles.textarea} rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="關於這件作品的創作背景、理念…" />
          </div>
        </div>

        {/* 創作過程 */}
        <div style={{ borderTop: '1px solid #2e2b26', marginTop: 20, paddingTop: 16 }}>
          <div style={{ color: '#b8935a', fontSize: 12, letterSpacing: '0.1em', marginBottom: 12 }}>創作過程區塊（選填，填寫後在作品詳細頁顯示）</div>
          <div className={styles.formGrid}>
            <div>
              <label className={styles.label}>小標籤（留空用「創作過程」）</label>
              <input className={styles.input} value={form.wpLabel} onChange={e => setForm(f => ({ ...f, wpLabel: e.target.value }))} placeholder="創作過程" />
            </div>
            <div>
              <label className={styles.label}>主標題（留空用「從靈感到完成」）</label>
              <input className={styles.input} value={form.wpTitle} onChange={e => setForm(f => ({ ...f, wpTitle: e.target.value }))} placeholder="從靈感到完成" />
            </div>
            <div>
              <label className={styles.label}>步驟一標題</label>
              <input className={styles.input} value={form.wp1Title} onChange={e => setForm(f => ({ ...f, wp1Title: e.target.value }))} placeholder="例：素材選取" />
            </div>
            <div>
              <label className={styles.label}>步驟一說明</label>
              <textarea className={styles.textarea} rows={2} value={form.wp1Body} onChange={e => setForm(f => ({ ...f, wp1Body: e.target.value }))} />
            </div>
            <div>
              <label className={styles.label}>步驟二標題</label>
              <input className={styles.input} value={form.wp2Title} onChange={e => setForm(f => ({ ...f, wp2Title: e.target.value }))} placeholder="例：意象生成" />
            </div>
            <div>
              <label className={styles.label}>步驟二說明</label>
              <textarea className={styles.textarea} rows={2} value={form.wp2Body} onChange={e => setForm(f => ({ ...f, wp2Body: e.target.value }))} />
            </div>
            <div>
              <label className={styles.label}>步驟三標題</label>
              <input className={styles.input} value={form.wp3Title} onChange={e => setForm(f => ({ ...f, wp3Title: e.target.value }))} placeholder="例：完成定稿" />
            </div>
            <div>
              <label className={styles.label}>步驟三說明</label>
              <textarea className={styles.textarea} rows={2} value={form.wp3Body} onChange={e => setForm(f => ({ ...f, wp3Body: e.target.value }))} />
            </div>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button className={styles.btnCancel} onClick={onCancel}>取消</button>
          <button className={styles.btnSave} onClick={onSave} disabled={saving || uploading}>
            {saving ? '儲存中…' : mode === 'create' ? '新增' : '儲存'}
          </button>
        </div>
      </div>
    </div>
  )
}

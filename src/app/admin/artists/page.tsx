'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import Image from 'next/image'
import AdminShell from '@/components/admin/AdminShell'
import styles from './artists.module.css'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (res.status === 401) throw new Error('401')
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

type TimelineItem = { year: number; title: string; description: string; _key?: string }

type Artist = {
  _id: string
  name: string
  nameEn: string
  location: string
  medium: string[]
  yearsActive: number
  birthYear: number
  featured: boolean
  portrait?: { asset?: { url?: string } }
  timeline?: TimelineItem[]
}

type EditForm = {
  name: string
  nameEn: string
  location: string
  medium: string
  yearsActive: string
  birthYear: string
  quote: string
  bio: string
  timeline: TimelineItem[]
}

const EMPTY_FORM: EditForm = {
  name: '', nameEn: '', location: '', medium: '', yearsActive: '', birthYear: '', quote: '', bio: '', timeline: [],
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function ArtistsPage() {
  const router = useRouter()
  const { data: artists = [], mutate, isLoading, error } = useSWR<Artist[]>(
    '/api/admin/artists',
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 5000 }
  )
  const [deleting, setDeleting] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [bulkConfirm, setBulkConfirm] = useState(false)

  // Edit state
  const [editing, setEditing] = useState<Artist | null>(null)
  const [form, setForm] = useState<EditForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [newAssetId, setNewAssetId] = useState<string | null>(null)

  // Create state
  const [creating, setCreating] = useState(false)
  const [createForm, setCreateForm] = useState<EditForm>(EMPTY_FORM)
  const [createSaving, setCreateSaving] = useState(false)
  const [createUploading, setCreateUploading] = useState(false)
  const [createPreviewUrl, setCreatePreviewUrl] = useState<string | null>(null)
  const [createAssetId, setCreateAssetId] = useState<string | null>(null)

  if (error?.message === '401') { router.push('/admin'); return null }

  // ── Timeline helpers ──
  function addTimeline(target: 'edit' | 'create') {
    const item: TimelineItem = { year: new Date().getFullYear(), title: '', description: '' }
    if (target === 'edit') setForm(f => ({ ...f, timeline: [...f.timeline, item] }))
    else setCreateForm(f => ({ ...f, timeline: [...f.timeline, item] }))
  }

  function updateTimeline(target: 'edit' | 'create', idx: number, field: keyof TimelineItem, value: string | number) {
    const setter = target === 'edit' ? setForm : setCreateForm
    setter(f => {
      const tl = [...f.timeline]
      tl[idx] = { ...tl[idx], [field]: value }
      return { ...f, timeline: tl }
    })
  }

  function removeTimeline(target: 'edit' | 'create', idx: number) {
    const setter = target === 'edit' ? setForm : setCreateForm
    setter(f => ({ ...f, timeline: f.timeline.filter((_, i) => i !== idx) }))
  }

  function buildTimelineForSanity(tl: TimelineItem[]) {
    return tl
      .filter(t => t.year && t.title)
      .sort((a, b) => a.year - b.year)
      .map((t, i) => ({ _type: 'object', _key: `tl${i}`, year: Number(t.year), title: t.title, description: t.description }))
  }

  // ── Featured toggle ──
  async function toggleFeatured(artist: Artist) {
    mutate(artists.map(a => a._id === artist._id ? { ...a, featured: !a.featured } : a), false)
    await fetch('/api/admin/artists', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: artist._id, featured: !artist.featured }),
    })
    mutate()
  }

  // ── Delete ──
  async function deleteArtist(id: string) {
    setDeleting(id); setConfirmId(null)
    mutate(artists.filter(a => a._id !== id), false)
    const res = await fetch('/api/admin/artists', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(`刪除失敗：${data.error ?? res.status}`)
      mutate()
    }
    setDeleting(null); mutate()
  }

  async function bulkDelete() {
    const ids = [...selected]
    setBulkDeleting(true); setBulkConfirm(false)
    mutate(artists.filter(a => !ids.includes(a._id)), false)
    setSelected(new Set())
    const results = await Promise.all(ids.map(id =>
      fetch('/api/admin/artists', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    ))
    const failed = results.filter(r => !r.ok).length
    if (failed > 0) alert(`${failed} 筆刪除失敗`)
    setBulkDeleting(false); mutate()
  }

  function toggleSelect(id: string) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  function toggleAll() {
    setSelected(selected.size === artists.length ? new Set() : new Set(artists.map(a => a._id)))
  }

  // ── Edit ──
  function openEdit(a: Artist) {
    setEditing(a)
    setForm({
      name: a.name,
      nameEn: a.nameEn ?? '',
      location: a.location ?? '',
      medium: a.medium?.join('、') ?? '',
      yearsActive: String(a.yearsActive ?? ''),
      birthYear: String(a.birthYear ?? ''),
      quote: (a as any).quote ?? '',
      bio: (a as any).bio?.map((b: any) => b.children?.map((c: any) => c.text).join('')).join('\n') ?? '',
      timeline: a.timeline ?? [],
    })
    setPreviewUrl(a.portrait?.asset?.url ?? null)
    setNewAssetId(null)
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    if (res.ok) { const { assetId, url } = await res.json(); setNewAssetId(assetId); setPreviewUrl(url) }
    else alert('上傳失敗，請重試')
    setUploading(false)
  }

  async function saveEdit() {
    if (!editing) return
    setSaving(true)
    const patch: Record<string, any> = {
      name: form.name, nameEn: form.nameEn, location: form.location,
      medium: form.medium.split(/[、,，]/).map(s => s.trim()).filter(Boolean),
      yearsActive: Number(form.yearsActive), birthYear: Number(form.birthYear),
      quote: form.quote,
      bio: form.bio ? [{ _type: 'block', _key: 'b1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: form.bio, marks: [] }], markDefs: [] }] : undefined,
      timeline: buildTimelineForSanity(form.timeline),
    }
    if (newAssetId) patch.portrait = { _type: 'image', asset: { _type: 'reference', _ref: newAssetId } }
    await fetch('/api/admin/artists', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editing._id, ...patch }),
    })
    setSaving(false); setEditing(null); mutate()
  }

  // ── Create ──
  async function handleCreatePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setCreateUploading(true)
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    if (res.ok) { const { assetId, url } = await res.json(); setCreateAssetId(assetId); setCreatePreviewUrl(url) }
    else alert('上傳失敗，請重試')
    setCreateUploading(false)
  }

  async function saveCreate() {
    if (!createForm.name || !createForm.nameEn) { alert('姓名與英文姓名為必填'); return }
    setCreateSaving(true)
    const slug = slugify(createForm.nameEn)
    const doc: Record<string, any> = {
      _type: 'artist',
      _id: `artist-${slug}`,
      name: createForm.name,
      nameEn: createForm.nameEn,
      slug: { _type: 'slug', current: slug },
      location: createForm.location,
      medium: createForm.medium.split(/[、,，]/).map(s => s.trim()).filter(Boolean),
      yearsActive: Number(createForm.yearsActive) || 0,
      birthYear: Number(createForm.birthYear) || 0,
      quote: createForm.quote,
      featured: false,
      bio: createForm.bio ? [{ _type: 'block', _key: 'b1', style: 'normal', children: [{ _type: 'span', _key: 's1', text: createForm.bio, marks: [] }], markDefs: [] }] : undefined,
      timeline: buildTimelineForSanity(createForm.timeline),
    }
    if (createAssetId) doc.portrait = { _type: 'image', asset: { _type: 'reference', _ref: createAssetId } }
    const res = await fetch('/api/admin/artists', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(doc),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(`新增失敗：${data.error ?? res.status}`)
    } else {
      setCreating(false)
      setCreateForm(EMPTY_FORM)
      setCreatePreviewUrl(null)
      setCreateAssetId(null)
      mutate()
    }
    setCreateSaving(false)
  }

  const allSelected = artists.length > 0 && selected.size === artists.length

  return (
    <AdminShell title="藝術家管理" badge={`共 ${artists.length} 位`}>
      {/* 頂部操作列 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className={styles.btnSave} onClick={() => { setCreateForm(EMPTY_FORM); setCreatePreviewUrl(null); setCreateAssetId(null); setCreating(true) }}>
          ＋ 新增藝術家
        </button>
      </div>

      {/* 批量操作列 */}
      {selected.size > 0 && (
        <div className={styles.bulkBar}>
          <span>已選取 {selected.size} 位</span>
          {bulkConfirm ? (
            <>
              <span className={styles.bulkWarning}>確定刪除這 {selected.size} 位？</span>
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
        <p style={{ color: '#e07070' }}>載入失敗：{error.message} <button onClick={() => mutate()} style={{ marginLeft: 8, color: '#b8935a', background: 'none', border: 'none', cursor: 'pointer' }}>重試</button></p>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span><input type="checkbox" checked={allSelected} onChange={toggleAll} className={styles.checkbox} /></span>
            <span>照片</span><span>姓名</span><span>英文姓名</span><span>所在地</span>
            <span>媒材</span><span>資歷</span><span>精選</span><span>操作</span>
          </div>
          {artists.map((a) => (
            <div key={a._id} className={`${styles.tableRow} ${selected.has(a._id) ? styles.rowSelected : ''}`}>
              <span><input type="checkbox" checked={selected.has(a._id)} onChange={() => toggleSelect(a._id)} className={styles.checkbox} /></span>
              <span>
                {a.portrait?.asset?.url
                  ? <Image src={a.portrait.asset.url} alt={a.name} width={56} height={56} className={styles.thumb} />
                  : <div className={styles.thumbEmpty}>無照片</div>}
              </span>
              <span className={styles.name}>{a.name}</span>
              <span className={styles.sub}>{a.nameEn}</span>
              <span className={styles.sub}>{a.location}</span>
              <span className={styles.sub}>{a.medium?.join('・') ?? '—'}</span>
              <span className={styles.sub}>{a.yearsActive} 年</span>
              <span>
                <button className={`${styles.badge} ${a.featured ? styles.badgeOn : ''}`} onClick={() => toggleFeatured(a)}>
                  {a.featured ? '精選中' : '設為精選'}
                </button>
              </span>
              <span className={styles.actions}>
                <button className={styles.btnEdit} onClick={() => openEdit(a)}>編輯</button>
                {confirmId === a._id ? (
                  <>
                    <button className={styles.btnDanger} onClick={() => deleteArtist(a._id)} disabled={deleting === a._id}>{deleting === a._id ? '…' : '確定'}</button>
                    <button className={styles.btnCancelSm} onClick={() => setConfirmId(null)}>否</button>
                  </>
                ) : (
                  <button className={styles.btnDanger} onClick={() => setConfirmId(a._id)}>刪除</button>
                )}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editing && (
        <ArtistModal
          title={`編輯藝術家：${editing.name}`}
          form={form} setForm={setForm}
          previewUrl={previewUrl}
          uploading={uploading}
          saving={saving}
          onPhotoUpload={handlePhotoUpload}
          onSave={saveEdit}
          onCancel={() => setEditing(null)}
          mode="edit"
          onAddTimeline={() => addTimeline('edit')}
          onUpdateTimeline={(i, f, v) => updateTimeline('edit', i, f, v)}
          onRemoveTimeline={(i) => removeTimeline('edit', i)}
        />
      )}

      {/* ── Create Modal ── */}
      {creating && (
        <ArtistModal
          title="新增藝術家"
          form={createForm} setForm={setCreateForm}
          previewUrl={createPreviewUrl}
          uploading={createUploading}
          saving={createSaving}
          onPhotoUpload={handleCreatePhotoUpload}
          onSave={saveCreate}
          onCancel={() => setCreating(false)}
          mode="create"
          onAddTimeline={() => addTimeline('create')}
          onUpdateTimeline={(i, f, v) => updateTimeline('create', i, f, v)}
          onRemoveTimeline={(i) => removeTimeline('create', i)}
        />
      )}
    </AdminShell>
  )
}

// ── Shared Modal Component ──
function ArtistModal({
  title, form, setForm, previewUrl, uploading, saving,
  onPhotoUpload, onSave, onCancel, mode,
  onAddTimeline, onUpdateTimeline, onRemoveTimeline,
}: {
  title: string
  form: EditForm
  setForm: React.Dispatch<React.SetStateAction<EditForm>>
  previewUrl: string | null
  uploading: boolean
  saving: boolean
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSave: () => void
  onCancel: () => void
  mode: 'edit' | 'create'
  onAddTimeline: () => void
  onUpdateTimeline: (idx: number, field: keyof TimelineItem, value: string | number) => void
  onRemoveTimeline: (idx: number) => void
}) {
  return (
    <div className={styles.modalBackdrop} onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <div className={styles.modal} style={{ maxHeight: '90vh', overflowY: 'auto', maxWidth: 620 }}>
        <div className={styles.modalTitle}>{title}</div>

        {/* 照片 */}
        <div className={styles.photoRow}>
          {previewUrl
            ? <Image src={previewUrl} alt="預覽" width={80} height={80} className={styles.photoPreview} />
            : <div className={styles.photoEmpty}>尚無照片</div>}
          <div>
            <label className={styles.uploadBtn} style={{ cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.5 : 1 }}>
              {uploading ? '上傳中…' : '上傳照片'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={onPhotoUpload} disabled={uploading} />
            </label>
            <p className={styles.uploadHint}>建議 1:1 正方形，JPG / PNG，2MB 以內</p>
          </div>
        </div>

        {/* 基本資料 */}
        <div className={styles.formGrid}>
          <div>
            <label className={styles.label}>中文姓名 *</label>
            <input className={styles.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className={styles.label}>英文姓名 *{mode === 'create' && <span style={{ color: '#6e6860', marginLeft: 6 }}>（用於網址）</span>}</label>
            <input className={styles.input} value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))} placeholder="e.g. Chen Yu-Ming" />
          </div>
          <div>
            <label className={styles.label}>所在地</label>
            <input className={styles.input} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="例：台北" />
          </div>
          <div>
            <label className={styles.label}>出生年份</label>
            <input className={styles.input} type="number" value={form.birthYear} onChange={e => setForm(f => ({ ...f, birthYear: e.target.value }))} />
          </div>
          <div>
            <label className={styles.label}>創作資歷（年）</label>
            <input className={styles.input} type="number" value={form.yearsActive} onChange={e => setForm(f => ({ ...f, yearsActive: e.target.value }))} />
          </div>
          <div className={styles.formFull}>
            <label className={styles.label}>媒材（用逗號或頓號分隔）</label>
            <input className={styles.input} value={form.medium} onChange={e => setForm(f => ({ ...f, medium: e.target.value }))} placeholder="例：水墨、油彩、版畫" />
          </div>
          <div className={styles.formFull}>
            <label className={styles.label}>代表語錄</label>
            <input className={styles.input} value={form.quote} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))} placeholder="藝術家的一句話" />
          </div>
          <div className={styles.formFull}>
            <label className={styles.label}>藝術家簡介</label>
            <textarea className={styles.textarea} rows={4} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="藝術家生平、創作理念、重要經歷…" />
          </div>
        </div>

        {/* 年表 */}
        <div style={{ marginTop: 8, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span className={styles.label} style={{ margin: 0 }}>年表（創作歷程）</span>
            <button className={styles.btnEdit} onClick={onAddTimeline} style={{ fontSize: '0.78rem' }}>＋ 新增條目</button>
          </div>
          {form.timeline.length === 0 && (
            <p style={{ fontSize: '0.78rem', color: '#6e6860', padding: '8px 0' }}>尚無年表條目，點右側「新增條目」加入。</p>
          )}
          {form.timeline.map((item, idx) => (
            <div key={idx} className={styles.timelineRow}>
              <input
                className={styles.input}
                type="number"
                value={item.year}
                onChange={e => onUpdateTimeline(idx, 'year', Number(e.target.value))}
                style={{ width: 80, flexShrink: 0 }}
                placeholder="年份"
              />
              <input
                className={styles.input}
                value={item.title}
                onChange={e => onUpdateTimeline(idx, 'title', e.target.value)}
                style={{ flex: 1 }}
                placeholder="事件標題，例：首次個展於國立歷史博物館"
              />
              <button className={styles.btnDangerSm} onClick={() => onRemoveTimeline(idx)} style={{ flexShrink: 0 }}>✕</button>
            </div>
          ))}
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

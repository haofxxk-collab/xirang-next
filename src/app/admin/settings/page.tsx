'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import styles from './settings.module.css'
import { defaultSettings, type SiteSettings } from '@/lib/queries'

type Settings = SiteSettings

const TABS = ['外觀色彩', '首頁', '藝術家頁', '典藏頁', '策展頁', '關於 & 申請', '通用', 'SEO']

function Field({ label, location, hint, children }: { label: string; location: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className={styles.field}>
      <div className={styles.fieldMeta}>
        <span className={styles.fieldLabel}>{label}</span>
        <span className={styles.fieldLocation}>📍 {location}</span>
        {hint && <span className={styles.fieldHint}>{hint}</span>}
      </div>
      <div>{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const [form, setForm] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState(0)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => { if (r.status === 401) router.push('/admin'); return r.json() })
      .then(data => { setForm(f => ({ ...f, ...data })); setLoading(false) })
  }, [])

  function set(key: keyof Settings, value: string | number) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function inp(key: keyof Settings) {
    return <input className={styles.input} value={String(form[key])} onChange={e => set(key, e.target.value)} />
  }
  function txt(key: keyof Settings, rows = 3) {
    return <textarea className={styles.textarea} rows={rows} value={String(form[key])} onChange={e => set(key, e.target.value)} />
  }

  function imgUpload(key: keyof Settings) {
    const url = String(form[key] ?? '')
    async function upload(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0]; if (!file) return
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      if (res.ok) { const { url: u } = await res.json(); set(key, u) }
      else alert('上傳失敗')
    }
    return (
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        {url && <img src={url} alt="" style={{ width: 80, height: 56, objectFit: 'cover', borderRadius: 4, border: '1px solid #2e2b26' }} />}
        <label style={{ cursor: 'pointer', padding: '5px 12px', border: '1px solid #3a3630', borderRadius: 4, fontSize: 12, color: '#b8935a', whiteSpace: 'nowrap' }}>
          {url ? '更換圖片' : '上傳圖片'}
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={upload} />
        </label>
        <input className={styles.input} value={url} onChange={e => set(key, e.target.value)} placeholder="或貼上圖片網址" style={{ flex: 1, minWidth: 120 }} />
      </div>
    )
  }

  async function save() {
    setSaving(true)
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <AdminShell title="網站設定" badge="全站文字 ＆ 外觀">
      {loading ? (
        <p style={{ color: '#6e6860' }}>載入中…</p>
      ) : (
        <>
          <div className={styles.notice}>
            儲存後需等待約 30 秒讓網站快取更新，或按 <code>Ctrl+Shift+R</code> 強制重新整理前台頁面。
          </div>

          <div className={styles.tabs}>
            {TABS.map((t, i) => (
              <button key={t} className={`${styles.tab} ${tab === i ? styles.tabActive : ''}`} onClick={() => setTab(i)}>{t}</button>
            ))}
          </div>

          <div className={styles.wrap}>

            {/* ══ 外觀色彩 ══ */}
            {tab === 0 && (
              <div className={styles.sections}>
                <div className={styles.field}>
                  <div className={styles.fieldMeta}>
                    <span className={styles.fieldLabel}>裝飾文字透明度</span>
                    <span className={styles.fieldLocation}>📍 首頁宣言區塊 — 背景詩句（弱化文字）</span>
                    <span className={styles.fieldHint}>數值越低越淡，越高越明顯。建議 30–70 之間。</span>
                  </div>
                  <div className={styles.sliderWrap}>
                    <input type="range" min={0} max={100} step={5} value={form.dimTextOpacity}
                      onChange={e => set('dimTextOpacity', Number(e.target.value))} className={styles.slider} />
                    <div className={styles.sliderRow}>
                      <span className={styles.sliderLabel}>淡（0）</span>
                      <span className={styles.sliderValue}>{form.dimTextOpacity}%</span>
                      <span className={styles.sliderLabel}>深（100）</span>
                    </div>
                    <div className={styles.colorPreview} style={{ opacity: form.dimTextOpacity / 100 }}>
                      <span style={{ fontFamily: 'Noto Serif TC, serif', fontSize: '18px', color: '#AAA69D', letterSpacing: '0.15em' }}>
                        水善利萬物而不爭
                      </span>
                    </div>
                  </div>
                </div>

                {([
                  { key: 'secondaryTextColor' as const, label: '次要文字顏色', loc: '全站 — 副標題、說明文字、導覽連結', hint: '影響導覽列連結、區塊副標題等次要文字。預設 #AAA69D（暖灰色）。', def: '#AAA69D' },
                  { key: 'accentColor' as const, label: '金色主調', loc: '全站 — 按鈕邊框、分隔線、強調文字', hint: '影響所有金色裝飾元素。預設 #B8935A（古銅金）。建議保持暖色調。', def: '#B8935A' },
                ] as const).map(({ key, label, loc, hint, def }) => (
                  <div key={key} className={styles.field}>
                    <div className={styles.fieldMeta}>
                      <span className={styles.fieldLabel}>{label}</span>
                      <span className={styles.fieldLocation}>📍 {loc}</span>
                      <span className={styles.fieldHint}>{hint}</span>
                    </div>
                    <div className={styles.colorFieldWrap}>
                      <input type="color" value={form[key]} onChange={e => set(key, e.target.value)} className={styles.colorPicker} />
                      <input type="text" value={form[key]} onChange={e => set(key, e.target.value)} className={styles.colorHex} placeholder={def} maxLength={7} />
                      <span className={styles.colorSwatch} style={{ background: form[key] }} />
                      <button className={styles.resetBtn} onClick={() => set(key, def)}>重設</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ══ 首頁 ══ */}
            {tab === 1 && (
              <>
                <div className={styles.sectionTitle}>Hero 展館介紹區</div>
                <div className={styles.sections}>
                  <Field label="小標籤" location="首頁 Hero — 左側標籤文字">{inp('heroLabel')}</Field>
                  <Field label="主標題" location="首頁 Hero — 大標題（以換行符分行，最後一行自動加斜體）" hint="使用 Enter 換行，目前為三行">{txt('heroTitle', 4)}</Field>
                  <Field label="說明段落" location="首頁 Hero — 右側說明文字" hint="使用 Enter 換行">{txt('heroBody', 5)}</Field>
                  <Field label="統計 1 標籤" location="首頁 Hero — 數字統計第一格（作品數）">{inp('heroStat1Label')}</Field>
                  <Field label="統計 2 標籤" location="首頁 Hero — 數字統計第二格（藝術家數）">{inp('heroStat2Label')}</Field>
                  <Field label="統計 3 數值" location="首頁 Hero — 數字統計第三格數字" hint="例：20+">{inp('heroStat3Val')}</Field>
                  <Field label="統計 3 標籤" location="首頁 Hero — 數字統計第三格說明">{inp('heroStat3Label')}</Field>
                </div>

                <div className={styles.sectionTitle}>Manifesto 宣言詩句</div>
                <div className={styles.sections}>
                  <Field label="第一行（淡色）" location="首頁宣言 — 第 1 行">{inp('manifestoLine1')}</Field>
                  <Field label="第二行（明色）" location="首頁宣言 — 第 2 行">{inp('manifestoLine2')}</Field>
                  <Field label="第三行（淡色）" location="首頁宣言 — 第 3 行">{inp('manifestoLine3')}</Field>
                  <Field label="第四行（明色）" location="首頁宣言 — 第 4 行">{inp('manifestoLine4')}</Field>
                  <Field label="第五行（淡色）" location="首頁宣言 — 第 5 行">{inp('manifestoLine5')}</Field>
                  <Field label="第六行（金色強調）" location="首頁宣言 — 第 6 行，金色收尾">{inp('manifestoLine6')}</Field>
                  <Field label="分隔線下方小字" location="首頁宣言 — 底部一行小說明">{inp('manifestoSub')}</Field>
                </div>

                <div className={styles.sectionTitle}>藝術家預覽</div>
                <div className={styles.sections}>
                  <Field label="區塊標籤" location="首頁藝術家預覽 — 上方小標籤">{inp('artistsPreviewLabel')}</Field>
                  <Field label="標題" location="首頁藝術家預覽 — 大標題（以換行符分行）">{txt('artistsPreviewTitle', 2)}</Field>
                  <Field label="查看更多連結" location="首頁藝術家預覽 — 右上角連結按鈕">{inp('artistsPreviewMore')}</Field>
                </div>

                <div className={styles.sectionTitle}>典藏精選</div>
                <div className={styles.sections}>
                  <Field label="區塊標籤" location="首頁典藏精選 — 上方小標籤">{inp('worksScrollLabel')}</Field>
                  <Field label="標題" location="首頁典藏精選 — 大標題（以換行符分行）">{txt('worksScrollTitle', 2)}</Field>
                  <Field label="查看更多連結" location="首頁典藏精選 — 底部連結按鈕">{inp('worksScrollMore')}</Field>
                </div>

                <div className={styles.sectionTitle}>展覽預覽（當期策展）</div>
                <div className={styles.sections}>
                  <Field label="區塊標籤" location="首頁展覽預覽 — 標籤文字">{inp('exhibitionTag')}</Field>
                  <Field label="進入展覽按鈕" location="首頁展覽預覽 — CTA 連結文字">{inp('exhibitionCta')}</Field>
                  <Field label="無展覽時標題" location="首頁展覽預覽 — 無當期展覽時的標題">{inp('exhibitionEmptyTitle')}</Field>
                  <Field label="無展覽時說明" location="首頁展覽預覽 — 無當期展覽時的說明文字" hint="使用 Enter 換行">{txt('exhibitionEmptyBody', 3)}</Field>
                </div>

                <div className={styles.sectionTitle}>展館哲學</div>
                <div className={styles.sections}>
                  <Field label="區塊標籤" location="首頁展館哲學 — 上方小標籤">{inp('philosophyLabel')}</Field>
                  <Field label="標題" location="首頁展館哲學 — 大標題（以換行符分行）">{txt('philosophyTitle', 2)}</Field>
                  <Field label="卡片 1 字符" location="展館哲學卡片 1 — 大字符（如：時）" hint="通常為一個字">{inp('philosophy1Char')}</Field>
                  <Field label="卡片 1 標題" location="展館哲學卡片 1 — 標題">{inp('philosophy1Title')}</Field>
                  <Field label="卡片 1 說明" location="展館哲學卡片 1 — 說明文字">{txt('philosophy1Body', 3)}</Field>
                  <Field label="卡片 2 字符" location="展館哲學卡片 2 — 大字符（如：深）">{inp('philosophy2Char')}</Field>
                  <Field label="卡片 2 標題" location="展館哲學卡片 2 — 標題">{inp('philosophy2Title')}</Field>
                  <Field label="卡片 2 說明" location="展館哲學卡片 2 — 說明文字">{txt('philosophy2Body', 3)}</Field>
                  <Field label="卡片 3 字符" location="展館哲學卡片 3 — 大字符（如：美）">{inp('philosophy3Char')}</Field>
                  <Field label="卡片 3 標題" location="展館哲學卡片 3 — 標題">{inp('philosophy3Title')}</Field>
                  <Field label="卡片 3 說明" location="展館哲學卡片 3 — 說明文字">{txt('philosophy3Body', 3)}</Field>
                </div>

                <div className={styles.sectionTitle}>加入邀請</div>
                <div className={styles.sections}>
                  <Field label="區塊標籤" location="首頁加入邀請 — 上方小標籤">{inp('joinLabel')}</Field>
                  <Field label="標題" location="首頁加入邀請 — 大標題（以換行符分行）">{txt('joinTitle', 2)}</Field>
                  <Field label="說明文字" location="首頁加入邀請 — 說明段落">{txt('joinBody', 3)}</Field>
                  <Field label="主要按鈕" location="首頁加入邀請 — 主要 CTA 按鈕（連結至申請頁）">{inp('joinCta1')}</Field>
                  <Field label="次要按鈕" location="首頁加入邀請 — 次要按鈕（連結至關於頁）">{inp('joinCta2')}</Field>
                </div>
              </>
            )}

            {/* ══ 藝術家頁 ══ */}
            {tab === 2 && (
              <div className={styles.sections}>
                <Field label="頁面標籤" location="藝術家列表頁 — 大標題上方小標籤">{inp('artistsPageLabel')}</Field>
                <Field label="頁面說明文字" location="藝術家列表頁 — 副說明段落（以換行符分行）" hint="顯示在「N 位藝術家」大標題右側">{txt('artistsPageBody', 3)}</Field>
                <Field label="精選藝術家標籤" location="藝術家列表頁 — 精選藝術家區塊標籤">{inp('artistsFeaturedLabel')}</Field>
                <Field label="精選藝術家 CTA" location="藝術家列表頁 — 精選藝術家進入展館連結">{inp('artistsFeaturedCta')}</Field>
              </div>
            )}

            {/* ══ 典藏頁 ══ */}
            {tab === 3 && (
              <div className={styles.sections}>
                <Field label="頁面標籤" location="典藏頁 — 標題上方小標籤">{inp('worksPageLabel')}</Field>
                <Field label="背景裝飾字" location="典藏頁 — 背景大字（通常為一個字）" hint="視覺裝飾用，通常為「藏」">{inp('worksPageBgChar')}</Field>
                <Field label="有作品時標題" location="典藏頁 — 有作品時的主標題" hint="用 {count} 代表作品數量，例：{count} 件典藏，每件都有分量。用逗號分割兩行">{inp('worksPageTitleFull')}</Field>
                <Field label="無作品時標題" location="典藏頁 — 無作品時的主標題" hint="用逗號分割兩行，第二行自動加斜體">{inp('worksPageTitleEmpty')}</Field>
                <Field label="無作品時提示" location="典藏頁 — 無作品時的說明文字">{inp('worksPageEmpty')}</Field>

              </div>
            )}

            {/* ══ 策展頁 ══ */}
            {tab === 4 && (
              <>
                <div className={styles.sectionTitle}>頁面標頭</div>
                <div className={styles.sections}>
                  <Field label="頁面標籤" location="策展頁標頭 — 小標籤">{inp('exhibitionsLabel')}</Field>
                  <Field label="主標題" location="策展頁標頭 — 大標題（以換行符分行）">{txt('exhibitionsTitle', 2)}</Field>
                  <Field label="說明文字" location="策展頁標頭 — 說明段落">{txt('exhibitionsBody', 3)}</Field>
                </div>

                <div className={styles.sectionTitle}>當期策展區塊</div>
                <div className={styles.sections}>
                  <Field label="區塊標籤" location="策展頁 — 當期策展標籤">{inp('exhibitionCurrentLabel')}</Field>
                  <Field label="參展藝術家標籤" location="策展頁 — 參展藝術家清單上方標籤">{inp('exhibitionArtistsLabel')}</Field>
                  <Field label="進入展覽按鈕" location="策展頁當期展覽 — CTA 連結文字">{inp('exhibitionCta')}</Field>
                  <Field label="無展覽時標題" location="策展頁 — 目前無當期展覽時的標題">{inp('exhibitionEmptyTitle')}</Field>
                  <Field label="無展覽時說明" location="策展頁 — 目前無當期展覽時的說明文字">{txt('exhibitionEmptyBody', 2)}</Field>
                </div>

                <div className={styles.sectionTitle}>過往 ＆ 即將展覽</div>
                <div className={styles.sections}>
                  <Field label="過往策展標籤" location="策展頁 — 過往展覽區塊小標籤">{inp('exhibitionPastLabel')}</Field>
                  <Field label="過往策展標題" location="策展頁 — 過往展覽區塊大標題">{inp('exhibitionPastTitle')}</Field>
                  <Field label="即將展出標籤" location="策展頁 — 即將展出區塊標籤 ＆ 卡片標籤">{inp('exhibitionUpcomingLabel')}</Field>
                  <Field label="即將展出標題" location="策展頁 — 即將展出區塊大標題">{inp('exhibitionUpcomingTitle')}</Field>
                  <Field label="無展覽紀錄提示" location="策展頁 — 過往及即將展覽皆為空時的說明">{inp('exhibitionEmptyRecordMsg')}</Field>
                </div>
              </>
            )}

            {/* ══ 關於 & 申請 ══ */}
            {tab === 5 && (
              <>
                <div className={styles.sectionTitle}>關於頁 — 開場背景大圖</div>
                <div className={styles.sections}>
                  <Field label="背景大圖" location="關於頁 /about — 全寬背景圖（建議 1920×1080px，橫式 16:9）">{imgUpload('aboutOpeningBg')}</Field>
                  <Field label="小標籤" location="關於頁 — 大圖上方小字">{inp('aboutOpeningLabel')}</Field>
                  <Field label="標題第一行" location="關於頁 — 大圖上的主標題">{inp('aboutOpeningTitle')}</Field>
                  <Field label="標題斜體行" location="關於頁 — 大圖標題斜體第二行">{inp('aboutOpeningTitleEm')}</Field>
                </div>

                <div className={styles.sectionTitle}>關於頁 — 團隊介紹</div>
                <div className={styles.sections}>
                  <Field label="區塊小標籤" location="關於頁 — 團隊區塊上方小字">{inp('teamSectionLabel')}</Field>
                  <Field label="區塊標題" location="關於頁 — 團隊區塊大標題">{inp('teamSectionTitle')}</Field>
                </div>
                {([1,2,3,4] as const).map(n => (
                  <div key={n} className={styles.sections} style={{ marginTop: 16 }}>
                    <div className={styles.sectionTitle} style={{ fontSize: 12, marginBottom: 8 }}>成員 {n}</div>
                    <Field label="照片" location={`關於頁 — 第 ${n} 位成員照片（建議 400×400px，正方形）`}>{imgUpload(`team${n}Img` as keyof SiteSettings)}</Field>
                    <Field label="姓名" location={`關於頁 — 第 ${n} 位成員姓名`}>{inp(`team${n}Name` as keyof SiteSettings)}</Field>
                    <Field label="職稱" location={`關於頁 — 第 ${n} 位成員職稱`}>{inp(`team${n}Role` as keyof SiteSettings)}</Field>
                    <Field label="簡介" location={`關於頁 — 第 ${n} 位成員一行簡介`}>{inp(`team${n}Bio` as keyof SiteSettings)}</Field>
                  </div>
                ))}

                <div className={styles.sectionTitle} style={{ marginTop: 32 }}>申請頁 — 見證區塊</div>
                <div className={styles.sections}>
                  <Field label="區塊小標籤" location="申請頁 — 見證區塊上方小字">{inp('testimonialsLabel')}</Field>
                  <Field label="區塊標題" location="申請頁 — 見證區塊大標題">{inp('testimonialsTitle')}</Field>
                </div>
                {([1,2,3] as const).map(n => (
                  <div key={n} className={styles.sections} style={{ marginTop: 16 }}>
                    <div className={styles.sectionTitle} style={{ fontSize: 12, marginBottom: 8 }}>見證者 {n}</div>
                    <Field label="頭像" location={`申請頁 — 第 ${n} 位見證者頭像（建議 200×200px，正方形）`}>{imgUpload(`testimonial${n}Img` as keyof SiteSettings)}</Field>
                    <Field label="姓名" location={`申請頁 — 第 ${n} 位見證者姓名`}>{inp(`testimonial${n}Name` as keyof SiteSettings)}</Field>
                    <Field label="媒材 & 資歷" location={`申請頁 — 第 ${n} 位見證者媒材說明`}>{inp(`testimonial${n}Medium` as keyof SiteSettings)}</Field>
                    <Field label="引言" location={`申請頁 — 第 ${n} 位見證者推薦語`}>{txt(`testimonial${n}Quote` as keyof SiteSettings, 2)}</Field>
                  </div>
                ))}
              </>
            )}

            {/* ══ 通用 ══ */}
            {tab === 6 && (
              <>
                <div className={styles.sectionTitle}>開場動畫</div>
                <div className={styles.sections}>
                  <Field label="大標題" location="開場動畫 — 第一行大字">{inp('introHeadline')}</Field>
                  <Field label="副標題" location="開場動畫 — 第二行小字">{inp('introSubline')}</Field>
                  <Field label="按鈕文字" location="開場動畫 — 「進入展館」按鈕">{inp('introCtaText')}</Field>
                </div>

                <div className={styles.sectionTitle}>導覽列</div>
                <div className={styles.sections}>
                  <Field label="Logo 中文名稱" location="導覽列左上角 — 主要中文名稱">{inp('navBrandZh')}</Field>
                  <Field label="Logo 英文名稱" location="導覽列左上角 — 英文小字">{inp('navBrandEn')}</Field>
                </div>

                <div className={styles.sectionTitle}>頁尾</div>
                <div className={styles.sections}>
                  <Field label="頁尾標語" location="頁尾 — Logo 下方一行標語">{inp('footerTagline')}</Field>
                </div>

                <div className={styles.sectionTitle}>申請頁</div>
                <div className={styles.sections}>
                  <Field label="申請頁標題" location="申請頁 /apply — 大標題">{inp('applyTitle')}</Field>
                  <Field label="申請頁副標題" location="申請頁 /apply — 說明文字">{txt('applySubtitle', 3)}</Field>
                </div>
              </>
            )}

            {/* ══ SEO ══ */}
            {tab === 7 && (
              <>
                <div className={styles.sectionTitle}>全站 SEO 基礎設定</div>
                <div className={styles.sections}>
                  <Field label="網站名稱" location="瀏覽器分頁、搜尋結果、社群分享 — 全站名稱" hint="例：息壤 Xirang。此名稱用於所有頁面 title 的後綴。">{inp('siteTitle')}</Field>
                  <Field label="Title 模板" location="各頁面 <title> 格式" hint="用 %s 代替頁面標題，例：%s | 息壤 Xirang → 顯示為「藝術家 | 息壤 Xirang」">{inp('siteTitleTemplate')}</Field>
                  <Field label="全站預設 Description" location="Google 搜尋結果摘要（未設定頁面時使用）" hint="建議 120–160 字元，清楚說明網站核心價值。">{txt('siteDescription', 3)}</Field>
                  <Field label="關鍵字（Keywords）" location="meta keywords 標籤" hint="以逗號分隔，例：藝術,展館,水墨,台灣藝術家。現代 Google 已不依賴此欄位，但有助於其他搜尋引擎。">{txt('siteKeywords', 2)}</Field>
                  <Field label="預設 OG 圖片 URL" location="社群分享（Facebook、Line、Twitter）— 預設分享圖" hint="建議尺寸 1200×630px。若各頁面有封面圖，會優先使用各頁面的圖片。留空則不顯示預覽圖。">{inp('ogImage')}</Field>
                  <Field label="Twitter/X 帳號" location="Twitter Card — @帳號標記（可選填）" hint="格式含 @，例：@xirang_tw。留空則不顯示。">{inp('twitterHandle')}</Field>
                </div>

                <div className={styles.sectionTitle}>各頁面 SEO 標題 ＆ 描述</div>
                <div className={styles.sections}>
                  <Field label="首頁 Title" location="首頁 / 的 <title> 標籤" hint="會套用 Title 模板，例：亞洲資深藝術家數位展館 | 息壤 Xirang">{inp('seoHomeTitle')}</Field>
                  <Field label="首頁 Description" location="首頁搜尋摘要">{txt('seoHomeDescription', 3)}</Field>
                  <Field label="藝術家頁 Title" location="/artists 頁的 <title>">{inp('seoArtistsTitle')}</Field>
                  <Field label="藝術家頁 Description" location="/artists 頁搜尋摘要">{txt('seoArtistsDescription', 2)}</Field>
                  <Field label="典藏頁 Title" location="/works 頁的 <title>">{inp('seoWorksTitle')}</Field>
                  <Field label="典藏頁 Description" location="/works 頁搜尋摘要">{txt('seoWorksDescription', 2)}</Field>
                  <Field label="策展頁 Title" location="/exhibitions 頁的 <title>">{inp('seoExhibitionsTitle')}</Field>
                  <Field label="策展頁 Description" location="/exhibitions 頁搜尋摘要">{txt('seoExhibitionsDescription', 2)}</Field>
                  <Field label="申請頁 Title" location="/apply 頁的 <title>">{inp('seoApplyTitle')}</Field>
                  <Field label="申請頁 Description" location="/apply 頁搜尋摘要">{txt('seoApplyDescription', 2)}</Field>
                </div>

                <div className={styles.sectionTitle}>動態頁面 SEO（自動生成）</div>
                <div className={styles.sections}>
                  <div className={styles.field} style={{ gridTemplateColumns: '1fr' }}>
                    <div className={styles.fieldMeta}>
                      <span className={styles.fieldLabel}>藝術家詳細頁 /artists/[slug]</span>
                      <span className={styles.fieldLocation}>📍 自動使用藝術家姓名為 Title、代表語錄為 Description、肖像照為 OG 圖片</span>
                    </div>
                  </div>
                  <div className={styles.field} style={{ gridTemplateColumns: '1fr' }}>
                    <div className={styles.fieldMeta}>
                      <span className={styles.fieldLabel}>展覽詳細頁 /exhibitions/[slug]</span>
                      <span className={styles.fieldLocation}>📍 自動使用展覽名稱為 Title、展覽說明為 Description、封面圖為 OG 圖片</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className={styles.actions}>
              {saved && <span className={styles.savedMsg}>✓ 已儲存</span>}
              <button className={styles.btnSave} onClick={save} disabled={saving}>
                {saving ? '儲存中…' : '儲存所有設定'}
              </button>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  )
}

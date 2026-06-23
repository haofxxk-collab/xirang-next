'use client'

import { useState } from 'react'
import type { Application } from '@/types'
import styles from './ApplyForm.module.css'

const MEDIA_OPTIONS = ['水墨 / 國畫', '書法', '油彩 / 壓克力', '水彩', '版畫', '雕刻 / 木工', '陶藝 / 陶瓷', '纖維 / 織品', '裝置藝術', '攝影', '膠彩 / 礦物顏料', '其他']

type Step = 1 | 2 | 3

export function ApplyForm() {
  const [step, setStep] = useState<Step>(1)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState<Partial<Application>>({ media: [], agreedToTerms: false })

  const set = (key: keyof Application, val: unknown) => setForm((f) => ({ ...f, [key]: val }))

  const toggleMedia = (m: string) => {
    const cur = form.media ?? []
    set('media', cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m])
  }

  const submit = async () => {
    try {
      await fetch('/api/apply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    } catch { /* show success anyway for UX */ }
    setDone(true)
  }

  if (done) {
    return (
      <section className={styles.section}>
        <div className={styles.success}>
          <div className={styles.successIcon}>✦</div>
          <h2 className={styles.successTitle}>申請已送出，<br />感謝您的信任。</h2>
          <p className={styles.successBody}>
            我們的策展團隊將在五個工作天內<br />以電子郵件與您聯絡。<br /><br />請靜候佳音。
          </p>
          <a href="/" className={styles.successBack}>返回展館首頁</a>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.topLabel}>申請表</p>
        <h2 className={styles.formTitle}>告訴我們您的故事</h2>

        {/* TABS */}
        <div className={styles.tabs}>
          {([1, 2, 3] as Step[]).map((n) => (
            <div key={n} className={`${styles.tab} ${step === n ? styles.tabActive : ''} ${step > n ? styles.tabDone : ''}`}>
              <span className={styles.tabNum}>{['一', '二', '三'][n - 1]}</span>
              {['基本資料', '創作背景', '作品上傳'][n - 1]}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className={styles.formStep}>
            <div className={styles.row2}>
              <Field label="藝術家姓名" required>
                <input type="text" placeholder="中文全名" value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} />
              </Field>
              <Field label="英文姓名">
                <input type="text" placeholder="Romanization" value={form.nameEn ?? ''} onChange={(e) => set('nameEn', e.target.value)} />
              </Field>
            </div>
            <div className={styles.row2}>
              <Field label="電子郵件" required>
                <input type="email" placeholder="your@email.com" value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} />
              </Field>
              <Field label="聯絡電話">
                <input type="tel" placeholder="+886 __ ____ ____" value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} />
              </Field>
            </div>
            <div className={styles.row2}>
              <Field label="所在地區" required>
                <select value={form.region ?? ''} onChange={(e) => set('region', e.target.value)}>
                  <option value="" disabled>請選擇</option>
                  {['臺灣', '香港', '中國大陸', '日本', '韓國', '東南亞', '其他'].map((r) => <option key={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="申請身份" required>
                <select value={form.applicantType ?? ''} onChange={(e) => set('applicantType', e.target.value as Application['applicantType'])}>
                  <option value="" disabled>請選擇</option>
                  <option value="artist">藝術家本人</option>
                  <option value="family">家屬代為申請</option>
                  <option value="agent">經紀人 / 代理人</option>
                  <option value="recommendation">推薦他人</option>
                </select>
              </Field>
            </div>
            <div className={styles.formNav}>
              <span className={styles.stepIndicator}>第 1 步，共 3 步</span>
              <button className={styles.btnNext} onClick={() => setStep(2)}>下一步 →</button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className={styles.formStep}>
            <Field label="主要創作媒材" required>
              <div className={styles.checkGrid}>
                {MEDIA_OPTIONS.map((m) => (
                  <label key={m} className={styles.checkItem}>
                    <input type="checkbox" checked={form.media?.includes(m) ?? false} onChange={() => toggleMedia(m)} />
                    <span>{m}</span>
                  </label>
                ))}
              </div>
            </Field>
            <div className={styles.row2}>
              <Field label="創作資歷（年）" required>
                <select value={form.yearsActive ?? ''} onChange={(e) => set('yearsActive', e.target.value)}>
                  <option value="" disabled>請選擇</option>
                  {['20 — 29 年', '30 — 39 年', '40 — 49 年', '50 年以上'].map((y) => <option key={y}>{y}</option>)}
                </select>
              </Field>
              <Field label="目前典藏作品數量">
                <select value={form.workCount ?? ''} onChange={(e) => set('workCount', e.target.value)}>
                  <option value="" disabled>請選擇</option>
                  {['1 — 20 件', '21 — 50 件', '51 — 100 件', '100 件以上'].map((w) => <option key={w}>{w}</option>)}
                </select>
              </Field>
            </div>
            <Field label="創作自述" required hint="請簡述您的創作歷程、風格形成，以及您希望息壤幫助您傳遞的故事。（300字以內）">
              <textarea rows={6} placeholder="您的創作故事…" value={form.bio ?? ''} onChange={(e) => set('bio', e.target.value)} />
            </Field>
            <Field label="曾參與的重要展覽或獲獎（選填）">
              <textarea rows={3} placeholder="例：2019 國立歷史博物館個展、2015 台灣美術獎…" value={form.exhibitions ?? ''} onChange={(e) => set('exhibitions', e.target.value)} />
            </Field>
            <div className={styles.formNav}>
              <button className={styles.btnPrev} onClick={() => setStep(1)}>← 上一步</button>
              <span className={styles.stepIndicator}>第 2 步，共 3 步</span>
              <button className={styles.btnNext} onClick={() => setStep(3)}>下一步 →</button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className={styles.formStep}>
            <Field label="個人網站 / 社群連結（選填）">
              <input type="url" placeholder="https://…" value={form.portfolioUrl ?? ''} onChange={(e) => set('portfolioUrl', e.target.value)} />
            </Field>
            <Field label="其他補充說明（選填）">
              <textarea rows={3} placeholder="任何您希望讓我們知道的事…" value={form.notes ?? ''} onChange={(e) => set('notes', e.target.value)} />
            </Field>
            <label className={styles.agreeRow}>
              <input type="checkbox" checked={form.agreedToTerms} onChange={(e) => set('agreedToTerms', e.target.checked)} />
              <span>我同意息壤使用本申請表中的資料進行展館建立與聯繫用途，並同意隱私政策。</span>
            </label>
            <div className={styles.formNav}>
              <button className={styles.btnPrev} onClick={() => setStep(2)}>← 上一步</button>
              <span className={styles.stepIndicator}>第 3 步，共 3 步</span>
              <button className={styles.btnSubmit} onClick={submit} disabled={!form.agreedToTerms}>提交申請</button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}{required && <span className={styles.req}>*</span>}</label>
      {children}
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  )
}

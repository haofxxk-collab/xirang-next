import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getExhibitionBySlug, getAllExhibitions, getSiteSettings } from '@/lib/queries'
import { urlForSize } from '@/lib/sanity'
import styles from './exhibition.module.css'

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  const all = await getAllExhibitions()
  return all.map((e) => ({ slug: e.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [ex, settings] = await Promise.all([getExhibitionBySlug(params.slug), getSiteSettings()])
  if (!ex) return {}
  const ogImg = ex.coverImage ? urlForSize(ex.coverImage, 1200, 630) : settings.ogImage
  const images = ogImg ? [{ url: ogImg, width: 1200, height: 630, alt: ex.title }] : []
  return {
    title: ex.title,
    description: ex.description,
    openGraph: { title: `${ex.title} — ${settings.siteTitle}`, description: ex.description, images },
    twitter: { title: `${ex.title} — ${settings.siteTitle}`, description: ex.description, images },
  }
}

export const revalidate = false

export default async function ExhibitionPage({ params }: Props) {
  const ex = await getExhibitionBySlug(params.slug)
  if (!ex) notFound()

  const coverUrl = ex.coverImage
    ? urlForSize(ex.coverImage, 1920, 1080)
    : 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=1920&q=85&fit=crop'

  const dateStr = [fmtDate(ex.startDate), fmtDate(ex.endDate)].filter(Boolean).join(' — ')

  return (
    <>
      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image src={coverUrl} alt={ex.title} fill sizes="100vw" className={styles.heroBgImg} priority />
          <div className={styles.heroBgOverlay} />
        </div>
        <div className={styles.heroContent}>
          <nav className={styles.breadcrumb}>
            <Link href="/">展館</Link>
            <span>/</span>
            <Link href="/exhibitions">策展</Link>
            <span>/</span>
            <span>{ex.title}</span>
          </nav>
          <div className={styles.heroMeta}>
            <span className={styles.heroTag}>{typeLabel(ex.type)}</span>
            {dateStr && <span className={styles.heroDate}>{dateStr}</span>}
            <span className={`${styles.heroStatus} ${styles[ex.status]}`}>{statusLabel(ex.status)}</span>
          </div>
          <h1 className={styles.heroTitle}>{ex.title}</h1>
          {ex.titleEn && <p className={styles.heroTitleEn}>{ex.titleEn}</p>}
        </div>
      </section>

      {/* ── DESCRIPTION ── */}
      <section className={styles.descSection}>
        <div className={styles.descInner}>
          <div className={styles.descLeft}>
            <p className={`reveal ${styles.label}`}>關於此展</p>
            <p className={`reveal ${styles.descBody}`}>{ex.description}</p>
            {ex.curatorNote && (
              <blockquote className={`reveal ${styles.curatorNote}`}>
                <span className={styles.quoteChar}>「</span>
                {ex.curatorNote}
                <span className={styles.quoteChar}>」</span>
                <cite>— 策展人語</cite>
              </blockquote>
            )}
          </div>
          <div className={`reveal ${styles.descRight}`}>
            <div className={styles.infoBox}>
              {[
                ['展覽類型', typeLabel(ex.type)],
                ['展覽期間', dateStr || '—'],
                ['展覽狀態', statusLabel(ex.status)],
                ['參展藝術家', `${ex.artists?.length ?? 0} 位`],
                ['展出作品', `${ex.works?.length ?? 0} 件`],
              ].map(([label, val]) => (
                <div key={label} className={styles.infoRow}>
                  <span className={styles.infoLabel}>{label}</span>
                  <span className={styles.infoVal}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ARTISTS ── */}
      {ex.artists?.length > 0 && (
        <section className={styles.artistsSection}>
          <div className={styles.sectionHead}>
            <p className={`reveal ${styles.label}`}>參展藝術家</p>
            <h2 className={`reveal ${styles.sectionTitle}`}>{ex.artists.length} 位藝術家</h2>
          </div>
          <div className={styles.artistsGrid}>
            {ex.artists.map((a, i) => {
              const portrait = a.portrait
                ? urlForSize(a.portrait, 480, 600)
                : 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=480&q=80&fit=crop&crop=face'
              return (
                <Link
                  key={a._id}
                  href={`/artists/${a.slug.current}`}
                  className={`reveal ${styles.artistCard}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className={styles.artistImgWrap}>
                    <Image src={portrait} alt={a.name} fill sizes="(max-width:900px) 50vw, 25vw" className={styles.artistImg} />
                    <div className={styles.artistOverlay} />
                  </div>
                  <div className={styles.artistInfo}>
                    <p className={styles.artistMedium}>{a.medium?.join(' · ')}</p>
                    <p className={styles.artistName}>{a.name}</p>
                    {(a as any).yearsActive && <p className={styles.artistYears}>創作逾 {(a as any).yearsActive} 年</p>}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ── WORKS ── */}
      {ex.works?.length > 0 && (
        <section className={styles.worksSection}>
          <div className={styles.sectionHead}>
            <p className={`reveal ${styles.label}`}>展出作品</p>
            <h2 className={`reveal ${styles.sectionTitle}`}>{ex.works.length} 件作品</h2>
          </div>
          <div className={styles.worksGrid}>
            {ex.works.map((w, i) => {
              const img = w.images?.[0]
              const imgUrl = img
                ? urlForSize(img, 800, 640)
                : 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=800&q=80&fit=crop'
              return (
                <Link
                  key={w._id}
                  href={`/works/${w.slug.current}`}
                  className={`reveal ${styles.workCard}`}
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <div className={styles.workImgWrap}>
                    <Image src={imgUrl} alt={w.title} fill sizes="(max-width:900px) 100vw, 33vw" className={styles.workImg} />
                  </div>
                  <div className={styles.workInfo}>
                    <h3 className={styles.workTitle}>《{w.title}》</h3>
                    <p className={styles.workMeta}>{w.year} · {w.medium}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ── BACK ── */}
      <section className={styles.backSection}>
        <Link href="/exhibitions" className={styles.backLink}>← 回到所有策展</Link>
      </section>
    </>
  )
}

function fmtDate(d?: string) {
  if (!d) return ''
  const dt = new Date(d)
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}.${String(dt.getDate()).padStart(2, '0')}`
}

function typeLabel(t: string) {
  const map: Record<string, string> = { solo: '個展', duo: '雙人展', group: '聯展', annual: '年度大展', opening: '開幕首展' }
  return map[t] ?? t
}

function statusLabel(s: string) {
  const map: Record<string, string> = { current: '展覽中', upcoming: '即將展出', past: '已結束' }
  return map[s] ?? s
}

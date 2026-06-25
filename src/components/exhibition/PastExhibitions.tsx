import Image from 'next/image'
import Link from 'next/link'
import type { Exhibition } from '@/types'
import { urlForSize } from '@/lib/sanity'
import styles from './PastExhibitions.module.css'

interface Props {
  exhibitions: Exhibition[]
  upcoming: Exhibition[]
  pastLabel: string
  pastTitle: string
  upcomingLabel: string
  upcomingTitle: string
  emptyMsg: string
}

export function PastExhibitions({ exhibitions, upcoming, pastLabel, pastTitle, upcomingLabel, upcomingTitle, emptyMsg }: Props) {
  if (!exhibitions.length && !upcoming.length) return (
    <section style={{ padding: '6rem 4rem', textAlign: 'center' }}>
      <p style={{ fontSize: '0.78rem', letterSpacing: '0.3em', color: 'var(--gold)', marginBottom: '1rem' }}>{pastLabel}</p>
      <p style={{ fontSize: '1.1rem', color: '#6e6860', letterSpacing: '0.1em' }}>{emptyMsg}</p>
    </section>
  )
  return (
    <>
      {/* PAST GRID */}
      <section className={styles.past}>
        <div className={styles.head}>
          <p className={`reveal ${styles.label}`}>{pastLabel}</p>
          <h2 className={`reveal ${styles.title}`}>{pastTitle}</h2>
        </div>
        <div className={styles.grid}>
          {exhibitions.map((ex, i) => {
            const img = ex.coverImage
              ? urlForSize(ex.coverImage, 800, 520)
              : 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80&fit=crop'
            return (
              <Link
                key={ex._id}
                href={`/exhibitions/${ex.slug.current}`}
                className={`reveal ${styles.card}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className={styles.cardImg}>
                  <Image src={img} alt={ex.title} fill className={styles.img} sizes="(max-width:900px) 100vw, 50vw" />
                </div>
                <div className={styles.cardInfo}>
                  <p className={styles.cardDate}>{fmtYear(ex.startDate)}</p>
                  <h3 className={styles.cardTitle}>{ex.title}</h3>
                  <p className={styles.cardArtists}>{ex.artists?.map((a) => a.name).join('、')}</p>
                  <span className={styles.cardArrow}>→</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* UPCOMING */}
      {upcoming.length > 0 && (
        <section className={styles.upcoming}>
          <div className={styles.head}>
            <p className={`reveal ${styles.label}`}>{upcomingLabel}</p>
            <h2 className={`reveal ${styles.title}`}>{upcomingTitle}</h2>
          </div>
          <div className={styles.upcomingList}>
            {upcoming.map((ex) => (
              <div key={ex._id} className={`reveal ${styles.upcomingItem}`}>
                <span className={styles.upDate}>{fmtDate(ex.startDate)}</span>
                <div className={styles.upInfo}>
                  <p className={styles.upTitle}>{ex.title}</p>
                  <p className={styles.upArtists}>{ex.artists?.map((a) => a.name).join('、')}</p>
                </div>
                <span className={styles.upTag}>{upcomingLabel}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

function fmtYear(d?: string) {
  if (!d) return ''
  return new Date(d).getFullYear().toString()
}

function fmtDate(d?: string) {
  if (!d) return ''
  const dt = new Date(d)
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}`
}

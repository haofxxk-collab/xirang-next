import Image from 'next/image'
import Link from 'next/link'
import type { Exhibition } from '@/types'
import { urlForSize } from '@/lib/sanity'
import styles from './CurrentExhibition.module.css'

interface Props { exhibition: Exhibition | null }

export function CurrentExhibition({ exhibition }: Props) {
  if (!exhibition) return null

  const coverUrl = exhibition.coverImage
    ? urlForSize(exhibition.coverImage, 1600, 900)
    : 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=1600&q=85&fit=crop'

  const dateStr = `${fmtDate(exhibition.startDate)} — ${fmtDate(exhibition.endDate)}`

  return (
    <section className={styles.section}>
      <div className={styles.imgWrap}>
        <Image src={coverUrl} alt={exhibition.title} fill className={styles.img} sizes="100vw" priority />
        <div className={styles.overlay} />
      </div>

      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.tag}>當期策展</span>
          <span className={styles.date}>{dateStr}</span>
        </div>
        <h2 className={`reveal ${styles.title}`}>{exhibition.title}</h2>
        {exhibition.titleEn && <p className={`reveal ${styles.titleEn}`}>{exhibition.titleEn}</p>}
        <p className={`reveal ${styles.desc}`}>{exhibition.description}</p>

        {exhibition.artists?.length > 0 && (
          <div className={`reveal ${styles.artists}`}>
            <p className={styles.artistsLabel}>參展藝術家</p>
            <div className={styles.artistsList}>
              {exhibition.artists.map((a) => (
                <Link key={a._id} href={`/artists/${a.slug.current}`} className={styles.artistLink}>
                  {a.portrait && (
                    <Image src={urlForSize(a.portrait, 80, 100)} alt={a.name} width={40} height={50} className={styles.artistImg} />
                  )}
                  <span className={styles.artistName}>{a.name}</span>
                  <span className={styles.artistMedium}>{a.medium?.[0]}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Link href={`/exhibitions/${exhibition.slug.current}`} className={`reveal ${styles.cta}`}>
          進入展覽 →
        </Link>
      </div>
    </section>
  )
}

function fmtDate(d?: string) {
  if (!d) return ''
  const dt = new Date(d)
  return `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}.${String(dt.getDate()).padStart(2, '0')}`
}

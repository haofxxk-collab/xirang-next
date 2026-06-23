import Link from 'next/link'
import Image from 'next/image'
import type { Exhibition } from '@/types'
import { urlForSize } from '@/lib/sanity'
import styles from './ExhibitionPreview.module.css'

interface Props { exhibition: Exhibition | null }

export function ExhibitionPreview({ exhibition }: Props) {
  if (!exhibition) return null

  const coverUrl = exhibition.coverImage
    ? urlForSize(exhibition.coverImage, 1600, 900)
    : 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=1600&q=85&fit=crop'

  return (
    <section className={styles.section}>
      <div className={styles.imgWrap}>
        <Image
          src={coverUrl}
          alt={exhibition.title}
          fill
          className={styles.img}
          sizes="100vw"
        />
        <div className={styles.overlay} />
      </div>

      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.tag}>當期策展</span>
          <span className={styles.type}>{typeLabel(exhibition.type)}</span>
        </div>
        <h2 className={`reveal ${styles.title}`}>{exhibition.title}</h2>
        <p className={`reveal ${styles.body}`}>{exhibition.description}</p>

        <div className={`reveal ${styles.artists}`}>
          {exhibition.artists?.slice(0, 4).map((a) => (
            <Link key={a._id} href={`/artists/${a.slug.current}`} className={styles.artistChip}>
              {a.portrait && (
                <Image
                  src={urlForSize(a.portrait, 64, 64)}
                  alt={a.name}
                  width={32}
                  height={32}
                  className={styles.chipImg}
                />
              )}
              <span>{a.name}</span>
            </Link>
          ))}
        </div>

        <Link href={`/exhibitions/${exhibition.slug.current}`} className={`reveal ${styles.cta}`}>
          進入展覽 →
        </Link>
      </div>
    </section>
  )
}

function typeLabel(type: string) {
  const map: Record<string, string> = {
    solo: '個展', duo: '雙人展', group: '聯展',
    annual: '年度大展', opening: '開幕首展',
  }
  return map[type] ?? type
}

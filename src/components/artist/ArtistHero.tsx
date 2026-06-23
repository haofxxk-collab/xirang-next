import Image from 'next/image'
import Link from 'next/link'
import type { Artist } from '@/types'
import { urlForSize } from '@/lib/sanity'
import styles from './ArtistHero.module.css'

interface Props { artist: Artist }

export function ArtistHero({ artist }: Props) {
  const heroUrl = artist.heroImage
    ? urlForSize(artist.heroImage, 1600, 1000)
    : 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=1600&q=85&fit=crop'

  const portraitUrl = artist.portrait
    ? urlForSize(artist.portrait, 600, 750)
    : 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=600&q=80&fit=crop&crop=face'

  return (
    <section className={styles.hero}>
      <div className={styles.heroBg}>
        <Image src={heroUrl} alt={artist.name} fill sizes="100vw" className={styles.heroBgImg} priority />
        <div className={styles.heroBgOverlay} />
      </div>

      <div className={styles.inner}>
        <div className={`reveal ${styles.portraitWrap}`}>
          <Image
            src={portraitUrl}
            alt={artist.name}
            width={480}
            height={600}
            className={styles.portrait}
          />
        </div>

        <div className={styles.info}>
          <nav className={`reveal ${styles.breadcrumb}`}>
            <Link href="/">展館</Link>
            <span>/</span>
            <Link href="/artists">藝術家</Link>
            <span>/</span>
            <span>{artist.name}</span>
          </nav>

          <div className={`reveal ${styles.indexNum}`}>{String(artist.index ?? 1).padStart(2, '0')}</div>

          <h1 className={`reveal ${styles.name}`}>{artist.name}</h1>
          {artist.nameEn && (
            <p className={`reveal ${styles.nameEn}`}>{artist.nameEn}</p>
          )}

          <div className={`reveal ${styles.tags}`}>
            {artist.medium?.map((m) => (
              <span key={m} className={styles.tag}>{m}</span>
            ))}
          </div>

          <div className={`reveal ${styles.metaGrid}`}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>創作資歷</span>
              <span className={styles.metaVal}>{artist.yearsActive} 年</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>出生年份</span>
              <span className={styles.metaVal}>{artist.birthYear}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>所在地</span>
              <span className={styles.metaVal}>{artist.location}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>典藏作品</span>
              <span className={styles.metaVal}>{artist.works?.length ?? 0} 件</span>
            </div>
          </div>

          {artist.quote && (
            <blockquote className={`reveal ${styles.quote}`}>
              「{artist.quote}」
            </blockquote>
          )}
        </div>
      </div>
    </section>
  )
}

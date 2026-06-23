import Link from 'next/link'
import Image from 'next/image'
import type { Artist } from '@/types'
import { urlForSize } from '@/lib/sanity'
import styles from './ArtistsPreview.module.css'

interface Props { artists: Artist[] }

export function ArtistsPreview({ artists }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <div>
          <p className={`reveal ${styles.label}`}>館內藝術家</p>
          <h2 className={`reveal ${styles.title}`}>每一位，<br />都是一段歲月。</h2>
        </div>
        <Link href="/artists" className={`reveal ${styles.more}`}>
          瀏覽所有藝術家 →
        </Link>
      </div>

      <div className={styles.grid}>
        {artists.map((artist, i) => {
          const imgUrl = artist.portrait
            ? urlForSize(artist.portrait, 600, 750)
            : `https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=600&q=80&fit=crop&crop=face`

          return (
            <Link
              key={artist._id}
              href={`/artists/${artist.slug.current}`}
              className={`reveal ${styles.card}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className={styles.cardImg}>
                <Image
                  src={imgUrl}
                  alt={artist.name}
                  fill
                  sizes="(max-width:900px) 50vw, 25vw"
                  className={styles.img}
                />
                <div className={styles.cardOverlay} />
              </div>
              <div className={styles.cardInfo}>
                <p className={styles.cardMedium}>{artist.medium?.join(' · ')}</p>
                <p className={styles.cardName}>{artist.name}</p>
                <p className={styles.cardYears}>{artist.yearsActive}年</p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

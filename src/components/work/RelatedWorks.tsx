import Link from 'next/link'
import Image from 'next/image'
import type { Artwork, Artist } from '@/types'
import { urlForSize } from '@/lib/sanity'
import styles from './RelatedWorks.module.css'

interface Props {
  works: Pick<Artwork, '_id' | 'slug' | 'title' | 'year' | 'medium' | 'images'>[]
  artist: Pick<Artist, '_id' | 'name' | 'slug'>
}

export function RelatedWorks({ works, artist }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <p className={`reveal ${styles.label}`}>更多典藏</p>
        <h2 className={`reveal ${styles.title}`}>{artist.name} 的其他作品</h2>
        <Link href={`/artists/${artist.slug.current}`} className={`reveal ${styles.viewAll}`}>
          瀏覽全部 →
        </Link>
      </div>

      {works.length > 0 ? (
        <div className={styles.grid}>
          {works.map((work, i) => {
            const img = work.images?.[0]
            const imgUrl = img
              ? urlForSize(img, 700, 560)
              : 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=700&q=80&fit=crop'

            return (
              <Link key={work._id} href={`/works/${work.slug.current}`}
                className={`reveal ${styles.card}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className={styles.imgWrap}>
                  <Image src={imgUrl} alt={work.title} fill sizes="(max-width:900px) 100vw, 33vw" className={styles.img} />
                </div>
                <div className={styles.info}>
                  <h3 className={styles.workTitle}>《{work.title}》</h3>
                  <p className={styles.workMeta}>{work.year} · {work.medium}</p>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <p className={styles.empty}>更多作品即將上架。</p>
      )}
    </section>
  )
}

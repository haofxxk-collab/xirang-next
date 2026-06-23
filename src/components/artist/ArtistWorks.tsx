import Link from 'next/link'
import Image from 'next/image'
import type { Artwork } from '@/types'
import { urlForSize } from '@/lib/sanity'
import styles from './ArtistWorks.module.css'

interface Props { works: Artwork[] }

export function ArtistWorks({ works }: Props) {
  if (!works?.length) return null

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <p className={`reveal ${styles.label}`}>典藏作品</p>
        <h2 className={`reveal ${styles.title}`}>
          {works.length} 件典藏
        </h2>
      </div>

      <div className={styles.grid}>
        {works.map((work, i) => {
          const img = work.images?.[0]
          const imgUrl = img
            ? urlForSize(img, 700, 560)
            : 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=700&q=80&fit=crop'

          return (
            <Link
              key={work._id}
              href={`/works/${work.slug.current}`}
              className={`reveal ${styles.card}`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className={styles.imgWrap}>
                <Image src={imgUrl} alt={work.title} fill sizes="(max-width:900px) 100vw, 33vw" className={styles.img} />
              </div>
              <div className={styles.info}>
                <h3 className={styles.workTitle}>《{work.title}》</h3>
                <p className={styles.workMeta}>{work.year} · {work.medium}</p>
                <p className={styles.workDims}>{work.dimensions}</p>
                <span className={`${styles.status} ${styles[work.status]}`}>
                  {work.status === 'available' ? '開放收藏' : work.status === 'inquire' ? '洽詢收藏' : '僅展覽'}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import type { Artwork } from '@/types'
import { urlForSize } from '@/lib/sanity'
import styles from './WorksScroll.module.css'

interface Props {
  artworks: Artwork[]
  label: string
  title: string
  more: string
}

export function WorksScroll({ artworks, label, title, more }: Props) {
  const [titleLine1, titleLine2] = title.split('\n')
  if (!artworks.length) return null
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <p className={`reveal ${styles.label}`}>{label}</p>
        <h2 className={`reveal ${styles.title}`}>{titleLine1}<br />{titleLine2}</h2>
      </div>

      <div className={styles.grid}>
        {artworks.map((work, i) => {
          const img = work.images?.[0]
          const imgUrl = img
            ? urlForSize(img, 800, 600)
            : `https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=800&q=80&fit=crop`

          return (
            <Link
              key={work._id}
              href={`/works/${work.slug.current}`}
              className={`reveal ${styles.card}`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className={styles.imgWrap}>
                <Image
                  src={imgUrl}
                  alt={work.title}
                  fill
                  sizes="(max-width:900px) 100vw, 33vw"
                  className={styles.img}
                />
              </div>
              <div className={styles.info}>
                <div>
                  <p className={styles.artist}>{work.artist?.name ?? ''}</p>
                  <h3 className={styles.workTitle}>《{work.title}》</h3>
                  <p className={styles.meta}>{work.year} · {work.medium}</p>
                </div>
                <span className={`${styles.status} ${styles[work.status]}`}>
                  {statusLabel(work.status)}
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      <div className={`reveal ${styles.foot}`}>
        <Link href="/works" className={styles.moreCta}>{more}</Link>
      </div>
    </section>
  )
}

function statusLabel(s: string) {
  return s === 'available' ? '開放收藏' : s === 'inquire' ? '洽詢收藏' : '僅展覽'
}

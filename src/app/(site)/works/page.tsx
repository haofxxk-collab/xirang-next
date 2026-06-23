import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllArtworks } from '@/lib/queries'
import { urlForSize } from '@/lib/sanity'
import styles from './works.module.css'

export const metadata: Metadata = {
  title: '典藏',
  description: '瀏覽息壤館內所有典藏作品，每件作品背後都有一段深厚的創作故事。',
}

export const revalidate = 3600

export default async function WorksPage() {
  const works = await getAllArtworks()

  return (
    <>
      <section className={styles.header}>
        <div className={styles.bgChar} aria-hidden>藏</div>
        <div className={styles.inner}>
          <p className={`reveal ${styles.label}`}>典藏</p>
          <h1 className={`reveal ${styles.title}`}>
            {works.length} 件典藏，<br />
            <em>每件都有分量。</em>
          </h1>
        </div>
      </section>

      <section className={styles.grid}>
        <div className={styles.gridInner}>
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
                style={{ transitionDelay: `${(i % 4) * 70}ms` }}
              >
                <div className={styles.imgWrap}>
                  <Image src={imgUrl} alt={work.title} fill sizes="(max-width:900px) 50vw, 25vw" className={styles.img} />
                </div>
                <div className={styles.info}>
                  <p className={styles.artist}>{work.artist.name}</p>
                  <h2 className={styles.workTitle}>《{work.title}》</h2>
                  <p className={styles.meta}>{work.year} · {work.medium}</p>
                  <span className={`${styles.status} ${styles[work.status]}`}>
                    {work.status === 'available' ? '開放收藏' : work.status === 'inquire' ? '洽詢收藏' : '僅展覽'}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}

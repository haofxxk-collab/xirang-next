import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllArtworks, getSiteSettings } from '@/lib/queries'
import { urlForSize } from '@/lib/sanity'
import styles from './works.module.css'

export const revalidate = false

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings()
  return {
    title: s.seoWorksTitle,
    description: s.seoWorksDescription,
    openGraph: { title: s.seoWorksTitle, description: s.seoWorksDescription },
    twitter: { title: s.seoWorksTitle, description: s.seoWorksDescription },
  }
}

export default async function WorksPage() {
  const [works, settings] = await Promise.all([getAllArtworks(), getSiteSettings()])

  const fullTitle = settings.worksPageTitleFull.replace('{count}', String(works.length))
  const [fullLine1, fullLine2] = fullTitle.split('，')
  const [emptyLine1, emptyLine2] = settings.worksPageTitleEmpty.split('，')

  return (
    <>
      <section className={styles.header}>
        <div className={styles.bgChar} aria-hidden>{settings.worksPageBgChar}</div>
        <div className={styles.inner}>
          <p className={`reveal ${styles.label}`}>{settings.worksPageLabel}</p>
          <h1 className={`reveal ${styles.title}`}>
            {works.length > 0
              ? <>{fullLine1}，<br /><em>{fullLine2}</em></>
              : <>{emptyLine1}，<br /><em>{emptyLine2}</em></>}
          </h1>
        </div>
      </section>

      <section className={styles.grid}>
        <div className={styles.gridInner}>
          {!works.length && (
            <p style={{ gridColumn: '1/-1', padding: '6rem 0', textAlign: 'center', color: '#6e6860', letterSpacing: '0.1em' }}>
              {settings.worksPageEmpty}
            </p>
          )}
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

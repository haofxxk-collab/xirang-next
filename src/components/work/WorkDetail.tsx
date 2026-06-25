import { PortableText } from 'next-sanity'
import Link from 'next/link'
import Image from 'next/image'
import type { Artwork } from '@/types'
import { urlForSize } from '@/lib/sanity'
import styles from './WorkDetail.module.css'

interface Props { work: Artwork }

export function WorkDetail({ work }: Props) {
  const portraitUrl = work.artist.portrait
    ? urlForSize(work.artist.portrait, 200, 250)
    : 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&q=80&fit=crop&crop=face'

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* specs */}
        <div className={styles.specs}>
          <div className={styles.specGrid}>
            {[
              ['作品名稱', `《${work.title}》`],
              work.year ? ['創作年份', String(work.year)] : null,
              work.medium ? ['媒材技法', work.medium] : null,
              work.dimensions ? ['作品尺寸', work.dimensions] : null,
              work.series ? ['系列', work.series] : null,
              ['收藏狀態', work.status === 'available' ? '開放收藏' : work.status === 'inquire' ? '洽詢收藏' : '僅展覽'],
            ].filter(Boolean).map(([label, value]) => (
              <div key={label} className={styles.specItem}>
                <span className={styles.specLabel}>{label}</span>
                <span className={styles.specVal}>{value}</span>
              </div>
            ))}
          </div>

          <div className={styles.artistCard}>
            <Link href={`/artists/${work.artist.slug.current}`} className={styles.artistInner}>
              <Image src={portraitUrl} alt={work.artist.name} width={64} height={80} className={styles.artistPortrait} />
              <div>
                <p className={styles.artistLabel}>藝術家</p>
                <p className={styles.artistName}>{work.artist.name}</p>
              </div>
            </Link>
          </div>

          {work.status !== 'not-for-sale' && (
            <a
              href={`mailto:collect@xirang.art?subject=洽詢典藏：《${work.title}》—${work.artist.name}`}
              className={styles.inquireBtn}
            >
              {work.status === 'available' ? '洽詢價格' : '洽詢典藏'}
            </a>
          )}
        </div>

        {/* story */}
        <div className={styles.story}>
          <p className={`reveal ${styles.storyLabel}`}>作品故事</p>
          <h2 className={`reveal ${styles.storyTitle}`}>《{work.title}》的誕生</h2>

          {work.story ? (
            <div className={`reveal ${styles.storyBody}`}>
              <PortableText value={work.story} />
            </div>
          ) : work.description ? (
            <p className={`reveal ${styles.storyBody}`}>{work.description}</p>
          ) : null}
        </div>
      </div>
    </section>
  )
}

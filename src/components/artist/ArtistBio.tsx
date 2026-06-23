import Image from 'next/image'
import { PortableText } from 'next-sanity'
import type { Artist } from '@/types'
import { urlForSize } from '@/lib/sanity'
import styles from './ArtistBio.module.css'

interface Props { artist: Artist }

export function ArtistBio({ artist }: Props) {
  const portraitUrl = artist.portrait
    ? urlForSize(artist.portrait, 560, 700)
    : 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=560&q=80&fit=crop&crop=face'

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <div className={styles.stickyWrap}>
            <Image
              src={portraitUrl}
              alt={artist.name}
              width={480}
              height={600}
              className={styles.portrait}
            />
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.head}>
            <p className={`reveal ${styles.label}`}>藝術家生平</p>
            <h2 className={`reveal ${styles.title}`}>{artist.name}的創作之路</h2>
          </div>

          {artist.bio && (
            <div className={`reveal ${styles.bio}`}>
              <PortableText value={artist.bio} />
            </div>
          )}

          {artist.timeline?.length > 0 && (
            <div className={`reveal ${styles.timeline}`}>
              <p className={styles.timelineLabel}>年表</p>
              {artist.timeline.map((event) => (
                <div key={event.year} className={styles.timelineItem}>
                  <span className={styles.timelineYear}>{event.year}</span>
                  <div className={styles.timelineContent}>
                    <p className={styles.timelineTitle}>{event.title}</p>
                    {event.description && (
                      <p className={styles.timelineDesc}>{event.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

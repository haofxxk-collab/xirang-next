import type { Artist } from '@/types'
import styles from './ArtistStatement.module.css'

interface Props { artist: Artist }

export function ArtistStatement({ artist }: Props) {
  if (!artist.quote) return null

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={`reveal ${styles.label}`}>創作自述</p>
        <blockquote className={`reveal ${styles.quote}`}>
          「{artist.quote}」
        </blockquote>
        <p className={`reveal ${styles.attr}`}>
          — {artist.name}{artist.medium?.[0] ? `，${artist.medium[0]}` : ''}
        </p>
      </div>
    </section>
  )
}

import Link from 'next/link'
import type { Artist } from '@/types'
import styles from './ArtistContact.module.css'

interface Props { artist: Artist }

export function ArtistContact({ artist }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.text}>
          <p className={`reveal ${styles.label}`}>洽詢典藏</p>
          <h2 className={`reveal ${styles.title}`}>
            對 {artist.name} 的作品<br />有興趣？
          </h2>
          <p className={`reveal ${styles.body}`}>
            無論是典藏洽詢、委託創作或策展合作，<br />
            歡迎與我們聯絡，我們將代為轉達。
          </p>
        </div>
        <div className={`reveal ${styles.actions}`}>
          <a href={`mailto:collect@xirang.art?subject=洽詢：${artist.name}作品典藏`} className={styles.btnFill}>
            洽詢典藏
          </a>
          <Link href="/artists" className={styles.btnOutline}>
            瀏覽其他藝術家
          </Link>
        </div>
      </div>
    </section>
  )
}

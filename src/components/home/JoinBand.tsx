import Link from 'next/link'
import styles from './JoinBand.module.css'

export function JoinBand() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.text}>
          <p className={`reveal ${styles.label}`}>邀請您加入</p>
          <h2 className={`reveal ${styles.title}`}>
            這裡有一個位置，<br />
            一直為您保留。
          </h2>
          <p className={`reveal ${styles.body}`}>
            無論您深耕水墨、書法、陶藝、油彩、纖維或任何媒材，<br />
            只要您願意，息壤都想為您建一座展館。
          </p>
        </div>
        <div className={`reveal ${styles.ctas}`}>
          <Link href="/apply" className={styles.btnFill}>申請加入息壤</Link>
          <Link href="/about" className={styles.btnOutline}>了解更多</Link>
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'
import styles from './JoinBand.module.css'

interface Props {
  label: string
  title: string
  body: string
  cta1: string
  cta2: string
}

export function JoinBand({ label, title, body, cta1, cta2 }: Props) {
  const [titleLine1, titleLine2] = title.split('\n')
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.text}>
          <p className={`reveal ${styles.label}`}>{label}</p>
          <h2 className={`reveal ${styles.title}`}>
            {titleLine1}<br />
            {titleLine2}
          </h2>
          <p className={`reveal ${styles.body}`}>{body}</p>
        </div>
        <div className={`reveal ${styles.ctas}`}>
          <Link href="/apply" className={styles.btnFill}>{cta1}</Link>
          <Link href="/about" className={styles.btnOutline}>{cta2}</Link>
        </div>
      </div>
    </section>
  )
}

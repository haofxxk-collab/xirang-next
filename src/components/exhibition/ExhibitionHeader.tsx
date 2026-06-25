import styles from './ExhibitionHeader.module.css'

interface Props {
  label: string
  title: string
  body: string
}

export function ExhibitionHeader({ label, title, body }: Props) {
  const [titleLine1, titleLine2] = title.split('\n')
  return (
    <section className={styles.header}>
      <div className={styles.bgChar} aria-hidden>展</div>
      <div className={styles.inner}>
        <p className={`reveal ${styles.label}`}>{label}</p>
        <h1 className={`reveal ${styles.title}`}>
          {titleLine1}<br />{titleLine2}
        </h1>
        <p className={`reveal ${styles.body}`}>{body}</p>
      </div>
    </section>
  )
}

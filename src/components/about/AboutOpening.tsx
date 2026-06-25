import styles from './AboutOpening.module.css'

const FALLBACK_BG = 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&q=90&fit=crop'

interface Props {
  bgUrl: string
  label: string
  title: string
  titleEm: string
}

export function AboutOpening({ bgUrl, label, title, titleEm }: Props) {
  return (
    <section className={styles.opening}>
      <div
        className={styles.bg}
        style={{ backgroundImage: `url('${bgUrl || FALLBACK_BG}')` }}
      />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <p className={`reveal ${styles.label}`}>{label}</p>
        <h1 className={`reveal ${styles.title}`}>
          {title}<br />
          <em>{titleEm}</em>
        </h1>
      </div>
    </section>
  )
}

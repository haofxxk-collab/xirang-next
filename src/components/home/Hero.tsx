import styles from './Hero.module.css'

interface Props {
  artistCount: number
  artworkCount: number
  label: string
  title: string
  body: string
  stat1Label: string
  stat2Label: string
  stat3Val: string
  stat3Label: string
}

export function Hero({ artistCount, artworkCount, label, title, body, stat1Label, stat2Label, stat3Val, stat3Label }: Props) {
  const titleLines = title.split('\n')
  const bodyLines = body.split('\n')

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={`reveal ${styles.label}`}>{label}</p>
          <h1 className={`reveal ${styles.title}`}>
            {titleLines.slice(0, -1).map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
            <em>{titleLines[titleLines.length - 1]}</em>
          </h1>
        </div>
        <div className={styles.right}>
          <p className={`reveal ${styles.body}`}>
            {bodyLines.map((line, i) => (
              <span key={i}>{line}{i < bodyLines.length - 1 && <br />}</span>
            ))}
          </p>
          <div className={`reveal ${styles.stats}`}>
            <div className={styles.stat}>
              <span className={styles.statVal}>{artworkCount}</span>
              <span className={styles.statLabel}>{stat1Label}</span>
            </div>
            <div className={styles.statDiv} />
            <div className={styles.stat}>
              <span className={styles.statVal}>{artistCount}</span>
              <span className={styles.statLabel}>{stat2Label}</span>
            </div>
            <div className={styles.statDiv} />
            <div className={styles.stat}>
              <span className={styles.statVal}>{stat3Val}</span>
              <span className={styles.statLabel}>{stat3Label}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
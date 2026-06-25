import styles from '../artists/loading.module.css'

export default function Loading() {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.skLabel} />
        <div className={styles.skTitle} />
      </div>
      <div className={styles.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={styles.card} style={{ animationDelay: `${i * 0.07}s` }}>
            <div className={styles.cardImg} style={{ aspectRatio: '5/4' }} />
            <div className={styles.cardInfo}>
              <div className={styles.skLine} style={{ width: '50%' }} />
              <div className={styles.skLine} style={{ width: '70%' }} />
              <div className={styles.skLine} style={{ width: '35%', opacity: 0.5 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

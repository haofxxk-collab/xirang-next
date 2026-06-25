import styles from '../artists/loading.module.css'

export default function Loading() {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.skLabel} />
        <div className={styles.skTitle} />
      </div>
      <div style={{ padding: '0 4rem 6rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={styles.card} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={styles.cardImg} style={{ aspectRatio: '16/7' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

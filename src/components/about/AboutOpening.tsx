import styles from './AboutOpening.module.css'

export function AboutOpening() {
  return (
    <section className={styles.opening}>
      <div
        className={styles.bg}
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&q=90&fit=crop')" }}
      />
      <div className={styles.overlay} />
      <div className={styles.content}>
        <p className={`reveal ${styles.label}`}>關於息壤</p>
        <h1 className={`reveal ${styles.title}`}>
          這片土地，<br />
          <em>會自己生長。</em>
        </h1>
      </div>
    </section>
  )
}

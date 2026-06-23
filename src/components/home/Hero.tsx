import styles from './Hero.module.css'

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <p className={`reveal ${styles.label}`}>數位展館</p>
          <h1 className={`reveal ${styles.title}`}>
            深耕數十年<br />
            的創作者，<br />
            <em>值得一座展館。</em>
          </h1>
        </div>
        <div className={styles.right}>
          <p className={`reveal ${styles.body}`}>
            息壤是亞洲資深藝術家的數位家園。<br />
            我們相信，時間是最好的策展人。<br />
            每一位願意在一條路上走三十年、<br />
            五十年的藝術家，都值得被好好看見。
          </p>
          <div className={`reveal ${styles.stats}`}>
            <div className={styles.stat}>
              <span className={styles.statVal}>∞</span>
              <span className={styles.statLabel}>典藏作品</span>
            </div>
            <div className={styles.statDiv} />
            <div className={styles.stat}>
              <span className={styles.statVal}>∞</span>
              <span className={styles.statLabel}>藝術家展館</span>
            </div>
            <div className={styles.statDiv} />
            <div className={styles.stat}>
              <span className={styles.statVal}>20+</span>
              <span className={styles.statLabel}>創作媒材</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

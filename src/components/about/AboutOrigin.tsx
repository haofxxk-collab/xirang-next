import styles from './AboutOrigin.module.css'

export function AboutOrigin() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={`reveal ${styles.left}`}>
          <div className={styles.char} aria-hidden>息</div>
          <p className={styles.label}>名字的由來</p>
          <h2 className={styles.title}>息壤，<br />來自上古神話。</h2>
        </div>
        <div className={`reveal ${styles.right}`}>
          <div className={styles.body}>
            <p>《山海經》記載，鯀盜取帝之息壤以堙洪水——那是一種<strong>會自行生長、永不枯竭的神土</strong>。</p>
            <p>我們以此為名，是因為我們相信：真正好的創作，也像息壤一樣，不需要被大量複製，不需要追逐演算法；它只需要一個地方，讓它安靜地生長，被真正懂得它的人看見。</p>
            <p>息壤，是給亞洲資深藝術家的數位土地。<strong>它會隨著每一位藝術家的加入而自然生長</strong>，沒有上限，不設框架。</p>
          </div>
          <div className={styles.divider} />
          <blockquote className={styles.classical}>
            「鯀竊帝之息壤以堙洪水，不待帝命。」<br />
            <cite>— 《山海經·海內經》</cite>
          </blockquote>
        </div>
      </div>
    </section>
  )
}

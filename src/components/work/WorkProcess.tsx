import styles from './WorkProcess.module.css'

const steps = [
  { num: '一', title: '素材選取', body: '每一件作品從原料開始即是創作的一部分。對媒材的感受，往往是整個創作過程的起點。' },
  { num: '二', title: '意象生成', body: '在動筆或動手之前，藝術家通常需要一段靜默的醞釀期，讓內在的圖像逐漸清晰成形。' },
  { num: '三', title: '完成定稿', body: '創作的完成並非終點，而是作品開始與觀者對話的起點。每一次被看見，都是一次新的詮釋。' },
]

export function WorkProcess() {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <p className={`reveal ${styles.label}`}>創作過程</p>
        <h2 className={`reveal ${styles.title}`}>從靈感到完成</h2>
      </div>
      <div className={styles.steps}>
        {steps.map((s) => (
          <div key={s.num} className={`reveal ${styles.step}`}>
            <span className={styles.stepNum}>{s.num}</span>
            <h3 className={styles.stepTitle}>{s.title}</h3>
            <p className={styles.stepBody}>{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

import styles from './ApplyHero.module.css'

const steps = [
  { num: '一', title: '提交申請', body: '填寫基本資料與創作背景，上傳代表作品圖片' },
  { num: '二', title: '策展訪談', body: '策展人與您進行深度訪談，了解創作脈絡與故事' },
  { num: '三', title: '建立展館', body: '設計團隊量身打造您的專屬數位展館' },
  { num: '四', title: '正式上線', body: '您確認展館內容後，正式對外開放' },
]

export function ApplyHero() {
  return (
    <section className={styles.section}>
      <div className={styles.bgChar} aria-hidden>申</div>
      <div className={styles.inner}>
        <p className={`reveal ${styles.label}`}>藝術家申請</p>
        <h1 className={`reveal ${styles.title}`}>
          讓息壤，<br />
          成為您的<br />
          數位展館。
        </h1>
        <p className={`reveal ${styles.body}`}>
          填寫以下申請表，<br />
          我們的策展團隊將在五個工作天內與您聯絡。
        </p>
        <div className={`reveal ${styles.steps}`}>
          {steps.map((s) => (
            <div key={s.num} className={styles.step}>
              <span className={styles.stepNum}>{s.num}</span>
              <div>
                <p className={styles.stepTitle}>{s.title}</p>
                <p className={styles.stepBody}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

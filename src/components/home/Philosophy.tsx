import styles from './Philosophy.module.css'

const items = [
  {
    char: '時',
    title: '時間是唯一的標準',
    body: '息壤沒有點閱率排行，沒有粉絲數門檻。加入的唯一條件，是在一條路上走過足夠長的時間。',
  },
  {
    char: '深',
    title: '深度，不是廣度',
    body: '我們不追求最多的藝術家，而是追求每一個展館都能呈現創作者最真實、最完整的面貌。',
  },
  {
    char: '美',
    title: '美，是對的事',
    body: '藝術不是商品。息壤的每一個設計決定，都以「這樣呈現美嗎？」為第一判斷標準。',
  },
]

export function Philosophy() {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <p className={`reveal ${styles.label}`}>展館哲學</p>
        <h2 className={`reveal ${styles.title}`}>我們相信的<br />三件事。</h2>
      </div>
      <div className={styles.grid}>
        {items.map((item) => (
          <div key={item.char} className={`reveal ${styles.card}`}>
            <span className={styles.char}>{item.char}</span>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardBody}>{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

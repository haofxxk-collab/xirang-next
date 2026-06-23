import styles from './AboutBelief.module.css'

const beliefs = [
  { icon: '館', title: '展館，不是商場', body: '息壤的每一個頁面，都以「策展」的眼光設計。藝術家是主角，作品是核心，商業只是使命完成後的結果，不是目的。' },
  { icon: '人', title: '人，比數字重要', body: '我們不用追蹤器衡量藝術家的價值，不以點擊率決定曝光順序。每一位藝術家的展館，都值得被認真對待——無論他有多少粉絲。' },
  { icon: '時', title: '時間，是最好的策展人', body: '能在一個領域深耕三十年、四十年、五十年的創作者，本身就是一種稀有性。息壤選擇藝術家的唯一標準，是時間的重量。' },
]

export function AboutBelief() {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <p className={`reveal ${styles.label}`}>我們的信念</p>
        <h2 className={`reveal ${styles.title}`}>三個不妥協的原則</h2>
      </div>
      <div className={styles.grid}>
        {beliefs.map((b) => (
          <div key={b.icon} className={`reveal ${styles.card}`}>
            <span className={styles.icon}>{b.icon}</span>
            <h3 className={styles.cardTitle}>{b.title}</h3>
            <p className={styles.cardBody}>{b.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

import Link from 'next/link'
import styles from './AboutContact.module.css'

const contacts = [
  { label: '電子郵件', val: 'hello@xirang.art', sub: '一般洽詢、媒體合作' },
  { label: '藝術家申請', val: 'artists@xirang.art', sub: '申請加入 · 策展提案' },
  { label: '典藏洽詢', val: 'collect@xirang.art', sub: '作品收藏 · 委託創作' },
  { label: '回覆時間', val: '5 個工作天以內', sub: '週一至週五' },
]

export function AboutContact() {
  return (
    <section className={styles.section}>
      <div className={styles.left}>
        <p className={`reveal ${styles.label}`}>聯絡息壤</p>
        <h2 className={`reveal ${styles.title}`}>有話想說，<br />我們在這裡。</h2>
        <p className={`reveal ${styles.body}`}>
          無論是藝術家申請、策展提案、<br />
          媒體採訪、企業合作，<br />
          或只是單純想聊聊，<br />
          都歡迎與我們聯絡。
        </p>
        <div className={`reveal ${styles.btns}`}>
          <Link href="/apply" className={styles.btnFill}>藝術家申請加入</Link>
          <a href="mailto:hello@xirang.art" className={styles.btnOutline}>一般洽詢</a>
        </div>
      </div>
      <div className={`reveal ${styles.right}`}>
        {contacts.map((c) => (
          <div key={c.label} className={styles.item}>
            <p className={styles.itemLabel}>{c.label}</p>
            <p className={styles.itemVal}>{c.val}</p>
            <p className={styles.itemSub}>{c.sub}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

import styles from './ApplyFAQ.module.css'

const faqs = [
  { q: '需要有知名度或得過獎才能申請嗎？', a: '不需要。息壤的選擇標準只有一個：時間的重量。我們在乎的是藝術家在創作上投入了多少歲月，而不是有多少曝光或獎項。' },
  { q: '申請費用是多少？', a: '申請本身完全免費。展館建立後的服務費用，策展人會在訪談階段詳細說明，沒有隱藏費用。' },
  { q: '我可以替已過世的家人申請嗎？', a: '可以。家屬代為申請是息壤非常重視的申請類型。許多珍貴的創作因為藝術家年邁或離世而逐漸消失，息壤希望協助保存這些遺產。' },
  { q: '從申請到展館上線，需要多久？', a: '從申請審核、策展訪談、設計建館到最終上線，通常需要六至十週。每一個展館都是量身打造，我們不趕工。' },
  { q: '作品一定要賣嗎？', a: '完全不強制。您可以選擇「僅展覽」、「洽詢收藏」或「開放購買」，由藝術家自行決定。' },
  { q: '如果申請沒有通過，會有說明嗎？', a: '會。我們會以電子郵件說明原因，並歡迎您在六個月後重新申請。' },
]

export function ApplyFAQ() {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <p className={`reveal ${styles.label}`}>常見問題</p>
        <h2 className={`reveal ${styles.title}`}>申請前，<br />您可能想知道</h2>
      </div>
      <div className={styles.grid}>
        {faqs.map((f, i) => (
          <div key={i} className={`reveal ${styles.item}`} style={{ transitionDelay: `${i * 60}ms` }}>
            <h3 className={styles.q}>{f.q}</h3>
            <p className={styles.a}>{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

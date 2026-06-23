import styles from './AboutDifference.module.css'

const rows = [
  ['定位', '作品銷售市集', '策展級數位展館'],
  ['藝術家呈現', '商品列表頁', '專屬個人展館，完整敘事'],
  ['作品數量限制', '依方案收費', '無上限典藏'],
  ['策展服務', '無，自行上傳', '策展人深度訪談與建館'],
  ['目標族群', '所有創作者', '深耕二十年以上的亞洲藝術家'],
  ['設計哲學', '轉換率優先', '藝術體驗優先'],
]

export function AboutDifference() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <p className={`reveal ${styles.label}`}>息壤的不同</p>
          <h2 className={`reveal ${styles.title}`}>為什麼不是<br />其他平台？</h2>
        </div>
        <table className={`reveal ${styles.table}`}>
          <thead>
            <tr>
              <th className={styles.thAspect}>面向</th>
              <th className={styles.thOther}>一般藝術電商平台</th>
              <th className={styles.thUs}>息壤</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([aspect, other, us]) => (
              <tr key={aspect} className={styles.row}>
                <td className={styles.tdAspect}>{aspect}</td>
                <td className={styles.tdOther}>{other}</td>
                <td className={styles.tdUs}><span className={styles.check}>✦</span>{us}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

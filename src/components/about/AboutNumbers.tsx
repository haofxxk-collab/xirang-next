import styles from './AboutNumbers.module.css'

const nums = [
  { val: '∞', label: '可入駐藝術家' },
  { val: '20+', label: '支援創作媒材' },
  { val: '30yr', label: '藝術家最低資歷' },
  { val: '100%', label: '策展人工建館' },
]

export function AboutNumbers() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {nums.map((n, i) => (
          <div key={n.label} className={`reveal ${styles.card}`} style={{ transitionDelay: `${i * 100}ms` }}>
            <p className={styles.val}>{n.val}</p>
            <p className={styles.label}>{n.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

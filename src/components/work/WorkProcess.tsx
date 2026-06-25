import styles from './WorkProcess.module.css'

interface Props {
  label: string
  title: string
  step1Title: string
  step1Body: string
  step2Title: string
  step2Body: string
  step3Title: string
  step3Body: string
}

export function WorkProcess({ label, title, step1Title, step1Body, step2Title, step2Body, step3Title, step3Body }: Props) {
  const steps = [
    { num: '一', title: step1Title, body: step1Body },
    { num: '二', title: step2Title, body: step2Body },
    { num: '三', title: step3Title, body: step3Body },
  ]

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <p className={`reveal ${styles.label}`}>{label}</p>
        <h2 className={`reveal ${styles.title}`}>{title}</h2>
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

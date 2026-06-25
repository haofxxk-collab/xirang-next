import styles from './Philosophy.module.css'

interface Props {
  label: string
  title: string
  card1Char: string; card1Title: string; card1Body: string
  card2Char: string; card2Title: string; card2Body: string
  card3Char: string; card3Title: string; card3Body: string
}

export function Philosophy({ label, title, card1Char, card1Title, card1Body, card2Char, card2Title, card2Body, card3Char, card3Title, card3Body }: Props) {
  const [titleLine1, titleLine2] = title.split('\n')
  const items = [
    { char: card1Char, title: card1Title, body: card1Body },
    { char: card2Char, title: card2Title, body: card2Body },
    { char: card3Char, title: card3Title, body: card3Body },
  ]
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <p className={`reveal ${styles.label}`}>{label}</p>
        <h2 className={`reveal ${styles.title}`}>{titleLine1}<br />{titleLine2}</h2>
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

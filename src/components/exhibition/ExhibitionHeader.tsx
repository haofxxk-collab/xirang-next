import styles from './ExhibitionHeader.module.css'

export function ExhibitionHeader() {
  return (
    <section className={styles.header}>
      <div className={styles.bgChar} aria-hidden>展</div>
      <div className={styles.inner}>
        <p className={`reveal ${styles.label}`}>策展</p>
        <h1 className={`reveal ${styles.title}`}>
          每一檔展覽，<br />
          都是一次深呼吸。
        </h1>
        <p className={`reveal ${styles.body}`}>
          息壤的每一個策展，都從藝術家的故事出發。<br />
          不是為了展而展，而是為了讓人真正感受到。
        </p>
      </div>
    </section>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import styles from './not-found.module.css'

export default function NotFound() {
  return (
    <section className={styles.section}>
      <Image src="/logo.png" alt="息壤" width={90} height={132} className={styles.logo} />
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>這個頁面，<br />暫時找不到了。</h1>
      <p className={styles.body}>也許它像霧一樣散去，也許只是走錯了路。</p>
      <Link href="/" className={styles.back}>返回展館首頁</Link>
    </section>
  )
}

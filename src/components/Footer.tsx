import Link from 'next/link'
import Image from 'next/image'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>
        <Image src="/logo.webp" alt="息壤" width={34} height={34} />
        <span className={styles.logoText}>息壤</span>
      </div>

      <ul className={styles.links}>
        <li><Link href="/">展館首頁</Link></li>
        <li><Link href="/exhibitions">策展</Link></li>
        <li><Link href="/artists">藝術家</Link></li>
        <li><Link href="/about">關於</Link></li>
        <li><Link href="/apply">申請加入</Link></li>
      </ul>

      <p className={styles.copy}>© {new Date().getFullYear()} 息壤 Xirang. All rights reserved.</p>
    </footer>
  )
}

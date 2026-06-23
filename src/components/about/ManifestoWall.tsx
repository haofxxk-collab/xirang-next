'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './ManifestoWall.module.css'

const lines = [
  { text: '我們不相信', dim: true },
  { text: '藝術家需要爆紅。', dim: false },
  { text: '我們相信，', dim: true },
  { text: '藝術家需要被好好看見。', dim: false },
  { text: '不是快，', dim: true },
  { text: '而是深。', dim: false },
  { text: '不是多，', dim: true },
  { text: '而是對的人。', dim: false, accent: true },
]

export function ManifestoWall() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.querySelectorAll<HTMLElement>('[data-line]').forEach((line, i) => {
          setTimeout(() => line.classList.add(styles.in), i * 280)
        })
        const seal = el.querySelector<HTMLElement>(`.${styles.seal}`)
        if (seal) setTimeout(() => seal.classList.add(styles.sealIn), lines.length * 280 + 400)
        io.disconnect()
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.lines}>
        {lines.map((l, i) => (
          <p
            key={i}
            data-line
            className={[styles.line, l.dim ? styles.dim : '', l.accent ? styles.accent : ''].join(' ')}
          >
            {l.text}
          </p>
        ))}
      </div>
      <div className={styles.seal}>
        <Image src="/logo.webp" alt="息壤" width={100} height={100} />
      </div>
    </section>
  )
}

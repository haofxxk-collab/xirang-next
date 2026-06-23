'use client'

import { useEffect, useRef } from 'react'
import styles from './Manifesto.module.css'

const lines = [
  { text: '真正的創作，', dim: true },
  { text: '不需要爆紅。', dim: false },
  { text: '它只需要', dim: true },
  { text: '被對的人看見。', dim: false },
  { text: '慢，', dim: true },
  { text: '才是最深的抵達。', dim: false, accent: true },
]

export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.querySelectorAll<HTMLElement>('[data-line]').forEach((line, i) => {
          setTimeout(() => line.classList.add(styles.in), i * 260)
        })
        io.disconnect()
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section className={styles.manifesto} ref={sectionRef}>
      <div className={styles.lines}>
        {lines.map((l, i) => (
          <p
            key={i}
            data-line
            className={[
              styles.line,
              l.dim ? styles.dim : '',
              l.accent ? styles.accent : '',
            ].join(' ')}
          >
            {l.text}
          </p>
        ))}
      </div>
      <div className={`${styles.divider} reveal`} />
      <p className={`${styles.sub} reveal`}>
        息壤，亞洲資深藝術家的數位展館
      </p>
    </section>
  )
}

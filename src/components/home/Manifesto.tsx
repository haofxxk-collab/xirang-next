'use client'

import { useEffect, useRef } from 'react'
import styles from './Manifesto.module.css'

interface Props {
  line1: string; line2: string; line3: string
  line4: string; line5: string; line6: string
  sub: string
}

export function Manifesto({ line1, line2, line3, line4, line5, line6, sub }: Props) {
  const lines = [
    { text: line1, dim: true },
    { text: line2, dim: false },
    { text: line3, dim: true },
    { text: line4, dim: false },
    { text: line5, dim: true },
    { text: line6, dim: false, accent: true },
  ]
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
      <p className={`${styles.sub} reveal`}>{sub}</p>
    </section>
  )
}

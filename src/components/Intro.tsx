'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './Intro.module.css'

export function Intro() {
  const introRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    /* ── Rain canvas ── */
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const c = canvas  // stable non-null ref for closure
    const x = ctx     // stable non-null ref for closure
    let raf = 0
    let rainAlpha = 0

    const resize = () => {
      c.width = window.innerWidth
      c.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const drops = Array.from({ length: 180 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      len: Math.random() * 18 + 6,
      spd: Math.random() * 1.2 + 0.5,
    }))

    function draw() {
      raf = requestAnimationFrame(draw)
      x.clearRect(0, 0, c.width, c.height)
      if (rainAlpha <= 0) return
      x.strokeStyle = `rgba(200,196,188,${rainAlpha})`
      x.lineWidth = 0.35
      drops.forEach((d) => {
        d.y += d.spd
        d.x += 0.2
        if (d.y > c.height) { d.y = -d.len; d.x = Math.random() * c.width }
        x.beginPath()
        x.moveTo(d.x, d.y)
        x.lineTo(d.x + d.len * 0.18, d.y + d.len)
        x.stroke()
      })
    }
    draw()

    /* ── GSAP timeline ── */
    import('gsap').then(({ gsap }) => {
      const tl = gsap.timeline()
      const intro = introRef.current!

      tl.to('#intro-bg', { opacity: 1, scale: 1, duration: 3.5, ease: 'power2.out' }, 0)
      tl.to('#intro-mb1,#intro-mb2,#intro-mb3,#intro-mb4', { opacity: 1, stagger: 0.6, duration: 2, ease: 'power1.inOut' }, 0.8)

      tl.to({}, {
        duration: 1,
        onStart: () => { rainAlpha = 0 },
        onUpdate: function () { rainAlpha = Math.min(this.progress() * 0.09, 0.09) },
      }, 1.5)

      tl.to('#intro-seal', { opacity: 1, scale: 1, duration: 3, ease: 'power2.out' }, 2.5)
      tl.fromTo('.q-line', { opacity: 0, y: 14 }, { opacity: 1, y: 0, stagger: 0.5, duration: 1.4, ease: 'power2.out' }, 4)
      tl.to('.q-divider', { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 5.5)
      tl.to('.q-enter', { opacity: 1, duration: 1, ease: 'power2.out' }, 6.2)

      tl.to(intro, {
        opacity: 0, pointerEvents: 'none',
        duration: 1.2, ease: 'power2.inOut',
        delay: 1.5,
        onComplete: () => { intro.style.display = 'none' },
      }, 8)
    })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div id="intro" ref={introRef} className={styles.intro}>
      <div
        id="intro-bg"
        className={styles.bg}
      />
      <div id="intro-mb1" className={`${styles.mb} ${styles.mb1}`} />
      <div id="intro-mb2" className={`${styles.mb} ${styles.mb2}`} />
      <div id="intro-mb3" className={`${styles.mb} ${styles.mb3}`} />
      <div id="intro-mb4" className={`${styles.mb} ${styles.mb4}`} />
      <canvas id="rain-canvas" ref={canvasRef} className={styles.rain} />

      <div className={styles.content}>
        <div className={styles.seal}>
          <Image
            id="intro-seal"
            src="/logo.webp"
            alt="息壤"
            width={130}
            height={130}
            className={styles.sealImg}
            priority
          />
        </div>
        <div className={styles.quote}>
          <p className={`q-line ${styles.qLine}`}>藝術，不該只有年輕的臉。</p>
          <p className={`q-line ${styles.qLine} ${styles.qLineEm}`}>深耕數十年的創作者，值得一座展館。</p>
          <div className={`q-divider ${styles.qDivider}`} />
          <a href="#manifesto" className={`q-enter ${styles.qEnter}`}>進入展館</a>
        </div>
      </div>
    </div>
  )
}

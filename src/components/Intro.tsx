'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './Intro.module.css'

const AUTO_DISMISS = 9500   // 按鈕出現(6.8s)後再等約2.7秒自動跳過
const FAST_OUT    = 0.6     // 點擊後加速淡出時間（秒）

export function Intro({
  headline = '藝術，不該只有年輕的臉。',
  subline  = '深耕數十年的創作者，值得一座展館。',
  ctaText  = '進入展館',
}: {
  headline?: string
  subline?: string
  ctaText?: string
} = {}) {
  const introRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    /* ── Rain canvas ── */
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const c = canvas
    const x = ctx
    let raf = 0
    let rainAlpha = 0

    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight }
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
        d.y += d.spd; d.x += 0.2
        if (d.y > c.height) { d.y = -d.len; d.x = Math.random() * c.width }
        x.beginPath(); x.moveTo(d.x, d.y); x.lineTo(d.x + d.len * 0.18, d.y + d.len); x.stroke()
      })
    }
    draw()

    /* ── Dismiss helper ── */
    function dismiss(fast: boolean) {
      const intro = introRef.current
      if (!intro || intro.style.display === 'none') return
      import('gsap').then(({ gsap }) => {
        gsap.to(intro, {
          opacity: 0,
          pointerEvents: 'none',
          duration: fast ? FAST_OUT : 1.2,
          ease: 'power2.inOut',
          onComplete: () => { intro.style.display = 'none' },
        })
      })
    }

    /* ── Auto-dismiss after 5s ── */
    const autoTimer = setTimeout(() => dismiss(false), AUTO_DISMISS)

    /* ── GSAP timeline ── */
    import('gsap').then(({ gsap }) => {
      const tl = gsap.timeline()

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
      tl.add(() => {
        const btn = document.querySelector('.q-enter') as HTMLElement | null
        if (!btn) return
        btn.setAttribute('data-drawn', '')
        const L = btn.querySelector('[data-side="L"]') as HTMLElement | null
        const R = btn.querySelector('[data-side="R"]') as HTMLElement | null
        if (L) L.style.height = '100%'
        if (R) R.style.height = '100%'
      }, 6.8)
    })

    /* ── Click: speed up exit ── */
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (target.closest('.q-enter')) {
        clearTimeout(autoTimer)
        dismiss(true)
      }
    }
    document.addEventListener('click', handleClick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('click', handleClick)
      clearTimeout(autoTimer)
    }
  }, [])

  return (
    <div id="intro" ref={introRef} className={styles.intro}>
      <div id="intro-bg" className={styles.bg} />
      <div className={styles.overlay} />
      <div id="intro-mb1" className={`${styles.mb} ${styles.mb1}`} />
      <div id="intro-mb2" className={`${styles.mb} ${styles.mb2}`} />
      <div id="intro-mb3" className={`${styles.mb} ${styles.mb3}`} />
      <div id="intro-mb4" className={`${styles.mb} ${styles.mb4}`} />
      <div className={styles.fogBottom} />
      <canvas id="rain-canvas" ref={canvasRef} className={styles.rain} />

      <div className={styles.content}>
        <div className={styles.sealWrap}>
          <div className={styles.sealGlow} />
          <Image
            id="intro-seal"
            src="/logo.png"
            alt="息壤"
            width={170}
            height={249}
            className={styles.sealImg}
            priority
          />
        </div>
        <div className={styles.quote}>
          <p className={`q-line ${styles.qLine}`}>{headline}</p>
          <p className={`q-line ${styles.qLine} ${styles.qLineEm}`}>{subline}</p>
          <div className={`q-divider ${styles.qDivider}`} />
          <a href="#" onClick={e => e.preventDefault()} className={`q-enter ${styles.qEnter}`}>
            <span className={styles.qEnterL} data-side="L" />
            <span className={styles.qEnterR} data-side="R" />
            {ctaText}
          </a>
        </div>
      </div>
    </div>
  )
}

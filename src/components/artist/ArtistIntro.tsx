'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './ArtistIntro.module.css'

interface Props {
  name: string
  nameEn?: string
}

export function ArtistIntro({ name, nameEn }: Props) {
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => dismiss(), 10500)
    return () => clearTimeout(t)
  }, [])

  function dismiss() {
    setLeaving(true)
    setTimeout(() => setGone(true), 1000)
  }

  if (gone) return null

  return (
    <div
      className={`${styles.overlay} ${leaving ? styles.leaving : ''}`}
      onClick={dismiss}
    >
      <Image
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85&fit=crop"
        alt=""
        fill
        className={styles.bg}
        priority
        unoptimized
      />
      <div className={styles.bgGrad} />
      <div className={styles.grain} />

      <div className={styles.content}>
        <p className={styles.xirang}>息　壤</p>
        <p className={styles.museum}>
          <span className={styles.goldLine} />
          數位展館
        </p>
        <p className={styles.present}>呈　獻</p>
        <h1 className={styles.name}>{name}</h1>
        {nameEn && <p className={styles.nameEn}>{nameEn.toUpperCase()}</p>}
      </div>

      <p className={styles.skipHint}>點擊跳過</p>
    </div>
  )
}

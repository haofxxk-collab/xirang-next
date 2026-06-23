'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Artwork } from '@/types'
import { urlForSize } from '@/lib/sanity'
import styles from './WorkViewer.module.css'

interface Props { work: Artwork }

export function WorkViewer({ work }: Props) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const images = work.images ?? []
  const activeImg = images[activeIdx]
  const activeUrl = activeImg
    ? urlForSize(activeImg, 1400, 1000)
    : 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=1400&q=85&fit=crop'

  return (
    <>
      <section className={styles.viewer}>
        <div className={styles.gradTop} />
        <div className={styles.gradBottom} />
        <div className={styles.gradLeft} />
        <div className={styles.gradRight} />

        <div className={styles.imgWrap} onClick={() => setModalOpen(true)} role="button" tabIndex={0} aria-label="放大檢視">
          <Image
            src={activeUrl}
            alt={work.title}
            fill
            className={styles.img}
            priority
            sizes="100vw"
          />
        </div>

        <div className={styles.overlay}>
          <nav className={styles.breadcrumb}>
            <Link href="/">展館</Link>
            <span>/</span>
            <Link href={`/artists/${work.artist.slug.current}`}>{work.artist.name}</Link>
            <span>/</span>
            <span>《{work.title}》</span>
          </nav>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>《{work.title}》</h1>
            <p className={styles.meta}>{work.year} · {work.medium}</p>
          </div>
          <button className={styles.zoomBtn} onClick={() => setModalOpen(true)}>
            ⊕ 放大檢視
          </button>
        </div>

        {images.length > 1 && (
          <div className={styles.thumbs}>
            {images.map((img, i) => (
              <button
                key={i}
                className={`${styles.thumb} ${i === activeIdx ? styles.thumbActive : ''}`}
                onClick={() => setActiveIdx(i)}
              >
                <Image
                  src={urlForSize(img, 120, 90)}
                  alt={`圖 ${i + 1}`}
                  fill
                  className={styles.thumbImg}
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {modalOpen && (
        <div className={styles.modal} onClick={() => setModalOpen(false)}>
          <button className={styles.modalClose} aria-label="關閉">✕</button>
          <div className={styles.modalImgWrap}>
            <Image src={activeUrl} alt={work.title} fill className={styles.modalImg} />
          </div>
        </div>
      )}
    </>
  )
}

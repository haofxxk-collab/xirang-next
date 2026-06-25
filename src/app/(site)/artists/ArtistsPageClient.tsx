'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Artist } from '@/types'
import { urlForSize } from '@/lib/sanity'
import styles from './ArtistsPageClient.module.css'

const MEDIA_FILTERS = [
  { label: '全部', value: 'all' },
  { label: '水墨', value: '水墨' },
  { label: '書法', value: '書法' },
  { label: '油彩', value: '油彩' },
  { label: '雕刻', value: '雕刻' },
  { label: '纖維', value: '纖維' },
  { label: '陶藝', value: '陶藝' },
]

interface Props {
  artists: Artist[]
  featured: Artist | null
  label: string
  body: string
  featuredLabel: string
  featuredCta: string
}

export function ArtistsPageClient({ artists, featured, label, body, featuredLabel, featuredCta }: Props) {
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const filtered = filter === 'all'
    ? artists
    : artists.filter((a) => a.medium?.some((m) => m.includes(filter)))

  const featuredPortrait = featured?.portrait
    ? urlForSize(featured.portrait, 800, 1000)
    : 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=800&q=80&fit=crop&crop=face'

  return (
    <>
      {/* PAGE HEADER */}
      <section className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <p className={`reveal ${styles.label}`}>{label}</p>
            <h1 className={`reveal ${styles.headerTitle}`}>
              <span className={styles.inf}>{artists.length}</span><br />位藝術家
            </h1>
          </div>
          <p className={`reveal ${styles.headerBody}`}>
            {body.split('\n').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </p>
        </div>
      </section>

      {/* FEATURED */}
      {featured && (
        <section className={styles.featured}>
          <div className={styles.featuredInner}>
            <div className={`reveal ${styles.featuredImg}`}>
              <Image
                src={featuredPortrait}
                alt={featured.name}
                fill
                className={styles.featuredPortrait}
                sizes="40vw"
              />
            </div>
            <div className={styles.featuredInfo}>
              <p className={`reveal ${styles.featuredLabel}`}>{featuredLabel}</p>
              <h2 className={`reveal ${styles.featuredName}`}>{featured.name}</h2>
              {featured.nameEn && <p className={`reveal ${styles.featuredNameEn}`}>{featured.nameEn}</p>}
              <div className={`reveal ${styles.featuredTags}`}>
                {featured.medium?.map((m) => <span key={m} className={styles.tag}>{m}</span>)}
              </div>
              {featured.quote && (
                <blockquote className={`reveal ${styles.featuredQuote}`}>「{featured.quote}」</blockquote>
              )}
              <Link href={`/artists/${featured.slug.current}`} className={`reveal ${styles.featuredCta}`}>
                {featuredCta}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FILTER + TOGGLE */}
      <section className={styles.filterBar}>
        <div className={styles.filterInner}>
          <div className={styles.filters}>
            {MEDIA_FILTERS.map((f) => (
              <button
                key={f.value}
                className={`${styles.filterBtn} ${filter === f.value ? styles.filterActive : ''}`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${view === 'grid' ? styles.viewActive : ''}`}
              onClick={() => setView('grid')}
            >⊞ 格</button>
            <button
              className={`${styles.viewBtn} ${view === 'list' ? styles.viewActive : ''}`}
              onClick={() => setView('list')}
            >≡ 列</button>
          </div>
        </div>
      </section>

      {/* GRID VIEW */}
      {view === 'grid' && (
        <section className={styles.gridSection}>
          <div className={styles.grid}>
            {filtered.map((artist, i) => {
              const imgUrl = artist.portrait
                ? urlForSize(artist.portrait, 600, 750)
                : 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=600&q=80&fit=crop&crop=face'

              return (
                <Link
                  key={artist._id}
                  href={`/artists/${artist.slug.current}`}
                  className={styles.card}
                >
                  <div className={styles.cardImg}>
                    <Image src={imgUrl} alt={artist.name} fill
                      sizes="(max-width:900px) 50vw, 25vw"
                      className={styles.cardPortrait}
                    />
                    <div className={styles.cardOverlay} />
                  </div>
                  <div className={styles.cardInfo}>
                    <p className={styles.cardMedium}>{artist.medium?.join(' · ')}</p>
                    <p className={styles.cardName}>{artist.name}</p>
                    <p className={styles.cardYears}>{artist.yearsActive}年</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* LIST VIEW */}
      {view === 'list' && (
        <section className={styles.listSection}>
          {filtered.map((artist, i) => {
            const imgUrl = artist.portrait
              ? urlForSize(artist.portrait, 200, 240)
              : 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&q=80&fit=crop&crop=face'

            return (
              <Link
                key={artist._id}
                href={`/artists/${artist.slug.current}`}
                className={styles.listRow}
              >
                <span className={styles.listNum}>{String(artist.index ?? i + 1).padStart(2, '0')}</span>
                <div className={styles.listPortrait}>
                  <Image src={imgUrl} alt={artist.name} fill className={styles.listPortraitImg} />
                </div>
                <span className={styles.listName}>{artist.name}</span>
                <span className={styles.listMedium}>{artist.medium?.join(' · ')}</span>
                <span className={styles.listYears}>{artist.yearsActive}年</span>
                <span className={styles.listLocation}>{artist.location}</span>
                <span className={styles.listArrow}>→</span>
              </Link>
            )
          })}
        </section>
      )}
    </>
  )
}

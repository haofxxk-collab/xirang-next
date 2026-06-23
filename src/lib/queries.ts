import { client } from './sanity'
import type { Artist, Artwork, Exhibition } from '@/types'

const isConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'placeholder'
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function safeFetch<T>(query: string, params?: any, fallback?: T): Promise<T> {
  const empty = fallback !== undefined ? fallback : ([] as unknown as T)
  if (!isConfigured) return empty
  try {
    return params
      ? await client.fetch<T>(query, params)
      : await client.fetch<T>(query)
  } catch {
    return empty
  }
}

// ── ARTISTS ──────────────────────────────────────
export async function getAllArtists(): Promise<Artist[]> {
  return safeFetch(`
    *[_type == "artist"] | order(index asc) {
      _id, slug, name, nameEn, index, medium, yearsActive,
      birthYear, location, quote, featured,
      portrait, heroImage
    }
  `)
}

export async function getFeaturedArtist(): Promise<Artist | null> {
  return safeFetch(`
    *[_type == "artist" && featured == true][0] {
      _id, slug, name, nameEn, index, medium, yearsActive,
      quote, portrait, heroImage
    }
  `, {}, null)
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  return safeFetch(`
    *[_type == "artist" && slug.current == $slug][0] {
      _id, slug, name, nameEn, index, medium, yearsActive,
      birthYear, location, bio, quote, portrait, heroImage,
      timeline,
      "works": *[_type == "artwork" && references(^._id)] | order(year desc) {
        _id, slug, title, year, medium, dimensions, status,
        "images": images[0..2]
      }
    }
  `, { slug }, null)
}

// ── ARTWORKS ─────────────────────────────────────
export async function getAllArtworks(): Promise<Artwork[]> {
  return safeFetch(`
    *[_type == "artwork"] | order(year desc) {
      _id, slug, title, year, medium, dimensions, series, status,
      "images": images[0],
      "artist": artist-> { _id, name, slug, portrait }
    }
  `)
}

export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  return safeFetch(`
    *[_type == "artwork" && slug.current == $slug][0] {
      _id, slug, title, year, medium, dimensions, series,
      status, price, description, story, images,
      "artist": artist-> { _id, name, slug, portrait, yearsActive, medium },
      "relatedWorks": *[_type == "artwork" && artist._ref == ^.artist._ref && slug.current != $slug][0..2] {
        _id, slug, title, year, medium, "images": images[0]
      }
    }
  `, { slug }, null)
}

// ── EXHIBITIONS ───────────────────────────────────
export async function getAllExhibitions(): Promise<Exhibition[]> {
  return safeFetch(`
    *[_type == "exhibition"] | order(startDate desc) {
      _id, slug, title, titleEn, type, status,
      startDate, endDate, coverImage, description,
      "artists": artists[]-> { _id, name, slug, portrait, medium }
    }
  `)
}

export async function getCurrentExhibition(): Promise<Exhibition | null> {
  return safeFetch(`
    *[_type == "exhibition" && status == "current"][0] {
      _id, slug, title, titleEn, type, status,
      startDate, endDate, coverImage, description, curatorNote,
      "artists": artists[]-> { _id, name, slug, portrait, medium },
      "works": works[]-> { _id, title, "images": images[0] }
    }
  `, {}, null)
}

export async function getExhibitionBySlug(slug: string): Promise<Exhibition | null> {
  return safeFetch(`
    *[_type == "exhibition" && slug.current == $slug][0] {
      _id, slug, title, titleEn, type, status,
      startDate, endDate, coverImage, description, curatorNote,
      "artists": artists[]-> { _id, name, slug, portrait, medium, yearsActive },
      "works": works[]-> { _id, slug, title, year, medium, images }
    }
  `, { slug }, null)
}

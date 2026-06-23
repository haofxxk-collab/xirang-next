// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PortableTextBlocks = any[]

export interface Artist {
  _id: string
  slug: { current: string }
  name: string
  nameEn: string
  index: number
  medium: string[]
  yearsActive: number
  birthYear: number
  location: string
  bio: PortableTextBlocks
  quote: string
  portrait: SanityImage
  heroImage: SanityImage
  featured: boolean
  works: Artwork[]
  exhibitions: Exhibition[]
  timeline: TimelineEvent[]
}

export interface Artwork {
  _id: string
  slug: { current: string }
  title: string
  year: number
  medium: string
  dimensions: string
  series?: string
  status: 'available' | 'inquire' | 'not-for-sale'
  price?: number
  description: string
  story: PortableTextBlocks
  images: SanityImage[]
  artist: Pick<Artist, '_id' | 'name' | 'slug' | 'portrait'>
  relatedWorks?: Artwork[]
}

export interface Exhibition {
  _id: string
  slug: { current: string }
  title: string
  titleEn: string
  type: 'solo' | 'group' | 'duo' | 'annual' | 'opening'
  status: 'current' | 'upcoming' | 'past'
  startDate: string
  endDate: string
  coverImage: SanityImage
  description: string
  curatorNote: string
  artists: Pick<Artist, '_id' | 'name' | 'slug' | 'portrait' | 'medium'>[]
  works: Pick<Artwork, '_id' | 'title' | 'images'>[]
}

export interface TimelineEvent {
  year: number
  title: string
  description: string
}

export interface SanityImage {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
  alt?: string
  caption?: string
}

export interface Application {
  name: string
  nameEn?: string
  email: string
  phone?: string
  region: string
  applicantType: 'artist' | 'family' | 'agent' | 'recommendation'
  media: string[]
  yearsActive: string
  workCount?: string
  bio: string
  exhibitions?: string
  referral?: string
  portfolioUrl?: string
  notes?: string
  agreedToTerms: boolean
}

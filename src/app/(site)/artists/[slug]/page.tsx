import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArtistBySlug, getAllArtists, getSiteSettings } from '@/lib/queries'
import { urlForSize } from '@/lib/sanity'
import { ArtistHero } from '@/components/artist/ArtistHero'
import { ArtistStatement } from '@/components/artist/ArtistStatement'
import { ArtistBio } from '@/components/artist/ArtistBio'
import { ArtistWorks } from '@/components/artist/ArtistWorks'
import { ArtistContact } from '@/components/artist/ArtistContact'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const artists = await getAllArtists()
  return artists.map((a) => ({ slug: a.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [artist, settings] = await Promise.all([getArtistBySlug(params.slug), getSiteSettings()])
  if (!artist) return {}
  const desc = [artist.name, artist.medium?.join('、'), artist.yearsActive ? `創作逾${artist.yearsActive}年` : '', artist.quote].filter(Boolean).join('。')
  const ogImg = artist.portrait ? urlForSize(artist.portrait, 1200, 630) : settings.ogImage
  const images = ogImg ? [{ url: ogImg, width: 1200, height: 630, alt: artist.name }] : []
  return {
    title: artist.name,
    description: desc,
    openGraph: { title: `${artist.name} — ${settings.siteTitle}`, description: desc, images },
    twitter: { title: `${artist.name} — ${settings.siteTitle}`, description: desc, images },
  }
}

export const revalidate = false

export default async function ArtistPage({ params }: Props) {
  const artist = await getArtistBySlug(params.slug)
  if (!artist) notFound()

  return (
    <>
      <ArtistHero artist={artist} />
      <ArtistStatement artist={artist} />
      <ArtistBio artist={artist} />
      <ArtistWorks works={artist.works} />
      <ArtistContact artist={artist} />
    </>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArtistBySlug, getAllArtists } from '@/lib/queries'
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
  const artist = await getArtistBySlug(params.slug)
  if (!artist) return {}
  return {
    title: artist.name,
    description: `${artist.name}，${artist.medium.join('、')}，創作逾${artist.yearsActive}年。${artist.quote}`,
    openGraph: { title: `${artist.name} — 息壤數位展館` },
  }
}

export const revalidate = 3600

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

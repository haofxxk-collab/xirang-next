import type { Metadata } from 'next'
import { getAllArtists, getFeaturedArtist } from '@/lib/queries'
import { ArtistsPageClient } from './ArtistsPageClient'

export const metadata: Metadata = {
  title: '藝術家',
  description: '探索息壤館內所有藝術家，每一位都是一段值得被看見的故事。',
}

export const revalidate = 3600

export default async function ArtistsPage() {
  const [artists, featured] = await Promise.all([
    getAllArtists(),
    getFeaturedArtist(),
  ])

  return <ArtistsPageClient artists={artists} featured={featured} />
}

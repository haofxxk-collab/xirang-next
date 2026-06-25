import type { Metadata } from 'next'
import { getAllArtists, getFeaturedArtist, getSiteSettings } from '@/lib/queries'
import { ArtistsPageClient } from './ArtistsPageClient'

export const revalidate = false

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings()
  return {
    title: s.seoArtistsTitle,
    description: s.seoArtistsDescription,
    openGraph: { title: s.seoArtistsTitle, description: s.seoArtistsDescription },
    twitter: { title: s.seoArtistsTitle, description: s.seoArtistsDescription },
  }
}

export default async function ArtistsPage() {
  const [artists, featured, settings] = await Promise.all([
    getAllArtists(),
    getFeaturedArtist(),
    getSiteSettings(),
  ])

  return (
    <ArtistsPageClient
      artists={artists}
      featured={featured}
      label={settings.artistsPageLabel}
      body={settings.artistsPageBody}
      featuredLabel={settings.artistsFeaturedLabel}
      featuredCta={settings.artistsFeaturedCta}
    />
  )
}

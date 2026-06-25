import type { Metadata } from 'next'
import { getAllExhibitions, getCurrentExhibition, getSiteSettings } from '@/lib/queries'
import { ExhibitionHeader } from '@/components/exhibition/ExhibitionHeader'
import { CurrentExhibition } from '@/components/exhibition/CurrentExhibition'
import { PastExhibitions } from '@/components/exhibition/PastExhibitions'

export const revalidate = false

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings()
  return {
    title: s.seoExhibitionsTitle,
    description: s.seoExhibitionsDescription,
    openGraph: { title: s.seoExhibitionsTitle, description: s.seoExhibitionsDescription },
    twitter: { title: s.seoExhibitionsTitle, description: s.seoExhibitionsDescription },
  }
}

export default async function ExhibitionsPage() {
  const [all, current, settings] = await Promise.all([
    getAllExhibitions(),
    getCurrentExhibition(),
    getSiteSettings(),
  ])

  const past = all.filter((e) => e.status === 'past')
  const upcoming = all.filter((e) => e.status === 'upcoming')

  return (
    <>
      <ExhibitionHeader
        label={settings.exhibitionsLabel}
        title={settings.exhibitionsTitle}
        body={settings.exhibitionsBody}
      />
      <CurrentExhibition
        exhibition={current}
        currentLabel={settings.exhibitionCurrentLabel}
        artistsLabel={settings.exhibitionArtistsLabel}
        cta={settings.exhibitionCta}
        emptyTitle={settings.exhibitionEmptyTitle}
        emptyBody={settings.exhibitionEmptyBody}
      />
      <PastExhibitions
        exhibitions={past}
        upcoming={upcoming}
        pastLabel={settings.exhibitionPastLabel}
        pastTitle={settings.exhibitionPastTitle}
        upcomingLabel={settings.exhibitionUpcomingLabel}
        upcomingTitle={settings.exhibitionUpcomingTitle}
        emptyMsg={settings.exhibitionEmptyRecordMsg}
      />
    </>
  )
}

import type { Metadata } from 'next'
import { Intro } from '@/components/Intro'
import { Hero } from '@/components/home/Hero'
import { Manifesto } from '@/components/home/Manifesto'
import { ExhibitionPreview } from '@/components/home/ExhibitionPreview'
import { ArtistsPreview } from '@/components/home/ArtistsPreview'
import { WorksScroll } from '@/components/home/WorksScroll'
import { Philosophy } from '@/components/home/Philosophy'
import { JoinBand } from '@/components/home/JoinBand'
import { getCurrentExhibition, getAllArtists, getAllArtworks, getSiteSettings } from '@/lib/queries'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings()
  return {
    title: s.seoHomeTitle,
    description: s.seoHomeDescription,
    openGraph: { title: s.seoHomeTitle, description: s.seoHomeDescription },
    twitter: { title: s.seoHomeTitle, description: s.seoHomeDescription },
  }
}

export default async function HomePage() {
  const [exhibition, artists, artworks, settings] = await Promise.all([
    getCurrentExhibition(),
    getAllArtists(),
    getAllArtworks(),
    getSiteSettings(),
  ])

  return (
    <>
      <Intro
        headline={settings.introHeadline}
        subline={settings.introSubline}
        ctaText={settings.introCtaText}
      />
      <Hero
        artistCount={artists.length}
        artworkCount={artworks.length}
        label={settings.heroLabel}
        title={settings.heroTitle}
        body={settings.heroBody}
        stat1Label={settings.heroStat1Label}
        stat2Label={settings.heroStat2Label}
        stat3Val={settings.heroStat3Val}
        stat3Label={settings.heroStat3Label}
      />
      <Manifesto
        line1={settings.manifestoLine1}
        line2={settings.manifestoLine2}
        line3={settings.manifestoLine3}
        line4={settings.manifestoLine4}
        line5={settings.manifestoLine5}
        line6={settings.manifestoLine6}
        sub={settings.manifestoSub}
      />
      <ExhibitionPreview
        exhibition={exhibition}
        tag={settings.exhibitionTag}
        cta={settings.exhibitionCta}
        emptyTitle={settings.exhibitionEmptyTitle}
        emptyBody={settings.exhibitionEmptyBody}
      />
      <ArtistsPreview
        artists={artists}
        label={settings.artistsPreviewLabel}
        title={settings.artistsPreviewTitle}
        more={settings.artistsPreviewMore}
      />
      <WorksScroll
        artworks={artworks.slice(0, 8)}
        label={settings.worksScrollLabel}
        title={settings.worksScrollTitle}
        more={settings.worksScrollMore}
      />
      <Philosophy
        label={settings.philosophyLabel}
        title={settings.philosophyTitle}
        card1Char={settings.philosophy1Char}
        card1Title={settings.philosophy1Title}
        card1Body={settings.philosophy1Body}
        card2Char={settings.philosophy2Char}
        card2Title={settings.philosophy2Title}
        card2Body={settings.philosophy2Body}
        card3Char={settings.philosophy3Char}
        card3Title={settings.philosophy3Title}
        card3Body={settings.philosophy3Body}
      />
      <JoinBand
        label={settings.joinLabel}
        title={settings.joinTitle}
        body={settings.joinBody}
        cta1={settings.joinCta1}
        cta2={settings.joinCta2}
      />
    </>
  )
}
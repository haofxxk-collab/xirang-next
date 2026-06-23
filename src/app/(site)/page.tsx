import { Intro } from '@/components/Intro'
import { Hero } from '@/components/home/Hero'
import { Manifesto } from '@/components/home/Manifesto'
import { ExhibitionPreview } from '@/components/home/ExhibitionPreview'
import { ArtistsPreview } from '@/components/home/ArtistsPreview'
import { WorksScroll } from '@/components/home/WorksScroll'
import { Philosophy } from '@/components/home/Philosophy'
import { JoinBand } from '@/components/home/JoinBand'
import { getCurrentExhibition, getAllArtists, getAllArtworks } from '@/lib/queries'

export default async function HomePage() {
  const [exhibition, artists, artworks] = await Promise.all([
    getCurrentExhibition(),
    getAllArtists(),
    getAllArtworks(),
  ])

  return (
    <>
      <Intro />
      <Hero />
      <Manifesto />
      <ExhibitionPreview exhibition={exhibition} />
      <ArtistsPreview artists={artists.slice(0, 6)} />
      <WorksScroll artworks={artworks.slice(0, 8)} />
      <Philosophy />
      <JoinBand />
    </>
  )
}

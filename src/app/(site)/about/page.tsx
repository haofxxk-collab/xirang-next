import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/queries'
import { AboutOpening } from '@/components/about/AboutOpening'
import { AboutOrigin } from '@/components/about/AboutOrigin'
import { AboutBelief } from '@/components/about/AboutBelief'
import { AboutDifference } from '@/components/about/AboutDifference'
import { ManifestoWall } from '@/components/about/ManifestoWall'
import { AboutTeam } from '@/components/about/AboutTeam'
import { AboutNumbers } from '@/components/about/AboutNumbers'
import { AboutContact } from '@/components/about/AboutContact'

export const metadata: Metadata = {
  title: '關於息壤',
  description: '息壤，取自山海經「鯀竊帝之息壤」——一種會自行生長的神土。我們是亞洲資深藝術家的數位展館。',
}

export default async function AboutPage() {
  const s = await getSiteSettings()

  const members = [
    { name: s.team1Name, role: s.team1Role, bio: s.team1Bio, img: s.team1Img },
    { name: s.team2Name, role: s.team2Role, bio: s.team2Bio, img: s.team2Img },
    { name: s.team3Name, role: s.team3Role, bio: s.team3Bio, img: s.team3Img },
    { name: s.team4Name, role: s.team4Role, bio: s.team4Bio, img: s.team4Img },
  ].filter(m => m.name)

  return (
    <>
      <AboutOpening bgUrl={s.aboutOpeningBg} label={s.aboutOpeningLabel} title={s.aboutOpeningTitle} titleEm={s.aboutOpeningTitleEm} />
      <AboutOrigin />
      <AboutBelief />
      <AboutDifference />
      <ManifestoWall />
      <AboutTeam sectionLabel={s.teamSectionLabel} sectionTitle={s.teamSectionTitle} members={members} />
      <AboutNumbers />
      <AboutContact />
    </>
  )
}

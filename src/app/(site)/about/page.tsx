import type { Metadata } from 'next'
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

export default function AboutPage() {
  return (
    <>
      <AboutOpening />
      <AboutOrigin />
      <AboutBelief />
      <AboutDifference />
      <ManifestoWall />
      <AboutTeam />
      <AboutNumbers />
      <AboutContact />
    </>
  )
}

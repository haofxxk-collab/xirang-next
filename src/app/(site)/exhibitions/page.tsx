import type { Metadata } from 'next'
import { getAllExhibitions, getCurrentExhibition } from '@/lib/queries'
import { ExhibitionHeader } from '@/components/exhibition/ExhibitionHeader'
import { CurrentExhibition } from '@/components/exhibition/CurrentExhibition'
import { PastExhibitions } from '@/components/exhibition/PastExhibitions'

export const metadata: Metadata = {
  title: '當期策展',
  description: '息壤策展：深耕創作數十年的亞洲藝術家，在這裡被好好呈現。',
}

export const revalidate = 3600

export default async function ExhibitionsPage() {
  const [all, current] = await Promise.all([
    getAllExhibitions(),
    getCurrentExhibition(),
  ])

  const past = all.filter((e) => e.status === 'past')
  const upcoming = all.filter((e) => e.status === 'upcoming')

  return (
    <>
      <ExhibitionHeader />
      <CurrentExhibition exhibition={current} />
      <PastExhibitions exhibitions={past} upcoming={upcoming} />
    </>
  )
}

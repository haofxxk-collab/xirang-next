import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArtworkBySlug, getAllArtworks } from '@/lib/queries'
import { WorkViewer } from '@/components/work/WorkViewer'
import { WorkDetail } from '@/components/work/WorkDetail'
import { WorkProcess } from '@/components/work/WorkProcess'
import { RelatedWorks } from '@/components/work/RelatedWorks'

interface Props {
  params: { id: string }
}

export async function generateStaticParams() {
  const works = await getAllArtworks()
  return works.map((w) => ({ id: w.slug.current }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const work = await getArtworkBySlug(params.id)
  if (!work) return {}
  return {
    title: work.title,
    description: `${work.title}，${work.artist.name}，${work.year}，${work.medium}。${work.description}`,
    openGraph: { title: `${work.title} — 息壤數位展館` },
  }
}

export const revalidate = 3600

export default async function WorkPage({ params }: Props) {
  const work = await getArtworkBySlug(params.id)
  if (!work) notFound()

  return (
    <>
      <WorkViewer work={work} />
      <WorkDetail work={work} />
      <WorkProcess />
      <RelatedWorks works={work.relatedWorks ?? []} artist={work.artist} />
    </>
  )
}

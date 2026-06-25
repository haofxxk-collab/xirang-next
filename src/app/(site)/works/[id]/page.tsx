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

export const revalidate = false

export default async function WorkPage({ params }: Props) {
  const work = await getArtworkBySlug(params.id)
  if (!work) notFound()

  const hasWorkProcess = work.workProcess1Title && work.workProcess2Title && work.workProcess3Title

  return (
    <>
      <WorkViewer work={work} />
      <WorkDetail work={work} />
      {hasWorkProcess && (
        <WorkProcess
          label={work.workProcessLabel ?? '創作過程'}
          title={work.workProcessTitle ?? '從靈感到完成'}
          step1Title={work.workProcess1Title!}
          step1Body={work.workProcess1Body ?? ''}
          step2Title={work.workProcess2Title!}
          step2Body={work.workProcess2Body ?? ''}
          step3Title={work.workProcess3Title!}
          step3Body={work.workProcess3Body ?? ''}
        />
      )}
      <RelatedWorks works={work.relatedWorks ?? []} artist={work.artist} />
    </>
  )
}

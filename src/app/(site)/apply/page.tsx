import type { Metadata } from 'next'
import { ApplyHero } from '@/components/apply/ApplyHero'
import { ApplyForm } from '@/components/apply/ApplyForm'
import { ApplyFAQ } from '@/components/apply/ApplyFAQ'
import { ApplyTestimonials } from '@/components/apply/ApplyTestimonials'

export const metadata: Metadata = {
  title: '申請加入',
  description: '申請讓息壤成為您的數位展館。我們的策展團隊將在五個工作天內與您聯絡。',
}

export default function ApplyPage() {
  return (
    <>
      <ApplyHero />
      <ApplyForm />
      <ApplyFAQ />
      <ApplyTestimonials />
    </>
  )
}

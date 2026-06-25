import type { Metadata } from 'next'
import { getSiteSettings } from '@/lib/queries'
import { ApplyHero } from '@/components/apply/ApplyHero'
import { ApplyForm } from '@/components/apply/ApplyForm'
import { ApplyFAQ } from '@/components/apply/ApplyFAQ'
import { ApplyTestimonials } from '@/components/apply/ApplyTestimonials'

export const metadata: Metadata = {
  title: '申請加入',
  description: '申請讓息壤成為您的數位展館。我們的策展團隊將在五個工作天內與您聯絡。',
}

export default async function ApplyPage() {
  const s = await getSiteSettings()

  const testimonials = [
    { quote: s.testimonial1Quote, name: s.testimonial1Name, medium: s.testimonial1Medium, img: s.testimonial1Img },
    { quote: s.testimonial2Quote, name: s.testimonial2Name, medium: s.testimonial2Medium, img: s.testimonial2Img },
    { quote: s.testimonial3Quote, name: s.testimonial3Name, medium: s.testimonial3Medium, img: s.testimonial3Img },
  ].filter(t => t.name)

  return (
    <>
      <ApplyHero />
      <ApplyForm />
      <ApplyFAQ />
      <ApplyTestimonials
        sectionLabel={s.testimonialsLabel}
        sectionTitle={s.testimonialsTitle}
        testimonials={testimonials}
      />
    </>
  )
}

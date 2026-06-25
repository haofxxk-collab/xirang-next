import Image from 'next/image'
import styles from './ApplyTestimonials.module.css'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=120&q=80&fit=crop&crop=face'

interface Testimonial { quote: string; name: string; medium: string; img: string }
interface Props {
  sectionLabel: string
  sectionTitle: string
  testimonials: Testimonial[]
}

export function ApplyTestimonials({ sectionLabel, sectionTitle, testimonials }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <p className={`reveal ${styles.label}`}>{sectionLabel}</p>
        <h2 className={`reveal ${styles.title}`}>{sectionTitle}</h2>
      </div>
      <div className={styles.grid}>
        {testimonials.map((t, i) => (
          <div key={t.name} className={`reveal ${styles.card}`} style={{ transitionDelay: `${i * 100}ms` }}>
            <p className={styles.quote}>「{t.quote}」</p>
            <div className={styles.author}>
              <div className={styles.portrait}>
                <Image src={t.img || FALLBACK_IMG} alt={t.name} fill className={styles.portraitImg} sizes="52px" />
              </div>
              <div>
                <p className={styles.name}>{t.name}</p>
                <p className={styles.medium}>{t.medium}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

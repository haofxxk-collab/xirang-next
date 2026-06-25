import Image from 'next/image'
import styles from './AboutTeam.module.css'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80&fit=crop&crop=face'

interface Member { name: string; role: string; bio: string; img: string }
interface Props {
  sectionLabel: string
  sectionTitle: string
  members: Member[]
}

export function AboutTeam({ sectionLabel, sectionTitle, members }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <p className={`reveal ${styles.label}`}>{sectionLabel}</p>
        <h2 className={`reveal ${styles.title}`}>{sectionTitle}</h2>
      </div>
      <div className={styles.grid}>
        {members.map((m, i) => (
          <div key={m.name} className={`reveal ${styles.card}`} style={{ transitionDelay: `${i * 80}ms` }}>
            <div className={styles.portrait}>
              <Image src={m.img || FALLBACK_IMG} alt={m.name} fill className={styles.portraitImg} sizes="80px" />
            </div>
            <p className={styles.name}>{m.name}</p>
            <p className={styles.role}>{m.role}</p>
            <p className={styles.bio}>{m.bio}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

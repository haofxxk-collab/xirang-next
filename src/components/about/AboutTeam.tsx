import Image from 'next/image'
import styles from './AboutTeam.module.css'

const team = [
  { name: '林 策展', role: '創辦人 · 策展總監', bio: '前國立美術館策展人，深耕亞洲當代藝術二十年。', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80&fit=crop&crop=face' },
  { name: '陳 設計', role: '設計總監', bio: '曾任職頂尖品牌設計公司，為息壤建立整體視覺語言。', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80&fit=crop&crop=face' },
  { name: '王 攝影', role: '藝術攝影師', bio: '專職藝術品與藝術家肖像攝影，負責所有作品的數位化記錄。', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80&fit=crop&crop=face' },
  { name: '張 技術', role: '技術總監', bio: '負責息壤平台的技術架構，讓每一頁都能優雅地呈現藝術。', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&fit=crop&crop=face' },
]

export function AboutTeam() {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <p className={`reveal ${styles.label}`}>團隊</p>
        <h2 className={`reveal ${styles.title}`}>一群相信<br />藝術值得被珍視的人。</h2>
      </div>
      <div className={styles.grid}>
        {team.map((m, i) => (
          <div key={m.name} className={`reveal ${styles.card}`} style={{ transitionDelay: `${i * 80}ms` }}>
            <div className={styles.portrait}>
              <Image src={m.img} alt={m.name} fill className={styles.portraitImg} sizes="80px" />
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

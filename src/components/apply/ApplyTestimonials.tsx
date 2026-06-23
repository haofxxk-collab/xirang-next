import Image from 'next/image'
import styles from './ApplyTestimonials.module.css'

const testimonials = [
  { quote: '以前總覺得自己的作品需要在實體空間才能被感受到。息壤讓我發現，數位空間也可以有溫度。', name: '王大川', medium: '書法 · 創作逾五十年', img: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=120&q=80&fit=crop&crop=face' },
  { quote: '策展人第一次訪談就讓我哭了。他問的不是作品值多少錢，而是問我為什麼開始畫畫。', name: '林月嬌', medium: '水墨山水 · 創作逾三十五年', img: 'https://images.unsplash.com/photo-1509868918748-a554bfb151e2?w=120&q=80&fit=crop' },
  { quote: '我七十二歲，本來以為數位世界跟我無關。現在我有了自己的展館，女兒說終於可以把我的作品分享給朋友看了。', name: '鄭秋霞', medium: '陶藝 · 創作逾四十五年', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&q=80&fit=crop&crop=face' },
]

export function ApplyTestimonials() {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <p className={`reveal ${styles.label}`}>藝術家說</p>
        <h2 className={`reveal ${styles.title}`}>他們選擇了息壤</h2>
      </div>
      <div className={styles.grid}>
        {testimonials.map((t, i) => (
          <div key={t.name} className={`reveal ${styles.card}`} style={{ transitionDelay: `${i * 100}ms` }}>
            <p className={styles.quote}>「{t.quote}」</p>
            <div className={styles.author}>
              <div className={styles.portrait}>
                <Image src={t.img} alt={t.name} fill className={styles.portraitImg} sizes="52px" />
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

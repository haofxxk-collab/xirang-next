import { client } from './sanity'
import type { Artist, Artwork, Exhibition } from '@/types'

const isConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== 'placeholder'
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function q<T>(query: string, params: any = {}, tags: string[], fallback?: T): Promise<T> {
  const empty = fallback !== undefined ? fallback : ([] as unknown as T)
  if (!isConfigured) return empty
  try {
    return await client.fetch<T>(query, params, {
      next: { tags, revalidate: false },
    })
  } catch {
    return empty
  }
}

// ── ARTISTS ──────────────────────────────────────
export function getAllArtists(): Promise<Artist[]> {
  return q(`
    *[_type == "artist"] | order(index asc) {
      _id, slug, name, nameEn, index, medium, yearsActive,
      birthYear, location, quote, featured, portrait, heroImage
    }
  `, {}, ['artists'])
}

export function getFeaturedArtist(): Promise<Artist | null> {
  return q(`
    *[_type == "artist" && featured == true][0] {
      _id, slug, name, nameEn, index, medium, yearsActive,
      quote, portrait, heroImage
    }
  `, {}, ['artists'], null)
}

export function getArtistBySlug(slug: string): Promise<Artist | null> {
  return q(`
    *[_type == "artist" && slug.current == $slug][0] {
      _id, slug, name, nameEn, index, medium, yearsActive,
      birthYear, location, bio, quote, portrait, heroImage, timeline,
      "works": *[_type == "artwork" && references(^._id)] | order(year desc) {
        _id, slug, title, year, medium, dimensions, status,
        "images": images[0..2]
      }
    }
  `, { slug }, ['artists', `artist-${slug}`], null)
}

// ── ARTWORKS ─────────────────────────────────────
export function getAllArtworks(): Promise<Artwork[]> {
  return q(`
    *[_type == "artwork"] | order(year desc) {
      _id, slug, title, year, medium, dimensions, series, status,
      images,
      "artist": artist-> { _id, name, slug, portrait }
    }
  `, {}, ['artworks'])
}

export function getArtworkBySlug(slug: string): Promise<Artwork | null> {
  return q(`
    *[_type == "artwork" && slug.current == $slug][0] {
      _id, slug, title, year, medium, dimensions, series,
      status, price, description, story, images,
      workProcessLabel, workProcessTitle,
      workProcess1Title, workProcess1Body,
      workProcess2Title, workProcess2Body,
      workProcess3Title, workProcess3Body,
      "artist": artist-> { _id, name, slug, portrait, yearsActive, medium },
      "relatedWorks": *[_type == "artwork" && artist._ref == ^.artist._ref && slug.current != $slug][0..2] {
        _id, slug, title, year, medium, images
      }
    }
  `, { slug }, ['artworks', `artwork-${slug}`], null)
}

// ── EXHIBITIONS ───────────────────────────────────
export function getAllExhibitions(): Promise<Exhibition[]> {
  return q(`
    *[_type == "exhibition"] | order(startDate desc) {
      _id, slug, title, titleEn, type, status,
      startDate, endDate, coverImage, description,
      "artists": artists[]-> { _id, name, slug, portrait, medium }
    }
  `, {}, ['exhibitions'])
}

export function getCurrentExhibition(): Promise<Exhibition | null> {
  return q(`
    *[_type == "exhibition" && status == "current"][0] {
      _id, slug, title, titleEn, type, status,
      startDate, endDate, coverImage, description, curatorNote,
      "artists": artists[]-> { _id, name, slug, portrait, medium },
      "works": works[]-> { _id, title, images }
    }
  `, {}, ['exhibitions'], null)
}

export function getExhibitionBySlug(slug: string): Promise<Exhibition | null> {
  return q(`
    *[_type == "exhibition" && slug.current == $slug][0] {
      _id, slug, title, titleEn, type, status,
      startDate, endDate, coverImage, description, curatorNote,
      "artists": artists[]-> { _id, name, slug, portrait, medium, yearsActive },
      "works": works[]-> { _id, slug, title, year, medium, images }
    }
  `, { slug }, ['exhibitions', `exhibition-${slug}`], null)
}

// ── SITE SETTINGS ────────────────────────────────
export type SiteSettings = {
  // ── 通用 & 導覽 ──────────────────────────────────
  introHeadline: string
  introSubline: string
  introCtaText: string
  navBrandZh: string
  navBrandEn: string
  footerTagline: string
  applyTitle: string
  applySubtitle: string

  // ── 外觀色彩 ──────────────────────────────────────
  dimTextOpacity: number
  secondaryTextColor: string
  accentColor: string

  // ── 首頁 Hero ────────────────────────────────────
  heroLabel: string
  heroTitle: string       // 以 \n 分隔三行，最後一行自動加 <em>
  heroBody: string
  heroStat1Label: string
  heroStat2Label: string
  heroStat3Val: string
  heroStat3Label: string

  // ── 首頁 Manifesto 宣言 ───────────────────────────
  manifestoLine1: string
  manifestoLine2: string
  manifestoLine3: string
  manifestoLine4: string
  manifestoLine5: string
  manifestoLine6: string
  manifestoSub: string

  // ── 首頁 藝術家預覽 ───────────────────────────────
  artistsPreviewLabel: string
  artistsPreviewTitle: string   // 以 \n 分隔兩行
  artistsPreviewMore: string

  // ── 首頁 典藏精選 ─────────────────────────────────
  worksScrollLabel: string
  worksScrollTitle: string      // 以 \n 分隔兩行
  worksScrollMore: string

  // ── 首頁 展覽預覽 ─────────────────────────────────
  exhibitionTag: string
  exhibitionCta: string
  exhibitionEmptyTitle: string
  exhibitionEmptyBody: string

  // ── 首頁 展館哲學 ─────────────────────────────────
  philosophyLabel: string
  philosophyTitle: string       // 以 \n 分隔兩行
  philosophy1Char: string
  philosophy1Title: string
  philosophy1Body: string
  philosophy2Char: string
  philosophy2Title: string
  philosophy2Body: string
  philosophy3Char: string
  philosophy3Title: string
  philosophy3Body: string

  // ── 首頁 加入邀請 ─────────────────────────────────
  joinLabel: string
  joinTitle: string             // 以 \n 分隔兩行
  joinBody: string
  joinCta1: string
  joinCta2: string

  // ── 藝術家頁 ─────────────────────────────────────
  artistsPageLabel: string
  artistsPageBody: string
  artistsFeaturedLabel: string
  artistsFeaturedCta: string

  // ── 典藏頁 ───────────────────────────────────────
  worksPageLabel: string
  worksPageBgChar: string
  worksPageTitleFull: string    // 有作品時："{count}" 會被自動替換
  worksPageTitleEmpty: string
  worksPageEmpty: string

  // ── 策展頁 ───────────────────────────────────────
  exhibitionsLabel: string
  exhibitionsTitle: string      // 以 \n 分隔兩行
  exhibitionsBody: string
  exhibitionCurrentLabel: string
  exhibitionArtistsLabel: string
  exhibitionPastLabel: string
  exhibitionPastTitle: string
  exhibitionUpcomingLabel: string
  exhibitionUpcomingTitle: string
  exhibitionEmptyRecordMsg: string

  // ── SEO ──────────────────────────────────────────
  siteTitle: string             // 全站名稱，用於 title template
  siteTitleTemplate: string     // 頁面 title 格式，%s 替換為頁面標題
  siteDescription: string       // 全站預設 description
  siteKeywords: string          // 逗號分隔關鍵字
  ogImage: string               // 預設 OG 圖片 URL（建議 1200×630）
  twitterHandle: string         // Twitter/X 帳號（含 @）
  // 各頁面 SEO
  seoHomeTitle: string
  seoHomeDescription: string
  seoArtistsTitle: string
  seoArtistsDescription: string
  seoWorksTitle: string
  seoWorksDescription: string
  seoExhibitionsTitle: string
  seoExhibitionsDescription: string
  seoApplyTitle: string
  seoApplyDescription: string
  // ── 關於頁 ───────────────────────────────────────
  aboutOpeningBg: string
  aboutOpeningLabel: string
  aboutOpeningTitle: string
  aboutOpeningTitleEm: string
  teamSectionLabel: string
  teamSectionTitle: string
  team1Name: string; team1Role: string; team1Bio: string; team1Img: string
  team2Name: string; team2Role: string; team2Bio: string; team2Img: string
  team3Name: string; team3Role: string; team3Bio: string; team3Img: string
  team4Name: string; team4Role: string; team4Bio: string; team4Img: string
  // ── 申請頁 — 見證 ────────────────────────────────
  testimonialsLabel: string
  testimonialsTitle: string
  testimonial1Quote: string; testimonial1Name: string; testimonial1Medium: string; testimonial1Img: string
  testimonial2Quote: string; testimonial2Name: string; testimonial2Medium: string; testimonial2Img: string
  testimonial3Quote: string; testimonial3Name: string; testimonial3Medium: string; testimonial3Img: string
}

export const defaultSettings: SiteSettings = {
  // 通用
  introHeadline:     '藝術，不該只有年輕的臉。',
  introSubline:      '深耕數十年的創作者，值得一座展館。',
  introCtaText:      '進入展館',
  navBrandZh:        '息壤',
  navBrandEn:        'Digital Art Museum',
  footerTagline:     '為深耕創作者，建一座永恆的展館。',
  applyTitle:        '成為息壤藝術家',
  applySubtitle:     '我們尋找深耕創作超過二十年、擁有獨特藝術語言的資深藝術家。',
  // 外觀
  dimTextOpacity:    50,
  secondaryTextColor:'#AAA69D',
  accentColor:       '#B8935A',
  // Hero
  heroLabel:         '數位展館',
  heroTitle:         '深耕數十年\n的創作者，\n值得一座展館。',
  heroBody:          '息壤是亞洲資深藝術家的數位家園。\n我們相信，時間是最好的策展人。\n每一位願意在一條路上走三十年、\n五十年的藝術家，都值得被好好看見。',
  heroStat1Label:    '典藏作品',
  heroStat2Label:    '藝術家展館',
  heroStat3Val:      '20+',
  heroStat3Label:    '創作媒材',
  // Manifesto
  manifestoLine1:    '真正的創作，',
  manifestoLine2:    '不需要爆紅。',
  manifestoLine3:    '它只需要',
  manifestoLine4:    '被對的人看見。',
  manifestoLine5:    '慢，',
  manifestoLine6:    '才是最深的抵達。',
  manifestoSub:      '息壤，亞洲資深藝術家的數位展館',
  // 藝術家預覽
  artistsPreviewLabel: '館內藝術家',
  artistsPreviewTitle: '每一位，\n都是一段歲月。',
  artistsPreviewMore:  '瀏覽所有藝術家 →',
  // 典藏精選
  worksScrollLabel:  '典藏精選',
  worksScrollTitle:  '每件作品，\n都有一段故事。',
  worksScrollMore:   '瀏覽所有典藏 →',
  // 展覽預覽
  exhibitionTag:        '當期策展',
  exhibitionCta:        '進入展覽 →',
  exhibitionEmptyTitle: '展覽籌備中',
  exhibitionEmptyBody:  '息壤的策展團隊正在籌備新的展覽。\n敬請期待，我們將帶來更精彩的呈現。',
  // 展館哲學
  philosophyLabel:   '展館哲學',
  philosophyTitle:   '我們相信的\n三件事。',
  philosophy1Char:   '時',
  philosophy1Title:  '時間是唯一的標準',
  philosophy1Body:   '息壤沒有點閱率排行，沒有粉絲數門檻。加入的唯一條件，是在一條路上走過足夠長的時間。',
  philosophy2Char:   '深',
  philosophy2Title:  '深度，不是廣度',
  philosophy2Body:   '我們不追求最多的藝術家，而是追求每一個展館都能呈現創作者最真實、最完整的面貌。',
  philosophy3Char:   '美',
  philosophy3Title:  '美，是對的事',
  philosophy3Body:   '藝術不是商品。息壤的每一個設計決定，都以「這樣呈現美嗎？」為第一判斷標準。',
  // 加入邀請
  joinLabel:  '邀請您加入',
  joinTitle:  '這裡有一個位置，\n一直為您保留。',
  joinBody:   '無論您深耕水墨、書法、陶藝、油彩、纖維或任何媒材，只要您願意，息壤都想為您建一座展館。',
  joinCta1:   '申請加入息壤',
  joinCta2:   '了解更多',
  // 藝術家頁
  artistsPageLabel:     '所有藝術家',
  artistsPageBody:      '每一位都用數十年時間，\n在一條路上走到了別人看不見的深處。',
  artistsFeaturedLabel: '精選藝術家',
  artistsFeaturedCta:   '進入展館 →',
  // 典藏頁
  worksPageLabel:      '典藏',
  worksPageBgChar:     '藏',
  worksPageTitleFull:  '{count} 件典藏，每件都有分量。',
  worksPageTitleEmpty: '典藏陸續入館中。',
  worksPageEmpty:      '典藏作品陸續上架中，敬請期待。',
  // 策展頁
  exhibitionsLabel:          '策展',
  exhibitionsTitle:          '每一檔展覽，\n都是一次深呼吸。',
  exhibitionsBody:           '息壤的每一個策展，都從藝術家的故事出發。不是為了展而展，而是為了讓人真正感受到。',
  exhibitionCurrentLabel:    '當期策展',
  exhibitionArtistsLabel:    '參展藝術家',
  exhibitionPastLabel:       '過往策展',
  exhibitionPastTitle:       '歷屆展覽',
  exhibitionUpcomingLabel:   '即將展出',
  exhibitionUpcomingTitle:   '敬請期待',
  exhibitionEmptyRecordMsg:  '展覽紀錄陸續建立中，敬請期待。',
  // SEO
  siteTitle:              '息壤 Xirang',
  siteTitleTemplate:      '%s | 息壤 Xirang',
  siteDescription:        '息壤是亞洲資深藝術家的數位展館。深耕數十年的創作者，在這裡被好好看見。',
  siteKeywords:           '藝術,展館,亞洲藝術家,數位展館,水墨,書法,油彩,典藏,台灣藝術',
  ogImage:                '',
  twitterHandle:          '',
  seoHomeTitle:           '亞洲資深藝術家數位展館',
  seoHomeDescription:     '息壤是亞洲資深藝術家的數位家園。我們相信，時間是最好的策展人。每一位在一條路上走三十年的藝術家，都值得被好好看見。',
  seoArtistsTitle:        '所有藝術家',
  seoArtistsDescription:  '探索息壤館內所有藝術家，每一位都是一段值得被看見的故事。',
  seoWorksTitle:          '典藏作品',
  seoWorksDescription:    '瀏覽息壤館內所有典藏作品，每件作品背後都有一段深厚的創作故事。',
  seoExhibitionsTitle:    '當期策展',
  seoExhibitionsDescription: '息壤策展：深耕創作數十年的亞洲藝術家，在這裡被好好呈現。',
  seoApplyTitle:          '申請加入息壤',
  seoApplyDescription:    '我們尋找深耕創作超過二十年、擁有獨特藝術語言的資深藝術家。',
  // 關於頁
  aboutOpeningBg:    '',
  aboutOpeningLabel: '關於息壤',
  aboutOpeningTitle: '這片土地，',
  aboutOpeningTitleEm: '會自己生長。',
  teamSectionLabel:  '團隊',
  teamSectionTitle:  '一群相信藝術值得被珍視的人。',
  team1Name: '林 策展', team1Role: '創辦人 · 策展總監', team1Bio: '前國立美術館策展人，深耕亞洲當代藝術二十年。', team1Img: '',
  team2Name: '陳 設計', team2Role: '設計總監', team2Bio: '曾任職頂尖品牌設計公司，為息壤建立整體視覺語言。', team2Img: '',
  team3Name: '王 攝影', team3Role: '藝術攝影師', team3Bio: '專職藝術品與藝術家肖像攝影，負責所有作品的數位化記錄。', team3Img: '',
  team4Name: '張 技術', team4Role: '技術總監', team4Bio: '負責息壤平台的技術架構，讓每一頁都能優雅地呈現藝術。', team4Img: '',
  // 申請頁 — 見證
  testimonialsLabel: '藝術家說',
  testimonialsTitle: '他們選擇了息壤',
  testimonial1Quote: '以前總覺得自己的作品需要在實體空間才能被感受到。息壤讓我發現，數位空間也可以有溫度。', testimonial1Name: '王大川', testimonial1Medium: '書法 · 創作逾五十年', testimonial1Img: '',
  testimonial2Quote: '策展人第一次訪談就讓我哭了。他問的不是作品值多少錢，而是問我為什麼開始畫畫。', testimonial2Name: '林月嬌', testimonial2Medium: '水墨山水 · 創作逾三十五年', testimonial2Img: '',
  testimonial3Quote: '我七十二歲，本來以為數位世界跟我無關。現在我有了自己的展館，女兒說終於可以把我的作品分享給朋友看了。', testimonial3Name: '鄭秋霞', testimonial3Medium: '陶藝 · 創作逾四十五年', testimonial3Img: '',
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const result = await q<SiteSettings | null>(
    `*[_id == "siteSettings"][0]`,
    {},
    ['site-settings'],
    null
  )
  if (!result) return defaultSettings
  return { ...defaultSettings, ...result }
}

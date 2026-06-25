import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { RevealProvider } from '@/components/RevealProvider'
import { getSiteSettings } from '@/lib/queries'

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings()
  const images = s.ogImage ? [{ url: s.ogImage, width: 1200, height: 630, alt: s.siteTitle }] : []
  return {
    title: {
      default: s.siteTitle,
      template: s.siteTitleTemplate,
    },
    description: s.siteDescription,
    keywords: s.siteKeywords,
    openGraph: {
      siteName: s.siteTitle,
      locale: 'zh_TW',
      type: 'website',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      ...(s.twitterHandle ? { site: s.twitterHandle } : {}),
      images,
    },
    metadataBase: new URL('https://xirang.vercel.app'),
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  const dimOpacity = (settings.dimTextOpacity ?? 50) / 100
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap" rel="stylesheet" />
      <style>{`
        :root {
          --dim-opacity: ${dimOpacity};
          --mineral: ${settings.secondaryTextColor ?? '#AAA69D'};
          --gold: ${settings.accentColor ?? '#B8935A'};
        }
      `}</style>
      <Nav brandZh={settings.navBrandZh} brandEn={settings.navBrandEn} />
      <RevealProvider>
        <main>{children}</main>
      </RevealProvider>
      <Footer tagline={settings.footerTagline} />
    </>
  )
}

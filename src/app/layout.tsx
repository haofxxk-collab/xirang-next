import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s — 息壤數位展館',
    default: '息壤 Xirang — 亞洲藝術家數位展館',
  },
  description: '息壤是亞洲資深藝術家的數位展館平台，為深耕數十年的創作者提供策展級的數位空間。',
  keywords: ['亞洲藝術', '水墨', '書法', '數位展館', '當代藝術', '台灣藝術家'],
  openGraph: {
    siteName: '息壤 Xirang',
    locale: 'zh_TW',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  )
}

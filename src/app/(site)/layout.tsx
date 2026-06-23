import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { RevealProvider } from '@/components/RevealProvider'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <RevealProvider>
        <main>{children}</main>
      </RevealProvider>
      <Footer />
    </>
  )
}

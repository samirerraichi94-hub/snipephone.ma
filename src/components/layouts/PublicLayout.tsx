import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}

export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/ui/ProductCard'
import { PublicLayout } from '@/components/layouts/PublicLayout'
import { ChevronRight, Smartphone, Headphones, Laptop, Tablet, Camera, Wrench, Tv, Zap } from 'lucide-react'
import type { Product, Category } from '@/types'

const fallbackIcons: Record<string, React.ReactNode> = {
  telephones: <Smartphone size={32} />,
  accessoires: <Headphones size={32} />,
  'pc-laptops': <Laptop size={32} />,
  tablettes: <Tablet size={32} />,
  cameras: <Camera size={32} />,
  flashage: <Wrench size={32} />,
  recepteurs: <Tv size={32} />,
}

export default async function HomePage() {
  const supabase = createClient()

  const [{ data: featuredProducts }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('featured', true)
      .eq('in_stock', true)
      .order('created_at', { ascending: false })
      .limit(8),
    supabase.from('categories').select('*').order('name'),
  ])

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a2340] via-[#1e2d50] to-[#111828] text-white py-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-[#E8691A]/20 text-[#E8691A] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              🎯 Votre tech store à Temara
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Find Your{' '}
              <span className="text-[#E8691A]">Solution</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Smartphones, accessoires, PC, tablettes, caméras de surveillance — tout ce dont vous avez besoin, disponible à Temara.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="bg-[#E8691A] text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                Voir les produits <ChevronRight size={18} />
              </Link>
              <a
                href="https://wa.me/212648045594"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-[#1a2340] transition-colors"
              >
                Nous contacter
              </a>
            </div>
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10">
              {[
                { value: '500+', label: 'Produits' },
                { value: '7', label: 'Catégories' },
                { value: '100%', label: 'Satisfaction client' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-[#E8691A]">{stat.value}</p>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex justify-center">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 bg-[#E8691A]/20 rounded-full blur-3xl" />
              <div className="relative z-10 flex items-center justify-center h-full">
                <Zap size={120} className="text-[#E8691A] opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#1a2340] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Nos Catégories
            </h2>
            <p className="text-gray-500">Explorez notre gamme complète de produits tech</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {((categories as Category[]) ?? []).map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-[#E8691A]/10 border-2 border-transparent hover:border-[#E8691A] transition-all group text-center"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">
                  {cat.icon ?? fallbackIcons[cat.slug] ?? '📦'}
                </span>
                <span className="text-sm font-semibold text-[#1a2340] group-hover:text-[#E8691A] transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {(featuredProducts?.length ?? 0) > 0 && (
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-[#1a2340] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Produits Vedettes
                </h2>
                <p className="text-gray-500">Nos meilleures offres du moment</p>
              </div>
              <Link href="/products" className="text-[#E8691A] font-semibold hover:underline flex items-center gap-1">
                Voir tout <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {(featuredProducts as Product[]).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="bg-[#1a2340] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Nos Services
            </h2>
            <p className="text-gray-400">Plus qu&apos;un simple magasin — votre partenaire tech</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '📱', title: 'Flashage', desc: 'Déblocage et flashage de téléphones toutes marques' },
              { icon: '🔧', title: 'Réparation', desc: 'Réparation rapide et fiable de smartphones et PC' },
              { icon: '📦', title: 'Accessoires', desc: "Large gamme d'accessoires originaux et compatibles" },
              { icon: '📷', title: 'Surveillance', desc: 'Installation de caméras et systèmes de sécurité' },
            ].map((s) => (
              <div key={s.title} className="bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <span className="text-4xl mb-4 block">{s.icon}</span>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-[#E8691A]">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Prêt à passer commande ?
          </h2>
          <p className="text-white/90 mb-8 text-lg">
            Contactez-nous directement sur WhatsApp pour toute question, devis ou commande. Réponse rapide garantie !
          </p>
          <a
            href="https://wa.me/212648045594"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#E8691A] px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors text-lg"
          >
            📲 Contacter sur WhatsApp
          </a>
        </div>
      </section>
    </PublicLayout>
  )
}

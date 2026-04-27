export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/ui/ProductCard'
import { PublicLayout } from '@/components/layouts/PublicLayout'
import { ChevronRight, Smartphone, Headphones, Laptop, Tablet, Camera, Wrench, Tv, Star, ShieldCheck } from 'lucide-react'
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
      <section
        className="relative text-white overflow-hidden flex items-center"
        style={{ minHeight: '92vh', background: 'linear-gradient(135deg, #0a0f1e 0%, #111828 60%, #0f1a2e 100%)' }}
      >
        {/* Subtle orange glow top-right */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 70% 30%, rgba(232,105,26,0.12) 0%, transparent 70%)' }} />
        {/* Subtle orange glow bottom-left */}
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 30% 80%, rgba(232,105,26,0.07) 0%, transparent 70%)' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center w-full">

          {/* LEFT — text */}
          <div className="hero-fade-in">
            <span className="inline-flex items-center gap-2 bg-[#E8691A]/20 text-[#E8691A] text-sm font-semibold px-5 py-2 rounded-full mb-6 border border-[#E8691A]/30">
              🎯 Votre tech store à Temara
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Trouvez Votre{' '}
              <span className="text-[#E8691A]" style={{ textShadow: '0 0 40px rgba(232,105,26,0.6)' }}>
                Solution
              </span>
            </h1>
            <p className="text-gray-300 text-lg mb-10 leading-relaxed max-w-lg">
              Smartphones, accessoires, PC, tablettes, caméras de surveillance — tout ce dont vous avez besoin, disponible à Temara.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                href="/products"
                className="group btn-glow bg-[#E8691A] text-white px-8 py-4 rounded-2xl font-bold text-base flex items-center gap-2 transition-all duration-300 hover:bg-orange-500 hover:scale-105"
              >
                Voir les produits <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://wa.me/212648045594"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-white/10 hover:border-white/60 transition-all duration-300"
              >
                Nous contacter
              </a>
            </div>
            <div className="flex flex-wrap gap-8 pt-8 border-t border-white/10">
              {[
                { value: '500+', label: 'Produits', icon: <Smartphone size={18} /> },
                { value: '7', label: 'Catégories', icon: <Star size={18} /> },
                { value: '100%', label: 'Satisfaction', icon: <ShieldCheck size={18} /> },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#E8691A]/15 flex items-center justify-center text-[#E8691A] border border-[#E8691A]/20">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#E8691A]">{stat.value}</p>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — logo avec fond noir, screen blend */}
          <div className="hidden lg:flex items-center justify-center hero-fade-in">
            <div className="relative flex items-center justify-center">
              {/* Glow ring animé */}
              <div className="absolute w-[420px] h-[420px] rounded-full hero-glow-ring"
                style={{ border: '2px solid rgba(232,105,26,0.25)', boxShadow: '0 0 80px rgba(232,105,26,0.15), inset 0 0 80px rgba(232,105,26,0.05)' }} />
              <div className="absolute w-[500px] h-[500px] rounded-full"
                style={{ border: '1px solid rgba(232,105,26,0.08)' }} />
              {/* Logo — fond noir disparaît avec screen */}
              <Image
                src="/logo.png"
                alt="Snipe Phone"
                width={420}
                height={420}
                className="object-contain hero-float relative z-10"
                style={{ mixBlendMode: 'screen', filter: 'drop-shadow(0 0 40px rgba(232,105,26,0.4))' }}
                priority
              />
            </div>
          </div>

        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#0f172a] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Nos Catégories
            </h2>
            <div className="w-16 h-1 bg-[#E8691A] rounded-full mx-auto mb-3" />
            <p className="text-gray-500 text-base">Explorez notre gamme complète de produits tech</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {((categories as Category[]) ?? []).map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group flex flex-col items-center gap-4 p-5 rounded-2xl bg-white border-2 border-transparent hover:border-[#E8691A] hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#E8691A]/10 flex items-center justify-center text-[#E8691A] group-hover:bg-[#E8691A] group-hover:text-white transition-all duration-300 group-hover:scale-110">
                  {fallbackIcons[cat.slug] ?? <Smartphone size={28} />}
                </div>
                <span className="text-sm font-semibold text-[#1a2340] group-hover:text-[#E8691A] transition-colors leading-tight">
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

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PublicLayout } from '@/components/layouts/PublicLayout'
import { ProductCard } from '@/components/ui/ProductCard'
import { ChevronRight, Package, Tag } from 'lucide-react'
import type { Product } from '@/types'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase.from('products').select('name, description').eq('slug', params.slug).single()
  if (!data) return { title: 'Produit introuvable' }
  return { title: data.name, description: data.description ?? undefined }
}

export default async function ProductPage({ params }: Props) {
  const supabase = createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', params.slug)
    .single()

  if (!product) notFound()

  const p = product as Product

  const { data: related } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('category_id', p.category_id ?? '')
    .neq('id', p.id)
    .limit(4)

  const waText = encodeURIComponent(`Bonjour Snipe Phone, je suis intéressé par ${p.name}`)
  const waLink = `https://wa.me/212648045594?text=${waText}`
  const discount =
    p.old_price && p.old_price > p.price
      ? Math.round(((p.old_price - p.price) / p.old_price) * 100)
      : null

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#E8691A]">Accueil</Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-[#E8691A]">Produits</Link>
          {p.categories && (
            <>
              <ChevronRight size={14} />
              <Link href={`/categories/${p.categories.slug}`} className="hover:text-[#E8691A]">
                {p.categories.name}
              </Link>
            </>
          )}
          <ChevronRight size={14} />
          <span className="text-gray-800 font-medium truncate max-w-[200px]">{p.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              {p.images && p.images.length > 0 ? (
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Package size={80} />
                </div>
              )}
              {discount && (
                <div className="absolute top-4 left-4 bg-[#E8691A] text-white text-sm font-bold px-3 py-1.5 rounded-xl flex items-center gap-1">
                  <Tag size={14} />
                  -{discount}%
                </div>
              )}
            </div>
            {p.images && p.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {p.images.slice(1).map((img, i) => (
                  <div key={i} className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                    <Image src={img} alt={`${p.name} ${i + 2}`} fill className="object-cover" sizes="25vw" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {p.categories && (
              <Link
                href={`/categories/${p.categories.slug}`}
                className="inline-block text-sm text-[#E8691A] font-semibold bg-[#E8691A]/10 px-3 py-1 rounded-full mb-4 hover:bg-[#E8691A]/20 transition-colors"
              >
                {p.categories.name}
              </Link>
            )}
            <h1 className="text-3xl font-bold text-[#1a2340] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {p.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-[#E8691A]">{p.price.toLocaleString('fr-MA')} MAD</span>
              {p.old_price && (
                <span className="text-xl text-gray-400 line-through">{p.old_price.toLocaleString('fr-MA')} MAD</span>
              )}
            </div>

            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6 ${p.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
              <span className={`w-2 h-2 rounded-full ${p.in_stock ? 'bg-green-500' : 'bg-red-500'}`} />
              {p.in_stock ? 'En stock' : 'Rupture de stock'}
            </div>

            {p.description && (
              <div className="prose prose-gray mb-8">
                <p className="text-gray-600 leading-relaxed">{p.description}</p>
              </div>
            )}

            <div className="space-y-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold text-lg transition-colors ${
                  p.in_stock
                    ? 'bg-[#E8691A] text-white hover:bg-orange-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                📲 Commander via WhatsApp
              </a>
              <a
                href={`https://wa.me/212648045594?text=${encodeURIComponent(`Bonjour, j'ai une question sur ${p.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold border-2 border-[#1a2340] text-[#1a2340] hover:bg-[#1a2340] hover:text-white transition-colors"
              >
                Poser une question
              </a>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related && related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-[#1a2340] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Produits similaires
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {(related as Product[]).map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  )
}

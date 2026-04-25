import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/ui/ProductCard'
import { PublicLayout } from '@/components/layouts/PublicLayout'
import { ChevronRight } from 'lucide-react'
import type { Product } from '@/types'
import type { Metadata } from 'next'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase.from('categories').select('name').eq('slug', params.slug).single()
  if (!data) return { title: 'Catégorie introuvable' }
  return { title: data.name }
}

export default async function CategoryPage({ params }: Props) {
  const supabase = createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!category) notFound()

  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('category_id', category.id)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <PublicLayout>
      <div className="bg-[#1a2340] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">Accueil</Link>
            <ChevronRight size={14} />
            <Link href="/products" className="hover:text-white">Produits</Link>
            <ChevronRight size={14} />
            <span className="text-white">{category.name}</span>
          </nav>
          <h1 className="text-4xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {category.icon && <span className="mr-3">{category.icon}</span>}
            {category.name}
          </h1>
          <p className="text-gray-400 mt-2">
            {(products?.length ?? 0)} produit{(products?.length ?? 0) !== 1 ? 's' : ''} disponible{(products?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {(!products || products.length === 0) ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-6xl mb-4">📦</p>
            <p className="text-xl font-semibold">Aucun produit dans cette catégorie</p>
            <Link href="/products" className="mt-4 inline-block text-[#E8691A] hover:underline">
              Voir tous les produits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(products as Product[]).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}

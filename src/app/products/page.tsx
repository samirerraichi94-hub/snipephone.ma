export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/ui/ProductCard'
import { ProductFilters } from '@/components/ui/ProductFilters'
import { PublicLayout } from '@/components/layouts/PublicLayout'
import { Suspense } from 'react'
import type { Category, Product } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Tous les produits' }

interface SearchParams {
  category?: string
  in_stock?: string
  sort?: string
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = createClient()

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*, categories(name, slug)').order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('name'),
  ])

  let filtered = (products as Product[]) ?? []

  if (searchParams.category) {
    filtered = filtered.filter((p) => p.categories?.slug === searchParams.category)
  }
  if (searchParams.in_stock === 'true') {
    filtered = filtered.filter((p) => p.in_stock)
  }
  if (searchParams.sort === 'price_asc') {
    filtered = [...filtered].sort((a, b) => a.price - b.price)
  } else if (searchParams.sort === 'price_desc') {
    filtered = [...filtered].sort((a, b) => b.price - a.price)
  }

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1a2340] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Tous les produits
          </h1>
          <p className="text-gray-500">
            {filtered.length} produit{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters — client component wrapped in Suspense (required for useSearchParams) */}
          <Suspense fallback={<div className="lg:w-64 shrink-0" />}>
            <ProductFilters categories={(categories as Category[]) ?? []} />
          </Suspense>

          {/* Products grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-6xl mb-4">📦</p>
                <p className="text-xl font-semibold">Aucun produit trouvé</p>
                <p className="mt-2">Essayez de modifier vos filtres</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

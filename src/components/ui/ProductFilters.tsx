'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Category } from '@/types'

interface Props {
  categories: Category[]
}

export function ProductFilters({ categories }: Props) {
  const router = useRouter()
  const params = useSearchParams()

  const currentCategory = params.get('category') ?? ''
  const inStock = params.get('in_stock') === 'true'
  const currentSort = params.get('sort') ?? ''

  const buildUrl = (overrides: Record<string, string | null>) => {
    const p = new URLSearchParams()
    const merged = {
      category: currentCategory,
      in_stock: inStock ? 'true' : null,
      sort: currentSort || null,
      ...overrides,
    }
    Object.entries(merged).forEach(([k, v]) => { if (v) p.set(k, v) })
    return `/products?${p.toString()}`
  }

  return (
    <aside className="lg:w-64 shrink-0">
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
        {/* Catégorie */}
        <div>
          <h3 className="font-semibold text-[#1a2340] mb-3">Catégorie</h3>
          <div className="space-y-1">
            <button
              onClick={() => router.push(buildUrl({ category: null }))}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!currentCategory ? 'bg-[#E8691A] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Toutes les catégories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => router.push(buildUrl({ category: cat.slug }))}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${currentCategory === cat.slug ? 'bg-[#E8691A] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Disponibilité */}
        <div>
          <h3 className="font-semibold text-[#1a2340] mb-3">Disponibilité</h3>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              className="accent-[#E8691A]"
              checked={inStock}
              onChange={(e) => router.push(buildUrl({ in_stock: e.target.checked ? 'true' : null }))}
            />
            En stock uniquement
          </label>
        </div>

        {/* Trier par */}
        <div>
          <h3 className="font-semibold text-[#1a2340] mb-3">Trier par</h3>
          <div className="space-y-1">
            {[
              { value: '', label: 'Plus récents' },
              { value: 'price_asc', label: 'Prix croissant' },
              { value: 'price_desc', label: 'Prix décroissant' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => router.push(buildUrl({ sort: opt.value || null }))}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${currentSort === opt.value ? 'bg-[#E8691A] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

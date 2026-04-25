import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Nouveau produit' }

export default async function NewProductPage() {
  const supabase = createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  return (
    <div className="p-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/products" className="hover:text-[#E8691A]">Produits</Link>
        <ChevronRight size={14} />
        <span className="text-gray-800">Nouveau produit</span>
      </nav>
      <h1 className="text-2xl font-bold text-[#1a2340] mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Ajouter un produit
      </h1>
      <ProductForm categories={categories ?? []} />
    </div>
  )
}

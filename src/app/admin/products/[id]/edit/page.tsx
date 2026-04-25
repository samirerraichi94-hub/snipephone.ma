import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductForm } from '@/components/admin/ProductForm'
import { ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

interface Props { params: { id: string } }

export const metadata: Metadata = { title: 'Modifier le produit' }

export default async function EditProductPage({ params }: Props) {
  const supabase = createClient()

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').eq('id', params.id).single(),
    supabase.from('categories').select('*').order('name'),
  ])

  if (!product) notFound()

  return (
    <div className="p-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/products" className="hover:text-[#E8691A]">Produits</Link>
        <ChevronRight size={14} />
        <span className="text-gray-800 truncate max-w-[200px]">{product.name}</span>
      </nav>
      <h1 className="text-2xl font-bold text-[#1a2340] mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Modifier le produit
      </h1>
      <ProductForm product={product} categories={categories ?? []} />
    </div>
  )
}

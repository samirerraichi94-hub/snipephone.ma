import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { AdminProductActions } from '@/components/admin/AdminProductActions'
import { Plus, Package } from 'lucide-react'
import type { Product } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Produits' }

export default async function AdminProductsPage() {
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2340]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Produits
          </h1>
          <p className="text-gray-500 text-sm mt-1">{products?.length ?? 0} produit{(products?.length ?? 0) !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-[#E8691A] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Nouveau produit
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {!products || products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Package size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold">Aucun produit</p>
            <Link href="/admin/products/new" className="mt-3 inline-block text-[#E8691A] hover:underline">
              Ajouter votre premier produit
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Produit</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Catégorie</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Prix</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Stock</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Vedette</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(products as Product[]).map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="48px" />
                          ) : (
                            <Package size={20} className="absolute inset-0 m-auto text-gray-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1a2340] text-sm">{product.name}</p>
                          <p className="text-gray-400 text-xs truncate max-w-[180px]">/products/{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {(product as Product & { categories?: { name: string } }).categories?.name ?? '—'}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#E8691A]">{product.price} MAD</p>
                      {product.old_price && (
                        <p className="text-xs text-gray-400 line-through">{product.old_price} MAD</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <AdminProductActions productId={product.id} field="in_stock" value={product.in_stock} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <AdminProductActions productId={product.id} field="featured" value={product.featured} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-sm text-[#1a2340] font-medium hover:text-[#E8691A] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#E8691A]/10"
                        >
                          Modifier
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

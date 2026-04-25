import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Package, Tag, FileText, TrendingUp } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function AdminDashboard() {
  const supabase = createClient()

  const [
    { count: totalProducts },
    { count: totalCategories },
    { count: totalArticles },
    { count: featuredProducts },
    { data: recentProducts },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('published', true),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('featured', true),
    supabase.from('products').select('name, price, in_stock, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  const stats = [
    { label: 'Produits', value: totalProducts ?? 0, icon: Package, href: '/admin/products', color: 'bg-blue-500' },
    { label: 'Catégories', value: totalCategories ?? 0, icon: Tag, href: '/admin/categories', color: 'bg-purple-500' },
    { label: 'Articles publiés', value: totalArticles ?? 0, icon: FileText, href: '/admin/articles', color: 'bg-green-500' },
    { label: 'Produits vedettes', value: featuredProducts ?? 0, icon: TrendingUp, href: '/admin/products', color: 'bg-[#E8691A]' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#1a2340] mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Tableau de bord
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow flex items-center gap-4"
          >
            <div className={`${stat.color} p-3 rounded-xl text-white`}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#1a2340]">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-bold text-[#1a2340] mb-4">Actions rapides</h2>
          <div className="space-y-3">
            {[
              { href: '/admin/products/new', label: '+ Ajouter un produit', color: 'bg-[#E8691A]' },
              { href: '/admin/articles/new', label: '+ Écrire un article', color: 'bg-[#1a2340]' },
              { href: '/admin/categories', label: '+ Gérer les catégories', color: 'bg-purple-600' },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`${action.color} text-white block text-center py-2.5 px-4 rounded-xl font-semibold hover:opacity-90 transition-opacity`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent products */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-bold text-[#1a2340] mb-4">Derniers produits ajoutés</h2>
          {!recentProducts || recentProducts.length === 0 ? (
            <p className="text-gray-400 text-sm">Aucun produit</p>
          ) : (
            <div className="space-y-3">
              {recentProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#1a2340] text-sm truncate max-w-[200px]">{p.name}</p>
                    <p className="text-gray-400 text-xs">{p.price} MAD</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {p.in_stock ? 'En stock' : 'Épuisé'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

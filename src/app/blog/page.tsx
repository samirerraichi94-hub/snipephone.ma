import Image from 'next/image'
import Link from 'next/link'
export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { PublicLayout } from '@/components/layouts/PublicLayout'
import { Calendar } from 'lucide-react'
import type { Article } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Blog' }

export default async function BlogPage() {
  const supabase = createClient()
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  return (
    <PublicLayout>
      <div className="bg-[#1a2340] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Blog</h1>
          <p className="text-gray-400">Actualités tech, conseils et guides</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {(!articles || articles.length === 0) ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-6xl mb-4">📝</p>
            <p className="text-xl font-semibold">Aucun article publié pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(articles as Article[]).map((article) => (
              <article key={article.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                {article.cover_image ? (
                  <div className="relative h-48">
                    <Image
                      src={article.cover_image}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-[#1a2340] to-[#E8691A]/30 flex items-center justify-center">
                    <span className="text-5xl">📱</span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                    <Calendar size={14} />
                    {new Date(article.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </div>
                  <h2 className="text-xl font-bold text-[#1a2340] mb-3 line-clamp-2 hover:text-[#E8691A] transition-colors">
                    <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                  </h2>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="text-[#E8691A] font-semibold text-sm hover:underline"
                  >
                    Lire l&apos;article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}

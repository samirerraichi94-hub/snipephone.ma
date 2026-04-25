import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { PublicLayout } from '@/components/layouts/PublicLayout'
import { Calendar, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase.from('articles').select('title').eq('slug', params.slug).single()
  if (!data) return { title: 'Article introuvable' }
  return { title: data.title }
}

export default async function ArticlePage({ params }: Props) {
  const supabase = createClient()
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (!article) notFound()

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#E8691A]">Accueil</Link>
          <ChevronRight size={14} />
          <Link href="/blog" className="hover:text-[#E8691A]">Blog</Link>
          <ChevronRight size={14} />
          <span className="text-gray-800 truncate max-w-[200px]">{article.title}</span>
        </nav>

        {article.cover_image && (
          <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
            <Image
              src={article.cover_image}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
          <Calendar size={14} />
          {new Date(article.created_at).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
          })}
        </div>

        <h1 className="text-4xl font-bold text-[#1a2340] mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {article.title}
        </h1>

        <div
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content ?? '' }}
        />

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/blog" className="text-[#E8691A] font-semibold hover:underline flex items-center gap-1">
            ← Retour au blog
          </Link>
        </div>
      </div>
    </PublicLayout>
  )
}

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArticleForm } from '@/components/admin/ArticleForm'
import { ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

interface Props { params: { id: string } }

export const metadata: Metadata = { title: 'Modifier l\'article' }

export default async function EditArticlePage({ params }: Props) {
  const supabase = createClient()
  const { data: article } = await supabase.from('articles').select('*').eq('id', params.id).single()

  if (!article) notFound()

  return (
    <div className="p-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/articles" className="hover:text-[#E8691A]">Articles</Link>
        <ChevronRight size={14} />
        <span className="text-gray-800 truncate max-w-[200px]">{article.title}</span>
      </nav>
      <h1 className="text-2xl font-bold text-[#1a2340] mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Modifier l&apos;article
      </h1>
      <ArticleForm article={article} />
    </div>
  )
}

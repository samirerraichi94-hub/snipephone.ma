import { ArticleForm } from '@/components/admin/ArticleForm'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Nouvel article' }

export default function NewArticlePage() {
  return (
    <div className="p-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/articles" className="hover:text-[#E8691A]">Articles</Link>
        <ChevronRight size={14} />
        <span className="text-gray-800">Nouvel article</span>
      </nav>
      <h1 className="text-2xl font-bold text-[#1a2340] mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Écrire un article
      </h1>
      <ArticleForm />
    </div>
  )
}

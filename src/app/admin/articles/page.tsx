import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, FileText } from 'lucide-react'
import type { Article } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Articles' }

export default async function AdminArticlesPage() {
  const supabase = createClient()
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1a2340]" style={{ fontFamily: 'Poppins, sans-serif' }}>Articles</h1>
          <p className="text-gray-500 text-sm mt-1">{articles?.length ?? 0} article{(articles?.length ?? 0) !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="bg-[#E8691A] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Nouvel article
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {!articles || articles.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-semibold">Aucun article</p>
            <Link href="/admin/articles/new" className="mt-3 inline-block text-[#E8691A] hover:underline">
              Écrire votre premier article
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Titre</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600">Statut</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(articles as Article[]).map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[#1a2340]">{article.title}</p>
                    <p className="text-gray-400 text-xs font-mono mt-0.5">/blog/{article.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(article.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      article.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {article.published ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="text-sm text-[#1a2340] font-medium hover:text-[#E8691A] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#E8691A]/10"
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

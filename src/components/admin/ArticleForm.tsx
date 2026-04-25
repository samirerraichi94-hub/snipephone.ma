'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { RichTextEditor } from './RichTextEditor'
import { Trash2, Image as ImageIcon } from 'lucide-react'
import type { Article } from '@/types'

interface Props {
  article?: Article
}

export function ArticleForm({ article }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    title: article?.title ?? '',
    slug: article?.slug ?? '',
    content: article?.content ?? '',
    cover_image: article?.cover_image ?? '',
    published: article?.published ?? false,
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const nameToSlug = (title: string) =>
    title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `covers/${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true })
    if (!error && data) {
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(data.path)
      setForm((prev) => ({ ...prev, cover_image: urlData.publicUrl }))
    }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const payload = {
      title: form.title,
      slug: form.slug || nameToSlug(form.title),
      content: form.content || null,
      cover_image: form.cover_image || null,
      published: form.published,
      updated_at: new Date().toISOString(),
    }

    if (article) {
      const { error } = await supabase.from('articles').update(payload).eq('id', article.id)
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('articles').insert(payload)
      if (error) { setError(error.message); setSaving(false); return }
    }

    router.push('/admin/articles')
    router.refresh()
  }

  const handleDelete = async () => {
    setSaving(true)
    await supabase.from('articles').delete().eq('id', article!.id)
    router.push('/admin/articles')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      {/* Title & slug */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Titre de l&apos;article *</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value, slug: nameToSlug(e.target.value) })}
            placeholder="Ex: Guide d'achat : Choisir son smartphone en 2025"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#E8691A]"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Slug URL</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="guide-achat-smartphone-2025"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#E8691A]"
          />
        </div>
      </div>

      {/* Cover image */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-bold text-[#1a2340] mb-4">Image de couverture</h2>
        {form.cover_image ? (
          <div className="relative">
            <div className="relative h-48 rounded-xl overflow-hidden">
              <Image src={form.cover_image} alt="Cover" fill className="object-cover" sizes="800px" />
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, cover_image: '' })}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#E8691A] hover:bg-[#E8691A]/5 transition-colors flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#E8691A]"
          >
            {uploading ? <LoadingSpinner size={24} /> : <ImageIcon size={32} />}
            <span className="text-sm font-medium">{uploading ? 'Envoi en cours...' : 'Cliquer pour uploader'}</span>
          </button>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-bold text-[#1a2340] mb-4">Contenu</h2>
        <RichTextEditor
          content={form.content}
          onChange={(html) => setForm((prev) => ({ ...prev, content: html }))}
        />
      </div>

      {/* Status */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <label className="flex items-center gap-4 cursor-pointer">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="w-5 h-5 accent-[#E8691A]"
          />
          <div>
            <p className="font-semibold text-[#1a2340]">Publier l&apos;article</p>
            <p className="text-sm text-gray-500">L&apos;article sera visible sur le blog public</p>
          </div>
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#E8691A] text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {saving ? <LoadingSpinner size={18} /> : (article ? 'Enregistrer' : 'Créer l\'article')}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-300 text-gray-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        {article && (
          <div className="ml-auto">
            {deleteConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-600">Confirmer la suppression ?</span>
                <button type="button" onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors">Supprimer</button>
                <button type="button" onClick={() => setDeleteConfirm(false)} className="border border-gray-300 px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Annuler</button>
              </div>
            ) : (
              <button type="button" onClick={() => setDeleteConfirm(true)} className="flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold text-sm">
                <Trash2 size={16} />Supprimer
              </button>
            )}
          </div>
        )}
      </div>
    </form>
  )
}

'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Upload, X, Trash2 } from 'lucide-react'
import type { Category, Product } from '@/types'

interface Props {
  product?: Product
  categories: Category[]
}

export function ProductForm({ product, categories }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    price: product?.price?.toString() ?? '',
    old_price: product?.old_price?.toString() ?? '',
    category_id: product?.category_id ?? '',
    in_stock: product?.in_stock ?? true,
    featured: product?.featured ?? false,
  })
  const [images, setImages] = useState<string[]>(product?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  const nameToSlug = (name: string) =>
    name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    const urls: string[] = []
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true })
      if (!error && data) {
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(data.path)
        urls.push(urlData.publicUrl)
      }
    }
    setImages((prev) => [...prev, ...urls])
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = (url: string) => setImages((prev) => prev.filter((u) => u !== url))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    const payload = {
      name: form.name,
      slug: form.slug || nameToSlug(form.name),
      description: form.description || null,
      price: parseFloat(form.price),
      old_price: form.old_price ? parseFloat(form.old_price) : null,
      category_id: form.category_id || null,
      in_stock: form.in_stock,
      featured: form.featured,
      images,
      updated_at: new Date().toISOString(),
    }

    if (product) {
      const { error } = await supabase.from('products').update(payload).eq('id', product.id)
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('products').insert(payload)
      if (error) { setError(error.message); setSaving(false); return }
    }

    router.push('/admin/products')
    router.refresh()
  }

  const handleDelete = async () => {
    setSaving(true)
    await supabase.from('products').delete().eq('id', product!.id)
    router.push('/admin/products')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {/* Basic info */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-5">
        <h2 className="text-lg font-bold text-[#1a2340]">Informations générales</h2>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom du produit *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value, slug: nameToSlug(e.target.value) })
            }}
            placeholder="Ex: iPhone 15 Pro Max 256Go"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E8691A] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Slug URL</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="iphone-15-pro-max-256go"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E8691A] focus:border-transparent font-mono text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">Généré automatiquement depuis le nom</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            placeholder="Décrivez le produit..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E8691A] focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Catégorie</label>
          <select
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E8691A] focus:border-transparent"
          >
            <option value="">— Sélectionner une catégorie —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-5">
        <h2 className="text-lg font-bold text-[#1a2340]">Prix</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Prix (MAD) *</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0.00"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E8691A] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ancien prix (MAD)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.old_price}
              onChange={(e) => setForm({ ...form, old_price: e.target.value })}
              placeholder="0.00"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E8691A] focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">Optionnel — affiche une promo barrée</p>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#1a2340]">Images</h2>
        <div className="grid grid-cols-3 gap-3">
          {images.map((url) => (
            <div key={url} className="relative aspect-square rounded-xl overflow-hidden group">
              <Image src={url} alt="Product" fill className="object-cover" sizes="200px" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-[#E8691A] hover:bg-[#E8691A]/5 transition-colors flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#E8691A]"
          >
            {uploading ? <LoadingSpinner size={24} /> : <Upload size={24} />}
            <span className="text-xs font-medium">{uploading ? 'Envoi...' : 'Ajouter'}</span>
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Status */}
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="text-lg font-bold text-[#1a2340]">Statut</h2>
        <div className="flex flex-col gap-3">
          {[
            { key: 'in_stock', label: 'En stock', desc: 'Le produit est disponible à la commande' },
            { key: 'featured', label: 'Produit vedette', desc: 'Affiché sur la page d\'accueil' },
          ].map((opt) => (
            <label key={opt.key} className="flex items-center gap-4 cursor-pointer p-3 rounded-xl hover:bg-gray-50">
              <input
                type="checkbox"
                checked={form[opt.key as keyof typeof form] as boolean}
                onChange={(e) => setForm({ ...form, [opt.key]: e.target.checked })}
                className="w-5 h-5 accent-[#E8691A]"
              />
              <div>
                <p className="font-medium text-[#1a2340]">{opt.label}</p>
                <p className="text-sm text-gray-500">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#E8691A] text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {saving ? <LoadingSpinner size={18} /> : (product ? 'Enregistrer' : 'Créer le produit')}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-gray-300 text-gray-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        {product && (
          <div className="ml-auto">
            {deleteConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-600">Confirmer la suppression ?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  Supprimer
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(false)}
                  className="border border-gray-300 px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setDeleteConfirm(true)}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold text-sm"
              >
                <Trash2 size={16} />
                Supprimer
              </button>
            )}
          </div>
        )}
      </div>
    </form>
  )
}

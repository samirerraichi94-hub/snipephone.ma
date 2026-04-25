'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'
import type { Category } from '@/types'

export default function AdminCategoriesPage() {
  const supabase = createClient()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newCat, setNewCat] = useState({ name: '', slug: '', icon: '' })
  const [editId, setEditId] = useState<string | null>(null)
  const [editData, setEditData] = useState({ name: '', slug: '', icon: '' })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const nameToSlug = (name: string) =>
    name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const load = useCallback(async () => {
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories((data as Category[]) ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const handleAdd = async () => {
    if (!newCat.name) return
    setSaving(true)
    await supabase.from('categories').insert({
      name: newCat.name,
      slug: newCat.slug || nameToSlug(newCat.name),
      icon: newCat.icon || null,
    })
    setNewCat({ name: '', slug: '', icon: '' })
    await load()
    setSaving(false)
  }

  const handleEdit = (cat: Category) => {
    setEditId(cat.id)
    setEditData({ name: cat.name, slug: cat.slug, icon: cat.icon ?? '' })
  }

  const handleSaveEdit = async () => {
    if (!editId) return
    setSaving(true)
    await supabase.from('categories').update({
      name: editData.name,
      slug: editData.slug,
      icon: editData.icon || null,
    }).eq('id', editId)
    setEditId(null)
    await load()
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    setSaving(true)
    await supabase.from('categories').delete().eq('id', id)
    setDeleteId(null)
    await load()
    setSaving(false)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#1a2340] mb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Catégories
      </h1>

      {/* Add form */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-bold text-[#1a2340] mb-4">Ajouter une catégorie</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom *</label>
            <input
              type="text"
              value={newCat.name}
              onChange={(e) => setNewCat({ ...newCat, name: e.target.value, slug: nameToSlug(e.target.value) })}
              placeholder="Ex: Téléphones"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#E8691A]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Slug</label>
            <input
              type="text"
              value={newCat.slug}
              onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
              placeholder="telephones"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#E8691A] font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Icône (emoji)</label>
            <input
              type="text"
              value={newCat.icon}
              onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })}
              placeholder="📱"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#E8691A]"
            />
          </div>
        </div>
        <button
          onClick={handleAdd}
          disabled={saving || !newCat.name}
          className="bg-[#E8691A] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
          {saving ? <LoadingSpinner size={16} /> : <Plus size={16} />}
          Ajouter
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><LoadingSpinner size={32} /></div>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Aucune catégorie</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Icône</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Nom</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Slug</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-2xl">{cat.icon ?? '📦'}</td>
                  {editId === cat.id ? (
                    <>
                      <td className="px-6 py-4">
                        <input
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#E8691A]"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          value={editData.slug}
                          onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
                          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-full font-mono focus:outline-none focus:ring-2 focus:ring-[#E8691A]"
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={handleSaveEdit} className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors"><Check size={16} /></button>
                          <button onClick={() => setEditId(null)} className="text-gray-400 hover:bg-gray-100 p-2 rounded-lg transition-colors"><X size={16} /></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 font-medium text-[#1a2340]">{cat.name}</td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-sm">{cat.slug}</td>
                      <td className="px-6 py-4 text-right">
                        {deleteId === cat.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-sm text-red-600">Supprimer ?</span>
                            <button onClick={() => handleDelete(cat.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors">Oui</button>
                            <button onClick={() => setDeleteId(null)} className="border border-gray-300 px-3 py-1 rounded-lg text-sm hover:bg-gray-50">Non</button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEdit(cat)} className="text-gray-500 hover:text-[#E8691A] hover:bg-[#E8691A]/10 p-2 rounded-lg transition-colors"><Pencil size={16} /></button>
                            <button onClick={() => setDeleteId(cat.id)} className="text-gray-500 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
                          </div>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

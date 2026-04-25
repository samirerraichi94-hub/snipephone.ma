'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Props {
  productId: string
  field: 'in_stock' | 'featured'
  value: boolean
}

export function AdminProductActions({ productId, field, value }: Props) {
  const [checked, setChecked] = useState(value)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const toggle = async () => {
    setLoading(true)
    const newVal = !checked
    setChecked(newVal)
    await supabase.from('products').update({ [field]: newVal }).eq('id', productId)
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-[#E8691A]' : 'bg-gray-300'
      } ${loading ? 'opacity-60' : ''}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

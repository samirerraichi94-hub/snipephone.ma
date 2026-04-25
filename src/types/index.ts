export interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  old_price: number | null
  category_id: string | null
  images: string[]
  in_stock: boolean
  featured: boolean
  created_at: string
  updated_at: string
  categories?: Category
}

export interface Article {
  id: string
  title: string
  slug: string
  content: string | null
  cover_image: string | null
  published: boolean
  created_at: string
  updated_at: string
}

export interface Admin {
  id: string
  email: string
  created_at: string
}

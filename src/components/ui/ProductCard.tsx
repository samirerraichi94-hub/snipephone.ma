import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Tag } from 'lucide-react'
import type { Product } from '@/types'

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  const waText = encodeURIComponent(
    `Bonjour Snipe Phone, je suis intéressé par ${product.name}`
  )
  const waLink = `https://wa.me/212648045594?text=${waText}`
  const discount =
    product.old_price && product.old_price > product.price
      ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
      : null

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Image */}
      <div className="relative h-52 bg-gray-100 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ShoppingCart size={40} />
          </div>
        )}
        {discount && (
          <div className="absolute top-2 left-2 bg-[#E8691A] text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
            <Tag size={12} />
            -{discount}%
          </div>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-800 font-semibold px-3 py-1 rounded-full text-sm">
              Rupture de stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/products/${product.slug}`} className="group/link">
          <h3 className="font-semibold text-[#1a2340] group-hover/link:text-[#E8691A] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-[#E8691A] font-bold text-xl">
            {product.price.toLocaleString('fr-MA')} MAD
          </span>
          {product.old_price && (
            <span className="text-gray-400 line-through text-sm">
              {product.old_price.toLocaleString('fr-MA')} MAD
            </span>
          )}
        </div>

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-auto pt-3 block w-full text-center py-2.5 rounded-xl font-semibold text-sm transition-colors ${
            product.in_stock
              ? 'bg-[#E8691A] text-white hover:bg-orange-600'
              : 'bg-gray-200 text-gray-500 pointer-events-none'
          }`}
        >
          {product.in_stock ? 'Commander via WhatsApp' : 'Indisponible'}
        </a>
      </div>
    </div>
  )
}

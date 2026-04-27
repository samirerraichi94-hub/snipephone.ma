'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, Phone } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/products', label: 'Produits' },
  { href: '/categories/telephones', label: 'Téléphones' },
  { href: '/categories/accessoires', label: 'Accessoires' },
  { href: '/categories/pc-laptops', label: 'PC & Laptops' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-[#1a2340] shadow-lg sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-dark.png"
              alt="Snipe Phone"
              width={320}
              height={180}
              className="h-20 w-auto object-contain"
              style={{ mixBlendMode: 'screen' }}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://wa.me/212648045594"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#E8691A] text-white px-4 py-2 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-sm"
            >
              <Phone size={16} />
              Commander via WhatsApp
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-[#111828] border-t border-gray-700">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-gray-300 hover:text-white font-medium transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://wa.me/212648045594"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#E8691A] text-white px-4 py-2 rounded-xl font-semibold mt-3 justify-center"
            >
              <Phone size={16} />
              Commander via WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

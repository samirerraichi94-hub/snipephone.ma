import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail } from 'lucide-react'

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="bg-[#1a2340] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Image
              src="/logo-black.png"
              alt="Snipe Phone"
              width={160}
              height={60}
              className="h-16 w-auto object-contain mb-4"
              style={{ mixBlendMode: 'screen' }}
            />
            <p className="text-sm text-gray-400">
              Votre spécialiste en téléphones, accessoires, PC, tablettes et caméras de surveillance à Temara.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/products', label: 'Tous les produits' },
                { href: '/blog', label: 'Blog' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#E8691A] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Catégories</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/categories/telephones', label: '📱 Téléphones' },
                { href: '/categories/accessoires', label: '🎧 Accessoires' },
                { href: '/categories/pc-laptops', label: '💻 PC & Laptops' },
                { href: '/categories/tablettes', label: '📟 Tablettes' },
                { href: '/categories/cameras', label: '📷 Caméras' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#E8691A] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-[#E8691A] mt-0.5 shrink-0" />
                <span>Oulad Metaa - Temara, Séquence 2, IMB 21 Mag 49</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-[#E8691A] shrink-0" />
                <div>
                  <a href="tel:0537608588" className="hover:text-[#E8691A] transition-colors block">05.37.60.85.88</a>
                  <a href="tel:0648045594" className="hover:text-[#E8691A] transition-colors block">06.48.04.55.94</a>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-[#E8691A] shrink-0" />
                <a href="mailto:snipephonecontact@gmail.com" className="hover:text-[#E8691A] transition-colors">
                  snipephonecontact@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <InstagramIcon size={16} />
                <a
                  href="https://instagram.com/snipe_phone"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E8691A] transition-colors"
                >
                  @snipe_phone
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Snipe Phone. Tous droits réservés.</p>
          <p>Temara, Maroc</p>
        </div>
      </div>
    </footer>
  )
}

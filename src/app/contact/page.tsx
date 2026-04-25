'use client'

import { useState } from 'react'
import { PublicLayout } from '@/components/layouts/PublicLayout'
import { MapPin, Phone, Mail, MessageCircle, Send } from 'lucide-react'

function InstagramIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E8691A]">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  )
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault()
    const text = encodeURIComponent(
      `Bonjour Snipe Phone,\n\nNom: ${form.name}\nTéléphone: ${form.phone}\n\nMessage:\n${form.message}`
    )
    window.open(`https://wa.me/212648045594?text=${text}`, '_blank')
  }

  return (
    <PublicLayout>
      <div className="bg-[#1a2340] text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Contact</h1>
          <p className="text-gray-400">Nous sommes là pour vous aider</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <h2 className="text-2xl font-bold text-[#1a2340] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Nos coordonnées
            </h2>
            <div className="space-y-6">
              {[
                {
                  icon: <MapPin className="text-[#E8691A]" size={22} />,
                  title: 'Adresse',
                  content: 'Oulad Metaa - Temara\nSéquence 2, IMB 21 Mag 49',
                },
                {
                  icon: <Phone className="text-[#E8691A]" size={22} />,
                  title: 'Téléphone',
                  content: '05.37.60.85.88\n06.48.04.55.94',
                  links: ['tel:0537608588', 'tel:0648045594'],
                },
                {
                  icon: <Mail className="text-[#E8691A]" size={22} />,
                  title: 'Email',
                  content: 'snipephonecontact@gmail.com',
                  links: ['mailto:snipephonecontact@gmail.com'],
                },
                {
                  icon: <InstagramIcon size={22} />,
                  title: 'Instagram',
                  content: '@snipe_phone',
                  links: ['https://instagram.com/snipe_phone'],
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="mt-1">{item.icon}</div>
                  <div>
                    <p className="font-semibold text-[#1a2340]">{item.title}</p>
                    {item.links ? (
                      item.content.split('\n').map((line, i) => (
                        <a
                          key={i}
                          href={item.links![i] ?? '#'}
                          className="block text-gray-600 hover:text-[#E8691A] transition-colors"
                          target={item.links![i]?.startsWith('http') ? '_blank' : undefined}
                          rel={item.links![i]?.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {line}
                        </a>
                      ))
                    ) : (
                      item.content.split('\n').map((line, i) => (
                        <p key={i} className="text-gray-600">{line}</p>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <div className="mt-8 p-6 bg-[#E8691A]/10 rounded-2xl border border-[#E8691A]/20">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="text-[#E8691A]" size={24} />
                <h3 className="font-bold text-[#1a2340]">Réponse rapide via WhatsApp</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Pour une réponse immédiate, contactez-nous directement sur WhatsApp. Nous répondons en moins de 30 minutes !
              </p>
              <a
                href="https://wa.me/212648045594"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#E8691A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors inline-flex items-center gap-2"
              >
                📲 Ouvrir WhatsApp
              </a>
            </div>

            {/* Map embed */}
            <div className="mt-8 rounded-2xl overflow-hidden h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13289.33!2d-6.9!3d33.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDU0JzAwLjAiTiA2wrA1NCcwMC4wIlc!5e0!3m2!1sfr!2sma!4v1620000000000!5m2!1sfr!2sma"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Snipe Phone - Temara"
              />
            </div>
          </div>

          {/* Contact form → WhatsApp */}
          <div>
            <h2 className="text-2xl font-bold text-[#1a2340] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Envoyez-nous un message
            </h2>
            <form onSubmit={handleWhatsApp} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Votre nom *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Mohamed Alaoui"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E8691A] focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Numéro de téléphone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Ex: 06 XX XX XX XX"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E8691A] focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Votre message *
                </label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={6}
                  placeholder="Décrivez votre besoin ou posez votre question..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E8691A] focus:border-transparent transition resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#E8691A] text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-3 text-lg"
              >
                <Send size={20} />
                Envoyer via WhatsApp
              </button>
              <p className="text-sm text-gray-500 text-center">
                Ce formulaire ouvre WhatsApp avec votre message pré-rempli.
              </p>
            </form>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Snipe Phone — Find your solution',
    template: '%s | Snipe Phone',
  },
  description:
    'Snipe Phone — Votre spécialiste en téléphones, accessoires, PC, laptops, tablettes et caméras de surveillance à Temara, Maroc.',
  keywords: ['téléphone', 'smartphone', 'accessoires', 'PC', 'laptop', 'tablette', 'Temara', 'Maroc'],
  openGraph: {
    title: 'Snipe Phone — Find your solution',
    description: 'Votre spécialiste tech à Temara, Maroc',
    locale: 'fr_MA',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  )
}

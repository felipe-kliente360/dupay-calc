import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dupay — Calculadora de Brassagem',
    short_name: 'Dupay',
    description: 'Calculadora de brassagem para homebrewers. Calcule OG, IBU, SRM, ABV e volumes de água.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF8F3',
    theme_color: '#B87210',
    orientation: 'portrait-primary',
    categories: ['utilities', 'food'],
    icons: [
      { src: '/icon', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  }
}

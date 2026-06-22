import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ZCOMPUTER - Hi-End PC',
    short_name: 'ZCOMPUTER',
    description: 'Hệ thống bán lẻ PC Gaming, Laptop, Workstation hàng đầu',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#dc2626',
    icons: [
      {
        src: '/logo-full.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
        purpose: 'any'
      },
      {
        src: '/logo-full.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'any'
      },
      {
        src: '/logo-full.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
        purpose: 'maskable'
      },
      {
        src: '/logo-full.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'maskable'
      },
    ],
  }
}

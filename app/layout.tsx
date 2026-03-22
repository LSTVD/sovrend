import type { Metadata } from 'next'
import type { Viewport } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'SOVREND — The place where the thought becomes the thing.',
  description: 'Build anything. Own everything.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'SOVREND',
    description: 'Where ideas become real. Build anything. Own everything.',
    url: 'https://sovrend.com',
    siteName: 'SOVREND',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

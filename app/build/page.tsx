'use client'

import { Suspense } from 'react'
import BuildContent from './_content'

export default function BuildPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p style={{ color: '#00FF41', fontFamily: 'Share Tech Mono, monospace', fontSize: '12px', letterSpacing: '0.2em', animation: 'pulse 2s infinite' }}>
          INITIALISING THE GRID...
        </p>
      </main>
    }>
      <BuildContent />
    </Suspense>
  )
}

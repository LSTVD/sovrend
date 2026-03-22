'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function NotFound() {
  const [glitch, setGlitch] = useState(true)

  useEffect(() => {
    setTimeout(() => setGlitch(false), 300)
  }, [])

  return (
    <main
      className="min-h-screen bg-black flex items-center justify-center px-6"
      style={{ animation: glitch ? 'glitch 0.3s ease forwards' : 'none' }}
    >
      <div className="text-center max-w-lg">
        <p style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(240,240,255,0.2)', textTransform: 'uppercase', marginBottom: '24px' }}>
          404
        </p>
        <p
          className="mb-8"
          style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '16px', color: 'rgba(240,240,255,0.6)', lineHeight: 1.8, letterSpacing: '0.05em' }}
        >
          You followed a path that doesn't exist yet.
          <br />
          <span style={{ color: '#00FF41' }}>That's not an error. That's an invitation.</span>
        </p>
        <Link
          href="/"
          className="inline-block px-10 py-4 text-black text-xs tracking-widest uppercase"
          style={{ background: '#00FF41', fontFamily: 'Orbitron, sans-serif', fontWeight: 700 }}
          onMouseEnter={e => (e.target as HTMLElement).style.boxShadow = '0 0 30px rgba(0,255,65,0.5)'}
          onMouseLeave={e => (e.target as HTMLElement).style.boxShadow = 'none'}
        >
          ENTER THE GRID →
        </Link>
      </div>
    </main>
  )
}

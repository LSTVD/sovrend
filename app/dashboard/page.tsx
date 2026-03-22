'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null)
  const [apps, setApps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }

      const { data: ud } = await supabase.from('users').select('*').eq('id', user.id).single()
      setUserData(ud)

      const { data: ap } = await supabase.from('apps').select('*').eq('user_id', user.id).order('updated_at', { ascending: false })
      setApps(ap || [])
      setLoading(false)
      setTimeout(() => setVisible(true), 100)
    }
    load()
  }, [])

  async function signOut() {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <p style={{ color: '#00FF41', fontFamily: 'Share Tech Mono, monospace', fontSize: '12px', letterSpacing: '0.2em', animation: 'pulse 2s infinite' }}>
          LOADING THE GRID...
        </p>
      </main>
    )
  }

  const tier = userData?.tier || 'free'
  const buildsUsed = userData?.builds_used || 0
  const tierColor = tier === 'agency' ? '#F0F0FF' : tier === 'builder' ? '#00E5FF' : '#00FF41'

  const persona = userData?.persona || 'operator'
  const emptyStateText = persona === 'operator'
    ? 'What have you been imagining?'
    : persona === 'architect'
    ? 'What are you ready to bring into existence?'
    : "What do you see that's waiting to exist?"

  return (
    <main className="min-h-screen bg-black text-white">

      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h1
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '18px',
            fontWeight: 900,
            color: '#00FF41',
            letterSpacing: '0.15em',
            textShadow: '0 0 20px rgba(0,255,65,0.4)',
          }}
        >
          SOVREND
        </h1>
        <div className="flex items-center gap-6">
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '10px', letterSpacing: '0.2em', color: tierColor, textTransform: 'uppercase' }}>
            {tier}
          </span>
          <button
            onClick={signOut}
            style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(240,240,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}
            onMouseEnter={e => (e.target as HTMLElement).style.color = 'rgba(240,240,255,0.7)'}
            onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(240,240,255,0.3)'}
          >
            EXIT
          </button>
        </div>
      </header>

      <div
        className="max-w-4xl mx-auto px-6 py-12"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease' }}
      >

        {/* New Build CTA */}
        <div className="text-center mb-16">
          <Link
            href="/build"
            className="inline-block px-14 py-5 text-black text-sm tracking-widest uppercase transition-all duration-300"
            style={{ background: '#00FF41', fontFamily: 'Orbitron, sans-serif', fontWeight: 700 }}
            onMouseEnter={e => (e.target as HTMLElement).style.boxShadow = '0 0 40px rgba(0,255,65,0.5)'}
            onMouseLeave={e => (e.target as HTMLElement).style.boxShadow = 'none'}
          >
            + NEW BUILD
          </Link>
          <p className="mt-4" style={{ color: 'rgba(240,240,255,0.2)', fontFamily: 'Share Tech Mono, monospace', fontSize: '11px', letterSpacing: '0.1em' }}>
            {emptyStateText}
          </p>
        </div>

        {/* Apps Grid */}
        {apps.length === 0 ? (
          <div className="text-center py-20">
            <p style={{ color: 'rgba(240,240,255,0.15)', fontFamily: 'Share Tech Mono, monospace', fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              No builds yet. The Grid is waiting.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apps.map(app => (
              <Link
                key={app.id}
                href={`/build?app=${app.id}`}
                className="block p-6 transition-all duration-200"
                style={{ background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.06)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,255,65,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '12px', fontWeight: 700, color: '#F0F0FF', letterSpacing: '0.1em' }}>
                    {app.name}
                  </h3>
                  {app.is_published && (
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '9px', color: '#00FF41', letterSpacing: '0.15em' }}>LIVE</span>
                  )}
                </div>
                <p style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '11px', color: 'rgba(240,240,255,0.3)', marginBottom: '16px', lineHeight: 1.6 }}>
                  {app.description || 'No description'}
                </p>
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '9px', color: 'rgba(240,240,255,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{app.persona}</span>
                  <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '9px', color: 'rgba(240,240,255,0.2)' }}>{app.refines_used || 0} refines</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Upgrade nudge */}
        {tier === 'free' && buildsUsed >= 2 && (
          <div className="mt-16 p-8 text-center" style={{ border: '1px solid rgba(0,255,65,0.2)' }}>
            <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#00FF41', letterSpacing: '0.15em', marginBottom: '8px', textShadow: '0 0 20px rgba(0,255,65,0.4)' }}>
              YOU HAVE THE GLOW.
            </p>
            <p style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '12px', color: 'rgba(240,240,255,0.4)', marginBottom: '24px', letterSpacing: '0.05em' }}>
              You've built {buildsUsed} apps. Time to go further.
            </p>
            <a
              href="https://buy.stripe.com/4gM4gybALae28nw1HC04801"
              className="inline-block px-10 py-4 text-black text-xs tracking-widest uppercase transition-all duration-300"
              style={{ background: '#00FF41', fontFamily: 'Orbitron, sans-serif', fontWeight: 700 }}
              onMouseEnter={e => (e.target as HTMLElement).style.boxShadow = '0 0 30px rgba(0,255,65,0.5)'}
              onMouseLeave={e => (e.target as HTMLElement).style.boxShadow = 'none'}
            >
              BUILD LIKE FLYNN → $29/month
            </a>
          </div>
        )}

      </div>

      {/* Prototype badge */}
      <div
        className="fixed top-4 right-4 z-50 px-3 py-1 text-xs tracking-widest"
        style={{ border: '1px solid rgba(255,227,0,0.4)', color: 'rgba(255,227,0,0.6)', fontFamily: 'Share Tech Mono, monospace', background: 'rgba(0,0,0,0.8)' }}
      >
        PROTOTYPE
      </div>
    </main>
  )
}

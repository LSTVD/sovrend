'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const PERSONA_EMPTY = {
  operator: 'What have you been imagining?',
  architect: 'What are you ready to bring into existence?',
  oracle: "What do you see that's waiting to exist?",
}

export default function BuildContent() {
  const [userData, setUserData] = useState<any>(null)
  const [prompt, setPrompt] = useState('')
  const [building, setBuilding] = useState(false)
  const [narration, setNarration] = useState('')
  const [code, setCode] = useState('')
  const [appId, setAppId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [glitch, setGlitch] = useState(false)
  const [visible, setVisible] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    async function load() {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }

      const { data: ud } = await supabase.from('users').select('*').eq('id', user.id).single()
      setUserData(ud)

      const existingAppId = searchParams.get('app')
      if (existingAppId) {
        setAppId(existingAppId)
        const { data: app } = await supabase.from('apps').select('*').eq('id', existingAppId).single()
        if (app?.code) setCode(app.code)
      }
      setTimeout(() => setVisible(true), 100)
    }
    load()
  }, [])

  async function handleBuild() {
    if (!prompt.trim() || building) return
    setBuilding(true)
    setError('')
    setNarration('THE GRID IS RESPONDING...')

    try {
      const res = await fetch('/api/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, appId, persona: userData?.persona || 'operator' })
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.error === 'hard') {
          setGlitch(true)
          setTimeout(() => setGlitch(false), 400)
        }
        setError(data.message || 'Something went wrong.')
        setNarration('')
        return
      }

      setCode(data.code)
      setNarration(data.narration)
      setAppId(data.appId)
      setPrompt('')
    } catch {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 400)
      setError('Connection lost. The Grid is unreachable.')
      setNarration('')
    } finally {
      setBuilding(false)
    }
  }

  const persona = userData?.persona || 'operator'
  const emptyState = PERSONA_EMPTY[persona as keyof typeof PERSONA_EMPTY] || 'What would you build today?'

  return (
    <main
      className="min-h-screen bg-black text-white"
      style={{ animation: glitch ? 'glitch 0.3s ease forwards' : 'none' }}
    >

      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <button
          onClick={() => router.push('/dashboard')}
          style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(240,240,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}
          onMouseEnter={e => (e.target as HTMLElement).style.color = 'rgba(240,240,255,0.7)'}
          onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(240,240,255,0.3)'}
        >
          ← GRID
        </button>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#00FF41', letterSpacing: '0.2em', textShadow: '0 0 15px rgba(0,255,65,0.4)' }}>
          SOVREND
        </h1>
        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(240,240,255,0.2)', textTransform: 'uppercase' }}>
          {persona}
        </span>
      </header>

      <div
        className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-6"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease' }}
      >

        {/* Narration */}
        {narration && (
          <div style={{ border: '1px solid rgba(0,255,65,0.2)', padding: '16px' }}>
            <p style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '12px', color: '#00FF41', letterSpacing: '0.08em', lineHeight: 1.7 }}>
              {narration}
            </p>
          </div>
        )}

        {/* Code output */}
        {code && (
          <div style={{ border: '1px solid rgba(255,255,255,0.06)', background: '#050505', overflow: 'hidden' }}>
            <div
              className="flex items-center justify-between px-4 py-2"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(240,240,255,0.3)', textTransform: 'uppercase' }}>OUTPUT</span>
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '9px', letterSpacing: '0.15em', color: 'rgba(240,240,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#00FF41'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(240,240,255,0.3)'}
              >
                COPY
              </button>
            </div>
            <pre style={{ padding: '16px', fontFamily: 'Share Tech Mono, monospace', fontSize: '12px', color: 'rgba(240,240,255,0.5)', lineHeight: 1.7, overflowX: 'auto', maxHeight: '400px' }}>
              {code}
            </pre>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ border: '1px solid rgba(255,49,49,0.3)', padding: '16px' }}>
            <p style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '12px', color: '#FF3131', letterSpacing: '0.08em' }}>
              {error}
            </p>
          </div>
        )}

        {/* Prompt input */}
        <div
          style={{ border: '1px solid rgba(255,255,255,0.08)', transition: 'border-color 0.2s' }}
          onFocusCapture={e => (e.currentTarget.style.borderColor = 'rgba(0,255,65,0.3)')}
          onBlurCapture={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
        >
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleBuild() }}
            placeholder={emptyState}
            maxLength={2000}
            rows={5}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              padding: '16px',
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '13px',
              color: 'rgba(240,240,255,0.8)',
              resize: 'none',
              lineHeight: 1.7,
            }}
          />
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '9px', color: 'rgba(240,240,255,0.2)', letterSpacing: '0.1em' }}>
              {prompt.length}/2000
            </span>
            <button
              onClick={handleBuild}
              disabled={building || !prompt.trim()}
              className="px-8 py-2 text-black text-xs tracking-widest uppercase transition-all duration-200"
              style={{
                background: building || !prompt.trim() ? 'rgba(0,255,65,0.3)' : '#00FF41',
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 700,
                cursor: building || !prompt.trim() ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => { if (!building && prompt.trim()) (e.target as HTMLElement).style.boxShadow = '0 0 20px rgba(0,255,65,0.4)' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.boxShadow = 'none' }}
            >
              {building ? 'BUILDING...' : code ? 'REFINE' : 'BUILD'}
            </button>
          </div>
        </div>

        <p style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '10px', color: 'rgba(240,240,255,0.15)', textAlign: 'center', letterSpacing: '0.1em' }}>
          ⌘ + ENTER TO BUILD
        </p>

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

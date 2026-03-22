'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  async function handleSubmit() {
    if (!email || !password) { setError('Enter your email and password.'); return }
    setLoading(true)
    setError('')
    setMessage('')

    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      })
      if (error) setError(error.message)
      else setMessage('Check your email to confirm your account.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,255,65,0.03) 0%, transparent 70%)' }}
      />

      <div
        className="w-full max-w-sm relative z-10"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease',
        }}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <h1
            className="font-display text-3xl font-black tracking-widest mb-2"
            style={{
              color: '#00FF41',
              fontFamily: 'Orbitron, sans-serif',
              textShadow: '0 0 20px rgba(0,255,65,0.5)',
            }}
          >
            SOVREND
          </h1>
          <p style={{ color: 'rgba(240,240,255,0.3)', fontFamily: 'Share Tech Mono, monospace', fontSize: '11px', letterSpacing: '0.2em' }}>
            {mode === 'signin' ? 'WELCOME BACK, OPERATOR.' : 'BEGIN YOUR AWAKENING.'}
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-black text-white px-4 py-3 text-sm outline-none transition-all duration-200"
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
              fontFamily: 'Share Tech Mono, monospace',
              letterSpacing: '0.05em',
              color: '#F0F0FF',
            }}
            onFocus={e => (e.target.style.borderColor = 'rgba(0,255,65,0.5)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
          <input
            type="password"
            placeholder="PASSWORD"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
            className="w-full bg-black text-white px-4 py-3 text-sm outline-none transition-all duration-200"
            style={{
              border: '1px solid rgba(255,255,255,0.1)',
              fontFamily: 'Share Tech Mono, monospace',
              letterSpacing: '0.05em',
              color: '#F0F0FF',
            }}
            onFocus={e => (e.target.style.borderColor = 'rgba(0,255,65,0.5)')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />

          {error && (
            <p style={{ color: '#FF3131', fontFamily: 'Share Tech Mono, monospace', fontSize: '11px', letterSpacing: '0.1em' }}>
              {error}
            </p>
          )}
          {message && (
            <p style={{ color: '#00FF41', fontFamily: 'Share Tech Mono, monospace', fontSize: '11px', letterSpacing: '0.1em' }}>
              {message}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 text-black text-xs tracking-widest uppercase transition-all duration-300 mt-2"
            style={{
              background: loading ? 'rgba(0,255,65,0.5)' : '#00FF41',
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => { if (!loading) (e.target as HTMLElement).style.boxShadow = '0 0 30px rgba(0,255,65,0.5)' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.boxShadow = 'none' }}
          >
            {loading ? 'CONNECTING...' : mode === 'signin' ? 'ENTER THE GRID' : 'AWAKEN'}
          </button>

          <div className="text-center mt-4">
            <span style={{ color: 'rgba(240,240,255,0.3)', fontFamily: 'Share Tech Mono, monospace', fontSize: '11px' }}>
              {mode === 'signin' ? "No account? " : "Have an account? "}
            </span>
            <button
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setMessage('') }}
              style={{ color: '#00FF41', fontFamily: 'Share Tech Mono, monospace', fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {mode === 'signin' ? 'CREATE ACCOUNT' : 'SIGN IN'}
            </button>
          </div>
        </div>
      </div>

      {/* Prototype badge */}
      <div
        className="fixed top-4 right-4 z-50 px-3 py-1 text-xs tracking-widest"
        style={{
          border: '1px solid rgba(255,227,0,0.4)',
          color: 'rgba(255,227,0,0.6)',
          fontFamily: 'Share Tech Mono, monospace',
          background: 'rgba(0,0,0,0.8)',
        }}
      >
        PROTOTYPE
      </div>
    </main>
  )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const x = c.getContext('2d')
    if (!x) return
    function resize() { c!.width = window.innerWidth; c!.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const rain: any[] = []
    for (let i = 0; i < 220; i++) rain.push({ x: Math.random() * 2400, y: Math.random() * 2000, len: Math.random() * 22 + 8, spd: Math.random() * 3 + 1.5, a: Math.random() * 0.055 + 0.01, drift: Math.random() * 0.3 - 0.15 })
    const dust: any[] = []
    for (let i = 0; i < 45; i++) dust.push({ x: Math.random() * 2000, y: Math.random() * 2000, vx: (Math.random() - 0.5) * 0.2, vy: -Math.random() * 0.15 - 0.03, s: Math.random() * 2 + 0.3, a: Math.random() * 0.07 + 0.01, col: Math.random() > 0.45 ? '255,106,0' : '0,229,255' })
    const streaks: any[] = []
    let raf: number
    function draw() {
      if (!c || !x) return
      x.clearRect(0, 0, c.width, c.height)
      rain.forEach(d => {
        d.y += d.spd; d.x += d.drift
        if (d.y > c!.height) { d.y = -d.len; d.x = Math.random() * c!.width }
        if (d.x < -50) d.x = c!.width + 50
        if (d.x > c!.width + 50) d.x = -50
        x!.beginPath(); x!.moveTo(d.x, d.y); x!.lineTo(d.x - 0.3, d.y + d.len)
        x!.strokeStyle = 'rgba(0,229,255,' + d.a + ')'; x!.lineWidth = 0.5; x!.stroke()
      })
      dust.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.y < -10) { p.y = c!.height + 10; p.x = Math.random() * c!.width }
        if (p.x < -10) p.x = c!.width + 10
        if (p.x > c!.width + 10) p.x = -10
        x!.beginPath(); x!.arc(p.x, p.y, p.s, 0, Math.PI * 2)
        x!.fillStyle = 'rgba(' + p.col + ',' + p.a + ')'; x!.fill()
      })
      if (streaks.length < 3 && Math.random() < 0.005) {
        streaks.push({ y: Math.random() * c.height, x: -100, w: Math.random() * 200 + 100, spd: Math.random() * 3 + 2, a: Math.random() * 0.03 + 0.01, col: Math.random() > 0.5 ? '255,106,0' : '0,229,255' })
      }
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i]; s.x += s.spd
        const grd = x.createLinearGradient(s.x, 0, s.x + s.w, 0)
        grd.addColorStop(0, 'rgba(' + s.col + ',0)')
        grd.addColorStop(0.5, 'rgba(' + s.col + ',' + s.a + ')')
        grd.addColorStop(1, 'rgba(' + s.col + ',0)')
        x.fillStyle = grd; x.fillRect(s.x, s.y, s.w, 1)
        if (s.x > c.width + 200) streaks.splice(i, 1)
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf) }
  }, [])

  async function handleSubmit() {
    if (!email || !password) { setError('Enter your email and password.'); return }
    setLoading(true); setError(''); setMessage('')
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + '/auth/callback' } })
      if (error) setError(error.message); else setMessage('Check your email to confirm your account.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message); else router.push('/dashboard')
    }
    setLoading(false)
  }

  function toggleMode() { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setMessage('') }

  return (
    <main style={{ position: 'fixed', inset: 0, background: '#080606', fontFamily: "'Share Tech Mono', monospace", overflow: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 998, background: 'repeating-linear-gradient(to bottom,transparent 0,transparent 3px,rgba(255,255,255,0.012) 3px,rgba(255,255,255,0.012) 4px)' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 20% 40%,rgba(255,106,0,0.05) 0%,transparent 50%),radial-gradient(ellipse at 80% 60%,rgba(0,229,255,0.04) 0%,transparent 50%),radial-gradient(ellipse at 50% 100%,rgba(255,106,0,0.02) 0%,transparent 40%)' }} />
      <div style={{ position: 'fixed', left: 0, right: 0, height: '1px', zIndex: 3, pointerEvents: 'none', background: 'linear-gradient(90deg,transparent 5%,rgba(255,106,0,0.1) 25%,rgba(0,229,255,0.07) 75%,transparent 95%)', animation: 'bscan 10s ease-in-out infinite' }} />
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 1 }} />
      <div style={{ position: 'fixed', top: 24, left: 24, width: 40, height: 40, borderTop: '1px solid rgba(255,106,0,0.12)', borderLeft: '1px solid rgba(255,106,0,0.12)', zIndex: 5, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', top: 24, right: 24, width: 40, height: 40, borderTop: '1px solid rgba(0,229,255,0.08)', borderRight: '1px solid rgba(0,229,255,0.08)', zIndex: 5, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: 24, left: 24, width: 40, height: 40, borderBottom: '1px solid rgba(255,106,0,0.08)', borderLeft: '1px solid rgba(255,106,0,0.08)', zIndex: 5, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: 24, right: 24, width: 40, height: 40, borderBottom: '1px solid rgba(0,229,255,0.06)', borderRight: '1px solid rgba(0,229,255,0.06)', zIndex: 5, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, padding: '4px 10px', fontFamily: "'Share Tech Mono', monospace", fontSize: '9px', letterSpacing: '0.15em', border: '1px solid rgba(255,227,0,0.3)', color: 'rgba(255,227,0,0.5)', background: 'rgba(0,0,0,0.7)' }}>PROTOTYPE</div>
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
        <div style={{ width: 380, maxWidth: 'calc(100vw - 48px)', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.8s ease' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, borderBottom: '1px solid rgba(255,106,0,0.15)', paddingBottom: 16 }}>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 'clamp(24px,5vw,30px)', fontWeight: 900, letterSpacing: '0.2em', background: 'linear-gradient(135deg,#FF6A00 20%,#00E5FF 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 12px rgba(255,106,0,0.15))' }}>SOVREND</div>
            <div style={{ fontSize: 9, letterSpacing: '0.12em', color: 'rgba(255,106,0,0.3)', textAlign: 'right' as const, lineHeight: 1.7 }}>SYSTEM v1.0<br /><span style={{ color: 'rgba(0,229,255,0.25)' }}>AUTHENTICATION REQ.</span></div>
          </div>
          <div style={{ fontSize: 9, letterSpacing: '0.25em', color: 'rgba(255,106,0,0.25)', marginBottom: 28, textTransform: 'uppercase' as const, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,106,0,0.3)', boxShadow: '0 0 8px rgba(255,106,0,0.2)', animation: 'pulse 2s ease-in-out infinite' }} />
            {mode === 'signin' ? 'OPERATOR SIGN IN' : 'NEW OPERATOR REGISTRATION'}
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,106,0,0.4)', marginBottom: 6, display: 'block', textTransform: 'uppercase' as const }}>{mode === 'signin' ? 'IDENTIFICATION' : 'NEW IDENTIFICATION'}</label>
            <input type="email" placeholder="Enter email address" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" style={{ width: '100%', background: 'rgba(255,255,255,0.015)', border: 'none', borderBottom: '1px solid rgba(255,106,0,0.15)', color: '#F0F0FF', padding: '12px 0', fontFamily: "'Share Tech Mono', monospace", fontSize: 14, letterSpacing: '0.04em', outline: 'none', transition: 'all 0.4s ease' }} onFocus={e => { e.target.style.borderBottomColor = '#FF6A00'; e.target.style.boxShadow = '0 4px 20px rgba(255,106,0,0.06)' }} onBlur={e => { e.target.style.borderBottomColor = 'rgba(255,106,0,0.15)'; e.target.style.boxShadow = 'none' }} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,106,0,0.4)', marginBottom: 6, display: 'block', textTransform: 'uppercase' as const }}>PASSPHRASE</label>
            <input type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} style={{ width: '100%', background: 'rgba(255,255,255,0.015)', border: 'none', borderBottom: '1px solid rgba(255,106,0,0.15)', color: '#F0F0FF', padding: '12px 0', fontFamily: "'Share Tech Mono', monospace", fontSize: 14, letterSpacing: '0.04em', outline: 'none', transition: 'all 0.4s ease' }} onFocus={e => { e.target.style.borderBottomColor = '#FF6A00'; e.target.style.boxShadow = '0 4px 20px rgba(255,106,0,0.06)' }} onBlur={e => { e.target.style.borderBottomColor = 'rgba(255,106,0,0.15)'; e.target.style.boxShadow = 'none' }} />
          </div>
          <div style={{ minHeight: 16, marginBottom: 16 }}>
            {error && <p style={{ color: '#FF3131', fontSize: 11, letterSpacing: '0.08em', fontFamily: "'Share Tech Mono', monospace" }}>{error}</p>}
            {message && <p style={{ color: '#00E5FF', fontSize: 11, letterSpacing: '0.08em', fontFamily: "'Share Tech Mono', monospace" }}>{message}</p>}
          </div>
          <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: 16, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#F0F0FF', border: '1px solid rgba(255,106,0,0.25)', background: 'linear-gradient(135deg,rgba(255,106,0,0.1),rgba(0,229,255,0.06))', transition: 'all 0.4s ease', opacity: loading ? 0.5 : 1 }} onMouseEnter={e => { if (!loading) { const t = e.target as HTMLElement; t.style.background = 'linear-gradient(135deg,rgba(255,106,0,0.2),rgba(0,229,255,0.1))'; t.style.borderColor = 'rgba(255,106,0,0.5)'; t.style.boxShadow = '0 0 30px rgba(255,106,0,0.15),0 0 60px rgba(255,106,0,0.06)' } }} onMouseLeave={e => { const t = e.target as HTMLElement; t.style.background = 'linear-gradient(135deg,rgba(255,106,0,0.1),rgba(0,229,255,0.06))'; t.style.borderColor = 'rgba(255,106,0,0.25)'; t.style.boxShadow = 'none' }}>{loading ? 'CONNECTING...' : mode === 'signin' ? 'VERIFY IDENTITY' : 'INITIALIZE'}</button>
          <div style={{ marginTop: 24, fontSize: 11, color: 'rgba(255,255,255,0.18)', textAlign: 'center' }}>
            <span>{mode === 'signin' ? 'No account? ' : 'Have an account? '}</span>
            <button onClick={toggleMode} style={{ background: 'none', border: 'none', color: '#FF6A00', cursor: 'pointer', fontFamily: "'Share Tech Mono', monospace", fontSize: 11, transition: 'color 0.3s' }}>{mode === 'signin' ? 'REGISTER' : 'SIGN IN'}</button>
          </div>
          <div style={{ marginTop: 44, textAlign: 'center', fontSize: 10, letterSpacing: '0.15em', color: 'rgba(0,229,255,0.14)' }}>BUILD ANYTHING. OWN EVERYTHING.</div>
        </div>
      </div>
      <style>{`
        @keyframes bscan { 0% { top: -1px; opacity: 0 } 5% { opacity: 1 } 50% { top: 100%; opacity: 1 } 95% { opacity: 1 } 100% { top: -1px; opacity: 0 } }
        @keyframes pulse { 0%, 100% { opacity: 0.4 } 50% { opacity: 1 } }
        input::placeholder { color: rgba(255,255,255,0.1) !important; }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #000308 inset !important;
          -webkit-text-fill-color: #F0F0FF !important;
          border-bottom-color: #FF6A00 !important;
          caret-color: #FF6A00 !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        input:focus { caret-color: #FF6A00; }
      `}</style>
    </main>
  )
}

'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// ── Quantum Harmonics — green atmospheric field ──────────────
function QuantumField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    let raf: number

    const PHI = 1.618
    const SEED = Math.floor(Math.random() * 999999)
    const N = 600

    // Simple seeded random
    let _s = SEED
    const rnd = () => { _s = (_s * 16807) % 2147483647; return (_s - 1) / 2147483646 }

    const HARMONICS = Array.from({ length: 4 }, () => ({
      fx: [1, PHI, PHI * PHI, 2][Math.floor(rnd() * 4)],
      fy: [1, PHI, 2, PHI + 1][Math.floor(rnd() * 4)],
      ph: rnd() * Math.PI * 2,
      amp: 16 + rnd() * 22,
    }))

    const pts = Array.from({ length: N }, (_, i) => {
      const cols = Math.ceil(Math.sqrt(N))
      const rows = Math.ceil(N / cols)
      const c = i % cols, r = Math.floor(i / cols)
      return {
        ox: (c / cols) * W + (W / cols) * 0.5 + (rnd() - 0.5) * (W / cols) * 0.5,
        oy: (r / rows) * H + (H / rows) * 0.5 + (rnd() - 0.5) * (H / rows) * 0.5,
        ha: HARMONICS[i % HARMONICS.length],
        hb: HARMONICS[(i + 2) % HARMONICS.length],
        bl: rnd(),
        bp: (i / N) * Math.PI * 2 * 11 + rnd() * Math.PI,
        sz: 0.5 + rnd() * 1.6,
        lf: 0.5 + rnd() * 0.5,
        x: 0, y: 0, q: 0,
      }
    })

    // Noise — simple value noise
    const noiseGrid: number[] = Array.from({ length: 256 }, () => rnd())
    const noise2 = (x: number, y: number, t: number) => {
      const xi = Math.floor(x * 100) & 255
      const yi = Math.floor(y * 100) & 255
      const ti = Math.floor(t * 10) & 255
      return noiseGrid[(xi + yi * 16 + ti * 4) & 255]
    }

    let t = 0
    const draw = () => {
      t += 0.008
      ctx.fillStyle = 'rgba(0,0,0,0.2)'
      ctx.fillRect(0, 0, W, H)

      pts.forEach(p => {
        const ph = p.bp + t * 0.4
        const dxa = Math.sin(ph * p.ha.fx + p.ha.ph) * p.ha.amp
        const dya = Math.sin(ph * p.ha.fy) * p.ha.amp
        const dxb = Math.sin(ph * p.hb.fx + p.hb.ph) * p.hb.amp
        const dyb = Math.sin(ph * p.hb.fy) * p.hb.amp
        const dx = dxa * (1 - p.bl) + dxb * p.bl
        const dy = dya * (1 - p.bl) + dyb * p.bl
        const nx = noise2(p.ox * 0.003, p.oy * 0.003, t) * 2 - 1
        const ny = noise2(p.ox * 0.003 + 0.5, p.oy * 0.003 + 0.5, t) * 2 - 1
        p.x = p.ox + dx + nx * 16
        p.y = p.oy + dy + ny * 16
        const ca = (Math.sin(ph * p.ha.fx + p.ha.ph) + 1) * 0.5
        const cb = (Math.sin(ph * p.ha.fy) + 1) * 0.5
        p.q = ca * cb

        const a = p.q * p.lf
        ctx.beginPath()
        if (p.q > 0.88) {
          // ISO white peak — rare glow moment
          ctx.fillStyle = `rgba(240,255,240,${a * 0.7})`
          ctx.arc(p.x, p.y, p.sz * 2, 0, Math.PI * 2)
        } else if (p.q > 0.62) {
          const g = Math.floor(180 + p.q * 75)
          ctx.fillStyle = `rgba(0,${g},20,${a * 0.65})`
          ctx.arc(p.x, p.y, p.sz * 1.4, 0, Math.PI * 2)
        } else {
          ctx.fillStyle = `rgba(0,180,30,${a * 0.18})`
          ctx.arc(p.x, p.y, p.sz * 0.6, 0, Math.PI * 2)
        }
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }

    draw()
    const onResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.18, pointerEvents: 'none' }}
    />
  )
}

// ── Coach greeting — knows who you are ───────────────────────
function coachGreeting(name: string, apps: any[]): string {
  const n = name ? name.toUpperCase() : 'OPERATOR'
  if (apps.length === 0) {
    return `THE GRID IS READY, ${n}. YOUR FIRST BUILD IS WAITING.`
  }
  const last = apps[0]
  return `WELCOME BACK, ${n}. ${last.name.toUpperCase()} IS LIVE. WHAT ARE YOU BUILDING NEXT?`
}

// ── UPLINK rank based on builds ──────────────────────────────
function uplinkRank(buildsTotal: number): string {
  if (buildsTotal >= 50) return 'SOVEREIGN'
  if (buildsTotal >= 20) return 'ORACLE'
  if (buildsTotal >= 10) return 'ARCHITECT'
  if (buildsTotal >= 3)  return 'OPERATOR'
  return 'INITIATE'
}

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
    router.push('/auth')
  }

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#00FF41', fontFamily: 'Share Tech Mono, monospace', fontSize: '12px', letterSpacing: '0.2em' }}>
          LOADING THE GRID...
        </p>
      </main>
    )
  }

  const tier = userData?.tier || 'free'
  const buildsUsed = userData?.builds_used || 0
  const tierLimits: Record<string, number> = { free: 1, builder: 5, architect: 9 }
  const buildsTotal = tierLimits[tier] || 1
  const appsLive = apps.filter(a => a.deployed_url).length
  const rank = uplinkRank(buildsUsed)
  const greeting = coachGreeting(userData?.name || userData?.email?.split('@')[0] || '', apps)

  const tierColor = tier === 'architect' ? '#F0F0FF' : tier === 'builder' ? '#00E5FF' : '#00FF41'

  return (
    <main style={{ minHeight: '100vh', background: '#000', color: '#F0F0FF', fontFamily: 'Share Tech Mono, monospace', overflow: 'hidden' }}>

      {/* Quantum Harmonics background */}
      <QuantumField />

      {/* Scanlines */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, background: 'repeating-linear-gradient(to bottom,transparent 0,transparent 3px,rgba(0,255,65,0.013) 3px,rgba(0,255,65,0.013) 4px)' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>

        {/* Header */}
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderBottom: '1px solid rgba(0,255,65,0.1)' }}>
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '16px', fontWeight: 900, color: '#00FF41', letterSpacing: '0.22em', textShadow: '0 0 12px rgba(0,255,65,0.4)' }}>
            SOVREND
          </span>
          {/* UPLINK rank — center */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '8px', letterSpacing: '0.4em', color: 'rgba(0,255,65,0.4)' }}>UPLINK</span>
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', letterSpacing: '0.3em', color: '#00FF41', textShadow: '0 0 8px rgba(0,255,65,0.5)' }}>{rank}</span>
          </div>
          {/* Right — tier + sign out */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', letterSpacing: '0.35em', color: tierColor }}>{tier.toUpperCase()}</span>
            <button onClick={signOut} style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '10px', letterSpacing: '0.15em', color: 'rgba(240,240,255,0.25)', background: 'none', border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = 'rgba(240,240,255,0.7)'}
              onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(240,240,255,0.25)'}>
              EXIT
            </button>
          </div>
        </header>

        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '48px 32px', opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease' }}>

          {/* Coach greeting */}
          <div style={{ marginBottom: '40px', paddingBottom: '32px', borderBottom: '1px solid rgba(0,255,65,0.08)' }}>
            <div style={{ fontSize: '8px', letterSpacing: '0.45em', color: 'rgba(255,45,120,0.5)', marginBottom: '10px', fontFamily: 'Orbitron, sans-serif' }}>
              COACH
            </div>
            <p style={{ fontSize: 'clamp(12px,1.8vw,15px)', color: 'rgba(255,45,120,0.85)', letterSpacing: '0.1em', lineHeight: 1.8, textShadow: '0 0 12px rgba(255,45,120,0.3)', fontFamily: 'Orbitron, sans-serif', fontWeight: 500 }}>
              {greeting}
            </p>
          </div>

          {/* Three stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '32px' }}>
            {/* Builds used */}
            <div style={{ background: '#0A0A0A', border: '1px solid rgba(0,255,65,0.15)', padding: '20px 24px' }}>
              <div style={{ fontSize: '8px', letterSpacing: '0.4em', color: 'rgba(0,255,65,0.4)', marginBottom: '8px', fontFamily: 'Orbitron, sans-serif' }}>BUILDS USED</div>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '28px', fontWeight: 900, color: '#00FF41', textShadow: '0 0 16px rgba(0,255,65,0.4)' }}>
                {buildsUsed} <span style={{ fontSize: '14px', opacity: 0.4 }}>/ {buildsTotal}</span>
              </div>
            </div>
            {/* Apps live */}
            <div style={{ background: '#0A0A0A', border: '1px solid rgba(0,229,255,0.15)', padding: '20px 24px' }}>
              <div style={{ fontSize: '8px', letterSpacing: '0.4em', color: 'rgba(0,229,255,0.4)', marginBottom: '8px', fontFamily: 'Orbitron, sans-serif' }}>APPS LIVE</div>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '28px', fontWeight: 900, color: '#00E5FF', textShadow: '0 0 16px rgba(0,229,255,0.4)' }}>
                {appsLive}
              </div>
            </div>
            {/* Plan */}
            <div style={{ background: '#0A0A0A', border: `1px solid ${tierColor}22`, padding: '20px 24px' }}>
              <div style={{ fontSize: '8px', letterSpacing: '0.4em', color: `${tierColor}66`, marginBottom: '8px', fontFamily: 'Orbitron, sans-serif' }}>PLAN</div>
              <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '28px', fontWeight: 900, color: tierColor, textShadow: `0 0 16px ${tierColor}44` }}>
                {tier.toUpperCase()}
              </div>
            </div>
          </div>

          {/* START NEW BUILD — dominant */}
          <Link href="/build" style={{ display: 'block', textAlign: 'center', padding: '20px', background: '#00FF41', color: '#000', fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 700, letterSpacing: '0.3em', textDecoration: 'none', marginBottom: '48px', transition: 'box-shadow 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 40px rgba(0,255,65,0.5)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
            + START NEW BUILD
          </Link>

          {/* Apps grid */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '8px', letterSpacing: '0.45em', color: 'rgba(0,255,65,0.35)', fontFamily: 'Orbitron, sans-serif', marginBottom: '20px' }}>
              YOUR BUILDS — {apps.length}
            </div>

            {apps.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', border: '1px solid rgba(0,255,65,0.08)' }}>
                <p style={{ fontSize: '11px', color: 'rgba(240,240,255,0.2)', letterSpacing: '0.2em' }}>
                  NOTHING BUILT YET. THAT CHANGES TODAY.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '12px' }}>
                {apps.map(app => (
                  <Link key={app.id} href={`/build?app=${app.id}`} style={{ display: 'block', padding: '24px', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,255,65,0.3)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: 700, color: '#F0F0FF', letterSpacing: '0.1em' }}>
                        {app.name}
                      </h3>
                      {app.deployed_url && (
                        <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '8px', color: '#00FF41', letterSpacing: '0.2em' }}>LIVE</span>
                      )}
                    </div>
                    <p style={{ fontSize: '11px', color: 'rgba(240,240,255,0.3)', marginBottom: '16px', lineHeight: 1.6 }}>
                      {app.description || 'No description'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '9px', color: 'rgba(240,240,255,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        {app.persona}
                      </span>
                      {app.deployed_url && (
                        <a href={app.deployed_url} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{ fontSize: '9px', color: '#00E5FF', letterSpacing: '0.15em', textDecoration: 'none' }}>
                          VIEW LIVE →
                        </a>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Upgrade nudge — only on free, earned */}
          {tier === 'free' && buildsUsed >= 1 && (
            <div style={{ marginTop: '48px', padding: '32px', textAlign: 'center', border: '1px solid rgba(0,255,65,0.15)', background: 'rgba(0,255,65,0.02)' }}>
              <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', fontWeight: 900, color: '#F0F0FF', letterSpacing: '0.15em', marginBottom: '8px', textShadow: '0 0 20px rgba(240,240,255,0.2)' }}>
                YOU HAVE THE GLOW.
              </p>
              <p style={{ fontSize: '12px', color: 'rgba(255,45,120,0.7)', marginBottom: '24px', letterSpacing: '0.08em', lineHeight: 1.8 }}>
                You built something real. Builder gives you five more builds this month,<br />
                twenty refines each, and your own infrastructure to grow on.<br />
                You've already done the hardest part.
              </p>
              <a href="/upgrade" style={{ display: 'inline-block', padding: '14px 36px', background: '#00E5FF', color: '#FF6B00', fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', textDecoration: 'none', boxShadow: '0 0 20px rgba(0,229,255,0.3), inset 0 0 20px rgba(255,107,0,0.1)', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget.style.boxShadow = '0 0 40px rgba(0,229,255,0.5), inset 0 0 30px rgba(255,107,0,0.2)') }}
                onMouseLeave={e => { (e.currentTarget.style.boxShadow = '0 0 20px rgba(0,229,255,0.3), inset 0 0 20px rgba(255,107,0,0.1)') }}>
                UNLOCK BUILDER →
              </a>
              <p style={{ marginTop: '16px', fontSize: '10px', color: 'rgba(240,240,255,0.2)', letterSpacing: '0.1em', cursor: 'pointer' }}>
                Not yet — keep refining my build
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Prototype badge */}
      <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 50, padding: '5px 12px', border: '1px solid rgba(255,227,0,0.4)', color: 'rgba(255,227,0,0.6)', fontFamily: 'Share Tech Mono, monospace', fontSize: '9px', letterSpacing: '0.2em', background: 'rgba(0,0,0,0.8)' }}>
        PROTOTYPE
      </div>

    </main>
  )}

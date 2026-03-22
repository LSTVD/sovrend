'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const FEATURES = [
  { icon: '🪄', title: '// PROMPT WHISPERER', desc: 'Type 2 words. Hit Whisper. SOVREND expands it into a full spec — then builds it. Better prompts. Better apps. Every time.' },
  { icon: '⚕', title: '// HEALTH CHECK', desc: 'AI scans your app for broken buttons, empty data, and layout issues before you share it with a client. Nobody else has this.' },
  { icon: '🎙', title: '// VOICE PROMPTING', desc: 'Speak your app idea instead of typing. Hit the mic, describe what you need, SOVREND builds it. The fastest prompt method yet.' },
  { icon: '✦', title: '// REFINE WITHOUT RESTARTING', desc: 'Describe one change. SOVREND applies it surgically and keeps everything else intact. No starting over. No losing work.' },
  { icon: '⚡', title: '// AUTO-FIX', desc: 'You only pay for progress. Never for failure. Auto-Fix runs silently before charging a refine — fixing what the build got wrong.' },
  { icon: '💬', title: '// DISCUSS MODE', desc: 'Brainstorm with your AI architect without burning build credits. Plan features, data models, user flows — then build with confidence.' },
  { icon: '📋', title: '// PLAN MODE', desc: 'See exactly what SOVREND will build before it builds it. Approve, edit, or cancel. No surprises. Full control over every generation.' },
  { icon: '📈', title: '// REVENUE DASHBOARD', desc: 'See exactly how much your deployed apps earn. Stripe revenue flows directly into your SOVREND dashboard in real time.' },
  { icon: '🌐', title: '// APP SHOWCASE', desc: 'Browse real apps built by SOVREND users. Fork any app as your starting point. The fastest way to go from zero to something real.' },
]

const PLANS = [
  { name: 'FREE', price: '$0', sub: '3 BUILDS · NO CARD', features: ['3 Sonnet builds, forever', 'All templates', 'Download + deploy', 'Auto-Fix included'], cta: 'START FREE →', hot: false, color: 'rgba(240,240,255,0.5)' },
  { name: 'BUILDER', price: '$29', sub: '8 BUILDS / MONTH', features: ['Claude Sonnet 4.6', 'Refine + Undo', 'Version history', 'Prompt Whisperer'], cta: 'GET STARTED →', hot: true, color: '#00FF41' },
  { name: 'AGENCY', price: '$99', sub: '20 BUILDS · 3 SEATS', features: ['Claude Sonnet 4.6', '25 refines/app', '3 shared seats', 'Priority support'], cta: 'GO AGENCY →', hot: false, color: '#00E5FF' },
]

const fd = 'Orbitron, monospace'
const ff = "'Share Tech Mono', monospace"
const bg = '#000300'
const g = '#00FF41'
const g2 = '#00cc33'
const t1 = '#00ff41'
const t2 = '#00cc33'
const t3 = '#007a1f'
const t4 = '#003a0e'
const b1 = '#001a00'
const b2 = '#002e00'
const b3 = '#004700'
const s1 = '#000900'

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<'intro' | 'landing'>('intro')
  const [introProgress, setIntroProgress] = useState(0)
  const [introStatus, setIntroStatus] = useState('INITIALIZING SYSTEM...')
  const [logoVisible, setLogoVisible] = useState(false)
  const [landingVisible, setLandingVisible] = useState(false)
  const rafRef = useRef<number>(0)

  const STATUSES = ['INITIALIZING SYSTEM...','LOADING CLAUDE SONNET 4.6...','CONNECTING TO THE GRID...','AUTHENTICATING OPERATOR...','SYSTEM READY']
  const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>{}[]'
  const FONT = 14

  function startRain(canvas: HTMLCanvasElement, opacity: number) {
    const ctx = canvas.getContext('2d')!
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const cols = Math.floor(canvas.width / FONT) + 1
    const ypos = Array(cols).fill(0).map(() => Math.random() * canvas.height / FONT | 0)
    function draw() {
      ctx.fillStyle = 'rgba(0,0,0,0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ypos.forEach((y, i) => {
        const c = CHARS[Math.floor(Math.random() * CHARS.length)]
        const head = Math.random() > 0.9
        ctx.fillStyle = head ? 'rgba(200,255,210,0.9)' : `rgba(0,${150 + Math.floor(Math.random() * 80)},30,${(0.3 + Math.random() * 0.4).toFixed(2)})`
        ctx.font = `${FONT}px monospace`
        ctx.fillText(c, i * FONT, y * FONT)
        if (y * FONT > canvas.height && Math.random() > 0.96) ypos[i] = 0
        ypos[i]++
      })
      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    startRain(canvas, 0.15)

    const resize = () => { if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight } }
    window.addEventListener('resize', resize)

    setTimeout(() => setLogoVisible(true), 200)
    STATUSES.forEach((s, i) => setTimeout(() => setIntroStatus(s), i * 700 + 400))

    let prog = 0
    const tick = setInterval(() => {
      prog += Math.random() * 4 + 1
      if (prog >= 100) { prog = 100; clearInterval(tick) }
      setIntroProgress(Math.min(prog, 100))
    }, 60)

    setTimeout(() => {
      clearInterval(tick)
      setIntroProgress(100)
      setTimeout(() => {
        setPhase('landing')
        setTimeout(() => setLandingVisible(true), 100)
      }, 400)
    }, 4000)

    return () => {
      cancelAnimationFrame(rafRef.current)
      clearInterval(tick)
      window.removeEventListener('resize', resize)
    }
  }, [])

  if (phase === 'intro') {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#000', overflow: 'hidden', zIndex: 99999 }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, opacity: 0.15 }} />
        <div style={{ position: 'fixed', inset: 0, background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.12) 2px,rgba(0,0,0,0.12) 4px)', pointerEvents: 'none', zIndex: 4 }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
          <div style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 50%,rgba(0,0,0,0.55) 0%,transparent 100%)', position: 'absolute', inset: 0 }} />
          <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: '0 20px' }}>
            <div style={{ fontFamily: fd, fontWeight: 900, fontSize: 'clamp(28px,5.5vw,64px)', letterSpacing: '12px', color: g, textShadow: `0 0 30px ${g},0 0 60px rgba(0,255,65,.4)`, opacity: logoVisible ? 1 : 0, transition: 'opacity 0.8s ease', marginBottom: '14px' }}>
              SOVREND
            </div>
            <div style={{ fontFamily: fd, fontSize: 'clamp(8px,0.9vw,10px)', letterSpacing: '8px', color: 'rgba(0,255,65,0.55)', marginBottom: '8px', opacity: logoVisible ? 1 : 0, transition: 'opacity 0.7s ease 0.4s' }}>
              AI APP BUILDER // CLAUDE SONNET POWERED
            </div>
            <div style={{ fontFamily: ff, fontSize: '11px', color: 'rgba(0,255,65,0.3)', letterSpacing: '3px', marginBottom: '40px', opacity: logoVisible ? 1 : 0, transition: 'opacity 0.7s ease 0.6s' }}>
              BUILD SOVEREIGN
            </div>
            <div style={{ width: 'min(320px,75vw)', margin: '0 auto', opacity: logoVisible ? 1 : 0, transition: 'opacity 0.5s ease 0.8s' }}>
              <div style={{ height: '2px', background: 'rgba(0,255,65,0.08)', borderRadius: '2px', marginBottom: '10px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${introProgress}%`, background: `linear-gradient(90deg,${g2},${g})`, borderRadius: '2px', boxShadow: `0 0 12px ${g}`, transition: 'width 0.05s linear', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)', animation: 'shimmer 1.2s infinite' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: fd, fontSize: '9px', color: 'rgba(0,255,65,0.45)', letterSpacing: '3px' }}>{introStatus}</div>
                <div style={{ fontFamily: fd, fontSize: '9px', color: 'rgba(0,255,65,0.3)', letterSpacing: '2px' }}>{Math.round(introProgress)}%</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 50, padding: '4px 12px', border: '1px solid rgba(255,227,0,0.4)', color: 'rgba(255,227,0,0.6)', fontFamily: ff, fontSize: '9px', letterSpacing: '3px', background: 'rgba(0,0,0,0.8)' }}>PROTOTYPE</div>
        <GStyles />
      </div>
    )
  }

  return (
    <div style={{ background: bg, color: t1, fontFamily: ff, minHeight: '100vh', overflowX: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, opacity: 0.055, pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', inset: 0, background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.05) 2px,rgba(0,0,0,0.05) 4px)', pointerEvents: 'none', zIndex: 9990 }} />

      <div style={{ position: 'relative', zIndex: 10, height: '100vh', overflowY: 'auto', opacity: landingVisible ? 1 : 0, transition: 'opacity 0.8s ease' }}>

        {/* NAV */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 48px', borderBottom: `1px solid ${b1}`, position: 'sticky', top: 0, background: 'rgba(0,3,0,0.95)', backdropFilter: 'blur(16px)', zIndex: 100 }}>
          <div style={{ fontFamily: fd, fontWeight: 900, fontSize: '18px', letterSpacing: '6px', color: g, textShadow: `0 0 18px ${g},0 0 36px rgba(0,255,65,.2)` }}>SOVREND</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9px', color: t3, letterSpacing: '2px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: g, boxShadow: `0 0 7px ${g}`, flexShrink: 0 }} />
            SONNET 4.6 ACTIVE
          </div>
          <div style={{ display: 'flex', gap: '7px' }}>
            <Link href="/auth" className="btn-nav-ghost">SIGN IN</Link>
            <Link href="/auth" className="btn-nav-green">START FREE →</Link>
          </div>
        </nav>

        {/* HERO */}
        <div style={{ textAlign: 'center', padding: '70px 40px 52px', maxWidth: '800px', margin: '0 auto' }}>
          <div className="fu" style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', border: `1px solid ${b2}`, borderRadius: '2px', padding: '6px 15px', fontSize: '9px', color: t2, letterSpacing: '3px', marginBottom: '26px', background: 'rgba(0,255,65,0.02)' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: g, flexShrink: 0 }} />
            CLAUDE SONNET 4.6 · FLAT PRICING · NO TOKEN BURNS
          </div>
          <h1 className="fu1" style={{ fontFamily: fd, fontSize: 'clamp(32px,5.2vw,54px)', fontWeight: 900, lineHeight: 1.04, marginBottom: '20px', color: g, animation: 'glow 4s ease-in-out infinite', letterSpacing: '2px' }}>
            DESCRIBE IT.<br />SOVREND BUILDS IT.
          </h1>
          <p className="fu2" style={{ fontSize: '13px', color: t2, lineHeight: 1.9, marginBottom: '38px', maxWidth: '520px', margin: '0 auto 38px' }}>
            Type what you need. Claude Sonnet 4.6 builds a fully working app in seconds. Real buttons. Live data. Charts. Mobile-ready. No coding, no setup, no experience needed.
          </p>
          <div className="fu3" style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '13px' }}>
            <Link href="/auth" className="btn-hero-green">BUILD YOUR FIRST APP FREE →</Link>
          </div>
          <div className="fu4" style={{ fontSize: '9px', color: t4, letterSpacing: '2px' }}>
            NO TOKEN BURNS · NO CREDIT ANXIETY · FLAT PRICING · 7-DAY MONEY BACK
          </div>
        </div>

        {/* FEATURES */}
        <div style={{ padding: '0 48px', marginBottom: '26px', textAlign: 'center' }}>
          <div style={{ fontSize: '9px', color: t3, letterSpacing: '4px', fontFamily: fd, marginBottom: '5px' }}>// WHY SOVREND WINS</div>
          <div style={{ fontFamily: fd, fontSize: '18px', fontWeight: 900, letterSpacing: '4px', color: t1, marginBottom: '7px' }}>BUILD ANYTHING. FOR ANYONE.</div>
          <div style={{ fontSize: '11px', color: t3, lineHeight: 1.8, maxWidth: '440px', margin: '0 auto' }}>Founders, freelancers, agencies, and developers who want to build faster. One prompt — real app. Every time.</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '11px', maxWidth: '1000px', margin: '0 auto 68px', padding: '0 48px' }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feat-card">
              <div style={{ fontSize: '22px', marginBottom: '9px' }}>{f.icon}</div>
              <div style={{ fontFamily: fd, fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: t1, marginBottom: '6px' }}>{f.title}</div>
              <div style={{ fontSize: '10px', color: t3, lineHeight: 1.8 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* PRICING */}
        <div style={{ margin: '60px 0 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '9px', color: t3, letterSpacing: '4px', fontFamily: fd, marginBottom: '5px' }}>// PRICING</div>
          <div style={{ fontFamily: fd, fontSize: '18px', fontWeight: 900, letterSpacing: '4px', color: t1, marginBottom: '7px' }}>FLAT. PREDICTABLE. NO SURPRISES.</div>
          <div style={{ fontSize: '11px', color: t3, lineHeight: 1.8, maxWidth: '440px', margin: '0 auto' }}>No token burns. No credit drain. One price, every feature at that tier. Cancel anytime.</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', maxWidth: '800px', margin: '0 auto 68px', padding: '0 28px' }}>
          {PLANS.map((plan, i) => (
            <div key={i} className={`plan-card${plan.hot ? ' plan-hot' : ''}`}>
              {plan.hot && <div style={{ position: 'absolute', top: '-9px', left: '50%', transform: 'translateX(-50%)', background: g, color: bg, fontFamily: fd, fontSize: '8px', fontWeight: 900, letterSpacing: '2px', padding: '2px 11px', whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
              <div style={{ fontFamily: fd, fontSize: '11px', letterSpacing: '3px', color: t2 }}>{plan.name}</div>
              <div style={{ fontFamily: fd, fontSize: '34px', fontWeight: 900, margin: '7px 0 2px', color: plan.color }}>
                {plan.price}<span style={{ fontSize: '14px', fontWeight: 400, color: t4 }}>/mo</span>
              </div>
              <div style={{ fontSize: '8px', color: t4, marginBottom: '4px', letterSpacing: '1px' }}>{plan.sub}</div>
              <div style={{ height: '1px', background: b1, margin: '12px 0' }} />
              {plan.features.map((feat, j) => (
                <div key={j} style={{ display: 'flex', gap: '7px', marginBottom: '6px', fontSize: '10px', color: t2, lineHeight: 1.5 }}>
                  <span style={{ color: g }}>✓</span>{feat}
                </div>
              ))}
              <Link href="/auth" className="btn-plan">{plan.cta}</Link>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div style={{ borderTop: `1px solid ${b1}`, padding: '38px 48px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ fontFamily: fd, fontWeight: 900, fontSize: '16px', letterSpacing: '6px', color: g, textShadow: `0 0 18px ${g}` }}>SOVREND</div>
            <div style={{ fontSize: '9px', color: t4, letterSpacing: '2px' }}>THE PLACE WHERE THE THOUGHT BECOMES THE THING.</div>
            <div style={{ fontSize: '9px', color: t4, letterSpacing: '1px' }}>© 2026 SOVREND. BUILD ANYTHING. OWN EVERYTHING.</div>
          </div>
        </div>

      </div>

      <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 99999, padding: '4px 12px', border: '1px solid rgba(255,227,0,0.4)', color: 'rgba(255,227,0,0.6)', fontFamily: ff, fontSize: '9px', letterSpacing: '3px', background: 'rgba(0,0,0,0.8)' }}>PROTOTYPE</div>
      <GStyles />
    </div>
  )
}

function GStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;scrollbar-width:thin;scrollbar-color:#002200 #000300}
      *::-webkit-scrollbar{width:5px}*::-webkit-scrollbar-thumb{background:#002200;border-radius:2px}
      ::selection{background:rgba(0,255,65,0.2);color:#00FF41}
      @keyframes glow{0%,100%{text-shadow:0 0 10px #00FF41,0 0 20px rgba(0,255,65,.3)}50%{text-shadow:0 0 28px #00FF41,0 0 56px rgba(0,255,65,.5)}}
      @keyframes shimmer{from{left:-100%}to{left:100%}}
      @keyframes fadeup{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
      .fu{animation:fadeup .4s ease both}
      .fu1{animation:fadeup .4s .07s ease both}
      .fu2{animation:fadeup .4s .14s ease both}
      .fu3{animation:fadeup .4s .21s ease both}
      .fu4{animation:fadeup .4s .28s ease both}
      .feat-card{background:#000900;border:1px solid #001a00;border-radius:2px;padding:20px 17px;transition:all .2s;cursor:default;position:relative;overflow:hidden}
      .feat-card:hover{border-color:#004700;box-shadow:0 0 16px rgba(0,255,65,.08)}
      .plan-card{background:#000900;border:1px solid #001a00;border-radius:2px;padding:20px 14px;position:relative;transition:transform .2s,box-shadow .2s}
      .plan-card:hover{transform:translateY(-3px);box-shadow:0 8px 26px rgba(0,0,0,.5)}
      .plan-hot{border-color:#004700;box-shadow:0 0 16px rgba(0,255,65,.08)}
      .btn-nav-ghost{display:inline-flex;align-items:center;padding:6px 13px;border:1px solid #002e00;color:#007a1f;font-family:Orbitron,monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;transition:all .15s}
      .btn-nav-ghost:hover{border-color:#00FF41;color:#00FF41}
      .btn-nav-green{display:inline-flex;align-items:center;padding:6px 13px;border:1px solid #00FF41;color:#00FF41;font-family:Orbitron,monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;box-shadow:0 0 8px rgba(0,255,65,.08);transition:all .15s}
      .btn-nav-green:hover{background:#00FF41;color:#000300;box-shadow:0 0 22px rgba(0,255,65,.22)}
      .btn-hero-green{display:inline-flex;align-items:center;padding:13px 30px;border:1px solid #00FF41;color:#00FF41;font-family:Orbitron,monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;box-shadow:0 0 8px rgba(0,255,65,.08);transition:all .15s}
      .btn-hero-green:hover{background:#00FF41;color:#000300;box-shadow:0 0 22px rgba(0,255,65,.22)}
      .btn-plan{display:flex;align-items:center;justify-content:center;width:100%;margin-top:16px;padding:9px 20px;border:1px solid #004700;color:#007a1f;font-family:Orbitron,monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;transition:all .15s}
      .btn-plan:hover{border-color:#00FF41;color:#00FF41}
    `}</style>
  )
}

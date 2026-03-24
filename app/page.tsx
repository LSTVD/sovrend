'use client'
import { useState, useEffect, useRef } from 'react'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [count] = useState(47)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const x = c.getContext('2d')!
    let W = 0, H = 0, raf = 0

    function resize() { W = c!.width = window.innerWidth; H = c!.height = window.innerHeight }
    resize()

    function draw(t: number) {
      x.fillStyle = 'rgba(0,3,8,0.97)'
      x.fillRect(0, 0, W, H)
      const p = 0.02 + Math.sin(t * 0.0004) * 0.01
      const g = x.createRadialGradient(W/2, H*0.65, 0, W/2, H*0.65, W*0.3)
      g.addColorStop(0, `rgba(255,107,0,${p})`)
      g.addColorStop(1, 'rgba(0,0,0,0)')
      x.fillStyle = g
      x.fillRect(0, 0, W, H)
      x.lineCap = 'round'
      for (let i = 0; i <= 8; i++) {
        const t2 = i/8, px = (t2-0.5)*W*0.8+W/2
        const a = {x: W/2+(px-W/2)*(H*0.95/50), y: H*0.65}
        const b = {x: W/2+(px-W/2)*(H*0.95/1200), y: H*0.65}
        x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y)
        x.strokeStyle = `rgba(0,229,255,${(Math.sin(t2*Math.PI)*0.06+0.01).toFixed(3)})`
        x.lineWidth = 0.4; x.stroke()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  const handleSubmit = () => {
    if (!email || !email.includes('@')) return
    setSubmitted(true)
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="flex flex-col items-center max-w-xl w-full text-center">
          <h1 className="mb-2" style={{fontFamily:'Orbitron,sans-serif',fontSize:'clamp(32px,8vw,56px)',fontWeight:900,letterSpacing:'0.22em',color:'#00E5FF',textShadow:'0 0 12px rgba(0,229,255,0.3),0 0 40px rgba(0,229,255,0.1)'}}>SOVREND</h1>
          <p className="mb-2" style={{fontFamily:'Orbitron,sans-serif',fontSize:'clamp(8px,1.4vw,11px)',letterSpacing:'0.35em',color:'rgba(255,107,0,0.7)'}}>THE PLACE WHERE THE THOUGHT BECOMES THE THING</p>
          <p className="mb-10" style={{fontSize:'14px',color:'rgba(200,204,215,0.6)',lineHeight:1.6,maxWidth:'420px'}}>The AI app builder that teaches you while it builds for you. Describe your idea. Watch it come to life. Understand what you built.</p>
          {!submitted ? (
            <div className="w-full max-w-sm">
              <div className="flex gap-0" style={{border:'1px solid rgba(0,229,255,0.15)',borderBottom:'2px solid rgba(0,229,255,0.3)',background:'rgba(3,5,12,0.9)'}}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} placeholder="your@email.com" className="flex-1 bg-transparent text-white px-4 py-3 outline-none" style={{fontSize:'13px'}} />
                <button onClick={handleSubmit} className="px-6 py-3 cursor-pointer" style={{fontFamily:'Orbitron,sans-serif',fontSize:'8px',fontWeight:700,letterSpacing:'0.2em',color:'#000308',background:'#00E5FF'}}>JOIN WAITLIST</button>
              </div>
              <p className="mt-3" style={{fontSize:'10px',color:'rgba(160,165,178,0.4)'}}>{count} builders waiting · Free tier at launch</p>
            </div>
          ) : (
            <div style={{animation:'fadeUp 0.5s ease both'}}>
              <p style={{fontFamily:'Orbitron,sans-serif',fontSize:'10px',letterSpacing:'0.3em',color:'#00E5FF',marginBottom:'8px'}}>YOU ARE IN</p>
              <p style={{fontSize:'13px',color:'rgba(200,204,215,0.6)'}}>We will let you know when the Grid opens.</p>
            </div>
          )}
          <div className="mt-12 flex items-center gap-3" style={{opacity:0.5}}>
            <span style={{fontFamily:'Orbitron,sans-serif',fontSize:'7px',letterSpacing:'0.2em',color:'#FF6B00',border:'1px solid rgba(255,107,0,0.2)',padding:'3px 8px',background:'rgba(255,107,0,0.04)'}}>BUILT WITH CLAUDE</span>
            <span style={{fontFamily:'Orbitron,sans-serif',fontSize:'7px',letterSpacing:'0.2em',color:'rgba(0,229,255,0.5)',border:'1px solid rgba(0,229,255,0.1)',padding:'3px 8px'}}>POWERED BY ANTHROPIC</span>
          </div>
          <div className="mt-8" style={{fontSize:'10px',color:'rgba(160,165,178,0.25)'}}>Build anything. Own everything. · hello@sovrend.com</div>
        </div>
      </div>
    </main>
  )
}
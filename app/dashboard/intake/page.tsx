"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const MONO = '"JetBrains Mono", monospace'
const SERIF = '"Fraunces", serif'
const SANS = '"DM Sans", sans-serif'

const PALETTES = [
  { id:'navy', name:'Dark Navy', desc:'Premium & restrained', colors:['#0F1923','#1A2535','#E8D5B0','#7A9E7E'] },
  { id:'espresso', name:'Espresso', desc:'Warm & cinematic', colors:['#1A1208','#2D2010','#F5F0E8','#C4963A'] },
  { id:'midnight', name:'Midnight', desc:'Bold & electric', colors:['#0A0A0A','#111111','#F0EDE6','#C8FF00'] },
  { id:'cream', name:'Warm Cream', desc:'Editorial & calm', colors:['#F5F2EC','#EDE8DC','#1A1208','#B5714A'] },
  { id:'forest', name:'Deep Forest', desc:'Natural & grounded', colors:['#0D1F17','#1A3025','#F5F0E8','#7A9E7E'] },
  { id:'slate', name:'Clean Slate', desc:'Professional & clear', colors:['#F9FAFB','#F3F4F6','#111827','#2563EB'] },
]

const VIBES = [
  { id:'cinematic', name:'Cinematic', desc:'Full-bleed photography. Dramatic. One statement per section.', bg:'linear-gradient(135deg,#0F1923,#1A2535)' },
  { id:'editorial', name:'Editorial', desc:'Typography-first. Generous whitespace. Considered and refined.', bg:'linear-gradient(135deg,#2A2A2A,#1A1A1A)' },
  { id:'technical', name:'Technical', desc:'Data-dense. Charts and metrics. Product as hero.', bg:'linear-gradient(135deg,#0A0A0A,#111111)' },
  { id:'playful', name:'Playful', desc:'Bold color. Energy and warmth. Makes people smile.', bg:'linear-gradient(135deg,#1a0533,#2d0a4e)' },
]

export default function IntakePage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [palette, setPalette] = useState<string|null>(null)
  const [vibe, setVibe] = useState<string|null>(null)
  const [different, setDifferent] = useState('')
  const [customer, setCustomer] = useState('')

  const next = () => setStep(s => s + 1)
  const back = () => setStep(s => s - 1)

  const finish = () => {
    setStep(6)
    const selectedPalette = PALETTES.find(p => p.id === palette)
    const selectedVibe = VIBES.find(v => v.id === vibe)
    const brief = `${name}. What makes it different: ${different}. Customer: ${customer}. Color palette: ${selectedPalette?.name || palette}. Aesthetic vibe: ${selectedVibe?.name || vibe}.`
    const intake = { q1: name, q2: different, q3: customer, q4: `${selectedPalette?.name} palette, ${selectedVibe?.name} vibe`, q5: '' }
    if (typeof window !== 'undefined') {
      localStorage.setItem('sovrend_brief', brief)
      localStorage.setItem('sovrend_intake', JSON.stringify(intake))
    }
    setTimeout(() => router.push('/dashboard'), 2200)
  }

  const pct = step === 0 ? 0 : step >= 6 ? 100 : Math.round((step / 5) * 100)

  const s = {
    page: { minHeight:'100vh', background:'#0B0D14', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:SANS, color:'#E8E4D8', position:'relative' as const, overflow:'hidden' as const },
    grid: { position:'fixed' as const, inset:0, backgroundImage:'linear-gradient(rgba(0,229,255,.012) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,.012) 1px,transparent 1px)', backgroundSize:'64px 64px', pointerEvents:'none' as const },
    scanlines: { position:'fixed' as const, inset:0, background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.007) 2px,rgba(0,0,0,.007) 3px)', pointerEvents:'none' as const, zIndex:9999 },
    card: { width:'100%', maxWidth:580, padding:'0 24px', position:'relative' as const, zIndex:1 },
    cipherRow: { display:'flex', alignItems:'flex-start', gap:12, marginBottom:20 },
    cipherAvatar: { width:26, height:26, borderRadius:'50%', border:'1px solid rgba(0,229,255,.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 as const, marginTop:2 },
    cipherDot: { width:5, height:5, background:'#00E5FF', borderRadius:'50%' },
    cipherMsg: { fontSize:15, fontWeight:300, color:'#E8E4D8', lineHeight:1.72 },
    input: { width:'100%', background:'rgba(232,228,216,.03)', border:'1px solid rgba(232,228,216,.08)', padding:'12px 14px', color:'#E8E4D8', fontSize:14, fontWeight:300, fontFamily:SANS, outline:'none', lineHeight:1.6 },
    textarea: { width:'100%', background:'rgba(232,228,216,.03)', border:'1px solid rgba(232,228,216,.08)', padding:'12px 14px', color:'#E8E4D8', fontSize:14, fontWeight:300, fontFamily:SANS, outline:'none', lineHeight:1.72, resize:'none' as const, minHeight:80 },
    btnPrimary: { padding:'13px', background:'#00E5FF', color:'#0B0D14', fontFamily:MONO, fontSize:10, letterSpacing:'.16em', textTransform:'uppercase' as const, border:'none', cursor:'pointer', width:'100%' },
    btnSecondary: { padding:'10px', background:'transparent', color:'rgba(232,228,216,.22)', fontFamily:MONO, fontSize:9, letterSpacing:'.12em', textTransform:'uppercase' as const, border:'1px solid rgba(232,228,216,.07)', cursor:'pointer', width:'100%' },
    continuBtn: (can:boolean) => ({ padding:'10px 24px', background:can?'#00E5FF':'rgba(232,228,216,.07)', color:can?'#0B0D14':'rgba(232,228,216,.15)', fontFamily:MONO, fontSize:9, letterSpacing:'.14em', textTransform:'uppercase' as const, border:'none', cursor:can?'pointer':'not-allowed' as const }),
    backBtn: { fontFamily:MONO, fontSize:8, letterSpacing:'.12em', textTransform:'uppercase' as const, color:'rgba(232,228,216,.25)', background:'none', border:'none', cursor:'pointer' },
    footerRow: { display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:16 },
    dots: { display:'flex', gap:5, justifyContent:'center', marginTop:16 },
    progressBar: { position:'fixed' as const, top:0, left:0, right:0, height:2, background:'rgba(232,228,216,.06)', zIndex:100 },
    progressFill: { height:'100%', background:'linear-gradient(90deg,#FF6B00,#00E5FF)', width:pct+'%', transition:'width .6s cubic-bezier(.16,1,.3,1)' },
  }

  const CipherRow = ({msg}:{msg:string}) => (
    <div style={s.cipherRow}>
      <div style={s.cipherAvatar}><div style={s.cipherDot}/></div>
      <div style={s.cipherMsg}>{msg}</div>
    </div>
  )

  const Dots = ({current, total}:{current:number, total:number}) => (
    <div style={s.dots}>
      {Array.from({length:total},(_,i)=>(
        <div key={i} style={{height:5,borderRadius:3,width:i+1<current?5:i+1===current?16:5,background:i+1<current?'#3DD68C':i+1===current?'#00E5FF':'rgba(232,228,216,.1)',transition:'all .3s cubic-bezier(.16,1,.3,1)'}}/>
      ))}
    </div>
  )

  return (
    <div style={s.page}>
      <style>{`*{margin:0;padding:0;box-sizing:border-box}body{background:#0B0D14;overflow:hidden}@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,300&family=DM+Sans:wght@200;300;400;500&family=JetBrains+Mono:wght@300;400&display=swap');textarea::placeholder,input::placeholder{color:rgba(232,228,216,.2)}input:focus,textarea:focus{border-color:rgba(0,229,255,.2)!important}@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <div style={s.grid}/>
      <div style={s.scanlines}/>
      <div style={s.progressBar}><div style={s.progressFill}/></div>

      {/* Logo */}
      <div style={{position:'fixed',top:20,left:24,display:'flex',alignItems:'center',gap:8,cursor:'pointer',zIndex:10}} onClick={()=>router.push('/dashboard')}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:2,width:14}}>
          {[0,1,2,3,4,5,6,7,8].map(i=><div key={i} style={{width:3,height:3,border:`.5px solid ${i===4?'#FF6B00':'rgba(0,229,255,.25)'}`,background:i===4?'#FF6B00':'transparent'}}/>)}
        </div>
        <span style={{fontFamily:MONO,fontSize:11,letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(232,228,216,.3)'}}>← Back</span>
      </div>

      {step > 0 && step < 6 && (
        <div style={{position:'fixed',top:20,right:24,fontFamily:MONO,fontSize:9,letterSpacing:'.16em',color:'rgba(232,228,216,.25)',zIndex:10}}>{step} / 5</div>
      )}

      <div style={{...s.card, animation:'fadeUp .6s ease'}}>

        {/* STEP 0 — INTRO */}
        {step === 0 && (
          <div style={{textAlign:'center'}}>
            <div style={{fontFamily:MONO,fontSize:8,letterSpacing:'.26em',textTransform:'uppercase',color:'rgba(0,229,255,.45)',display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginBottom:20}}>
              <div style={{width:20,height:1,background:'rgba(0,229,255,.3)'}}/>Cipher · Brief Intelligence<div style={{width:20,height:1,background:'rgba(0,229,255,.3)'}}/>
            </div>
            <div style={{fontFamily:SERIF,fontStyle:'italic',fontSize:'clamp(28px,5vw,44px)',fontWeight:300,letterSpacing:'-.04em',lineHeight:1.0,marginBottom:14}}>
              Before I build —<br/><span style={{color:'#00E5FF'}}>let me understand it.</span>
            </div>
            <div style={{fontSize:14,fontWeight:300,color:'rgba(232,228,216,.45)',lineHeight:1.75,maxWidth:400,margin:'0 auto 32px'}}>
              Five steps. Two minutes. The difference between something generic and something that feels like only you.
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:10,maxWidth:320,margin:'0 auto'}}>
              <button style={s.btnPrimary} onClick={next}>Start the brief →</button>
              <button style={s.btnSecondary} onClick={()=>router.push('/dashboard')}>I know what I want — skip to prompt</button>
            </div>
          </div>
        )}

        {/* STEP 1 — NAME */}
        {step === 1 && (
          <div>
            <CipherRow msg="Tell me the name of your business and what it does in one sentence."/>
            <div style={{fontFamily:SERIF,fontStyle:'italic',fontSize:48,fontWeight:300,letterSpacing:'-.05em',lineHeight:1,marginBottom:20,color:name?'#E8E4D8':'rgba(232,228,216,.1)',transition:'color .2s',minHeight:56}}>
              {name || 'Your Brand'}
            </div>
            <input
              style={s.input}
              placeholder="Apex Cues — custom luxury pool cues for professionals"
              value={name}
              onChange={e=>setName(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&name.trim())next()}}
              autoFocus
            />
            <div style={{fontFamily:MONO,fontSize:8,letterSpacing:'.1em',color:'rgba(232,228,216,.18)',marginTop:6}}>Your name renders live above · Enter to continue</div>
            <Dots current={1} total={5}/>
            <div style={s.footerRow}>
              <div/>
              <button style={s.continuBtn(!!name.trim())} disabled={!name.trim()} onClick={next}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 2 — PALETTE */}
        {step === 2 && (
          <div>
            <CipherRow msg="Choose the color world. This sets the entire aesthetic."/>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:4}}>
              {PALETTES.map(p=>(
                <div key={p.id} onClick={()=>setPalette(p.id)} style={{border:`1px solid ${palette===p.id?'#00E5FF':'rgba(232,228,216,.08)'}`,cursor:'pointer',transition:'all .25s',background:palette===p.id?'rgba(0,229,255,.04)':'transparent',position:'relative'}}>
                  <div style={{height:70,display:'flex',overflow:'hidden'}}>
                    {p.colors.map((c,i)=><div key={i} style={{flex:1,background:c}}/>)}
                  </div>
                  <div style={{padding:'8px 10px'}}>
                    <div style={{fontFamily:MONO,fontSize:8,letterSpacing:'.12em',textTransform:'uppercase',color:palette===p.id?'#00E5FF':'rgba(232,228,216,.5)'}}>{p.name}</div>
                    <div style={{fontSize:10,fontWeight:300,color:'rgba(232,228,216,.3)',marginTop:2}}>{p.desc}</div>
                  </div>
                  {palette===p.id&&<div style={{position:'absolute',top:6,right:6,width:16,height:16,background:'#00E5FF',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,color:'#0B0D14',fontWeight:700}}>✓</div>}
                </div>
              ))}
            </div>
            <Dots current={2} total={5}/>
            <div style={s.footerRow}>
              <button style={s.backBtn} onClick={back}>← Back</button>
              <button style={s.continuBtn(!!palette)} disabled={!palette} onClick={next}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 3 — VIBE */}
        {step === 3 && (
          <div>
            <CipherRow msg="Pick the energy your site should have the moment someone arrives."/>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10,marginBottom:4}}>
              {VIBES.map(v=>(
                <div key={v.id} onClick={()=>setVibe(v.id)} style={{border:`1px solid ${vibe===v.id?'#00E5FF':'rgba(232,228,216,.08)'}`,cursor:'pointer',transition:'all .25s',padding:18,background:vibe===v.id?'rgba(0,229,255,.04)':'transparent',position:'relative'}}>
                  <div style={{height:56,borderRadius:2,background:v.bg,marginBottom:12}}/>
                  <div style={{fontFamily:SERIF,fontStyle:'italic',fontSize:18,fontWeight:300,letterSpacing:'-.02em',marginBottom:4}}>{v.name}</div>
                  <div style={{fontSize:11,fontWeight:300,color:'rgba(232,228,216,.35)',lineHeight:1.5}}>{v.desc}</div>
                  {vibe===v.id&&<div style={{position:'absolute',top:10,right:10,width:16,height:16,background:'#00E5FF',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,color:'#0B0D14',fontWeight:700}}>✓</div>}
                </div>
              ))}
            </div>
            <Dots current={3} total={5}/>
            <div style={s.footerRow}>
              <button style={s.backBtn} onClick={back}>← Back</button>
              <button style={s.continuBtn(!!vibe)} disabled={!vibe} onClick={next}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 4 — DIFFERENT */}
        {step === 4 && (
          <div>
            <CipherRow msg="What do you do better than anyone else?"/>
            <textarea
              style={s.textarea}
              placeholder="Nobody else does this because..."
              value={different}
              onChange={e=>setDifferent(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&different.trim()){e.preventDefault();next()}}}
              autoFocus
            />
            <div style={{fontFamily:MONO,fontSize:7,letterSpacing:'.1em',color:'rgba(232,228,216,.15)',marginTop:6}}>Enter to continue · Shift+Enter for new line</div>
            <Dots current={4} total={5}/>
            <div style={s.footerRow}>
              <button style={s.backBtn} onClick={back}>← Back</button>
              <button style={s.continuBtn(!!different.trim())} disabled={!different.trim()} onClick={next}>Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 5 — CUSTOMER */}
        {step === 5 && (
          <div>
            <CipherRow msg="Who is this for?"/>
            <textarea
              style={s.textarea}
              placeholder="The person who needs this most is..."
              value={customer}
              onChange={e=>setCustomer(e.target.value)}
              onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&customer.trim()){e.preventDefault();finish()}}}
              autoFocus
            />
            <div style={{fontFamily:MONO,fontSize:7,letterSpacing:'.1em',color:'rgba(232,228,216,.15)',marginTop:6}}>Enter to build · Shift+Enter for new line</div>
            <Dots current={5} total={5}/>
            <div style={s.footerRow}>
              <button style={s.backBtn} onClick={back}>← Back</button>
              <button style={s.continuBtn(!!customer.trim())} disabled={!customer.trim()} onClick={finish}>Build it →</button>
            </div>
          </div>
        )}

        {/* STEP 6 — BUILDING */}
        {step === 6 && (
          <div style={{textAlign:'center'}}>
            <div style={{width:36,height:36,border:'1px solid rgba(0,229,255,.2)',borderTop:'1px solid #00E5FF',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 20px'}}/>
            <div style={{fontFamily:SERIF,fontStyle:'italic',fontSize:24,fontWeight:300,color:'#E8E4D8',marginBottom:6}}>Building your brief.</div>
            <div style={{fontFamily:MONO,fontSize:9,letterSpacing:'.16em',textTransform:'uppercase',color:'rgba(0,229,255,.4)',marginBottom:24}}>Cipher is thinking...</div>
            <div style={{textAlign:'left',maxWidth:400,margin:'0 auto'}}>
              {[name, PALETTES.find(p=>p.id===palette)?.name, VIBES.find(v=>v.id===vibe)?.name, different, customer].filter(Boolean).map((v,i)=>(
                <div key={i} style={{display:'flex',gap:10,padding:'7px 0',borderBottom:'1px solid rgba(232,228,216,.04)'}}>
                  <span style={{fontFamily:MONO,fontSize:8,color:'rgba(0,229,255,.3)',flexShrink:0}}>0{i+1}</span>
                  <span style={{fontSize:12,fontWeight:300,color:'rgba(232,228,216,.38)',lineHeight:1.6}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

// ══════════════════════════════════════════
// SOVREND — Builder Page V9 Final
// No visible counter — Coach handles it
// Coach: rgba(240,240,255,.75)
// ══════════════════════════════════════════

const UI = "'Orbitron',sans-serif"
const MONO = "'SF Mono','Fira Code',monospace"
const PLACEHOLDERS = ['What are you building today?','A booking app, a client portal, a dashboard...','Describe it like you\'re telling a friend...','An app that does ______ for ______','What does your business need?','Tell me your idea in your own words...']
const TEMPLATES: Record<string,string> = {
  portal:'A client portal where freelancers can track projects, send invoices, and message clients. Include a dashboard with stats, project list with status badges, and a clean sidebar navigation.',
  saas:'A SaaS dashboard for managing subscriptions and analytics. Include user management, revenue charts, plan management, and a settings page with billing.',
  booking:'A booking system where customers pick a date and time, pay a deposit, and get a confirmation email. Include a calendar view, booking form, and admin panel.',
  store:'An online store with product listings, a shopping cart, checkout with Stripe, and order tracking. Include product categories, search, and a clean product detail page.',
}
const GLOSSARY = [
  {t:'Auth',d:'How your app knows who someone is. The login system that checks credentials.'},
  {t:'Backend',d:'The behind-the-scenes part of your app. Handles data, security, and logic users don\'t see.'},
  {t:'Database',d:'Where your app stores information. Like a giant organized spreadsheet on the internet.'},
  {t:'Deploy',d:'Making your app live on the internet so anyone with the link can visit it.'},
  {t:'Domain',d:'Your app\'s address on the internet. Like myapp.com.'},
  {t:'Frontend',d:'The part people see and touch. Buttons, pages, forms, images — everything visual.'},
  {t:'Responsive',d:'Your app looks good on any screen size — phone, tablet, desktop.'},
  {t:'Stripe',d:'A payment system. Handles credit cards, subscriptions, and sends money to your bank.'},
  {t:'Supabase',d:'Your app\'s database + login system in one. Stores data and controls who can see what.'},
  {t:'Webhook',d:'An automatic message between apps. When something happens in one, it instantly tells another.'},
]
const STEPS = [
  ['Setting up your database...','this stores all your project data'],
  ['Creating the dashboard layout...','your users will see this first'],
  ['Building the invoice system...','clients will see what they owe here'],
  ['Wiring client messaging...','real-time communication'],
  ['Applying styles and polish...','making it look professional'],
]

// ── Grid Icon ──
function GI({s=20}:{s?:number}) {
  const g=s*.05, sq=(s-g*2)/3
  return <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>{[0,1,2].map(r=>[0,1,2].map(c=>{
    const x=c*(sq+g),y=r*(sq+g)
    return r===1&&c===1?<rect key={`${r}${c}`} x={x} y={y} width={sq} height={sq} fill="#FF8C00"/>
    :<rect key={`${r}${c}`} x={x} y={y} width={sq} height={sq} fill="none" stroke="#00E5FF" strokeWidth={s>40?1:1.5}/>
  }))}</svg>
}

// ── Grid Background ──
function GridBg({state}:{state:string}) {
  const ref=useRef<HTMLCanvasElement>(null), sr=useRef(state)
  sr.current=state
  useEffect(()=>{
    const c=ref.current;if(!c)return
    const ctx=c.getContext('2d')!;let W=0,H=0,raf=0
    let gR=0,gG=229,gB=255,gO=.015,tR=0,tG=229,tB=255,tO=.015
    const rs=()=>{W=c.width=innerWidth;H=c.height=innerHeight}
    const pj=(a:number,b:number,z:number)=>{if(z<5)return null;const s=H*.95/z;return{x:W/2+(a-W/2)*s,y:H*.65+b*s}}
    rs()
    const draw=(t:number)=>{
      const s=sr.current
      if(s==='building'){tR=255;tG=107;tB=0;tO=.12}
      else if(s==='complete'){tR=0;tG=229;tB=255;tO=.04}
      else{tR=0;tG=229;tB=255;tO=.015}
      const lr=s==='building'?.06:.02
      gR+=(tR-gR)*lr;gG+=(tG-gG)*lr;gB+=(tB-gB)*lr;gO+=(tO-gO)*lr
      ctx.fillStyle='rgba(0,3,8,0.97)';ctx.fillRect(0,0,W,H)
      const pulse=s==='building'?.08+Math.sin(t*.003)*.06:gO+Math.sin(t*.0004)*.008
      const gr=ctx.createRadialGradient(W/2,H*.65,0,W/2,H*.65,W*.3)
      gr.addColorStop(0,`rgba(${~~gR},${~~gG},${~~gB},${pulse.toFixed(3)})`);gr.addColorStop(1,'rgba(0,0,0,0)')
      ctx.fillStyle=gr;ctx.fillRect(0,0,W,H)
      const lR=~~(gR*.3),lG=~~(gG*.3+229*.7),lB=~~(gB*.3+255*.7)
      ctx.lineCap='round'
      for(let i=0;i<=8;i++){const t2=i/8,px=(t2-.5)*W*.85+W/2
        const a=pj(px,0,50),b=pj(px,0,1400);if(!a||!b)continue
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y)
        ctx.strokeStyle=`rgba(${lR},${lG},${lB},${(Math.sin(t2*Math.PI)*.06+.01).toFixed(3)})`;ctx.lineWidth=.35;ctx.stroke()}
      for(let i=0;i<9;i++){const z=50+(i/9)*1350
        const a=pj(-W*.35+W/2,0,z),b=pj(W*.35+W/2,0,z);if(!a||!b)continue
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y)
        ctx.strokeStyle=`rgba(${lR},${lG},${lB},${((z-50)/1350*.05+.008).toFixed(3)})`;ctx.lineWidth=.3;ctx.stroke()}
      raf=requestAnimationFrame(draw)
    }
    raf=requestAnimationFrame(draw);window.addEventListener('resize',rs)
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',rs)}
  },[])
  return <canvas ref={ref} className="fixed inset-0 z-0"/>
}

// ── Chat Message ──
function Msg({role,text,children}:{role:'coach'|'user';text?:string;children?:React.ReactNode}) {
  const ic=role==='coach'
  return <div className={`flex gap-2 items-start ${!ic?'flex-row-reverse':''}`} style={{animation:'fu .3s ease both'}}>
    <div className="flex items-center justify-center flex-shrink-0" style={{width:26,height:26,fontFamily:UI,fontSize:8,
      border:`1px solid ${ic?'rgba(255,107,0,.3)':'rgba(0,229,255,.15)'}`,color:ic?'#FF6B00':'#00E5FF',
      background:ic?'rgba(255,107,0,.04)':'rgba(0,229,255,.04)'}}>{ic?'C':'S'}</div>
    <div style={{padding:'10px 12px',fontSize:13,lineHeight:1.7,maxWidth:'92%',
      background:ic?'rgba(240,240,255,.04)':'rgba(0,229,255,.04)',
      border:`1px solid ${ic?'rgba(240,240,255,.10)':'rgba(0,229,255,.15)'}`,
      color:ic?'rgba(240,240,255,.75)':'rgba(195,200,215,.82)'}}>{text}{children}</div>
  </div>
}

// ── Suggestion Pill ──
function Sug({text}:{text:string}) {
  return <span className="cursor-pointer inline-block" style={{fontSize:11,padding:'5px 12px',border:'1px solid rgba(255,107,0,.15)',color:'rgba(255,107,0,.7)',background:'rgba(255,107,0,.04)'}}>{text}</span>
}

// ── Glossary FAB ──
function GlossFab() {
  const [open,setOpen]=useState(false)
  const [q,setQ]=useState('')
  const filt=GLOSSARY.filter(g=>g.t.toLowerCase().includes(q.toLowerCase())||g.d.toLowerCase().includes(q.toLowerCase()))
  return <>
    <div className="fixed z-50 flex items-center justify-center cursor-pointer" onClick={()=>setOpen(!open)}
      style={{bottom:32,right:10,width:36,height:36,background:'rgba(255,107,0,.04)',border:'1px solid rgba(255,107,0,.3)',fontFamily:UI,fontSize:9,color:'#FF6B00'}}>
      ◈<div className="absolute -top-1 -right-1 flex items-center justify-center" style={{width:14,height:14,background:'#FF6B00',color:'#000308',fontSize:8,fontWeight:700,borderRadius:'50%'}}>3</div>
    </div>
    {open&&<div className="fixed z-[60] flex flex-col" style={{bottom:74,right:10,width:280,maxHeight:380,background:'rgba(4,6,14,.96)',border:'1px solid rgba(255,107,0,.3)',backdropFilter:'blur(18px)'}}>
      <div className="flex items-center justify-between px-3 py-2" style={{borderBottom:'1px solid rgba(255,107,0,.15)'}}>
        <span style={{fontFamily:UI,fontSize:8,letterSpacing:'.25em',color:'rgba(255,107,0,.7)'}}>SOVREN CODE · GLOSSARY</span>
        <span className="cursor-pointer" style={{fontSize:12,color:'rgba(78,84,105,.22)'}} onClick={()=>setOpen(false)}>✕</span>
      </div>
      <input className="w-full outline-none" style={{background:'rgba(8,11,22,.7)',border:'none',borderBottom:'1px solid rgba(255,107,0,.15)',color:'#F0F0FF',fontSize:11,padding:'8px 12px'}}
        placeholder="Search any building term..." value={q} onChange={e=>setQ(e.target.value)}/>
      <div className="flex-1 overflow-y-auto">
        {filt.map(g=><div key={g.t} className="px-3 py-2" style={{borderBottom:'1px solid rgba(0,229,255,.035)'}}>
          <div style={{fontSize:11,color:'rgba(255,107,0,.9)',fontWeight:500}}>{g.t}</div>
          <div style={{fontSize:10,color:'rgba(155,162,180,.55)',marginTop:2,lineHeight:1.45}}>{g.d}</div>
        </div>)}
      </div>
    </div>}
  </>
}

// ══════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════
export default function DashboardPage() {
  const [appState,setAppState]=useState<'idle'|'building'|'complete'>('idle')
  const [prompt,setPrompt]=useState('')
  const [sbCol,setSbCol]=useState(false)
  const [projName,setProjName]=useState('New Build')
  const [ver,setVer]=useState('NEW')
  const [pubVis,setPubVis]=useState(false)
  const [setOpen,setSetOpen]=useState(false)
  const [codeOpen,setCodeOpen]=useState(false)
  const [narrText,setNarrText]=useState('')
  const [narrTeach,setNarrTeach]=useState('')
  const [showNarr,setShowNarr]=useState(false)
  const [showStrip,setShowStrip]=useState(false)
  const [showModes,setShowModes]=useState(false)
  const [phIdx,setPhIdx]=useState(0)
  const [msgs,setMsgs]=useState<{role:'coach'|'user';text:string;type?:string}[]>([])

  const sbW=sbCol?52:220

  // Rotating placeholders
  useEffect(()=>{
    if(appState!=='idle')return
    const iv=setInterval(()=>setPhIdx(p=>(p+1)%PLACEHOLDERS.length),4000)
    return()=>clearInterval(iv)
  },[appState])

  // Keyboard shortcut
  useEffect(()=>{
    const h=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key==='Enter'&&appState==='idle'&&prompt.trim()){e.preventDefault();handleBuild()}}
    document.addEventListener('keydown',h);return()=>document.removeEventListener('keydown',h)
  },[appState,prompt])

  const handleBuild=useCallback(async()=>{
    if(!prompt.trim()||appState!=='idle')return
    setAppState('building');setProjName('Client Portal');setVer('BUILDING...');setShowNarr(true)
    setMsgs([
      {role:'coach',text:'I see your vision. Let me bring it to life.'},
      {role:'user',text:prompt},
      {role:'coach',text:'Building now — I\'ll walk you through each step.',type:'building'},
    ])
    let step=0
    setNarrText(STEPS[0][0]);setNarrTeach(STEPS[0][1])
    const ni=setInterval(()=>{step++;if(step>=STEPS.length){clearInterval(ni);return}
      setNarrText(STEPS[step][0]);setNarrTeach(STEPS[step][1])},800)

    // TODO: real API call → const res = await fetch('/api/build', {...})
    setTimeout(()=>{
      clearInterval(ni);setAppState('complete');setVer('v1.0');setShowNarr(false);setPubVis(true)
      setMsgs(prev=>[...prev,
        {role:'coach',text:'Your portal is live. That used 1 of your 8 free actions. Here\'s what I\'d suggest next:',type:'summary'},
        {role:'coach',text:'Invoices need a pay button. Want me to wire Stripe so clients pay directly?',type:'suggestion'},
      ])
      setTimeout(()=>setShowStrip(true),400)
      setTimeout(()=>setShowModes(true),1000)
    },4000)
  },[prompt,appState])

  const loadTpl=(k:string)=>{if(TEMPLATES[k])setPrompt(TEMPLATES[k])}

  return <main className="relative min-h-screen overflow-hidden">
    <GridBg state={appState}/>
    <style jsx global>{`
      @keyframes fu{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
      @keyframes spin{to{transform:rotate(360deg)}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
      ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}
      ::-webkit-scrollbar-thumb{background:rgba(45,50,68,.14);border-radius:2px}
    `}</style>

    {/* Sidebar */}
    <div className="fixed left-0 top-0 bottom-0 z-50 flex flex-col transition-all duration-300"
      style={{width:sbW,background:'rgba(4,6,14,.96)',borderRight:'1px solid rgba(0,229,255,.07)',backdropFilter:'blur(18px)'}}>
      <div className="flex items-center gap-2.5 px-4 py-3.5 flex-shrink-0" style={{borderBottom:'1px solid rgba(0,229,255,.035)'}}>
        <GI s={20}/>{!sbCol&&<span style={{fontFamily:UI,fontSize:9,fontWeight:700,letterSpacing:'.2em',color:'rgba(0,229,255,.7)'}}>SOVREND</span>}
        <span className="ml-auto cursor-pointer" onClick={()=>setSbCol(!sbCol)} style={{fontSize:10,color:'rgba(115,122,142,.35)'}}>{sbCol?'▷':'◁'}</span>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-2.5">
        {[{i:'⌂',l:'Home',a:true},{i:'⌕',l:'Search'}].map(x=><div key={x.l} className="flex items-center gap-2.5 cursor-pointer mb-px"
          style={{padding:sbCol?0:'8px 10px',width:sbCol?36:undefined,height:sbCol?36:undefined,margin:sbCol?'0 auto 2px':undefined,justifyContent:sbCol?'center':undefined,display:'flex',
            fontSize:12,color:x.a?'#00E5FF':'rgba(155,162,180,.55)',background:x.a?'rgba(0,229,255,.04)':'transparent',border:`1px solid ${x.a?'rgba(0,229,255,.15)':'transparent'}`}}>
          <span style={{fontSize:14,width:20,textAlign:'center'}}>{x.i}</span>{!sbCol&&<span>{x.l}</span>}
        </div>)}
        {!sbCol&&<div className="flex items-center justify-center gap-2 cursor-pointer my-1 py-2"
          style={{border:'1px solid rgba(0,229,255,.15)',background:'rgba(0,229,255,.04)',color:'#00E5FF',fontFamily:UI,fontSize:9,letterSpacing:'.14em',fontWeight:600}}>+&nbsp;NEW BUILD</div>}
        {!sbCol&&<div style={{fontFamily:UI,fontSize:8,letterSpacing:'.2em',color:'rgba(78,84,105,.22)',padding:'10px 10px 4px'}}>PROJECTS</div>}
        {!sbCol&&<div style={{fontFamily:UI,fontSize:8,letterSpacing:'.2em',color:'rgba(78,84,105,.22)',padding:'10px 10px 4px'}}>SPARK</div>}
        {[{k:'portal',l:'Client Portal'},{k:'saas',l:'SaaS Dashboard'},{k:'booking',l:'Booking System'},{k:'store',l:'Online Store'}].map(s=>
          <div key={s.k} className="flex items-center gap-2.5 cursor-pointer mb-px" onClick={()=>loadTpl(s.k)}
            style={{padding:sbCol?0:'8px 10px',width:sbCol?36:undefined,height:sbCol?36:undefined,margin:sbCol?'0 auto 2px':undefined,justifyContent:sbCol?'center':undefined,display:'flex',
              fontSize:12,color:'rgba(155,162,180,.55)',border:'1px solid transparent'}}>
            <span style={{fontSize:14,width:20,textAlign:'center'}}>◈</span>{!sbCol&&<span>{s.l}</span>}
          </div>)}
      </div>
      {!sbCol&&<div className="flex flex-col gap-1 p-2" style={{borderTop:'1px solid rgba(0,229,255,.035)'}}>
        <div className="flex items-center gap-2 p-2.5 cursor-pointer" style={{border:'1px solid rgba(0,229,255,.15)',background:'rgba(0,229,255,.04)',color:'#00E5FF',fontSize:11}}>
          <span style={{fontSize:14}}>⚡</span><div><div>Upgrade to Builder</div><div style={{fontSize:9,color:'rgba(115,122,142,.35)',marginTop:2}}>25 actions/month → $22/mo</div></div>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-2">
          <div className="flex items-center justify-center" style={{width:28,height:28,border:'1px solid rgba(0,229,255,.15)',fontFamily:UI,fontSize:8,color:'#00E5FF'}}>SD</div>
          <div><div style={{fontSize:11,color:'rgba(195,200,215,.82)'}}>StevieD</div><div style={{fontFamily:UI,fontSize:8,color:'rgba(115,122,142,.35)',letterSpacing:'.1em'}}>OPERATOR</div></div>
        </div>
      </div>}
    </div>

    {/* Shell */}
    <div className="fixed z-10 flex flex-col transition-all duration-300" style={{left:sbW,top:0,right:0,bottom:0}}>

      {/* Topbar */}
      <div className="flex items-center px-4 flex-shrink-0" style={{height:44,background:'rgba(4,6,14,.96)',borderBottom:'1px solid rgba(0,229,255,.07)',backdropFilter:'blur(18px)'}}>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span style={{fontSize:13,color:'rgba(155,162,180,.55)'}}>{projName}</span>
          <span style={{fontFamily:UI,fontSize:8,color:'rgba(78,84,105,.22)',letterSpacing:'.12em'}}>{ver}</span>
        </div>
        <div className="flex-1 flex items-center justify-center gap-2">
          {appState!=='idle'&&<div className="flex" style={{border:'1px solid rgba(0,229,255,.07)'}}>
            {['DESKTOP','MOBILE','TABLET'].map((v,i)=><button key={v} style={{fontFamily:UI,fontSize:8,letterSpacing:'.14em',padding:'5px 12px',color:i===0?'#00E5FF':'rgba(78,84,105,.22)',background:i===0?'rgba(0,229,255,.04)':'transparent',border:'none',cursor:'pointer'}}>{v}</button>)}
          </div>}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span style={{fontFamily:UI,fontSize:8,letterSpacing:'.14em',padding:'4px 8px',color:'#00E5FF',border:'1px solid rgba(0,229,255,.15)',background:'rgba(0,229,255,.04)'}}>OPERATOR</span>
          <span style={{fontFamily:UI,fontSize:8,letterSpacing:'.14em',padding:'4px 8px',color:'#FF6B00',border:'1px solid rgba(255,107,0,.15)',background:'rgba(255,107,0,.04)'}}>BUILT WITH CLAUDE</span>
          <button style={{fontFamily:UI,fontSize:8,fontWeight:700,letterSpacing:'.22em',color:'#000308',background:'#F0F0FF',border:'none',padding:'7px 18px',cursor:'pointer',
            opacity:pubVis?1:0,pointerEvents:pubVis?'auto':'none',transition:'all .6s',boxShadow:pubVis?'0 0 14px rgba(240,240,255,.15)':'none'}}>PUBLISH</button>
          <div className="flex items-center justify-center cursor-pointer" onClick={()=>setSetOpen(!setOpen)}
            style={{width:26,height:26,border:'1px solid rgba(0,229,255,.07)',color:'rgba(78,84,105,.22)',fontSize:12}}>⚙</div>
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* STATE 1: WELCOME */}
        {appState==='idle'&&<div className="absolute inset-0 flex items-center justify-center px-6 z-20">
          <div className="flex flex-col items-center max-w-xl w-full text-center">
            <p style={{fontSize:12,color:'rgba(155,162,180,.55)',fontStyle:'italic'}}>&ldquo;As you think, so shall you become.&rdquo;</p>
            <p style={{fontFamily:UI,fontSize:8,letterSpacing:'.3em',color:'rgba(255,107,0,.5)',marginBottom:20}}>— BRUCE LEE</p>
            <div className="flex gap-2.5 items-start mb-5 text-left w-full max-w-lg"
              style={{padding:'12px 14px',background:'rgba(240,240,255,.03)',border:'1px solid rgba(240,240,255,.06)',borderLeft:'2px solid rgba(255,107,0,.4)'}}>
              <div className="flex items-center justify-center flex-shrink-0" style={{width:28,height:28,fontFamily:UI,fontSize:8,border:'1px solid rgba(255,107,0,.3)',color:'#FF6B00',background:'rgba(255,107,0,.04)'}}>C</div>
              <div style={{fontSize:14,color:'rgba(240,240,255,.75)',lineHeight:1.6}}>Tell me what you want to build — in your own words. I&apos;ll handle the rest.</div>
            </div>
            <h2 style={{fontFamily:UI,fontSize:'clamp(18px,3vw,30px)',fontWeight:700,color:'#F0F0FF',marginBottom:8}}>What are you ready to build?</h2>
            <p style={{fontSize:13.5,color:'rgba(155,162,180,.55)',marginBottom:26}}>No code needed. Takes about 60 seconds.</p>
            <div className="w-full max-w-lg" style={{background:'rgba(4,6,14,.96)',border:'1px solid rgba(0,229,255,.15)',borderBottom:'2px solid rgba(0,229,255,.3)',padding:16,backdropFilter:'blur(18px)'}}>
              <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder={PLACEHOLDERS[phIdx]}
                className="w-full bg-transparent outline-none resize-none" style={{color:'#F0F0FF',fontSize:13.5,height:52,lineHeight:'1.55'}}/>
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-1.5 items-center">
                  {['📎','🎤','◇'].map(i=><div key={i} className="flex items-center justify-center cursor-pointer" style={{width:28,height:28,border:'1px solid rgba(0,229,255,.07)',color:'rgba(78,84,105,.22)',fontSize:12}}>{i}</div>)}
                  <div className="cursor-pointer" title="Coach improves your description before building"
                    style={{fontFamily:UI,fontSize:8,letterSpacing:'.12em',color:'#FF6B00',border:'1px solid rgba(255,107,0,.15)',background:'rgba(255,107,0,.04)',padding:'5px 10px',height:28,display:'flex',alignItems:'center'}}>✦ ENHANCE</div>
                </div>
                <button onClick={handleBuild} style={{fontFamily:UI,fontSize:10,fontWeight:700,letterSpacing:'.22em',color:'#000308',background:'#00E5FF',border:'none',padding:'9px 24px',cursor:'pointer',boxShadow:'0 0 8px rgba(0,229,255,.15)'}}>BUILD IT →</button>
              </div>
            </div>
          </div>
        </div>}

        {/* STATE 2: BUILDER */}
        {appState!=='idle'&&<div className="flex w-full h-full" style={{animation:'fu .5s ease'}}>

          {/* LEFT — COACH */}
          <div className="flex flex-col h-full" style={{width:370,minWidth:370,background:'rgba(4,6,14,.96)',borderRight:'1px solid rgba(0,229,255,.07)',backdropFilter:'blur(18px)'}}>
            <div className="flex items-center justify-between px-3 flex-shrink-0" style={{height:36,borderBottom:'1px solid rgba(0,229,255,.035)'}}>
              <div className="flex gap-0.5">{['COACH','HISTORY','TOOLS'].map((tab,i)=>
                <span key={tab} style={{fontFamily:UI,fontSize:8,letterSpacing:'.2em',padding:'4px 8px',cursor:'pointer',color:i===0?'#FF6B00':'rgba(78,84,105,.22)',border:`1px solid ${i===0?'rgba(255,107,0,.15)':'transparent'}`,background:i===0?'rgba(255,107,0,.04)':'transparent'}}>{tab}</span>
              )}</div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
              {msgs.map((m,i)=><Msg key={i} role={m.role} text={m.text}>
                {m.type==='building'&&<div className="flex items-center gap-1.5 mt-2" style={{fontSize:10,color:'rgba(78,84,105,.22)'}}>
                  <div style={{width:8,height:8,border:'1.5px solid rgba(45,50,68,.14)',borderTop:'1.5px solid #00E5FF',borderRadius:'50%',animation:'spin .7s linear infinite'}}/>Claude Sonnet · ~45s</div>}
                {m.type==='summary'&&<div className="mt-3 flex flex-wrap gap-1.5"><Sug text="Wire Stripe for payments"/><Sug text="Add client login"/><Sug text="Polish mobile view"/></div>}
                {m.type==='suggestion'&&<div className="mt-2 flex flex-wrap gap-1.5"><Sug text="Yes, wire Stripe"/><Sug text="Change the design first"/></div>}
              </Msg>)}
              {appState==='complete'&&<div style={{border:'1px solid rgba(255,107,0,.15)',padding:'10px 12px',background:'rgba(255,107,0,.04)',borderLeft:'2px solid rgba(255,107,0,.5)',animation:'fu .4s ease'}}>
                <div className="flex items-center gap-1.5 mb-1"><span style={{fontSize:10,color:'rgba(255,107,0,.7)'}}>◈</span><span style={{fontFamily:UI,fontSize:8,letterSpacing:'.3em',color:'rgba(255,107,0,.5)'}}>SOVREN CODE</span></div>
                <div style={{fontSize:14,color:'rgba(255,107,0,.9)',fontWeight:600}}>Supabase</div>
                <div style={{fontSize:12,color:'rgba(195,200,215,.82)',lineHeight:1.6,marginTop:3}}>Your app&apos;s brain and security guard. It remembers everything your users do and makes sure only the right people get in.</div>
                <div className="flex gap-1.5 mt-2">{['Got it','Tell me more','Save term'].map(a=><span key={a} className="cursor-pointer" style={{fontSize:9,color:'rgba(255,107,0,.7)',padding:'3px 8px',border:'1px solid rgba(255,107,0,.15)'}}>{a}</span>)}</div>
              </div>}
            </div>
            {showStrip&&<div className="flex gap-1 px-3 py-1.5 flex-shrink-0 flex-wrap" style={{borderTop:'1px solid rgba(0,229,255,.035)',animation:'fu .4s ease'}}>
              {['Look & Feel','How It Works','Business','Content'].map((p,i)=><span key={p} style={{fontSize:9,padding:'4px 8px',border:`1px solid ${i===0?'rgba(0,229,255,.3)':'rgba(0,229,255,.07)'}`,color:i===0?'#00E5FF':'rgba(115,122,142,.35)',background:i===0?'rgba(0,229,255,.04)':'transparent',cursor:'pointer'}}>{p}</span>)}
            </div>}
            <div className="px-3 pb-3 flex-shrink-0" style={{background:'rgba(8,11,22,.93)',borderTop:'1px solid rgba(0,229,255,.07)'}}>
              {showModes&&<div className="flex gap-0.5 mb-1" style={{animation:'fu .3s ease'}}>{['BUILD','PLAN','CHAT'].map((m,i)=>
                <span key={m} style={{fontFamily:UI,fontSize:8,letterSpacing:'.14em',padding:'3px 6px',cursor:'pointer',color:i===0?'#FF6B00':'rgba(78,84,105,.22)',border:`1px solid ${i===0?'rgba(255,107,0,.15)':'transparent'}`,background:i===0?'rgba(255,107,0,.04)':'transparent'}}>{m}</span>
              )}</div>}
              <textarea className="w-full bg-transparent outline-none resize-none" placeholder="What would make this better?"
                style={{background:'rgba(8,11,22,.7)',border:'1px solid rgba(0,229,255,.07)',borderBottom:'2px solid rgba(0,229,255,.15)',color:'#F0F0FF',fontSize:13,padding:'10px 12px',height:48,lineHeight:'1.5'}}/>
              <div className="flex items-center justify-between mt-2">
                <div className="flex gap-1 items-center">
                  {['📎','🎤','📷','◇'].map(i=><div key={i} className="flex items-center justify-center cursor-pointer" style={{width:22,height:22,border:'1px solid rgba(0,229,255,.07)',color:'rgba(78,84,105,.22)',fontSize:10}}>{i}</div>)}
                </div>
                <button style={{fontFamily:UI,fontSize:9,fontWeight:700,letterSpacing:'.16em',color:'#000308',background:'#00E5FF',border:'none',padding:'6px 14px',cursor:'pointer'}}>SEND →</button>
              </div>
            </div>
          </div>

          {/* RIGHT — PREVIEW */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center px-3 flex-shrink-0 overflow-hidden transition-all duration-300"
              style={{height:showNarr?28:0,background:'rgba(8,11,22,.93)',borderBottom:'1px solid rgba(0,229,255,.035)',fontFamily:MONO,fontSize:10,color:'rgba(0,229,255,.5)'}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:'#00E5FF',marginRight:8,animation:'pulse 1.5s ease infinite'}}/>
              {narrText}<span style={{color:'rgba(255,107,0,.5)',fontStyle:'italic',marginLeft:4}}> — {narrTeach}</span>
            </div>
            <div className="flex items-center justify-between px-3 flex-shrink-0" style={{height:30,background:'rgba(8,11,22,.93)',borderBottom:'1px solid rgba(0,229,255,.035)'}}>
              <span style={{fontSize:10,color:'rgba(78,84,105,.22)',background:'rgba(0,229,255,.04)',border:'1px solid rgba(0,229,255,.07)',padding:'2px 10px'}}>
                <b style={{color:'#00E5FF',fontWeight:500}}>clientportal</b>.sovrend.com</span>
              <div className="flex gap-1">
                {['History','Visual Edit','View Code','↗ New Tab'].map(a=><span key={a} className="cursor-pointer" onClick={()=>{if(a==='View Code')setCodeOpen(!codeOpen)}}
                  style={{fontSize:9,color:a==='View Code'&&codeOpen?'#00E5FF':'rgba(78,84,105,.22)',padding:'3px 6px',border:'1px solid rgba(0,229,255,.035)'}}>{a}</span>)}
              </div>
            </div>
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 flex flex-col" style={{background:'rgba(10,14,24,.5)'}}>
                {appState==='building'?<div className="flex-1 flex flex-col items-center justify-center gap-3" style={{background:'rgba(3,5,12,.9)'}}>
                  <div style={{width:28,height:28,border:'2px solid rgba(0,229,255,.07)',borderTop:'2px solid #00E5FF',borderRadius:'50%',animation:'spin .8s linear infinite'}}/>
                  <span style={{fontFamily:UI,fontSize:9,letterSpacing:'.28em',color:'#00E5FF'}}>BUILDING</span>
                </div>:
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center px-3 gap-1 flex-shrink-0" style={{height:28,background:'rgba(0,229,255,.04)',borderBottom:'1px solid rgba(0,229,255,.035)'}}>
                    {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:'50%',border:'1px solid rgba(45,50,68,.14)'}}/>)}
                    <span style={{fontSize:9,color:'rgba(115,122,142,.35)',marginLeft:5}}>Client Portal — Dashboard</span>
                  </div>
                  <div className="flex flex-1 overflow-hidden">
                    <div className="flex-shrink-0 flex flex-col py-2" style={{width:120,background:'rgba(4,6,14,.96)',borderRight:'1px solid rgba(0,229,255,.035)'}}>
                      <div style={{fontFamily:UI,fontSize:8,letterSpacing:'.2em',color:'rgba(0,229,255,.5)',padding:'4px 10px',marginBottom:6}}>PORTAL</div>
                      {['Dashboard','Projects','Invoices','Messages','Settings'].map((n,i)=><div key={n} style={{fontSize:10,padding:'5px 10px',color:i===0?'#00E5FF':'rgba(155,162,180,.55)',background:i===0?'rgba(0,229,255,.04)':'transparent',borderLeft:i===0?'2px solid #00E5FF':'2px solid transparent',cursor:'pointer'}}>{n}</div>)}
                    </div>
                    <div className="flex-1 p-3 overflow-auto">
                      <div style={{fontSize:14,color:'rgba(195,200,215,.82)',marginBottom:12}}>Welcome back, Operator</div>
                      <div className="flex gap-2 mb-3 flex-wrap">
                        {[{l:'ACTIVE PROJECTS',v:'7',c:'#00E5FF',s:'↑ 2 this week'},{l:'PENDING INVOICES',v:'3',c:'#FF6B00',s:'$4,200 total'},{l:'UNREAD MESSAGES',v:'12',c:'#B060FF',s:'3 clients'}].map(c=>
                          <div key={c.l} style={{flex:1,minWidth:100,padding:10,border:'1px solid rgba(0,229,255,.07)',background:'rgba(8,11,22,.93)'}}>
                            <div style={{fontFamily:UI,fontSize:7,letterSpacing:'.2em',color:'rgba(78,84,105,.22)'}}>{c.l}</div>
                            <div style={{fontSize:22,fontWeight:600,color:c.c,marginTop:2}}>{c.v}</div>
                            <div style={{fontSize:9,color:'rgba(115,122,142,.35)',marginTop:2}}>{c.s}</div>
                          </div>)}
                      </div>
                      <div style={{border:'1px solid rgba(0,229,255,.035)'}}>
                        <div className="flex" style={{borderBottom:'1px solid rgba(0,229,255,.035)',padding:'5px 8px'}}>
                          {['PROJECT','CLIENT','STATUS'].map(h=><span key={h} style={{flex:1,fontSize:8,fontFamily:UI,letterSpacing:'.2em',color:'rgba(78,84,105,.22)'}}>{h}</span>)}
                        </div>
                        {[{p:'Brand Redesign',c:'Acme Co',s:'Active'},{p:'Mobile App',c:'TechStart',s:'Review'},{p:'Dashboard',c:'DataFlow',s:'Active'}].map(r=>
                          <div key={r.p} className="flex" style={{borderBottom:'1px solid rgba(0,229,255,.035)',padding:'6px 8px'}}>
                            <span style={{flex:1,fontSize:10,color:'rgba(195,200,215,.82)'}}>{r.p}</span>
                            <span style={{flex:1,fontSize:10,color:'rgba(155,162,180,.55)'}}>{r.c}</span>
                            <span style={{flex:1}}><span style={{fontSize:9,padding:'2px 6px',border:'1px solid rgba(0,229,255,.15)',color:r.s==='Active'?'#00E5FF':'#FF6B00',background:r.s==='Active'?'rgba(0,229,255,.04)':'rgba(255,107,0,.04)'}}>{r.s}</span></span>
                          </div>)}
                      </div>
                    </div>
                  </div>
                </div>}
              </div>
              {codeOpen&&<div className="flex flex-col" style={{width:340,minWidth:340,background:'rgba(4,6,14,.96)',borderLeft:'1px solid rgba(0,229,255,.07)',animation:'fu .3s ease'}}>
                <div className="flex items-center justify-between px-3 flex-shrink-0" style={{height:30,borderBottom:'1px solid rgba(0,229,255,.035)'}}>
                  <div className="flex gap-0.5">{['FILES','TERMINAL'].map((t,i)=><span key={t} style={{fontFamily:UI,fontSize:8,letterSpacing:'.14em',padding:'4px 8px',color:i===0?'#00E5FF':'rgba(78,84,105,.22)',border:`1px solid ${i===0?'rgba(0,229,255,.15)':'transparent'}`,background:i===0?'rgba(0,229,255,.04)':'transparent'}}>{t}</span>)}</div>
                  <span className="cursor-pointer" onClick={()=>setCodeOpen(false)} style={{fontSize:10,color:'rgba(78,84,105,.22)'}}>✕</span>
                </div>
                <div className="px-3 py-2 flex-shrink-0" style={{borderBottom:'1px solid rgba(0,229,255,.035)'}}>
                  {['▾ src/','  App.tsx','  Dashboard.tsx','  Invoices.tsx','▾ lib/','  supabase.ts','▸ public/','package.json'].map((f,i)=>
                    <div key={f} style={{fontSize:10,padding:'2px 0',paddingLeft:f.startsWith(' ')?16:0,color:i===1?'#00E5FF':'rgba(155,162,180,.55)',
                      borderLeft:i===1?'1px solid rgba(0,229,255,.5)':'1px solid transparent',cursor:'pointer'}}>{f.trim()}</div>)}
                </div>
                <div className="flex-1 overflow-auto p-3" style={{fontFamily:MONO,fontSize:10,lineHeight:1.8,color:'rgba(155,162,180,.55)',background:'rgba(4,6,14,.5)'}}>
                  {[
                    {n:1,c:<><span style={{color:'rgba(0,229,255,.7)'}}>import</span>{' { '}<span style={{color:'rgba(255,107,0,.7)',borderBottom:'1px dashed rgba(255,107,0,.3)',cursor:'pointer'}} title="SOVREN CODE: A tool for managing data and user accounts">createClient</span>{' } '}<span style={{color:'rgba(0,229,255,.7)'}}>from</span> <span style={{color:'rgba(255,107,0,.7)'}}>&apos;@supabase/supabase-js&apos;</span></>},
                    {n:2,c:<><span style={{color:'rgba(0,229,255,.7)'}}>import</span>{' { '}<span style={{color:'rgba(255,107,0,.7)',borderBottom:'1px dashed rgba(255,107,0,.3)',cursor:'pointer'}} title="SOVREN CODE: Lets your app remember information between pages">useState</span>{' } '}<span style={{color:'rgba(0,229,255,.7)'}}>from</span> <span style={{color:'rgba(255,107,0,.7)'}}>&apos;react&apos;</span></>},
                    {n:3,c:''},
                    {n:4,c:<span style={{color:'rgba(78,84,105,.22)',fontStyle:'italic'}}>{'// Dashboard — your users see this first'}</span>},
                    {n:5,c:<><span style={{color:'rgba(0,229,255,.7)'}}>export default function</span> Dashboard() {'{'}</>},
                    {n:6,c:<>{'  '}<span style={{color:'rgba(0,229,255,.7)'}}>const</span> [projects] = <span style={{color:'rgba(255,107,0,.7)',borderBottom:'1px dashed rgba(255,107,0,.3)',cursor:'pointer'}} title="SOVREN CODE: Lets your app remember and update a list">useState</span>([])</>},
                    {n:7,c:''},
                    {n:8,c:<>{'  '}<span style={{color:'rgba(0,229,255,.7)'}}>return</span> ({'<div>'}...{'</div>'})</>},
                    {n:9,c:'}'},
                  ].map(l=><div key={l.n} className="flex gap-3"><span style={{minWidth:20,textAlign:'right',color:'rgba(78,84,105,.22)',userSelect:'none'}}>{l.n}</span><span>{l.c}</span></div>)}
                </div>
              </div>}
            </div>
          </div>
        </div>}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 flex-shrink-0" style={{height:26,background:'rgba(4,6,14,.96)',borderTop:'1px solid rgba(0,229,255,.035)'}}>
        <div className="flex gap-4" style={{fontSize:10,color:'rgba(78,84,105,.22)'}}>
          <span>Powered by <b style={{color:'#FF6B00',fontWeight:500}}>Claude Sonnet</b></span>
          <span>Auto-Fix <b style={{color:'#00E5FF'}}>●</b></span>
        </div>
        <div className="flex gap-4" style={{fontSize:10,color:'rgba(78,84,105,.22)'}}>
          <span>Supabase <b style={{color:'#00E5FF'}}>●</b></span>
          <span>Stripe <span style={{color:'#FF6B00'}}>○</span></span>
        </div>
      </div>
    </div>

    <GlossFab/>
  </main>
}

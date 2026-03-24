'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

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
  {t:'API',d:'How apps talk to each other. Your app uses APIs to connect to payments, databases, and services.'},
  {t:'Auth',d:'How your app knows who someone is. The login system that checks credentials.'},
  {t:'Backend',d:'The behind-the-scenes part of your app. Handles data, security, and logic users don\'t see.'},
  {t:'Component',d:'A reusable piece of your app\'s interface. A button, a card, a form — building blocks.'},
  {t:'Database',d:'Where your app stores information. Like a giant organized spreadsheet on the internet.'},
  {t:'Deploy',d:'Making your app live on the internet so anyone with the link can visit it.'},
  {t:'Domain',d:'Your app\'s address on the internet. Like myapp.com — what people type to find you.'},
  {t:'Environment Variables',d:'Secret settings your app needs — like passwords for services. Users never see them.'},
  {t:'Frontend',d:'The part people see and touch. Buttons, pages, forms, images — everything visual.'},
  {t:'Props',d:'Information passed between parts of your app. Like handing a note from one component to another.'},
  {t:'Responsive',d:'Your app looks good on any screen size — phone, tablet, desktop.'},
  {t:'Route',d:'A page in your app. /dashboard is one route, /invoices is another. Each has its own URL.'},
  {t:'Schema',d:'The blueprint for your data. Like deciding what columns go in a spreadsheet before filling it.'},
  {t:'Stripe',d:'A payment system. Handles credit cards, subscriptions, and sends money to your bank.'},
  {t:'Supabase',d:'Your app\'s database + login system in one. Stores data and controls who can see what.'},
  {t:'Tailwind',d:'The styling system that makes your app look good. Controls colors, spacing, fonts, and layout.'},
  {t:'TypeScript',d:'The programming language your app is written in. Like JavaScript but with safety guardrails.'},
  {t:'Webhook',d:'An automatic message between apps. When something happens in one, it instantly tells another.'},
]
const STEPS = [
  ['Setting up your database...','this stores all your project data'],
  ['Creating the dashboard layout...','your users will see this first'],
  ['Building the invoice system...','clients will see what they owe here'],
  ['Wiring client messaging...','real-time communication'],
  ['Applying styles and polish...','making it look professional'],
]

function GI({s=20}:{s?:number}) {
  const g=s*.05,sq=(s-g*2)/3
  return <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>{[0,1,2].map(r=>[0,1,2].map(c=>{
    const x=c*(sq+g),y=r*(sq+g)
    return r===1&&c===1?<rect key={`${r}${c}`} x={x} y={y} width={sq} height={sq} fill="#FF8C00"/>
    :<rect key={`${r}${c}`} x={x} y={y} width={sq} height={sq} fill="none" stroke="#00E5FF" strokeWidth={s>40?1:1.5}/>
  }))}</svg>
}

function GridBg({state,rainSpeed}:{state:string,rainSpeed:number}) {
  const bgRef=useRef<HTMLCanvasElement>(null),rainRef=useRef<HTMLCanvasElement>(null)
  const sr=useRef(state),spd=useRef(rainSpeed)
  sr.current=state;spd.current=rainSpeed
  const flashRef=useRef(0),burstRef=useRef(1)
  useEffect(()=>{
    const bg=bgRef.current,rc=rainRef.current;if(!bg||!rc)return
    const bx=bg.getContext('2d')!,rx=rc.getContext('2d')!
    let W=0,H=0,raf=0
    const QUOTE="AS A MAN THINKETH SO IS HE · THE PLACE WHERE THE THOUGHT BECOMES THE THING · BUILD ANYTHING OWN EVERYTHING · "
    const CHARS=QUOTE.split('')
    let drops:{x:number,y:number,speed:number,charIdx:number,baseOp:number,size:number}[]=[]
    const resize=()=>{W=bg.width=rc.width=innerWidth;H=bg.height=rc.height=innerHeight
      const cols=Math.floor(W/18);drops=[]
      for(let i=0;i<cols;i++)drops.push({x:i*18+4,y:Math.random()*H*-1,speed:0.6+Math.random()*1.2,charIdx:Math.floor(Math.random()*CHARS.length),baseOp:0.02+Math.random()*0.05,size:9+Math.random()*3})}
    const pj=(a:number,b:number,z:number)=>{if(z<5)return null;const s=H*.95/z;return{x:W/2+(a-W/2)*s,y:H*.65+b*s}}
    resize()
    const draw=(t:number)=>{
      bx.fillStyle='rgba(0,3,8,0.97)';bx.fillRect(0,0,W,H)
      const p=.015+Math.sin(t*.0004)*.008
      const gr=bx.createRadialGradient(W/2,H*.65,0,W/2,H*.65,W*.3)
      gr.addColorStop(0,`rgba(0,229,255,${p})`);gr.addColorStop(1,'rgba(0,0,0,0)')
      bx.fillStyle=gr;bx.fillRect(0,0,W,H)
      bx.lineCap='round'
      for(let i=0;i<=8;i++){const t2=i/8,px=(t2-.5)*W*.85+W/2
        const a=pj(px,0,50),b=pj(px,0,1400);if(!a||!b)continue
        bx.beginPath();bx.moveTo(a.x,a.y);bx.lineTo(b.x,b.y)
        bx.strokeStyle=`rgba(0,229,255,${(Math.sin(t2*Math.PI)*.06+.01).toFixed(3)})`;bx.lineWidth=.35;bx.stroke()}
      for(let i=0;i<9;i++){const z=50+(i/9)*1350
        const a=pj(-W*.35+W/2,0,z),b=pj(W*.35+W/2,0,z);if(!a||!b)continue
        bx.beginPath();bx.moveTo(a.x,a.y);bx.lineTo(b.x,b.y)
        bx.strokeStyle=`rgba(0,229,255,${((z-50)/1350*.05+.008).toFixed(3)})`;bx.lineWidth=.3;bx.stroke()}
      rx.fillStyle='rgba(0,3,8,0.06)';rx.fillRect(0,0,W,H)
      rx.textAlign='center'
      flashRef.current*=0.97;if(flashRef.current<0.001)flashRef.current=0
      burstRef.current+=(1-burstRef.current)*0.02
      const spdM=spd.current*burstRef.current
      for(const d of drops){const ch=CHARS[d.charIdx%CHARS.length],op=d.baseOp+flashRef.current*0.12
        rx.fillStyle=`rgba(0,229,255,${op*2.5})`;rx.font=`${d.size}px "SF Mono","Fira Code",monospace`;rx.fillText(ch,d.x,d.y)
        for(let j=1;j<6;j++){const tc=CHARS[(d.charIdx-j+CHARS.length)%CHARS.length],to=op*(1-j/6)
          if(to>0.005){rx.fillStyle=`rgba(0,229,255,${to})`;rx.font=`${d.size-j*.3}px "SF Mono","Fira Code",monospace`;rx.fillText(tc,d.x,d.y-j*14)}}
        d.y+=d.speed*spdM;if(Math.random()>.92)d.charIdx++
        if(d.y>H+100){d.y=-20-Math.random()*200;d.charIdx=Math.floor(Math.random()*CHARS.length);d.baseOp=0.02+Math.random()*0.05;d.speed=0.6+Math.random()*1.2}}
      raf=requestAnimationFrame(draw)}
    raf=requestAnimationFrame(draw);window.addEventListener('resize',resize)
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize)}
  },[])
  useEffect(()=>{if(state==='complete'){flashRef.current=1;burstRef.current=4}},[state])
  return <><canvas ref={bgRef} className="fixed inset-0 z-0"/><canvas ref={rainRef} className="fixed inset-0" style={{zIndex:1}}/></>
}

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

function Sug({text}:{text:string}) {
  return <span className="cursor-pointer inline-block" style={{fontSize:11,padding:'5px 12px',border:'1px solid rgba(0,229,255,.15)',color:'rgba(0,229,255,.7)',background:'rgba(0,229,255,.04)'}}>{text}</span>
}

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
          <div style={{fontSize:10,color:'rgba(195,200,215,.75)',marginTop:2,lineHeight:1.45}}>{g.d}</div>
        </div>)}
      </div>
    </div>}
  </>
}

function EntryScreen({onDone}:{onDone:()=>void}) {
  const ref=useRef<HTMLCanvasElement>(null)
  const [show,setShow]=useState(true)
  const [logoVis,setLogoVis]=useState(false)
  useEffect(()=>{
    const c=ref.current;if(!c)return
    const ctx=c.getContext('2d')!
    let W=c.width=innerWidth,H=c.height=innerHeight,prog=0,raf=0,done=false
    const draw=()=>{
      ctx.clearRect(0,0,W,H);prog=Math.min(prog+0.02,1)
      const lx=W*prog,ly=H*0.5;ctx.lineCap='round'
      ctx.beginPath();ctx.moveTo(0,ly);ctx.lineTo(lx,ly);ctx.strokeStyle='rgba(0,229,255,0.12)';ctx.lineWidth=8;ctx.stroke()
      ctx.beginPath();ctx.moveTo(0,ly);ctx.lineTo(lx,ly);ctx.strokeStyle='rgba(0,229,255,0.5)';ctx.lineWidth=2;ctx.stroke()
      ctx.beginPath();ctx.moveTo(0,ly);ctx.lineTo(lx,ly);ctx.strokeStyle='rgba(210,252,255,0.85)';ctx.lineWidth=0.5;ctx.stroke()
      if(prog<0.99){ctx.beginPath();ctx.arc(lx,ly,6,0,Math.PI*2);ctx.fillStyle='rgba(0,229,255,0.08)';ctx.fill()
        ctx.beginPath();ctx.arc(lx,ly,3,0,Math.PI*2);ctx.fillStyle='rgba(0,229,255,0.3)';ctx.fill()
        ctx.beginPath();ctx.arc(lx,ly,1.2,0,Math.PI*2);ctx.fillStyle='rgba(230,252,255,0.9)';ctx.fill()}
      if(prog>0.3&&!logoVis)setLogoVis(true)
      if(prog>=1&&!done){done=true;setTimeout(()=>{setShow(false);onDone()},400);return}
      raf=requestAnimationFrame(draw)}
    raf=requestAnimationFrame(draw);return()=>cancelAnimationFrame(raf)
  },[])
  if(!show)return null
  return <><canvas ref={ref} className="fixed inset-0" style={{zIndex:15}}/>
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-3" style={{zIndex:16,pointerEvents:'none'}}>
      <div style={{opacity:logoVis?1:0,transform:logoVis?'translateY(0)':'translateY(6px)',transition:'all .4s ease'}}><GI s={28}/></div>
      <div style={{fontFamily:UI,fontSize:14,fontWeight:700,letterSpacing:'.35em',color:'rgba(0,229,255,.7)',textShadow:'0 0 30px rgba(0,229,255,.08)',
        opacity:logoVis?1:0,transform:logoVis?'translateY(0)':'translateY(6px)',transition:'all .4s ease .1s'}}>SOVREND</div>
    </div></>
}

export default function DashboardPage() {
  const [entered,setEntered]=useState(false)
  const [appState,setAppState]=useState<'idle'|'building'|'complete'>('idle')
  const [prompt,setPrompt]=useState('')
  const [sbCol,setSbCol]=useState(false)
  const [projName,setProjName]=useState('New Build')
  const [ver,setVer]=useState('NEW')
  const [pubVis,setPubVis]=useState(false)
  const [settingsOpen,setSettingsOpen]=useState(false)
  const [codeOpen,setCodeOpen]=useState(false)
  const [narrText,setNarrText]=useState('')
  const [narrTeach,setNarrTeach]=useState('')
  const [showNarr,setShowNarr]=useState(false)
  const [showStrip,setShowStrip]=useState(false)
  const [showModes,setShowModes]=useState(false)
  const [phIdx,setPhIdx]=useState(0)
  const [msgs,setMsgs]=useState<{role:'coach'|'user';text:string;type?:string}[]>([])
  const sbW=sbCol?52:220
  const rainSpeed=entered?1:2.5
  useEffect(()=>{if(appState!=='idle')return;const iv=setInterval(()=>setPhIdx(p=>(p+1)%PLACEHOLDERS.length),4000);return()=>clearInterval(iv)},[appState])
  useEffect(()=>{const h=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key==='Enter'&&appState==='idle'&&prompt.trim()){e.preventDefault();handleBuild()}};document.addEventListener('keydown',h);return()=>document.removeEventListener('keydown',h)},[appState,prompt])
  const handleBuild=useCallback(async()=>{
    if(!prompt.trim()||appState!=='idle')return
    setAppState('building');setProjName('Client Portal');setVer('BUILDING...');setShowNarr(true)
    setMsgs([{role:'coach',text:'I see your vision. Let me bring it to life.'},{role:'user',text:prompt},{role:'coach',text:'Building now \u2014 I\'ll walk you through each step.',type:'building'}])
    let step=0;setNarrText(STEPS[0][0]);setNarrTeach(STEPS[0][1])
    const ni=setInterval(()=>{step++;if(step>=STEPS.length){clearInterval(ni);return};setNarrText(STEPS[step][0]);setNarrTeach(STEPS[step][1])},800)
    setTimeout(()=>{clearInterval(ni);setAppState('complete');setVer('v1.0');setShowNarr(false);setPubVis(true)
      setMsgs(prev=>[...prev,{role:'coach',text:'Your portal is live. That used 1 of your 8 free actions. Here\'s what I\'d suggest next:',type:'summary'},{role:'coach',text:'Invoices need a pay button. Want me to wire Stripe so clients pay directly?',type:'suggestion'}])
      setTimeout(()=>setShowStrip(true),400);setTimeout(()=>setShowModes(true),1000)},4000)
  },[prompt,appState])
  const loadTpl=(k:string)=>{if(TEMPLATES[k])setPrompt(TEMPLATES[k])}
  return <main className="relative min-h-screen overflow-hidden">
    <GridBg state={appState} rainSpeed={rainSpeed}/>
    <style jsx global>{`@keyframes fu{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(45,50,68,.14);border-radius:2px}`}</style>
    {!entered&&<EntryScreen onDone={()=>setEntered(true)}/>}
    <div className="fixed left-0 top-0 bottom-0 z-50 flex flex-col transition-all duration-300" style={{width:sbW,background:'rgba(4,6,14,.96)',borderRight:'1px solid rgba(0,229,255,.07)',backdropFilter:'blur(18px)',opacity:entered?1:0,transition:'opacity .5s ease'}}>
      <div className="flex items-center gap-2.5 px-4 py-3.5 flex-shrink-0" style={{borderBottom:'1px solid rgba(0,229,255,.035)'}}><GI s={20}/>{!sbCol&&<span style={{fontFamily:UI,fontSize:9,fontWeight:700,letterSpacing:'.2em',color:'rgba(0,229,255,.7)'}}>SOVREND</span>}<span className="ml-auto cursor-pointer" onClick={()=>setSbCol(!sbCol)} style={{fontSize:10,color:'rgba(115,122,142,.35)'}}>{sbCol?'▷':'◁'}</span></div>
      <div className="flex-1 overflow-y-auto px-2 py-2.5">
        {[{i:'⌂',l:'Home',a:true},{i:'⌕',l:'Search',r:'⌘K'}].map(x=><div key={x.l} className="flex items-center gap-2.5 cursor-pointer mb-px" style={{padding:sbCol?0:'8px 10px',width:sbCol?36:undefined,height:sbCol?36:undefined,margin:sbCol?'0 auto 2px':undefined,justifyContent:sbCol?'center':undefined,display:'flex',fontSize:12,color:x.a?'#00E5FF':'rgba(195,200,215,.75)',background:x.a?'rgba(0,229,255,.04)':'transparent',border:`1px solid ${x.a?'rgba(0,229,255,.15)':'transparent'}`}}><span style={{fontSize:14,width:20,textAlign:'center'}}>{x.i}</span>{!sbCol&&<span className="flex-1">{x.l}</span>}{!sbCol&&x.r&&<span style={{fontSize:8,color:'rgba(78,84,105,.22)',fontFamily:MONO}}>{x.r}</span>}</div>)}
        {!sbCol&&<div className="flex items-center justify-center gap-2 cursor-pointer my-1 py-2" style={{border:'1px solid rgba(0,229,255,.15)',background:'rgba(0,229,255,.04)',color:'#00E5FF',fontFamily:UI,fontSize:9,letterSpacing:'.14em',fontWeight:600}}>+&nbsp;NEW BUILD</div>}
        {sbCol&&<div className="flex items-center justify-center cursor-pointer mb-px" style={{width:36,height:36,margin:'4px auto',color:'#00E5FF',border:'1px solid rgba(0,229,255,.15)',background:'rgba(0,229,255,.04)',fontSize:16}}>+</div>}
        {!sbCol&&<div style={{fontFamily:UI,fontSize:8,letterSpacing:'.2em',color:'rgba(0,229,255,.4)',padding:'10px 10px 4px'}}>PROJECTS</div>}
        {[{i:'◫',l:'All projects',c:'1'},{i:'★',l:'Starred'},{i:'◷',l:'Recent'}].map(x=><div key={x.l} className="flex items-center gap-2.5 cursor-pointer mb-px" style={{padding:sbCol?0:'8px 10px',width:sbCol?36:undefined,height:sbCol?36:undefined,margin:sbCol?'0 auto 2px':undefined,justifyContent:sbCol?'center':undefined,display:'flex',fontSize:12,color:'rgba(195,200,215,.75)(155,162,180,.55)',border:'1px solid transparent'}}><span style={{fontSize:14,width:20,textAlign:'center'}}>{x.i}</span>{!sbCol&&<span className="flex-1">{x.l}</span>}{!sbCol&&x.c&&<span style={{fontSize:9,color:'rgba(78,84,105,.22)',background:'rgba(0,229,255,.04)',padding:'1px 6px',border:'1px solid rgba(0,229,255,.07)'}}>{x.c}</span>}</div>)}
        {!sbCol&&<div style={{fontFamily:UI,fontSize:8,letterSpacing:'.2em',color:'rgba(0,229,255,.4)',padding:'10px 10px 4px'}}>SPARK · TEMPLATES</div>}
        {[{k:'portal',l:'Client Portal'},{k:'saas',l:'SaaS Dashboard'},{k:'booking',l:'Booking System'},{k:'store',l:'Online Store'}].map(s=><div key={s.k} className="flex items-center gap-2.5 cursor-pointer mb-px" onClick={()=>loadTpl(s.k)} style={{padding:sbCol?0:'8px 10px',width:sbCol?36:undefined,height:sbCol?36:undefined,margin:sbCol?'0 auto 2px':undefined,justifyContent:sbCol?'center':undefined,display:'flex',fontSize:12,color:'rgba(195,200,215,.75)(155,162,180,.55)',border:'1px solid transparent'}}><span style={{fontSize:14,width:20,textAlign:'center'}}>◈</span>{!sbCol&&<span>{s.l}</span>}</div>)}
        {!sbCol&&<div style={{height:1,background:'rgba(0,229,255,.035)',margin:'6px 10px'}}/>}
        <div className="flex items-center gap-2.5 cursor-pointer mb-px" style={{padding:sbCol?0:'8px 10px',width:sbCol?36:undefined,height:sbCol?36:undefined,margin:sbCol?'0 auto 2px':undefined,justifyContent:sbCol?'center':undefined,display:'flex',fontSize:12,color:'rgba(195,200,215,.75)',border:'1px solid transparent'}}><span style={{fontSize:14,width:20,textAlign:'center'}}>△</span>{!sbCol&&<span style={{color:'rgba(0,229,255,.55)'}}>UPLINK Profile</span>}</div>
      </div>
      {!sbCol&&<div className="flex flex-col gap-1 p-2" style={{borderTop:'1px solid rgba(0,229,255,.035)'}}>
        <div className="flex items-center gap-2 p-2.5 cursor-pointer" style={{border:'1px solid rgba(0,229,255,.15)',color:'rgba(0,229,255,.7)',fontSize:11}}><span style={{fontSize:14}}>★</span><div><div>Share SOVREND</div><div style={{fontSize:9,color:'rgba(115,122,142,.35)',marginTop:2}}>Earn for every referral</div></div></div>
        <div className="flex items-center gap-2 p-2.5 cursor-pointer" style={{border:'1px solid rgba(0,229,255,.15)',background:'rgba(0,229,255,.04)',color:'#00E5FF',fontSize:11}}><span style={{fontSize:14}}>⚡</span><div><div>Upgrade to Builder</div><div style={{fontSize:9,color:'rgba(115,122,142,.35)',marginTop:2}}>25 actions/month → $22/mo</div></div></div>
        <div className="flex items-center gap-2 px-2.5 py-2"><div className="flex items-center justify-center" style={{width:28,height:28,border:'1px solid rgba(0,229,255,.15)',fontFamily:UI,fontSize:8,color:'#00E5FF'}}>SD</div><div><div style={{fontSize:11,color:'rgba(195,200,215,.82)'}}>StevieD</div><div style={{fontFamily:UI,fontSize:8,color:'rgba(115,122,142,.35)',letterSpacing:'.1em'}}>OPERATOR</div></div></div>
      </div>}
    </div>
    <div className="fixed z-10 flex flex-col transition-all duration-300" style={{left:sbW,top:0,right:0,bottom:0,opacity:entered?1:0,transition:'opacity .5s ease'}}>
      <div className="flex items-center px-4 flex-shrink-0" style={{height:44,background:'rgba(4,6,14,.96)',borderBottom:'1px solid rgba(0,229,255,.07)',backdropFilter:'blur(18px)'}}>
        <div className="flex items-center gap-3 flex-shrink-0"><span style={{fontSize:13,color:'rgba(rgba(195,200,215,.75),.55)'}}>{projName}</span><span style={{fontFamily:UI,fontSize:8,color:'rgba(78,84,105,.22)',letterSpacing:'.12em'}}>{ver}</span></div>
        <div className="flex-1 flex items-center justify-center gap-2">{appState!=='idle'&&<div className="flex" style={{border:'1px solid rgba(0,229,255,.07)'}}>{['DESKTOP','MOBILE','TABLET'].map((v,i)=><button key={v} style={{fontFamily:UI,fontSize:8,letterSpacing:'.14em',padding:'5px 12px',color:i===0?'#00E5FF':'rgba(78,84,105,.22)',background:i===0?'rgba(0,229,255,.04)':'transparent',border:'none',cursor:'pointer'}}>{v}</button>)}</div>}</div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span style={{fontFamily:UI,fontSize:8,letterSpacing:'.14em',padding:'4px 8px',color:'#00E5FF',border:'1px solid rgba(0,229,255,.15)',background:'rgba(0,229,255,.04)'}}>OPERATOR</span>
          <span style={{fontFamily:UI,fontSize:8,letterSpacing:'.14em',padding:'4px 8px',color:'#FF6B00',border:'1px solid rgba(255,107,0,.15)',background:'rgba(255,107,0,.04)'}}>BUILT WITH CLAUDE</span>
          <button style={{fontFamily:UI,fontSize:8,fontWeight:700,letterSpacing:'.22em',color:'#000308',background:'#F0F0FF',border:'none',padding:'7px 18px',cursor:'pointer',opacity:pubVis?1:0,pointerEvents:pubVis?'auto':'none',transition:'all .6s',boxShadow:pubVis?'0 0 14px rgba(240,240,255,.15)':'none'}}>PUBLISH</button>
          <div className="flex items-center justify-center cursor-pointer" onClick={()=>setSettingsOpen(!settingsOpen)} style={{width:26,height:26,border:'1px solid rgba(0,229,255,.07)',color:'rgba(78,84,105,.22)',fontSize:12}}>⚙</div>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden relative">
        {appState==='idle'&&<div className="absolute inset-0 flex items-center justify-center px-6 z-20"><div className="flex flex-col items-center max-w-xl w-full text-center">
          <div className="flex gap-2.5 items-start mb-6 text-left w-full max-w-lg" style={{padding:'12px 14px',background:'rgba(240,240,255,.03)',border:'1px solid rgba(240,240,255,.06)',borderLeft:'2px solid rgba(255,107,0,.4)'}}>
            <div className="flex items-center justify-center flex-shrink-0" style={{width:28,height:28,fontFamily:UI,fontSize:8,border:'1px solid rgba(255,107,0,.3)',color:'#FF6B00',background:'rgba(255,107,0,.04)'}}>C</div>
            <div style={{fontSize:14,color:'rgba(240,240,255,.75)',lineHeight:1.6}}>Tell me what you want to build — in your own words. I&apos;ll handle the rest.</div>
          </div>
          <h2 style={{fontFamily:UI,fontSize:'clamp(18px,3vw,30px)',fontWeight:700,color:'#F0F0FF',marginBottom:8}}>What are you ready to build?</h2>
          <p style={{fontSize:13.5,color:'rgba(rgba(195,200,215,.75),.55)',marginBottom:26}}>No code needed. Takes about 60 seconds.</p>
          <div className="w-full max-w-lg" style={{background:'rgba(4,6,14,.96)',border:'1px solid rgba(0,229,255,.15)',borderBottom:'2px solid rgba(0,229,255,.3)',padding:16,backdropFilter:'blur(18px)'}}>
            <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder={PLACEHOLDERS[phIdx]} className="w-full bg-transparent outline-none resize-none" style={{color:'#F0F0FF',fontSize:17,height:60,lineHeight:'1.55'}}/>
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-1.5 items-center">
                {['📎','🎤','◇'].map(i=><div key={i} className="flex items-center justify-center cursor-pointer" style={{width:28,height:28,border:'1px solid rgba(0,229,255,.07)',color:'rgba(78,84,105,.22)',fontSize:12}}>{i}</div>)}
                <div className="cursor-pointer" title="Coach improves your description before building" style={{fontFamily:UI,fontSize:8,letterSpacing:'.12em',color:'#00E5FF',border:'1px solid rgba(0,229,255,.15)',background:'rgba(0,229,255,.04)',padding:'5px 10px',height:28,display:'flex',alignItems:'center'}}>✦ ENHANCE</div>
              </div>
              <button onClick={handleBuild} style={{fontFamily:UI,fontSize:10,fontWeight:700,letterSpacing:'.22em',color:'#000308',background:'#00E5FF',border:'none',padding:'9px 24px',cursor:'pointer',boxShadow:'0 0 8px rgba(0,229,255,.15)'}}>BUILD IT →</button>
            </div>
          </div>
        </div></div>}
        {appState!=='idle'&&<div className="flex w-full h-full" style={{animation:'fu .5s ease'}}>
          <div className="flex flex-col h-full" style={{width:370,minWidth:370,background:'rgba(4,6,14,.96)',borderRight:'1px solid rgba(0,229,255,.07)',backdropFilter:'blur(18px)'}}>
            <div className="flex items-center justify-between px-3 flex-shrink-0" style={{height:36,borderBottom:'1px solid rgba(0,229,255,.035)'}}><div className="flex gap-0.5">{['COACH','HISTORY','TOOLS'].map((tab,i)=><span key={tab} style={{fontFamily:UI,fontSize:8,letterSpacing:'.2em',padding:'4px 8px',cursor:'pointer',color:i===0?'#FF6B00':'rgba(78,84,105,.22)',border:`1px solid ${i===0?'rgba(255,107,0,.15)':'transparent'}`,background:i===0?'rgba(255,107,0,.04)':'transparent'}}>{tab}</span>)}</div></div>
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
              {msgs.map((m,i)=><Msg key={i} role={m.role} text={m.text}>
                {m.type==='building'&&<div className="flex items-center gap-1.5 mt-2" style={{fontSize:10,color:'rgba(78,84,105,.22)'}}><div style={{width:8,height:8,border:'1.5px solid rgba(45,50,68,.14)',borderTop:'1.5px solid #00E5FF',borderRadius:'50%',animation:'spin .7s linear infinite'}}/>Claude Sonnet · ~45s</div>}
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
            {showStrip&&<div className="flex gap-1 px-3 py-1.5 flex-shrink-0 flex-wrap" style={{borderTop:'1px solid rgba(0,229,255,.035)',animation:'fu .4s ease'}}>{['Look & Feel','How It Works','Business','Content'].map((p,i)=><span key={p} style={{fontSize:9,padding:'4px 8px',border:`1px solid ${i===0?'rgba(0,229,255,.3)':'rgba(0,229,255,.07)'}`,color:i===0?'#00E5FF':'rgba(115,122,142,.35)',background:i===0?'rgba(0,229,255,.04)':'transparent',cursor:'pointer'}}>{p}</span>)}</div>}
            <div className="px-3 pb-3 flex-shrink-0" style={{background:'rgba(8,11,22,.93)',borderTop:'1px solid rgba(0,229,255,.07)'}}>
              {showModes&&<div className="flex gap-0.5 mb-1" style={{animation:'fu .3s ease'}}>{['BUILD','PLAN','CHAT'].map((m,i)=><span key={m} style={{fontFamily:UI,fontSize:8,letterSpacing:'.14em',padding:'3px 6px',cursor:'pointer',color:i===0?'#00E5FF':'rgba(78,84,105,.22)',border:`1px solid ${i===0?'rgba(0,229,255,.15)':'transparent'}`,background:i===0?'rgba(0,229,255,.04)':'transparent'}}>{m}</span>)}</div>}
              <textarea className="w-full bg-transparent outline-none resize-none" placeholder="What would make this better?" style={{background:'rgba(8,11,22,.7)',border:'1px solid rgba(0,229,255,.07)',borderBottom:'2px solid rgba(0,229,255,.15)',color:'#F0F0FF',fontSize:13,padding:'10px 12px',height:48,lineHeight:'1.5'}}/>
              <div className="flex items-center justify-between mt-2"><div className="flex gap-1 items-center">{['📎','🎤','📷','◇'].map(i=><div key={i} className="flex items-center justify-center cursor-pointer" style={{width:22,height:22,border:'1px solid rgba(0,229,255,.07)',color:'rgba(78,84,105,.22)',fontSize:10}}>{i}</div>)}</div><button style={{fontFamily:UI,fontSize:9,fontWeight:700,letterSpacing:'.16em',color:'#000308',background:'#00E5FF',border:'none',padding:'6px 14px',cursor:'pointer'}}>SEND →</button></div>
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center px-3 flex-shrink-0 overflow-hidden transition-all duration-300" style={{height:showNarr?28:0,background:'rgba(8,11,22,.93)',borderBottom:'1px solid rgba(0,229,255,.035)',fontFamily:MONO,fontSize:10,color:'rgba(0,229,255,.5)'}}><div style={{width:6,height:6,borderRadius:'50%',background:'#00E5FF',marginRight:8,animation:'pulse 1.5s ease infinite'}}/>{narrText}<span style={{color:'rgba(0,229,255,.3)',fontStyle:'italic',marginLeft:4}}> — {narrTeach}</span></div>
            <div className="flex items-center justify-between px-3 flex-shrink-0" style={{height:30,background:'rgba(8,11,22,.93)',borderBottom:'1px solid rgba(0,229,255,.035)'}}><span style={{fontSize:10,color:'rgba(78,84,105,.22)',background:'rgba(0,229,255,.04)',border:'1px solid rgba(0,229,255,.07)',padding:'2px 10px'}}><b style={{color:'#00E5FF',fontWeight:500}}>clientportal</b>.sovrend.com</span><div className="flex gap-1">{['History','Visual Edit','View Code','↗ New Tab'].map(a=><span key={a} className="cursor-pointer" onClick={()=>{if(a==='View Code')setCodeOpen(!codeOpen)}} style={{fontSize:9,color:a==='View Code'&&codeOpen?'#00E5FF':'rgba(78,84,105,.22)',padding:'3px 6px',border:'1px solid rgba(0,229,255,.035)'}}>{a}</span>)}</div></div>
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 flex flex-col" style={{background:'rgba(10,14,24,.5)'}}>
                {appState==='building'?<div className="flex-1 flex flex-col items-center justify-center gap-3" style={{background:'rgba(3,5,12,.9)'}}><div style={{width:28,height:28,border:'2px solid rgba(0,229,255,.07)',borderTop:'2px solid #00E5FF',borderRadius:'50%',animation:'spin .8s linear infinite'}}/><span style={{fontFamily:UI,fontSize:9,letterSpacing:'.28em',color:'#00E5FF'}}>BUILDING</span></div>:
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center px-3 gap-1 flex-shrink-0" style={{height:28,background:'rgba(0,229,255,.04)',borderBottom:'1px solid rgba(0,229,255,.035)'}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:'50%',border:'1px solid rgba(45,50,68,.14)'}}/>)}<span style={{fontSize:9,color:'rgba(115,122,142,.35)',marginLeft:5}}>Client Portal — Dashboard</span></div>
                  <div className="flex flex-1 overflow-hidden">
                    <div className="flex-shrink-0 flex flex-col py-2" style={{width:120,background:'rgba(4,6,14,.96)',borderRight:'1px solid rgba(0,229,255,.035)'}}><div style={{fontFamily:UI,fontSize:8,letterSpacing:'.2em',color:'rgba(0,229,255,.5)',padding:'4px 10px',marginBottom:6}}>PORTAL</div>{['Dashboard','Projects','Invoices','Messages','Settings'].map((n,i)=><div key={n} style={{fontSize:10,padding:'5px 10px',color:i===0?'#00E5FF':'rgba(rgba(195,200,215,.75),.55)',background:i===0?'rgba(0,229,255,.04)':'transparent',borderLeft:i===0?'2px solid #00E5FF':'2px solid transparent',cursor:'pointer'}}>{n}</div>)}</div>
                    <div className="flex-1 p-3 overflow-auto">
                      <div style={{fontSize:14,color:'rgba(195,200,215,.82)',marginBottom:12}}>Welcome back, Operator</div>
                      <div className="flex gap-2 mb-3 flex-wrap">{[{l:'ACTIVE PROJECTS',v:'7',c:'#00E5FF',s:'↑ 2 this week'},{l:'PENDING INVOICES',v:'3',c:'#FF6B00',s:'$4,200 total'},{l:'UNREAD MESSAGES',v:'12',c:'#B060FF',s:'3 clients'}].map(c=><div key={c.l} style={{flex:1,minWidth:100,padding:10,border:'1px solid rgba(0,229,255,.07)',background:'rgba(8,11,22,.93)'}}><div style={{fontFamily:UI,fontSize:7,letterSpacing:'.2em',color:'rgba(78,84,105,.22)'}}>{c.l}</div><div style={{fontSize:22,fontWeight:600,color:c.c,marginTop:2}}>{c.v}</div><div style={{fontSize:9,color:'rgba(115,122,142,.35)',marginTop:2}}>{c.s}</div></div>)}</div>
                      <div style={{border:'1px solid rgba(0,229,255,.035)'}}><div className="flex" style={{borderBottom:'1px solid rgba(0,229,255,.035)',padding:'5px 8px'}}>{['PROJECT','CLIENT','STATUS'].map(h=><span key={h} style={{flex:1,fontSize:8,fontFamily:UI,letterSpacing:'.2em',color:'rgba(78,84,105,.22)'}}>{h}</span>)}</div>{[{p:'Brand Redesign',c:'Acme Co',s:'Active'},{p:'Mobile App',c:'TechStart',s:'Review'},{p:'Dashboard',c:'DataFlow',s:'Active'}].map(r=><div key={r.p} className="flex" style={{borderBottom:'1px solid rgba(0,229,255,.035)',padding:'6px 8px'}}><span style={{flex:1,fontSize:10,color:'rgba(195,200,215,.82)'}}>{r.p}</span><span style={{flex:1,fontSize:10,color:'rgba(rgba(195,200,215,.75),.55)'}}>{r.c}</span><span style={{flex:1}}><span style={{fontSize:9,padding:'2px 6px',border:'1px solid rgba(0,229,255,.15)',color:r.s==='Active'?'#00E5FF':'#FF6B00',background:r.s==='Active'?'rgba(0,229,255,.04)':'rgba(255,107,0,.04)'}}>{r.s}</span></span></div>)}</div>
                    </div>
                  </div>
                </div>}
              </div>
              {codeOpen&&<div className="flex flex-col" style={{width:340,minWidth:340,background:'rgba(4,6,14,.96)',borderLeft:'1px solid rgba(0,229,255,.07)',animation:'fu .3s ease'}}>
                <div className="flex items-center justify-between px-3 flex-shrink-0" style={{height:30,borderBottom:'1px solid rgba(0,229,255,.035)'}}><div className="flex gap-0.5">{['FILES','TERMINAL'].map((t,i)=><span key={t} style={{fontFamily:UI,fontSize:8,letterSpacing:'.14em',padding:'4px 8px',color:i===0?'#00E5FF':'rgba(78,84,105,.22)',border:`1px solid ${i===0?'rgba(0,229,255,.15)':'transparent'}`,background:i===0?'rgba(0,229,255,.04)':'transparent'}}>{t}</span>)}</div><span className="cursor-pointer" onClick={()=>setCodeOpen(false)} style={{fontSize:10,color:'rgba(78,84,105,.22)'}}>✕</span></div>
                <div className="px-3 py-2 flex-shrink-0" style={{borderBottom:'1px solid rgba(0,229,255,.035)'}}>{['▾ src/','  App.tsx','  Dashboard.tsx','  Invoices.tsx','▾ lib/','  supabase.ts','▸ public/','package.json'].map((f,i)=><div key={f} style={{fontSize:10,padding:'2px 0',paddingLeft:f.startsWith(' ')?16:0,color:i===1?'#00E5FF':'rgba(rgba(155,162,180,rgba(195,200,215,.75)55),.55)',borderLeft:i===1?'1px solid rgba(0,229,255,.5)':'1px solid transparent',cursor:'pointer'}}>{f.trim()}</div>)}</div>
                <div className="flex-1 overflow-auto p-3" style={{fontFamily:MONO,fontSize:10,lineHeight:1.8,color:'(1 rgba 55,162,180,.55)',background:'rgba(4,6,14,.5)'}}>
                  {[{n:1,c:<><span style={{color:'rgba(0,229,255,.7)'}}>import</span>{' { '}<span style={{color:'rgba(255,107,0,.7)',borderBottom:'1px dashed rgba(255,107,0,.3)',cursor:'pointer'}} title="SOVREN CODE: A tool for managing data">createClient</span>{' } '}<span style={{color:'rgba(0,229,255,.7)'}}>from</span> <span style={{color:'rgba(255,107,0,.7)'}}>&apos;@supabase/supabase-js&apos;</span></>},{n:2,c:<><span style={{color:'rgba(0,229,255,.7)'}}>import</span>{' { '}<span style={{color:'rgba(255,107,0,.7)',borderBottom:'1px dashed rgba(255,107,0,.3)',cursor:'pointer'}} title="SOVREN CODE: Remembers info between pages">useState</span>{' } '}<span style={{color:'rgba(0,229,255,.7)'}}>from</span> <span style={{color:'rgba(255,107,0,.7)'}}>&apos;react&apos;</span></>},{n:3,c:''},{n:4,c:<span style={{color:'rgba(78,84,105,.22)',fontStyle:'italic'}}>{'// Dashboard — users see this first'}</span>},{n:5,c:<><span style={{color:'rgba(0,229,255,.7)'}}>export default function</span> Dashboard() {'{'}</>},{n:6,c:<>{'  '}<span style={{color:'rgba(0,229,255,.7)'}}>const</span> [projects] = <span style={{color:'rgba(255,107,0,.7)',borderBottom:'1px dashed rgba(255,107,0,.3)',cursor:'pointer'}} title="SOVREN CODE: Remembers a list">useState</span>([])</>},{n:7,c:<>{'  '}<span style={{color:'rgba(0,229,255,.7)'}}>return</span> ({'<div>'}...{'</div>'})</>},{n:8,c:'}'}].map(l=><div key={l.n} className="flex gap-3"><span style={{minWidth:20,textAlign:'right',color:'rgba(78,84,105,.22)',userSelect:'none'}}>{l.n}</span><span>{l.c}</span></div>)}
                </div>
              </div>}
            </div>
          </div>
        </div>}
      </div>
      <div className="flex items-center justify-between px-4 flex-shrink-0" style={{height:26,background:'rgba(4,6,14,.96)',borderTop:'1px solid rgba(0,229,255,.035)'}}><div className="flex gap-4" style={{fontSize:10,color:'rgba(155,162,180,.45)'}}><span>Powered by <b style={{color:'#FF6B00',fontWeight:500}}>Claude Sonnet</b></span><span>Auto-Fix <b style={{color:'#00E5FF'}}>●</b></span></div><div className="flex gap-4" style={{fontSize:10,color:'rgba(155,162,180,.45)'}}><span>Supabase <b style={{color:'#00E5FF'}}>●</b></span><span>Stripe <span style={{color:'#FF6B00'}}>○</span></span></div></div>
    </div>
    <GlossFab/>
  </main>
}
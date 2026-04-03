'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

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
  {t:'Component',d:'A reusable piece of your app\'s interface. A button, a card, a form - building blocks.'},
  {t:'Database',d:'Where your app stores information. Like a giant organized spreadsheet on the internet.'},
  {t:'Deploy',d:'Making your app live on the internet so anyone with the link can visit it.'},
  {t:'Domain',d:'Your app\'s address on the internet. Like myapp.com - what people type to find you.'},
  {t:'Environment Variables',d:'Secret settings your app needs - like passwords for services. Users never see them.'},
  {t:'Frontend',d:'The part people see and touch. Buttons, pages, forms, images - everything visual.'},
  {t:'Props',d:'Information passed between parts of your app. Like handing a note from one component to another.'},
  {t:'Responsive',d:'Your app looks good on any screen size - phone, tablet, desktop.'},
  {t:'Route',d:'A page in your app. /dashboard is one route, /invoices is another. Each has its own URL.'},
  {t:'Schema',d:'The blueprint for your data. Like deciding what columns go in a spreadsheet before filling it.'},
  {t:'Stripe',d:'A payment system. Handles credit cards, subscriptions, and sends money to your bank.'},
  {t:'Supabase',d:'Your app\'s database + login system in one. Stores data and controls who can see what.'},
  {t:'Tailwind',d:'The styling system that makes your app look good. Controls colors, spacing, fonts, and layout.'},
  {t:'TypeScript',d:'The programming language your app is written in. Like JavaScript but with safety guardrails.'},
  {t:'Webhook',d:'An automatic message between apps. When something happens in one, it instantly tells another.'},
  {t:'Build',d:'Each time Cipher creates or changes your app. One action, one result.'},
  {t:'Callback',d:'A function that runs after something else finishes. Like saying call me back when you are done.'},
  {t:'CDN',d:'Content Delivery Network. Copies of your files stored worldwide so your app loads fast everywhere.'},
  {t:'Cipher',d:'Your AI building partner powered by Claude. Helps you create, explains what happens, suggests improvements.'},
  {t:'CORS',d:'A security rule that controls which websites can talk to your backend.'},
  {t:'CRUD',d:'Create, Read, Update, Delete. The four basic things you do with data.'},
  {t:'CSS',d:'The styling language that controls how your app looks. Colors, fonts, spacing, layout.'},
  {t:'Dependencies',d:'Other peoples code your app uses. Libraries that add features without writing from scratch.'},
  {t:'Endpoint',d:'A specific URL your backend listens on. Send a request there, get a response back.'},
  {t:'Error Handling',d:'Code that catches problems gracefully instead of crashing.'},
  {t:'Event',d:'Something that happens in your app. A click, a keystroke, a page load. Your code responds to events.'},
  {t:'Fetch',d:'How your app asks for data from an API or server. Like placing an order and waiting for delivery.'},
  {t:'Form',d:'Input fields where users type information. Name, email, password. Forms collect data.'},
  {t:'Framework',d:'A pre-built foundation for your app. Next.js is the framework SOVREND uses.'},
  {t:'Function',d:'A reusable block of code that does one specific job. Like a recipe you can use over and over.'},
  {t:'Git',d:'A system that tracks every change to your code. Like unlimited undo with a history of everything.'},
  {t:'Hook',d:'A React feature that adds behavior to components. useState remembers things, useEffect runs actions.'},
  {t:'Hosting',d:'The service that keeps your app running on the internet. Vercel hosts SOVREND apps.'},
  {t:'HTML',d:'The skeleton of every web page. Defines what content exists. Headings, paragraphs, buttons.'},
  {t:'HTTP',d:'The language browsers and servers use to talk. GET fetches data, POST sends data.'},
  {t:'Import',d:'Bringing code from another file into the current one. Like grabbing a tool from another toolbox.'},
  {t:'JSON',d:'A format for sending data between apps. Looks like organized text with curly braces and colons.'},
  {t:'Key',d:'A unique identifier for data or a secret password for services. API keys unlock access.'},
  {t:'Layout',d:'The structure that wraps your pages. Navigation, footer, sidebar. Shared across the app.'},
  {t:'Library',d:'Pre-built code someone else wrote that you can use. Saves you from reinventing the wheel.'},
  {t:'Loading State',d:'What your app shows while waiting for data. Spinners, skeletons, or progress bars.'},
  {t:'Middleware',d:'Code that runs between a request and response. Like a security checkpoint.'},
  {t:'Modal',d:'A popup window that appears over the current page. Usually asks for input or confirmation.'},
  {t:'Next.js',d:'The React framework your app runs on. Handles pages, routing, and server-side logic.'},
  {t:'npm',d:'Node Package Manager. The tool that installs libraries and dependencies for your app.'},
  {t:'OAuth',d:'A way to log in using another service. Sign in with Google or Sign in with GitHub.'},
  {t:'Pagination',d:'Breaking large lists into pages. Show 10 results at a time instead of thousands.'},
  {t:'Parameter',d:'A value you pass to a function or URL. Like telling a search what to look for.'},
  {t:'Preview',d:'A live version of your app running in the browser. Click buttons, fill forms. It works like the real thing.'},
  {t:'Publish',d:'Make your app live on the internet with its own URL anyone can visit.'},
  {t:'Query',d:'A question you ask a database. Show me all users who signed up this week.'},
  {t:'React',d:'The library that builds your app interface. Everything you see is a React component.'},
  {t:'Render',d:'When your app draws itself on screen. Every change triggers a re-render.'},
  {t:'RLS',d:'Row Level Security. Supabase feature that controls who can see which rows of data.'},
  {t:'Sandbox',d:'The preview window where your app runs safely. Nothing here affects the real world until you publish.'},
  {t:'Server',d:'A computer that responds to requests. When someone visits your app, a server sends the page.'},
  {t:'Session',d:'A users active visit. Starts at login, ends at logout or timeout.'},
  {t:'SQL',d:'The language databases understand. SELECT, INSERT, UPDATE, DELETE. How you talk to your data.'},
  {t:'State',d:'Data your app remembers right now. A toggle being on, items in a cart. All state.'},
  {t:'Template',d:'A pre-built starting point. Start with a template and customize instead of from scratch.'},
  {t:'The Grid',d:'SOVREND workspace. Where your ideas take shape and become real applications.'},
  {t:'Token',d:'A digital pass that proves identity. After login, your app uses a token to stay authenticated.'},
  {t:'UI',d:'User Interface. Everything a person sees and interacts with. Buttons, text, images, forms.'},
  {t:'URL',d:'The address of a page on the internet. Every page in your app has a unique URL.'},
  {t:'UX',d:'User Experience. How it feels to use your app. Good UX means intuitive, fast, and satisfying.'},
  {t:'Validation',d:'Checking that user input is correct. Making sure an email has an @ or a password is long enough.'},
  {t:'Variable',d:'A named container that holds a value. Like a labeled box. You can put things in and take them out.'},
  {t:'Vercel',d:'The platform that hosts your app and makes it live on the internet. One click to deploy.'},
  {t:'WebSocket',d:'A live connection between your app and a server. Enables real-time features like chat.'},
]
const STEPS = [
  ['Setting up your database...','this stores all your project data'],
  ['Creating the dashboard layout...','your users will see this first'],
  ['Building the invoice system...','clients will see what they owe here'],
  ['Wiring client messaging...','real-time communication'],
  ['Applying styles and polish...','making it look professional'],
]

const QUOTES = [
  {q:'As a man thinketh in his heart, so is he.',a:'JAMES ALLEN'},
  {q:'The soul attracts that which it secretly harbors.',a:'JAMES ALLEN'},
  {q:'You are today where your thoughts have brought you.',a:'JAMES ALLEN'},
  {q:'Assume the feeling of the wish fulfilled.',a:'NEVILLE GODDARD'},
  {q:'An assumption, though false, if persisted in, will harden into fact.',a:'NEVILLE GODDARD'},
  {q:'Change your conception of yourself and you will automatically change the world in which you live.',a:'NEVILLE GODDARD'},
  {q:'Whatever the mind can conceive and believe, it can achieve.',a:'NAPOLEON HILL'},
  {q:'Strength and growth come only through continuous effort and struggle.',a:'NAPOLEON HILL'},
  {q:'The starting point of all achievement is desire.',a:'NAPOLEON HILL'},
  {q:'The soul becomes dyed with the color of its thoughts.',a:'MARCUS AURELIUS'},
  {q:'You have power over your mind, not outside events. Realize this, and you will find strength.',a:'MARCUS AURELIUS'},
  {q:'What we do now echoes in eternity.',a:'MARCUS AURELIUS'},
  {q:'As you think, so shall you become.',a:'BRUCE LEE'},
  {q:'Do not pray for an easy life. Pray for the strength to endure a difficult one.',a:'BRUCE LEE'},
  {q:'Knowing is not enough, we must apply. Willing is not enough, we must do.',a:'BRUCE LEE'},
  {q:'It is not what happens to you, but how you react to it that matters.',a:'EPICTETUS'},
  {q:'First say to yourself what you would be, and then do what you have to do.',a:'EPICTETUS'},
  {q:'No great thing is created suddenly.',a:'EPICTETUS'},
  {q:'Luck is what happens when preparation meets opportunity.',a:'SENECA'},
  {q:'It is not that we have a short time to live, but that we waste a great deal of it.',a:'SENECA'},
  {q:'Difficulties strengthen the mind, as labor does the body.',a:'SENECA'},
  {q:'The only way to make sense out of change is to plunge into it, move with it, and join the dance.',a:'ALAN WATTS'},
  {q:'This is the real secret of life - to be completely engaged with what you are doing in the here and now.',a:'ALAN WATTS'},
  {q:'You are the universe experiencing itself.',a:'ALAN WATTS'},
  {q:'Think lightly of yourself and deeply of the world.',a:'MIYAMOTO MUSASHI'},
  {q:'Everything is within. There is nothing outside of yourself that can ever enable you to get better.',a:'MIYAMOTO MUSASHI'},
  {q:'Today is victory over yourself of yesterday.',a:'MIYAMOTO MUSASHI'},
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

function Msg({role,text,children}:{role:'cipher'|'user';text?:string;children?:React.ReactNode}) {
  const ic=role==='cipher'
  return <div className={`flex gap-2 items-start ${!ic?'flex-row-reverse':''}`} style={{animation:'fu .3s ease both'}}>
    <div className="flex items-center justify-center flex-shrink-0" style={{width:ic?42:26,height:26,fontFamily:UI,fontSize:ic?6:8,
      border:`1px solid ${ic?'rgba(255,107,0,.3)':'rgba(0,229,255,.15)'}`,color:ic?'#FF6B00':'#00E5FF',
      background:ic?'rgba(255,107,0,.04)':'rgba(0,229,255,.04)'}}>{ic?'CIPHER':'YOU'}</div>
    <div style={{padding:'10px 12px',fontSize:13,lineHeight:1.7,maxWidth:'92%',
      background:ic?'rgba(240,240,255,.04)':'rgba(0,229,255,.04)',
      border:`1px solid ${ic?'rgba(240,240,255,.10)':'rgba(0,229,255,.15)'}`,
      color:ic?'rgba(240,240,255,.75)':'rgba(195,200,215,.82)'}}>{text}{children}</div>
  </div>
}

function Sug({text,onPick}:{text:string,onPick?:(t:string)=>void}) {
  return <span className="cursor-pointer inline-block" onClick={()=>onPick&&onPick(text)} style={{fontSize:11,padding:'5px 12px',border:'1px solid rgba(0,229,255,.15)',color:'rgba(0,229,255,.7)',background:'rgba(0,229,255,.04)'}}>{text}</span>
}

function GlossFab() {
  const [open,setOpen]=useState(false)
  const [q,setQ]=useState('')
  const filt=GLOSSARY.filter(g=>g.t.toLowerCase().includes(q.toLowerCase())||g.d.toLowerCase().includes(q.toLowerCase()))
  return <>
    <div className="fixed z-50 flex items-center justify-center cursor-pointer" onClick={()=>setOpen(!open)}
      style={{bottom:34,right:16,height:32,padding:'0 10px',gap:6,background:'rgba(0,229,255,.04)',border:'1px solid rgba(0,229,255,.3)',fontFamily:UI,fontSize:8,letterSpacing:'.12em',color:'#00E5FF'}}>
      ◈ GLOSSARY
    </div>
    {open&&<div className="fixed z-[60] flex flex-col" style={{bottom:74,right:10,width:280,maxHeight:380,background:'rgba(4,6,14,.96)',border:'1px solid rgba(255,107,0,.3)',backdropFilter:'blur(18px)'}}>
      <div className="flex items-center justify-between px-3 py-2" style={{borderBottom:'1px solid rgba(255,107,0,.15)'}}>
        <span style={{fontFamily:UI,fontSize:8,letterSpacing:'.25em',color:'rgba(255,107,0,.7)'}}>SOVREN CODE · GLOSSARY</span>
        <span className="cursor-pointer" style={{fontSize:12,color:'rgba(195,200,215,.55)'}} onClick={()=>setOpen(false)}>✕</span>
      </div>
      <input className="w-full outline-none" style={{background:'rgba(8,11,22,.7)',border:'none',borderBottom:'1px solid rgba(255,107,0,.15)',color:'#F0F0FF',fontSize:11,padding:'8px 12px'}}
        placeholder="Search any building term..." value={q} onChange={e=>setQ(e.target.value)}/>
      <div className="flex-1 overflow-y-auto">
        {filt.map(g=><div key={g.t} className="px-3 py-2" style={{borderBottom:'1px solid rgba(0,229,255,.035)'}}>
          <div style={{fontSize:11,color:'rgba(255,107,0,.9)',fontWeight:500}}>{g.t}</div>
          <div style={{fontSize:10,color:'rgba(195,200,215,.55)',marginTop:2,lineHeight:1.45}}>{g.d}</div>
        </div>)}
      </div>
    </div>}
  </>
}

function BuildScoreRing({score,suggestions,onHandoff,handoffLoading,tokenUsage}:{score:number;suggestions:string[];onHandoff:()=>void;handoffLoading:boolean;tokenUsage:{inputTokens:number,outputTokens:number,totalTokens:number}|null}) {
  const [animScore,setAnimScore]=useState(0)
  const [show,setShow]=useState(false)
  useEffect(()=>{setTimeout(()=>setShow(true),300);const dur=1200;const t0=performance.now()
    const tick=(now:number)=>{const p=Math.min((now-t0)/dur,1);const ease=1-Math.pow(1-p,3);setAnimScore(Math.round(score*ease));if(p<1)requestAnimationFrame(tick)}
    requestAnimationFrame(tick)},[score])
  const r=38,circ=2*Math.PI*r,offset=circ-(animScore/100)*circ
  const color=score>=80?'#00E5FF':score>=60?'#FFE600':'#FF6A00'
  return <div style={{border:`1px solid ${score>=80?'rgba(0,229,255,.15)':score>=60?'rgba(255,230,0,.15)':'rgba(255,106,0,.15)'}`,padding:'16px',background:score>=80?'rgba(0,229,255,.03)':score>=60?'rgba(255,230,0,.03)':'rgba(255,106,0,.03)',opacity:show?1:0,transform:show?'translateY(0)':'translateY(8px)',transition:'all .5s ease',animation:'fu .4s ease'}}>
    <div className="flex items-start gap-4">
      <svg width={90} height={90} viewBox="0 0 90 90" style={{flexShrink:0,minWidth:90}}>
        <circle cx={45} cy={45} r={r} fill="none" stroke="rgba(240,240,255,.06)" strokeWidth={4}/>
        <circle cx={45} cy={45} r={r} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} transform="rotate(-90 45 45)" style={{transition:'stroke-dashoffset .1s linear',filter:`drop-shadow(0 0 6px ${color}40)`}}/>
        <text x={45} y={41} textAnchor="middle" fill={color} fontSize={22} fontWeight={900} fontFamily="'Orbitron',sans-serif">{animScore}</text>
        <text x={45} y={55} textAnchor="middle" fill="rgba(240,240,255,.4)" fontSize={7} fontFamily="'Orbitron',sans-serif" letterSpacing=".15em">SCORE</text>
      </svg>
      <div>
        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:8,letterSpacing:'.25em',color:color+'99',marginBottom:6}}>BUILD SCORE</div>
        <div style={{fontSize:13,color:'rgba(240,240,255,.8)',lineHeight:1.5,marginBottom:4}}>The thought is taking shape. <b style={{color}}>{animScore}% ready.</b> Every point on this score represents something Cipher can teach you to build. Let's get it higher together.{score<70?'':score<85?'':''}</div>
        {suggestions.length>0&&<div className="flex flex-col gap-1">{suggestions.map((s,i)=><div key={i} className="flex items-start gap-1.5"><span style={{fontSize:9,color,marginTop:2}}>&rarr;</span><span style={{fontSize:11,color:'rgba(195,200,215,.65)',lineHeight:1.4}}>{s}</span></div>)}</div>}
        {tokenUsage&&<div style={{marginBottom:8,padding:'6px 10px',background:'rgba(0,229,255,.04)',border:'1px solid rgba(0,229,255,.08)',borderRadius:6,display:'flex',gap:16}}><span style={{fontSize:10,color:'rgba(195,200,215,.5)',fontFamily:'monospace'}}>IN <b style={{color:'rgba(0,229,255,.7)'}}>{tokenUsage.inputTokens.toLocaleString()}</b></span><span style={{fontSize:10,color:'rgba(195,200,215,.5)',fontFamily:'monospace'}}>OUT <b style={{color:'rgba(0,229,255,.7)'}}>{tokenUsage.outputTokens.toLocaleString()}</b></span><span style={{fontSize:10,color:'rgba(195,200,215,.5)',fontFamily:'monospace'}}>TOTAL <b style={{color:'rgba(0,229,255,.7)'}}>{tokenUsage.totalTokens.toLocaleString()}</b></span></div>}
{score>=65&&<div style={{marginTop:10,paddingTop:10,borderTop:'1px solid rgba(240,240,255,.06)'}}>
          <span className="cursor-pointer" onClick={onHandoff} style={{fontSize:9,fontFamily:"'Orbitron',sans-serif",letterSpacing:'.14em',color:'#F0F0FF',padding:'6px 12px',border:'1px solid rgba(240,240,255,.2)',background:'rgba(240,240,255,.04)',display:'inline-block'}}>{handoffLoading?'GENERATING...':'GENERATE HANDOFF →'}</span>
        </div>}
      </div>
    </div>
  </div>
}

function RevCalc({onAddPricing}:{onAddPricing:()=>void}) {
  const [price,setPrice]=useState('')
  const [customers,setCustomers]=useState('')
  const [show,setShow]=useState(false)
  useEffect(()=>{setTimeout(()=>setShow(true),600)},[])
  const p=parseFloat(price)||0,c=parseInt(customers)||0
  const monthly=p*c,yearly=monthly*12
  return <div style={{border:'1px solid rgba(0,255,65,.15)',padding:'14px',background:'rgba(0,255,65,.03)',borderLeft:'2px solid rgba(0,255,65,.4)',opacity:show?1:0,transform:show?'translateY(0)':'translateY(8px)',transition:'all .5s ease',animation:'fu .4s ease'}}>
    <div className="flex items-center gap-1.5 mb-2"><span style={{fontSize:10,color:'rgba(0,255,65,.7)'}}>◈</span><span style={{fontFamily:"'Orbitron',sans-serif",fontSize:8,letterSpacing:'.25em',color:'rgba(0,255,65,.5)'}}>REVENUE CALCULATOR</span></div>
    <div style={{fontSize:12,color:'rgba(240,240,255,.75)',marginBottom:10,lineHeight:1.5}}>What would you charge per month?</div>
    <div className="flex gap-2 mb-2">
      <div className="flex-1">
        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,letterSpacing:'.15em',color:'rgba(0,255,65,.4)',marginBottom:4}}>PRICE / MONTH</div>
        <div className="flex items-center" style={{border:'1px solid rgba(0,255,65,.15)',background:'rgba(0,255,65,.04)'}}>
          <span style={{padding:'6px 8px',fontSize:12,color:'rgba(0,255,65,.5)',borderRight:'1px solid rgba(0,255,65,.1)'}}>$</span>
          <input value={price} onChange={e=>setPrice(e.target.value.replace(/[^0-9.]/g,''))} className="w-full bg-transparent outline-none" style={{color:'#F0F0FF',fontSize:13,padding:'6px 8px'}}/>
        </div>
      </div>
      <div className="flex-1">
        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,letterSpacing:'.15em',color:'rgba(0,255,65,.4)',marginBottom:4}}>CUSTOMERS</div>
        <div className="flex items-center" style={{border:'1px solid rgba(0,255,65,.15)',background:'rgba(0,255,65,.04)'}}>
          <span style={{padding:'6px 8px',fontSize:12,color:'rgba(0,255,65,.5)',borderRight:'1px solid rgba(0,255,65,.1)'}}>×</span>
          <input value={customers} onChange={e=>setCustomers(e.target.value.replace(/[^0-9]/g,''))} className="w-full bg-transparent outline-none" style={{color:'#F0F0FF',fontSize:13,padding:'6px 8px'}}/>
        </div>
      </div>
    </div>
    {p>0&&c>0&&<div style={{padding:'10px 12px',background:'rgba(0,255,65,.04)',border:'1px solid rgba(0,255,65,.1)',marginTop:8}}>
      <div className="flex justify-between mb-1"><span style={{fontSize:11,color:'rgba(195,200,215,.6)'}}>Monthly</span><span style={{fontSize:14,color:'#00FF41',fontWeight:700}}>${monthly.toLocaleString()}</span></div>
      <div className="flex justify-between"><span style={{fontSize:11,color:'rgba(195,200,215,.6)'}}>Yearly</span><span style={{fontSize:14,color:'#00FF41',fontWeight:700}}>${yearly.toLocaleString()}</span></div>
      <div style={{marginTop:8,paddingTop:8,borderTop:'1px solid rgba(0,255,65,.07)'}}>
        <span className="cursor-pointer" onClick={onAddPricing} style={{fontSize:10,color:'rgba(0,255,65,.7)',padding:'4px 10px',border:'1px solid rgba(0,255,65,.2)',background:'rgba(0,255,65,.04)'}}>Want me to add a pricing page? →</span>
      </div>
    </div>}
  </div>
}

function PublishCelebration({appName,onClose}:{appName:string;onClose:()=>void}) {
  const canvasRef=useRef<HTMLCanvasElement>(null)
  const [phase,setPhase]=useState(0)
  useEffect(()=>{
    const c=canvasRef.current;if(!c)return
    const ctx=c.getContext('2d')!
    const W=c.width=innerWidth,H=c.height=innerHeight
    const particles:{x:number,y:number,vx:number,vy:number,life:number,color:string,size:number}[]=[]
    for(let i=0;i<80;i++)particles.push({x:W/2+(Math.random()-.5)*100,y:H/2+(Math.random()-.5)*100,vx:(Math.random()-.5)*8,vy:(Math.random()-.5)*8-2,life:1,color:['#00E5FF','#F0F0FF','#FFE600','#FF6A00'][Math.floor(Math.random()*4)],size:1.5+Math.random()*3})
    let raf=0,flash=1
    const draw=()=>{ctx.fillStyle=`rgba(0,3,8,${0.08+flash*0.3})`;ctx.fillRect(0,0,W,H);flash*=0.95
      for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.x+=p.vx;p.y+=p.vy;p.vy+=0.04;p.life-=0.008;p.vx*=0.99
        if(p.life<=0){particles.splice(i,1);continue}
        ctx.beginPath();ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);ctx.fillStyle=p.color+Math.round(p.life*255).toString(16).padStart(2,'0');ctx.fill()
        ctx.beginPath();ctx.arc(p.x,p.y,p.size*p.life*0.4,0,Math.PI*2);ctx.fillStyle='#F0F0FF'+Math.round(p.life*180).toString(16).padStart(2,'0');ctx.fill()}
      raf=requestAnimationFrame(draw)};raf=requestAnimationFrame(draw)
    setTimeout(()=>setPhase(1),200);setTimeout(()=>setPhase(2),800);setTimeout(()=>setPhase(3),1400)
    return()=>cancelAnimationFrame(raf)
  },[])
  const slug=appName.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'my-app'
  return <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{background:'rgba(0,3,8,.92)',backdropFilter:'blur(12px)'}}>
    <canvas ref={canvasRef} className="absolute inset-0"/>
    <div className="relative z-10 flex flex-col items-center text-center" style={{maxWidth:440}}>
      <div style={{opacity:phase>=1?1:0,transform:phase>=1?'scale(1)':'scale(0.8)',transition:'all .5s ease'}}><GI s={36}/></div>
      <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:28,fontWeight:900,letterSpacing:'.12em',color:'#F0F0FF',marginTop:20,textShadow:'0 0 40px rgba(240,240,255,.2)',opacity:phase>=2?1:0,transform:phase>=2?'translateY(0)':'translateY(12px)',transition:'all .6s ease'}}>YOUR APP IS LIVE</div>
      <div style={{fontSize:13,color:'rgba(240,240,255,.5)',marginTop:10,opacity:phase>=2?1:0,transition:'all .6s ease .1s'}}>The thought became the thing.</div>
      <div style={{marginTop:24,padding:'10px 20px',background:'rgba(0,229,255,.06)',border:'1px solid rgba(0,229,255,.2)',opacity:phase>=3?1:0,transform:phase>=3?'translateY(0)':'translateY(8px)',transition:'all .5s ease'}}>
        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,letterSpacing:'.2em',color:'rgba(0,229,255,.4)',marginBottom:4}}>YOUR URL</div>
        <div style={{fontSize:15,color:'#00E5FF',fontWeight:500}}><b style={{color:'#F0F0FF'}}>{slug}</b>.sovrend.com</div>
      </div>
      <div className="flex gap-2 mt-6" style={{opacity:phase>=3?1:0,transition:'all .5s ease .2s'}}>
        <span className="cursor-pointer" style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,letterSpacing:'.14em',padding:'8px 16px',color:'#F0F0FF',border:'1px solid rgba(240,240,255,.2)',background:'rgba(240,240,255,.04)'}} onClick={()=>{navigator.clipboard.writeText(slug+'.sovrend.com')}}>COPY LINK</span>
        <span className="cursor-pointer" onClick={onClose} style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,letterSpacing:'.14em',padding:'8px 16px',color:'#00E5FF',border:'1px solid rgba(0,229,255,.2)',background:'rgba(0,229,255,.04)'}}>KEEP BUILDING</span>
      </div>
    </div>
  </div>
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


function CipherIntro(){
  const [text,setText]=useState('')
  const [done,setDone]=useState(false)
  const full="You made it.\n\nWhatever brought you here - curiosity, frustration, a idea you haven't told anyone yet - it doesn't matter. You're here now and that's enough.\n\nI'm Cipher. I live inside SOVREND. My only job is to help you see what you came here to build.\n\nNot to impress you. Not to overwhelm you. Just to be here with you while something that only existed in your mind becomes something real that exists in the world.\n\nYou don't need to know how to code. You don't need the perfect prompt. You don't need to have it all figured out.\n\nJust tell me what you see when you close your eyes and imagine it.\n\nStart anywhere. I'll meet you there."
  useEffect(()=>{
    let i=0
    const iv=setInterval(()=>{
      if(i<full.length){setText(full.slice(0,i+1));i++}
      else{clearInterval(iv);setDone(true)}
    },22)
    return ()=>clearInterval(iv)
  },[])
  return <div style={{fontFamily:"'SF Mono','Fira Code',monospace",fontSize:12,color:'#00FF41',lineHeight:1.7,whiteSpace:'pre-wrap',textShadow:'0 0 8px rgba(0,255,65,.2)'}}>
    {text}<span style={{opacity:done?0:1,animation:'pulse 1s infinite',color:'#00FF41'}}>{'█'}</span>
    {done&&<div style={{marginTop:16,display:'flex',gap:8,flexWrap:'wrap'}}>{['Foundation','Details','Experience','Architecture','Philosophy'].map(l=><span key={l} style={{fontSize:10,padding:'3px 10px',border:'1px solid rgba(0,255,65,.2)',color:'rgba(0,255,65,.5)',letterSpacing:'.05em'}}>{'> '+l}</span>)}</div>}
  </div>
}


// Smart renderer - detects HTML vs React output
function renderSrcDoc(code) {
  const stripped = code.trim().replace(/^[\s\S]*?(?=<!DOCTYPE|<html)/i, ''); const isHTML = stripped.length > 0 && (stripped.startsWith('<!DOCTYPE') || stripped.startsWith('<html'));
  if (isHTML) {
    return stripped;
  }
  return '<!DOCTYPE html><html><head>' +
    '<script src="https://cdn.tailwindcss.com"><\/script>' +
    '<script src="https://unpkg.com/react@18/umd/react.production.min.js"><\/script>' +
    '<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"><\/script>' +
    '<script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>' +
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"><\/script>' +
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"><\/script>' +
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"><\/script>' +
    '<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js"><\/script>' +
    '<style>body{margin:0;font-family:system-ui,sans-serif}</style>' +
    '</head><body><div id="root"></div>' +
    '<script type="text/babel">' + code + '\nReactDOM.createRoot(document.getElementById(\'root\')).render(React.createElement(App||function(){return React.createElement(\'div\',null,\'Loading...\')}))' +
    '<\/script></body></html>';
}

function SignalDecode(){
  var cRef=useRef(null)
  var t0Ref=useRef(0)
  useEffect(function(){
    var c=cRef.current;if(!c)return
    var X=c.getContext('2d')
    var W=0,H=0,raf=0
    var dpr=window.devicePixelRatio||1
    function rs(){var p=c.parentElement;if(!p)return;var r=p.getBoundingClientRect();W=Math.floor(r.width);H=Math.floor(r.height);c.width=W*dpr;c.height=H*dpr;c.style.width=W+'px';c.style.height=H+'px';X.scale(dpr,dpr)}
    rs()
    window.addEventListener('resize',rs)
    t0Ref.current=performance.now()
    function hz(cx,cy,r,col,op){var g=X.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,'rgba('+col+','+op+')');g.addColorStop(1,'rgba(0,0,0,0)');X.fillStyle=g;X.fillRect(0,0,W,H)}
    function draw(now){
      var elapsed=now-t0Ref.current
      var p=Math.min(elapsed/18000,1)
      var cx=W/2,cy=H/2
      var clarity=p*p
      var noiseLevel=1-clarity
      if(p<0.15){X.fillStyle='rgba(0,3,8,0.02)'}else if(p>0.88){X.fillStyle='rgba(0,3,8,0.3)'}else{X.fillStyle='rgba(0,3,8,0.12)'}
      X.fillRect(0,0,W,H)
      var staticBottom=p<0.15?H:H*Math.max(0.08,1-(p-0.15)*1.1)
      if(noiseLevel>0.01&&staticBottom>5){
        var staticHeight=staticBottom
        var density=p<0.15?1400:800
        var noiseCount=Math.floor(density*noiseLevel*(staticHeight/H))
        for(var i=0;i<noiseCount;i++){
          var nx=Math.random()*W,ny=Math.random()*staticHeight
          var nv=Math.random()
          var nc=nv>0.8?'0,229,255':nv>0.6?'240,240,255':'120,135,160'
          var pSize=p<0.15?1+Math.random()*4:1+Math.random()*2
          var pOp=p<0.15?noiseLevel*0.18*Math.random():noiseLevel*0.12*Math.random()
          X.fillStyle='rgba('+nc+','+pOp+')';X.fillRect(nx,ny,pSize,p<0.15?1+Math.random()*1.5:1)
        }
        if(p<0.25){var bandCount=p<0.15?12:5;for(var si=0;si<bandCount;si++){var sy=Math.random()*staticHeight;var sh=p<0.15?2+Math.random()*8:1+Math.random()*4;X.fillStyle='rgba(240,240,255,'+(p<0.15?0.04+Math.random()*0.04:0.02+Math.random()*0.02)+')';X.fillRect(0,sy,W,sh)}}
        if(noiseLevel>0.1&&Math.random()>(p<0.15?0.7:0.85)){var ty=Math.random()*staticHeight;var tearW=W*(0.3+Math.random()*0.7);var tearX=Math.random()*(W-tearW);var tearShift=(Math.random()-0.5)*30*noiseLevel;X.fillStyle='rgba(240,240,255,'+(0.04*noiseLevel)+')';X.fillRect(tearX+tearShift,ty,tearW,2);X.fillStyle='rgba(0,229,255,'+(0.06*noiseLevel)+')';X.fillRect(tearX+tearShift,ty+2,tearW*0.6,1)}
        if(p<0.15&&Math.random()>0.95){X.fillStyle='rgba(240,240,255,0.015)';X.fillRect(0,0,W,staticHeight)}
        if(p>0.12&&staticBottom<H-10){var bf=Math.sin(now*0.012)*0.3+0.7;X.strokeStyle='rgba(0,229,255,'+(0.12*bf)+')';X.lineWidth=0.5;X.beginPath();X.moveTo(0,staticBottom);X.lineTo(W,staticBottom);X.stroke();var bg=X.createLinearGradient(0,staticBottom-12,0,staticBottom+12);bg.addColorStop(0,'rgba(0,229,255,0)');bg.addColorStop(0.5,'rgba(240,240,255,'+(0.03*(1-noiseLevel)*bf)+')');bg.addColorStop(1,'rgba(0,229,255,0)');X.fillStyle=bg;X.fillRect(0,staticBottom-12,W,24)}
      }
      if(p<0.35){var wp=Math.min(p/0.12,1);var noiseAmt=Math.max(0,1-p*4);X.strokeStyle='rgba(0,229,255,'+(0.25*wp)+')';X.lineWidth=1.2;X.beginPath();var started=false;for(var i=0;i<W;i+=2){var wave=Math.sin(i*0.02+now*0.005)*35*wp+Math.sin(i*0.05+now*0.003)*18*wp+Math.sin(i*0.008+now*0.002)*25*wp;var n2=(Math.random()-0.5)*60*noiseAmt;var wy=cy+wave+n2;if(!started){X.moveTo(i,wy);started=true}else X.lineTo(i,wy)}X.stroke();X.strokeStyle='rgba(240,240,255,'+(0.08*wp*(1-noiseAmt*0.7))+')';X.lineWidth=3;X.beginPath();started=false;for(var i=0;i<W;i+=3){var wave=Math.sin(i*0.02+now*0.005)*35*wp+Math.sin(i*0.05+now*0.003)*18*wp+Math.sin(i*0.008+now*0.002)*25*wp;var wy=cy+wave;if(!started){X.moveTo(i,wy);started=true}else X.lineTo(i,wy)}X.stroke();X.strokeStyle='rgba(0,229,255,'+(0.02*wp)+')';X.lineWidth=12;X.beginPath();started=false;for(var i=0;i<W;i+=6){var wave=Math.sin(i*0.02+now*0.005)*35*wp+Math.sin(i*0.008+now*0.002)*25*wp;var wy=cy+wave;if(!started){X.moveTo(i,wy);started=true}else X.lineTo(i,wy)}X.stroke()}
      if(p>0.12){var bp=Math.min((p-0.12)/0.2,1);for(var i=0;i<12*bp;i++){var bx=cx-120+i*20;var bh=(20+Math.sin(i*1.5+now*0.005)*15)*bp;var barTop=cy+60-bh;if(barTop<staticBottom+5)continue;X.fillStyle='rgba(0,229,255,'+(0.12*bp)+')';X.fillRect(bx,barTop,14,bh);X.fillStyle='rgba(240,240,255,'+(0.15*bp)+')';X.fillRect(bx,barTop,14,2)}}
      if(p>0.25){var dp=Math.min((p-0.25)/0.2,1);X.font='300 '+(9+dp*2)+'px "Fira Code",monospace';X.textAlign='left';var lines=['SIGNAL ACQUIRED','DECODING LAYERS...','FOUNDATION: \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588','DETAILS: \u2588\u2588\u2588\u2588\u2588\u2588','EXPERIENCE: \u2588\u2588\u2588\u2588','ARCHITECTURE: \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588','PHILOSOPHY: \u2588\u2588'];for(var i=0;i<lines.length*dp;i++){var line=lines[i];var reveal=Math.min((dp-i/lines.length)*lines.length,1);var shown=line.slice(0,Math.floor(line.length*reveal));var ly=cy-80+i*22;if(ly<staticBottom+10)continue;X.fillStyle=i<2?'rgba(0,229,255,'+(0.2*dp)+')':'rgba(240,240,255,'+(0.18*dp)+')';X.fillText(shown,cx-140,ly)}}
      if(p>0.4){var rp=Math.min((p-0.4)/0.2,1);var blockSize=Math.max(2,20*(1-rp));for(var bx2=cx-120;bx2<cx+120;bx2+=blockSize){for(var by=cy-80;by<cy+80;by+=blockSize){if(by<staticBottom+5)continue;if(Math.random()>0.3+rp*0.5)continue;var bc=Math.random()>0.5?'0,229,255':'240,240,255';X.fillStyle='rgba('+bc+','+(0.03+rp*0.04)+')';X.fillRect(bx2,by,blockSize-1,blockSize-1)}}}
      if(p>0.55){var sp=Math.min((p-0.55)/0.2,1);X.strokeStyle='rgba(0,229,255,'+(0.15*sp)+')';X.lineWidth=1.5;X.beginPath();for(var i=0;i<W;i+=2){var wave=Math.sin(i*0.015+now*0.003)*20*sp;var wy=cy+wave;if(wy<staticBottom)continue;if(i===0)X.moveTo(i,wy);else X.lineTo(i,wy)}X.stroke();X.strokeStyle='rgba(0,229,255,'+(0.04*sp)+')';X.lineWidth=6;X.beginPath();for(var i=0;i<W;i+=4){var wave=Math.sin(i*0.015+now*0.003)*20*sp;var wy=cy+wave;if(wy<staticBottom)continue;if(i===0)X.moveTo(i,wy);else X.lineTo(i,wy)}X.stroke();for(var i=0;i<6;i++){var bx=W*0.3+(i/5)*W*0.4;var phase=(now*0.002+i*0.7)%1;var len=H*0.3*sp;var by=H*0.85-phase*len;if(by<staticBottom)continue;X.fillStyle='rgba(240,240,255,'+(0.04*sp*(1-phase))+')';X.fillRect(bx,by,1,20);X.beginPath();X.arc(bx+0.5,by,2,0,Math.PI*2);X.fillStyle='rgba(240,240,255,'+(0.25*sp*(1-phase))+')';X.fill()}}
      if(p>0.78){var lp=Math.min((p-0.78)/0.14,1);X.font='700 14px "Orbitron",sans-serif';X.textAlign='center';X.fillStyle='rgba(240,240,255,'+(0.4*lp)+')';X.fillText('SIGNAL LOCKED',cx,cy-120);X.strokeStyle='rgba(240,240,255,'+(0.25*lp)+')';X.lineWidth=1.5;X.strokeRect(cx-10,cy-108,20,14);X.beginPath();X.arc(cx,cy-112,8,Math.PI,0);X.stroke();hz(cx,cy-100,60*lp,'240,240,255',0.025*lp);hz(cx,cy,200*lp,'0,229,255',0.012*lp)}
      if(p>0.93){var fp=(p-0.93)/0.07;if(fp<0.2){X.fillStyle='rgba(240,240,255,'+((0.2-fp)*0.1)+')';X.fillRect(0,0,W,H)}}
      var vg=X.createRadialGradient(W/2,H/2,W*0.2,W/2,H/2,W*0.7);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,3,8,0.3)');X.fillStyle=vg;X.fillRect(0,0,W,H)
      if(p<1)raf=requestAnimationFrame(draw);else raf=requestAnimationFrame(draw)
    }
    raf=requestAnimationFrame(draw)
    return function(){cancelAnimationFrame(raf);window.removeEventListener('resize',rs)}
  },[])
  return <div className="flex-1 flex flex-col" style={{background:'rgba(3,5,12,.9)',position:'relative',overflow:'hidden',minHeight:0}}>
    <canvas ref={cRef} style={{position:'absolute',inset:0,width:'100%',height:'100%',display:'block'}}/>
    <div className="absolute inset-0 flex flex-col items-center justify-end pb-8" style={{zIndex:1}}>
      <span style={{fontFamily:UI,fontSize:9,letterSpacing:'.28em',color:'#00E5FF',opacity:0.6}}>CREATING</span>
    </div>
  </div>
}


export default function DashboardPage() {
  const [entered,setEntered]=useState(false)
  const [appState,setAppState]=useState<'idle'|'building'|'complete'|'revealing'>('idle')
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
  const [msgs,setMsgs]=useState<{role:'cipher'|'user';text:string;type?:string}[]>([])
  const [generatedCode,setGeneratedCode]=useState('')
  const [suggestions,setSuggestions]=useState<string[]>([])
  const [tokenUsage,setTokenUsage]=useState<{inputTokens:number,outputTokens:number,totalTokens:number}|null>(null)
  const [refineText,setRefineText]=useState('')
  const [activeMode,setActiveMode]=useState('BUILD')
  const [planNotes,setPlanNotes]=useState('')
  const [buildScore,setBuildScore]=useState(0)
  const [showRevCalc,setShowRevCalc]=useState(false)
  const [planOpen,setPlanOpen]=useState(false)
  const [publishCelebration,setPublishCelebration]=useState(false)
  const [handoffLoading,setHandoffLoading]=useState(false)
  const [handoffData,setHandoffData]=useState<any>(null)
  const [handoffOpen,setHandoffOpen]=useState(false)
  const [showCipherIntro,setShowCipherIntro]=useState(false)
  const [activeDevice,setActiveDevice]=useState<'DESKTOP'|'MOBILE'|'TABLET'>('DESKTOP')
  const [settingsTab,setSettingsTab]=useState(false)
  const [toolsView,setToolsView]=useState<"glossary"|"prompts"|"patterns">("glossary")
  const [toolSearch,setToolSearch]=useState("")
  const [projectsOpen,setProjectsOpen]=useState(false)
  const [journalEntries,setJournalEntries]=useState<{id:string,entry_type:string,title:string,narration:string,prompt:string,created_at:string}[]>([])
  const [panelTab,setPanelTab]=useState<'cipher'|'journal'|'tools'>('cipher')
  const [appId,setAppId]=useState<string|null>(null)
  const [promptAnalysis,setPromptAnalysis]=useState<{original:string,enhanced:string,layers:{layer:number,name:string,status:string,added:string|null}[],score:number}|null>(null)
  const [savedApps,setSavedApps]=useState<{id:string,name:string,code:string,updated_at:string}[]>([])
  const buildCanvasRef=useRef<HTMLCanvasElement>(null)
  const buildParticlesRef=useRef<{x:number,y:number,vx:number,vy:number,life:number,decay:number,size:number}[]>([])
  const planCanvasRef=useRef<HTMLCanvasElement>(null)
  const planParticlesRef=useRef<{x:number,y:number,vx:number,vy:number,life:number,decay:number,size:number}[]>([])
  useEffect(()=>{
    if(!planOpen)return
    const c=planCanvasRef.current;if(!c)return
    const ctx=c.getContext('2d')!
    const p=c.parentElement;if(p){c.width=p.offsetWidth;c.height=p.offsetHeight}
    let raf=0
    const draw=()=>{ctx.clearRect(0,0,c.width,c.height)
      for(let i=planParticlesRef.current.length-1;i>=0;i--){const p=planParticlesRef.current[i]
        p.x+=p.vx;p.y+=p.vy;p.vy*=0.99;p.life-=p.decay
        if(p.life<=0){planParticlesRef.current.splice(i,1);continue}
        ctx.beginPath();ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2)
        ctx.fillStyle='rgba(0,229,255,'+(p.life*0.4)+')';ctx.fill()
        if(p.life>0.5){ctx.beginPath();ctx.arc(p.x,p.y,p.size*0.3,0,Math.PI*2)
          ctx.fillStyle='rgba(200,248,255,'+(p.life*0.3)+')';ctx.fill()}}
      raf=requestAnimationFrame(draw)}
    raf=requestAnimationFrame(draw)
    return()=>cancelAnimationFrame(raf)
  },[planOpen])
  useEffect(()=>{const c=buildCanvasRef.current;if(!c)return;const ctx=c.getContext('2d')!;let raf=0
    const draw=()=>{const p=c.parentElement;if(p&&(c.width!==p.offsetWidth||c.height!==p.offsetHeight)){c.width=p.offsetWidth;c.height=p.offsetHeight}
      ctx.clearRect(0,0,c.width,c.height)
      for(let i=buildParticlesRef.current.length-1;i>=0;i--){const q=buildParticlesRef.current[i];q.x+=q.vx;q.y+=q.vy;q.vy*=0.99;q.life-=q.decay
        if(q.life<=0){buildParticlesRef.current.splice(i,1);continue}
        ctx.beginPath();ctx.arc(q.x,q.y,q.size*q.life,0,Math.PI*2);ctx.fillStyle='rgba(255,107,0,'+(q.life*0.35)+')';ctx.fill()
        if(q.life>0.5){ctx.beginPath();ctx.arc(q.x,q.y,q.size*0.3,0,Math.PI*2);ctx.fillStyle='rgba(255,180,80,'+(q.life*0.25)+')';ctx.fill()}}
      raf=requestAnimationFrame(draw)};raf=requestAnimationFrame(draw)
    return()=>cancelAnimationFrame(raf)},[])
  useEffect(()=>{
    const supabase=createClient()
    supabase.auth.getUser().then(({data:{user}})=>{
      if(user){supabase.from('apps').select('id,name,code,updated_at').eq('user_id',user.id).order('updated_at',{ascending:false}).limit(10).then(({data})=>{if(data)setSavedApps(data)});supabase.from('journal').select('id,app_id,entry_type,title,narration,prompt,created_at').eq('user_id',user.id).order('created_at',{ascending:false}).limit(50).then(({data})=>{if(data)setJournalEntries(data)})}
    })},[])
  useEffect(()=>{if(appState!=='idle')return;const iv=setInterval(()=>setPhIdx(p=>(p+1)%PLACEHOLDERS.length),4000);return()=>clearInterval(iv)},[appState])
  useEffect(()=>{const h=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key==='Enter'&&appState==='idle'&&prompt.trim()){e.preventDefault();handleBuild()}};document.addEventListener('keydown',h);return()=>document.removeEventListener('keydown',h)},[appState,prompt])
  const handleBuild=useCallback(async()=>{
    if(!prompt.trim()||appState!=='idle')return
    setAppState('building');setProjName('New Architect');setVer('BUILDING...');setShowNarr(true)
    setMsgs([{role:'cipher',text:'I see your vision. Let me bring it to life.'},{role:'user',text:prompt},{role:'cipher',text:'Analyzing your prompt across 5 layers...',type:'building'}])
    let buildPrompt=prompt
    try{const eRes=await fetch('/api/enhance',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt})});const eData=await eRes.json();if(eData.success&&eData.enhanced){buildPrompt=eData.enhanced;setPromptAnalysis({original:prompt,enhanced:eData.enhanced,layers:eData.layers||[],score:eData.promptScore||3});setMsgs(prev=>[...prev.slice(0,-1),{role:'cipher',text:'Prompt strengthened. Building now.',type:'building'}])}}catch(e){}
    let step=0;setNarrText(STEPS[0][0]);setNarrTeach(STEPS[0][1])
    const ni=setInterval(()=>{step++;if(step>=STEPS.length){clearInterval(ni);return};setNarrText(STEPS[step][0]);setNarrTeach(STEPS[step][1])},800)
    try{
      const res=await fetch('/api/build',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:buildPrompt,persona:'operator',appId:null})})
      const data=await res.json()
      clearInterval(ni)
      if(data.success){
        setGeneratedCode(data.code||'')
        setSuggestions(data.suggestions||['What else should this app do?','What would your users want next?','What feels incomplete?'])
        if(data.appId)setAppId(data.appId);setBuildScore(data.score?Number(data.score):Math.floor(40+Math.random()*20));if(data.tokenUsage)setTokenUsage(data.tokenUsage)
        setAppState('revealing');setVer('v1.0');setShowNarr(false);setPubVis(true);setTimeout(()=>setAppState('complete'),2000)
        if(data.narration)setProjName(data.narration.split('.')[0].slice(0,30))
        setMsgs(prev=>[...prev,{role:'cipher',text:data.narration||'Your app is live. Here\'s what I\'d suggest next:',type:'summary'},{role:'cipher',text:'Cipher is here. Architect your next refine using the layers below.',type:'suggestion'}])
        setTimeout(()=>setShowStrip(true),400);setTimeout(()=>setShowModes(true),1000);setTimeout(()=>{const sb=createClient();sb.auth.getUser().then(({data:{user:u}})=>{if(u)sb.from('apps').select('id,name,code,updated_at').eq('user_id',u.id).order('updated_at',{ascending:false}).limit(10).then(({data:a})=>{if(a)setSavedApps(a)})})},2000)
      }else{
        setAppState('idle');setVer('NEW');setShowNarr(false)
        setMsgs(prev=>[...prev,{role:'cipher',text:data.message||'Something went wrong. Try again.'}])
      }
    }catch(e){clearInterval(ni);setAppState('idle');setVer('NEW');setShowNarr(false)
      setMsgs(prev=>[...prev,{role:'cipher',text:'The Grid encountered an error. Try again.'}])}
  },[prompt,appState])

  const sbW=sbCol?52:220
  const rainSpeed=entered?1:2.5
  const loadTpl=(k:string)=>{if(TEMPLATES[k])setPrompt(TEMPLATES[k])}
  const fillChat=(text:string)=>{setRefineText(text)}
  const generateHandoff=async()=>{setHandoffLoading(true);try{const res=await fetch('/api/handoff',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:generatedCode,appName:projName,suggestions,score:buildScore})});const data=await res.json();if(data.success){setHandoffData(data);setHandoffOpen(true)}}catch(e){}finally{setHandoffLoading(false)}}
  const loadApp=(app:{id:string,name:string,code:string})=>{setAppId(app.id);setProjName(app.name);setGeneratedCode(app.code||'');setAppState('complete');setVer('saved');setPubVis(true);setShowStrip(true);setShowModes(true);setMsgs([{role:'cipher',text:'Loaded '+app.name+'. Ready to refine - tell me what needs work.'},{role:'cipher',text:'Here\'s what I\'d suggest improving next:',type:'summary'}]);setShowRevCalc(true);setBuildScore(Math.floor(65+Math.random()*25))}
  return <main className="relative min-h-screen overflow-hidden">
    <GridBg state={appState} rainSpeed={rainSpeed}/>
    <style jsx global>{`@keyframes fu{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}@keyframes slowpulse{0%,90%,100%{opacity:.6}95%{opacity:1}}@keyframes breathe{0%,100%{border-color:rgba(0,229,255,.12);box-shadow:0 0 8px rgba(0,229,255,.03)}50%{border-color:rgba(0,229,255,.25);box-shadow:0 0 16px rgba(0,229,255,.06)}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes revealFlash{0%{opacity:1;background:rgba(0,229,255,.15)}30%{opacity:1;background:rgba(240,240,255,.08)}100%{opacity:0;background:transparent}}@keyframes revealPulse{0%{transform:scale(0);opacity:.4;border-color:rgba(0,229,255,.4)}100%{transform:scale(4);opacity:0;border-color:transparent}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(45,50,68,.14);border-radius:2px}`}</style>
    {!entered&&<EntryScreen onDone={()=>setEntered(true)}/>}
    <div className="fixed left-0 top-0 bottom-0 z-50 flex flex-col transition-all duration-300" style={{width:sbW,background:'rgba(4,6,14,.96)',borderRight:'1px solid rgba(0,229,255,.07)',backdropFilter:'blur(18px)',opacity:entered?1:0,transition:'opacity .5s ease'}}>
      <div className="flex items-center gap-2.5 px-4 py-3.5 flex-shrink-0" style={{borderBottom:'1px solid rgba(0,229,255,.035)'}}><GI s={20}/>{!sbCol&&<span style={{fontFamily:UI,fontSize:9,fontWeight:700,letterSpacing:'.2em',color:'rgba(0,229,255,.7)'}}>SOVREND</span>}<span className="ml-auto cursor-pointer" onClick={()=>setSbCol(!sbCol)} style={{fontSize:10,color:'rgba(195,200,215,.55)'}}>{sbCol?'▷':'◁'}</span></div>
      <div className="flex-1 overflow-y-auto px-2 py-2.5">
        {[{i:'⌂',l:'Home',a:appState==='idle',click:()=>{setAppState('idle');setPrompt('');setProjName('New Build');setVer('NEW');setPubVis(false);setShowStrip(false);setShowModes(false);setMsgs([]);setGeneratedCode('');setSuggestions([]);setBuildScore(0);setShowRevCalc(false);setPromptAnalysis(null)}},{i:'⌕',l:'Search',r:'⌘K'}].map(x=><div key={x.l} className="flex items-center gap-2.5 cursor-pointer mb-px" title={sbCol?x.l:undefined} onClick={()=>{if((x as any).click)(x as any).click()}} style={{padding:sbCol?0:'8px 10px',width:sbCol?44:undefined,height:sbCol?44:undefined,margin:sbCol?'0 auto 3px':undefined,justifyContent:sbCol?'center':undefined,display:'flex',flexDirection:sbCol?'column' as any:undefined,alignItems:sbCol?'center':undefined,gap:sbCol?2:undefined,fontSize:12,color:(x as any).a?'#00E5FF':'rgba(195,200,215,.75)',background:x.a?'rgba(0,229,255,.04)':'transparent',border:`1px solid ${x.a?'rgba(0,229,255,.15)':'transparent'}`}}><span style={{fontSize:14,width:20,textAlign:'center'}}>{x.i}</span>{sbCol&&<span style={{fontSize:8,color:'rgba(195,200,215,.6)',fontFamily:UI}}>{x.l}</span>}{!sbCol&&<span className="flex-1">{x.l}</span>}{!sbCol&&x.r&&<span style={{fontSize:8,color:'rgba(195,200,215,.55)',fontFamily:MONO}}>{x.r}</span>}</div>)}
        {!sbCol&&<div className="flex items-center justify-center gap-2 cursor-pointer my-1 py-2" onClick={()=>{setAppState('idle');setPrompt('');setProjName('New Build');setVer('NEW');setPubVis(false);setShowStrip(false);setShowModes(false);setMsgs([]);setGeneratedCode('');setSuggestions([])}} style={{border:'1px solid rgba(0,229,255,.15)',background:'rgba(0,229,255,.04)',color:'#00E5FF',fontFamily:UI,fontSize:9,letterSpacing:'.14em',fontWeight:600}}>+&nbsp;NEW BUILD</div>}
        {sbCol&&<div className="flex flex-col items-center justify-center cursor-pointer mb-px" onClick={()=>{setAppState('idle');setPrompt('');setProjName('New Build');setVer('NEW')}} style={{width:44,height:44,margin:'4px auto',color:'#00E5FF',border:'1px solid rgba(0,229,255,.15)',background:'rgba(0,229,255,.06)',fontSize:14,borderRadius:8,gap:1}}><span>+</span><span style={{fontSize:7,fontFamily:UI,color:'rgba(0,229,255,.5)'}}>NEW</span></div>}
        {!sbCol&&<div className="flex items-center gap-2.5 cursor-pointer mb-px" onClick={()=>setPlanOpen(!planOpen)} style={{padding:'8px 10px',fontSize:13,color:'rgba(195,200,215,.8)',border:'1px solid transparent'}}><span style={{fontSize:12,width:20,textAlign:'center',color:'#00E5FF',animation:'slowpulse 11s ease infinite'}}>◉</span><span className="flex-1">Plan & Notes</span><span style={{fontSize:7,color:'rgba(0,229,255,.4)',fontFamily:UI,letterSpacing:'.1em'}}>FREE</span></div>}
        {!sbCol&&<div className="flex items-center gap-2.5 cursor-pointer mb-px" onClick={()=>{if(appState!=='idle')setPanelTab('journal')}} style={{padding:'8px 10px',fontSize:13,color:'rgba(195,200,215,.8)',border:'1px solid transparent'}}><span style={{fontSize:12,width:20,textAlign:'center',color:'rgba(255,107,0,.5)'}}>◎</span><span className="flex-1">Build Journal</span><span style={{fontSize:7,color:'rgba(255,107,0,.3)',fontFamily:UI,letterSpacing:'.1em'}}>{journalEntries.length||''}</span></div>}
        {!sbCol&&<div style={{fontFamily:UI,fontSize:8,letterSpacing:'.2em',color:'rgba(0,229,255,.4)',padding:'10px 10px 4px'}}>PROJECTS</div>}
        {[{i:'◫',l:'All projects',c:String(savedApps.length||0),click:()=>setProjectsOpen(true)},{i:'◷',l:'Recent'}].map(x=><div key={x.l} className="flex items-center gap-2.5 cursor-pointer mb-px" title={sbCol?x.l:undefined} onClick={()=>{if((x as any).click)(x as any).click()}} style={{padding:sbCol?0:'8px 10px',width:sbCol?44:undefined,height:sbCol?44:undefined,margin:sbCol?'0 auto 3px':undefined,justifyContent:sbCol?'center':undefined,display:'flex',flexDirection:sbCol?'column' as any:undefined,alignItems:sbCol?'center':undefined,gap:sbCol?2:undefined,fontSize:13,color:'rgba(195,200,215,.8)',borderRadius:sbCol?8:undefined,border:'1px solid transparent'}}><span style={{fontSize:14,width:20,textAlign:'center'}}>{x.i}</span>{sbCol&&<span style={{fontSize:8,color:'rgba(195,200,215,.6)',fontFamily:UI}}>{x.l}</span>}{!sbCol&&<span className="flex-1">{x.l}</span>}{!sbCol&&x.c&&<span style={{fontSize:9,color:'rgba(195,200,215,.55)',background:'rgba(0,229,255,.04)',padding:'1px 6px',border:'1px solid rgba(0,229,255,.07)'}}>{x.c}</span>}</div>)}
        {!sbCol&&savedApps.length>0&&<div className="overflow-y-auto" style={{maxHeight:120}}>{savedApps.slice(0,5).map(a=><div key={a.id} className="flex items-center gap-2.5 cursor-pointer mb-px" onClick={()=>loadApp(a)} style={{padding:'4px 10px',fontSize:12,color:'rgba(195,200,215,.65)',border:'1px solid transparent'}}><span style={{fontSize:10,width:20,textAlign:'center',color:'rgba(0,229,255,.3)'}}>◈</span><span className="flex-1" style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.name}</span></div>)}</div>}
        {!sbCol&&<div style={{height:1,background:'rgba(0,229,255,.035)',margin:'6px 10px'}}/>}

      </div>
      {!sbCol&&<div className="flex flex-col gap-1 p-2" style={{borderTop:'1px solid rgba(0,229,255,.035)'}}>
        <div className="flex items-center gap-2.5 cursor-pointer mb-1" onClick={()=>setSettingsTab(!settingsTab)} style={{padding:'8px 10px',fontSize:13,color:'rgba(195,200,215,.8)',border:'1px solid transparent'}}><span style={{fontSize:14,width:20,textAlign:'center'}}>⚙</span><span className="flex-1">Settings</span></div>
        <div className="flex items-center gap-2 p-2.5 cursor-pointer" onClick={()=>{navigator.clipboard.writeText('https://sovrend.com?ref=operator');const el=document.createElement('div');el.textContent='Link copied!';el.style.cssText='position:fixed;bottom:60px;left:50%;transform:translateX(-50%);background:rgba(0,229,255,.15);color:#00E5FF;padding:8px 16px;font-size:11px;z-index:999;border:1px solid rgba(0,229,255,.2)';document.body.appendChild(el);setTimeout(()=>el.remove(),2000)}} style={{border:'1px solid rgba(0,229,255,.15)',color:'rgba(0,229,255,.7)',fontSize:11,cursor:'pointer'}}><span style={{fontSize:14}}>★</span><div><div>Share SOVREND</div><div style={{fontSize:9,color:'rgba(195,200,215,.55)',marginTop:2}}>Earn for every referral</div></div></div>
        <div className="flex items-center gap-2 p-2.5 cursor-pointer" onClick={async()=>{try{const res=await fetch('/api/stripe/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({plan:'builder'})});const data=await res.json();if(data.url)window.open(data.url,'_blank')}catch(e){console.error(e)}}} style={{border:'1px solid rgba(0,229,255,.15)',background:'rgba(0,229,255,.04)',color:'#00E5FF',fontSize:11,cursor:'pointer'}}><span style={{fontSize:14}}>⚡</span><div><div>Upgrade to Builder</div><div style={{fontSize:9,color:'rgba(195,200,215,.55)',marginTop:2}}>25 actions/month → $22/mo</div></div></div>
        <div className="flex items-center gap-2 px-2.5 py-2"><div className="flex items-center justify-center" style={{width:28,height:28,border:'1px solid rgba(0,229,255,.15)',fontFamily:UI,fontSize:8,color:'#00E5FF'}}>SD</div><div><div style={{fontSize:11,color:'rgba(195,200,215,.82)'}}>StevieD</div><div style={{fontFamily:UI,fontSize:8,color:'rgba(195,200,215,.55)',letterSpacing:'.1em'}}>OPERATOR</div></div></div>
      </div>}
    </div>
    <div className="fixed z-10 flex flex-col transition-all duration-300" style={{left:sbW,top:0,right:0,bottom:0,opacity:entered?1:0,transition:'opacity .5s ease'}}>
      <div className="flex items-center px-4 flex-shrink-0" style={{height:44,background:'rgba(4,6,14,.96)',borderBottom:'1px solid rgba(0,229,255,.07)',backdropFilter:'blur(18px)'}}>
        <div className="flex items-center gap-3 flex-shrink-0"><span style={{fontSize:13,color:'rgba(195,200,215,.75)'}}>{projName}</span><span style={{fontFamily:UI,fontSize:8,color:'rgba(195,200,215,.55)',letterSpacing:'.12em'}}>{ver}</span></div>
        <div className="flex-1 flex items-center justify-center gap-2">{appState!=='idle'&&<div className="flex" style={{border:'1px solid rgba(0,229,255,.07)'}}>{['DESKTOP','MOBILE','TABLET'].map((v)=><button key={v} onClick={()=>setActiveDevice(v as any)} style={{fontFamily:UI,fontSize:8,letterSpacing:'.14em',padding:'5px 12px',color:activeDevice===v?'#00E5FF':'rgba(195,200,215,.55)',background:activeDevice===v?'rgba(0,229,255,.04)':'transparent',border:'none',cursor:'pointer'}}>{v}</button>)}</div>}</div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span onClick={()=>setShowCipherIntro(!showCipherIntro)} className="cursor-pointer" style={{fontFamily:UI,fontSize:8,letterSpacing:'.14em',padding:'4px 8px',color:'#FF6B00',border:'1px solid rgba(255,107,0,.15)',background:'rgba(255,107,0,.04)',animation:'slowpulse 4s ease infinite'}}>CIPHER</span>
          <span style={{fontFamily:UI,fontSize:8,letterSpacing:'.14em',padding:'4px 8px',color:'#00E5FF',border:'1px solid rgba(0,229,255,.15)',background:'rgba(0,229,255,.04)'}}>OPERATOR</span>
          <span style={{fontFamily:UI,fontSize:8,letterSpacing:'.14em',padding:'4px 8px',color:'#FF6B00',border:'1px solid rgba(255,107,0,.15)',background:'rgba(255,107,0,.04)'}}>BUILT WITH CLAUDE</span>
          <button style={{fontFamily:UI,fontSize:8,fontWeight:700,letterSpacing:'.22em',color:'#000308',background:'#F0F0FF',border:'none',padding:'7px 18px',cursor:'pointer',opacity:pubVis?1:0,pointerEvents:pubVis?'auto':'none',transition:'all .6s',boxShadow:pubVis?'0 0 14px rgba(240,240,255,.15)':'none'}} onClick={()=>setPublishCelebration(true)}>PUBLISH</button>

        </div>
      </div>
      <div className="flex-1 flex overflow-hidden relative">
        {appState==='idle'&&<div className="absolute inset-0 flex items-center justify-center px-6 z-20"><div className="flex flex-col items-center max-w-xl w-full text-center">
          <div className="mb-4 text-center" style={{opacity:.7}}>
            <p style={{fontSize:14,color:'rgba(0,229,255,.6)',fontStyle:'italic'}}>&ldquo;{QUOTES[Math.floor((Date.now()/86400000)%QUOTES.length)].q}&rdquo;</p>
            <p style={{fontFamily:UI,fontSize:8,letterSpacing:'.3em',color:'rgba(0,229,255,.35)',marginTop:4}}>&mdash; {QUOTES[Math.floor((Date.now()/86400000)%QUOTES.length)].a}</p>
          </div>
          <div className="w-full max-w-lg mb-6" style={{padding:'12px 14px',background:'rgba(240,240,255,.03)',border:'1px solid rgba(240,240,255,.06)',borderLeft:'2px solid rgba(255,107,0,.4)'}}>
            <div style={{fontFamily:UI,fontSize:7,letterSpacing:'.18em',color:'#FF6B00',marginBottom:8,padding:'3px 8px',border:'1px solid rgba(255,107,0,.25)',background:'rgba(255,107,0,.06)',display:'inline-block'}}>CIPHER</div>
          </div>
          <h2 style={{fontFamily:UI,fontSize:'clamp(18px,3vw,30px)',fontWeight:900,letterSpacing:'.08em',background:'linear-gradient(135deg,#FF6A00,#00E5FF)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',marginBottom:8,textShadow:'none'}}>What are you ready to create?</h2>
          <p style={{fontSize:13.5,color:'rgba(195,200,215,.55)',marginBottom:26}}>No code needed. Takes about 60 seconds.</p>
          <div className="w-full max-w-lg" style={{background:'rgba(4,6,14,.96)',border:'1px solid rgba(0,229,255,.15)',borderBottom:'2px solid rgba(0,229,255,.3)',padding:16,backdropFilter:'blur(18px)'}}>
            <div style={{position:'relative'}}><canvas ref={buildCanvasRef} style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:1}}/><textarea value={prompt} onChange={e=>{setPrompt(e.target.value);const ls=e.target.value.split('\n');const la=ls[ls.length-1];const cx=Math.min(14+la.length*8.5,480);const cy=Math.min(14+(ls.length-1)*24+12,50);for(let j=0;j<2;j++)buildParticlesRef.current.push({x:cx+(Math.random()-.5)*14,y:cy,vx:(Math.random()-.5)*.3,vy:-(0.3+Math.random()*0.6),life:1,decay:0.006+Math.random()*0.004,size:0.8+Math.random()*1.5})}} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&appState==='idle'&&prompt.trim()){e.preventDefault();handleBuild()}}} placeholder={PLACEHOLDERS[phIdx]} className="w-full bg-transparent outline-none resize-none" style={{color:'#F0F0FF',fontSize:17,height:60,lineHeight:'1.55',position:'relative',zIndex:2,background:'transparent'}}/></div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-1.5 items-center">
                {['\ud83d\udcce','\ud83c\udfa4','\u25c7'].map(i=><div key={i} className="flex items-center justify-center cursor-pointer" style={{width:28,height:28,border:'1px solid rgba(0,229,255,.07)',color:'rgba(195,200,215,.55)',fontSize:12}}>{i}</div>)}

              </div>
              <button onClick={handleBuild} style={{fontFamily:UI,fontSize:10,fontWeight:700,letterSpacing:'.22em',color:'#000308',background:'linear-gradient(135deg,#FF6A00,#00E5FF)',border:'none',padding:'12px 32px',cursor:'pointer',boxShadow:'0 0 20px rgba(0,229,255,.2),0 0 40px rgba(255,106,0,.1)',transition:'all .3s'}}>ARCHITECT →</button>
            </div>
          </div>

        </div></div>}
        {appState!=='idle'&&<div className="flex w-full h-full" style={{animation:'fu .5s ease'}}>
          <div className="flex flex-col h-full" style={{width:370,minWidth:370,background:'rgba(4,6,14,.96)',borderRight:'1px solid rgba(0,229,255,.07)',backdropFilter:'blur(18px)'}}>
            <div className="flex items-center justify-between px-3 flex-shrink-0" style={{height:36,borderBottom:'1px solid rgba(0,229,255,.035)'}}><div className="flex gap-0.5">{['CIPHER','HISTORY','TOOLS'].map((tab)=>{const tk=tab==='CIPHER'?'cipher':tab==='HISTORY'?'journal':'tools';return <span key={tab} onClick={()=>setPanelTab(tk as any)} style={{fontFamily:UI,fontSize:8,letterSpacing:'.2em',padding:'4px 8px',cursor:'pointer',color:panelTab===tk?'#FF6B00':'rgba(195,200,215,.55)',border:`1px solid ${panelTab===tk?'rgba(255,107,0,.15)':'transparent'}`,background:panelTab===tk?'rgba(255,107,0,.04)':'transparent'}}>{tab}</span>})}</div></div>
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
              {panelTab==='journal'&&<div className="flex flex-col gap-2">
                <div style={{fontFamily:UI,fontSize:8,letterSpacing:'.2em',color:'rgba(255,107,0,.4)',marginBottom:4}}>BUILD JOURNAL</div>
                {(appId?journalEntries.filter(j=>(j as any).app_id===appId):journalEntries).length===0&&<div style={{fontSize:11,color:'rgba(195,200,215,.45)'}}>No journal entries for this project yet.</div>}
                {(appId?journalEntries.filter(j=>(j as any).app_id===appId):journalEntries).map(j=><div key={j.id} style={{border:'1px solid rgba(255,107,0,.1)',padding:'8px 10px',background:'rgba(255,107,0,.02)'}}>
                  <div className="flex justify-between"><span style={{fontSize:11,color:'rgba(240,240,255,.7)',fontWeight:500}}>{j.title}</span><span style={{fontSize:9,color:'rgba(195,200,215,.35)'}}>{new Date(j.created_at).toLocaleDateString()}</span></div>
                  <div style={{fontSize:10,color:'rgba(195,200,215,.55)',marginTop:3,lineHeight:1.4}}>{j.narration}</div>
                  <div style={{fontSize:9,color:'rgba(195,200,215,.3)',marginTop:2,fontStyle:'italic'}}>Prompt: {j.prompt?.slice(0,60)}...</div>
                </div>)}
              </div>}
              {panelTab==='tools'&&<div className="flex flex-col gap-3">
                <div className="flex gap-1 mb-1">{['glossary','prompts','patterns'].map(t=><span key={t} onClick={()=>setToolsView(t as any)} className="cursor-pointer" style={{fontFamily:UI,fontSize:7,letterSpacing:'.15em',padding:'3px 8px',color:toolsView===t?'#FF6B00':'rgba(195,200,215,.45)',border:'1px solid '+(toolsView===t?'rgba(255,107,0,.2)':'transparent'),background:toolsView===t?'rgba(255,107,0,.04)':'transparent',textTransform:'uppercase'}}>{t}</span>)}</div>
                {toolsView==='glossary'&&<div className="flex flex-col gap-1">
                  <input className="w-full outline-none mb-2" placeholder="Search terms..." value={toolSearch} onChange={e=>setToolSearch(e.target.value)} style={{background:'rgba(8,11,22,.7)',border:'1px solid rgba(255,107,0,.1)',color:'#F0F0FF',fontSize:11,padding:'6px 10px'}}/>
                  {GLOSSARY.filter(g=>!toolSearch||g.t.toLowerCase().includes(toolSearch.toLowerCase())||g.d.toLowerCase().includes(toolSearch.toLowerCase())).map(g=><div key={g.t} style={{border:'1px solid rgba(255,107,0,.06)',padding:'6px 10px'}}>
                    <div style={{fontSize:11,color:'rgba(255,107,0,.8)',fontWeight:500}}>{g.t}</div>
                    <div style={{fontSize:10,color:'rgba(195,200,215,.5)',marginTop:2,lineHeight:1.4}}>{g.d}</div>
                  </div>)}
                </div>}
                {toolsView==='prompts'&&<div className="flex flex-col gap-3">
                  <div style={{fontSize:12,color:'rgba(240,240,255,.7)',lineHeight:1.5,marginBottom:4}}>Expert prompts by category. Tap CREATE to use any prompt.</div>
                  {[
                    {cat:'BUSINESS',color:'#00E5FF',items:[
                      {t:'Client Portal',p:'A client portal for freelancers with a dashboard showing active projects with progress bars, an invoice generator with line items and tax calculation, a messaging system with read receipts, and sidebar navigation.',tip:'Add notification bell for unread messages'},
                      {t:'SaaS Dashboard',p:'A SaaS analytics dashboard with sidebar showing Users, Revenue, Plans, Settings. Main area has 4 KPI cards, a revenue line chart, user growth bar chart, and recent signups table with avatar, email, plan, join date.',tip:'Add date range picker that filters all charts'},
                      {t:'Invoice Generator',p:'An invoice generator with business name, client name, line items with description, quantity, rate, amount. Auto-calculate subtotal, tax, total. Preview panel showing formatted invoice. Download and email options.',tip:'Add recurring invoice toggle'},
                      {t:'Booking System',p:'A booking system with weekly calendar showing available slots in green, booked in gray. Customers pick date, time, fill name, email, phone, service. Confirmation with booking ID. Admin view with filters.',tip:'Add email confirmation with calendar invite'},
                      {t:'CRM Board',p:'A CRM with kanban board showing deal stages: Lead, Contacted, Proposal, Negotiation, Won, Lost. Cards show contact, company, deal value, last activity. Detail panel slides in with notes and next steps.',tip:'Add pipeline value summary at top'},
                    ]},
                    {cat:'CREATOR',color:'#FF6B00',items:[
                      {t:'Blog Platform',p:'A blog with article cards showing image, title, excerpt, author, read time, date. Article page with hero image, formatted text, code blocks, author bio, related articles. Category filter and search.',tip:'Add newsletter signup between articles'},
                      {t:'Portfolio',p:'A portfolio with dark hero, masonry project grid with hover effects, filterable categories, project detail pages with image gallery, about section with skills timeline, contact form.',tip:'Add testimonial carousel from clients'},
                      {t:'Course Platform',p:'Online courses with cards showing thumbnail, title, instructor, progress, lesson count. Detail page with expandable curriculum, video placeholder, mark complete. Student dashboard with streak.',tip:'Add discussion forum under each lesson'},
                      {t:'Newsletter Tool',p:'Newsletter builder with rich text editor on left, live preview on right. Formatting toolbar. Subscriber management with CSV import, tags. Send history with open and click rates.',tip:'Add A/B subject line testing'},
                      {t:'Link in Bio',p:'A link-in-bio page with avatar, name, bio, social icons. Customizable link cards with title, icon, URL. Analytics showing clicks per link over time. Theme selector: minimal, neon, gradient, dark.',tip:'Add featured link that appears larger'},
                    ]},
                    {cat:'PRODUCTIVITY',color:'#FFE600',items:[
                      {t:'Task Manager',p:'Task app with board and list view toggle. Board columns: To Do, In Progress, Review, Done. Cards have title, priority tag, assignee, due date. Quick-add at top of each column. Filter by priority.',tip:'Add daily standup summary of changes'},
                      {t:'Habit Tracker',p:'Habit tracker with weekly grid, tappable cells to mark complete. Current streak, longest streak, completion percentage per habit. Add habit form with name, frequency, color. Monthly heatmap.',tip:'Add motivational quotes based on streak'},
                      {t:'Budget Tracker',p:'Budget tracker with income and expense forms. Monthly cards for income, expenses, savings. Pie chart for categories, line chart for trends, transaction list with search and filter.',tip:'Add budget goals with progress bars'},
                      {t:'Notes App',p:'Note-taking app with sidebar folders and notes list. Markdown editor with live preview, headings, bold, code blocks, checklists. Search with highlighting, tags, favorites, word count.',tip:'Add focus mode hiding everything except editor'},
                      {t:'Meeting Scheduler',p:'Meeting scheduler with available hours per day. Calendar with available dates, time slot picker, booking form. Confirmation with timezone. Admin dashboard. Buffer time settings.',tip:'Add timezone auto-detection for visitors'},
                    ]},
                    {cat:'HEALTH',color:'#00FF41',items:[
                      {t:'Fitness Tracker',p:'Fitness tracker with workout log for exercise, sets, reps, weight. Weekly summary with totals, calories, personal records. Body measurement charts. Exercise library with muscle group filters.',tip:'Add workout plan builder with rest days'},
                      {t:'Meal Planner',p:'Weekly meal planner with 7-day grid for breakfast, lunch, dinner, snacks. Cards show name, calories, prep time. Auto-generated grocery list. Recipe browser with dietary filters.',tip:'Add nutrition summary with daily macros vs targets'},
                      {t:'Meditation Timer',p:'Meditation app with centered timer, presets and custom duration. Breathing circle animation. History heatmap, total minutes, streak. Ambient sound options.',tip:'Add guided prompts at intervals'},
                      {t:'Sleep Logger',p:'Sleep tracker with bedtime, wake time, quality rating. Weekly hours chart, quality trend, sleep debt. Daily sleep tips. Monthly calendar colored by quality.',tip:'Add wind-down routine checklist'},
                      {t:'Water Tracker',p:'Water intake tracker with animated filling glass. Daily goal setting, progress with milestone messages. Hourly reminders, weekly chart, streak for consecutive goal days.',tip:'Add caffeine tracking for hydration'},
                    ]},
                    {cat:'COMMUNITY',color:'#B060FF',items:[
                      {t:'Event Platform',p:'Event listings with image, title, date, location, price, attendees. Detail page with description, map placeholder, register with ticket selection. Filter by date, category, price.',tip:'Add share button with social preview'},
                      {t:'Forum Q&A',p:'Q&A forum with questions showing title, tags, votes, answers. Detail with full question, ordered answers, upvote/downvote, accepted answer. Tag filtering, leaderboard.',tip:'Add related questions sidebar'},
                      {t:'Team Directory',p:'Team directory grid with photo, name, role, department, contact. Search and department filters. Detail with bio, skills, projects, availability. Org chart view.',tip:'Add random coffee chat matcher'},
                      {t:'Review Platform',p:'Reviews with star ratings, text, author, date, helpful count. Rating distribution chart. Write review form with stars, text, photo. Filter by rating.',tip:'Add verified purchase badge'},
                      {t:'Marketplace',p:'Peer marketplace with listings showing image, title, price, condition, seller rating. Detail with gallery, message seller. Category browsing, search filters, my listings.',tip:'Add wishlist with price drop alerts'},
                    ]},
                  ].map(cat=><div key={cat.cat}>
                    <div style={{fontFamily:UI,fontSize:8,letterSpacing:'.2em',color:cat.color,marginBottom:6,marginTop:8}}>{cat.cat}</div>
                    {cat.items.map((p,i)=><div key={i} style={{border:'1px solid rgba(240,240,255,.06)',padding:10,marginBottom:6}}>
                      <div className="flex items-center justify-between mb-2"><div style={{fontSize:13,color:'rgba(240,240,255,.8)',fontWeight:500}}>{p.t}</div><span className="cursor-pointer" onClick={()=>{setPrompt(p.p);setPanelTab('cipher');setActiveMode('BUILD')}} style={{fontSize:8,fontFamily:UI,letterSpacing:'.1em',color:cat.color,padding:'3px 8px',border:'1px solid '+cat.color+'33'}}>CREATE</span></div>
                      <div style={{fontSize:11,color:'rgba(195,200,215,.6)',lineHeight:1.5,marginBottom:4}}>{p.p.slice(0,100)}...</div>
                      <div style={{fontSize:10,color:'rgba(0,255,65,.4)',borderTop:'1px solid rgba(240,240,255,.04)',paddingTop:4,marginTop:4}}>Tip: {p.tip}</div>
                    </div>)}
                  </div>)}
                </div>}
                {toolsView==='patterns'&&<div className="flex flex-col gap-3">
                  <div style={{fontSize:12,color:'rgba(240,240,255,.7)',lineHeight:1.5,marginBottom:4}}>Common app patterns. Tap to create one.</div>
                  {[
                    {name:'Dashboard',desc:'Sidebar navigation + stats cards + data table + charts. The command center pattern.',prompt:'A dashboard with sidebar navigation, 4 stat cards at the top showing key metrics, a data table with sortable columns, and a line chart showing trends over time. Include a search bar and filter dropdown.'},
                    {name:'CRUD App',desc:'Create, Read, Update, Delete. The backbone of every data app.',prompt:'A task management app where users can create tasks with title, description, priority, and due date. Show tasks in a list with edit and delete buttons. Include a form modal for creating and editing. Add filters for priority and completion status.'},
                    {name:'Auth Flow',desc:'Sign up, verify, log in, protected pages. Every real app needs this.',prompt:'A login and signup page with email and password fields, form validation, error messages, and a toggle between sign in and sign up modes. Include a forgot password link and a welcome message after login.'},
                    {name:'Landing Page',desc:'Hero, features, pricing, CTA. Convert visitors to users.',prompt:'A modern landing page with a hero section featuring a headline, subtext and CTA button, a 3-column features section with icons, a pricing table with 3 tiers, testimonial cards, and a footer with links.'},
                    {name:'E-Commerce',desc:'Products, cart, checkout. Turn browsers into buyers.',prompt:'An online store with a product grid showing images, prices and ratings, category filter sidebar, product detail page with add to cart, a shopping cart drawer with quantity controls, and a checkout form.'},
                    {name:'Social Feed',desc:'Posts, likes, comments, profiles. Community in a box.',prompt:'A social media feed where users see posts with author avatar, text content, images, like count and comment count. Include a compose post form at the top, a comment section that expands, and a trending sidebar.'},
                  ].map((p,i)=><div key={i} style={{border:'1px solid rgba(0,229,255,.08)',padding:10}}>
                    <div className="flex items-center justify-between mb-1">
                      <div style={{fontSize:13,color:'#00E5FF',fontWeight:600}}>{p.name}</div>
                      <span className="cursor-pointer" onClick={()=>{setPrompt(p.prompt);setActiveMode('BUILD');setPanelTab('cipher')}} style={{fontSize:8,fontFamily:UI,letterSpacing:'.1em',color:'#00E5FF',padding:'3px 8px',border:'1px solid rgba(0,229,255,.15)'}}>CREATE THIS</span>
                    </div>
                    <div style={{fontSize:11,color:'rgba(195,200,215,.6)',lineHeight:1.4}}>{p.desc}</div>
                  </div>)}
                </div>}
              </div>}
              {panelTab==='cipher'&&msgs.map((m,i)=><Msg key={i} role={m.role} text={m.text}>
                {m.type==='building'&&<div className="flex items-center gap-1.5 mt-2" style={{fontSize:10,color:'rgba(195,200,215,.55)'}}><div style={{width:8,height:8,border:'1.5px solid rgba(45,50,68,.14)',borderTop:'1.5px solid #00E5FF',borderRadius:'50%',animation:'spin .7s linear infinite'}}/>Claude Sonnet · ~45s</div>}
                {m.type==='summary'&&<div className="mt-3 flex flex-wrap gap-1.5">{suggestions.map(s=><Sug key={s} text={s} onPick={fillChat}/>)}</div>}
                {m.type==='suggestion'&&<div className="mt-2 flex flex-wrap gap-1.5"><Sug text="Yes, let's do that" onPick={fillChat}/><Sug text="Something else first" onPick={fillChat}/></div>}
              </Msg>)}
              {appState==='complete'&&promptAnalysis&&<div style={{border:'1px solid rgba(0,229,255,.15)',padding:'12px',background:'rgba(0,229,255,.03)',borderLeft:'2px solid rgba(0,229,255,.4)',animation:'fu .4s ease'}}>
                <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-1.5"><span style={{fontSize:10,color:'rgba(0,229,255,.7)'}}>◈</span><span style={{fontFamily:UI,fontSize:8,letterSpacing:'.25em',color:'rgba(0,229,255,.5)'}}>PROMPT ANALYSIS</span></div><span style={{fontFamily:UI,fontSize:8,color:'rgba(0,229,255,.4)'}}>SCORE: {promptAnalysis.score}/5</span></div>
                <div style={{fontSize:11,color:'rgba(195,200,215,.5)',marginBottom:6,lineHeight:1.4}}>Your prompt: <span style={{color:'rgba(240,240,255,.6)'}}>{promptAnalysis.original.length>80?promptAnalysis.original.slice(0,80)+'...':promptAnalysis.original}</span></div>
                {promptAnalysis.layers.length>0&&<div className="flex flex-col gap-1">{promptAnalysis.layers.map(function(l){return <div key={l.layer} className="flex items-start gap-2" style={{fontSize:10}}>
                  <span style={{fontFamily:UI,fontSize:7,letterSpacing:'.1em',color:l.status==='strong'?'rgba(0,229,255,.6)':l.status==='weak'?'rgba(255,230,0,.6)':'rgba(255,80,80,.5)',padding:'2px 5px',border:'1px solid '+(l.status==='strong'?'rgba(0,229,255,.15)':l.status==='weak'?'rgba(255,230,0,.15)':'rgba(255,80,80,.12)'),minWidth:65,textAlign:'center'}}>{l.name.toUpperCase()}</span>
                  <span style={{color:l.added?'rgba(240,240,255,.6)':'rgba(0,229,255,.4)',lineHeight:1.4}}>{l.added||'Already covered \u2713'}</span>
                </div>})}</div>}
              </div>}
              {appState==='complete'&&<div style={{border:'1px solid rgba(255,107,0,.15)',padding:'10px 12px',background:'rgba(255,107,0,.04)',borderLeft:'2px solid rgba(255,107,0,.5)',animation:'fu .4s ease'}}>
                <div className="flex items-center gap-1.5 mb-1"><span style={{fontSize:10,color:'rgba(255,107,0,.7)'}}>◈</span><span style={{fontFamily:UI,fontSize:8,letterSpacing:'.3em',color:'rgba(255,107,0,.5)'}}>SOVREN CODE</span></div>
                <div style={{fontSize:14,color:'rgba(255,107,0,.9)',fontWeight:600}}>Supabase</div>
                <div style={{fontSize:12,color:'rgba(195,200,215,.82)',lineHeight:1.6,marginTop:3}}>Your app&apos;s brain and security guard. It remembers everything your users do and makes sure only the right people get in.</div>
                <div className="flex gap-1.5 mt-2">{['Got it','Tell me more','Save term'].map(a=><span key={a} className="cursor-pointer" style={{fontSize:9,color:'rgba(255,107,0,.7)',padding:'3px 8px',border:'1px solid rgba(255,107,0,.15)'}}>{a}</span>)}</div>
              </div>}
              {appState==='complete'&&buildScore>0&&<BuildScoreRing score={buildScore} suggestions={suggestions} onHandoff={generateHandoff} handoffLoading={handoffLoading} tokenUsage={tokenUsage}/>}
              {appState==='complete'&&showRevCalc&&<RevCalc onAddPricing={()=>fillChat('Add a pricing page with 3 tiers')}/>}

            </div>
            {showStrip&&<div className="flex gap-1 px-3 py-1.5 flex-shrink-0 flex-wrap" style={{borderTop:'1px solid rgba(0,229,255,.035)',animation:'fu .4s ease'}}>{[{l:'Foundation',h:'What should users be able to DO that they can\'t yet? What actions are missing?'},{l:'Details',h:'How should this BEHAVE differently? What rules, states, or interactions need changing?'},{l:'Experience',h:'How should this FEEL? What\'s the vibe - calmer, bolder, more playful, more minimal?'},{l:'Architecture',h:'What should this CONNECT to? Database, payments, auth, external services?'},{l:'Philosophy',h:'What should this NOT be? What should I remove, simplify, or cut?'}].map((p)=><span key={p.l} onClick={()=>setRefineText(p.h)} style={{fontSize:9,padding:'4px 8px',border:'1px solid rgba(0,229,255,.07)',color:'rgba(195,200,215,.55)',background:'transparent',cursor:'pointer',transition:'all .15s'}} onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(0,229,255,.3)';e.currentTarget.style.color='#00E5FF';e.currentTarget.style.background='rgba(0,229,255,.04)'}} onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(0,229,255,.07)';e.currentTarget.style.color='rgba(195,200,215,.55)';e.currentTarget.style.background='transparent'}}>{p.l}</span>)}</div>}
            <div className="px-3 pb-3 flex-shrink-0" style={{background:'rgba(8,11,22,.93)',borderTop:'1px solid rgba(0,229,255,.07)'}}>
              {showModes&&<div className="flex gap-0.5 mb-1" style={{animation:'fu .3s ease'}}>{['BUILD','PLAN','CHAT'].map((m)=><span key={m} onClick={()=>setActiveMode(m)} style={{fontFamily:UI,fontSize:8,letterSpacing:'.14em',padding:'3px 6px',cursor:'pointer',color:activeMode===m?'#00E5FF':'rgba(195,200,215,.55)',border:`1px solid ${activeMode===m?'rgba(0,229,255,.15)':'transparent'}`,background:activeMode===m?'rgba(0,229,255,.04)':'transparent'}}>{m}</span>)}</div>}
              {activeMode==='PLAN'?<div style={{border:'1px solid rgba(0,229,255,.15)',background:'rgba(4,6,14,.96)',animation:'breathe 3s ease infinite'}}>
                <div style={{padding:'10px 14px 8px',borderBottom:'1px solid rgba(0,229,255,.07)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div><div style={{fontFamily:UI,fontSize:8,letterSpacing:'.25em',color:'rgba(0,229,255,.5)'}}>THOUGHT SPACE</div><div style={{fontSize:10,color:'rgba(240,240,255,.35)',marginTop:2}}>Draft freely. Nothing here costs an action.</div></div>
                  <div style={{fontFamily:UI,fontSize:7,letterSpacing:'.15em',color:'rgba(0,229,255,.25)'}}>THOUGHTS: {planNotes.trim()?planNotes.trim().split(/\s+/).length:0}</div>
                </div>
                <textarea className="w-full bg-transparent outline-none resize-none" placeholder="What are you thinking about building..." value={planNotes} onChange={e=>setPlanNotes(e.target.value)} style={{color:'#F0F0FF',fontSize:14,lineHeight:1.7,padding:'14px',minHeight:100,border:'none'}}/>
                <div style={{padding:'6px 14px',borderTop:'1px solid rgba(0,229,255,.07)',display:'flex',justifyContent:'space-between'}}>
                  <span style={{fontFamily:UI,fontSize:7,letterSpacing:'.15em',color:'rgba(0,229,255,.25)'}}>FREE - NO ACTIONS USED</span>
                  <span style={{fontFamily:UI,fontSize:7,letterSpacing:'.15em',color:'rgba(0,229,255,.15)'}}>\u2191 SWITCH TO BUILD WHEN READY</span>
                </div>
              </div>
              :activeMode==='CHAT'?<div><textarea className="w-full bg-transparent outline-none resize-none" placeholder="Ask Coach anything - how to prompt better, what something means, or get advice." value={refineText} onChange={e=>setRefineText(e.target.value)} style={{background:'rgba(8,11,22,.7)',border:'1px solid rgba(0,229,255,.07)',borderBottom:'2px solid rgba(255,107,0,.15)',borderLeft:'2px solid rgba(255,107,0,.3)',color:'#F0F0FF',fontSize:14,padding:'12px 14px',height:56,lineHeight:'1.5'}}/></div>
              :<textarea className="w-full bg-transparent outline-none resize-none" placeholder="What would make this better?" value={refineText} onChange={e=>setRefineText(e.target.value)} style={{background:'rgba(8,11,22,.7)',border:'1px solid rgba(0,229,255,.07)',borderBottom:'2px solid rgba(0,229,255,.15)',color:'#F0F0FF',fontSize:15,padding:'12px 14px',height:56,lineHeight:'1.5'}}/>}
              <div className="flex items-center justify-between mt-2"><div className="flex gap-1 items-center">{['\ud83d\udcce','\ud83c\udfa4','\ud83d\udcf7','\u25c7'].map(i=><div key={i} className="flex items-center justify-center cursor-pointer" style={{width:22,height:22,border:'1px solid rgba(0,229,255,.07)',color:'rgba(195,200,215,.55)',fontSize:10}}>{i}</div>)}</div><button onClick={async()=>{if(!refineText.trim())return;setAppState('building');setShowNarr(true);setNarrText('Refining your app...');setNarrTeach('applying your changes');setMsgs(prev=>[...prev,{role:'user',text:refineText},{role:'cipher',text:'On it. Applying your changes now.',type:'building'}]);const res=await fetch('/api/build',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:refineText+' \n\nPrevious code to modify: '+generatedCode.slice(0,2000),persona:'operator',appId:appId})});const data=await res.json();if(data.success){setGeneratedCode(()=>{const raw=data.code||'';const isHTML=raw.trimStart().match(/^<!DOCTYPE|^<html/i);if(isHTML)return raw.trim();return raw.replace('export default function','function').replace('export default ','').replace('const App = () =>','function App()').replace('const App = ()=>','function App()').replace('const App = () =>{','function App(){')});setSuggestions(data.suggestions||[]);if(data.appId)setAppId(data.appId);setBuildScore(data.score?Number(data.score):Math.floor(40+Math.random()*20));if(data.tokenUsage)setTokenUsage(data.tokenUsage);setAppState('complete');setShowNarr(false);setRefineText('');setMsgs(prev=>[...prev,{role:'cipher',text:data.narration||'Changes applied.',type:'summary'},{role:'cipher',text:'Cipher is here - what needs work?',type:'suggestion'}])}else{setAppState('complete');setShowNarr(false);setMsgs(prev=>[...prev,{role:'cipher',text:data.message||'Something went wrong. Try again.'}])}}} style={{fontFamily:UI,fontSize:9,fontWeight:700,letterSpacing:'.16em',color:'#000308',background:'#00E5FF',border:'none',padding:'6px 14px',cursor:'pointer'}}>{activeMode==='PLAN'?'SAVE NOTE':'SEND →'}</button></div>
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center px-3 flex-shrink-0 overflow-hidden transition-all duration-300" style={{height:showNarr?28:0,background:'rgba(8,11,22,.93)',borderBottom:'1px solid rgba(0,229,255,.035)',fontFamily:MONO,fontSize:10,color:'rgba(0,229,255,.5)'}}><div style={{width:6,height:6,borderRadius:'50%',background:'#00E5FF',marginRight:8,animation:'pulse 1.5s ease infinite'}}/>{narrText}<span style={{color:'rgba(0,229,255,.3)',fontStyle:'italic',marginLeft:4}}> - {narrTeach}</span></div>
            <div className="flex items-center justify-between px-3 flex-shrink-0" style={{height:30,background:'rgba(8,11,22,.93)',borderBottom:'1px solid rgba(0,229,255,.035)'}}><span style={{fontSize:10,color:'rgba(195,200,215,.55)',background:'rgba(0,229,255,.04)',border:'1px solid rgba(0,229,255,.07)',padding:'2px 10px'}}><b style={{color:'#00E5FF',fontWeight:500}}>{projName.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'myapp'}</b>.sovrend.com</span><div className="flex gap-1">{['History','Visual Edit','View Code','\u2197 New Tab'].map(a=><span key={a} className="cursor-pointer" onClick={()=>{if(a==='View Code')setCodeOpen(!codeOpen);if(a==='Visual Edit'){setMsgs(prev=>[...prev,{role:'cipher',text:'Visual Edit mode coming soon. For now, describe what you want to change and I\'ll handle it.'}])};if(a==='History'){setMsgs(prev=>[...prev,{role:'cipher',text:'Version history coming soon. Each refine is saved automatically.'}])}}} style={{fontSize:9,color:a==='View Code'&&codeOpen?'#00E5FF':'rgba(195,200,215,.55)',padding:'3px 6px',border:'1px solid rgba(0,229,255,.035)'}}>{a}</span>)}</div></div>
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 flex flex-col" style={{background:'rgba(10,14,24,.5)'}}>
                {appState==='building'?<SignalDecode/>:appState==='revealing'?<div className="flex-1 relative" style={{background:'#000308',overflow:'hidden'}}>
                      {generatedCode&&<iframe key={appId||generatedCode.slice(0,50)} srcDoc={renderSrcDoc(generatedCode)} style={{width:'100%',height:'100%',border:'none',background:'#fff'}} sandbox="allow-scripts allow-same-origin" onClick={e=>e.stopPropagation()} />}
                      <div style={{position:'absolute',inset:0,pointerEvents:'none',animation:'revealFlash 2s ease-out forwards',zIndex:10}}/>
                      <div style={{position:'absolute',top:'50%',left:'50%',width:80,height:80,marginLeft:-40,marginTop:-40,borderRadius:'50%',border:'2px solid rgba(0,229,255,.4)',animation:'revealPulse 1.5s ease-out forwards',zIndex:11}}/>
                      <div style={{position:'absolute',top:'50%',left:'50%',width:40,height:40,marginLeft:-20,marginTop:-20,borderRadius:'50%',border:'1px solid rgba(240,240,255,.3)',animation:'revealPulse 1.5s ease-out 0.3s forwards',zIndex:11}}/>
                    </div>:
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center px-3 gap-1 flex-shrink-0" style={{height:28,background:'rgba(0,229,255,.04)',borderBottom:'1px solid rgba(0,229,255,.035)'}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:'50%',border:'1px solid rgba(45,50,68,.14)'}}/>)}<span style={{fontSize:9,color:'rgba(195,200,215,.55)',marginLeft:5}}>Preview</span></div>
                  <div className="flex-1 overflow-hidden flex justify-center" style={{background:'rgba(3,5,12,.9)'}}>
                  <div style={{width:activeDevice==='MOBILE'?375:activeDevice==='TABLET'?768:'100%',height:'100%',background:'#fff',transition:'width .3s ease'}}>
                    {generatedCode?<iframe key={appId||generatedCode.slice(0,50)} srcDoc={renderSrcDoc(generatedCode)} style={{width:'100%',height:'100%',border:'none',background:'#fff'}} sandbox="allow-scripts allow-same-origin" onClick={e=>e.stopPropagation()} />
                    :<div className="flex items-center justify-center h-full" style={{background:'rgba(3,5,12,.9)'}}><span style={{fontFamily:UI,fontSize:9,letterSpacing:'.2em',color:'rgba(0,229,255,.3)'}}>YOUR APP WILL APPEAR HERE</span></div>}
                  </div></div>
                </div>}
              </div>
              {codeOpen&&<div className="flex flex-col" style={{width:340,minWidth:340,background:'rgba(4,6,14,.96)',borderLeft:'1px solid rgba(0,229,255,.07)',animation:'fu .3s ease'}}>
                <div className="flex items-center justify-between px-3 flex-shrink-0" style={{height:30,borderBottom:'1px solid rgba(0,229,255,.035)'}}><div className="flex gap-0.5">{['FILES','TERMINAL'].map((t,i)=><span key={t} style={{fontFamily:UI,fontSize:8,letterSpacing:'.14em',padding:'4px 8px',color:i===0?'#00E5FF':'rgba(195,200,215,.55)',border:`1px solid ${i===0?'rgba(0,229,255,.15)':'transparent'}`,background:i===0?'rgba(0,229,255,.04)':'transparent'}}>{t}</span>)}</div><span className="cursor-pointer" onClick={()=>setCodeOpen(false)} style={{fontSize:10,color:'rgba(195,200,215,.55)'}}>✕</span></div>
                <div className="flex-1 overflow-auto p-3" style={{fontFamily:MONO,fontSize:10,lineHeight:1.8,color:'rgba(195,200,215,.55)',background:'rgba(4,6,14,.5)'}}>
                  <pre style={{whiteSpace:'pre-wrap',wordBreak:'break-all'}}>{generatedCode||'// Code will appear here after build'}</pre>
                </div>
              </div>}
            </div>
          </div>
        </div>}
      </div>
      <div className="flex items-center justify-between px-4 flex-shrink-0" style={{height:26,background:'rgba(4,6,14,.96)',borderTop:'1px solid rgba(0,229,255,.035)'}}><div className="flex gap-4" style={{fontSize:10,color:'rgba(195,200,215,.45)'}}><span>Powered by <b style={{color:'#FF6B00',fontWeight:500}}>Claude Sonnet</b></span><span>Auto-Fix <b style={{color:'#00E5FF'}}>●</b></span></div><div className="flex gap-4" style={{fontSize:10,color:'rgba(195,200,215,.45)'}}><span>Supabase <b style={{color:'#00E5FF'}}>●</b></span><span>Stripe <span style={{color:'#FF6B00'}}>○</span></span></div></div>
    </div>
    {settingsTab&&<div className="fixed inset-0 z-[65]" onClick={()=>setSettingsTab(false)} style={{background:'rgba(0,3,8,.5)'}}>
      <div className="fixed z-[66] flex flex-col" onClick={e=>e.stopPropagation()} style={{top:50,right:20,width:340,maxHeight:'80vh',background:'rgba(4,6,14,.98)',border:'1px solid rgba(0,229,255,.15)',backdropFilter:'blur(18px)',animation:'fu .3s ease',overflow:'hidden'}}>
        <div className="flex items-center justify-between px-4 py-3" style={{borderBottom:'1px solid rgba(0,229,255,.07)'}}>
          <span style={{fontFamily:UI,fontSize:9,letterSpacing:'.25em',color:'rgba(0,229,255,.5)'}}>SETTINGS</span>
          <span className="cursor-pointer" onClick={()=>setSettingsTab(false)} style={{fontSize:14,color:'rgba(0,229,255,.3)'}}>✕</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div style={{padding:'12px 16px',borderBottom:'1px solid rgba(0,229,255,.05)'}}>
            <div style={{fontFamily:UI,fontSize:7,letterSpacing:'.2em',color:'rgba(0,229,255,.35)',marginBottom:8}}>ACCOUNT</div>
            <div className="flex items-center gap-3 mb-3"><div style={{width:36,height:36,border:'1px solid rgba(0,229,255,.15)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:UI,fontSize:10,color:'#00E5FF'}}>SD</div><div><div style={{fontSize:13,color:'rgba(240,240,255,.8)'}}>StevieD</div><div style={{fontSize:10,color:'rgba(195,200,215,.45)'}}>operator@sovrend.com</div></div></div>
            <div className="flex gap-2"><span className="cursor-pointer" style={{fontSize:10,color:'rgba(195,200,215,.55)',padding:'4px 8px',border:'1px solid rgba(0,229,255,.07)'}}>Edit Profile</span><span className="cursor-pointer" onClick={async()=>{const sb=createClient();await sb.auth.signOut();window.location.href='/auth'}} style={{fontSize:10,color:'rgba(255,106,0,.6)',padding:'4px 8px',border:'1px solid rgba(255,106,0,.1)'}}>Sign Out</span></div>
          </div>
          {appState==='complete'&&<div style={{padding:'12px 16px',borderBottom:'1px solid rgba(0,229,255,.05)'}}>
            <div style={{fontFamily:UI,fontSize:7,letterSpacing:'.2em',color:'rgba(0,229,255,.35)',marginBottom:8}}>PROJECT</div>
            <div className="flex items-center justify-between mb-2"><span style={{fontSize:12,color:'rgba(240,240,255,.7)'}}>{projName}</span><span style={{fontFamily:UI,fontSize:7,color:'rgba(0,229,255,.3)'}}>{ver}</span></div>
            <div className="flex gap-2">
              <span className="cursor-pointer" onClick={()=>{const n=window.prompt('Rename project:',projName);if(n){setProjName(n);if(appId){const sb=createClient();sb.from('apps').update({name:n}).eq('id',appId)}}}} style={{fontSize:10,color:'rgba(195,200,215,.55)',padding:'4px 8px',border:'1px solid rgba(0,229,255,.07)'}}>Rename</span>
              <span className="cursor-pointer" onClick={()=>{if(generatedCode){const b=new Blob([generatedCode],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=projName.replace(/[^a-z0-9]/gi,'-')+'.tsx';a.click()}}} style={{fontSize:10,color:'rgba(195,200,215,.55)',padding:'4px 8px',border:'1px solid rgba(0,229,255,.07)'}}>Download Code</span>
              <span className="cursor-pointer" onClick={()=>{if(appId&&window.confirm('Delete this project?')){const sb=createClient();sb.from('apps').delete().eq('id',appId).then(()=>{setSavedApps(prev=>prev.filter(a=>a.id!==appId));setAppState('idle');setGeneratedCode('');setSettingsTab(false)})}}} style={{fontSize:10,color:'rgba(255,106,0,.5)',padding:'4px 8px',border:'1px solid rgba(255,106,0,.1)'}}>Delete</span>
            </div>
          </div>}
          <div style={{padding:'12px 16px',borderBottom:'1px solid rgba(0,229,255,.05)'}}>
            <div style={{fontFamily:UI,fontSize:7,letterSpacing:'.2em',color:'rgba(0,229,255,.35)',marginBottom:8}}>PLAN & USAGE</div>
            <div className="flex items-center justify-between mb-2"><span style={{fontSize:12,color:'rgba(240,240,255,.7)'}}>Tier</span><span style={{fontFamily:UI,fontSize:9,color:'#00E5FF',padding:'2px 8px',border:'1px solid rgba(0,229,255,.15)'}}>FREE</span></div>
            <div className="flex items-center justify-between mb-2"><span style={{fontSize:12,color:'rgba(240,240,255,.7)'}}>Model</span><span style={{fontSize:11,color:'#FF6B00'}}>Claude Sonnet</span></div>
            <div className="flex items-center justify-between"><span style={{fontSize:12,color:'rgba(240,240,255,.7)'}}>Auto-Fix</span><span style={{fontSize:11,color:'#00E5FF'}}>Active</span></div>
          </div>
          <div style={{padding:'12px 16px',borderBottom:'1px solid rgba(0,229,255,.05)'}}>
            <div style={{fontFamily:UI,fontSize:7,letterSpacing:'.2em',color:'rgba(0,229,255,.35)',marginBottom:8}}>INTEGRATIONS</div>
            {[{n:'Supabase',s:true},{n:'Stripe',s:false},{n:'GitHub',s:false},{n:'Vercel',s:false}].map(x=><div key={x.n} className="flex items-center justify-between mb-2"><span style={{fontSize:12,color:'rgba(240,240,255,.7)'}}>{x.n}</span><span style={{fontSize:10,color:x.s?'#00E5FF':'rgba(195,200,215,.35)',padding:'2px 8px',border:'1px solid '+(x.s?'rgba(0,229,255,.15)':'rgba(195,200,215,.1)')}}>{x.s?'Connected':'Connect'}</span></div>)}
          </div>
          <div style={{padding:'12px 16px',borderBottom:'1px solid rgba(0,229,255,.05)'}}>
            <div style={{fontFamily:UI,fontSize:7,letterSpacing:'.2em',color:'rgba(0,229,255,.35)',marginBottom:8}}>PREFERENCES</div>
            {[{n:'Cipher Assistant',v:'ON',c:'#00E5FF'},{n:'Sound Effects',v:'OFF',c:'rgba(195,200,215,.35)'},{n:'Theme',v:'Dark Grid',c:'#00E5FF'}].map(x=><div key={x.n} className="flex items-center justify-between mb-2"><span style={{fontSize:12,color:'rgba(240,240,255,.7)'}}>{x.n}</span><span style={{fontSize:10,color:x.c}}>{x.v}</span></div>)}
          </div>
          <div style={{padding:'12px 16px'}}>
            <div style={{fontFamily:UI,fontSize:7,letterSpacing:'.2em',color:'rgba(0,229,255,.35)',marginBottom:8}}>KEYBOARD SHORTCUTS</div>
            {[{k:'⌘+Enter',d:'Create app'},{k:'⌘+K',d:'Search'},{k:'⌘+.',d:'Settings'}].map(x=><div key={x.k} className="flex items-center justify-between mb-1"><span style={{fontSize:11,color:'rgba(195,200,215,.55)'}}>{x.d}</span><span style={{fontSize:9,color:'rgba(0,229,255,.35)',fontFamily:MONO,padding:'2px 6px',border:'1px solid rgba(0,229,255,.07)'}}>{x.k}</span></div>)}
          </div>
        </div>
      </div>
    </div>}
    {planOpen&&<div className="fixed z-[55] flex flex-col" style={{top:50,right:60,width:370,maxHeight:'80vh',background:'rgba(4,6,14,.98)',border:'1px solid rgba(0,229,255,.15)',backdropFilter:'blur(18px)',animation:'breathe 3s ease infinite,fu .3s ease'}}>
      <div style={{padding:'12px 14px 8px',borderBottom:'1px solid rgba(0,229,255,.07)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div><div style={{fontFamily:UI,fontSize:8,letterSpacing:'.25em',color:'rgba(0,229,255,.5)'}}>THOUGHT SPACE</div><div style={{fontSize:10,color:'rgba(240,240,255,.35)',marginTop:2}}>Draft freely. Nothing here costs an action.</div></div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontFamily:UI,fontSize:7,letterSpacing:'.15em',color:'rgba(0,229,255,.25)'}}>THOUGHTS: {planNotes.trim()?planNotes.trim().split(/\s+/).length:0}</span>
          <span className="cursor-pointer" onClick={()=>setPlanOpen(false)} style={{fontSize:12,color:'rgba(0,229,255,.3)'}}>✕</span>
        </div>
      </div>
      <div style={{position:'relative',flex:1}}><canvas ref={planCanvasRef} style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:1}}/><textarea className="w-full bg-transparent outline-none resize-none" placeholder="What are you thinking about building..." value={planNotes} onChange={e=>{setPlanNotes(e.target.value);const lines=e.target.value.split('\n');const last=lines[lines.length-1];const cx=Math.min(14+last.length*8.5,340);const cy=Math.min(14+(lines.length-1)*24+12,180);for(let i=0;i<3;i++)planParticlesRef.current.push({x:cx+(Math.random()-.5)*10,y:cy,vx:(Math.random()-.5)*.8,vy:-(0.4+Math.random()*1.2),life:1,decay:0.015+Math.random()*0.01,size:1+Math.random()*2})}} style={{color:'#F0F0FF',fontSize:14,lineHeight:1.7,padding:14,minHeight:200,border:'none',position:'relative',zIndex:2,background:'transparent',width:'100%'}}/></div>
      <div style={{padding:'6px 14px',borderTop:'1px solid rgba(0,229,255,.07)',display:'flex',justifyContent:'space-between'}}>
        <span style={{fontFamily:UI,fontSize:7,letterSpacing:'.15em',color:'rgba(0,229,255,.25)'}}>FREE - NO ACTIONS USED</span>
        <span className="cursor-pointer" onClick={()=>{setPlanOpen(false)}} style={{fontFamily:UI,fontSize:7,letterSpacing:'.15em',color:'rgba(0,229,255,.4)'}}>CLOSE</span>
      </div>
    </div>}
    {projectsOpen&&<div className="fixed inset-0 z-[70] flex items-center justify-center" style={{background:'rgba(0,3,8,.88)',backdropFilter:'blur(8px)'}}>
      <div style={{width:'90%',maxWidth:900,maxHeight:'85vh',background:'rgba(4,6,14,.98)',border:'1px solid rgba(0,229,255,.15)',overflow:'hidden',display:'flex',flexDirection:'column'}}>
        <div className="flex items-center justify-between px-5 py-3" style={{borderBottom:'1px solid rgba(0,229,255,.07)'}}>
          <div className="flex items-center gap-3"><span className="cursor-pointer" onClick={()=>setProjectsOpen(false)} style={{fontSize:14,color:'rgba(0,229,255,.4)'}}>←</span><span style={{fontFamily:UI,fontSize:10,letterSpacing:'.25em',color:'rgba(0,229,255,.6)'}}>ALL PROJECTS ({savedApps.length})</span></div>
          <span className="cursor-pointer" onClick={()=>setProjectsOpen(false)} style={{fontSize:14,color:'rgba(0,229,255,.3)'}}>✕</span>
        </div>
        <div className="flex-1 overflow-y-auto p-5" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:16}}>
          {savedApps.map(app=><div key={app.id} className="cursor-pointer" onClick={()=>{loadApp(app);setProjectsOpen(false)}} style={{border:'1px solid rgba(0,229,255,.1)',background:'rgba(8,11,22,.7)',overflow:'hidden',transition:'all .15s'}}
            onMouseEnter={e=>(e.currentTarget.style.borderColor='rgba(0,229,255,.3)')} onMouseLeave={e=>(e.currentTarget.style.borderColor='rgba(0,229,255,.1)')}>
            <div style={{height:160,background:'#fff',overflow:'hidden',position:'relative'}}>
              {app.code&&<iframe srcDoc={renderSrcDoc(app.code||"")}
            </div>
            <div style={{padding:'10px 12px',borderTop:'1px solid rgba(0,229,255,.07)'}}>
              <div style={{fontSize:12,color:'rgba(240,240,255,.8)',fontWeight:500,marginBottom:2}}>{app.name}</div>
              <div style={{fontSize:9,color:'rgba(195,200,215,.4)'}}>{new Date(app.updated_at).toLocaleDateString()}</div>
            </div>
          </div>)}
        </div>
      </div>
    </div>}
    {handoffOpen&&handoffData&&<div className="fixed inset-0 z-[80] flex items-center justify-center" style={{background:'rgba(0,3,8,.92)',backdropFilter:'blur(8px)'}}>
      <div style={{width:'90%',maxWidth:800,maxHeight:'85vh',background:'rgba(4,6,14,.98)',border:'1px solid rgba(0,229,255,.15)',overflow:'hidden',display:'flex',flexDirection:'column'}}>
        <div className="flex items-center justify-between px-5 py-3" style={{borderBottom:'1px solid rgba(0,229,255,.07)'}}>
          <div className="flex items-center gap-3"><GI s={18}/><div><div style={{fontFamily:UI,fontSize:10,letterSpacing:'.2em',color:'#F0F0FF'}}>{handoffData.appName}</div><div style={{fontFamily:UI,fontSize:7,letterSpacing:'.15em',color:'rgba(0,229,255,.4)'}}>DEVELOPER HANDOFF BRIEF</div></div></div>
          <div className="flex items-center gap-3">
            <span className="cursor-pointer" onClick={()=>navigator.clipboard.writeText(JSON.stringify(handoffData.handoff,null,2))} style={{fontFamily:UI,fontSize:8,letterSpacing:'.12em',color:'#00E5FF',padding:'4px 10px',border:'1px solid rgba(0,229,255,.15)'}}>COPY</span>
            <span className="cursor-pointer" onClick={()=>{const w=window.open('','_blank');if(w){w.document.write('<html><head><title>'+handoffData.appName+'</title><style>body{background:#000308;color:#F0F0FF;font-family:system-ui;padding:40px;max-width:800px;margin:0 auto}h1{font-size:24px;letter-spacing:.1em}h2{font-size:11px;letter-spacing:.2em;color:#00E5FF;margin:24px 0 8px}p{font-size:13px;color:rgba(195,200,215,.75);line-height:1.6;margin-bottom:8px}.s{font-size:36px;font-weight:900;color:#FFE600}.b{border:1px solid rgba(0,229,255,.1);padding:16px;margin-bottom:12px}</style></head><body><h1>'+handoffData.appName+'</h1><p>SOVREND Handoff Brief</p><div class=b><div class=s>'+handoffData.score+'/100</div></div><h2>SUMMARY</h2><p>'+(handoffData.handoff?.summary||'')+'</p><h2>NEXT STEPS</h2>'+(handoffData.handoff?.nextSteps?handoffData.handoff.nextSteps.map((s:any)=>'<p>'+s.priority+': '+s.task+'</p>').join(''):'')+'<br><p style=color:gray>Generated by SOVREND</p></body></html>');w.document.close()}}} style={{fontFamily:UI,fontSize:8,letterSpacing:'.12em',color:'#F0F0FF',padding:'4px 10px',border:'1px solid rgba(240,240,255,.15)'}}>OPEN REPORT</span>
            <span className="cursor-pointer" onClick={()=>setHandoffOpen(false)} style={{fontSize:14,color:'rgba(0,229,255,.3)'}}>✕</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          <div className="flex gap-3">
            <div style={{padding:14,border:'1px solid rgba(255,230,0,.15)',background:'rgba(255,230,0,.03)'}}><div style={{fontFamily:UI,fontSize:7,letterSpacing:'.2em',color:'rgba(255,230,0,.5)',marginBottom:6}}>BUILD SCORE</div><div style={{fontSize:28,fontWeight:900,color:'#FFE600'}}>{handoffData.score}/100</div></div>
            <div style={{flex:1,padding:14,border:'1px solid rgba(0,229,255,.1)'}}><div style={{fontFamily:UI,fontSize:7,letterSpacing:'.2em',color:'rgba(0,229,255,.4)',marginBottom:6}}>SUMMARY</div><div style={{fontSize:13,color:'rgba(240,240,255,.75)',lineHeight:1.6}}>{handoffData.handoff?.summary}</div></div>
          </div>
          {handoffData.handoff?.architecture&&<div style={{padding:14,border:'1px solid rgba(0,229,255,.1)'}}><div style={{fontFamily:UI,fontSize:7,letterSpacing:'.2em',color:'rgba(0,229,255,.4)',marginBottom:8}}>ARCHITECTURE</div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>{Object.entries(handoffData.handoff.architecture).map(([k,v])=><div key={k}><div style={{fontSize:9,color:'rgba(195,200,215,.4)',textTransform:'uppercase'}}>{k}</div><div style={{fontSize:12,color:'rgba(240,240,255,.7)',marginTop:2}}>{String(v)}</div></div>)}</div></div>}
          {handoffData.handoff?.pages&&<div style={{padding:14,border:'1px solid rgba(0,229,255,.1)'}}><div style={{fontFamily:UI,fontSize:7,letterSpacing:'.2em',color:'rgba(0,229,255,.4)',marginBottom:8}}>PAGES</div>{handoffData.handoff.pages.map((p:any,i:number)=><div key={i} style={{marginBottom:8}}><div style={{fontSize:12,color:'#00E5FF',fontWeight:500}}>{p.name}</div><div style={{fontSize:11,color:'rgba(195,200,215,.6)',marginTop:2}}>{p.purpose}</div></div>)}</div>}
          <div className="flex gap-3">
            {handoffData.handoff?.wired&&<div style={{flex:1,padding:14,border:'1px solid rgba(0,255,65,.1)'}}><div style={{fontFamily:UI,fontSize:7,letterSpacing:'.2em',color:'rgba(0,255,65,.4)',marginBottom:8}}>WIRED</div>{handoffData.handoff.wired.map((w:string,i:number)=><div key={i} style={{fontSize:11,color:'rgba(0,255,65,.6)',marginBottom:3}}>{w}</div>)}</div>}
            {handoffData.handoff?.notWired&&<div style={{flex:1,padding:14,border:'1px solid rgba(255,106,0,.1)'}}><div style={{fontFamily:UI,fontSize:7,letterSpacing:'.2em',color:'rgba(255,106,0,.4)',marginBottom:8}}>NOT WIRED</div>{handoffData.handoff.notWired.map((n:string,i:number)=><div key={i} style={{fontSize:11,color:'rgba(255,106,0,.6)',marginBottom:3}}>{n}</div>)}</div>}
          </div>
          {handoffData.handoff?.nextSteps&&<div style={{padding:14,border:'1px solid rgba(240,240,255,.1)'}}><div style={{fontFamily:UI,fontSize:7,letterSpacing:'.2em',color:'rgba(240,240,255,.3)',marginBottom:8}}>NEXT STEPS</div>{handoffData.handoff.nextSteps.map((s:any,i:number)=><div key={i} className="flex items-start gap-3" style={{marginBottom:8}}><span style={{fontFamily:UI,fontSize:7,padding:'2px 6px',color:s.priority==='HIGH'?'#FF6A00':s.priority==='MEDIUM'?'#FFE600':'rgba(195,200,215,.5)',border:'1px solid',borderColor:s.priority==='HIGH'?'rgba(255,106,0,.3)':'rgba(255,230,0,.3)',flexShrink:0}}>{s.priority}</span><div><div style={{fontSize:12,color:'rgba(240,240,255,.75)'}}>{s.task}</div><div style={{fontSize:10,color:'rgba(195,200,215,.4)',marginTop:2}}>{s.effort}</div></div></div>)}</div>}
        </div>
      </div>
    </div>}
    {publishCelebration&&<PublishCelebration appName={projName} onClose={()=>setPublishCelebration(false)}/>}
    <GlossFab/>
  {showCipherIntro&&<div className="fixed inset-0 z-[200] flex items-center justify-center" style={{background:'rgba(0,3,8,.85)',backdropFilter:'blur(12px)'}} onClick={()=>setShowCipherIntro(false)}>
      <div className="relative flex flex-col" style={{maxWidth:480,width:'90%',background:'rgba(4,6,14,.98)',border:'1px solid rgba(255,107,0,.2)',padding:'28px 32px'}} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <span style={{fontFamily:UI,fontSize:8,letterSpacing:'.25em',color:'#FF6B00'}}>CIPHER</span>
          <span className="cursor-pointer" style={{fontSize:12,color:'rgba(195,200,215,.4)'}} onClick={()=>setShowCipherIntro(false)}>✕</span>
        </div>
        <CipherIntro/>
      </div>
    </div>}
  </main>
}

'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { buildHandoffHtml } from '@/lib/handoff-html'

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
  {t:'App',d:'A program that runs in a browser or on a phone. What you are building right now.'},
  {t:'Auth',d:'How your app knows who someone is. The login system that checks credentials.'},
  {t:'Backend',d:'The behind-the-scenes part of your app. Handles data, security, and logic users don\'t see.'},
  {t:'Bug',d:'Something in your app that doesn\'t work as expected. Every builder encounters them.'},
  {t:'Build',d:'Turning your description into a working app. Claude reads your prompt and writes the code.'},
  {t:'Cache',d:'A saved copy of data so your app doesn\'t have to fetch it again. Makes things faster.'},
  {t:'Client',d:'The user\'s browser or device. Client-side means code that runs on their machine.'},
  {t:'Cloud',d:'Someone else\'s computer that runs your app 24/7. Vercel, Supabase, AWS — all cloud services.'},
  {t:'Component',d:'A reusable piece of your app\'s interface. A button, a card, a form — building blocks.'},
  {t:'CORS',d:'A security rule that controls which websites can talk to your backend.'},
  {t:'CRUD',d:'Create, Read, Update, Delete — the four basic things you do with data.'},
  {t:'CSS',d:'The styling language that controls how your app looks. Colors, fonts, spacing, layout.'},
  {t:'Database',d:'Where your app stores information. Like a giant organized spreadsheet on the internet.'},
  {t:'Dependencies',d:'Other people\'s code your app uses. Libraries that add features without writing from scratch.'},
  {t:'Deploy',d:'Making your app live on the internet so anyone with the link can visit it.'},
  {t:'Domain',d:'Your app\'s address on the internet. Like myapp.com — what people type to find you.'},
  {t:'Endpoint',d:'A specific URL your backend listens on. Send a request there, get a response back.'},
  {t:'Environment Variables',d:'Secret settings your app needs — like passwords for services. Users never see them.'},
  {t:'Error Handling',d:'Code that catches problems gracefully instead of crashing.'},
  {t:'Event',d:'Something that happens in your app — a click, a keystroke, a page load. Your code responds to events.'},
  {t:'Fetch',d:'How your app asks for data from an API or server. Like placing an order and waiting for delivery.'},
  {t:'Form',d:'Input fields where users type information. Name, email, password — forms collect data.'},
  {t:'Frontend',d:'The part people see and touch. Buttons, pages, forms, images — everything visual.'},
  {t:'Function',d:'A reusable block of code that does one specific job. Like a recipe you can use over and over.'},
  {t:'Git',d:'A system that tracks every change to your code. Like unlimited undo with a history of everything.'},
  {t:'Hook',d:'A React feature that adds behavior to components. useState remembers things, useEffect runs actions.'},
  {t:'Hosting',d:'The service that keeps your app running on the internet. Vercel hosts SOVREND apps.'},
  {t:'HTML',d:'The skeleton of every web page. Defines what content exists — headings, paragraphs, buttons.'},
  {t:'HTTP',d:'The language browsers and servers use to talk. GET fetches data, POST sends data.'},
  {t:'Import',d:'Bringing code from another file into the current one. Like grabbing a tool from another toolbox.'},
  {t:'JSON',d:'A format for sending data between apps. Looks like organized text with curly braces and colons.'},
  {t:'Key',d:'A unique identifier for data or a secret password for services. API keys unlock access.'},
  {t:'Layout',d:'The structure that wraps your pages. Navigation, footer, sidebar — shared across the app.'},
  {t:'Library',d:'Pre-built code someone else wrote that you can use. Saves you from reinventing the wheel.'},
  {t:'Loading State',d:'What your app shows while waiting for data. Spinners, skeletons, or progress bars.'},
  {t:'Localhost',d:'Your app running on your own computer during development. Only you can see it.'},
  {t:'Middleware',d:'Code that runs between a request and response. Like a bouncer checking IDs at the door.'},
  {t:'Migration',d:'A change to your database structure. Adding a column, creating a table — tracked and reversible.'},
  {t:'Modal',d:'A popup window inside your app. Confirmation dialogs, forms, and alerts use modals.'},
  {t:'Navigation',d:'How users move between pages. Menus, links, tabs, and buttons that change what is on screen.'},
  {t:'Next.js',d:'The framework your app is built on. Handles pages, routing, and server-side features automatically.'},
  {t:'npm',d:'A tool that downloads and manages code packages. Like an app store for developers.'},
  {t:'OAuth',d:'A way to log in using Google, GitHub, or other accounts instead of creating a new password.'},
  {t:'Package',d:'A bundle of code you can install and use. Same as a library or dependency.'},
  {t:'Pagination',d:'Splitting long lists into pages. Shows 10 items at a time instead of 10,000.'},
  {t:'Production',d:'Your live app that real users see. The opposite of development and localhost.'},
  {t:'Promise',d:'Code that will finish later. Fetching data is a promise — you wait for it to come back.'},
  {t:'Props',d:'Information passed between parts of your app. Like handing a note from one component to another.'},
  {t:'Query',d:'A question you ask a database. Give me all users who signed up this week is a query.'},
  {t:'React',d:'The library that builds your app\'s interface. Everything you see is a React component.'},
  {t:'Redirect',d:'Automatically sending a user to a different page. After login, you redirect to the dashboard.'},
  {t:'Refine',d:'Improving your app after the first build. Change the look, fix logic, add features.'},
  {t:'Render',d:'Drawing your app on screen. When data changes, React re-renders the affected components.'},
  {t:'Responsive',d:'Your app looks good on any screen size — phone, tablet, desktop.'},
  {t:'REST',d:'A pattern for building APIs. Uses standard HTTP methods like GET, POST, PUT, DELETE.'},
  {t:'RLS',d:'Row Level Security — Supabase rules that control who can see which rows of data.'},
  {t:'Route',d:'A page in your app. /dashboard is one route, /invoices is another. Each has its own URL.'},
  {t:'Sandbox',d:'An isolated environment for testing. Changes in a sandbox don\'t affect your live app.'},
  {t:'Schema',d:'The blueprint for your data. Like deciding what columns go in a spreadsheet before filling it.'},
  {t:'Server',d:'A computer that responds to requests. When someone visits your app, a server sends them the page.'},
  {t:'Session',d:'A user\'s active visit to your app. Starts at login, ends at logout or timeout.'},
  {t:'SQL',d:'The language databases understand. SELECT, INSERT, UPDATE, DELETE — how you talk to your data.'},
  {t:'State',d:'Data your app remembers right now. A toggle being on, items in a cart — all state.'},
  {t:'Stripe',d:'A payment system. Handles credit cards, subscriptions, and sends money to your bank.'},
  {t:'Supabase',d:'Your app\'s database plus login system in one. Stores data and controls who can see what.'},
  {t:'Tailwind',d:'The styling system that makes your app look good. Controls colors, spacing, fonts, and layout.'},
  {t:'Template',d:'A pre-built starting point. Start with a template and customize instead of from scratch.'},
  {t:'Token',d:'A digital pass that proves identity. After login, your app uses a token to stay authenticated.'},
  {t:'TypeScript',d:'The programming language your app is written in. Like JavaScript but with safety guardrails.'},
  {t:'UI',d:'User Interface — everything a person sees and interacts with. Buttons, text, images, forms.'},
  {t:'URL',d:'The address of a page on the internet. Every page in your app has a unique URL.'},
  {t:'UX',d:'User Experience — how it feels to use your app. Good UX means intuitive, fast, and satisfying.'},
  {t:'Validation',d:'Checking that user input is correct. Making sure an email has an @ or a password is long enough.'},
  {t:'Variable',d:'A named container that holds a value. Like a labeled box — you can put things in and take them out.'},
  {t:'Vercel',d:'The platform that hosts your app and makes it live on the internet. One click to deploy.'},
  {t:'Webhook',d:'An automatic message between apps. When something happens in one, it instantly tells another.'},
  {t:'WebSocket',d:'A live connection between your app and a server. Enables real-time features like chat.'},
]
const QUOTES = [
  {q:'As a man thinketh, so is he.',a:'James Allen'},
  {q:'The soul attracts that which it secretly harbors.',a:'James Allen'},
  {q:'You are today where your thoughts have brought you.',a:'James Allen'},
  {q:'Assume the feeling of the wish fulfilled.',a:'Neville Goddard'},
  {q:'An assumption, though false, if persisted in, will harden into fact.',a:'Neville Goddard'},
  {q:'Change your conception of yourself and you will automatically change the world in which you live.',a:'Neville Goddard'},
  {q:'Whatever the mind can conceive and believe, it can achieve.',a:'Napoleon Hill'},
  {q:'Strength and growth come only through continuous effort and struggle.',a:'Napoleon Hill'},
  {q:'The starting point of all achievement is desire.',a:'Napoleon Hill'},
  {q:'The soul becomes dyed with the color of its thoughts.',a:'Marcus Aurelius'},
  {q:'You have power over your mind, not outside events. Realize this, and you will find strength.',a:'Marcus Aurelius'},
  {q:'What we do now echoes in eternity.',a:'Marcus Aurelius'},
  {q:'As you think, so shall you become.',a:'Bruce Lee'},
  {q:'Do not pray for an easy life. Pray for the strength to endure a difficult one.',a:'Bruce Lee'},
  {q:'Knowing is not enough, we must apply. Willing is not enough, we must do.',a:'Bruce Lee'},
  {q:'It is not what happens to you, but how you react to it that matters.',a:'Epictetus'},
  {q:'First say to yourself what you would be, and then do what you have to do.',a:'Epictetus'},
  {q:'No great thing is created suddenly.',a:'Epictetus'},
  {q:'Luck is what happens when preparation meets opportunity.',a:'Seneca'},
  {q:'It is not that we have a short time to live, but that we waste a great deal of it.',a:'Seneca'},
  {q:'Difficulties strengthen the mind, as labor does the body.',a:'Seneca'},
  {q:'The only way to make sense out of change is to plunge into it, move with it, and join the dance.',a:'Alan Watts'},
  {q:'This is the real secret of life — to be completely engaged with what you are doing in the here and now.',a:'Alan Watts'},
  {q:'You are the universe experiencing itself.',a:'Alan Watts'},
  {q:'Think lightly of yourself and deeply of the world.',a:'Miyamoto Musashi'},
  {q:'There is nothing outside of yourself that can ever enable you to get better. Everything is within.',a:'Miyamoto Musashi'},
  {q:'Today is victory over yourself of yesterday.',a:'Miyamoto Musashi'},
  {q:'Once you understand the Way broadly, you can see it in all things.',a:'Miyamoto Musashi'},
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
    const QUOTE="AS A MAN THINKETH SO IS HE · "
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
    <div className="flex items-center justify-center flex-shrink-0" style={{width:26,height:26,fontFamily:UI,fontSize:8,
      border:`1px solid ${ic?'rgba(255,107,0,.3)':'rgba(0,229,255,.15)'}`,color:ic?'#FF6B00':'#00E5FF',
      background:ic?'rgba(255,107,0,.04)':'rgba(0,229,255,.04)'}}>{ic?'◇':'S'}</div>
    <div style={{padding:'10px 12px',fontSize:13,lineHeight:1.7,maxWidth:'92%',
      background:ic?'rgba(240,240,255,.04)':'rgba(0,229,255,.04)',
      border:`1px solid ${ic?'rgba(240,240,255,.10)':'rgba(0,229,255,.15)'}`,
      color:ic?'rgba(240,240,255,.75)':'rgba(195,200,215,.82)'}}>{text}{children}</div>
  </div>
}

function Sug({text,onPick}:{text:string;onPick?:(t:string)=>void}) {
  return <span onClick={()=>onPick&&onPick(text)} className="cursor-pointer inline-block" style={{fontSize:11,padding:'5px 12px',border:'1px solid rgba(0,229,255,.15)',color:'rgba(0,229,255,.7)',background:'rgba(0,229,255,.04)',transition:'all .2s'}} onMouseEnter={e=>{(e.target as HTMLElement).style.background='rgba(0,229,255,.1)';(e.target as HTMLElement).style.borderColor='rgba(0,229,255,.4)'}} onMouseLeave={e=>{(e.target as HTMLElement).style.background='rgba(0,229,255,.04)';(e.target as HTMLElement).style.borderColor='rgba(0,229,255,.15)'}}>{text}</span>
}

function GlossFab() {
  const [open,setOpen]=useState(false)
  const [q,setQ]=useState('')
  const filt=GLOSSARY.filter(g=>g.t.toLowerCase().includes(q.toLowerCase())||g.d.toLowerCase().includes(q.toLowerCase()))
  return <>
    <div className="fixed z-50 flex items-center justify-center cursor-pointer" onClick={()=>setOpen(!open)}
      style={{bottom:32,right:10,width:44,height:44,background:'rgba(255,107,0,.04)',border:'1px solid rgba(255,107,0,.3)',fontFamily:UI,fontSize:9,color:'#FF6B00',flexDirection:'column',gap:2}}>
      <span style={{fontSize:14,lineHeight:1}}>⬡</span><span style={{fontSize:6,letterSpacing:'.15em',opacity:0.7}}>CODE</span>
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

function BuildScoreRing({score,suggestions,onHandoff,handoffLoading}:{score:number;suggestions:string[];onHandoff:()=>void;handoffLoading:boolean}) {
  const [animScore,setAnimScore]=useState(0)
  const [show,setShow]=useState(false)
  useEffect(()=>{setTimeout(()=>setShow(true),300);let start=0;const dur=1200;const t0=performance.now()
    const tick=(now:number)=>{const p=Math.min((now-t0)/dur,1);const ease=1-Math.pow(1-p,3);setAnimScore(Math.round(score*ease));if(p<1)requestAnimationFrame(tick)}
    requestAnimationFrame(tick)},[score])
  const r=38,circ=2*Math.PI*r,offset=circ-(animScore/100)*circ
  const color=score>=80?'#00E5FF':score>=60?'#FFE600':'#FF6A00'
  return <div style={{border:`1px solid ${score>=80?'rgba(0,229,255,.15)':score>=60?'rgba(255,230,0,.15)':'rgba(255,106,0,.15)'}`,padding:'16px',background:score>=80?'rgba(0,229,255,.03)':score>=60?'rgba(255,230,0,.03)':'rgba(255,106,0,.03)',opacity:show?1:0,transform:show?'translateY(0)':'translateY(8px)',transition:'all .5s ease',animation:'fu .4s ease'}}>
    <div className="flex items-center gap-4">
      <svg width={90} height={90} viewBox="0 0 90 90">
        <circle cx={45} cy={45} r={r} fill="none" stroke="rgba(240,240,255,.06)" strokeWidth={4}/>
        <circle cx={45} cy={45} r={r} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} transform="rotate(-90 45 45)" style={{transition:'stroke-dashoffset .1s linear',filter:`drop-shadow(0 0 6px ${color}40)`}}/>
        <text x={45} y={41} textAnchor="middle" fill={color} fontSize={22} fontWeight={900} fontFamily="'Orbitron',sans-serif">{animScore}</text>
        <text x={45} y={55} textAnchor="middle" fill="rgba(240,240,255,.4)" fontSize={7} fontFamily="'Orbitron',sans-serif" letterSpacing=".15em">SCORE</text>
      </svg>
      <div>
        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:8,letterSpacing:'.25em',color:color+'99',marginBottom:6}}>BUILD SCORE</div>
        <div style={{fontSize:13,color:'rgba(240,240,255,.8)',lineHeight:1.5,marginBottom:4}}>Your app is <b style={{color}}>{animScore}% ready</b> for real users.</div>
        {suggestions.length>0&&<div style={{fontSize:11,color:'rgba(195,200,215,.5)',lineHeight:1.5,marginBottom:6}}>{suggestions.length} improvement{suggestions.length!==1?'s':''} to ship:</div>}
        {suggestions.length>0&&<div className="flex flex-col gap-1">{suggestions.map((s,i)=><div key={i} className="flex items-start gap-1.5"><span style={{fontSize:9,color,marginTop:2}}>→</span><span style={{fontSize:11,color:'rgba(195,200,215,.65)',lineHeight:1.4}}>{s}</span></div>)}</div>}
        {score>=65&&<div style={{marginTop:10,paddingTop:10,borderTop:'1px solid rgba(240,240,255,.06)'}}>
          <div style={{fontSize:11,color:'rgba(240,240,255,.6)',lineHeight:1.5,marginBottom:6}}>{score>=85?'Your app is ready.':'Almost there.'} Want a developer handoff brief?</div>
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
    <div style={{fontSize:12,color:'rgba(240,240,255,.75)',marginBottom:10,lineHeight:1.5}}>Let&apos;s see what this could make. What would you charge per month?</div>
    <div className="flex gap-2 mb-2">
      <div className="flex-1">
        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,letterSpacing:'.15em',color:'rgba(0,255,65,.4)',marginBottom:4}}>PRICE / MONTH</div>
        <div className="flex items-center" style={{border:'1px solid rgba(0,255,65,.15)',background:'rgba(0,255,65,.04)'}}>
          <span style={{padding:'6px 8px',fontSize:12,color:'rgba(0,255,65,.5)',borderRight:'1px solid rgba(0,255,65,.1)'}}>$</span>
          <input value={price} onChange={e=>setPrice(e.target.value.replace(/[^0-9.]/g,''))} placeholder="" className="w-full bg-transparent outline-none" style={{color:'#F0F0FF',fontSize:13,padding:'6px 8px'}}/>
        </div>
      </div>
      <div className="flex-1">
        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,letterSpacing:'.15em',color:'rgba(0,255,65,.4)',marginBottom:4}}>CUSTOMERS</div>
        <div className="flex items-center" style={{border:'1px solid rgba(0,255,65,.15)',background:'rgba(0,255,65,.04)'}}>
          <span style={{padding:'6px 8px',fontSize:12,color:'rgba(0,255,65,.5)',borderRight:'1px solid rgba(0,255,65,.1)'}}>×</span>
          <input value={customers} onChange={e=>setCustomers(e.target.value.replace(/[^0-9]/g,''))} placeholder="" className="w-full bg-transparent outline-none" style={{color:'#F0F0FF',fontSize:13,padding:'6px 8px'}}/>
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
    let W=c.width=innerWidth,H=c.height=innerHeight
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
      <div style={{opacity:phase>=1?1:0,transform:phase>=1?'scale(1)':'scale(0.8)',transition:'all .5s ease'}}>
        <GI s={36}/>
      </div>
      <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:28,fontWeight:900,letterSpacing:'.12em',color:'#F0F0FF',marginTop:20,textShadow:'0 0 40px rgba(240,240,255,.2)',opacity:phase>=2?1:0,transform:phase>=2?'translateY(0)':'translateY(12px)',transition:'all .6s ease'}}>
        YOUR APP IS LIVE
      </div>
      <div style={{fontSize:13,color:'rgba(240,240,255,.5)',marginTop:10,opacity:phase>=2?1:0,transition:'all .6s ease .1s'}}>
        The thought became the thing.
      </div>
      <div style={{marginTop:24,padding:'10px 20px',background:'rgba(0,229,255,.06)',border:'1px solid rgba(0,229,255,.2)',opacity:phase>=3?1:0,transform:phase>=3?'translateY(0)':'translateY(8px)',transition:'all .5s ease'}}>
        <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,letterSpacing:'.2em',color:'rgba(0,229,255,.4)',marginBottom:4}}>YOUR URL</div>
        <div style={{fontSize:15,color:'#00E5FF',fontWeight:500}}><b style={{color:'#F0F0FF'}}>{slug}</b>.sovrend.com</div>
      </div>
      <div className="flex gap-2 mt-6" style={{opacity:phase>=3?1:0,transition:'all .5s ease .2s'}}>
        <span className="cursor-pointer" style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,letterSpacing:'.14em',padding:'8px 16px',color:'#F0F0FF',border:'1px solid rgba(240,240,255,.2)',background:'rgba(240,240,255,.04)'}} onClick={()=>{navigator.clipboard.writeText(`${slug}.sovrend.com`)}}>COPY LINK</span>
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

export default function DashboardPage() {
  const [entered,setEntered]=useState(false)
  const [userName,setUserName]=useState('Operator')
  const [appState,setAppState]=useState<'idle'|'building'|'complete'>('idle')
  const [prompt,setPrompt]=useState('')
  const [sbCol,setSbCol]=useState(false)
  useEffect(()=>{if(window.innerWidth<768)setSbCol(true)},[])

  const [projName,setProjName]=useState('New Build')
  const [ver,setVer]=useState('NEW')
  const [pubVis,setPubVis]=useState(false)
  const [settingsOpen,setSettingsOpen]=useState(false)
  const [codeOpen,setCodeOpen]=useState(false)
  const [narrText,setNarrText]=useState('')
  const [narrTeach,setNarrTeach]=useState('')
  const [showNarr,setShowNarr]=useState(false)
    const [showStrip,setShowStrip]=useState(false)
  const [phIdx,setPhIdx]=useState(0)
  const [msgs,setMsgs]=useState<{role:'cipher'|'user';text:string;type?:string}[]>([])
  const [generatedCode,setGeneratedCode]=useState('')
  const [suggestions,setSuggestions]=useState<string[]>([])
  const [refineText,setRefineText]=useState('')
  const [planNotes,setPlanNotes]=useState('')
  const [planOpen,setPlanOpen]=useState(false)
  const [journalOpen,setJournalOpen]=useState(false)
  const [journalEntries,setJournalEntries]=useState<{id:string,entry_type:string,title:string,narration:string,prompt:string,created_at:string}[]>([])
  const [appId,setAppId]=useState<string|null>(null)
  const [savedApps,setSavedApps]=useState<{id:string,name:string,code:string,updated_at:string}[]>([])
  const [journal,setJournal]=useState<{id:string,entry_type:string,title:string,narration:string,prompt:string,created_at:string}[]>([])
  const [panelTab,setPanelTab]=useState<'cipher'|'journal'|'learn'>('cipher')
  const [buildScore,setBuildScore]=useState(0)
  const [showRevCalc,setShowRevCalc]=useState(false)
  const [publishCelebration,setPublishCelebration]=useState(false)
  const [explainMode,setExplainMode]=useState(false)
  const [explainResult,setExplainResult]=useState<{el:string;text:string}|null>(null)
  const [explainLoading,setExplainLoading]=useState(false)
  const [activeDevice,setActiveDevice]=useState<'DESKTOP'|'MOBILE'|'TABLET'>('DESKTOP')
  const [detectedTerms,setDetectedTerms]=useState<{t:string;d:string}[]>([])
  const [learnTermIdx,setLearnTermIdx]=useState(0)
  const [handoffLoading,setHandoffLoading]=useState(false)
  const [handoffReady,setHandoffReady]=useState(false)
  const [allProjectsOpen,setAllProjectsOpen]=useState(false)
  const buildCanvasRef=useRef<HTMLCanvasElement>(null)
  const buildParticlesRef=useRef<{x:number,y:number,vx:number,vy:number,life:number,decay:number,size:number}[]>([])
  useEffect(()=>{const c=buildCanvasRef.current;if(!c)return;const ctx=c.getContext('2d')!;let raf=0
    const draw=()=>{const p=c.parentElement;if(p&&(c.width!==p.offsetWidth||c.height!==p.offsetHeight)){c.width=p.offsetWidth;c.height=p.offsetHeight}
      ctx.clearRect(0,0,c.width,c.height)
      for(let i=buildParticlesRef.current.length-1;i>=0;i--){const q=buildParticlesRef.current[i];q.x+=q.vx;q.y+=q.vy;q.vy*=0.99;q.life-=q.decay
        if(q.life<=0){buildParticlesRef.current.splice(i,1);continue}
        ctx.beginPath();ctx.arc(q.x,q.y,q.size*q.life,0,Math.PI*2);ctx.fillStyle='rgba(255,107,0,'+(q.life*0.35)+')';ctx.fill()
        if(q.life>0.5){ctx.beginPath();ctx.arc(q.x,q.y,q.size*0.3,0,Math.PI*2);ctx.fillStyle='rgba(255,180,80,'+(q.life*0.25)+')';ctx.fill()}}
      raf=requestAnimationFrame(draw)};raf=requestAnimationFrame(draw)
    return()=>cancelAnimationFrame(raf)},[])
  const planCanvasRef=useRef<HTMLCanvasElement>(null)
  const planParticlesRef=useRef<{x:number,y:number,vx:number,vy:number,life:number,decay:number,size:number}[]>([])
  useEffect(()=>{
    const supabase=createClient()
    supabase.auth.getUser().then(({data:{user}})=>{
      if(user){setUserName(user.email?.split('@')[0]||'Operator');supabase.from('apps').select('id,name,code,updated_at').eq('user_id',user.id).order('updated_at',{ascending:false}).limit(10).then(({data})=>{if(data)setSavedApps(data)});supabase.from('journal').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(50).then(({data})=>{if(data)setJournalEntries(appId?data.filter(e=>e.app_id===appId):data)})}
        supabase.from('journal').select('id,entry_type,title,narration,prompt,created_at').eq('user_id',user.id).order('created_at',{ascending:false}).limit(50).then(({data})=>{if(data)setJournal(data)})
    })},[])  
  
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

  useEffect(()=>{const saved=localStorage.getItem('sovrend_plan_notes');if(saved)setPlanNotes(saved)},[])
  useEffect(()=>{localStorage.setItem('sovrend_plan_notes',planNotes)},[planNotes])
  // Detect glossary terms in generated code
  useEffect(()=>{
    if(!generatedCode)return
    const code=generatedCode.toLowerCase()
    const found=GLOSSARY.filter(g=>{
      const term=g.t.toLowerCase()
      if(term.length<3)return false
      return code.includes(term)
    }).slice(0,12)
    setDetectedTerms(found);setLearnTermIdx(0)
  },[generatedCode])
  // Explain mode — listen for postMessage from iframe
  useEffect(()=>{
    const handler=async(e:MessageEvent)=>{
      if(e.data?.type!=='sovrend-explain')return
      const {tag,classes,text}=e.data
      setExplainLoading(true);setExplainResult(null)
      try{
        const res=await fetch('/api/explain',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({element:{tag,classes,text:text?.slice(0,200)},context:'App name: '+projName})})
        const data=await res.json()
        if(data.success){setExplainResult({el:`<${tag}> ${text?.slice(0,40)||''}`,text:data.explanation})}
        else{setExplainResult({el:`<${tag}>`,text:data.explanation||'Couldn\'t analyze this element.'})}
      }catch{setExplainResult({el:`<${tag}>`,text:'Cipher couldn\'t reach the server. Try again.'})}
      setExplainLoading(false)
    }
    window.addEventListener('message',handler)
    return()=>window.removeEventListener('message',handler)
  },[projName])
  const generateHandoff=useCallback(async()=>{
    if(!generatedCode||handoffLoading)return
    setHandoffLoading(true)
    const win=window.open('','_blank')
    if(win){win.document.write(`<!DOCTYPE html><html><head><style>body{background:#000308;color:#F0F0FF;font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}</style></head><body><div style="text-align:center"><div style="width:28px;height:28px;border:2px solid rgba(0,229,255,.07);border-top:2px solid #00E5FF;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto"></div><div style="margin-top:16px;font-size:11px;color:rgba(0,229,255,.5);letter-spacing:.2em">GENERATING HANDOFF...</div></div><style>@keyframes spin{to{transform:rotate(360deg)}}</style></body></html>`)}
    try{
      const res=await fetch('/api/handoff',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:generatedCode,appName:projName,suggestions,score:buildScore})})
      const data=await res.json()
      if(data.success&&data.handoff){
        const h=data.handoff,tier=data.tier,isArch=tier==='architect'||tier==='agency'
        if(win){win.document.open();win.document.write(buildHandoffHtml(projName,buildScore,h,isArch));win.document.close()}
        setHandoffReady(true)
        setMsgs(prev=>[...prev,{role:'cipher',text:'Your developer handoff brief is ready. I opened it in a new tab — you can print it as a PDF or share the page directly.',type:'summary'}])
      }else{
        if(win)win.close()
        setMsgs(prev=>[...prev,{role:'cipher',text:'Couldn\'t generate the handoff brief. Try again.'}])
      }
    }catch{if(win)win.close();setMsgs(prev=>[...prev,{role:'cipher',text:'Something went wrong generating the handoff. Try again.'}])}
    setHandoffLoading(false)
  },[generatedCode,projName,suggestions,buildScore,handoffLoading])
  useEffect(()=>{
    if(!appId)return
    const sb=createClient()
    sb.auth.getUser().then(({data:{user:u}})=>{
      if(u)sb.from('journal').select('*').eq('user_id',u.id).order('created_at',{ascending:false}).limit(50).then(({data})=>{
        if(data)setJournalEntries(data.filter(e=>e.app_id===appId))
      })
    })
  },[appId])
  const sbW=sbCol?52:220
  const rainSpeed=entered?1:2.5
  useEffect(()=>{if(appState!=='idle')return;const iv=setInterval(()=>setPhIdx(p=>(p+1)%PLACEHOLDERS.length),4000);return()=>clearInterval(iv)},[appState])
  useEffect(()=>{const h=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key==='Enter'&&appState==='idle'&&prompt.trim()){e.preventDefault();handleBuild()}};document.addEventListener('keydown',h);return()=>document.removeEventListener('keydown',h)},[appState,prompt])
  const handleBuild=useCallback(async()=>{
    if(!prompt.trim()||appState!=='idle')return
    setAppState('building');setProjName('New Build');setVer('BUILDING...');setShowNarr(true)
    const wordCount=prompt.trim().split(/\s+/).length
    let buildPrompt=prompt
    if(wordCount<30){
      setMsgs([{role:'cipher',text:'Short prompt detected. Let me sharpen your vision...'},{role:'user',text:prompt}])
      setNarrText('Cipher is refining your description...');setNarrTeach('expanding your idea')
      try{
        const enhRes=await fetch('/api/enhance',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt})})
        const enhData=await enhRes.json()
        if(enhData.success&&enhData.enhanced){buildPrompt=enhData.enhanced;setMsgs(prev=>[...prev,{role:'cipher',text:'Here\'s what I\'m building: '+enhData.enhanced},{role:'cipher',text:'Building now \u2014 I\'ll walk you through each step.',type:'building'}])}
        else{setMsgs(prev=>[...prev,{role:'cipher',text:'Building now \u2014 I\'ll walk you through each step.',type:'building'}])}
      }catch(e){setMsgs(prev=>[...prev,{role:'cipher',text:'Building now \u2014 I\'ll walk you through each step.',type:'building'}])}
    }else{
      setMsgs([{role:'cipher',text:'I see your vision. Let me bring it to life.'},{role:'user',text:prompt},{role:'cipher',text:'Building now \u2014 I\'ll walk you through each step.',type:'building'}])
    }
    let step=0;setNarrText(STEPS[0][0]);setNarrTeach(STEPS[0][1])
    const ni=setInterval(()=>{step++;if(step>=STEPS.length){clearInterval(ni);return};setNarrText(STEPS[step][0]);setNarrTeach(STEPS[step][1])},800)
    try{
      const res=await fetch('/api/build',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:buildPrompt,persona:'operator',appId:appId})})
      const data=await res.json()
      clearInterval(ni)
      if(data.success){
        const sug=data.suggestions||['What else should this app do?','What would your users want next?','What feels incomplete?']
        setGeneratedCode(data.code||'');setSuggestions(sug);if(data.appId)setAppId(data.appId)
        const score=Math.max(50,Math.min(97,100-sug.length*12+Math.floor(Math.random()*5)))
        setBuildScore(score);setShowRevCalc(true)
        setAppState('complete');setVer('v1.0');setShowNarr(false);setPubVis(true);setTimeout(()=>{const sb=createClient();sb.auth.getUser().then(({data:{user:u}})=>{if(u)sb.from('journal').select('*').eq('user_id',u.id).order('created_at',{ascending:false}).limit(50).then(({data:jd})=>{if(jd)setJournalEntries(appId?jd.filter(e=>e.app_id===appId):jd)})})},1000)
        if(data.narration)setProjName(data.narration.split('.')[0].slice(0,30))
        setMsgs(prev=>[...prev,{role:'cipher',text:data.narration||'Your app is live. Here\'s what I\'d suggest next:',type:'summary'},{role:'cipher',text:'What would you like to change or add?',type:'suggestion'}])
        setTimeout(()=>setShowStrip(true),400)
      }else{
        setAppState('idle');setVer('NEW');setShowNarr(false)
        setMsgs(prev=>[...prev,{role:'cipher',text:data.message||'Something went wrong. Try again with a different prompt.'}])
      }
    }catch(e){clearInterval(ni);setAppState('idle');setVer('NEW');setShowNarr(false)
      setMsgs(prev=>[...prev,{role:'cipher',text:'The Grid encountered an error. Try again.'}])}
  },[prompt,appState])
  const loadTpl=(k:string)=>{if(TEMPLATES[k])setPrompt(TEMPLATES[k])}
const fillChat=(text:string)=>{setRefineText(text)}
  const loadApp = (app:{id:string,name:string,code:string}) => {
    setJournalOpen(false);setAppId(app.id);setProjName(app.name)
    setGeneratedCode(app.code.replace('export default function','function').replace('export default ',''))
    setAppState('complete');setVer('saved');setPubVis(true);setShowStrip(true);setShowRevCalc(true)
    const defaultSug=['What else should this app do?','What would your users want next?','What feels incomplete?']
    setSuggestions(defaultSug);setBuildScore(Math.max(50,Math.min(97,100-defaultSug.length*12+Math.floor(Math.random()*5))))
    setMsgs([{role:'cipher',text:'Loaded '+app.name+'. What would you like to change?',type:'summary'}])
  }
  return <main><div>test</div></main>;
}
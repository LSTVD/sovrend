"use client"
import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'

const MONO = '"JetBrains Mono", monospace'
const SERIF = '"Fraunces", serif'
const SANS = '"DM Sans", sans-serif'

const ACTS = [
  {
    num:'01', title:'Review', cipher:'Before anything goes live, make sure what you built is worth sending into the world. Use it like a stranger would.',
    steps:[
      {title:'Use your build like a stranger would',instruction:'Open your build and click every button. Fill every form. Try to break it. If something does not work — refine it now. Not after launch.',confirm:'Everything works'},
      {title:'Check your diagnostic score',instruction:'Anything marked critical needs to be fixed before you continue. Warnings are acceptable. Criticals are not.',confirm:'Score reviewed'},
      {title:'Read every line of copy in your build',instruction:'Wrong business name. Placeholder text. Generic descriptions. If it does not say exactly what you mean — fix it.',confirm:'Copy is accurate'},
      {title:'Check it on your phone',instruction:'Most of your customers will find you on mobile first. Open your preview URL on your phone right now. If it looks broken — refine before continuing.',confirm:'Looks right on mobile'},
    ]
  },
  {
    num:'02', title:'Database', cipher:'Your app needs somewhere to store data. Supabase is free to start and yours to keep.',
    steps:[
      {title:'Create your Supabase account',instruction:'Go to supabase.com and create a free account. Use the same email you use for everything important.',link:{text:'Open Supabase',url:'https://supabase.com'},confirm:'Account created'},
      {title:'Create a new project',instruction:'Click New project. Name it after your app. Pick the region closest to your customers. Set a strong password and save it somewhere safe. Wait about 2 minutes.',note:'Save your database password. You will not see it again after this screen.',confirm:'Project created'},
      {title:'Copy your Project URL and Anon key',instruction:'In your project go to Settings → API. Copy your Project URL and Anon public key. Both are needed.',copies:[{label:'Settings → API → Project URL',value:'NEXT_PUBLIC_SUPABASE_URL'},{label:'Settings → API → Anon public key',value:'NEXT_PUBLIC_SUPABASE_ANON_KEY'}],confirm:'Both keys copied'},
      {title:'Add keys to your environment',instruction:'In Vercel go to your project → Settings → Environment Variables. Paste both keys. Save and redeploy.',confirm:'Environment variables saved'},
      {title:'Enable Row Level Security',instruction:'In Supabase go to Authentication → Policies. Enable Row Level Security on every table. This ensures users only see their own data.',confirm:'RLS enabled'},
    ]
  },
  {
    num:'03', title:'Email', cipher:'When someone fills out a form on your site, that message needs to go somewhere real. Resend handles this free up to 3,000 emails per month.',
    steps:[
      {title:'Create your Resend account',instruction:'Go to resend.com and create a free account.',link:{text:'Open Resend',url:'https://resend.com'},confirm:'Account created'},
      {title:'Create an API key',instruction:'Click API Keys in the sidebar. Click Create API Key. Name it after your app. Copy the key immediately — Resend will not show it again.',note:'Copy this key now. Once you leave this screen it is gone.',confirm:'API key copied'},
      {title:'Add API key to your environment',instruction:'In Vercel add RESEND_API_KEY with your key as the value. Save and redeploy.',copies:[{label:'Environment variable name',value:'RESEND_API_KEY'}],confirm:'API key saved'},
      {title:'Add your domain to Resend',instruction:'In Resend click Domains. Add your domain. Resend will give you DNS records. You will verify this after Act 04 when your DNS is configured.',confirm:'Domain added to Resend'},
    ]
  },
  {
    num:'04', title:'Deploy', cipher:'This is the act that makes everything real. Your app goes from a preview to a live URL the whole world can visit.',
    steps:[
      {title:'Create a GitHub account',instruction:'GitHub is where your code lives so Vercel can deploy it. Free. Takes two minutes.',link:{text:'Open GitHub',url:'https://github.com'},confirm:'GitHub account ready'},
      {title:'Push your build to GitHub',instruction:'In your SOVREND dashboard click Push to GitHub. Cipher will create a repository and push your code. You will see a green confirmation when done.',confirm:'Code pushed to GitHub'},
      {title:'Deploy to Vercel',instruction:'Go to vercel.com. Click Add New Project. Connect GitHub. Find your repository and click Import. Add your environment variables before clicking Deploy.',link:{text:'Open Vercel',url:'https://vercel.com'},confirm:'Deployed to Vercel'},
      {title:'Buy your domain',instruction:'Go to Namecheap and search for yourname.com. Buy it. Usually $10-15 per year. Do not overthink this.',link:{text:'Open Namecheap',url:'https://namecheap.com'},note:'Tip: .com is always the right choice. If it is taken try yournamestudio.com or yourbrand.co.',confirm:'Domain purchased'},
      {title:'Connect domain to Vercel',instruction:'In Vercel go to your project → Settings → Domains. Add your domain. Vercel gives you two DNS records — an A record and a CNAME for www.',copies:[{label:'A Record points to',value:'76.76.21.21'},{label:'CNAME for www',value:'cname.vercel-dns.com'}],confirm:'DNS records from Vercel copied'},
      {title:'Add DNS records at Namecheap',instruction:'In Namecheap find your domain → Manage → Advanced DNS. Delete default records. Add the A record and CNAME from Vercel. Save. DNS propagates in 10-30 minutes.',note:'DNS takes 10-30 minutes to propagate. When Vercel shows a green checkmark — you are live.',confirm:'DNS records added and live'},
      {title:'Verify email domain in Resend',instruction:'Go back to Resend → Domains. Your domain should now show as verified. If not click Verify. This ensures your emails land in inbox not spam.',confirm:'Email domain verified'},
    ]
  },
  {
    num:'05', title:'Discover', cipher:'Being live is not the same as being found. This act makes sure people can actually find you.',
    steps:[
      {title:'Set your page title and meta description',instruction:'Make sure your page title and meta description describe exactly what you do and who it is for. These appear in Google search results.',confirm:'Title and description set'},
      {title:'Submit to Google Search Console',instruction:'Go to Google Search Console. Add your domain. Verify ownership by adding the TXT record to your Namecheap DNS. Once verified click Request Indexing.',link:{text:'Open Search Console',url:'https://search.google.com/search-console'},confirm:'Submitted to Google'},
      {title:'Claim Google Business Profile',instruction:'If you have a physical location or service area this is non-negotiable. Go to Google Business. Claim your profile. Fill every field. Add photos. Set your hours.',link:{text:'Open Google Business',url:'https://business.google.com'},confirm:'Google Business claimed'},
      {title:'Enable Vercel Analytics',instruction:'In Vercel go to your project → Analytics. Enable it. One click. Free. Now you know how many people visit and where they come from.',confirm:'Analytics enabled'},
      {title:'Secure your social handles',instruction:'Go to Instagram, TikTok, and X right now. Create accounts with your business name even if you are not ready to post. Someone else will take your handle if you wait.',confirm:'Social handles secured'},
      {title:'Update your existing social bios',instruction:'On any social accounts you already have — update your bio to include your new domain.',confirm:'Bios updated'},
    ]
  },
  {
    num:'06', title:'Commerce', cipher:'This act applies if your build accepts payments. If it does not — this act stays locked until you add payment logic.',
    locked:true,
    steps:[
      {title:'Create and verify your Stripe account',instruction:'Go to stripe.com and create an account. Complete identity verification — required to receive real money. Have your bank account details ready.',link:{text:'Open Stripe',url:'https://stripe.com'},confirm:'Stripe account verified'},
      {title:'Switch to live mode and copy your keys',instruction:'In the top left of your Stripe dashboard switch from Test mode to Live mode. Copy your live Publishable key and Secret key.',copies:[{label:'Publishable key starts with',value:'pk_live_...'},{label:'Secret key starts with',value:'sk_live_...'}],confirm:'Live keys copied'},
      {title:'Add live keys to your environment',instruction:'In Vercel add your live Stripe keys. Save and redeploy.',copies:[{label:'Variable 1',value:'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'},{label:'Variable 2',value:'STRIPE_SECRET_KEY'}],confirm:'Stripe keys saved'},
      {title:'Add your webhook endpoint',instruction:'In Stripe go to Developers → Webhooks → Add endpoint. Your URL is your domain followed by /api/stripe/webhook. Select the three payment events. Copy the Signing secret.',copies:[{label:'Webhook URL',value:'https://yourdomain.com/api/stripe/webhook'},{label:'Environment variable',value:'STRIPE_WEBHOOK_SECRET'}],confirm:'Webhook configured'},
      {title:'Enable Stripe email receipts',instruction:'In Stripe go to Settings → Emails. Enable payment receipts and failed payment notifications.',confirm:'Email receipts enabled'},
      {title:'Run a real test purchase',instruction:'Make a real purchase on your own site. Confirm money appears in Stripe. Confirm the confirmation email arrives. Refund yourself after.',note:'Do not skip this. A payment flow that almost works loses customers. Confirm everything end to end before you go public.',confirm:'Test purchase confirmed'},
    ]
  },
  {
    num:'07', title:'Backup', cipher:'You built something real. Protect it.',
    steps:[
      {title:'Enable Supabase backups',instruction:'In Supabase go to Settings → Backups. Enable daily backups. If you are on the free plan export your data manually once a week.',link:{text:'Open Supabase',url:'https://supabase.com'},confirm:'Backups enabled'},
      {title:'Note your last good Vercel deployment',instruction:'In Vercel go to your project → Deployments. Find your current live deployment. If something breaks after a future update you can roll back in one click.',confirm:'Deployment noted'},
      {title:'You are done.',instruction:'Your product is live. Your data is protected. Your customers can find you. Your money moves. This is what it looks like to finish what you started.',confirm:'Mark complete'},
    ]
  },
]

interface Step{title:string;instruction:string;confirm:string;link?:{text:string;url:string};note?:string;copies?:{label:string;value:string}[]}
interface Act{num:string;title:string;cipher:string;locked?:boolean;steps:Step[]}

export default function DeployPage(){
  const params=useParams()
  const router=useRouter()
  const appId=params?.appId as string
  const [appName,setAppName]=useState('Your App')
  const [buildScore,setBuildScore]=useState(0)
  const [currentAct,setCurrentAct]=useState(0)
  const [progress,setProgress]=useState<Record<string,boolean[]>>({"0":[],"1":[],"2":[],"3":[],"4":[],"5":[],"6":[]})
  const [loading,setLoading]=useState(true)
  const [saving,setSaving]=useState(false)
  const [copied,setCopied]=useState<string|null>(null)

  useEffect(()=>{
    if(!appId)return
    fetch(`/api/deploy/progress?appId=${appId}`)
      .then(r=>r.json())
      .then(data=>{
        if(data.deploy){
          setAppName(data.deploy.app_name||'Your App')
          setBuildScore(data.deploy.build_score||0)
          if(data.deploy.progress)setProgress(data.deploy.progress)
        }
        setLoading(false)
      })
      .catch(()=>setLoading(false))
  },[appId])

  const saveProgress=useCallback(async(newProgress:Record<string,boolean[]>)=>{
    if(!appId)return
    setSaving(true)
    const completedActs=ACTS.map((_,i)=>{const p=newProgress[String(i)]||[];return p.length===ACTS[i].steps.length&&p.every(Boolean)?i:-1}).filter(i=>i>=0)
    await fetch('/api/deploy/progress',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({appId,appName,buildScore,progress:newProgress,completedActs})}).catch(()=>{})
    setSaving(false)
  },[appId,appName,buildScore])

  const confirmStep=(actIdx:number,stepIdx:number)=>{
    const np={...progress}
    const steps=[...(np[String(actIdx)]||[])]
    steps[stepIdx]=true
    np[String(actIdx)]=steps
    setProgress(np)
    saveProgress(np)
  }

  const totalSteps=ACTS.reduce((a,act)=>a+act.steps.length,0)
  const completedSteps=Object.values(progress).reduce((a,steps)=>a+steps.filter(Boolean).length,0)
  const pct=Math.round(completedSteps/totalSteps*100)
  const getAP=(i:number)=>{const p=progress[String(i)]||[];return{done:p.filter(Boolean).length,total:ACTS[i].steps.length,complete:p.filter(Boolean).length===ACTS[i].steps.length&&ACTS[i].steps.length>0}}
  const copyText=(val:string)=>{navigator.clipboard?.writeText(val).catch(()=>{});setCopied(val);setTimeout(()=>setCopied(null),2000)}

  const act=ACTS[currentAct] as Act
  const actProg=progress[String(currentAct)]||[]

  if(loading)return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#0B0D14',fontFamily:MONO,fontSize:11,letterSpacing:'.14em',color:'rgba(0,229,255,.5)'}}>
      LOADING...
    </div>
  )

  return(
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        html,body{height:100%;overflow:hidden;background:#0B0D14}
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,300&family=DM+Sans:wght@200;300;400;500&family=JetBrains+Mono:wght@300;400&display=swap');
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(232,228,216,.1);border-radius:2px}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        .si{animation:fadeIn .3s ease forwards}
        body::after{content:"";position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.008) 2px,rgba(0,0,0,.008) 3px);pointer-events:none;z-index:9999}
      `}</style>
      <div style={{display:'flex',height:'100vh',overflow:'hidden',background:'#0B0D14',color:'#E8E4D8',fontFamily:SANS}}>

        {/* SIDEBAR */}
        <div style={{width:260,background:'#0F1119',borderRight:'1px solid rgba(232,228,216,.06)',display:'flex',flexDirection:'column',flexShrink:0}}>
          <div style={{padding:'20px 20px 16px',borderBottom:'1px solid rgba(232,228,216,.06)'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16,cursor:'pointer',opacity:.6}} onClick={()=>router.push('/dashboard')}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.opacity='1'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.opacity='.6'}}
            >
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:2,width:14}}>
                {[0,1,2,3,4,5,6,7,8].map(i=><div key={i} style={{width:3,height:3,border:'.5px solid '+(i===4?'#00E5FF':'rgba(0,229,255,.25)'),background:i===4?'#00E5FF':'transparent'}}/>)}
              </div>
              <span style={{fontFamily:MONO,fontSize:9,letterSpacing:'.16em',textTransform:'uppercase',color:'rgba(232,228,216,.3)'}}>← Dashboard</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
              <span style={{fontFamily:MONO,fontSize:8,letterSpacing:'.14em',textTransform:'uppercase',color:'rgba(232,228,216,.25)'}}>Progress</span>
              <span style={{fontFamily:MONO,fontSize:8,color:'#00E5FF'}}>{pct}%</span>
            </div>
            <div style={{height:2,background:'rgba(232,228,216,.08)',borderRadius:1,overflow:'hidden'}}>
              <div style={{height:'100%',background:'#00E5FF',borderRadius:1,width:pct+'%',transition:'width .5s cubic-bezier(.16,1,.3,1)'}}/>
            </div>
          </div>

          <div style={{flex:1,overflowY:'auto',padding:'8px 0'}}>
            {ACTS.map((a,i)=>{
              const ap=getAP(i)
              const isActive=i===currentAct
              const isLocked=!!(a.locked)
              return(
                <div key={i} onClick={()=>{if(!isLocked)setCurrentAct(i)}}
                  style={{display:'flex',alignItems:'center',gap:12,padding:'11px 20px',cursor:isLocked?'not-allowed':'pointer',borderLeft:`2px solid ${isActive?'#00E5FF':'transparent'}`,background:isActive?'rgba(0,229,255,.04)':'transparent',opacity:isLocked?.35:1,transition:'all .2s'}}
                >
                  <div style={{width:20,height:20,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:600,border:`1px solid ${ap.complete?'#3DD68C':isActive?'#00E5FF':'rgba(232,228,216,.12)'}`,background:ap.complete?'rgba(61,214,140,.15)':isActive?'rgba(0,229,255,.07)':'transparent',color:ap.complete?'#3DD68C':'transparent',transition:'all .3s'}}>
                    {ap.complete?'✓':''}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:MONO,fontSize:8,letterSpacing:'.16em',color:ap.complete?'#3DD68C':isActive?'#00E5FF':'rgba(232,228,216,.25)',marginBottom:2}}>ACT {a.num}</div>
                    <div style={{fontSize:13,fontWeight:isActive?500:400,color:ap.complete?'rgba(232,228,216,.35)':isActive?'#E8E4D8':'rgba(232,228,216,.55)',transition:'color .2s'}}>{a.title}</div>
                  </div>
                  <div style={{fontFamily:MONO,fontSize:8,color:isActive?'#00E5FF':'rgba(232,228,216,.2)'}}>{ap.done}/{ap.total}</div>
                </div>
              )
            })}
          </div>

          <div style={{padding:'16px 20px',borderTop:'1px solid rgba(232,228,216,.06)'}}>
            <div style={{fontFamily:MONO,fontSize:8,letterSpacing:'.08em',color:'rgba(232,228,216,.25)',marginBottom:4}}>{appName}</div>
            <div style={{display:'flex',alignItems:'center',gap:6}}>
              <span style={{fontFamily:SERIF,fontStyle:'italic',fontSize:22,fontWeight:300,color:'#3DD68C'}}>{buildScore}</span>
              <span style={{fontSize:11,fontWeight:300,color:'rgba(232,228,216,.3)'}}>build score</span>
            </div>
            {saving&&<div style={{fontFamily:MONO,fontSize:7,letterSpacing:'.1em',color:'rgba(0,229,255,.4)',marginTop:4}}>SAVING...</div>}
          </div>
        </div>

        {/* MAIN */}
        <div style={{flex:1,overflowY:'auto',background:'#0B0D14'}} key={currentAct}>
          <div style={{padding:'32px 40px 24px',borderBottom:'1px solid rgba(232,228,216,.06)',position:'sticky',top:0,background:'#0B0D14',zIndex:10}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10,fontFamily:MONO,fontSize:8,letterSpacing:'.22em',textTransform:'uppercase',color:'#00E5FF'}}>
              <div style={{width:14,height:1,background:'#00E5FF'}}/>
              Act {act.num} of {ACTS.length}
            </div>
            <div style={{fontFamily:SERIF,fontStyle:'italic',fontSize:'clamp(24px,3vw,36px)',fontWeight:300,letterSpacing:'-.03em',color:'#E8E4D8',marginBottom:8,lineHeight:1.1}}>{act.title}</div>
            <div style={{fontSize:14,fontWeight:300,color:'rgba(232,228,216,.5)',lineHeight:1.72,maxWidth:560}}>{act.cipher}</div>
          </div>

          {act.locked?(
            <div style={{padding:40,textAlign:'center'}}>
              <div style={{border:'1px solid rgba(232,228,216,.06)',padding:40,background:'#0F1119',maxWidth:480,margin:'0 auto'}}>
                <div style={{fontFamily:MONO,fontSize:9,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(232,228,216,.25)',marginBottom:8}}>ACT {act.num} — LOCKED</div>
                <div style={{fontFamily:SERIF,fontStyle:'italic',fontSize:22,fontWeight:300,color:'rgba(232,228,216,.4)',marginBottom:8}}>Not yet unlocked.</div>
                <div style={{fontSize:13,fontWeight:300,color:'rgba(232,228,216,.3)',lineHeight:1.65}}>Your current build does not have commerce wired. Refine your app to add payments and this act will unlock automatically.</div>
              </div>
            </div>
          ):(
            <div style={{padding:'32px 40px'}}>
              {act.steps.map((step:Step,si:number)=>{
                const isDone=actProg[si]===true
                const isStepActive=!isDone&&(si===0||actProg[si-1]===true)
                const isStepLocked=!isDone&&!isStepActive
                return(
                  <div key={si} className={isStepActive?'si':''} style={{border:`1px solid ${isDone?'rgba(61,214,140,.12)':isStepActive?'rgba(0,229,255,.15)':'rgba(232,228,216,.06)'}`,marginBottom:8,background:isStepActive?'#141720':'#0F1119',opacity:isStepLocked?.4:1,pointerEvents:isStepLocked?'none':'auto',transition:'all .25s'}}>
                    <div style={{display:'flex',alignItems:'center',gap:14,padding:'15px 20px'}}>
                      <div style={{fontFamily:MONO,fontSize:9,letterSpacing:'.14em',color:isDone?'#3DD68C':isStepActive?'#00E5FF':'rgba(232,228,216,.25)',width:28,flexShrink:0}}>{act.num}.{String(si+1).padStart(2,'0')}</div>
                      <div style={{fontSize:13,fontWeight:isStepActive?500:400,color:isDone?'rgba(232,228,216,.35)':isStepActive?'#E8E4D8':'rgba(232,228,216,.5)',flex:1,transition:'color .2s'}}>{step.title}</div>
                      <div style={{width:20,height:20,borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:600,border:`1px solid ${isDone?'#3DD68C':isStepActive?'rgba(0,229,255,.4)':'rgba(232,228,216,.12)'}`,background:isDone?'rgba(61,214,140,.15)':isStepActive?'rgba(0,229,255,.07)':'transparent',color:isDone?'#3DD68C':'transparent'}}>{isDone?'✓':''}</div>
                    </div>
                    {isStepActive&&(
                      <div style={{padding:'0 20px 20px 62px'}}>
                        <div style={{fontSize:13,fontWeight:300,color:'rgba(232,228,216,.65)',lineHeight:1.78,marginBottom:16}}>{step.instruction}</div>
                        {step.note&&<div style={{background:'rgba(255,232,168,.03)',border:'1px solid rgba(255,232,168,.1)',padding:'10px 14px',marginBottom:14}}><div style={{fontSize:12,fontWeight:300,color:'rgba(255,232,168,.6)',lineHeight:1.65}}>{step.note}</div></div>}
                        {step.link&&(
                          <div onClick={()=>window.open(step.link!.url,'_blank')} style={{display:'inline-flex',alignItems:'center',gap:7,padding:'7px 14px',border:'1px solid rgba(232,228,216,.12)',color:'#00E5FF',fontSize:12,fontWeight:300,cursor:'pointer',marginBottom:14,transition:'all .2s'}}
                            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(0,229,255,.4)';(e.currentTarget as HTMLElement).style.background='rgba(0,229,255,.04)'}}
                            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(232,228,216,.12)';(e.currentTarget as HTMLElement).style.background='transparent'}}
                          >{step.link.text} →</div>
                        )}
                        {step.copies&&step.copies.map((copy,ci)=>(
                          <div key={ci} onClick={()=>copyText(copy.value)} style={{background:'#0B0D14',border:`1px solid ${copied===copy.value?'rgba(61,214,140,.25)':'rgba(232,228,216,.08)'}`,padding:'10px 14px',marginBottom:10,display:'flex',alignItems:'center',gap:12,cursor:'pointer',transition:'all .2s'}}
                            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(0,229,255,.2)'}}
                            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor=copied===copy.value?'rgba(61,214,140,.25)':'rgba(232,228,216,.08)'}}
                          >
                            <div style={{flex:1}}>
                              <div style={{fontFamily:MONO,fontSize:7,letterSpacing:'.12em',color:'rgba(232,228,216,.25)',marginBottom:3,textTransform:'uppercase'}}>{copy.label}</div>
                              <div style={{fontFamily:MONO,fontSize:11,color:'#00E5FF',letterSpacing:'.04em'}}>{copy.value}</div>
                            </div>
                            <div style={{fontFamily:MONO,fontSize:8,letterSpacing:'.14em',textTransform:'uppercase',padding:'4px 8px',border:`1px solid ${copied===copy.value?'rgba(61,214,140,.4)':'rgba(232,228,216,.1)'}`,color:copied===copy.value?'#3DD68C':'rgba(232,228,216,.3)',transition:'all .2s',flexShrink:0}}>{copied===copy.value?'Copied':'Copy'}</div>
                          </div>
                        ))}
                        <button onClick={()=>confirmStep(currentAct,si)} style={{display:'flex',alignItems:'center',gap:8,padding:'10px 22px',background:'transparent',border:'1px solid rgba(232,228,216,.12)',color:'rgba(232,228,216,.5)',fontFamily:SANS,fontSize:12,fontWeight:400,letterSpacing:'.04em',cursor:'pointer',marginTop:4,transition:'all .25s'}}
                          onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor='rgba(61,214,140,.4)';el.style.color='#3DD68C';el.style.background='rgba(61,214,140,.05)'}}
                          onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor='rgba(232,228,216,.12)';el.style.color='rgba(232,228,216,.5)';el.style.background='transparent'}}
                        >
                          <div style={{width:14,height:14,borderRadius:'50%',border:'1px solid currentColor',display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,flexShrink:0}}/>
                          {step.confirm}
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}

              {actProg.length===act.steps.length&&actProg.every(Boolean)&&(
                <div style={{background:'rgba(61,214,140,.06)',border:'1px solid rgba(61,214,140,.15)',padding:'20px 24px',display:'flex',alignItems:'center',gap:16,marginTop:8,animation:'fadeIn .4s ease'}}>
                  <div style={{width:36,height:36,borderRadius:'50%',background:'#3DD68C',display:'flex',alignItems:'center',justifyContent:'center',color:'#0B0D14',fontSize:16,fontWeight:600,flexShrink:0}}>✓</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:500,color:'#3DD68C',marginBottom:3}}>Act {act.num} complete.</div>
                    <div style={{fontSize:12,fontWeight:300,color:'rgba(61,214,140,.5)'}}>{currentAct===ACTS.length-1?'You are done. Your product is live.':'Ready for the next act.'}</div>
                  </div>
                  {currentAct<ACTS.length-1&&(
                    <button onClick={()=>setCurrentAct(currentAct+1)} style={{padding:'9px 20px',background:'#3DD68C',color:'#0B0D14',fontSize:12,fontWeight:500,letterSpacing:'.06em',border:'none',cursor:'pointer',flexShrink:0,transition:'all .22s'}}
                      onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.opacity='.85'}}
                      onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.opacity='1'}}
                    >Next act →</button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}



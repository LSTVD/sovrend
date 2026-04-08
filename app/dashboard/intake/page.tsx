"use client"
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const MONO = '"JetBrains Mono", monospace'
const SERIF = '"Fraunces", serif'
const SANS = '"DM Sans", sans-serif'

const QUESTIONS = [
  { cipher:"Tell me what you are building and what it does. Talk to me like you would a friend — not a pitch, just what it is.", placeholder:"It is a platform for...", hint:null },
  { cipher:"What makes yours different from everything else like it? The one thing only you can say.", placeholder:"Unlike everything else out there...", hint:null },
  { cipher:"Who is your customer and what are they feeling the moment before they find you?", placeholder:"They are the kind of person who...", hint:null },
  { cipher:"Describe the look and feel in three words. Colors, moods, references — anything goes.", placeholder:"Dark, cinematic, restrained...", hint:"Examples: warm editorial minimal — bold technical data — clean luxury premium — moody atmospheric artistic" },
  { cipher:"What should this never look like? What would make you cringe if you saw it?", placeholder:"Never generic, never cookie cutter...", hint:null }
]

const RESPONSES = [
  "Good. I have the foundation.",
  "That is the differentiator. Locked.",
  "I know exactly who we are building for.",
  "Visual world locked. I know what this feels like.",
  "Perfect. I have everything I need."
]

export default function IntakePage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({ q1:'', q2:'', q3:'', q4:'', q5:'' })
  const [current, setCurrent] = useState('')
  const [showResponse, setShowResponse] = useState(false)
  const [displayedQ, setDisplayedQ] = useState('')
  const [typing, setTyping] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const typingRef = useRef<any>(null)

  useEffect(() => {
    if (step < 1 || step > 5) return
    const q = QUESTIONS[step-1].cipher
    setDisplayedQ('')
    setTyping(true)
    let i = 0
    if (typingRef.current) clearInterval(typingRef.current)
    typingRef.current = setInterval(() => {
      if (i < q.length) { setDisplayedQ(q.slice(0, i+1)); i++ }
      else { setTyping(false); clearInterval(typingRef.current); setTimeout(() => inputRef.current?.focus(), 100) }
    }, 16)
    return () => clearInterval(typingRef.current)
  }, [step])

  const submit = () => {
    if (!current.trim()) return
    const key = `q${step}` as keyof typeof answers
    const na = { ...answers, [key]: current.trim() }
    setAnswers(na)
    setShowResponse(true)
    setCurrent('')
    setTimeout(() => {
      setShowResponse(false)
      if (step === 5) {
        setStep(6)
        const brief = `${na.q1}. What makes it different: ${na.q2}. Customer: ${na.q3}. Aesthetic: ${na.q4}. Avoid: ${na.q5}.`
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('sovrend_brief', brief)
            localStorage.setItem('sovrend_intake', JSON.stringify(na))
          }
          router.push('/dashboard')
        }, 2200)
      } else {
        setStep(step + 1)
      }
    }, 1100)
  }

  const pct = step === 0 ? 0 : step >= 6 ? 100 : ((step-1)/5)*100

  return (
    <div style={{minHeight:'100vh',background:'#0B0D14',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:SANS,color:'#E8E4D8',position:'relative',overflow:'hidden'}}>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#0B0D14;overflow:hidden}
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,300&family=DM+Sans:wght@200;300;400;500&family=JetBrains+Mono:wght@300;400&display=swap');
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:rgba(232,228,216,.1)}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        textarea::placeholder{color:rgba(232,228,216,.2)}
        body::after{content:"";position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.008) 2px,rgba(0,0,0,.008) 3px);pointer-events:none;z-index:9999}
      `}</style>

      <div style={{position:'fixed',inset:0,backgroundImage:'linear-gradient(rgba(0,229,255,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,.015) 1px,transparent 1px)',backgroundSize:'60px 60px',pointerEvents:'none'}}/>

      <div style={{position:'fixed',top:20,left:24,display:'flex',alignItems:'center',gap:8,cursor:'pointer',zIndex:10}} onClick={()=>router.push('/dashboard')}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:2,width:14}}>
          {[0,1,2,3,4,5,6,7,8].map(i=>(
            <div key={i} style={{width:3,height:3,border:`.5px solid ${i===4?'#FF6B00':'rgba(0,229,255,.25)'}`,background:i===4?'#FF6B00':'transparent'}}/>
          ))}
        </div>
        <span style={{fontFamily:MONO,fontSize:11,letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(232,228,216,.35)'}}>← Dashboard</span>
      </div>

      <div style={{width:'100%',maxWidth:560,padding:'0 24px',animation:'fadeUp .6s ease',position:'relative',zIndex:1}}>

        {step === 0 && (
          <div style={{textAlign:'center'}}>
            <div style={{fontFamily:MONO,fontSize:8,letterSpacing:'.26em',textTransform:'uppercase',color:'rgba(0,229,255,.45)',display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:20}}>
              <div style={{width:20,height:1,background:'rgba(0,229,255,.3)'}}/>
              Cipher · Brief Intelligence
              <div style={{width:20,height:1,background:'rgba(0,229,255,.3)'}}/>
            </div>
            <div style={{fontFamily:SERIF,fontStyle:'italic',fontSize:'clamp(28px,5vw,42px)',fontWeight:300,color:'#E8E4D8',letterSpacing:'-.03em',lineHeight:1.05,marginBottom:14}}>
              Before I build —<br/>let me understand it.
            </div>
            <div style={{fontSize:14,fontWeight:300,color:'rgba(232,228,216,.45)',lineHeight:1.75,maxWidth:420,margin:'0 auto 36px'}}>
              Five questions. Two minutes. The difference between something that looks like everyone else and something that looks like only you.
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:10,maxWidth:340,margin:'0 auto'}}>
              <button onClick={()=>setStep(1)} style={{padding:'14px',background:'#00E5FF',color:'#0B0D14',fontFamily:MONO,fontSize:10,letterSpacing:'.16em',textTransform:'uppercase',border:'none',cursor:'pointer',transition:'all .22s'}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow='0 0 28px rgba(0,229,255,.3)'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow='none'}}>
                Start the brief →
              </button>
              <button onClick={()=>router.push('/dashboard')} style={{padding:'11px',background:'transparent',color:'rgba(232,228,216,.25)',fontFamily:MONO,fontSize:9,letterSpacing:'.12em',textTransform:'uppercase',border:'1px solid rgba(232,228,216,.08)',cursor:'pointer',transition:'color .2s'}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color='rgba(232,228,216,.5)'}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color='rgba(232,228,216,.25)'}}>
                I know what I want — skip to prompt
              </button>
            </div>
          </div>
        )}

        {step >= 1 && step <= 5 && (
          <div>
            <div style={{marginBottom:28}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                <span style={{fontFamily:MONO,fontSize:8,letterSpacing:'.16em',textTransform:'uppercase',color:'rgba(0,229,255,.35)'}}>Question {step} of 5</span>
                <span style={{fontFamily:MONO,fontSize:8,color:'rgba(232,228,216,.2)'}}>{Math.round(pct)}%</span>
              </div>
              <div style={{height:1,background:'rgba(232,228,216,.06)'}}>
                <div style={{height:'100%',background:'#00E5FF',width:pct+'%',transition:'width .5s cubic-bezier(.16,1,.3,1)'}}/>
              </div>
            </div>

            {showResponse && step > 1 && (
              <div style={{display:'flex',gap:10,marginBottom:20,animation:'fadeIn .3s ease'}}>
                <div style={{width:22,height:22,border:'1px solid rgba(0,229,255,.25)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2}}>
                  <div style={{width:5,height:5,background:'#00E5FF',borderRadius:'50%'}}/>
                </div>
                <div style={{fontSize:13,fontWeight:300,color:'rgba(0,229,255,.6)',fontStyle:'italic',lineHeight:1.65,paddingTop:2}}>
                  {RESPONSES[step-2]}
                </div>
              </div>
            )}

            {!showResponse && (
              <>
                <div style={{display:'flex',gap:10,marginBottom:16}}>
                  <div style={{width:22,height:22,border:'1px solid rgba(0,229,255,.25)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2}}>
                    <div style={{width:5,height:5,background:'#00E5FF',borderRadius:'50%',animation:typing?'blink .6s infinite':'none'}}/>
                  </div>
                  <div style={{fontSize:15,fontWeight:300,color:'#E8E4D8',lineHeight:1.72,minHeight:52}}>
                    {displayedQ}
                    {typing && <span style={{color:'#00E5FF',animation:'blink .7s infinite'}}>|</span>}
                  </div>
                </div>

                {QUESTIONS[step-1].hint && (
                  <div style={{paddingLeft:32,marginBottom:12}}>
                    <span style={{fontFamily:MONO,fontSize:8,letterSpacing:'.08em',color:'rgba(232,228,216,.2)'}}>{QUESTIONS[step-1].hint}</span>
                  </div>
                )}

                <div style={{paddingLeft:32}}>
                  <textarea
                    ref={inputRef}
                    value={current}
                    onChange={e=>setCurrent(e.target.value)}
                    onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submit()}}}
                    placeholder={QUESTIONS[step-1].placeholder}
                    style={{width:'100%',background:'rgba(232,228,216,.03)',border:'1px solid rgba(232,228,216,.08)',padding:'12px 14px',color:'#E8E4D8',fontSize:14,fontWeight:300,fontFamily:SANS,lineHeight:1.72,resize:'none',outline:'none',minHeight:90,transition:'border-color .2s'}}
                    onFocus={e=>{e.currentTarget.style.borderColor='rgba(0,229,255,.2)'}}
                    onBlur={e=>{e.currentTarget.style.borderColor='rgba(232,228,216,.08)'}}
                  />
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:8}}>
                    <span style={{fontFamily:MONO,fontSize:7,letterSpacing:'.1em',color:'rgba(232,228,216,.15)'}}>Enter to continue · Shift+Enter for new line</span>
                    <button onClick={submit} disabled={!current.trim()} style={{padding:'9px 20px',background:current.trim()?'#00E5FF':'rgba(232,228,216,.07)',color:current.trim()?'#0B0D14':'rgba(232,228,216,.15)',fontFamily:MONO,fontSize:9,letterSpacing:'.14em',textTransform:'uppercase',border:'none',cursor:current.trim()?'pointer':'not-allowed',transition:'all .2s'}}>
                      {step===5?'Build it →':'Continue →'}
                    </button>
                  </div>
                </div>

                <div style={{display:'flex',gap:5,justifyContent:'center',paddingTop:24}}>
                  {[1,2,3,4,5].map(i=>(
                    <div key={i} style={{width:i===step?14:5,height:5,borderRadius:3,background:i<step?'#3DD68C':i===step?'#00E5FF':'rgba(232,228,216,.1)',transition:'all .3s cubic-bezier(.16,1,.3,1)'}}/>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {step === 6 && (
          <div style={{textAlign:'center'}}>
            <div style={{width:40,height:40,border:'1px solid rgba(0,229,255,.2)',borderTop:'1px solid #00E5FF',borderRadius:'50%',animation:'spin 1s linear infinite',margin:'0 auto 20px'}}/>
            <div style={{fontFamily:SERIF,fontStyle:'italic',fontSize:24,fontWeight:300,color:'#E8E4D8',marginBottom:6}}>Building your brief.</div>
            <div style={{fontFamily:MONO,fontSize:9,letterSpacing:'.16em',textTransform:'uppercase',color:'rgba(0,229,255,.4)',marginBottom:28}}>Cipher is thinking...</div>
            <div style={{textAlign:'left',maxWidth:400,margin:'0 auto'}}>
              {Object.entries(answers).filter(([,v])=>v).map(([k,v],i)=>(
                <div key={k} style={{display:'flex',gap:10,padding:'7px 0',borderBottom:'1px solid rgba(232,228,216,.04)',animation:'fadeUp .4s ease',animationDelay:`${i*0.08}s`,animationFillMode:'both',opacity:0}}>
                  <span style={{fontFamily:MONO,fontSize:8,color:'rgba(0,229,255,.3)',flexShrink:0,paddingTop:2}}>0{i+1}</span>
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

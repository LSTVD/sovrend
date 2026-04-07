"use client"
import { useState, useEffect, useRef } from 'react'

const MONO = '"JetBrains Mono", monospace'
const SERIF = '"Fraunces", serif'
const SANS = '"DM Sans", sans-serif'

interface IntakeAnswer { q1:string; q2:string; q3:string; q4:string; q5:string }
interface Props { onComplete:(prompt:string,answers:IntakeAnswer)=>void; onSkip:()=>void }

const QUESTIONS = [
  { id:'q1', cipher:"Tell me what you are building and what it does. Talk to me like you would a friend — not a pitch, just what it is.", placeholder:"It is a platform for...", hint:null },
  { id:'q2', cipher:"What makes yours different from everything else like it? The one thing only you can say.", placeholder:"Unlike everything else out there...", hint:null },
  { id:'q3', cipher:"Who is your customer and what are they feeling the moment before they find you?", placeholder:"They are the kind of person who...", hint:null },
  { id:'q4', cipher:"Describe the look and feel in three words. Colors, moods, references — anything goes.", placeholder:"Dark, cinematic, restrained...", hint:"Examples: warm editorial minimal — bold technical data — clean luxury premium — moody atmospheric artistic" },
  { id:'q5', cipher:"What should this never look like? What would make you cringe?", placeholder:"Never generic, never...", hint:null }
]

const RESPONSES = [
  "Good. I have the foundation.",
  "That is the differentiator. Locked.",
  "I know exactly who we are building for.",
  "Visual world is locked. I know what this feels like.",
  "Perfect. I have everything I need to build your brief."
]

export default function IntakeFlow({ onComplete, onSkip }: Props) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<IntakeAnswer>({ q1:"", q2:"", q3:"", q4:"", q5:"" })
  const [current, setCurrent] = useState("")
  const [showResponse, setShowResponse] = useState(false)
  const [typing, setTyping] = useState(false)
  const [displayedQ, setDisplayedQ] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (step < 1 || step > 5) return
    const q = QUESTIONS[step-1].cipher
    setDisplayedQ("")
    setTyping(true)
    let i = 0
    const t = setInterval(() => {
      if (i < q.length) { setDisplayedQ(q.slice(0, i+1)); i++ }
      else { setTyping(false); clearInterval(t); setTimeout(() => inputRef.current?.focus(), 100) }
    }, 16)
    return () => clearInterval(t)
  }, [step])

  const submit = () => {
    if (!current.trim()) return
    const key = ("q" + step) as keyof IntakeAnswer
    const na = { ...answers, [key]: current.trim() }
    setAnswers(na)
    setShowResponse(true)
    setCurrent("")
    setTimeout(() => {
      setShowResponse(false)
      if (step === 5) {
        setStep(6)
        setTimeout(() => {
          const p = `${na.q1}. Differentiator: ${na.q2}. Customer: ${na.q3}. Aesthetic: ${na.q4}. Avoid: ${na.q5}.`
          onComplete(p, na)
        }, 2200)
      } else {
        setStep(step + 1)
      }
    }, 1100)
  }

  const pct = step === 0 ? 0 : step >= 6 ? 100 : ((step-1)/5)*100

  const s: React.CSSProperties = {
    display:"flex", flexDirection:"column", height:"100%",
    background:"#0B0D14", fontFamily:SANS
  }

  if (step === 0) return (
    <div style={{...s, alignItems:"center", justifyContent:"center", padding:"40px 32px", textAlign:"center"}}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
      <div style={{animation:"fadeIn .6s ease", width:"100%", maxWidth:400}}>
        <div style={{fontFamily:MONO,fontSize:9,letterSpacing:".26em",textTransform:"uppercase",color:"rgba(0,229,255,.45)",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <div style={{width:14,height:1,background:"rgba(0,229,255,.45)"}}/>Cipher · Brief Intelligence<div style={{width:14,height:1,background:"rgba(0,229,255,.45)"}}/>
        </div>
        <div style={{fontFamily:SERIF,fontStyle:"italic",fontSize:26,fontWeight:300,color:"#E8E4D8",letterSpacing:"-.03em",lineHeight:1.1,marginBottom:12}}>
          Before I build —<br/>let me understand it.
        </div>
        <div style={{fontSize:13,fontWeight:300,color:"rgba(232,228,216,.45)",lineHeight:1.72,marginBottom:28}}>
          Five questions. Two minutes. The difference between something that looks like everyone else and something that looks like only you.
        </div>
        <button onClick={()=>setStep(1)} style={{width:"100%",padding:"13px",background:"#00E5FF",color:"#0B0D14",fontFamily:MONO,fontSize:10,letterSpacing:".14em",textTransform:"uppercase",border:"none",cursor:"pointer",marginBottom:8,transition:"all .2s"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.boxShadow="0 0 24px rgba(0,229,255,.3)"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.boxShadow="none"}}>
          Start the brief →
        </button>
        <button onClick={onSkip} style={{width:"100%",padding:"10px",background:"transparent",color:"rgba(232,228,216,.25)",fontFamily:MONO,fontSize:9,letterSpacing:".12em",textTransform:"uppercase",border:"1px solid rgba(232,228,216,.07)",cursor:"pointer",transition:"color .2s"}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="rgba(232,228,216,.45)"}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color="rgba(232,228,216,.25)"}}>
          Skip — write my own prompt
        </button>
      </div>
    </div>
  )

  if (step === 6) return (
    <div style={{...s, alignItems:"center", justifyContent:"center", padding:40, textAlign:"center"}}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
      <div style={{width:40,height:40,border:"1px solid rgba(0,229,255,.25)",borderTop:"1px solid #00E5FF",borderRadius:"50%",animation:"spin 1s linear infinite",marginBottom:20}}/>
      <div style={{fontFamily:SERIF,fontStyle:"italic",fontSize:20,fontWeight:300,color:"#E8E4D8",marginBottom:6}}>Building your brief.</div>
      <div style={{fontFamily:MONO,fontSize:9,letterSpacing:".14em",color:"rgba(0,229,255,.4)",textTransform:"uppercase",marginBottom:24}}>Cipher is thinking...</div>
      <div style={{width:"100%",maxWidth:380}}>
        {Object.entries(answers).filter(([,v])=>v).map(([k,v],i)=>(
          <div key={k} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:"1px solid rgba(232,228,216,.04)",textAlign:"left",animation:`fadeUp .4s ${i*0.08}s ease both`}}>
            <span style={{fontFamily:MONO,fontSize:8,color:"rgba(0,229,255,.35)",flexShrink:0,paddingTop:2}}>0{i+1}</span>
            <span style={{fontSize:12,fontWeight:300,color:"rgba(232,228,216,.4)",lineHeight:1.6}}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  )

  const q = QUESTIONS[step-1]
  return (
    <div style={{...s, padding:"20px 24px"}}>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}} @keyframes fadeIn{from{opacity:0}to{opacity:1}} textarea::placeholder{color:rgba(232,228,216,.2)}`}</style>

      {/* Progress */}
      <div style={{marginBottom:20,flexShrink:0}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
          <span style={{fontFamily:MONO,fontSize:8,letterSpacing:".16em",textTransform:"uppercase",color:"rgba(0,229,255,.35)"}}>Question {step} of 5</span>
          <span style={{fontFamily:MONO,fontSize:8,color:"rgba(232,228,216,.2)"}}>{Math.round(pct)}%</span>
        </div>
        <div style={{height:1,background:"rgba(232,228,216,.06)"}}>
          <div style={{height:"100%",background:"#00E5FF",width:pct+"%",transition:"width .5s cubic-bezier(.16,1,.3,1)"}}/>
        </div>
      </div>

      {/* Cipher response */}
      {showResponse && step > 1 && (
        <div style={{display:"flex",gap:10,marginBottom:14,animation:"fadeIn .3s ease",flexShrink:0}}>
          <div style={{width:22,height:22,border:"1px solid rgba(0,229,255,.25)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <div style={{width:5,height:5,background:"#00E5FF",borderRadius:"50%"}}/>
          </div>
          <div style={{fontSize:13,fontWeight:300,color:"rgba(0,229,255,.6)",fontStyle:"italic",lineHeight:1.65,paddingTop:2}}>
            {RESPONSES[step-2]}
          </div>
        </div>
      )}

      {!showResponse && (
        <>
          {/* Question */}
          <div style={{display:"flex",gap:10,marginBottom:16,flexShrink:0}}>
            <div style={{width:22,height:22,border:"1px solid rgba(0,229,255,.25)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
              <div style={{width:5,height:5,background:"#00E5FF",borderRadius:"50%",animation:typing?"blink .6s infinite":"none"}}/>
            </div>
            <div style={{fontSize:14,fontWeight:300,color:"#E8E4D8",lineHeight:1.72,minHeight:50}}>
              {displayedQ}
              {typing && <span style={{color:"#00E5FF",animation:"blink .7s infinite"}}>|</span>}
            </div>
          </div>

          {q.hint && (
            <div style={{paddingLeft:32,marginBottom:10,flexShrink:0}}>
              <span style={{fontFamily:MONO,fontSize:8,letterSpacing:".08em",color:"rgba(232,228,216,.2)"}}>{q.hint}</span>
            </div>
          )}

          {/* Input area */}
          <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
            <textarea
              ref={inputRef}
              value={current}
              onChange={e=>setCurrent(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submit()}}}
              placeholder={q.placeholder}
              style={{flex:1,background:"rgba(232,228,216,.03)",border:"1px solid rgba(232,228,216,.07)",padding:12,color:"#E8E4D8",fontSize:13,fontWeight:300,fontFamily:SANS,lineHeight:1.72,resize:"none",outline:"none",transition:"border-color .2s",borderRadius:0}}
              onFocus={e=>{e.currentTarget.style.borderColor="rgba(0,229,255,.2)"}}
              onBlur={e=>{e.currentTarget.style.borderColor="rgba(232,228,216,.07)"}}
            />
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
              <span style={{fontFamily:MONO,fontSize:8,letterSpacing:".1em",color:"rgba(232,228,216,.18)"}}>Enter to continue · Shift+Enter for new line</span>
              <button onClick={submit} disabled={!current.trim()} style={{padding:"8px 18px",background:current.trim()?"#00E5FF":"rgba(232,228,216,.07)",color:current.trim()?"#0B0D14":"rgba(232,228,216,.18)",fontFamily:MONO,fontSize:9,letterSpacing:".14em",textTransform:"uppercase",border:"none",cursor:current.trim()?"pointer":"not-allowed",transition:"all .2s"}}>
                {step===5 ? "Build it →" : "Continue →"}
              </button>
            </div>
          </div>

          {/* Dots */}
          <div style={{display:"flex",gap:5,justifyContent:"center",paddingTop:12,flexShrink:0}}>
            {[1,2,3,4,5].map(i=>(
              <div key={i} style={{width:i===step?14:5,height:5,borderRadius:3,background:i<step?"#3DD68C":i===step?"#00E5FF":"rgba(232,228,216,.1)",transition:"all .3s cubic-bezier(.16,1,.3,1)"}}/>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

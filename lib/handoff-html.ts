// @ts-nocheck
function buildHandoffHtml(projName:string,buildScore:number,h:any,isArch:boolean):string{
  const color=buildScore>=80?'#00E5FF':buildScore>=60?'#FFE600':'#FF6A00'
  const circ=2*Math.PI*50
  const offset=circ-(buildScore/100)*circ
  const gridSvg=[0,1,2].map(r=>[0,1,2].map(c=>{const g=36*.05,sq=(36-g*2)/3,x=c*(sq+g),y=r*(sq+g);return r===1&&c===1?'<rect x="'+x+'" y="'+y+'" width="'+sq+'" height="'+sq+'" fill="#FF8C00"/>':'<rect x="'+x+'" y="'+y+'" width="'+sq+'" height="'+sq+'" fill="none" stroke="#00E5FF" stroke-width="1.5"/>'}).join('')).join('')
  return '<!DOCTYPE html><html><head><meta charset="utf-8"><title>'+projName+' — Developer Handoff | SOVREND<\/title>'+
'<style>@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap");'+
'*{margin:0;padding:0;box-sizing:border-box}body{background:#000308;color:#F0F0FF;font-family:"Share Tech Mono",monospace;padding:0}'+
'.cover{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:linear-gradient(180deg,#000308 0%,#000a14 50%,#000308 100%);border-bottom:1px solid rgba(0,229,255,.1);position:relative;overflow:hidden}'+
'.cover h1{font-family:"Orbitron",sans-serif;font-size:36px;font-weight:900;letter-spacing:.15em;color:#F0F0FF;text-shadow:0 0 40px rgba(240,240,255,.1)}'+
'.cover .sub{font-size:14px;color:rgba(0,229,255,.6);margin-top:12px;letter-spacing:.1em}.cover .score-ring{margin:40px 0 20px}'+
'.cover .meta{font-size:13px;color:rgba(195,200,215,.5);margin-top:24px}.cover .badge{display:inline-block;font-family:"Orbitron",sans-serif;font-size:11px;letter-spacing:.2em;padding:8px 20px;border:1px solid rgba(0,229,255,.2);color:#00E5FF;margin-top:16px}'+
'.page{max-width:860px;margin:0 auto;padding:60px 48px}.section{margin-bottom:56px}'+
'.section h2{font-family:"Orbitron",sans-serif;font-size:14px;letter-spacing:.3em;color:#00E5FF;border-bottom:1px solid rgba(0,229,255,.15);padding-bottom:10px;margin-bottom:24px}'+
'.card{background:rgba(0,229,255,.03);border:1px solid rgba(0,229,255,.1);padding:20px;margin-bottom:10px}.card-amber{background:rgba(255,106,0,.03);border:1px solid rgba(255,106,0,.1)}.card-green{background:rgba(0,255,65,.03);border:1px solid rgba(0,255,65,.1)}.card-red{background:rgba(255,49,49,.03);border:1px solid rgba(255,49,49,.1)}'+
'.label{font-family:"Orbitron",sans-serif;font-size:10px;letter-spacing:.15em;color:rgba(0,229,255,.6);margin-bottom:6px}.value{font-size:16px;color:rgba(240,240,255,.85);line-height:1.7}'+
'.tag{display:inline-block;font-family:"Orbitron",sans-serif;font-size:11px;letter-spacing:.1em;padding:6px 14px;margin:3px;border:1px solid rgba(0,229,255,.15);color:rgba(0,229,255,.7)}.tag-wired{border-color:rgba(0,229,255,.3);color:#00E5FF;background:rgba(0,229,255,.06)}.tag-notwired{border-color:rgba(255,106,0,.3);color:#FF6A00;background:rgba(255,106,0,.06)}'+
'.priority-HIGH{color:#FF3131;border-left:4px solid #FF3131}.priority-MEDIUM{color:#FFE600;border-left:4px solid #FFE600}.priority-LOW{color:#00E5FF;border-left:4px solid #00E5FF}'+
'.tree{padding-left:24px;border-left:2px solid rgba(0,229,255,.15)}.tree-item{padding:12px 0;border-bottom:1px solid rgba(0,229,255,.05)}.tree-item:last-child{border-bottom:none}'+
'.tree-name{font-size:16px;color:#FF6A00;font-weight:600}.tree-purpose{font-size:14px;color:rgba(195,200,215,.7);margin-top:4px;line-height:1.6}.tree-props{font-size:13px;color:rgba(0,229,255,.5);margin-top:4px;font-style:italic}'+
'.footer{text-align:center;padding:48px;border-top:1px solid rgba(0,229,255,.07);margin-top:48px}.footer span{font-family:"Orbitron",sans-serif;font-size:10px;letter-spacing:.2em;color:rgba(0,229,255,.3)}'+
'@media print{body{background:#fff;color:#111}.cover{background:#fff;border-bottom:2px solid #00E5FF}.cover h1{color:#111;text-shadow:none}.cover .sub{color:#00E5FF}.card,.card-amber,.card-green,.card-red{background:#f8f8f8;border-color:#ddd}.section h2{color:#00E5FF;border-bottom-color:#00E5FF}.label{color:#666}.value{color:#222}.tag{border-color:#ccc;color:#444}.footer span{color:#999}}'+
'<\/style><\/head><body>'+
'<div class="cover">'+(isArch?'<div style="font-family:Orbitron,sans-serif;font-size:8px;letter-spacing:.3em;color:rgba(255,106,0,.5);margin-bottom:20px">ARCHITECT EDITION<\/div>':'')+
'<svg width="36" height="36" viewBox="0 0 36 36">'+gridSvg+'<\/svg>'+
'<h1 style="margin-top:20px">'+projName.toUpperCase()+'<\/h1><div class="sub">DEVELOPER HANDOFF BRIEF<\/div>'+
'<div class="score-ring"><svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="none" stroke="rgba(240,240,255,.06)" stroke-width="5"/><circle cx="60" cy="60" r="50" fill="none" stroke="'+color+'" stroke-width="5" stroke-linecap="round" stroke-dasharray="'+circ+'" stroke-dashoffset="'+offset+'" transform="rotate(-90 60 60)"/><text x="60" y="56" text-anchor="middle" fill="'+color+'" font-size="28" font-weight="900" font-family="Orbitron,sans-serif">'+buildScore+'<\/text><text x="60" y="72" text-anchor="middle" fill="rgba(240,240,255,.4)" font-size="9" font-family="Orbitron,sans-serif" letter-spacing=".15em">BUILD SCORE<\/text><\/svg><\/div>'+
'<div class="meta">Generated '+new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})+' · Powered by SOVREND<\/div>'+
'<div class="badge">'+(isArch?'ARCHITECT':'BUILDER')+' TIER<\/div><\/div>'+
'<div class="page">'+
'<div class="section"><h2>OVERVIEW<\/h2><div class="card"><div class="value">'+(h.summary||'No summary available.')+'<\/div><\/div><\/div>'+
(h.architecture?'<div class="section"><h2>ARCHITECTURE<\/h2><div class="card"><div class="label">FRAMEWORK<\/div><div class="value">'+(h.architecture.framework||'React + TypeScript + Tailwind')+'<\/div><\/div><div class="card"><div class="label">PATTERN<\/div><div class="value">'+(h.architecture.pattern||'—')+'<\/div><\/div><div class="card"><div class="label">STATE MANAGEMENT<\/div><div class="value">'+(h.architecture.stateManagement||'—')+'<\/div><\/div><div class="card"><div class="label">DATA FLOW<\/div><div class="value">'+(h.architecture.dataFlow||'—')+'<\/div><\/div><\/div>':'')+
'<div class="section"><h2>WHAT\'S WIRED<\/h2><div style="display:flex;flex-wrap:wrap;gap:4px">'+((h.wired||[]).map((w:string)=>'<span class="tag tag-wired">'+w+'<\/span>').join('')||'<span class="value">No wired features detected.<\/span>')+'<\/div><\/div>'+
'<div class="section"><h2>WHAT\'S NOT WIRED<\/h2><div style="display:flex;flex-wrap:wrap;gap:4px">'+((h.notWired||[]).map((w:string)=>'<span class="tag tag-notwired">'+w+'<\/span>').join('')||'<span class="value">Everything appears functional.<\/span>')+'<\/div><\/div>'+
'<div class="section"><h2>NEXT STEPS<\/h2>'+((h.nextSteps||[]).map((s:any)=>'<div class="card priority-'+(s.priority||'MEDIUM')+'" style="padding-left:22px"><div class="label">'+(s.priority||'MEDIUM')+' PRIORITY<\/div><div class="value">'+(s.task||'')+'<\/div>'+(s.impact?'<div style="font-size:14px;color:rgba(0,229,255,.6);margin-top:6px;line-height:1.5">Unlocks: '+s.impact+'<\/div>':'')+'<\/div>').join('')||'<div class="card"><div class="value">No next steps identified.<\/div><\/div>')+'<\/div>'+
(isArch&&h.strategic?'<div class="section"><h2>STRATEGIC ANALYSIS<\/h2><div class="card card-amber"><div class="label">MARKET POSITION<\/div><div class="value">'+(h.strategic.marketPosition||'—')+'<\/div><\/div><div class="card card-green"><div class="label">MONETIZATION<\/div><div class="value">'+(h.strategic.monetization||'—')+'<\/div><\/div><div class="card"><div class="label">SCALABILITY<\/div><div class="value">'+(h.strategic.scalability||'—')+'<\/div><\/div><div class="card card-red"><div class="label">TECH DEBT<\/div><div class="value">'+(h.strategic.techDebt||'—')+'<\/div><\/div><\/div>':'')+
'<div class="footer"><span>GENERATED BY SOVREND · THE THOUGHT BECOMES THE THING<\/span><\/div><\/div><\/body><\/html>'
}


export { buildHandoffHtml }

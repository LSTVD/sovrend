'use client'
import { useEffect, useRef } from 'react'

function hz(X:CanvasRenderingContext2D,cx:number,cy:number,r:number,col:string,op:number,W:number,H:number){var g=X.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,'rgba('+col+','+op+')');g.addColorStop(1,'rgba(0,0,0,0)');X.fillStyle=g;X.fillRect(0,0,W,H)}
function lerp(a:number,b:number,t:number){return a+(b-a)*t}
var UI="'Orbitron',sans-serif"

export function ParticleForge(){
  var cRef=useRef<HTMLCanvasElement>(null)
  var t0Ref=useRef(0)
  var pRef=useRef<{x:number,y:number,vx:number,vy:number,tx:number,ty:number,r:number,c:string,ph:number}[]>([])
  useEffect(function(){
    var c=cRef.current;if(!c)return
    var X=c.getContext('2d')!;var W=0,H=0,raf=0
    var dpr=window.devicePixelRatio||1
    function rs(){var p=c!.parentElement;if(!p)return;var r=p.getBoundingClientRect();W=Math.floor(r.width);H=Math.floor(r.height);c!.width=W*dpr;c!.height=H*dpr;c!.style.width=W+'px';c!.style.height=H+'px';X.scale(dpr,dpr)}
    rs();window.addEventListener('resize',rs);t0Ref.current=performance.now();pRef.current=[]
    function draw(now:number){
      var p=Math.min((now-t0Ref.current)/18000,1);var cx=W/2,cy=H/2;var particles=pRef.current
      X.fillStyle=p>0.7?'rgba(0,3,8,0.08)':'rgba(0,3,8,0.04)';X.fillRect(0,0,W,H)
      var target=300*Math.min(p/0.15,1)
      while(particles.length<target){var angle=Math.random()*Math.PI*2;var dist=100+Math.random()*300;var rnd=Math.random();var col=rnd>0.6?'0,229,255':rnd>0.3?'255,107,0':'220,225,240';particles.push({x:cx+Math.cos(angle)*dist,y:cy+Math.sin(angle)*dist,vx:(Math.random()-0.5)*3,vy:(Math.random()-0.5)*3,tx:cx+(Math.random()-0.5)*60,ty:cy+(Math.random()-0.5)*60,r:0.5+Math.random()*2,c:col,ph:Math.random()*Math.PI*2})}
      var order=p<0.3?0:Math.min((p-0.3)/0.4,1);var fs=order*order
      for(var i=0;i<particles.length;i++){var q=particles[i];if(order<0.5){q.vx+=(Math.random()-0.5)*0.5*(1-order*2);q.vy+=(Math.random()-0.5)*0.5*(1-order*2);q.vx*=0.98;q.vy*=0.98}q.vx+=(q.tx-q.x)*fs*0.002;q.vy+=(q.ty-q.y)*fs*0.002;q.vx*=0.97;q.vy*=0.97;q.x+=q.vx;q.y+=q.vy;if(q.x<0)q.x=W;if(q.x>W)q.x=0;if(q.y<0)q.y=H;if(q.y>H)q.y=0;var pulse=Math.sin(now*0.003+q.ph)*0.3+0.7;var bop=0.15+order*0.35;X.beginPath();X.arc(q.x,q.y,q.r*pulse*(0.5+order*0.5),0,Math.PI*2);X.fillStyle='rgba('+q.c+','+(bop*pulse)+')';X.fill();if(q.r>1.2){X.beginPath();X.arc(q.x,q.y,q.r*3,0,Math.PI*2);X.fillStyle='rgba('+q.c+','+(0.02*pulse*order)+')';X.fill()}}
      if(p>0.3){var rp=Math.min((p-0.3)/0.2,1);var rc=['0,229,255','255,107,0','220,225,240'];for(var ring=0;ring<3;ring++){X.beginPath();X.arc(cx,cy,(40+ring*35)*rp,0,Math.PI*2);X.strokeStyle='rgba('+rc[ring]+','+(0.04*rp)+')';X.lineWidth=0.5;X.stroke()}}
      if(p>0.4){var wp=Math.min((p-0.4)/0.15,1);hz(X,cx,cy,80*wp,'255,107,0',0.04*wp,W,H);hz(X,cx,cy,40*wp,'255,160,60',0.03*wp,W,H)}
      if(p>0.55){var sp=Math.min((p-0.55)/0.2,1);X.strokeStyle='rgba(0,229,255,'+(0.06*sp)+')';X.lineWidth=0.5;for(var ring=0;ring<4;ring++){var r2=(30+ring*25)*sp;X.beginPath();for(var j=0;j<=6;j++){var a2=(j/6)*Math.PI*2-Math.PI/6;var hx=cx+Math.cos(a2)*r2,hy=cy+Math.sin(a2)*r2;if(j===0)X.moveTo(hx,hy);else X.lineTo(hx,hy)}X.stroke()}if(sp>0.3){var ip=(sp-0.3)/0.7;X.strokeStyle='rgba(255,107,0,'+(0.05*ip)+')';X.lineWidth=0.8;for(var ring=0;ring<2;ring++){var r2=(15+ring*12)*ip;X.beginPath();for(var j=0;j<=6;j++){var a2=(j/6)*Math.PI*2;var hx=cx+Math.cos(a2)*r2,hy=cy+Math.sin(a2)*r2;if(j===0)X.moveTo(hx,hy);else X.lineTo(hx,hy)}X.stroke()}}}
      if(p>0.78){var fp=Math.min((p-0.78)/0.14,1);X.fillStyle='rgba(0,3,8,'+(fp*0.02)+')';X.fillRect(0,0,W,H);var p2=Math.sin(now*0.004)*0.15+0.85;hz(X,cx,cy,120*fp*p2,'0,229,255',0.02*fp,W,H);hz(X,cx,cy,80*fp*p2,'255,107,0',0.015*fp,W,H)}
      if(p>0.93){var fp2=(p-0.93)/0.07;if(fp2<0.2){X.fillStyle='rgba(255,140,40,'+((0.2-fp2)*0.08)+')';X.fillRect(0,0,W,H)}}
      var vg=X.createRadialGradient(W/2,H/2,W*0.2,W/2,H/2,W*0.7);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,3,8,0.3)');X.fillStyle=vg;X.fillRect(0,0,W,H)
      raf=requestAnimationFrame(draw)};raf=requestAnimationFrame(draw)
    return function(){cancelAnimationFrame(raf);window.removeEventListener('resize',rs)}
  },[])
  return <div className="flex-1 flex flex-col" style={{background:'rgba(3,5,12,.9)',position:'relative',overflow:'hidden',minHeight:0}}><canvas ref={cRef} style={{position:'absolute',inset:0,width:'100%',height:'100%',display:'block'}}/><div className="absolute inset-0 flex flex-col items-center justify-end pb-8" style={{zIndex:1}}><span style={{fontFamily:UI,fontSize:9,letterSpacing:'.28em',color:'#00E5FF',opacity:0.6}}>ARCHITECTING</span></div></div>
}

export function Constellation(){
  var cRef=useRef<HTMLCanvasElement>(null)
  var t0Ref=useRef(0)
  var sRef=useRef<{x:number,y:number,r:number,br:number,ph:number,born:number}[]>([])
  useEffect(function(){
    var c=cRef.current;if(!c)return
    var X=c.getContext('2d')!;var W=0,H=0,raf=0
    var dpr=window.devicePixelRatio||1
    function rs(){var p=c!.parentElement;if(!p)return;var r=p.getBoundingClientRect();W=Math.floor(r.width);H=Math.floor(r.height);c!.width=W*dpr;c!.height=H*dpr;c!.style.width=W+'px';c!.style.height=H+'px';X.scale(dpr,dpr);init()}
    function init(){sRef.current=[];for(var i=0;i<120;i++){sRef.current.push({x:W/2+(Math.random()-0.5)*W*0.7,y:H/2+(Math.random()-0.5)*H*0.7,r:0.3+Math.random()*1.5,br:0.2+Math.random()*0.8,ph:Math.random()*Math.PI*2,born:0.05+Math.random()*0.5})}}
    rs();window.addEventListener('resize',rs);t0Ref.current=performance.now()
    function draw(now:number){
      var p=Math.min((now-t0Ref.current)/18000,1);var cx=W/2,cy=H/2;var stars=sRef.current
      X.fillStyle=p>0.88?'rgba(0,3,8,0.15)':'rgba(0,3,8,0.04)';X.fillRect(0,0,W,H)
      hz(X,cx*0.7,cy*0.6,W*0.5,'5,10,30',0.015*Math.min(p/0.1,1),W,H)
      hz(X,cx*1.3,cy*1.2,W*0.4,'10,5,25',0.01*Math.min(p/0.1,1),W,H)
      for(var i=0;i<stars.length;i++){var s=stars[i];if(p<s.born)continue;var age=Math.min((p-s.born)/0.1,1);var tw=Math.sin(now*0.003+s.ph)*0.3+0.7;X.beginPath();X.arc(s.x,s.y,s.r*age,0,Math.PI*2);X.fillStyle='rgba(200,220,255,'+(s.br*age*tw*0.6)+')';X.fill();X.beginPath();X.arc(s.x,s.y,s.r*4,0,Math.PI*2);X.fillStyle='rgba(0,229,255,'+(s.br*age*tw*0.03)+')';X.fill()}
      if(p>0.25){var cp=Math.min((p-0.25)/0.2,1);for(var i=0;i<stars.length;i++){if(p<stars[i].born)continue;for(var j=i+1;j<stars.length;j++){if(p<stars[j].born)continue;var dx=stars[i].x-stars[j].x,dy=stars[i].y-stars[j].y;var dist=Math.sqrt(dx*dx+dy*dy);if(dist<120){var op=(1-dist/120)*0.06*cp;X.strokeStyle='rgba(0,229,255,'+op+')';X.lineWidth=0.4;X.beginPath();X.moveTo(stars[i].x,stars[i].y);X.lineTo(stars[j].x,stars[j].y);X.stroke()}}}}
      if(p>0.4){var wp=Math.min((p-0.4)/0.15,1);var cls=[{x:cx-100,y:cy-60},{x:cx+80,y:cy+40},{x:cx,y:cy-100},{x:cx-60,y:cy+80},{x:cx+120,y:cy-20}];for(var i=0;i<cls.length;i++){var cl=cls[i];var pulse=Math.sin(now*0.004+cl.x*0.01)*0.3+0.7;hz(X,cl.x,cl.y,40*wp,'255,107,0',0.03*wp*pulse,W,H);X.beginPath();X.arc(cl.x,cl.y,3*wp,0,Math.PI*2);X.fillStyle='rgba(255,107,0,'+(0.4*wp*pulse)+')';X.fill()}}
      if(p>0.55){var sp=Math.min((p-0.55)/0.2,1);for(var i=0;i<stars.length-1;i+=3){if(p<stars[i].born||p<stars[i+1].born)continue;var a=stars[i],b=stars[i+1];var dx2=a.x-b.x,dy2=a.y-b.y;if(Math.sqrt(dx2*dx2+dy2*dy2)>120)continue;var phase=(now*0.002+i*0.7)%1;var px=lerp(a.x,b.x,phase),py=lerp(a.y,b.y,phase);X.beginPath();X.arc(px,py,1.5,0,Math.PI*2);var pc=i%2===0?'0,229,255':'255,107,0';X.fillStyle='rgba('+pc+','+(0.35*sp*(1-phase))+')';X.fill()}}
      if(p>0.78){var fp=Math.min((p-0.78)/0.14,1);hz(X,cx,cy,W*0.25*fp,'0,229,255',0.015*fp,W,H);X.fillStyle='rgba(0,3,8,'+(fp*0.02)+')';X.fillRect(0,0,W,H)}
      if(p>0.93){var fp2=(p-0.93)/0.07;if(fp2<0.2){X.fillStyle='rgba(0,229,255,'+((0.2-fp2)*0.06)+')';X.fillRect(0,0,W,H)}}
      var vg=X.createRadialGradient(W/2,H/2,W*0.2,W/2,H/2,W*0.72);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,3,8,0.3)');X.fillStyle=vg;X.fillRect(0,0,W,H)
      raf=requestAnimationFrame(draw)};raf=requestAnimationFrame(draw)
    return function(){cancelAnimationFrame(raf);window.removeEventListener('resize',rs)}
  },[])
  return <div className="flex-1 flex flex-col" style={{background:'rgba(3,5,12,.9)',position:'relative',overflow:'hidden',minHeight:0}}><canvas ref={cRef} style={{position:'absolute',inset:0,width:'100%',height:'100%',display:'block'}}/><div className="absolute inset-0 flex flex-col items-center justify-end pb-8" style={{zIndex:1}}><span style={{fontFamily:UI,fontSize:9,letterSpacing:'.28em',color:'#00E5FF',opacity:0.6}}>ARCHITECTING</span></div></div>
}

export function Nexus(){
  var cRef=useRef<HTMLCanvasElement>(null)
  var t0Ref=useRef(0)
  useEffect(function(){
    var c=cRef.current;if(!c)return
    var X=c.getContext('2d')!;var W=0,H=0,raf=0
    var dpr=window.devicePixelRatio||1
    function rs(){var p=c!.parentElement;if(!p)return;var r=p.getBoundingClientRect();W=Math.floor(r.width);H=Math.floor(r.height);c!.width=W*dpr;c!.height=H*dpr;c!.style.width=W+'px';c!.style.height=H+'px';X.scale(dpr,dpr)}
    rs();window.addEventListener('resize',rs);t0Ref.current=performance.now()
    function draw(now:number){
      var p=Math.min((now-t0Ref.current)/18000,1);var cx=W/2,cy=H/2;var eyeR=Math.min(W,H)*0.25
      X.fillStyle=p>0.88?'rgba(2,2,6,0.18)':'rgba(2,2,6,0.05)';X.fillRect(0,0,W,H)
      if(p<0.3){var ep=p/0.3;for(var ring=0;ring<12;ring++){var r2=eyeR*(0.3+ring*0.06)*ep;var hue=lerp(30,45,ring/12);var sat=lerp(200,140,ring/12);X.beginPath();X.arc(cx,cy,r2,0,Math.PI*2);X.strokeStyle='rgba('+Math.floor(sat)+','+Math.floor(hue*1.5)+','+Math.floor(hue*0.4)+','+((0.08-ring*0.005)*ep)+')';X.lineWidth=3-ring*0.2;X.stroke()}if(ep>0.3){var fp=(ep-0.3)/0.4;for(var i=0;i<60;i++){var angle=(i/60)*Math.PI*2+Math.sin(i*0.7)*0.1;var iR=eyeR*0.3*ep,oR=eyeR*0.85*ep;var wobble=Math.sin(i*3+now*0.002)*eyeR*0.02;X.beginPath();X.moveTo(cx+Math.cos(angle)*iR,cy+Math.sin(angle)*iR);X.lineTo(cx+Math.cos(angle)*(oR+wobble),cy+Math.sin(angle)*(oR+wobble));X.strokeStyle='rgba(180,100,30,'+(0.04*fp)+')';X.lineWidth=0.5;X.stroke()}}var pupR=eyeR*0.28*ep;var pg=X.createRadialGradient(cx,cy,0,cx,cy,pupR);pg.addColorStop(0,'rgba(0,0,0,'+(0.8*ep)+')');pg.addColorStop(0.7,'rgba(10,5,0,'+(0.6*ep)+')');pg.addColorStop(1,'rgba(40,20,5,'+(0.3*ep)+')');X.fillStyle=pg;X.beginPath();X.arc(cx,cy,pupR,0,Math.PI*2);X.fill();X.beginPath();X.arc(cx-pupR*0.3,cy-pupR*0.3,pupR*0.15,0,Math.PI*2);X.fillStyle='rgba(255,220,180,'+(0.2*ep)+')';X.fill();hz(X,cx,cy,eyeR*1.2,'200,100,30',0.02*ep,W,H)}
      if(p>0.18){var tp=Math.min((p-0.18)/0.22,1);for(var ring=0;ring<8;ring++){var r2=eyeR*(0.35+ring*0.08);var dl=10+ring*5;X.setLineDash([dl*tp,dl*(1-tp*0.5)]);X.beginPath();X.arc(cx,cy,r2,now*0.001*(ring%2===0?1:-1),now*0.001*(ring%2===0?1:-1)+Math.PI*2*tp);X.strokeStyle='rgba(0,229,255,'+((0.06-ring*0.006)*tp)+')';X.lineWidth=0.6;X.stroke()}X.setLineDash([]);if(tp>0.4){var rp=(tp-0.4)/0.6;for(var i=0;i<16;i++){var angle=(i/16)*Math.PI*2;var r1=eyeR*0.4,r2b=eyeR*(0.9+rp*0.3);X.beginPath();X.moveTo(cx+Math.cos(angle)*r1,cy+Math.sin(angle)*r1);X.lineTo(cx+Math.cos(angle)*r2b,cy+Math.sin(angle)*r2b);X.strokeStyle='rgba(0,229,255,'+(0.04*rp)+')';X.lineWidth=0.4;X.stroke();X.beginPath();X.arc(cx+Math.cos(angle)*r2b,cy+Math.sin(angle)*r2b,1.5,0,Math.PI*2);X.fillStyle='rgba(0,229,255,'+(0.15*rp)+')';X.fill()}}}
      if(p>0.3){var np=Math.min((p-0.3)/0.2,1);for(var i=0;i<24;i++){var angle=(i/24)*Math.PI*2+Math.sin(i*2)*0.2;var bR=eyeR*0.95;var px=cx+Math.cos(angle)*bR,py=cy+Math.sin(angle)*bR;X.beginPath();X.moveTo(px,py);for(var s=0;s<4*np;s++){var sa=angle+Math.sin(i*3+s*2)*0.5;var sl=30+s*20;px+=Math.cos(sa)*sl;py+=Math.sin(sa)*sl;X.lineTo(px,py)}X.strokeStyle='rgba(0,229,255,'+(0.04*np)+')';X.lineWidth=0.4;X.stroke()}}
      if(p>0.4){var wp=Math.min((p-0.4)/0.18,1);var pPhase=(now*0.003)%1;var pR=eyeR*0.3+pPhase*W*0.4*wp;X.beginPath();X.arc(cx,cy,pR,0,Math.PI*2);X.strokeStyle='rgba(255,140,40,'+((1-pPhase)*0.06*wp)+')';X.lineWidth=(1-pPhase)*2;X.stroke();hz(X,cx,cy,W*0.35*wp,'255,107,0',0.015*wp,W,H)}
      if(p>0.55){var sp=Math.min((p-0.55)/0.2,1);for(var i=0;i<40;i++){var angle=i*0.618*Math.PI*2+now*0.0003;var dist=eyeR*(1.2+Math.sin(i*1.3)*0.5)*sp;var dx=cx+Math.cos(angle)*dist,dy=cy+Math.sin(angle)*dist;var pulse=Math.sin(now*0.004+i)*0.3+0.7;X.beginPath();X.arc(dx,dy,1.2*pulse,0,Math.PI*2);var dc=i%3===0?'255,107,0':'0,229,255';X.fillStyle='rgba('+dc+','+(0.2*sp*pulse)+')';X.fill()}}
      if(p>0.78){var cp=Math.min((p-0.78)/0.14,1);X.fillStyle='rgba(2,2,6,'+(cp*0.04)+')';X.fillRect(0,0,W,H);var fR=4*(1-cp*0.5);X.beginPath();X.arc(cx,cy,fR,0,Math.PI*2);X.fillStyle='rgba(255,200,120,'+(0.5*cp)+')';X.fill();hz(X,cx,cy,40,'255,180,80',0.06*cp,W,H)}
      if(p>0.93){var fp=(p-0.93)/0.07;if(fp<0.2){X.fillStyle='rgba(255,200,120,'+((0.2-fp)*0.15)+')';X.fillRect(0,0,W,H)}}
      var vg=X.createRadialGradient(W/2,H/2,W*0.2,W/2,H/2,W*0.7);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,3,8,0.3)');X.fillStyle=vg;X.fillRect(0,0,W,H)
      raf=requestAnimationFrame(draw)};raf=requestAnimationFrame(draw)
    return function(){cancelAnimationFrame(raf);window.removeEventListener('resize',rs)}
  },[])
  return <div className="flex-1 flex flex-col" style={{background:'rgba(3,5,12,.9)',position:'relative',overflow:'hidden',minHeight:0}}><canvas ref={cRef} style={{position:'absolute',inset:0,width:'100%',height:'100%',display:'block'}}/><div className="absolute inset-0 flex flex-col items-center justify-end pb-8" style={{zIndex:1}}><span style={{fontFamily:UI,fontSize:9,letterSpacing:'.28em',color:'#00E5FF',opacity:0.6}}>ARCHITECTING</span></div></div>
}

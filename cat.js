/* Madiland category pages: a living scene on the right page.
   Every effect is anchored to coordinates in the original image, so it stays on
   the cup, the lights, the window, the fire or the candle at any screen size. */
(function(){
const C=window.SCENE; if(!C) return;
const stage=document.querySelector('.stage'), sceneEl=stage.querySelector('.scene');
const cn=stage.querySelector('canvas.n'), cs=stage.querySelector('canvas.s');
const gn=cn.getContext('2d'), gs=cs.getContext('2d');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const img=new Image(); img.decoding='async'; img.src=C.src;
let W=0,H=0,DPR=1,s=1,ox=0,oy=0;
const X=x=>ox+x*s, Y=y=>oy+y*s;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function layout(){
  DPR=Math.min(devicePixelRatio||1,2); W=stage.clientWidth; H=stage.clientHeight;
  for(const [c,g] of [[cn,gn],[cs,gs]]){ c.width=Math.round(W*DPR); c.height=Math.round(H*DPR); g.setTransform(DPR,0,0,DPR,0,0); }
  s=Math.max(W/C.w,H/C.h);
  const mob=W<700 && H>W*.8, ax=mob?(C.mx??.5):(C.ax??.55);
  ox=clamp(W*ax-C.fxp*s, W-C.w*s, 0); oy=clamp(H*.5-C.fy*s, H-C.h*s, 0);
  sceneEl.style.backgroundImage=`url(${C.src})`;
  sceneEl.style.backgroundSize=`${C.w*s}px ${C.h*s}px`;
  sceneEl.style.backgroundPosition=`${ox}px ${oy}px`;
  FX.layout && FX.layout();
}
/* smooth pseudo-noise: sum of sines with unrelated frequencies */
const nz=(t,k=0)=>(Math.sin(t*1.7+k)*.5+Math.sin(t*2.9+k*1.3)*.3+Math.sin(t*5.3+k*2.1)*.2);
function sprite(r,stops){ const c=document.createElement('canvas'); c.width=c.height=r*2; const x=c.getContext('2d'), gr=x.createRadialGradient(r,r,0,r,r,r);
  stops.forEach(([o,col])=>gr.addColorStop(o,col)); x.fillStyle=gr; x.fillRect(0,0,r*2,r*2); return c; }
const rnd=(a,b)=>a+Math.random()*(b-a);

/* ---------------- effects ---------------- */
const EFFECTS={

/* Planners: steam curling up from the coffee */
steam(){
  const soft=sprite(64,[[0,'rgba(255,255,255,.9)'],[.45,'rgba(255,255,255,.35)'],[1,'rgba(255,255,255,0)']]);
  const P=[]; let acc=0; const {x:cx,y:cy,w:cw}=C.cup;
  return {frame(t,dt){
    acc+=dt; while(acc>.09){ acc-=.09; if(P.length<70) P.push({x:cx+rnd(-cw*.32,cw*.32), y:cy, a:0, max:rnd(3.6,5.6), v:rnd(34,52), r0:rnd(8,14), ph:rnd(0,6.28), sw:rnd(.6,1.1)}); }
    gs.clearRect(0,0,W,H);
    for(let i=P.length-1;i>=0;i--){ const p=P[i]; p.a+=dt; const k=p.a/p.max; if(k>=1){P.splice(i,1);continue;}
      const rise=p.v*p.a, drift=Math.sin(p.ph+p.a*p.sw*1.6)*(6+rise*.22)+nz(t*.35,p.ph)*rise*.12;
      const r=(p.r0+rise*.26)*s, al=Math.sin(Math.PI*Math.min(1,k*1.15))*.26*(1-k*.45);
      gs.globalAlpha=al; gs.drawImage(soft,X(p.x+drift)-r,Y(p.y-rise)-r,r*2,r*2); }
    gs.globalAlpha=1; }};
},

/* Coloring: the string lights on the wall breathe on and off, one after another */
twinkle(){
  const B=C.bulbs.map((b,i)=>({...b, ph:i*1.15+rnd(0,.6), sp:rnd(.75,1.05)}));
  const glow=sprite(64,[[0,'rgba(235,255,252,1)'],[.18,'rgba(160,245,236,.75)'],[.5,'rgba(127,227,218,.18)'],[1,'rgba(127,227,218,0)']]);
  let patches=[];
  function build(){ // a soft piece of the wall next to each bulb, used to dim it
    const R=C.br;
    patches=B.map(b=>{ const c=document.createElement('canvas'); c.width=c.height=R*2; const x=c.getContext('2d');
      x.drawImage(img,b.x+b.dx-R,b.y+b.dy-R,R*2,R*2,0,0,R*2,R*2);
      x.globalCompositeOperation='destination-in';
      const gr=x.createRadialGradient(R,R,0,R,R,R); gr.addColorStop(0,'rgba(0,0,0,1)'); gr.addColorStop(.55,'rgba(0,0,0,.85)'); gr.addColorStop(1,'rgba(0,0,0,0)');
      x.fillStyle=gr; x.fillRect(0,0,R*2,R*2); return c; });
  }
  return {ready:build, frame(t){
    gn.clearRect(0,0,W,H); gs.clearRect(0,0,W,H); if(!patches.length) return;
    const R=C.br*s;
    B.forEach((b,i)=>{
      const v=Math.sin(t*b.sp*1.25+b.ph); // -1..1
      const off=clamp((-v-.15)/.85,0,1), on=clamp((v-.2)/.8,0,1);
      if(off>0){ gn.globalAlpha=off*.82; gn.drawImage(patches[i],X(b.x)-R,Y(b.y)-R,R*2,R*2); }
      if(on>0){ const g=R*2.2; gs.globalAlpha=on*.55; gs.drawImage(glow,X(b.x)-g,Y(b.y)-g,g*2,g*2); }
    });
    gn.globalAlpha=gs.globalAlpha=1; }};
},

/* Trading: raindrops gather, stall, then run down the glass */
rain(){
  const D=[], T=[]; const A=C.area, EX=C.exclude||[];
  const inEx=(x,y)=>EX.some(e=>x>e[0]&&x<e[2]&&y>e[1]&&y<e[3]);
  function spawn(){ for(let n=0;n<20;n++){ const x=rnd(A[0]+20,A[2]-20), y=rnd(A[1],A[1]+(A[3]-A[1])*.55); if(!inEx(x,y)){ D.push({x,y,r:rnd(9,15),v:0,stall:rnd(.3,2.2),wob:rnd(0,6.28),lastT:y}); return; } } }
  function drop(g,x,y,r,a){
    const px=X(x), py=Y(y), rr=r*s; if(rr<.6) return;
    g.globalAlpha=a;
    const gr=g.createRadialGradient(px-rr*.25,py-rr*.35,rr*.1,px,py,rr*1.05);
    gr.addColorStop(0,'rgba(225,255,250,.55)'); gr.addColorStop(.6,'rgba(120,200,195,.22)'); gr.addColorStop(.9,'rgba(8,22,26,.45)'); gr.addColorStop(1,'rgba(8,22,26,0)');
    g.fillStyle=gr; g.beginPath(); g.ellipse(px,py,rr*.92,rr*1.08,0,0,6.283); g.fill();
    g.fillStyle='rgba(255,255,255,.85)'; g.beginPath(); g.arc(px-rr*.3,py-rr*.38,Math.max(.6,rr*.18),0,6.283); g.fill();
  }
  return {frame(t,dt){
    if(D.length<C.count && Math.random()<dt*2.2) spawn();
    gn.clearRect(0,0,W,H);
    gn.save(); gn.beginPath(); gn.rect(X(A[0]),Y(A[1]),(A[2]-A[0])*s,(A[3]-A[1])*s);
    EX.forEach(e=>gn.rect(X(e[2]),Y(e[1]),-(e[2]-e[0])*s,(e[3]-e[1])*s)); gn.clip('evenodd');
    for(let i=T.length-1;i>=0;i--){ const q=T[i]; q.a-=dt/q.life; if(q.a<=0){T.splice(i,1);continue;} drop(gn,q.x,q.y,q.r,q.a*.8); }
    for(let i=D.length-1;i>=0;i--){ const d=D[i];
      if(d.stall>0){ d.stall-=dt; d.v=0; }
      else { d.v=Math.min(d.v+dt*rnd(260,420),rnd(150,260)); d.y+=d.v*dt; d.x+=Math.sin(t*3+d.wob)*dt*6;
        if(d.y-d.lastT>rnd(9,16)){ d.lastT=d.y; if(T.length<260) T.push({x:d.x+rnd(-1.5,1.5),y:d.y-d.r*1.2,r:d.r*rnd(.22,.38),a:1,life:rnd(2.5,4.5)}); d.r=Math.max(5,d.r-.1); }
        if(Math.random()<dt*.9) d.stall=rnd(.15,.9); }
      if(d.y>A[3]+12 || inEx(d.x,d.y+d.r)){ D.splice(i,1); continue; }
      drop(gn,d.x,d.y,d.r,1); }
    gn.restore(); gn.globalAlpha=1; }};
},

/* Puzzles: the fire dances, embers drift up, warm light breathes on the room */
fire(){
  const F=C.flame, glow=sprite(64,[[0,'rgba(255,170,80,.9)'],[.4,'rgba(255,120,40,.3)'],[1,'rgba(255,100,30,0)']]);
  const spark=sprite(8,[[0,'rgba(255,230,170,1)'],[.5,'rgba(255,150,60,.6)'],[1,'rgba(255,120,40,0)']]);
  const off=document.createElement('canvas'), ox2=off.getContext('2d'); const E=[]; let acc=0;
  return {frame(t,dt){
    gn.clearRect(0,0,W,H); gs.clearRect(0,0,W,H);
    // flames: redraw the fire region in thin strips that sway more toward the tips
    const fw=F.x2-F.x1, fh=F.y2-F.y1, pw=Math.ceil(fw*s), ph=Math.ceil(fh*s);
    if(off.width!==pw||off.height!==ph){ off.width=pw; off.height=ph; }
    ox2.globalCompositeOperation='source-over'; ox2.clearRect(0,0,pw,ph);
    const stretch=1+.035*nz(t*2.2)+.02*nz(t*6.1,3), strip=3;
    for(let y=0;y<fh;y+=strip){
      const up=1-(y/fh); // 1 at the top, 0 at the base
      const sy=F.y2-(F.y2-(F.y1+y))/stretch;
      const dx=(Math.sin(t*7.3+y*.11)*2.2+Math.sin(t*12.1+y*.23)*1.1)*up*up*F.amp;
      ox2.drawImage(img,F.x1,sy,fw,strip/stretch,dx*s,y*s,pw,strip*s+1);
    }
    ox2.globalCompositeOperation='destination-in';
    const gr=ox2.createRadialGradient(pw/2,ph*.62,0,pw/2,ph*.62,Math.max(pw,ph)*.55);
    gr.addColorStop(0,'rgba(0,0,0,1)'); gr.addColorStop(.65,'rgba(0,0,0,.9)'); gr.addColorStop(1,'rgba(0,0,0,0)');
    ox2.fillStyle=gr; ox2.fillRect(0,0,pw,ph);
    gn.drawImage(off,X(F.x1),Y(F.y1));
    // breathing firelight
    const L=C.light, a=.16+.07*nz(t*3.1)+.04*nz(t*9.7,1), R=L.r*s;
    gs.globalAlpha=clamp(a,0,1); gs.drawImage(glow,X(L.x)-R,Y(L.y)-R,R*2,R*2);
    // embers
    acc+=dt; if(acc>.55){ acc=0; if(E.length<14) E.push({x:rnd(F.x1+fw*.25,F.x2-fw*.25),y:F.y1+fh*.35,a:0,max:rnd(1.8,3.2),v:rnd(40,70),ph:rnd(0,6)}); }
    for(let i=E.length-1;i>=0;i--){ const e=E[i]; e.a+=dt; const k=e.a/e.max; if(k>=1){E.splice(i,1);continue;}
      const x=e.x+Math.sin(e.ph+e.a*2.4)*10*k, y=e.y-e.v*e.a, r=Math.max(1.2,3*s);
      gs.globalAlpha=Math.sin(Math.PI*k)*.85*(.6+.4*Math.sin(e.a*18+e.ph)); gs.drawImage(spark,X(x)-r,Y(y)-r,r*2,r*2); }
    gs.globalAlpha=1; }};
},

/* Novels: the candle flame sways and flickers */
candle(){
  const K=C.flame; const halo=sprite(64,[[0,'rgba(255,200,120,.95)'],[.35,'rgba(255,170,80,.35)'],[1,'rgba(255,150,60,0)']]);
  const off=document.createElement('canvas'), o=off.getContext('2d');
  function cover(){ // soften the photographed flame so the drawn one replaces it
    const R=K.cover, c=off; c.width=c.height=R*2;
    o.clearRect(0,0,R*2,R*2); o.filter='blur(9px)'; o.drawImage(img,K.x+K.patchDx-R,K.cy-R,R*2,R*2,0,0,R*2,R*2); o.filter='none';
    o.globalCompositeOperation='destination-in';
    const gr=o.createRadialGradient(R,R,0,R,R,R); gr.addColorStop(0,'rgba(0,0,0,1)'); gr.addColorStop(.55,'rgba(0,0,0,.95)'); gr.addColorStop(1,'rgba(0,0,0,0)');
    o.fillStyle=gr; o.fillRect(0,0,R*2,R*2); o.globalCompositeOperation='source-over';
  }
  return {frame(t){
    gn.clearRect(0,0,W,H); gs.clearRect(0,0,W,H);
    const R=K.cover*s, cy=K.cy;
    
    const h=(K.base-K.tip)*(1+.06*nz(t*2.3)+.03*nz(t*11,2)), w=K.w*(1+.05*nz(t*3.7,4));
    const sway=(nz(t*.9,1)*4+nz(t*4.3,5)*1.4), bx=X(K.x), by=Y(K.base), tx=X(K.x+sway), ty=Y(K.base-h), hw=w*s/2;
    // flame body
    gn.save(); gn.shadowColor='rgba(255,170,70,.9)'; gn.shadowBlur=14*s;
    const g1=gn.createLinearGradient(0,by,0,ty);
    g1.addColorStop(0,'rgba(255,170,90,.75)'); g1.addColorStop(.12,'rgba(255,236,200,.98)'); g1.addColorStop(.55,'rgba(255,248,232,1)'); g1.addColorStop(1,'rgba(255,214,140,.0)');
    gn.fillStyle=g1; gn.beginPath(); gn.moveTo(bx,by);
    gn.bezierCurveTo(bx-hw*1.25,by-(by-ty)*.12, bx-hw*.95+(tx-bx)*.4,by-(by-ty)*.62, tx,ty);
    gn.bezierCurveTo(bx+hw*.95+(tx-bx)*.4,by-(by-ty)*.62, bx+hw*1.25,by-(by-ty)*.12, bx,by); gn.fill(); gn.restore();
    // white core and the blue foot of the flame
    const g2=gn.createRadialGradient(bx+(tx-bx)*.2,by-(by-ty)*.34,0,bx+(tx-bx)*.2,by-(by-ty)*.34,hw*1.1);
    g2.addColorStop(0,'rgba(255,255,250,.95)'); g2.addColorStop(1,'rgba(255,255,250,0)');
    gn.fillStyle=g2; gn.beginPath(); gn.ellipse(bx+(tx-bx)*.2,by-(by-ty)*.34,hw*.8,(by-ty)*.3,0,0,6.283); gn.fill();
    
    // halo
    const a=.30+.08*nz(t*2.6)+.05*nz(t*8.9,1), Rh=K.halo*s;
    gs.globalAlpha=clamp(a,0,1); gs.drawImage(halo,X(K.x)-Rh,Y(cy)-Rh,Rh*2,Rh*2); gs.globalAlpha=1; }};
},

/* Journals: snow falling past the window */
snow(){
  const A=C.area, EX=C.exclude||[], P=[]; const flake=sprite(16,[[0,'rgba(255,255,255,1)'],[.5,'rgba(255,255,255,.6)'],[1,'rgba(255,255,255,0)']]);
  const N=C.count||140;
  function mk(top){ const z=Math.random(); return {x:rnd(A[0],A[2]), y:top?A[1]-rnd(0,40):rnd(A[1],A[3]), z, r:3.5+z*8, v:26+z*55, ph:rnd(0,6.28), sw:rnd(.4,1)}; }
  for(let i=0;i<N;i++) P.push(mk(false));
  return {frame(t,dt){
    gn.clearRect(0,0,W,H);
    gn.save(); gn.beginPath(); (C.panes||[A]).forEach(q=>gn.rect(X(q[0]),Y(q[1]),(q[2]-q[0])*s,(q[3]-q[1])*s)); gn.clip();
    for(const p of P){ p.y+=p.v*dt; p.x+=(Math.sin(t*p.sw+p.ph)*10+6)*dt*(.4+p.z);
      if(p.y>A[3]+10){ Object.assign(p,mk(true)); }
      if(EX.some(e=>p.x>e[0]&&p.x<e[2]&&p.y>e[1]&&p.y<e[3])) continue;
      const r=Math.max(.8,p.r*s); gn.globalAlpha=.35+p.z*.5; gn.drawImage(flake,X(p.x)-r,Y(p.y)-r,r*2,r*2); }
    gn.restore(); gn.globalAlpha=1; }};
}
};

const FX=EFFECTS[C.fx]();
let ready=false;
img.onload=()=>{ layout(); sceneEl.classList.add('ready'); ready=true; FX.ready&&FX.ready(); start(); };
addEventListener('resize',()=>{ layout(); });
layout();

let onScreen=true, running=false, last=0, t0=performance.now();
function start(){ if(reduce||running||!ready||!onScreen||document.hidden) return; running=true; last=performance.now(); requestAnimationFrame(tick); }
function tick(now){
  if(!onScreen||document.hidden){ running=false; return; }
  const dt=Math.min(.05,(now-last)/1000); last=now;
  FX.frame((now-t0)/1000,dt); requestAnimationFrame(tick);
}
new IntersectionObserver(es=>{ onScreen=es[0].isIntersecting; start(); }).observe(stage);
document.addEventListener('visibilitychange',start);

/* filters */
const tabs=[...document.querySelectorAll('.tabs button')], cards=[...document.querySelectorAll('.bk')];
tabs.forEach(b=>b.addEventListener('click',()=>{ tabs.forEach(x=>x.setAttribute('aria-pressed',x===b)); const g=b.dataset.g;
  cards.forEach(c=>c.hidden=!(g==='all'||c.dataset.g===g)); }));
})();

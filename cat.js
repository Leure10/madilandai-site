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
  const P=[]; let acc=0; const {x:cx,y:cy,w:cw}=C.cup, K=C.cup.k||1, SZ=C.cup.size||1;
  return {frame(t,dt){
    acc+=dt; while(acc>.09){ acc-=.09; if(P.length<90) P.push({x:cx+rnd(-cw*.3,cw*.3), y:cy, a:0, max:rnd(3.6,5.6), v:rnd(34,52)*SZ, r0:rnd(8,14)*SZ, ph:rnd(0,6.28), sw:rnd(.6,1.1)}); }
    gs.clearRect(0,0,W,H);
    for(let i=P.length-1;i>=0;i--){ const p=P[i]; p.a+=dt; const k=p.a/p.max; if(k>=1){P.splice(i,1);continue;}
      const rise=p.v*p.a, drift=Math.sin(p.ph+p.a*p.sw*1.6)*(6+rise*.22)+nz(t*.35,p.ph)*rise*.12;
      const r=(p.r0+rise*.26)*s, al=Math.min(.9,Math.sin(Math.PI*Math.min(1,k*1.15))*.26*K*(1-k*.45));
      gs.globalAlpha=al; gs.drawImage(soft,X(p.x+drift)-r,Y(p.y-rise)-r,r*2,r*2); }
    gs.globalAlpha=1; }};
},

/* Coloring: the tiny animals coloring the book are a seamless video loop laid exactly over
   their place in the photo (its edges are baked from the same photo, so no seam shows).
   The child stays a still; the video fades in only once it is really playing. */
video(){
  const V=C.vid, [bx0,by0,bx1,by1]=V.box;
  const v=document.createElement('video');
  Object.assign(v,{muted:true,loop:true,playsInline:true,preload:'auto'});
  v.setAttribute('muted',''); v.setAttribute('playsinline',''); v.setAttribute('aria-hidden','true'); v.disablePictureInPicture=true;
  Object.assign(v.style,{position:'absolute',left:0,top:0,pointerEvents:'none',zIndex:1,opacity:0,transition:'opacity .9s',objectFit:'fill'});
  if(V.mask){ const m='url('+V.mask+') 0 0/100% 100% no-repeat'; v.style.webkitMask=m; v.style.mask=m; }
       v.src=V.src; sceneEl.after(v);
  v.addEventListener('playing',()=>{ v.style.opacity=1; },{once:true});
  const play=()=>{ if(reduce) return; const p=v.play(); p&&p.catch(()=>{}); };
  new IntersectionObserver(es=>{ es[0].isIntersecting?play():v.pause(); }).observe(stage);
  document.addEventListener('visibilitychange',()=>{ document.hidden?v.pause():play(); });
  return {
    layout(){ Object.assign(v.style,{left:X(bx0)+'px',top:Y(by0)+'px',width:(bx1-bx0)*s+'px',height:(by1-by0)*s+'px'}); },
    ready(){ play(); },
    frame(){}
  };
},

/* Coloring (old): the string lights on the wall breathe on and off, one after another */
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

/* Trading: the candlestick chart on the monitor runs forever. Drawn on a canvas that is
   warped (CSS matrix3d) onto the four corners of the screen in the photo, blurred like the photo. */
chart(){
  const Q=C.screen.quad, CW=760, CH=500;
  const cv=document.createElement('canvas'); cv.className='tv'; cv.width=CW*2; cv.height=CH*2;
  Object.assign(cv.style,{position:'absolute',left:0,top:0,width:CW+'px',height:CH+'px',transformOrigin:'0 0',pointerEvents:'none',zIndex:1,opacity:0,transition:'opacity .8s'});
  sceneEl.after(cv); const g=cv.getContext('2d'); g.scale(2,2);
  function homog(src,dst){ const A=[],b=[];
    for(let i=0;i<4;i++){ const [x,y]=src[i],[u,v]=dst[i];
      A.push([x,y,1,0,0,0,-u*x,-u*y]); b.push(u); A.push([0,0,0,x,y,1,-v*x,-v*y]); b.push(v); }
    for(let i=0;i<8;i++){ let m=i; for(let r=i+1;r<8;r++) if(Math.abs(A[r][i])>Math.abs(A[m][i])) m=r;
      [A[i],A[m]]=[A[m],A[i]]; [b[i],b[m]]=[b[m],b[i]];
      for(let r=0;r<8;r++) if(r!==i){ const f=A[r][i]/A[i][i]; for(let c=i;c<8;c++) A[r][c]-=f*A[i][c]; b[r]-=f*b[i]; } }
    const h=b.map((v,i)=>v/A[i][i]); return h; }
  /* market: log-price random walk with regimes (rally, sell-off, chop) and volatility
     clusters, so it trends, pulls back, ranges and spikes like a real chart, forever */
  const N=26; let K=[], lp=Math.log(100), cur=null, acc=0;
  let mu=0, regLeft=0, vol=1;
  const gauss=()=>{ let u=0,v=0; while(!u) u=Math.random(); while(!v) v=Math.random(); return Math.sqrt(-2*Math.log(u))*Math.cos(6.2832*v); };
  function regime(){ const r=Math.random();
    mu = r<.38 ? rnd(.006,.012) : r<.66 ? -rnd(.005,.011) : rnd(-.002,.002);
    regLeft = Math.round(rnd(6,16)); }
  function newCandle(){ const o=Math.exp(lp); return {o,c:o,h:o,l:o,v:0}; }
  function walk(dt){ const SIG=.017; if(!(dt>0)) return;
    lp += mu*dt/PER + SIG*vol*Math.sqrt(dt/PER)*gauss();
    const p=Math.exp(lp); cur.c=p; cur.h=Math.max(cur.h,p); cur.l=Math.min(cur.l,p);
    cur.v += dt/PER*(.35+.65*Math.min(2.2,vol)/2.2)*rnd(.6,1.4); }
  function close(){ K.push(cur); if(K.length>N) K.shift();
    if(--regLeft<=0) regime();
    vol = Math.max(.55, vol*.86 + .14 + (Math.random()<.07 ? rnd(.8,1.6) : 0));
    cur=newCandle(); }
  const PER=1.15;
  regime(); cur=newCandle();
  for(let i=0;i<N;i++){ for(let k=0;k<40;k++) walk(PER/40); close(); }
  let lo=K.reduce((m,c)=>Math.min(m,c.l),1e9), hi=K.reduce((m,c)=>Math.max(m,c.h),0);
  const TEAL='#5FE6D6', RED='#EE8F7C', BG='#1B383C';
  function draw(t){
    const all=K.concat([cur]); const tgtLo=Math.min(...all.map(c=>c.l)), tgtHi=Math.max(...all.map(c=>c.h));
    const pad=(tgtHi-tgtLo)*.08; lo+=(tgtLo-pad-lo)*.05; hi+=(tgtHi+pad-hi)*.05;
    g.fillStyle=BG; g.fillRect(0,0,CW,CH);
    const vg=g.createRadialGradient(CW*.45,CH*.4,40,CW*.5,CH*.5,CW*.75); vg.addColorStop(0,'rgba(80,170,165,.10)'); vg.addColorStop(1,'rgba(0,0,0,.18)'); g.fillStyle=vg; g.fillRect(0,0,CW,CH);
    /* header */
    g.fillStyle='rgba(160,210,205,.35)'; g.fillRect(14,14,60,9); g.fillStyle='rgba(95,230,214,.45)'; g.fillRect(82,14,120,9); g.fillStyle='rgba(160,210,205,.22)'; g.fillRect(14,28,40,7);
    const L=14, R=CW-74, top=52, bot=CH-120, vb=CH-30, cw=(R-L)/N, frac=acc/PER;
    const Yp=v=>bot-(v-lo)/(hi-lo)*(bot-top);
    /* grid */
    g.strokeStyle='rgba(120,190,185,.08)'; g.lineWidth=1; for(let i=1;i<5;i++){ const y=top+(bot-top)*i/5; g.beginPath(); g.moveTo(L,y); g.lineTo(R,y); g.stroke(); }
    /* price scale */
    for(let i=0;i<16;i++){ g.fillStyle='rgba(200,220,218,.38)'; g.fillRect(CW-58,top+i*((CH-top-40)/16),40,8); }
    g.save(); g.beginPath(); g.rect(L,0,R-L,CH); g.clip();
    const vmax=Math.max(.5,...K.map(c=>c.v));
    all.forEach((c,i)=>{ const x=L+(i-frac+.5)*cw, up=c.c>=c.o, col=up?TEAL:RED;
      g.fillStyle=col; g.strokeStyle=col; g.lineWidth=2.5;
      g.beginPath(); g.moveTo(x,Yp(c.h)); g.lineTo(x,Yp(c.l)); g.stroke();
      const y1=Yp(Math.max(c.o,c.c)), y2=Yp(Math.min(c.o,c.c)); g.shadowColor=col; g.shadowBlur=up?16:10;
      g.fillRect(x-cw*.34,y1,cw*.68,Math.max(3,y2-y1)); g.shadowBlur=0;
      const vh=Math.min(1,c.v/vmax)*62; g.globalAlpha=.38; g.fillRect(x-cw*.42,vb-vh,cw*.84,vh); g.globalAlpha=1; });
    /* moving average */
    g.strokeStyle='rgba(95,230,214,.35)'; g.lineWidth=1.5; g.beginPath();
    all.forEach((c,i)=>{ const s0=all.slice(Math.max(0,i-6),i+1), m=s0.reduce((a,b)=>a+b.c,0)/s0.length, x=L+(i-frac+.5)*cw; i?g.lineTo(x,Yp(m)):g.moveTo(x,Yp(m)); }); g.stroke();
    g.restore();
    /* last price line + tag */
    const py=Yp(cur.c), up=cur.c>=cur.o; g.strokeStyle=up?'rgba(95,230,214,.5)':'rgba(238,143,124,.5)'; g.setLineDash([4,5]); g.beginPath(); g.moveTo(L,py); g.lineTo(R,py); g.stroke(); g.setLineDash([]);
    g.fillStyle=up?TEAL:RED; g.shadowColor=g.fillStyle; g.shadowBlur=14; g.fillRect(CW-64,py-9,54,18); g.shadowBlur=0;
  }
  function tickMarket(dt){ if(!(dt>0)) return; acc+=dt; walk(dt); if(acc>=PER){ acc-=PER; close(); } }
  return {
    layout(){ const src=[[0,0],[CW,0],[CW,CH],[0,CH]], dst=Q.map(([x,y])=>[X(x),Y(y)]); const h=homog(src,dst);
      cv.style.transform=`matrix3d(${h[0]},${h[3]},0,${h[6]},${h[1]},${h[4]},0,${h[7]},0,0,1,0,${h[2]},${h[5]},0,1)`;
      cv.style.filter=`blur(${Math.max(.6,(C.screen.blur||3)*s).toFixed(2)}px) saturate(1.05)`; },
    ready(){ draw(0); cv.style.opacity=1; },
    frame(t,dt){ tickMarket(dt); draw(t); }
  };
},
/* Trading (old): raindrops gather, stall, then run down the glass */
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
/* Puzzles: the pendant bulb flickers now and then, like in a thriller; the room it lights
   sinks into the dark with it, while the fireplace keeps its own glow. */
bulb(){
  const B=C.bulb, warm=sprite(64,[[0,'rgba(255,200,120,.9)'],[.35,'rgba(255,170,90,.35)'],[1,'rgba(255,150,70,0)']]);
  let L=1, target=1, seq=[], segLeft=0, next=2.6;
  function pattern(){ const P=[], n=Math.round(rnd(3,6));
    for(let i=0;i<n;i++){ P.push([rnd(.03,.09), rnd(0,.25)]); P.push([rnd(.04,.12), rnd(.75,1)]); }
    if(Math.random()<.6) P.push([rnd(.35,.9), rnd(0,.12)]);                  // the long, tense blackout
    P.push([rnd(.05,.1), rnd(.2,.5)]); P.push([rnd(.12,.25), 1.1]);          // stutter back, then a small surge
    return P; }
  let drawn=false;
  return {frame(t,dt){
    next-=dt;
    if(next<=0 && !seq.length){ seq=pattern(); segLeft=0; next=rnd(7,14); }
    if(seq.length){ segLeft-=dt; if(segLeft<=0){ const sg=seq.shift(); segLeft=sg[0]; target=sg[1]; } }
    else target=1;
    const hum=1+.012*nz(t*13.7)+.006*nz(t*31,2);
    L += (target-L)*(1-Math.exp(-dt/(target<L?.035:.022)));
    const lv=L*hum, dark=clamp(1-lv,0,1), surge=clamp(lv-1,0,.2);
    if(dark<.004 && surge<.004){ if(drawn){ gn.clearRect(0,0,W,H); gs.clearRect(0,0,W,H); drawn=false; } return; }
    drawn=true; gn.clearRect(0,0,W,H); gs.clearRect(0,0,W,H);
    const bx=X(B.x), by=Y(B.y);
    if(dark>0){
      const R=B.reach*s, g=gn.createRadialGradient(bx,by,0,bx,by,R), a=dark*B.depth;
      g.addColorStop(0,`rgba(6,7,9,${a})`); g.addColorStop(.45,`rgba(6,7,9,${a*.85})`); g.addColorStop(1,`rgba(6,7,9,${a*.45})`);
      gn.fillStyle=g; gn.fillRect(0,0,W,H);
      // the fireplace is its own light: give it back
      const F=B.keep, fr=F.r*s, fx=X(F.x), fy=Y(F.y);
      gn.save(); gn.globalCompositeOperation='destination-out';
      const k=gn.createRadialGradient(fx,fy,0,fx,fy,fr); k.addColorStop(0,'rgba(0,0,0,.95)'); k.addColorStop(.6,'rgba(0,0,0,.6)'); k.addColorStop(1,'rgba(0,0,0,0)');
      gn.fillStyle=k; gn.fillRect(fx-fr,fy-fr,fr*2,fr*2);
      // the window: moonlight from outside does not depend on the bulb
      (B.keepRects||[]).forEach(([x0,y0,x1,y1,f])=>{ gn.filter=`blur(${Math.max(1,f*s)}px)`; gn.fillStyle='#000'; gn.fillRect(X(x0),Y(y0),(x1-x0)*s,(y1-y0)*s); gn.filter='none'; });
      gn.restore();
      // the bulb itself goes grey: the filament cools
      const br=B.r*s, gb=gn.createRadialGradient(bx,by,0,bx,by,br);
      gb.addColorStop(0,`rgba(58,46,34,${dark*.92})`); gb.addColorStop(.55,`rgba(30,26,22,${dark*.8})`); gb.addColorStop(1,'rgba(20,18,16,0)');
      gn.fillStyle=gb; gn.fillRect(bx-br,by-br,br*2,br*2);
    }
    if(surge>0){ const R=B.glow*s; gs.globalAlpha=surge*4; gs.drawImage(warm,bx-R,by-R,R*2,R*2); gs.globalAlpha=1; }
  }};
},
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
  const WL=C.winLights, lamp=sprite(48,[[0,'rgba(255,236,190,.95)'],[.45,'rgba(255,222,165,.8)'],[.7,'rgba(255,205,140,.35)'],[1,'rgba(255,190,120,0)']]);   // out-of-focus, like the photo's own lights
  const lit=[]; let step=0, nextEv=WL?1.2:1e9, gust=0, flick=1;
  function lightAt(sp){ const d=rnd(0,1), y=WL.yFar+(WL.yNear-WL.yFar)*d;   // d: 0 = far, 1 = near
    const vx0=Math.max(WL.x0,-ox/s+25);   // only the part of the window that is on screen
    return {x:rnd(vx0,Math.max(vx0+40,WL.x1)), y, r:WL.rFar+(WL.rNear-WL.rFar)*d*d, a:0, on:true, tint:sp}; }
  function event(){ // a light comes on, another one, then one goes out ... 5 events, then again
    const onLights=lit.filter(l=>l.on), offStep=(step%5===2||step%5===4)&&onLights.length>=(WL.min||3) || onLights.length>=(WL.max||8);
    if(offStep && onLights.length) onLights[Math.floor(Math.random()*onLights.length)].on=false;
    else lit.push(lightAt(Math.random()<.25?1:0));
    step++; nextEv=WL.every?rnd(WL.every*.85,WL.every*1.15):rnd(7,8); }
  function drawLights(dt){
    if(!WL) return; nextEv-=dt; if(nextEv<=0) event();
    gs.save(); gs.beginPath(); gs.rect(X(WL.clip[0]),Y(WL.clip[1]),(WL.clip[2]-WL.clip[0])*s,(WL.clip[3]-WL.clip[1])*s); gs.clip();
    for(let i=lit.length-1;i>=0;i--){ const l=lit[i]; l.a+=(l.on?1:-1)*dt/(l.on?1.4:1.8); if(l.a<=0&&!l.on){ lit.splice(i,1); continue; } l.a=clamp(l.a,0,1);
      const r=l.r*s; gs.globalAlpha=l.a*.82; if(l.tint){ gs.filter='hue-rotate(160deg) saturate(.6)'; }
      gs.drawImage(lamp,X(l.x)-r,Y(l.y)-r,r*2,r*2); gs.filter='none'; }
    gs.restore(); gs.globalAlpha=1; }
  return {frame(t,dt){
    gn.clearRect(0,0,W,H); gs.clearRect(0,0,W,H); drawLights(dt||0);
    const R=K.cover*s, cy=K.cy;
    
    gust=Math.max(0,nz(t*.37,7)-.45)*2.2, flick=1+(.11+.12*gust)*nz(t*2.3)+(.06+.08*gust)*nz(t*13,2)+.05*nz(t*23,3);
    const h=(K.base-K.tip)*flick, w=K.w*(1+.07*nz(t*3.7,4)-.05*gust);
    const sway=(nz(t*.9,1)*6+nz(t*4.3,5)*2.2)*(1+gust), bx=X(K.x), by=Y(K.base), tx=X(K.x+sway), ty=Y(K.base-h), hw=w*s/2;
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
    const a=.32+.12*(flick-1)*2.4+.05*nz(t*8.9,1), Rh=K.halo*s*(1+.06*(flick-1)*3);
    gs.globalAlpha=clamp(a,0,1); gs.drawImage(halo,X(K.x)-Rh,Y(cy)-Rh,Rh*2,Rh*2); gs.globalAlpha=1; }};
},

/* Journals: snow falling past the window */
snow(){
  const A=C.area, EX=C.exclude||[], P=[]; const flake=sprite(16,[[0,'rgba(255,255,255,1)'],[.5,'rgba(255,255,255,.6)'],[1,'rgba(255,255,255,0)']]);
  const N=C.count||140; let glass=null; if(C.glass){ glass=new Image(); glass.src=C.glass; }
  function mk(top){ const z=Math.random(); return {x:rnd(A[0],A[2]), y:top?A[1]-rnd(0,40):rnd(A[1],A[3]), z, r:3.5+z*8, v:26+z*55, ph:rnd(0,6.28), sw:rnd(.4,1)}; }
  for(let i=0;i<N;i++) P.push(mk(false));
  return {frame(t,dt){
    gn.clearRect(0,0,W,H);
    gn.save(); gn.beginPath(); (C.panes||[A]).forEach(q=>gn.rect(X(q[0]),Y(q[1]),(q[2]-q[0])*s,(q[3]-q[1])*s)); gn.clip();
    for(const p of P){ p.y+=p.v*dt; p.x+=(Math.sin(t*p.sw+p.ph)*10+6)*dt*(.4+p.z);
      if(p.y>A[3]+10){ Object.assign(p,mk(true)); }
      if(EX.some(e=>p.x>e[0]&&p.x<e[2]&&p.y>e[1]&&p.y<e[3])) continue;
      const r=Math.max(.8,p.r*s); gn.globalAlpha=.35+p.z*.5; gn.drawImage(flake,X(p.x)-r,Y(p.y)-r,r*2,r*2); }
    gn.restore(); gn.globalAlpha=1;
    if(glass&&glass.complete&&glass.naturalWidth){ gn.save(); gn.globalCompositeOperation='destination-in'; gn.drawImage(glass,X(0),Y(0),C.w*s,C.h*s); gn.restore(); } }};
}
};

const FXL=[C.fx].concat(C.fx2?[C.fx2]:[]).map(n=>EFFECTS[n]());
const FX={layout(){FXL.forEach(f=>f.layout&&f.layout());}, ready(){FXL.forEach(f=>f.ready&&f.ready());}, frame(t,dt){FXL.forEach(f=>f.frame(t,dt));}};
let ready=false;
img.onload=()=>{ layout(); sceneEl.classList.add('ready'); ready=true; FX.ready&&FX.ready(); start(); };
addEventListener('resize',()=>{ layout(); });
layout();

let onScreen=true, running=false, last=0, t0=performance.now();
function start(){ if(reduce||running||!ready||!onScreen||document.hidden) return; running=true; last=performance.now(); requestAnimationFrame(tick); }
function tick(now){
  if(!onScreen||document.hidden){ running=false; return; }
  const dt=Math.max(0,Math.min(.05,(now-last)/1000)); last=now;
  FX.frame((now-t0)/1000,dt); requestAnimationFrame(tick);
}
new IntersectionObserver(es=>{ onScreen=es[0].isIntersecting; start(); }).observe(stage);
document.addEventListener('visibilitychange',start);

/* filters */
const tabs=[...document.querySelectorAll('.tabs button')], cards=[...document.querySelectorAll('.bk')];
tabs.forEach(b=>b.addEventListener('click',()=>{ tabs.forEach(x=>x.setAttribute('aria-pressed',x===b)); const g=b.dataset.g;
  cards.forEach(c=>c.hidden=!(g==='all'||c.dataset.g===g)); }));
})();

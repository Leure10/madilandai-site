/* One continuous shot. Clicking a room: the camera moves forward into warm light; the next page
   opens inside the same light and the camera glides in until it rests on the still picture.
   On desktop the page is never reloaded: the next room is prepared unseen in a full-screen frame and the two
   melt into each other at full mist; the address, title and Back button follow. Phones use ordinary links.
   It is the original picture, moved through its own depth map (depth/*.webp) on the GPU, so it stays sharp.
   No WebGL2, reduced motion or data saving: links stay ordinary links. Loaded in <head>. */
(function(){
const ROOMS={home:'hero_v1',planners:'planners_agenda',coloring:'coloring_scena2',journals:'journals_snow',trading:'trading_carte',puzzles:'puzzles_carte',novels:'novels_carte2'};
const SIZE={home:[2880,1607],planners:[2400,2034],coloring:[2752,1536],journals:[2752,1536],trading:[2880,1609],puzzles:[2880,1609],novels:[2400,2061]};
/* the first passage of a visit is taken whole, the next ones are brisk */
let LEAVE=1500, ARRIVE=2500;
const FIRST=[1500,2500], NEXT=[900,1700], FOG='#F4EEE3', root=document.documentElement, conn=navigator.connection||{};
const me=(location.pathname.split('/').pop()||'index.html').replace('.html','').replace('index','home');
const off=!ROOMS[me]||matchMedia('(prefers-reduced-motion: reduce)').matches||conn.saveData||/2g/.test(conn.effectiveType||'')||!window.WebGL2RenderingContext;
const get=k=>{ try{ return sessionStorage.getItem(k); }catch(e){ return null; } }, set=(k,v)=>{ try{ v===null?sessionStorage.removeItem(k):sessionStorage.setItem(k,v); }catch(e){} };
/* am I the room being prepared inside the frame of another room? */
let child=false; try{ child=!!(window.frameElement&&window.frameElement.dataset.film); }catch(e){}
const TOP=child?window.parent:window;
/* a frame just being prepared may not know its own width yet: the page above it does */
const small=TOP.matchMedia('(max-width:900px)').matches;
let mode=child?'frame':''; if(!child){ const f=get('film'); set('film',null);
  if(!off && f && Date.now()-f<8000) mode='link';
  else if(!off && me==='home' && !small && !get('seen') && !location.hash && (performance.getEntriesByType('navigation')[0]||{}).type==='navigate') mode='first'; }
set('seen','1');
const pace=()=>{ const q=(+get('trips')||0)>1; [LEAVE,ARRIVE]=q?NEXT:FIRST; };
const css=document.createElement('style');
css.textContent=`
canvas.cam{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1}
canvas.cam.done{opacity:0;transition:opacity .35s linear}
html.arr .rb,html.arr .copy>*,html.arrived .rb,html.arrived .copy>*,html.leaving .copy>*{animation:none!important}
.copy{--k:1}
html.leaving .copy{opacity:0;transition:opacity .5s ease}
html.arr:not(.in) .copy{opacity:0}
html.arr.in .copy{transition:opacity .9s ease}
/* the living layers (steam, snow, chart, film, motes) are drawn by the camera itself, under the mist; the page's own lie beneath it */
html.arr:not(.gl) .stage canvas:not(.cam),html.arr:not(.gl) .stage video{opacity:0!important}
html.arr:not(.lit) canvas.motes,html.leaving canvas.motes{opacity:0!important}canvas.motes{transition:opacity .2s linear}
.stage::after{z-index:2;transition:opacity .8s}html.leaving .stage::after,html.arr:not(.in) .stage::after{opacity:0}
html.leaving .madi .say,html.arr .madi .say{opacity:0!important;transition:opacity .35s}
.hero::after{transition:opacity .8s}html.leaving .hero:has(.scene[data-k=home])::after,html.arr:not(.in) .hero:has(.scene[data-k=home])::after{opacity:0}
.wash.night{transition:opacity .9s}html.leaving .wash.night,html.arr:not(.in) .wash.night{opacity:0!important}
@media (min-width:901px){.grp .lb b,.grp .lb span{transition:color .4s,text-shadow .4s}.shelf::before{transition:filter .5s}
html.leaving .grp .lb b,html.leaving .grp .lb span{transition:color .25s .78s,text-shadow .25s .7s}
html.leaving .grp .lb b,html.leaving .grp .lb span,html.arr:not(.in) .grp .lb b,html.arr:not(.in) .grp .lb span{color:#22323A!important;text-shadow:0 0 6px rgba(244,238,227,.95),0 0 14px rgba(244,238,227,.8)}
html.arr.in .grp .lb b,html.arr.in .grp .lb span{text-shadow:0 0 8px rgba(14,19,22,.75)}
html.leaving .shelf::before,html.arr:not(.in) .shelf::before{filter:brightness(.6) saturate(1.4)}}
iframe.room{position:fixed;inset:0;width:100vw;height:100vh;height:100dvh;border:0;margin:0;opacity:0;pointer-events:none;z-index:2147483000;background:none;color-scheme:normal}
html.under{overflow:hidden!important}html.under body>*:not(iframe.room){display:none!important}
@media (max-width:900px){@view-transition{navigation:auto}}
html.arr:not(.gl) .stage{background:${FOG}}
html.arr:not(.gl) .stage .scene{opacity:0!important}
html.arr:not(.gl) .scene[data-k=home]::after{content:"";position:absolute;inset:0;background:${FOG}}
html.arr.gl .stage .scene{transition:none!important;opacity:1}`;
document.head.appendChild(css);
if(mode) root.classList.add('arr');

const sceneOf=()=>document.querySelector(me==='home'?'.scene[data-k=home]':'.stage .scene');
/* where the whole picture lies inside the scene box (css px) */
function rect(sc){ const [iw,ih]=SIZE[me], W=sc.clientWidth, H=sc.clientHeight, st=getComputedStyle(sc), sz=st.backgroundSize.split(' '); let w,h;
  if(sz[0]==='cover'){ const s=Math.max(W/iw,H/ih); w=iw*s; h=ih*s; }
  else{ w=parseFloat(sz[0])*(sz[0].endsWith('%')?W/100:1); h=sz[1]&&sz[1]!=='auto'?parseFloat(sz[1])*(sz[1].endsWith('%')?H/100:1):w*ih/iw; }
  const p=st.backgroundPosition.split(' '), at=(v,f)=>v.endsWith('%')?parseFloat(v)/100*f:parseFloat(v)||0;
  return [at(p[0],W-w),at(p[1]||'50%',H-h),w,h,W,H]; }
const load=(src,srcset,sizes)=>new Promise((ok,no)=>{ const i=new Image(); i.decoding='async'; i.onload=()=>(i.decode?i.decode():Promise.resolve()).then(()=>ok(i),()=>ok(i)); i.onerror=no; if(srcset){ i.sizes=sizes; i.srcset=srcset; } i.src=src; });
/* pixels decoded off the main thread, so nothing stutters while the mist moves */
const bits=async i=>{ try{ return await createImageBitmap(await (await fetch(i.currentSrc||i.src)).blob()); }catch(e){ return i; } };
async function picture(){
  if(window.SCENE) return load(SCENE.src,SCENE.set,SCENE.sizes).catch(()=>load(SCENE.src));
  const m=[...getComputedStyle(sceneOf()).backgroundImage.matchAll(/url\("?([^")]+)"?\)/g)].map(x=>x[1]);
  for(const u of m) try{ return await load(u); }catch(e){} throw 0; }

const VS=`#version 300 es
in vec2 a;out vec2 v;void main(){v=a*.5+.5;v.y=1.-v.y;gl_Position=vec4(a,0,1);}`;
const FS=`#version 300 es
precision highp float;in vec2 v;out vec4 o;
uniform sampler2D P,D;uniform vec2 S;      /* view, css px */
uniform vec4 R;                            /* picture: x,y,w,h in css px */
uniform vec2 C;                            /* optical axis, css px */
uniform vec4 M;uniform float Q;             /* the screen, in picture coordinates: centre, half size; extra mist */
uniform sampler2D LN,LS,LV,LM,LT;uniform float hN,hS,hV,hT,bT;  /* live layers: normal, screen, video + mask, tilted chart */
uniform vec4 G,VB;uniform mat3 HT;
uniform float B,K,T,A;                     /* pull-back, mist, mist clock, sideways drift */
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*f*(f*(f*6.-15.)+10.);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*n(p);p=mat2(1.6,1.2,-1.2,1.6)*p+7.3;a*=.5;}return s;}
vec2 mir(vec2 u){return 1.-abs(1.-mod(u,2.));}
float dep(vec2 u){return textureLod(D,mir(u),0.).r;}
/* where a point of inverse depth d, seen here, sits in the original picture */
vec2 src(vec2 q,float d){float k=mix(.16,1.,d);return (C+q*(1.+B*k)/(1.+max(B,0.)*.30)+vec2(A*k*R.z,0.)-R.xy)/R.zw;}
void main(){
 vec2 q=v*S-C;float d=1.,pd=1.,pe=0.;const int N=80;
 if(abs(B)>.0004){ /* walk from near to far until the ray meets the picture's relief */
  float e=dep(src(q,1.))-1.;pe=e;
  for(int i=1;i<=N;i++){d=1.-float(i)/float(N);e=dep(src(q,d))-d;if(e>=0.){float t=pe/(pe-e);float lo=d,hi=pd;d=mix(pd,d,clamp(t,0.,1.));
    for(int j=0;j<4;j++){if(dep(src(q,d))-d>=0.){lo=d;}else{hi=d;}d=.5*(lo+hi);}break;}pd=d;pe=e;}
 }else d=dep(src(q,0.));
 vec2 u=src(q,d);
 vec3 c=texture(P,mir(u)).rgb;
  { vec2 z=(R.xy+u*R.zw)/S;
  if(hV>0.){ vec2 e=(u-VB.xy)/(VB.zw-VB.xy); if(min(e.x,e.y)>0.&&max(e.x,e.y)<1.) c=mix(c,texture(LV,e).rgb,hV*texture(LM,e).a); }
  if(hT>0.){ vec3 y=HT*vec3(z*S,1.); vec2 e=y.xy/y.z; if(y.z!=0.&&min(e.x,e.y)>-.06&&max(e.x,e.y)<1.06){ vec4 a=vec4(0);float ws=0.;
    for(int i=-2;i<=2;i++)for(int j=-2;j<=2;j++){ vec2 o_=vec2(i,j)*bT*.7; vec3 y2=HT*vec3(z*S+o_,1.); vec2 e2=y2.xy/y2.z; float g=exp(-float(i*i+j*j)*.405); ws+=g; if(min(e2.x,e2.y)>=0.&&max(e2.x,e2.y)<=1.) a+=g*textureLod(LT,e2,2.); }
    a/=ws; c=c*(1.-a.a*hT)+a.rgb*hT; } }
  vec2 w2=z*G.zw+G.xy; if(min(w2.x,w2.y)>0.&&max(w2.x,w2.y)<1.){
   if(hN>0.){ vec4 a=texture(LN,w2); c=c*(1.-a.a)+a.rgb; }
   if(hS>0.){ vec3 a=texture(LS,w2).rgb; c=c+a-c*a; } } }
 vec2 x=(abs(u-.5)-.5);float out_=max(x.x*R.z,x.y*R.w)/S.y;   /* beyond the picture */
 float far=1.-d;
 vec2 w=q/S.y;
 float f1=fbm(w*2.1*(1.+B*.9)+vec2(T*.10,-T*.16)),f2=fbm(w*3.6*(1.+B*1.3)+vec2(-T*.17,T*.07)+f1*1.2);
 float wisp=mix(f1,f2,.55);
 float m=1.-exp(-K*(.35+1.5*far)*(.25+1.9*smoothstep(.22,.78,wisp))*2.2);
/* a screen glowing in the picture would show through longest: the mist is thicker around it */
 vec2 mq=max(abs(u-M.xy)-M.zw,0.)*vec2(R.z/R.w,1.);m=1.-pow(1.-m,1.+Q*(1.-smoothstep(0.,.16,length(mq))));
 float full=smoothstep(.70,1.,K/2.2);m=mix(m,1.,full);
 float ew=clamp(B*4.,0.,1.);float oo=out_+(fbm(w*1.3+4.+T*.06)-.5)*.14*ew;float edge=smoothstep(.015-.30*ew*wisp*step(.12,B)*(B-.12)*4.,.075,oo)*step(0.,B);
 m=max(m,edge);
 vec3 fog=vec3(.957,.933,.890);fog*=1.+(wisp-.5)*.10*(1.-full);
 vec3 bloom=c*c*.18*(1.-m)*min(K,1.);
 c=mix(c+bloom,fog,m);
 c+=(h(v*S+T)-.5)/255.;
 o=vec4(c,1);
}`;
let cam=null;
async function camera(){
  const sc=sceneOf(), cv=document.createElement('canvas'); cv.className='cam'; cv.setAttribute('aria-hidden','true'); cv.style.opacity=0;
  const g=cv.getContext('webgl2',{alpha:false,antialias:false,powerPreference:'high-performance'}); if(!g) throw 0;
  const [im,dp]=await Promise.all([picture().then(bits),load('depth/'+ROOMS[me]+'.webp').then(bits)]);
  const sh=(t,s)=>{ const x=g.createShader(t); g.shaderSource(x,s); g.compileShader(x); return x; };
  const p=g.createProgram(); g.attachShader(p,sh(g.VERTEX_SHADER,VS)); g.attachShader(p,sh(g.FRAGMENT_SHADER,FS)); g.linkProgram(p); { const x=g.getExtension('KHR_parallel_shader_compile'); if(x) for(let i=0;i<120&&!g.getProgramParameter(p,x.COMPLETION_STATUS_KHR);i++) await wait(12); } if(!g.getProgramParameter(p,g.LINK_STATUS)) throw new Error(g.getProgramInfoLog(p)); g.useProgram(p);
  g.bindBuffer(g.ARRAY_BUFFER,g.createBuffer()); g.bufferData(g.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),g.STATIC_DRAW); const al=g.getAttribLocation(p,'a'); g.enableVertexAttribArray(al); g.vertexAttribPointer(al,2,g.FLOAT,false,0,0);
  const tex=(u,i,mip)=>{ g.activeTexture(g.TEXTURE0+u); g.bindTexture(g.TEXTURE_2D,g.createTexture()); g.texImage2D(g.TEXTURE_2D,0,g.RGBA,g.RGBA,g.UNSIGNED_BYTE,i); if(mip) g.generateMipmap(g.TEXTURE_2D);
    g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,mip?g.LINEAR_MIPMAP_LINEAR:g.LINEAR); g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,g.LINEAR); g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE); g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE);
    const x=mip&&g.getExtension('EXT_texture_filter_anisotropic'); if(x) g.texParameterf(g.TEXTURE_2D,x.TEXTURE_MAX_ANISOTROPY_EXT,8); };
  tex(0,im,true); tex(1,dp,false);
  const U=k=>g.getUniformLocation(p,k); g.uniform1i(U('P'),0); g.uniform1i(U('D'),1); const uS=U('S'),uR=U('R'),uC=U('C'),uB=U('B'),uK=U('K'),uT=U('T'),uA=U('A');
  { const q=window.SCENE&&SCENE.screen&&SCENE.screen.quad; if(q){ const xs=q.map(v=>v[0]/SCENE.w), ys=q.map(v=>v[1]/SCENE.h), a=Math.min(...xs), b=Math.max(...xs), c=Math.min(...ys), d=Math.max(...ys); g.uniform4f(U('M'),(a+b)/2,(c+d)/2,(b-a)/2,(d-c)/2); g.uniform1f(U('Q'),2.6); } }
  me==='home'?sc.appendChild(cv):(sc.parentNode.querySelector('canvas.s')||sc).after(cv);
  /* live layers as textures */
  const F={}, unit={LN:2,LS:3,LV:4,LM:5,LT:6}, tx={}; for(const k in unit){ g.uniform1i(U(k),unit[k]); g.activeTexture(g.TEXTURE0+unit[k]); g.bindTexture(g.TEXTURE_2D,tx[k]=g.createTexture()); g.texImage2D(g.TEXTURE_2D,0,g.RGBA,1,1,0,g.RGBA,g.UNSIGNED_BYTE,new Uint8Array(4));
    g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,k==='LT'?g.LINEAR_MIPMAP_LINEAR:g.LINEAR); g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,g.LINEAR); g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE); g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE); }
  for(const k of ['hN','hS','hV','hT','bT','G','VB','HT']) F[k]=U(k);
  g.uniform4f(F.G,0,0,1,1); const up=(k,src,pre)=>{ g.activeTexture(g.TEXTURE0+unit[k]); g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!!pre); g.texImage2D(g.TEXTURE_2D,0,g.RGBA,g.RGBA,g.UNSIGNED_BYTE,src); g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false); };
  const box=sc.parentNode, fxs=window.SCENE?[SCENE.fx,SCENE.fx2]:[], useN=fxs.some(f=>f&&!/^(steam|video|chart)$/.test(f)), useS=fxs.some(f=>f&&!/^(video|chart|snow)$/.test(f));
  const soft=root.classList.contains('arr'); let vt=0, masked=false, vid=null;
  if(window.SCENE&&SCENE.vid&&SCENE.vid.mask){ const b=SCENE.vid.box; g.uniform4f(F.VB,b[0]/SCENE.w,b[1]/SCENE.h,b[2]/SCENE.w,b[3]/SCENE.h); quiet(load(SCENE.vid.mask)).then(i=>{ up('LM',i,false); masked=true; },()=>{}); }
  function live(){ const now=performance.now();
    if(me==='home'){ const m=document.querySelector('canvas.motes'); if(m&&m.width){ const a=sc.getBoundingClientRect(), b=m.getBoundingClientRect(); g.uniform4f(F.G,(a.left-b.left)/b.width,(a.top-b.top)/b.height,a.width/b.width,a.height/b.height); up('LS',m,true); g.uniform1f(F.hS,1); } return; }
    const n=useN&&box.querySelector('canvas.n'), o=useS&&box.querySelector('canvas.s');
    if(n&&n.width){ up('LN',n,true); g.uniform1f(F.hN,1); } if(o&&o.width){ up('LS',o,true); g.uniform1f(F.hS,1); }
    vid=vid||box.querySelector('video'); if(vid&&masked&&vid.readyState>=2&&!vid.paused){ vt=vt||now; try{ up('LV',vid,false); g.uniform1f(F.hV,soft?Math.min(1,(now-vt)/700):1); }catch(e){} }
    const t=box.querySelector('canvas.tv'); if(t&&t.style.transform&&t.style.opacity==='1'){ const d=new DOMMatrix(t.style.transform), w=parseFloat(t.style.width), h=parseFloat(t.style.height);
      { up('LT',t,true); g.generateMipmap(g.TEXTURE_2D); const M=inv3([d.m11,d.m21,d.m41,d.m12,d.m22,d.m42,d.m14,d.m24,d.m44]);
        g.uniformMatrix3fv(F.HT,false,[M[0]/w,M[3]/h,M[6],M[1]/w,M[4]/h,M[7],M[2]/w,M[5]/h,M[8]]);
        g.uniform1f(F.bT,parseFloat((t.style.filter.match(/blur\(([\d.]+)/)||[])[1]||1)); g.uniform1f(F.hT,1); } } }
  const size=()=>{ const [x,y,w,h,W,H]=rect(sc), D=Math.min(devicePixelRatio||1,2,Math.sqrt(3.6e6/(W*H))); const a=Math.round(W*D), b=Math.round(H*D); if(cv.width!==a||cv.height!==b){ cv.width=a; cv.height=b; } g.viewport(0,0,a,b);
    let cx=W/2; if(me==='home'&&!small){ const l=document.querySelector('.leafbg'); cx=((l?l.getBoundingClientRect().right:W*.37)+W)/2; }
    if(me==='home'&&!small){ const l=document.querySelector('.leafbg'), b=sc.getBoundingClientRect(), k=l?Math.max(0,(l.getBoundingClientRect().right-b.left)/b.width-.01):0; g.enable(g.SCISSOR_TEST); g.scissor(Math.floor(a*k),0,a,cv.height); } g.uniform2f(uS,W,H); g.uniform4f(uR,x,y,w,h); g.uniform2f(uC,cx,H*.46); };
  size(); addEventListener('resize',size);
  return {cv,size,draw(b,k,t,a){ live(); g.uniform1f(uB,b); g.uniform1f(uK,k); g.uniform1f(uT,t); g.uniform1f(uA,a||0); g.drawArrays(g.TRIANGLES,0,3); },
    kill(){ removeEventListener('resize',size); cv.remove(); const x=g.getExtension('WEBGL_lose_context'); x&&x.loseContext(); }};
}
const inv3=([a,b,c,d,e,f,g,h,i])=>{ const A=e*i-f*h,B=f*g-d*i,C=d*h-e*g,D=a*A+b*B+c*C; return [A,c*h-b*i,b*f-c*e,B,a*i-c*g,c*d-a*f,C,b*g-a*h,a*e-b*d].map(v=>v/D); };
const wait=ms=>new Promise(r=>setTimeout(r,ms)), fr=()=>new Promise(r=>requestAnimationFrame(r));
const run=(ms,f)=>new Promise(ok=>{ let t0=0; const end=setTimeout(ok,ms+2500); requestAnimationFrame(function s(n){ t0=t0||n; const k=Math.min(1,(n-t0)/ms); f(k); k<1?requestAnimationFrame(s):(clearTimeout(end),ok()); }); });
const ss=(a,b,x)=>{ x=Math.max(0,Math.min(1,(x-a)/(b-a))); return x*x*(3-2*x); };
const PULL=.34, DIVE=.30, MIST=2.2, SIDE=.012;
let busy=!!mode;
const arm=()=>cam||(cam=off?Promise.reject(0):camera()); const quiet=p=>{ p.catch(()=>{}); return p; };

async function ready(){ let c=null; try{ c=await Promise.race([quiet(arm()),wait(4000).then(()=>{ throw 0; })]); }catch(e){}
  if(c){ await fr(); c.size(); c.draw(PULL,MIST,0,SIDE); c.cv.style.opacity=1; await fr(); }
  root.classList.add('gl'); return c; }
async function arrive(c){ pace();
  if(!c){ root.classList.add('in','lit'); await wait(900); }
  else{ setTimeout(()=>root.classList.add('in'),ARRIVE*.36);
    await run(ARRIVE,k=>{ const e=1-Math.pow(1-k,2.3); /* glide, long soft landing */ c.draw(PULL*(1-e),MIST*Math.pow(1-ss(-.22,.86,k),2)/Math.pow(1-ss(-.22,.86,0),2),k*ARRIVE/1000,SIDE*(1-e)); });
    c.draw(0,0,ARRIVE/1000,0); root.classList.add('lit'); c.cv.classList.add('done'); await wait(420); c.kill(); }
  cam=null; root.classList.remove('arr','in','lit','gl'); root.classList.add('arrived'); busy=false; prep();
  const w=TOP.FILMPEND; TOP.FILMPEND=null; if(w&&w.k!==me) leave(w.k,w.href); /* a ribbon pressed on the way */
}
const inkeep=()=>{ if(TOP.FILMROOM) return TOP.FILMROOM; /* the one keeper of frames, in the outermost page */
  const R=TOP.FILMROOM={now:null,next:null,
    open(k,href){ if(R.next&&R.next.k===k) return R.next; if(R.next) R.next.el.remove();
      const el=TOP.document.createElement('iframe'); el.className='room'; el.name='room-'+Date.now()+'-'+(R.n=(R.n||0)+1); /* a name of its own: the browser's history must never send this frame elsewhere by itself */ el.dataset.film=k; el.setAttribute('title','Page'); el.tabIndex=-1; el.src=href;
      const n=R.next={k,el,href,up:new Promise((ok,no)=>{ el.onload=()=>{ try{ const F=el.contentWindow.FILM; F&&F.ready?F.ready.then(ok,no):no(); }catch(e){ no(); } }; el.onerror=no; })}; quiet(n.up);
      n.up.then(()=>{ if(R.next===n) el.style.opacity=.004; },()=>{}); /* painted ahead of time: at opacity 0 the browser would draw it only when shown */
      TOP.document.body.appendChild(el); return n; },
    drop(){ if(R.next){ R.next.el.remove(); R.next=null; } } };
  return R; };
const desk=()=>child||(!small&&innerWidth>900); /* a room in a frame never navigates itself */
/* Madi keeps breathing in the same rhythm while the page under him changes */
function sameMadi(od,nd){ try{ for(const q of ['.fig','.gr','.sheen']){ const a=od.querySelector('.madi '+q), b=nd.querySelector('.madi '+q); if(!a||!b) continue; const x=a.getAnimations()[0], y=b.getAnimations()[0]; if(x&&y) y.currentTime=x.currentTime; }
  const t=od.querySelector('.madi .tilt'), u=nd.querySelector('.madi .tilt'); if(t&&u){ u.style.transition='none'; u.style.cssText+=';'+t.style.cssText; u.getBoundingClientRect(); u.style.transition=''; } }catch(e){} }
async function leave(k,href,back){
  busy=true; set('trips',String((+get('trips')||0)+1)); pace(); TOP.FILMPEND=null; const guard=setTimeout(()=>{ if(root.classList.contains('leaving')) plain(); },10500); const R=desk()?inkeep():null, n=R&&R.open(k,href);
  function plain(){ clearTimeout(guard); if(R) R.drop(); TOP.location.href=href; }
  let c=null; try{ c=await Promise.race([quiet(arm()),wait(700).then(()=>{ throw 0; })]); }catch(e){}
  if(!c){ plain(); return; }
  if(scrollY>4){ scrollTo({top:0,behavior:'smooth'}); await wait(420); }
  if(!R) warm(k); c.size(); c.draw(0,0,0,0); await fr(); c.cv.style.transition='opacity .2s linear'; c.cv.style.opacity=1; root.classList.add('leaving');
  await run(LEAVE,x=>{ const e=x*x*(.45+.55*x); c.draw(-DIVE*e,MIST*Math.pow(ss(.1,1.1,x)/ss(.1,1.1,1),2.1),-(1-x)*LEAVE/1000,0); });
  if(!R){ clearTimeout(guard); set('film',String(Date.now())); location.href=href; return; }
  try{ await Promise.race([n.up,wait(6000).then(()=>{ throw 0; })]); }catch(e){ plain(); return; }
  if(R.next!==n){ plain(); return; }
  const w=n.el.contentWindow, old=R.now; R.now=n; R.next=null;
  if(!back) TOP.history.pushState({film:k},'',href); TOP.document.title=w.document.title;
  sameMadi(document,w.document); w.FILM.enter(); 
  const A=n.el.animate([{opacity:.004},{opacity:1}],{duration:400,fill:'forwards'}); await Promise.race([A.finished,wait(2500)]); n.el.style.opacity=1; A.cancel(); await fr(); await fr(); await wait(60); /* only when it fully covers the old room */
  n.el.style.pointerEvents='auto'; n.el.tabIndex=0; try{ w.focus(); }catch(e){}
  clearTimeout(guard); c.kill(); cam=null; root.classList.remove('leaving');
  if(old) old.el.remove(); else{ root.classList.add('under'); busy=false; }
}
/* get the camera ready once the page is idle and the visitor reaches for a room */
function prep(){ if(off) return; const go=()=>{ if(!busy) quiet(arm()); }; document.querySelectorAll('.ribbons,.shelf,.brand,.crumb').forEach(n=>['pointerenter','focusin','touchstart'].forEach(t=>n.addEventListener(t,go,{once:true,passive:true}))); }
const warmed={}; function warm(k){ if(warmed[k]) return; warmed[k]=1; const add=(h,as)=>{ const l=document.createElement('link'); l.rel='prefetch'; l.href=h; if(as) l.as=as; document.head.appendChild(l); }; add('depth/'+ROOMS[k]+'.webp','image'); add((k==='home'?'index':k)+'.html'); }
const target=a=>{ if(!a||a.target==='_blank') return null; const u=new URL(a.href,location.href); if(u.origin!==location.origin||u.hash||u.search) return null;
  const k=(u.pathname.split('/').pop()||'index.html').replace('.html','').replace('index','home'); return ROOMS[k]&&k!==me?k:null; };
addEventListener('click',e=>{ if(off||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey) return; const a=e.target.closest&&e.target.closest('a[href]'), k=target(a); if(!k){ const h=child&&a&&a.target!=='_blank'&&a.getAttribute('href'); /* in-page links: scroll, leave the history alone */
    if(h&&h[0]==='#'){ e.preventDefault(); const t=h.length>1&&document.getElementById(h.slice(1)); t&&t.scrollIntoView({behavior:'smooth'}); } return; } e.preventDefault(); clearTimeout(dwell); if(!busy) leave(k,a.href); else TOP.FILMPEND={k,href:a.href}; });
let dwell; addEventListener('pointerover',e=>{ const k=!off&&e.target.closest&&target(e.target.closest('a[href]')); clearTimeout(dwell); if(!k||busy) return; if(!desk()) warm(k); else{ const h=e.target.closest('a[href]').href; dwell=setTimeout(()=>{ if(!busy){ quiet(arm()); inkeep().open(k,h); } },140); } },{passive:true});
addEventListener('pageshow',e=>{ if(!e.persisted) return; root.classList.remove('leaving'); TOP.FILMPEND=null; set('film',null); if(cam) cam.then(c=>c.kill(),()=>{}); cam=null; busy=false; prep(); });
window.FILM={rooms:off?{}:ROOMS,leaving:()=>root.classList.contains('leaving'),cam:camera,go:leave,busy:()=>busy};
if(child){ const b=document.createElement('base'); b.target='_top'; document.head.appendChild(b); }
else addEventListener('popstate',()=>{ const R=TOP.FILMROOM; if(!R) return; const k=(location.pathname.split('/').pop()||'index.html').replace('.html','').replace('index','home'), on=R.now?R.now.k:me;
  if(!ROOMS[k]){ location.reload(); return; } if(k===on) return; const F=R.now?R.now.el.contentWindow.FILM:window.FILM;
  if(F.busy()||!desk()) location.reload(); else F.go(k,location.href,true); });
document.addEventListener('DOMContentLoaded',()=>{ if(off) return; if(child){ const p=ready(); let came=false; FILM.ready=p; FILM.enter=()=>{ came=true; return p.then(arrive); };
    /* safety net: loaded straight into the room already on screen (nobody will call enter) */
    const own=()=>{ const R=TOP.FILMROOM; return R&&R.now&&R.now.el===window.frameElement; };
    if(own()&&!came){ const R=TOP.FILMROOM; R.now.k=me; R.now.el.dataset.film=me; R.drop(); TOP.document.title=document.title; FILM.enter(); }
    /* whatever happens, a room on screen is never left waiting */
    setInterval(()=>{ if(!own()||!root.classList.contains('arr')) { own.t=0; return; } own.t=(own.t||0)+1; if(own.t>7){ if(cam) cam.then(c=>c.kill(),()=>{}); cam=null; root.classList.remove('arr','in','lit','gl','leaving'); root.classList.add('arrived'); busy=false; own.t=0; prep(); } },1000); } else mode?ready().then(arrive):prep(); });
})();

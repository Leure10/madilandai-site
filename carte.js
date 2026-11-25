/* The book on the page: a real book turned in WebGL2, whose pictures the visitor colors.
   Every picture is split beforehand into its closed areas (r<page>.bin); a tap floods one area from the point touched. */
(function(){
const root=document.querySelector('.bk3d'); if(!root) return;
const DIR=root.dataset.dir, D=JSON.parse(document.getElementById('bookdata').textContent), V='?v='+root.dataset.v;
const cv=root.querySelector('canvas'), stage=document.querySelector('.bkhero'), $=s=>stage.querySelector(s);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const KIND=D.kind||'color', HR=D.h||1, WRITE=KIND==='write', SEARCH=KIND==='search', READ=KIND==='read';
D.plates=D.plates||{}; D.fields=D.fields||{}; D.grids=D.grids||{}; D.sample=D.sample||{}; D.text=D.text||{};
const N=1024, [BX,BY,BS]=D.box||[0,0,1], LEAVES=D.leaves, n=LEAVES.length; /* leaf = [front page, back page]; base = last right page */
/* what the visitor does on the pages lasts as long as the tab; on this device it stays only if they ask (the line under the shop panel) */
const SK='color:'+D.id, box=k=>{ try{ return window[k]; }catch(e){ return null; } }, LS=box('localStorage'), SS=box('sessionStorage');
let kept=false; try{ kept=!!(LS&&LS.getItem(SK)); }catch(e){}
const store={get(){ try{ return JSON.parse((kept?LS:SS).getItem(SK))||{}; }catch(e){ return {}; } },set(v){ try{ (kept?LS:SS).setItem(SK,JSON.stringify(v)); }catch(e){} }};
(function(){ const p=document.querySelector('.keep'); if(!p) return; const t=p.querySelector('span'), b=p.querySelector('button'); const up=()=>{ t.textContent=kept?'Your pages are kept on this device until you erase them.':'What you add to the pages stays in this browser and is gone when you close the tab.'; b.textContent=kept?'Erase my pages':'Keep my pages on this device'; }; up();
b.onclick=()=>{ try{ if(kept){ LS.removeItem(SK); kept=false; SS.setItem(SK,JSON.stringify(saved)); } else { kept=true; LS.setItem(SK,JSON.stringify(saved)); SS.removeItem(SK); } }catch(e){} up(); if(!kept) t.textContent='Erased from this device. They are still open in this tab until you close it.'; }; })();
let saved=store.get();
const gl=cv.getContext('webgl2',{alpha:true,antialias:true,premultipliedAlpha:true});
stage.querySelectorAll('.flatset img').forEach(i=>i.addEventListener('error',()=>{ i.remove(); const p=stage.querySelector('.lost'); if(p) p.hidden=false; }));
if(!gl||!window.DecompressionStream){ stage.classList.add('flat'); return; }

/* ---------- pictures ---------- */
/* a picture that does not come is said once, in words */
function lost(){ const p=document.querySelector('.lost'); if(p) p.hidden=false; }
const phone0=matchMedia('(max-width:759px)').matches;
const P={}; /* page -> {tex, plate} */
function newTex(mip){ const t=gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,t); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,mip?gl.LINEAR_MIPMAP_LINEAR:gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR); return t; }
const solid=c=>{ const t=newTex(); gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array(c)); return t; };
const WHITE=solid([255,255,255,255]), CLEAR=solid([0,0,0,0]);
const aniso=gl.getExtension('EXT_texture_filter_anisotropic');
function page(k){ if(!k) return Promise.resolve(); if(P[k]) return P[k].up; const o=P[k]={tex:null};
  return o.up=new Promise((ok,no)=>{ const i=new Image(); i.decoding='async'; i.onload=()=>(i.decode?i.decode().catch(()=>{}):Promise.resolve()).then(()=>{ o.tex=newTex(true); gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,i); gl.generateMipmap(gl.TEXTURE_2D);
      if(aniso) gl.texParameterf(gl.TEXTURE_2D,aniso.TEXTURE_MAX_ANISOTROPY_EXT,8); wake(); ok(o); }); i.onerror=()=>{ delete P[k]; lost(); no(); }; i.src=DIR+(k==='cover'?(phone0?'cover-700':'cover'):'p'+k)+'.webp'+V; }); }
const plates={};
function plate(k){ if(!D.plates[k]) return Promise.resolve(null); if(plates[k]) return plates[k].up; const o=plates[k]={k,n:D.plates[k].n};
  return o.up=(async()=>{ const r=await fetch(DIR+'r'+k+'.bin'+V); if(!r.ok) throw 0; const b=new Uint8Array(await new Response(r.body.pipeThrough(new DecompressionStream('deflate'))).arrayBuffer());
    const m=o.map=new Uint16Array(N*N); let i=0,p=0; const v=()=>{ let x=0,s=0,c; do{ c=b[i++]; x|=(c&127)<<s; s+=7; }while(c>127); return x; };
    while(i<b.length){ const a=v(), l=v(); m.fill(a,p,p+l); p+=l; }
    o.px=new Uint8Array(N*N*4); o.col={}; const g=new Uint8Array(N*N*4), hx=D.plates[k].c, pal=new Uint32Array(o.n+1);
    for(let j=1;j<=o.n;j++){ const h=parseInt(hx.slice((j-1)*6,j*6),16); pal[j]=(0xff000000|((h&255)<<16)|(h&0xff00)|(h>>16))>>>0; }
    const g32=new Uint32Array(g.buffer), p32=new Uint32Array(o.px.buffer); const mine=saved[k]||{};
    for(const j in mine){ o.col[j]=mine[j]; } const own=new Uint32Array(o.n+1); for(const j in o.col) own[j]=hex32(o.col[j]);
    for(let q=0;q<m.length;q++){ const a=m[q]; if(a){ g32[q]=pal[a]; if(own[a]) p32[q]=own[a]; } }
    o.p32=p32; o.tex=newTex(); gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,N,N,0,gl.RGBA,gl.UNSIGNED_BYTE,o.px);
    o.guide=newTex(); gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,N,N,0,gl.RGBA,gl.UNSIGNED_BYTE,g); o.w=0; o.wt=0; wake(); return o; })().catch(e=>{ delete plates[k]; return null; }); }
const hex32=h=>{ const x=parseInt(h.slice(1),16); return (0xff000000|((x&255)<<16)|(x&0xff00)|(x>>16))>>>0; };

/* ---------- coloring ---------- */
let crayon=(D.crayons||[{c:'#000'}])[0], undo=[];
const flows=[];
function areaAt(o,x,y){ let a=o.map[y*N+x]; if(a) return [a,x,y]; for(let r=2;r<16;r+=2) for(let t=0;t<16;t++){ const u=Math.round(x+r*Math.cos(t*.3927)), w=Math.round(y+r*Math.sin(t*.3927)); if(u>=0&&w>=0&&u<N&&w<N&&(a=o.map[w*N+u])) return [a,u,w]; } return null; }
function flood(o,a,x,y,color,quiet){ for(let i=flows.length;i--;) if(flows[i].o===o&&flows[i].a===a){ step(flows[i],1e9); flows.splice(i,1); }
  if(!quiet) undo.push([o.k,a,o.col[a]||null,x,y]); if(undo.length>200) undo.shift();
  if(color) o.col[a]=color; else delete o.col[a];
  saved[o.k]=o.col; store.set(saved);
  /* the order in which the color spreads: outward from the touch, staying inside the area */
  const m=o.map, seen=new Uint8Array(N*N), q=[y*N+x]; seen[q[0]]=1;
  for(let h=0,end=1,lv=0;h<q.length;lv++){ const ds=lv%5<2?[1,-1,N,-N,N+1,N-1,-N+1,-N-1]:[1,-1,N,-N]; /* straight and diagonal steps in turn: the color spreads as a round stain */
    for(;h<end;h++){ const c=q[h], cx=c%N; for(const d of ds){ const w=c+d; if(w<0||w>=N*N||seen[w]||m[w]!==a||Math.abs(w%N-cx)>1) continue; seen[w]=1; q.push(w); } } end=q.length; }
  if(q.length<o.map.length) for(let p=0;p<m.length;p++) if(m[p]===a&&!seen[p]) q.push(p); /* parts of the area parted by the grown lines */
  let y0=N,y1=0; for(const p of q){ const r=(p/N)|0; if(r<y0) y0=r; if(r>y1) y1=r; }
  flows.push({o,a,q,i:0,c:color?hex32(color):0,t:0,ms:reduce?1:Math.min(1100,260+Math.sqrt(q.length)*2.4),y0,y1}); wake(); ui(); }
function step(f,dt){ f.t+=dt; const k=Math.min(1,f.t/f.ms), e=k<1?1-Math.pow(1-k,2):1, to=Math.round(f.q.length*e); for(;f.i<to;f.i++) f.o.p32[f.q[f.i]]=f.c;
  gl.bindTexture(gl.TEXTURE_2D,f.o.tex); gl.texSubImage2D(gl.TEXTURE_2D,0,0,f.y0,N,f.y1-f.y0+1,gl.RGBA,gl.UNSIGNED_BYTE,f.o.px,f.y0*N*4); return k>=1; }

/* ---------- the book ---------- */
const VS=`#version 300 es
precision highp float;
in vec2 a; out vec2 uv; out vec3 nn; out vec3 wp; out float lf;
uniform mat4 M; uniform float T,Z0,Z1,HR; uniform vec4 Q; uniform int K; uniform vec2 H;
/* K 0: a leaf bending from right (T=0) to left (T=1); 1: plain rectangle Q at height Z0; 2: side of the block */
void main(){ vec3 p; nn=vec3(0,0,1); uv=vec2(a.x,1.-a.y); lf=0.;
 if(K==0){ float t=clamp(T+ .07*(1.-a.y)*sin(3.14159*T),0.,1.); float x=0.,z=0.,f=0.; const int S=24; float ds=a.x/float(S);
   const float W=.62; for(int i=0;i<S;i++){ float s=(float(i)+.5)*ds; float u=clamp(t*(1.+W)-W*(1.-s),0.,1.); u=u*u*(3.-2.*u); f=3.14159265*u; x+=cos(f)*ds; z+=sin(f)*ds; }
   float u=clamp(t*(1.+W)-W*(1.-a.x),0.,1.); u=u*u*(3.-2.*u); f=3.14159265*u;
   p=vec3(x,(a.y-.5)*HR,z+mix(Z0,Z1,T)); nn=vec3(-sin(f),0.,cos(f)); lf=f; }
 else if(K==1){ p=vec3(mix(Q.x,Q.z,a.x),mix(Q.y,Q.w,a.y),Z0); }
 else { p=vec3(mix(Q.x,Q.z,a.x),mix(Q.y,Q.w,a.x),mix(Z0,Z1,a.y)); nn=vec3(H,0.); }
 wp=p; gl_Position=M*vec4(p,1.); }`;
const FS=`#version 300 es
precision highp float;
in vec2 uv; in vec3 nn; in vec3 wp; in float lf; out vec4 o;
uniform sampler2D F,B,C,G,O,OB; uniform float dim; uniform vec2 OV; uniform vec3 X; uniform vec2 W; uniform int mode; uniform float side,wv,cover; uniform vec4 SH; uniform vec3 tint; uniform vec2 px; uniform vec4 hov;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float ns(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
void main(){
 if(mode==1){ /* shadow on the desk */ vec2 d=max(abs(wp.xy-SH.xy)-SH.zw,0.); float r=length(d); float s=.40*exp(-r*r*70.)+.26*exp(-r*r*8.); o=vec4(0,0.012,0.02,1)*s; return; }
 if(mode==2){ /* paper edges */ float l=.80+.2*h(vec2(floor((uv.y)*26.),3.)); vec3 c=tint*l*(nn.y<0.?.86:.94); o=vec4(c,1); return; }
 bool fr=gl_FrontFacing; vec3 nrm=fr?nn:-nn; vec2 q=fr?uv:vec2(1.-uv.x,uv.y);
 vec3 c=fr?texture(F,q).rgb:texture(B,q).rgb;
 float paper=(cover>.5&&fr)?0.:1.;
 if((W.x>.5&&fr)||(W.y>.5&&!fr)){ /* wax on paper */
  vec2 z=(q-X.xy)/X.z; if(min(z.x,z.y)>0.&&max(z.x,z.y)<1.){
   vec4 m=texture(C,z); if(wv>0.){ vec4 g=texture(G,z); float r=distance(z,vec2(.5)); float e=wv*1.0-r+(ns(z*9.)-.5)*.22; float k=smoothstep(-.02,.05,e); m=mix(m,g,k); }
   float gr=ns(z*vec2(330.,210.)+ns(z*40.)*3.)*.6+ns(z*720.)*.4; float st=ns(vec2((z.x+z.y)*150.,(z.x-z.y)*16.));
   float al=m.a>0.004?clamp(.80+.34*(gr-.18)+.16*(st-.4),0.,1.)*m.a:0.; vec3 w=m.a>0.004?m.rgb/m.a:vec3(1);
   w*=.965+.07*st; c*=mix(vec3(1),min(w,1.),al);
   if(hov.w>.5){ } } }
 if(fr&&OV.x>.5){ vec4 i=texture(O,q); c=c*(1.-i.a)+i.rgb; } if(!fr&&OV.y>.5){ vec4 i=texture(OB,q); c=c*(1.-i.a)+i.rgb; }
 /* light from the upper left, a soft fall toward the spine */
 vec3 L=normalize(vec3(-.35,.35,1.)); float df=max(dot(normalize(nrm),L),0.)/.90; float li=mix(.60,1.,clamp(df,0.,1.));
 float dsp=fr?uv.x:uv.x; float gut=1.-.30*exp(-dsp*26.)-.10*exp(-dsp*7.); if(cover>.5&&fr) gut=1.-.22*exp(-pow((dsp-.028)*110.,2.))-.06*exp(-dsp*18.);
 c*=li*gut;
 if(paper>.5) c*=vec3(1.,.992,.972);
 else { float sp=pow(max(dot(normalize(nrm),normalize(vec3(-.3,.55,1.))),0.),40.); c+=sp*.05; }
 /* shadow of a leaf in the air */
 if(SH.x>.001){ float ex=SH.y; float d=side>0.?(ex-wp.x):(wp.x-ex); float k=smoothstep(-.10-.25*SH.z,.06+.3*SH.z,d); c*=1.-.34*SH.x*k*(1.-.4*SH.z); }
 if(side!=0.){ float e=1.-uv.x; c*=1.-.05*exp(-e*60.); }
 if(dim>0.) c=mix(c,c*vec3(.74,.655,.53),dim);
 o=vec4(c,1);
}`;
const sh=(t,s)=>{ const x=gl.createShader(t); gl.shaderSource(x,s); gl.compileShader(x); if(!gl.getShaderParameter(x,gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(x)); return x; };
const pr=gl.createProgram(); gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS)); gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS)); gl.bindAttribLocation(pr,0,'a'); gl.linkProgram(pr); gl.useProgram(pr);
const U={}; for(const k of ['M','T','Z0','Z1','Q','K','H','F','B','C','G','X','W','mode','side','wv','cover','SH','tint','hov','HR','OV','dim']) U[k]=gl.getUniformLocation(pr,k);
['F','B','C','G','O','OB'].forEach((k,i)=>{ if(!U[k]) U[k]=gl.getUniformLocation(pr,k); gl.uniform1i(U[k],i); }); gl.uniform1f(U.HR,HR); gl.uniform2f(U.OV,0,0); gl.uniform3f(U.X,BX,BY,BS);
const GX=48,GY=10, vb=[], ib=[]; for(let y=0;y<=GY;y++) for(let x=0;x<=GX;x++) vb.push(x/GX,y/GY);
for(let y=0;y<GY;y++) for(let x=0;x<GX;x++){ const i=y*(GX+1)+x; ib.push(i,i+1,i+GX+1,i+1,i+GX+2,i+GX+1); }
gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vb),gl.STATIC_DRAW); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,gl.createBuffer()); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(ib),gl.STATIC_DRAW);
const draw=()=>gl.drawElements(gl.TRIANGLES,ib.length,gl.UNSIGNED_SHORT,0);
gl.enable(gl.DEPTH_TEST); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);

/* state: cur = how many leaves are turned; view = which page a phone looks at (-1 left, 1 right) */
const leaf=LEAVES.map(()=>({t:0,to:0,v:0})); let cur=0, view=1, drag=null, raf=0, last=0, M=null, Mi=null;
const cam={x:.5,y:0,s:1,tilt:.30}, camTo={x:.5,y:0,s:1,tilt:.30};
let W=0,HH=0,dpr=1, zoom=null, dimNow=0, dimTo=0;
const phone=()=>W<760;
function size(){ const r=cv.parentNode.getBoundingClientRect(); W=r.width; HH=r.height; dpr=Math.min(devicePixelRatio||1,2,Math.sqrt(7e6/(W*HH))); cv.width=Math.round(W*dpr); cv.height=Math.round(HH*dpr); gl.viewport(0,0,cv.width,cv.height); frameTo(true); wake(); }
/* where the book may sit, in css px of the stage */
function room(){ const closed=cur===0; const st=cv.getBoundingClientRect(), top=phone()?74:104;
  if(closed){ if(phone()) return {x:W/2,y:HH/2+8,w:W*.72,h:HH-120,top}; const L=$('.bkcopy').getBoundingClientRect().right-st.left; return {x:(L+W)/2-38,y:HH*.535,w:Math.min(W-L-240,HH*.72),h:HH*(HR>1.1?.74:.70)}; }
  const b=phone()?HH-62:$('.tray').offsetTop-22; return {x:W/2,y:(top+b)/2,w:W-(phone()?28:210),h:b-top}; }
function frameTo(snap){ const r=room(), closed=cur===0; const wide=closed||phone()?1:2;
  let unit=Math.min(r.w/wide,r.h/(closed?1:.97)/HR); camTo.s=unit; camTo.x=closed?.5:phone()?.5*view:0; camTo.y=0; camTo.px=r.x; camTo.py=r.y; camTo.tilt=closed?.20:HR>1.1?.09:.13; camTo.yaw=closed?-.20:0;
  if(zoom&&!closed){ /* the page comes closer, centered where the visitor is working */
    let z=Math.min(W*(phone()?1.5:.62),Math.max(unit*1.75,phone()?W*1.45:720)); if(zoom.w) z=Math.max(unit,Math.min(z,r.w/(zoom.w+.05))); camTo.s=z; const hw=Math.min(.5,(r.w/2)/z), hh=r.h/2/z; camTo.x=phone()?zoom.x>0?Math.min(1-hw+.02,Math.max(hw-.02,zoom.x)):Math.max(-1+hw-.02,Math.min(-hw+.02,zoom.x)):zoom.x>0?.5:-.5; const lim=Math.max(0,HR/2-hh+.03); camTo.y=Math.max(-lim,Math.min(lim,zoom.y)); camTo.tilt=.04; }
  if(snap||reduce) Object.assign(cam,camTo); }
/* a gentle perspective: matrix from book space to clip space */
function mat(){ const f=5.2, c=Math.cos(cam.tilt), s=Math.sin(cam.tilt), cy=Math.cos(cam.yaw||0), sy=Math.sin(cam.yaw||0);
  /* world -> view: move, yaw about y, tilt about x */
  const R=[cy,0,sy, 0,1,0, -sy,0,cy], T=[1,0,0, 0,c,s, 0,-s,c]; /* rows */
  const m=[0,1,2].map(i=>[0,1,2].map(j=>T[i*3]*R[j]+T[i*3+1]*R[3+j]+T[i*3+2]*R[6+j]));
  const sx=2*cam.s/W, syy=2*cam.s/HH, ox=2*cam.px/W-1, oy=1-2*cam.py/HH, x0=-cam.x, y0=-cam.y;
  const row=i=>[m[i][0],m[i][1],m[i][2],m[i][0]*x0+m[i][1]*y0];
  const X=row(0),Y=row(1),Z=row(2); const w=[-Z[0]/f,-Z[1]/f,-Z[2]/f,1-Z[3]/f];
  const cx=X.map((v,i)=>v*sx+w[i]*ox), cyy=Y.map((v,i)=>v*syy+w[i]*oy), cz=Z.map((v,i)=>-v*.25+w[i]*0);
  return [cx,cyy,cz,w]; }
/* page point under the pointer (book plane z=zp) */
function hit(e){ const r=cv.getBoundingClientRect(), nx=(e.clientX-r.left)/r.width*2-1, ny=1-(e.clientY-r.top)/r.height*2, z=.004;
  const [a,b,,w]=M; const A=a[0]-nx*w[0],B=a[1]-nx*w[1],C=-(a[2]*z+a[3])+nx*(w[2]*z+w[3]), E=b[0]-ny*w[0],F=b[1]-ny*w[1],G=-(b[2]*z+b[3])+ny*(w[2]*z+w[3]); const d=A*F-B*E; return [(C*F-B*G)/d,(A*G-C*E)/d]; }
const rightPage=()=>cur<n?LEAVES[cur][0]:D.base, leftPage=()=>cur>0?LEAVES[cur-1][1]:null;
const THK=.052, EPS=.0009;
function bindPage(unit,k){ gl.activeTexture(gl.TEXTURE0+unit); const o=k&&P[k]; gl.bindTexture(gl.TEXTURE_2D,o&&o.tex||WHITE); }
function bindInk(a,b){ const x=ink(a), y=ink(b); gl.uniform2f(U.OV,x?1:0,y?1:0); gl.activeTexture(gl.TEXTURE4); gl.bindTexture(gl.TEXTURE_2D,x?x.tex:CLEAR); gl.activeTexture(gl.TEXTURE5); gl.bindTexture(gl.TEXTURE_2D,y?y.tex:CLEAR); }
function bindPlate(k,v){ const bk=!!(v&&D.plates[v]); const o=plates[bk?v:k]; const on=o&&o.tex; gl.uniform2f(U.W,on&&!bk?1:0,on&&bk?1:0); gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D,on?o.tex:CLEAR); gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D,on?o.guide:CLEAR); gl.uniform1f(U.wv,on?o.w:0); }
function render(){ const m=mat(); M=m; gl.uniformMatrix4fv(U.M,false,new Float32Array([0,1,2,3].flatMap(j=>[m[0][j],m[1][j],m[2][j],m[3][j]])));
  gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  const open=leaf[0].t, done=leaf.reduce((s,l)=>s+l.t,0), hl=THK*.1+THK*(done/ n)*.55, hr=THK-THK*(done/n)*.5;
  const base=-THK-.004, xl=open>.5?-1:0;
  /* desk shadow */
  gl.uniform1i(U.mode,1); gl.uniform1i(U.K,1); gl.uniform1f(U.Z0,base-.02); gl.depthMask(false);
  const ox=open*open*(3-2*open), cx=.5-.5*ox, hw=.5+.5*ox; gl.uniform4f(U.Q,-2.2,-1.5*HR,2.2,1.5*HR); gl.uniform4f(U.SH,cx+.02,-.035,hw-.03,.5*HR-.03); draw(); gl.depthMask(true);
  /* blocks of pages */
  const Y=HR/2, SP=D.spine||[.10,.24,.47]; gl.uniform1f(U.dim,dimNow); gl.uniform2f(U.OV,0,0);
  const block=(x0,x1,h)=>{ gl.uniform1i(U.mode,2); gl.uniform1i(U.K,2); gl.uniform3f(U.tint,.93,.92,.89); gl.uniform1f(U.Z0,-h); gl.uniform1f(U.Z1,-.0006);
    for(const [q,nm] of [[[x0,-Y,x1,-Y],[0,-1]],[[x1,-Y,x1,Y],[1,0]],[[x0,Y,x1,Y],[0,1]],[[x0,-Y,x0,Y],[-1,0]]]){ gl.uniform4f(U.Q,...q); gl.uniform2f(U.H,...nm); draw(); }
    /* the cover sheet under them */
    gl.uniform3f(U.tint,...SP); gl.uniform1f(U.Z0,-h-.006); gl.uniform1f(U.Z1,-h); for(const [q,nm] of [[[x0,-Y,x1,-Y],[0,-1]],[[x1,-Y,x1,Y],[1,0]]]){ gl.uniform4f(U.Q,...q); gl.uniform2f(U.H,...nm); draw(); } };
  block(0,1,hr); if(open>.995) block(-1,0,hl);
  gl.uniform1i(U.mode,0);
  /* the leaf in the air that throws a shadow */
  let sA=0,sX=0,sZ=0; leaf.forEach(l=>{ if(l.t>.002&&l.t<.998){ const a=Math.sin(Math.PI*l.t); if(a>sA){ sA=a; sX=Math.cos(Math.PI*l.t); sZ=a; } } });
  const flat=(k,x0,x1,z,sd)=>{ gl.uniform1i(U.K,1); gl.uniform1f(U.Z0,z); gl.uniform4f(U.Q,x0,-Y,x1,Y); };
  gl.uniform1f(U.cover,0); gl.uniform1f(U.side,0);
  /* last right page */
  gl.uniform4f(U.SH,sA,sX,sZ,0); gl.uniform1f(U.side,1); bindPage(0,D.base); bindPage(1,null); bindPlate(D.base); bindInk(D.base,null); flat(D.base,0,1,0); draw();
  const order=[...leaf.keys()];
  for(const i of order){ const l=leaf[i], vis=(l.t>.0005&&l.t<.9995)||i===cur||i===cur-1||i===cur+1||i===cur-2||(drag&&Math.abs(i-drag.i)<2); if(!vis) continue;
    gl.uniform1i(U.K,0); gl.uniform1f(U.T,l.t); gl.uniform1f(U.Z0,(n-i)*EPS); gl.uniform1f(U.Z1,(i+1)*EPS); gl.uniform1f(U.cover,i===0?1:0); gl.uniform1f(U.side,l.t<.5?1:-1);
    const still=l.t<.002||l.t>.998; gl.uniform4f(U.SH,still?sA:0,sX,sZ,0);
    bindPage(0,LEAVES[i][0]); bindPage(1,LEAVES[i][1]); bindPlate(LEAVES[i][0],LEAVES[i][1]); bindInk(LEAVES[i][0],LEAVES[i][1]); draw(); }
}
let inLoop=false, again=false;
function wake(){ if(inLoop){ again=true; return; } if(!raf) { last=0; raf=requestAnimationFrame(loop); } }
function loop(now){ raf=0; inLoop=true; again=false; const dt=last?Math.min(50,now-last):16; last=now; let busy=false;
  for(const k of ['x','y','s','tilt','yaw','px','py']){ const d=camTo[k]-cam[k]; if(Math.abs(d)>(k==='s'||k[0]==='p'?.15:.0006)){ cam[k]+=d*(1-Math.exp(-dt/210)); busy=true; } else cam[k]=camTo[k]; }
  leaf.forEach((l,i)=>{ if(drag&&drag.i===i&&drag.on) { busy=true; return; } const hold=l.to>l.t?i>0&&leaf[i-1].t<.3:l.to<l.t?i<n-1&&leaf[i+1].t>.7:false; if(hold&&l.v===0&&!reduce){ busy=true; return; } /* several leaves turn one after another */
    const d=l.to-l.t; if(Math.abs(d)<.0007&&Math.abs(l.v)<.01){ l.t=l.to; l.v=0; return; } busy=true;
    if(reduce){ l.t=l.to; l.v=0; return; }
    const k=26, c=2*Math.sqrt(k)*.98; let s=dt/1000, ss=4; s/=ss; while(ss--){ l.v+=((l.to-l.t)*k-l.v*c)*s; l.t+=l.v*s; } if(l.t<0){ l.t=0; l.v=0; } if(l.t>1){ l.t=1; l.v=0; } });
  for(let i=flows.length;i--;){ busy=true; if(step(flows[i],dt)) flows.splice(i,1); }
  for(const k in plates){ const o=plates[k]; if(!o.tex) continue; const d=o.wt-o.w; if(d){ busy=true; o.w=reduce?o.wt:d>0?Math.min(o.wt,o.w+dt/1300):Math.max(o.wt,o.w-dt/800); } }
  { const d=dimTo-dimNow; if(Math.abs(d)>.004){ dimNow+=d*(1-Math.exp(-dt/260)); busy=true; } else dimNow=dimTo; } if(inkStep(dt)) busy=true;
  render(); inLoop=false; if(busy||again) raf=requestAnimationFrame(loop); else last=0; }

/* ---------- turning ---------- */
const need=c=>{ const l=LEAVES[c-1], r=LEAVES[c]; [l&&l[0],l&&l[1],r&&r[0],r&&r[1],LEAVES[c+1]&&LEAVES[c+1][0]].concat(c>=n?[D.base]:c===n-1?[D.base]:[]).filter(Boolean).forEach(k=>{ page(k).catch(()=>{}); plate(k); }); };
function go(c,v){ if(c!==cur||(v&&v!==view)){ zoom=null; blurField(); } c=Math.max(0,Math.min(n,c)); const ch=c!==cur; cur=c; view=v||1; leaf.forEach((l,i)=>l.to=i<c?1:0); need(c); stage.classList.toggle('open',c>0); if(c>0) stage.classList.add('seen'); frameTo(); ui(); wake(); if(ch) say(); }
function next(){ if(phone()&&cur>0&&view<0) return go(cur,1); if(cur<n) go(cur+1,phone()&&cur>0?-1:1); }
function prev(){ if(phone()&&cur>(LEAVES[0][1]?0:1)-0&&view>0) return go(cur,-1); if(cur>0) go(cur-1,1); }
const pkNow=()=>D.plates[rightPage()]?rightPage():leftPage()&&D.plates[leftPage()]?leftPage():null; /* the picture on this spread, on either side */
const plateNow=()=>{ const k=pkNow(); return k?plates[k]:null; };
const status=$('.status');
function say(){ const l=leftPage(), r=rightPage(); status.textContent=cur===0?'Cover.':KIND!=='color'?[l,r].filter(k=>D.text[k]).map(k=>'Page '+k+': '+D.text[k]).join(' '):(l&&D.text[l]?'Page '+l+': '+D.text[l]+' ':'')+(D.plates[r]?'Page '+r+' is a picture to color.':D.text[r]?'Page '+r+': '+D.text[r]:'')+(l&&D.plates[l]?' Page '+l+' is a picture to color.':''); }
function ui(){ stage.classList.toggle('zoomed',!!zoom&&cur>0); const o=plateNow(); if(KIND!=='color'){ uiKind(); return; } const can=cur>0&&!!pkNow()&&(!phone()||(pkNow()===leftPage()?view<0:view>0||cur<2)); stage.classList.toggle('canc',can); const any=o&&Object.keys(o.col||{}).length; $('.b-undo').disabled=!(undo.length&&undo[undo.length-1][0]===pkNow()); $('.b-clear').disabled=!any;
  const on=o&&o.wt>0; $('.b-show').setAttribute('aria-pressed',on?'true':'false'); $('.b-show span').textContent=on?'My colors':'See it colored';
  uiNav(); }
const hintEl=$('.hint'), hintText=hintEl?hintEl.textContent:'', storySide=()=>{ const p=view<0?leftPage():rightPage(); return KIND==='color'&&phone()&&cur>0&&!!p&&!D.plates[p]&&!!pkNow(); };
function uiNav(){ if(hintEl){ const st=storySide(); hintEl.textContent=st?'Read the page, then swipe to color':hintText; stage.classList.toggle('story',st); } $('.nav.p').disabled=cur===0; $('.nav.n').disabled=cur===n&&(!phone()||view>0);
  const l=leftPage(), r=rightPage(); $('.where').textContent=cur===0?'':KIND!=='color'?(D.days&&D.days[r]?(phone()?D.days[view<0&&l&&D.days[l]?l:r]:D.days[l]?(W<1000?D.days[l].split(', ')[1]+' and '+D.days[r].split(', ')[1]:D.days[l]+' and '+D.days[r]):D.days[r]):phone()?'Page '+(view<0?l||r:r):l?'Pages '+l+' and '+r:'Page '+r):l&&D.plates[l]?(phone()?(view<0?'Page '+l+', yours to color':'Page '+r):'Pages '+l+' and '+r):l&&D.text[l]?(phone()?(view<0?'Page '+l+', the story':'Page '+r+', yours to color'):'Pages '+l+' and '+r):'Page '+r; }

/* ---------- what the visitor does on the paper: writes, solves, reads ---------- */
const INK={}, IW=1200, IH=Math.round(IW*HR); let pen=((D.crayons||[])[0]||{}).c||'#22384f', field=null, showing=false, prog=1, mark=null, flash=null, caret=0, hist=[];
const mine=k=>saved[k]||(saved[k]={});
function hasInk(k){ return !!(k&&((D.fields[k]&&D.fields[k].length)||D.grids[k])); }
function ink(k){ if(!hasInk(k)) return null; let o=INK[k]; if(!o){ if(!needsInk(k)) return null; const c=document.createElement('canvas'); c.width=IW; c.height=IH; o=INK[k]={c,x:c.getContext('2d'),tex:newTex(),dirty:true}; gl.bindTexture(gl.TEXTURE_2D,o.tex); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR); }
  if(o.dirty){ o.dirty=false; paint(k,o); gl.bindTexture(gl.TEXTURE_2D,o.tex); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true); gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,o.c); gl.generateMipmap(gl.TEXTURE_2D); gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false); } return o; }
const needsInk=k=>showing||(field&&field.k===k)||(mark&&mark.k===k)||(flash&&flash.k===k)||(miss&&miss.k===k)||(saved[k]&&Object.keys(saved[k]).length);
function dirty(k){ if(k){ if(INK[k]) INK[k].dirty=true; } else for(const j in INK) INK[j].dirty=true; wake(); }
const spread=()=>(phone()?[view<0&&leftPage()?leftPage():rightPage()]:[leftPage(),rightPage()]).filter(hasInk);
function wrap(x,t,w){ const out=[]; for(const par of String(t).split('\n')){ let l=''; for(const word of par.split(' ')){ const n=l?l+' '+word:word; if(x.measureText(n).width>w&&l){ out.push(l); l=word; } else l=n; } out.push(l); } return out; }
function paint(k,o){ const x=o.x; x.clearRect(0,0,IW,IH); if(SEARCH) paintGrid(k,x); else paintFields(k,x); }
function fit(x,f,v){ let s=f.s*IW; x.font=s+'px Caveat'; const w=f.w*IW-8; if(f.t==='line'){ const m=x.measureText(v).width; if(m>w){ s=Math.max(s*.45,s*w/m); x.font=s+'px Caveat'; } } return s; }
function paintFields(k,x){ const F=D.fields[k], src=showing?(D.sample[k]||{}):mine(k); let left=Infinity; if(showing){ let tot=0; for(const i in src) tot+=src[i]===true?2:String(src[i]).length; left=Math.round(tot*prog); }
  F.forEach((f,i)=>{ const on=field&&field.k===k&&field.i===i&&!showing; if(on){ x.fillStyle='rgba(35,166,158,.13)'; x.fillRect(f.x*IW,f.y*IW,f.w*IW,f.h*IW); }
    let e=src[i]; if(e===undefined&&!on) return; let v=showing?e:(e&&e.v), col=showing?'#23395B':(e&&e.p)||pen; if(v===undefined) v='';
    if(f.t==='check'){ if(v===true&&left>0){ left-=2; let a=f.x*IW,b=f.y*IW,w=f.w*IW,h=f.h*IW; if(w>h*1.25){ a+=(w-h*.8)/2; b+=h*.1; w=h=h*.8; } x.strokeStyle=col; x.lineWidth=Math.max(3.2,h*.16); x.lineCap=x.lineJoin='round'; x.beginPath(); x.moveTo(a+w*.16,b+h*.5); x.quadraticCurveTo(a+w*.34,b+h*.66,a+w*.42,b+h*.86); x.quadraticCurveTo(a+w*.66,b+h*.3,a+w*1.12,b-h*.14); x.stroke(); } return; }
    v=String(v); if(left<Infinity){ const n=v.length; v=v.slice(0,Math.max(0,left)); left-=n; }
    x.fillStyle=col; const s=fit(x,f,v); let cx,cy;
    if(f.t==='multi'){ const L=wrap(x,v,f.w*IW-10); L.slice(0,f.base.length).forEach((t,j)=>x.fillText(t,f.x*IW+6,f.base[j]*IW-s*.16)); const j=Math.min(L.length,f.base.length)-1; cx=f.x*IW+8+x.measureText(L[j]||'').width; cy=f.base[j]*IW-s*.16; }
    else{ cy=(f.y+f.h)*IW-Math.max(s*.24,(f.h*IW-s)*.34); x.fillText(v,f.x*IW+5,cy); cx=f.x*IW+7+x.measureText(v).width; }
    if(on&&caret<550){ x.fillRect(cx,cy-s*.72,2.4,s*.92); } }); }
/* fields */
function workAt(x,y){ const k=x<0?leftPage():rightPage(); if(!hasInk(k)) return null; const u=x<0?1+x:x, w=HR/2-y;
  if(D.grids[k]){ const c=cellAt(k,u,w); return c?{k:'grid',p:k,c}:null; }
  const F=D.fields[k]; let best=-1; F.forEach((f,i)=>{ const m=f.t==='check'?.011:0; if(u>=f.x-m&&u<=f.x+f.w+m&&w>=f.y-m&&w<=f.y+f.h+m&&(best<0||f.t==='check')) best=i; }); return best<0?null:{k:'field',p:k,i:best,x,y}; }
const bar=$('.writebar'), inp=bar&&bar.querySelector('textarea');
function useField(s){ if(showing){ showing=false; dirty(); } stage.classList.add('did'); const f=D.fields[s.p][s.i];
  if(f.t==='check'){ const m=mine(s.p), was=m[s.i]; hist.push([s.p,s.i,was]); if(was) delete m[s.i]; else m[s.i]={v:true,p:pen}; store.set(saved); needPaint(s.p); ui(); return; }
  focusField(s.p,s.i); }
function needPaint(k){ dirty(k); wake(); }
function focusField(k,i){ const old=field&&field.k; field={k,i}; const f=D.fields[k][i]; caret=0; if(old&&old!==k) dirty(old); inp.value=(mine(k)[i]||{}).v||''; bar.querySelector('label').textContent=f.n; inp.rows=f.t==='multi'?2:1; inp.classList.toggle('one',f.t!=='multi'); stage.classList.add('writing'); bar.querySelector('.w-next').hidden=D.fields[k].filter(x=>x.t!=='check').length<2;
  zoom={x:(k===leftPage()?-1:0)+f.x+f.w/2,y:HR/2-(f.y+Math.min(f.h/2,.2)),w:f.w}; if(phone()) view=k===leftPage()?-1:1; frameTo(); dirty(k); ui(); inp.focus({preventScroll:true}); inp.setSelectionRange(inp.value.length,inp.value.length); }
function blurField(){ if(!field) return; const k=field.k; field=null; stage.classList.remove('writing'); dirty(k); if(inp&&document.activeElement===inp) inp.blur(); }
function firstField(){ const p=spread()[0]; if(p){ const i=D.fields[p].findIndex(f=>f.t!=='check'); focusField(p,i); } }
if(inp){ document.fonts.load('40px Caveat').then(()=>dirty(),()=>{});
  inp.addEventListener('input',()=>{ if(!field) return; const {k,i}=field, f=D.fields[k][i], m=mine(k); let v=inp.value; if(f.t!=='multi') v=v.replace(/\n/g,' '); const c=(INK[k]||ink(k)||{}).x; if(c){ c.font=f.s*IW+'px Caveat'; if(f.t==='multi') while(v&&wrap(c,v,f.w*IW-10).length>f.base.length) v=v.slice(0,-1); else while(v&&c.measureText(v).width*.62>f.w*IW-8) v=v.slice(0,-1); } if(v!==inp.value) inp.value=v;
    if(!m[i]||hist.length===0||hist[hist.length-1][0]!==k||hist[hist.length-1][1]!==i) hist.push([k,i,m[i]?{...m[i]}:undefined]); if(v) m[i]={v,p:m[i]&&m[i].p||pen}; else delete m[i]; store.set(saved); caret=0; dirty(k); ui(); });
  const step=d=>{ if(!field) return; const F=D.fields[field.k]; let i=field.i; do{ i=(i+d+F.length)%F.length; }while(F[i].t==='check'); focusField(field.k,i); };
  inp.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!(e.shiftKey&&D.fields[field.k][field.i].t==='multi')||(e.key==='Tab'&&!e.shiftKey&&D.fields[field.k].filter(f=>f.t!=='check').length>1)){ e.preventDefault(); if(D.fields[field.k].filter(f=>f.t!=='check').length>1) step(1); else { zoom=null; blurField(); frameTo(); ui(); wake(); } } else if(e.key==='Escape'){ zoom=null; blurField(); frameTo(); ui(); cv.focus({preventScroll:true}); } });
  bar.querySelector('.w-next').onclick=()=>step(1); bar.querySelector('.w-done').onclick=()=>{ zoom=null; blurField(); frameTo(); ui(); wake(); }; }
function penCursor(){ const g=c=>`<path d="M0 0L3.2-9H-3.2Z" fill="#E9E2D2" stroke="#1B2328" stroke-width="1.5" stroke-linejoin="round"/><path d="M0 0L1.3-3.6H-1.3Z" fill="${c}" stroke="${c}" stroke-width="1"/><path d="M-4-9H4V-40Q4-44 0-44Q-4-44-4-40Z" fill="${c}" stroke="#1B2328" stroke-width="1.6"/><path d="M-4-14H4M-4-30H4" stroke="#fff" stroke-opacity=".75" stroke-width="1.6"/>`;
  const s=`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><g transform="translate(5 43) rotate(42)"><path d="M0 0L3.2-9H4V-40Q4-44 0-44Q-4-44-4-40V-9H-3.2Z" fill="#fff" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>${g(pen)}</g></svg>`; return `url("data:image/svg+xml,${encodeURIComponent(s)}") 5 43,text`; }
/* word search */
const DIR8={N:[-1,0],S:[1,0],E:[0,1],W:[0,-1],NE:[-1,1],NW:[-1,-1],SE:[1,1],SW:[1,-1]}, MC=['242,163,58','35,166,158','214,84,74','108,132,214','146,184,72','196,112,180'];
function cellAt(k,u,w){ const g=D.grids[k], c=Math.round((u-g.x)/g.dx), r=Math.round((w-g.y)/g.dy); return c>=0&&r>=0&&c<g.n&&r<g.n&&Math.abs((u-g.x)/g.dx-c)<.5?[r,c]:null; }
const foundOf=k=>showing?Object.keys(D.grids[k].k).slice(0,Math.ceil(Object.keys(D.grids[k].k).length*prog)):Object.keys(mine(k));
const doneOf=k=>foundOf(k).length===Object.keys(D.grids[k].k).length;
function capsule(x,g,a,b,fill,stroke){ const px=c=>[(g.x+c[1]*g.dx)*IW,(g.y+c[0]*g.dy)*IW], [x1,y1]=px(a),[x2,y2]=px(b), r=g.dy*IW*.40; x.lineCap='round'; x.lineWidth=r*2; x.strokeStyle=fill; x.beginPath(); x.moveTo(x1,y1); x.lineTo(x2+.01,y2); x.stroke(); }
function paintGrid(k,x){ const g=D.grids[k], W8=Object.keys(g.k), F=foundOf(k); const used=new Set();
  F.forEach(w=>{ const [r,c,d]=g.k[w], [dr,dc]=DIR8[d], i=W8.indexOf(w), n=w.length-1; capsule(x,g,[r,c],[r+dr*n,c+dc*n],`rgba(${MC[i%6]},.30)`); for(let j=0;j<=n;j++) used.add((r+dr*j)+'-'+(c+dc*j)); const l=g.l[w]; if(l){ x.strokeStyle='#23395B'; x.lineWidth=3.2; x.lineCap='round'; x.beginPath(); x.moveTo(l[0]*IW-4,l[1]*IW+2); x.bezierCurveTo((l[0]*.6+l[2]*.4)*IW,l[1]*IW-5,(l[0]*.4+l[2]*.6)*IW,l[1]*IW+6,l[2]*IW+5,l[1]*IW-2); x.stroke(); } });
  if(doneOf(k)){ x.fillStyle='rgba(242,163,58,.95)'; x.textAlign='center'; x.textBaseline='middle'; for(let r=0;r<g.n;r++) for(let c=0;c<g.n;c++) if(!used.has(r+'-'+c)){ const a=(g.x+c*g.dx)*IW,b=(g.y+r*g.dy)*IW; x.beginPath(); x.arc(a,b,g.dy*IW*.42,0,7); x.fillStyle='rgba(27,45,66,.96)'; x.fill(); x.fillStyle='#FFD98F'; x.font='600 '+g.dy*IW*.56+'px "Courier New",monospace'; x.fillText(g.g[r][c],a,b+1); } x.textAlign='left'; x.textBaseline='alphabetic'; }
  if(miss&&miss.k===k){ const u=miss.t/760, o=reduce?0:Math.sin(u*25)*u*.004; capsule(x,{...g,x:g.x+o},miss.a,miss.b,`rgba(214,84,74,${(.5*u).toFixed(3)})`); } if(mark&&mark.k===k) capsule(x,g,mark.a,mark.b,'rgba(35,166,158,.38)'); if(flash&&flash.k===k){ const a=(g.x+flash.c[1]*g.dx)*IW,b=(g.y+flash.c[0]*g.dy)*IW; x.strokeStyle='#D6544A'; x.lineWidth=5; x.beginPath(); x.arc(a,b,g.dy*IW*.46,0,7); x.stroke(); } }
function startMark(e){ const [x,y]=hit(e); if(Math.abs(y)>HR/2||Math.abs(x)>1) return false; const s=workAt(x,y); if(!s||s.k!=='grid'||(phone()&&Math.sign(x)!==view&&!zoom)) return false; if(showing){ showing=false; dirty(); ui(); } const pa=mark0&&mark0.k===s.p?mark0.c:null; mark={id:e.pointerId,k:s.p,a:s.c,b:s.c,pa}; try{ cv.setPointerCapture(e.pointerId); }catch(_){ } stage.classList.add('did'); dirty(s.p); return true; }
let mark0=null, miss=null;
function snapTo(g,a,c){ const dr=c[0]-a[0], dc=c[1]-a[1]; if(!dr&&!dc) return a; const t=Math.round(Math.atan2(dr,dc)/(Math.PI/4)), sr=Math.round(Math.sin(t*Math.PI/4)), sc=Math.round(Math.cos(t*Math.PI/4)); let n=Math.max(Math.abs(dr),Math.abs(dc)); while(n&&(a[0]+sr*n<0||a[1]+sc*n<0||a[0]+sr*n>=g.n||a[1]+sc*n>=g.n)) n--; return [a[0]+sr*n,a[1]+sc*n]; }
function moveMark(e){ const g=D.grids[mark.k], [x,y]=hit(e), u=mark.k===leftPage()?1+x:x, w=HR/2-y; const c=[Math.max(0,Math.min(g.n-1,Math.round((w-g.y)/g.dy))),Math.max(0,Math.min(g.n-1,Math.round((u-g.x)/g.dx)))]; mark.b=snapTo(g,mark.a,c); dirty(mark.k); }
function endMark(e){ const m=mark, g=D.grids[m.k]; mark=null; if(m.a[0]===m.b[0]&&m.a[1]===m.b[1]){ /* a tap: first letter, then last letter */ if(m.pa){ mark0=null; flash=null; tryWord(m.k,m.pa,snapTo(g,m.pa,m.a)); } else { mark0={k:m.k,c:m.a}; flash={k:m.k,c:m.a}; } } else { mark0=null; flash=null; tryWord(m.k,m.a,m.b); } dirty(m.k); ui(); }
function tryWord(k,a,b){ const g=D.grids[k], n=Math.max(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1])), sr=Math.sign(b[0]-a[0]), sc=Math.sign(b[1]-a[1]); let t=''; for(let i=0;i<=n;i++) t+=g.g[a[0]+sr*i][a[1]+sc*i]; const r=[...t].reverse().join('');
  for(const w in g.k) if((w===t||w===r)&&!mine(k)[w]){ const [wr,wc,d]=g.k[w], [dr,dc]=DIR8[d], e=[wr+dr*(w.length-1),wc+dc*(w.length-1)]; const same=(p,q)=>p[0]===q[0]&&p[1]===q[1]; if((same(a,[wr,wc])&&same(b,e))||(same(b,[wr,wc])&&same(a,e))){ mine(k)[w]={v:1}; hist.push([k,w,undefined]); store.set(saved); status.textContent=w+' found.'; if(doneOf(k)) status.textContent+=' Every word found. The letters left over say: '+g.m; return; } }
  if(n){ miss={k,a,b,t:760}; status.textContent='Not one of the words.'; dirty(k); } }
function hintWord(){ const k=spread().find(k=>!doneOf(k)); if(!k) return; if(showing){ showing=false; } const g=D.grids[k], w=Object.keys(g.k).find(w=>!mine(k)[w]); mark0=null; flash={k,c:[g.k[w][0],g.k[w][1]]}; $('.where').textContent='Look for '+w+': it starts in the red ring'; status.textContent=w+' starts at row '+(g.k[w][0]+1)+', column '+(g.k[w][1]+1)+'.'; stage.classList.add('did'); dirty(k); }
/* ---------- the desk: messages from the trade arrive on paper slips; one tap writes them into the right row ---------- */
const deal=(function(){ const K=D.desk, el=$('.deal'); if(!K||!el) return null; const p=el.querySelector('.said'), who=el.querySelector('.who'), b=el.querySelector('.d-in'), sk=el.querySelector('.d-skip'), tl=el.querySelector('.tally'); let at=0, busy=0, gid=0, zt=0, off=false;
  const rows=(k,c)=>{ const out={}; (D.fields[k]||[]).forEach((f,i)=>{ (out[f.n]=out[f.n]||[]).push(i); }); return out[c]||[]; };
  const card=()=>K.swap?K.cards.find(c=>spread().some(k=>k==c.lock||k==c.i[0][0])):K.cards[at], read_=c=>c.i.every(([q,i])=>mine(q)[i]), wrote=c=>Object.values(mine(c.lock)).some(x=>x&&String(x.v).trim().length>2);
  const target=()=>K.swap?(card()?card().lock:null):spread().filter(k=>K.at?K.pages.includes(+k):rows(k,K.cols[0]).length)[0];
  const freeRow=k=>{ const cs=K.cols.map(c=>rows(k,c)), m=mine(k); for(let r=0;r<cs[0].length;r++) if(cs.every(c=>!m[c[r]])) return r; return -1; };
  const num=v=>parseFloat(String(v).replace(/[^0-9.-]/g,''))||0, fmt=v=>{ v=Math.round(v*100)/100; return v.toLocaleString('en-US',v%1&&K.tally[2].includes('$')?{minimumFractionDigits:2}:{}); };
  function tally(k){ const [mode,col,txt,one]=K.tally, m=mine(k), v=c=>K.at&&K.pages?K.pages.flatMap(q=>rows(q,c).map(i=>mine(q)[i]&&mine(q)[i].v)):rows(k,c).map(i=>m[i]&&m[i].v); let a=0, n=0; const first=v(K.cols[0]);
    if(mode==='check'){ const named=K.cols.filter(c=>c!==col).map(v); n=first.filter((x,i)=>named.some(q=>q[i])).length; a=v(col).filter(Boolean).length; }
    else if(mode==='count') a=v(col).filter(Boolean).length;
    else if(mode==='slots') a=K.pages.reduce((t,q)=>t+(D.fields[q]||[]).filter((f,i)=>f.slot&&mine(q)[i]).length,0);
    else if(mode==='net'){ const cs=col.split(','); a=v(cs[0]).reduce((t,x)=>t+num(x),0)-v(cs[1]).reduce((t,x)=>t+num(x),0); }
    else a=col.split(',').reduce((t,c)=>t+v(c).reduce((q,x)=>q+num(x),0),0);
    if(mode!=='check'&&!a) return ''; if(mode==='check'&&!n) return ''; return (one&&(txt.includes('{n}')?n:a)===1?one:txt).replace('{a}',(a<0?'-':'')+fmt(Math.abs(a))).replace('{n}',n); }
  function ui(){ const k=target(), on=cur>0&&!!k&&!off&&!showing; stage.classList.toggle('dealing',on); el.hidden=!on; if(!on) return; const c=card(); if(K.swap){ const r=read_(c), ok=wrote(c); who.textContent=c.w; p.textContent=r?c.after:ok?c.s:K.wait; b.hidden=r; b.disabled=!!busy||!ok; b.textContent=K.btn; sk.hidden=!r; sk.textContent='Put it away'; tl.hidden=true; return; } const t=tally(k); tl.textContent=t; tl.hidden=!t;
    if(!c){ who.textContent=''; p.textContent=K.end; b.hidden=true; sk.textContent='Put it away'; sk.disabled=false; return; }
    const full=!K.at&&freeRow(k)<0; who.textContent=c.w; p.textContent=c.s; b.hidden=false; b.disabled=!!busy||full; b.textContent=full?'This page is full':'Write it in'; sk.textContent='Skip'; sk.disabled=!!busy; }
  function write(){ const c=card(); let k=target(); if(!c||!k||busy) return; const g=++gid+'g', jobs=[]; const need_=(q,i,v)=>{ if(i!==undefined&&v!==''&&v!==0&&!mine(q)[i]) jobs.push([q,i,v]); };
    if(c.r){ const r=freeRow(k); if(r<0) return; K.cols.forEach((n,j)=>need_(k,rows(k,n)[r],c.r[j]===1?true:c.r[j])); }
    for(const [q,i,v] of c.i||[]) need_(q,i,v);
    for(const n in c.at||{}){ const q=[k,...(K.pages||[])].find(q=>rows(q,n).length); if(q) need_(q,rows(q,n)[0],c.at[n]); }
    if(!jobs.length){ at++; ui(); return; } if(jobs[0][0]!=k&&!c.r){ k=jobs[0][0]; if(phone()) go(cur,k==leftPage()?-1:1); }
    stage.classList.add('did'); busy=1; jobs.forEach(j=>hist.push([j[0],j[1],undefined,g]));
    const f=D.fields[k][jobs[0][1]], same=jobs.filter(j=>j[0]===k), x0=Math.min(...same.map(j=>D.fields[k][j[1]].x)); clearTimeout(zt); blurField(); zoom={x:(k==leftPage()?-1:0)+(phone()?Math.max(x0+.3,.5):.5),y:HR/2-Math.max(.2,f.y-.02),mine:1}; if(phone()) zoom.w=.52; frameTo(); ui();
    const all=jobs.reduce((t,j)=>t+(j[2]===true?3:String(j[2]).length),0), t0=performance.now(), ms=reduce?0:Math.min(2600,420+all*34);
    const st=now=>{ let left=reduce?1e9:Math.floor(Math.max(0,now-t0-380)/ms*all); const end=left>=all; jobs.forEach(([q,i,v])=>{ const L=v===true?3:String(v).length, n=Math.min(L,left); left-=n; if(end||n>=L) mine(q)[i]={v,p:pen}; else if(n>0&&v!==true) mine(q)[i]={v:String(v).slice(0,n),p:pen}; }); dirty();
      if(!end){ requestAnimationFrame(st); return; } store.set(saved); busy=0; at++; status.textContent='Written on the page: '+jobs.map(j=>j[2]===true?'':j[2]).filter(Boolean).join(', ')+'. '+tally(k); uiKind(); zt=setTimeout(()=>{ if(zoom&&zoom.mine&&!busy){ zoom=null; frameTo(); uiKind(); wake(); } },at<K.cards.length?2600:1400); };
    requestAnimationFrame(st); }
  b.onclick=write; sk.onclick=()=>{ if(K.swap||at>=K.cards.length){ off=true; ui(); } else { at++; ui(); } };
  return {ui,back(g){ if(K.swap) return; if(g&&g!==deal.last){ deal.last=g; at=Math.max(0,at-1); off=false; } },K}; })();
/* buttons for these books */
function inkStep(dt){ let b=false; if(miss){ miss.t-=dt; const k=miss.k; if(miss.t<=0) miss=null; dirty(k); b=true; } if(showing&&prog<1){ prog=reduce?1:Math.min(1,prog+dt/(SEARCH?2600:3600)); dirty(); if(prog>=1) ui(); b=true; } if(field&&!reduce){ const c=caret; caret=(caret+dt)%1100; if((c<550)!==(caret<550)) dirty(field.k); b=true; } return b; }
function showKind(){ if(READ){ dimTo=dimTo?0:1; stage.classList.toggle('night',!!dimTo); ui(); wake(); return; } showing=!showing; prog=showing?0:1; zoom=null; blurField(); flash=mark0=null; frameTo(); dirty(); ui(); }
function undoKind(){ const h=hist.pop(); if(!h) return; if(deal) deal.back(h[3]); if(h[3]&&hist.length&&hist[hist.length-1][3]===h[3]) setTimeout(undoKind); const m=mine(h[0]); if(h[2]===undefined) delete m[h[1]]; else m[h[1]]=h[2]; if(field&&field.k===h[0]&&field.i===h[1]) inp.value=(m[h[1]]||{}).v||''; store.set(saved); dirty(h[0]); ui(); }
function clearKind(){ for(const k of spread()){ saved[k]={}; dirty(k); } store.set(saved); hist=hist.filter(h=>!spread().includes(String(h[0]))&&!spread().includes(h[0])); flash=mark0=null; if(inp) inp.value=''; ui(); }
const zb=$('.b-zoom'); if(zb) zb.onclick=()=>{ if(zoom){ zoom=null; blurField(); } else zoom={x:(phone()?view:spread().length&&spread()[0]===leftPage()&&spread().length===1?-1:1)*.5,y:HR*.2}; frameTo(); ui(); wake(); };
const hb=$('.b-hint'); if(hb) hb.onclick=()=>{ hintWord(); wake(); };
function uiKind(){ if(deal) deal.ui(); const sp=spread(), can=cur>0&&(sp.length>0||READ); stage.classList.toggle('canc',can); const any=sp.some(k=>Object.keys(mine(k)).length); $('.b-undo').disabled=!hist.length||showing; $('.b-clear').disabled=!any||showing; const L=D.labels||['See it filled in','My notes']; const on=READ?!!dimTo:showing; $('.b-show').setAttribute('aria-pressed',on); $('.b-show span').textContent=L[on?1:0]; stage.classList.toggle('sample',showing); if(zb) zb.textContent=zoom?'Whole page':'Come closer';
  uiNav(); if(SEARCH){ const k=sp.find(doneOf), m=$('.message'); m.hidden=!k; if(k) m.innerHTML='<b>The letters left over</b> '+D.grids[k].say; cv.style.touchAction=sp.length?'none':''; const t=sp.map(k=>{ const q=((D.text[k]||'').match(/^Puzzle [\d.]+/)||[''])[0]; return (q?q+': ':'')+foundOf(k).length+' of '+Object.keys(D.grids[k].k).length; }); if(sp.length) $('.where').textContent=showing?'Solved':t.join(', ')+(t.length>1?'':' found'); } }

/* ---------- pointer ---------- */
cv.addEventListener('pointerdown',e=>{ if(e.button) return; const [x]=hit(e); if(SEARCH&&cur>0&&startMark(e)) return; drag={id:e.pointerId,x:e.clientX,y:e.clientY,i:-1,on:false,wx:x,t:performance.now()}; });
addEventListener('pointermove',e=>{ if(mark&&e.pointerId===mark.id){ moveMark(e); return; } if(!drag||e.pointerId!==drag.id){ if(e.target===cv&&e.pointerType==='mouse') hover(e); return; } const dx=e.clientX-drag.x, dy=e.clientY-drag.y;
  if(!drag.on&&!drag.off&&Math.hypot(dx,dy)>9){ if(Math.abs(dx)<Math.abs(dy)*1.2&&e.pointerType!=='mouse'){ drag.off=true; return; }
    const fwd=dx<0; if(phone()&&cur>0&&((fwd&&view<0)||(!fwd&&view>0))){ drag.pan=true; drag.on=false; drag.fwd=fwd; return; }
    const i=fwd?cur:cur-1; if(i<0||i>=n){ drag.off=true; return; } drag.i=i; drag.on=true; drag.fwd=fwd; try{ cv.setPointerCapture(e.pointerId); }catch(_){ } stage.classList.add('dragging'); need(fwd?cur+1:cur-1); }
  if(drag.on){ const span=cam.s*(phone()?1.1:1.75), k=Math.max(0,Math.min(1,-dx/span)); leaf[drag.i].t=drag.fwd?k:1-Math.max(0,Math.min(1,dx/span)); leaf[drag.i].v=0; wake(); } });
function up(e){ if(mark&&e.pointerId===mark.id){ endMark(e); return; } if(!drag||e.pointerId!==drag.id) return; const d=drag; drag=null; stage.classList.remove('dragging'); if(e.type==='pointercancel'&&!d.on) return;
  if(d.on){ const dx=e.clientX-d.x, sp=dx/Math.max(1,performance.now()-d.t), t=leaf[d.i].t; const turn=d.fwd?(t>.32||sp<-.45):(t<.68||sp>.45); if(turn&&e.type!=='pointercancel') d.fwd?go(cur+1,phone()&&cur>0?-1:1):go(cur-1,1); else { go(cur,view); } return; }
  if(d.pan){ d.fwd?next():prev(); return; } if(d.off) return; tap(e); }
addEventListener('pointerup',up); addEventListener('pointercancel',up);
function spot(e){ const [x,y]=hit(e); if(cur===0) return Math.abs(y)<=HR/2&&x>=0&&x<=1?{k:'cover'}:null; if(Math.abs(y)>HR/2||Math.abs(x)>1) return null; const work=workAt(x,y); if(work) return work; const side=x<0?'left':'right', pg=x<0?leftPage():rightPage(); if(!pg||!D.plates[pg]) return {k:side};
  const o=plates[pg], u=x<0?1+x:x, w=.5-y, zx=Math.floor((u-BX)/BS*N), zy=Math.floor((w-BY)/BS*N); if(!o||!o.map||zx<0||zy<0||zx>=N||zy>=N) return {k:x<0?'left':'margin'}; const a=areaAt(o,zx,zy); return a?{k:'area',o,a}:{k:x<0?'left':'margin'}; }
function tap(e){ const s=spot(e); if(!s) return; if(s.k==='cover'){ go(D.start||2,phone()?D.sv||-1:1); return; } if(s.k==='area'){ if(s.o.wt>0){ s.o.wt=0; ui(); wake(); return; } stage.classList.add('did'); flood(s.o,s.a[0],s.a[1],s.a[2],crayon.c==='#ffffff'?null:crayon.c); return; } if(s.k==='field'){ useField(s); return; } if(zoom){ zoom=null; blurField(); frameTo(); ui(); wake(); return; } if(s.k==='grid') return; if(s.k==='left') prev(); else if(s.k==='right'||s.k==='margin') next(); }
let hc=''; function hover(e){ const s=spot(e); const c=!s?'':s.k==='field'?'pen':s.k==='grid'?'mark':s.k==='area'?'crayon':s.k==='cover'?'pointer':'turn'; if(c!==hc){ hc=c; cv.style.cursor=c==='crayon'?cursor():c==='pen'?penCursor():c==='mark'?'crosshair':c===''?'':'pointer'; } }
function cursor(){ const c=crayon.c, ink='#1B2328';
  /* drawn upright with the point at 0,0, then leaned to the right: the point is exactly where the color lands */
  const body=c==='#ffffff'
   ? `<path d="M-8-1Q-8 0-7 0H7Q8 0 8-1V-20H-8Z" fill="#F7F3EE" stroke="${ink}" stroke-width="1.8" stroke-linejoin="round"/><path d="M-8.6-15H8.6V-42Q8.6-44 6.6-44H-6.6Q-8.6-44-8.6-42Z" fill="#3C72BE" stroke="${ink}" stroke-width="1.8"/><path d="M-7.7-25H7.7V-31H-7.7Z" fill="#fff"/>`
   : `<path d="M-2.2-1.2Q0 .9 2.2-1.2L6.2-13H-6.2Z" fill="${c}" stroke="${ink}" stroke-width="1.8" stroke-linejoin="round"/><path d="M-8-13H8V-46Q8-48 6-48H-6Q-8-48-8-46Z" fill="${c}" stroke="${ink}" stroke-width="1.8" stroke-linejoin="round"/><path d="M-7.1-18H7.1V-42H-7.1Z" fill="#fff" fill-opacity=".82"/><path d="M-7.1-21H7.1M-7.1-39H7.1" stroke="${ink}" stroke-width="1.6"/><path d="M-7.1-23.5H7.1V-36.5H-7.1Z" fill="${c}"/><path d="M-1-4L-3-12" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" stroke-linecap="round"/>`;
  const halo=body.replace(/fill="[^"]*"/g,'fill="#fff"').replace(/stroke="[^"]*"/g,'stroke="#fff"').replace(/stroke-width="[^"]*"/g,'stroke-width="5"').replace(/(fill|stroke)-opacity="[^"]*"/g,'');
  const er=c==='#ffffff', x=er?9:5, y=er?51:51;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"><g transform="translate(${x} ${y}) rotate(42)${er?' translate(0 0)':''}">${halo}${body}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${x} ${y},crosshair`; }

/* ---------- controls ---------- */
const tray=$('.crayons'); (D.crayons||[]).forEach((c,i)=>{ const l=document.createElement('label'); l.className='cr'; l.style.setProperty('--c',c.c); l.title=c.n; l.innerHTML=`<input type="radio" name="crayon" value="${i}"${i?'':' checked'}><i aria-hidden="true"></i><span class="sr">${c.n}</span>`; tray.appendChild(l); });
tray.addEventListener('change',e=>{ if(WRITE){ pen=D.crayons[+e.target.value].c; hc=''; return; } crayon=D.crayons[+e.target.value]; hc=''; const o=plateNow(); if(o&&o.wt){ o.wt=0; ui(); wake(); } });
$('.nav.n').onclick=next; $('.nav.p').onclick=prev; document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>{ go(Math.max(1,+b.dataset.open),phone()?D.sv||-1:1); if(phone()) scrollTo({top:0,behavior:reduce?'auto':'smooth'}); }));
$('.b-undo').onclick=()=>{ if(KIND!=='color'){ undoKind(); return; } const u=undo.pop(); if(!u) return; const o=plates[u[0]]; if(o&&o.map) flood(o,u[1],u[3],u[4],u[2],true); ui(); };
$('.b-clear').onclick=()=>{ if(KIND!=='color'){ clearKind(); return; } const o=plateNow(); if(!o) return; flows.length=0; o.px.fill(0); gl.bindTexture(gl.TEXTURE_2D,o.tex); gl.texSubImage2D(gl.TEXTURE_2D,0,0,0,N,N,gl.RGBA,gl.UNSIGNED_BYTE,o.px); o.col={}; delete saved[o.k]; store.set(saved); undo=undo.filter(u=>u[0]!==o.k); ui(); wake(); };
$('.b-show').onclick=()=>{ if(KIND!=='color'){ showKind(); return; } const o=plateNow(); if(!o) return; o.wt=o.wt?0:1; ui(); wake(); };
$('.b-close').onclick=()=>go(0);
/* the click a phone makes after a tap must not take the focus away from the writing line */
cv.addEventListener('mousedown',e=>{ if(stage.classList.contains('writing')) e.preventDefault(); });
cv.tabIndex=0; cv.addEventListener('keydown',e=>{ if(e.key==='ArrowRight') next(); else if(e.key==='ArrowLeft') prev(); else if(e.key==='Home') go(0); else if(e.key==='Enter'||e.key===' '){ if(cur===0) go(D.start||2,phone()?D.sv||-1:1); else if(WRITE) firstField(); else if(SEARCH) hintWord(); else if(KIND==='color'){ const o=plateNow(); if(o&&o.map) for(let a=1;a<=o.n;a++) if(!o.col[a]){ const [x,y]=D.plates[o.k].p[a-1]; flood(o,a,x,y,crayon.c==='#ffffff'?null:crayon.c); break; } } } else return; e.preventDefault(); });
cv.addEventListener('webglcontextlost',e=>{ e.preventDefault(); stage.classList.add('flat'); });
new ResizeObserver(size).observe(cv.parentNode);
cam.px=cam.py=0; size(); page('cover').then(()=>{ stage.classList.add('ready'); const w=window.requestIdleCallback||(f=>setTimeout(f,600)); w(()=>{ page(LEAVES[0][1]).catch(()=>{}); page(LEAVES[1][0]); page(LEAVES[1][1]); page(LEAVES[2][0]); plate(LEAVES[2][0]); if(LEAVES[1][1]) plate(LEAVES[1][1]); }); },()=>stage.classList.add('flat'));
ui(); window.BOOK3D={go,cursor,fields:D.fields,grids:D.grids,saved,showing:()=>showing,state:()=>({cur,view,leaf:leaf.map(l=>+l.t.toFixed(3)),plates:Object.keys(plates),col:Object.fromEntries(Object.entries(plates).map(([k,o])=>[k,Object.keys(o.col||{}).length]))}),project:(x,y)=>{ const p=[x,y,.004,1], f=r=>r.reduce((s,v,i)=>s+v*p[i],0), w=f(M[3]), r=cv.getBoundingClientRect(); return [r.left+(f(M[0])/w+1)/2*r.width,r.top+(1-f(M[1])/w)/2*r.height]; }};
})();
/* the first chapter in larger type */
(function(){ const d=document.querySelector('.reader'), b=document.querySelector('.b-read'); if(!d||!b) return; let s=21; const set=()=>d.style.setProperty('--fs',s+'px');
b.onclick=()=>d.showModal(); d.querySelector('.rd-x').onclick=()=>d.close(); d.querySelector('.rd-a').onclick=()=>{ s=Math.max(17,s-2); set(); }; d.querySelector('.rd-b').onclick=()=>{ s=Math.min(34,s+2); set(); }; d.addEventListener('click',e=>{ if(e.target===d) d.close(); }); })();

/* the novel waits on a stage: four spotlights search the room, then hold the cover */
(function(){ const st=document.querySelector('.k-read .bkhero'), B=window.BOOK3D; if(!st||!B) return;
const host=st.querySelector('.bk3d'), bookCv=host.querySelector('canvas');
const c=document.createElement('canvas'); c.className='spots'; c.setAttribute('aria-hidden','true'); host.insertBefore(c,bookCv); const x=c.getContext('2d'); const c2=document.createElement('canvas'); c2.className='pools'; c2.setAttribute('aria-hidden','true'); host.appendChild(c2); const z=c2.getContext('2d');
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches; let W,H,t0=0,amt=0,last=0,seen=true,raf=0;
const L=[{at:500,seed:.3},{at:1150,seed:1.9},{at:1800,seed:3.4},{at:2450,seed:5.1}]; L.forEach(l=>{ l.on=calm?1:0; });
const ease=v=>v<=0?0:v>=1?1:v*v*(3-2*v);
function size(){ const r=host.getBoundingClientRect(), s=Math.min(1.25,devicePixelRatio||1); W=r.width; H=r.height; for(const [k,q] of [[c,x],[c2,z]]){ k.width=W*s; k.height=H*s; q.setTransform(s,0,0,s,0,0); } }
function frame(now){ raf=0; if(!t0) t0=now; const dt=Math.min(60,now-(last||now)); last=now; const T=now-t0;
  const open=B.state().cur>0; amt+=((open?0:1)-amt)*(1-Math.exp(-dt/(open?170:420))); if(calm) amt=open?0:1;
  x.clearRect(0,0,W,H); z.clearRect(0,0,W,H);
  if(amt>.01){ const a=B.project(0,0), b=B.project(1,0), m=B.project(.5,0), tp=B.project(.5,.5), bt=B.project(.5,-.5);
    const bw=Math.hypot(b[0]-a[0],b[1]-a[1]), bh=Math.abs(bt[1]-tp[1])*1.5, cs=[[-30,-30],[W+30,-30],[-30,H+30],[W+30,H+30]]; let lit=0;
    L.forEach((l,i)=>{ const k=calm?1:ease((T-l.at-1500)/1100), up=calm?1:ease((T-l.at)/350); /* switched on, searching, then locked */
      const s=T/1000, sx=W*(.5+.42*Math.sin(s*.9+l.seed)), sy=H*(.5+.36*Math.cos(s*1.15+l.seed*1.7));
      const sway=calm?0:1, hx=m[0]+bw*.10*Math.sin(s*.55+l.seed)*sway+(i%2?1:-1)*bw*.10, hy=m[1]+bh*.07*Math.cos(s*.47+l.seed)*sway+(i>1?1:-1)*bh*.12;
      const tx=sx+(hx-sx)*k, ty=sy+(hy-sy)*k, [ox,oy]=cs[i], d=Math.hypot(tx-ox,ty-oy), an=Math.atan2(ty-oy,tx-ox), R=Math.min(bw*.62,bh*.44)*(1-.25*(1-k)), al=up*amt; lit+=k*up;
      x.save(); x.globalCompositeOperation='lighter'; x.translate(ox,oy); x.rotate(an);
      const len=d+R*.5; const g=x.createLinearGradient(0,0,len,0); g.addColorStop(0,`rgba(255,226,170,${.50*al})`); g.addColorStop(.25,`rgba(255,216,150,${.20*al})`); g.addColorStop(.85,`rgba(255,206,136,${.10*al})`); g.addColorStop(1,'rgba(255,200,130,0)');
      x.fillStyle=g; for(let f=1;f>.1;f-=.12){ x.globalAlpha=.25; x.beginPath(); x.moveTo(0,-7*f); x.lineTo(len,-R*f); x.quadraticCurveTo(len+R*.35*f,0,len,R*f); x.lineTo(0,7*f); x.fill(); }
      x.globalAlpha=1; const gl=x.createRadialGradient(0,0,0,0,0,120); gl.addColorStop(0,`rgba(255,240,205,${.85*al})`); gl.addColorStop(.3,`rgba(255,220,160,${.30*al})`); gl.addColorStop(1,'rgba(255,210,140,0)'); x.fillStyle=gl; x.fillRect(-120,-120,240,240); x.restore();
      /* where the beam lands: a soft pool behind, real light on the cover in front */
      for(const [q,m1] of [[x,1],[z,2.3]]){ q.save(); q.globalCompositeOperation='lighter'; q.translate(tx,ty); q.rotate(an); q.scale(1.22,1); const p=q.createRadialGradient(0,0,0,0,0,R*1.12); p.addColorStop(0,`rgba(255,228,178,${.18*al*m1})`); p.addColorStop(.55,`rgba(255,226,178,${.13*al*m1})`); p.addColorStop(.85,`rgba(255,214,150,${.05*al*m1})`); p.addColorStop(1,'rgba(255,210,140,0)'); q.fillStyle=p; q.beginPath(); q.arc(0,0,R*1.12,0,7); q.fill(); q.restore(); } });
    /* stage floor under the book */
    x.save(); x.globalCompositeOperation='lighter'; x.translate(m[0],bt[1]+(bt[1]-m[1])*.62); x.scale(1,.13); const fl=x.createRadialGradient(0,0,0,0,0,bw*1.05); fl.addColorStop(0,`rgba(255,206,140,${.10*lit/4*amt})`); fl.addColorStop(1,'rgba(255,200,130,0)'); x.fillStyle=fl; x.beginPath(); x.arc(0,0,bw*1.05,0,7); x.fill(); x.restore();
    bookCv.style.filter=`brightness(${(1-amt*(.60-.72*lit/4)).toFixed(3)}) contrast(${(1+.06*amt*lit/4).toFixed(3)})`;
  } else bookCv.style.filter='';
  st.style.setProperty('--stage',amt.toFixed(3));
  if(seen&&!document.hidden&&(!calm||Math.abs(amt-(open?0:1))>.01)&&!(open&&amt<.01)) raf=requestAnimationFrame(frame); else last=0; }
const go=()=>{ if(!raf&&seen&&!document.hidden) raf=requestAnimationFrame(frame); };
new IntersectionObserver(e=>{ seen=e[0].isIntersecting; go(); }).observe(st); new MutationObserver(go).observe(st,{attributes:true,attributeFilter:['class']}); document.addEventListener('visibilitychange',go); addEventListener('resize',()=>{ size(); go(); }); size();
const wait=()=>st.classList.contains('ready')?go():setTimeout(wait,120); wait(); })();

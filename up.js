/* Madiland: "back to top" = a bookmark ribbon rising from the bottom-left edge of the page.
   Same ribbon as the top menu (stitching, sheen), mirrored: its pointed tip is the arrow up.
   It slides up once the reader leaves the hero; on hover it is "pulled" a little higher. */
(function(){
const css=`
.up{position:fixed;z-index:40;left:max(28px,env(safe-area-inset-left));bottom:0;width:58px;height:70px;padding:24px 0 0;border:0;margin:0;cursor:pointer;
  display:flex;flex-direction:column;align-items:center;gap:3px;font:500 12px/1 'Familjen Grotesk',system-ui,sans-serif;letter-spacing:.02em;color:#F4FFFD;
  clip-path:polygon(0 16px,50% 0,100% 16px,100% 100%,0 100%);
  background:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.18) 22%,rgba(255,255,255,0) 40%,rgba(0,0,0,.12) 100%),linear-gradient(0deg,#17807A,#23A69E);
  filter:drop-shadow(0 -4px 10px rgba(20,27,30,.28));
  transform:translateY(100%);visibility:hidden;transition:transform .55s cubic-bezier(.16,1,.3,1),visibility 0s .55s}
.up::before{content:"";position:absolute;left:6px;right:6px;top:19px;bottom:0;border-left:1px dashed rgba(255,255,255,.28);border-right:1px dashed rgba(255,255,255,.28);pointer-events:none}
.up svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;transition:transform .45s cubic-bezier(.16,1,.3,1)}
.up.on{transform:translateY(12px);visibility:visible;transition:transform .55s cubic-bezier(.16,1,.3,1),visibility 0s}
.up.on:hover,.up.on:focus-visible{transform:translateY(0)}
.up:hover svg,.up:focus-visible svg{transform:translateY(-2px)}
.up:focus-visible{outline:none}
.up:focus-visible span{text-decoration:underline;text-underline-offset:3px}
@media (max-width:700px){.up{left:16px;width:50px;height:62px;padding-top:21px}}
@media (prefers-reduced-motion:reduce){.up,.up.on,.up svg{transition:none}}`;
const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
const b=document.createElement('button');
b.className='up'; b.type='button'; b.setAttribute('aria-label','Back to top');
b.innerHTML='<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M7 12V2M2.5 6.5 7 2l4.5 4.5"/></svg><span>Top</span>';
document.body.appendChild(b);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let tick=false;
function upd(){ tick=false; b.classList.toggle('on', scrollY>innerHeight*.6); }
addEventListener('scroll',()=>{ if(!tick){ tick=true; requestAnimationFrame(upd); } },{passive:true});
addEventListener('resize',upd);
b.addEventListener('click',()=>{ scrollTo({top:0,behavior:reduce?'auto':'smooth'}); b.blur(); });
upd();
})();

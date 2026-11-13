/* Madiland: Madi, the mascot, fixed at the bottom-right of every page.
   Category pages: this script builds Madi (same figure and behaviour as on the home page).
   Every page (home included): the speech bubble above Madi, and Madi hopping out of the way
   when a book fan from the bottom menu rises next to him. */
(function(){
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const isHome=/(^|\/)(index\.html)?$/.test(location.pathname);
let a=document.querySelector('div.madi,a.madi');

/* ---------- 1. build Madi on pages that don't have him ---------- */
if(!a){
  const css=`
.madi{position:fixed;z-index:40;right:22px;bottom:96px;display:flex;align-items:flex-end;cursor:pointer;text-decoration:none;color:#1E272B}
.m3{position:relative;width:120px;height:138px;perspective:700px}
.m3 .fig{position:absolute;inset:0;transform-style:preserve-3d;animation:mdBob 3.4s ease-in-out infinite}
@keyframes mdBob{0%,100%{translate:0 0}50%{translate:0 -6px}}
.m3 .tilt{position:absolute;inset:0;transform:rotateY(var(--ry,0deg)) rotateX(var(--rx,0deg));transition:transform .6s cubic-bezier(.16,1,.3,1);filter:drop-shadow(0 18px 22px rgba(10,16,18,.38)) drop-shadow(0 0 18px rgba(127,227,218,.18))}
.m3 img{position:absolute;display:block;pointer-events:none;user-select:none}
.m3 .m{left:0;top:0;width:100%;height:auto}
.m3 .bl{left:12.78%;top:11.89%;width:56.1%;opacity:0}
.m3.blink .bl{opacity:1}
.m3 .sheen{position:absolute;inset:0;pointer-events:none;-webkit-mask:url(madi/madi.webp) 0 0/100% auto no-repeat;mask:url(madi/madi.webp) 0 0/100% auto no-repeat;
  background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.55) 47%,rgba(210,255,250,.25) 52%,transparent 62%) -220px 0/300% 100% no-repeat;mix-blend-mode:soft-light;animation:mdSheen 6.5s ease-in-out 1.2s infinite}
@keyframes mdSheen{0%{background-position:-160% 0}35%,100%{background-position:260% 0}}
.m3 .gr{position:absolute;left:50%;bottom:-5px;width:78px;height:12px;margin-left:-39px;border-radius:50%;background:radial-gradient(closest-side,rgba(10,16,18,.42),transparent);animation:mdShad 3.4s ease-in-out infinite}
@keyframes mdShad{50%{transform:scaleX(.84);opacity:.6}}
.madi:hover .m3 .fig{animation:mdHop .55s cubic-bezier(.16,1,.3,1) 1,mdBob 3.4s ease-in-out .55s infinite}
@keyframes mdHop{0%{translate:0 0}40%{translate:0 -16px}70%{translate:0 2px}100%{translate:0 0}}
.madi:hover .m3 .sheen{animation-duration:2.2s;animation-delay:0s}
.madi:focus-visible{outline:2px solid #23A69E;outline-offset:4px;border-radius:12px}
@media (max-width:900px){.madi{bottom:24px;right:14px}.m3{width:80px;height:92px}.m3 .gr{width:54px;margin-left:-27px}}
@media (prefers-reduced-motion:reduce){.madi *,.madi{animation:none!important;transition:none!important}}`;
  const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
  a=document.createElement('a');
  a.className='madi'; a.href='index.html#finder'; a.setAttribute('aria-label','Ask Madi to find a book');
  a.innerHTML='<div class="m3"><span class="gr"></span><div class="fig"><div class="tilt"><img class="m" src="madi/madi.webp" alt="" width="360" height="412"><img class="bl" src="madi/madi_blink.webp" alt=""><span class="sheen"></span></div></div></div>';
  document.body.appendChild(a);
  const m3=a.querySelector('.m3'), tilt=a.querySelector('.tilt');
  addEventListener('mousemove',e=>{ const r=m3.getBoundingClientRect(); const dx=(e.clientX-(r.left+r.width/2))/innerWidth, dy=(e.clientY-(r.top+r.height/2))/innerHeight;
    tilt.style.setProperty('--ry',(Math.max(-1,Math.min(1,dx*2.2))*16).toFixed(1)+'deg'); tilt.style.setProperty('--rx',(Math.max(-1,Math.min(1,-dy*2))*8).toFixed(1)+'deg'); },{passive:true});
  function blink(){ m3.classList.add('blink'); setTimeout(()=>m3.classList.remove('blink'),140);
    if(Math.random()<.25) setTimeout(()=>{ m3.classList.add('blink'); setTimeout(()=>m3.classList.remove('blink'),120); },300);
    setTimeout(blink,2600+Math.random()*3600); }
  if(!reduce) setTimeout(blink,1800);
}

/* ---------- 2. the speech bubble: above Madi, a glowing page with a living edge ---------- */
const css2=`
@property --mdA{syntax:'<angle>';inherits:false;initial-value:0deg}
.madi{transition:translate .7s cubic-bezier(.34,1.56,.64,1)}
.madi .say{position:absolute;right:-6px;bottom:calc(100% + 16px);width:max-content;max-width:232px;padding:1.5px;border-radius:18px 18px 6px 18px;pointer-events:none;
  background:conic-gradient(from var(--mdA),rgba(127,227,218,.15),#7FE3DA 18%,#F2A33A 30%,rgba(127,227,218,.15) 46%,rgba(127,227,218,.15) 70%,#7FE3DA 86%,rgba(127,227,218,.15));
  box-shadow:0 18px 40px rgba(8,14,16,.45),0 0 28px rgba(127,227,218,.22);
  transform-origin:88% 100%;opacity:0;transform:translateY(10px) scale(.6) rotate(4deg);
  animation:mdSpin 5s linear infinite,mdIn .9s cubic-bezier(.34,1.56,.64,1) 2s forwards;transition:opacity .35s,transform .45s cubic-bezier(.16,1,.3,1)}
@keyframes mdSpin{to{--mdA:360deg}}
@keyframes mdIn{to{opacity:1;transform:none}}
.madi .say i{display:block;position:relative;padding:12px 16px 13px;border-radius:16.5px 16.5px 4.5px 16.5px;font-style:normal;text-align:left;
  background:radial-gradient(120% 140% at 0% 0%,rgba(127,227,218,.16),transparent 55%),linear-gradient(160deg,#1F2C31,#141C1F)}
.madi .say b{display:block;font:italic 400 19px/1.15 'Newsreader',Georgia,serif;letter-spacing:-.01em;color:#F4FFFD}
.madi .say small{display:block;margin-top:5px;font:500 13px/1.2 'Familjen Grotesk',system-ui,sans-serif;color:#7FE3DA}
.madi .say small::after{content:"";display:inline-block;width:6px;height:6px;margin-left:7px;vertical-align:1px;border-radius:50%;background:#F2A33A;box-shadow:0 0 10px #F2A33A;animation:mdPulse 1.8s ease-in-out infinite}
@keyframes mdPulse{50%{opacity:.35;transform:scale(.7)}}
.madi .say::after{content:"";position:absolute;right:34px;bottom:-7px;width:14px;height:14px;transform:rotate(45deg);border-radius:2px;
  background:linear-gradient(135deg,transparent 50%,#141C1F 50%);box-shadow:1.5px 1.5px 0 rgba(127,227,218,.55)}
.madi .say .spk{position:absolute;width:4px;height:4px;border-radius:50%;background:#fff;box-shadow:0 0 8px #7FE3DA,0 0 14px #7FE3DA;opacity:0;animation:mdSpk 3.2s ease-in-out infinite}
.madi .say .spk:nth-of-type(1){left:-6px;top:8px;animation-delay:2.6s}
.madi .say .spk:nth-of-type(2){right:18px;top:-6px;animation-delay:3.5s}
.madi .say .spk:nth-of-type(3){left:40%;bottom:-6px;animation-delay:4.3s}
@keyframes mdSpk{0%,100%{opacity:0;transform:scale(.3)}15%{opacity:1;transform:scale(1.2)}35%{opacity:0;transform:scale(.4)}}
.madi:hover .say{transform:translateY(-4px) rotate(-1deg)}
.madi.away .say,.madi.dodge .say{opacity:0!important;transform:translateY(10px) scale(.85)!important;animation-play-state:paused}
.madi.dodge{translate:0 -168px}
.madi .bub{display:none!important}
@media (max-width:900px){.madi .say{display:none}
  .madi.docked{position:absolute!important;z-index:5;right:12px;bottom:12px;top:auto;left:auto;translate:none}
  .madi.docked.inhero{top:92px;bottom:auto;right:14px}
  .madi.docked .m3{width:80px;height:92px}
  .madi.docked .m3 .gr{width:54px;margin-left:-27px}}
@media (prefers-reduced-motion:reduce){.madi,.madi .say{transition:none}.madi .say{animation:none;opacity:1;transform:none}.madi .say .spk,.madi .say small::after{animation:none}}`;
const st2=document.createElement('style'); st2.textContent=css2; document.head.appendChild(st2);
const say=document.createElement('span'); say.className='say'; say.setAttribute('aria-hidden','true');
say.innerHTML=(isHome?'<i><b>Not sure where to start?</b><small>Ask me, I\'ll find your book</small></i>'
                     :'<i><b>Not sure which one?</b><small>Ask me, I\'ll find it for you</small></i>')
  +'<span class="spk"></span><span class="spk"></span><span class="spk"></span>';
a.appendChild(say);

/* phones: Madi docks inside the picture at the top of the page and scrolls away with it,
   instead of floating over covers and titles */
const mq=matchMedia('(max-width:900px)');
function dock(){
  const box=document.querySelector('.stage')||document.getElementById('hero');
  if(mq.matches && box){ a.classList.add('docked'); a.classList.toggle('inhero',!document.querySelector('.stage')); box.appendChild(a); }
  else { a.classList.remove('docked','inhero'); document.body.appendChild(a); }
}
dock(); mq.addEventListener('change',dock);

/* the bubble belongs to the hero; below it, it would cover book titles */
const away=()=>a.classList.toggle('away',scrollY>innerHeight*.35);
addEventListener('scroll',away,{passive:true}); away();

/* a book fan from the bottom menu rising next to Madi: he hops up out of its way */
const m3=a.querySelector('.m3');
document.querySelectorAll('.shelf .grp').forEach(g=>{
  const on=()=>{ const f=g.getBoundingClientRect(), r=m3.getBoundingClientRect(), half=110;
    const cx=f.left+f.width/2; if(cx+half>r.left && cx-half<r.right) a.classList.add('dodge'); };
  const off=()=>a.classList.remove('dodge');
  g.addEventListener('pointerenter',on); g.addEventListener('pointerleave',off);
  g.addEventListener('focus',on); g.addEventListener('blur',off);
});
})();

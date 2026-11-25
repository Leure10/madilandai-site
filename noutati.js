/* The letter about new books. The address goes only to the e-mail service named in privacy.html, and only after "Send me new books" is pressed. */
document.querySelectorAll('form.news').forEach(f=>{ const msg=f.querySelector('.nmsg'), b=f.querySelector('button'); f.addEventListener('submit',async e=>{ e.preventDefault(); const m=f.querySelector('[type=email]'), ok=f.querySelector('[name=ok]');
  if(!m.checkValidity()){ msg.textContent='That address looks incomplete. Please check it.'; m.focus(); return; } if(!ok.checked){ msg.textContent='Please tick the box above, so we know you want the letter.'; ok.focus(); return; }
  if(f.website.value) return; const d=new FormData(f); d.delete('ok'); d.delete('website'); for(const [k,v] of [...d]) if(!v) d.delete(k);
  b.disabled=true; msg.textContent='Sending.'; try{ await fetch(f.action,{method:'POST',body:d,mode:'no-cors'}); /* the service does not let this page read its answer */
    msg.textContent='Sent. If the address is right, a message asking you to confirm arrives within a few minutes. Nothing is sent to you until you confirm. Not there? Look in spam, or try again.'; f.reset(); }
  catch(_){ msg.textContent='That did not go through. Check your connection and try again.'; } b.disabled=false; }); });

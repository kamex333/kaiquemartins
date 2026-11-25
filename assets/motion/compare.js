(function(){
[].slice.call(document.querySelectorAll('.ba')).forEach(function(ba){
  var imgs=ba.querySelectorAll('img');if(imgs.length<2)return;
  var a=imgs[0],d=imgs[1];
  var box=document.createElement('div');box.className='cmp';
  var after=document.createElement('img');after.src=d.getAttribute('src');after.alt=d.alt;after.loading='lazy';
  var before=document.createElement('img');before.src=a.getAttribute('src');before.alt=a.alt;before.loading='lazy';before.className='cmp-before';
  box.appendChild(after);box.appendChild(before);
  box.insertAdjacentHTML('beforeend','<span class="cmp-tag a" aria-hidden="true">Antes</span><span class="cmp-tag d" aria-hidden="true">Depois</span><span class="cmp-line" aria-hidden="true"></span><span class="cmp-knob" aria-hidden="true">↔</span>');
  var r=document.createElement('input');r.type='range';r.min=0;r.max=100;r.value=50;r.setAttribute('aria-label','Arraste para comparar antes e depois');
  r.addEventListener('input',function(){box.style.setProperty('--p',r.value+'%')});
  box.appendChild(r);
  function setX(x){var b=box.getBoundingClientRect();var v=Math.max(0,Math.min(100,(x-b.left)/b.width*100));r.value=Math.round(v);box.style.setProperty('--p',v+'%')}
  var drag=false,sx=0,sy=0,dec=null;
  box.addEventListener('pointerdown',function(e){drag=true;sx=e.clientX;sy=e.clientY;dec=e.pointerType==='mouse'?'x':null;if(dec==='x'){setX(e.clientX)}});
  box.addEventListener('pointermove',function(e){if(!drag)return;
    if(dec===null){var dx=Math.abs(e.clientX-sx),dy=Math.abs(e.clientY-sy);if(dx<6&&dy<6)return;dec=dx>dy?'x':'y';if(dec==='x')try{box.setPointerCapture(e.pointerId)}catch(_){}}
    if(dec==='x'){setX(e.clientX);e.preventDefault()}});
  function end(e){if(drag&&dec===null&&e&&e.type==='pointerup')setX(e.clientX);drag=false;dec=null}
  box.addEventListener('pointerup',end);box.addEventListener('pointercancel',function(){drag=false;dec=null});
  box.addEventListener('click',function(){r.focus({preventScroll:true})});
  var hint=document.createElement('p');hint.className='cmp-hint';hint.textContent='Arraste para comparar';
  ba.style.display='flex';ba.style.flexDirection='column';ba.style.gap='8px';
  ba.innerHTML='';ba.appendChild(box);ba.appendChild(hint);
});
})();

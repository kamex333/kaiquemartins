(function(){
var ol=document.querySelector('ol[data-tour]');if(!ol)return;
var items=[].slice.call(ol.children).map(function(li){var s=li.querySelectorAll('span'),img=li.querySelector('img');
  return {src:img.getAttribute('src'),alt:img.alt,title:s[1].textContent,text:s[2]?s[2].textContent:''}});
var n=items.length,cur=0;
function esc(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
var rc=document.createElement('div');rc.className='rc';rc.setAttribute('role','region');rc.setAttribute('aria-roledescription','carrossel');rc.setAttribute('aria-label','Telas da reserva em '+n+' toques');
rc.innerHTML='<div class="rc-stage">'+items.map(function(it,i){return '<figure class="rc-slide" data-i="'+i+'" role="group" aria-roledescription="tela" aria-label="'+(i+1)+' de '+n+'"><img src="'+it.src+'" alt="'+esc(it.alt)+'"></figure>'}).join('')+'</div>'+
 '<div class="rc-info"><button type="button" class="rc-btn" data-d="-1" aria-label="Tela anterior">←</button><div class="rc-text" aria-live="polite"></div><button type="button" class="rc-btn" data-d="1" aria-label="Próxima tela">→</button></div>'+
 '<div class="rc-dots">'+items.map(function(it,i){return '<button type="button" aria-label="Ir para '+esc(it.title)+'"></button>'}).join('')+'</div>';
ol.parentNode.insertBefore(rc,ol);(ol.closest('section')||document.body).classList.add('rc-on');
var slides=[].slice.call(rc.querySelectorAll('.rc-slide')),dots=[].slice.call(rc.querySelectorAll('.rc-dots button')),text=rc.querySelector('.rc-text'),btns=rc.querySelectorAll('.rc-btn');
var POS={'-2':'ll','-1':'l','0':'c','1':'r','2':'rr'};
function go(i){cur=Math.max(0,Math.min(n-1,i));
  slides.forEach(function(s,k){s.className='rc-slide '+(POS[k-cur]||'');s.setAttribute('aria-hidden',k===cur?'false':'true')});
  dots.forEach(function(d,k){d.setAttribute('aria-current',k===cur?'true':'false')});
  var it=items[cur];text.innerHTML='<div class="k">'+(cur+1)+'<small>de '+n+' toques</small></div><b>'+esc(it.title)+'</b><span>'+esc(it.text)+'</span>';
  btns[0].disabled=cur===0;btns[1].disabled=cur===n-1}
btns.forEach(function(b){b.addEventListener('click',function(){go(cur+ +b.dataset.d)})});
dots.forEach(function(d,k){d.addEventListener('click',function(){go(k)})});
slides.forEach(function(s,k){s.addEventListener('click',function(){if(k!==cur)go(k)})});
rc.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){go(cur-1);e.preventDefault()}if(e.key==='ArrowRight'){go(cur+1);e.preventDefault()}});
var stage=rc.querySelector('.rc-stage'),x0=null;
stage.addEventListener('pointerdown',function(e){x0=e.clientX});
stage.addEventListener('pointerup',function(e){if(x0===null)return;var dx=e.clientX-x0;x0=null;if(Math.abs(dx)>40)go(cur+(dx<0?1:-1))});
stage.addEventListener('pointercancel',function(){x0=null});
go(0);
})();

(function(){
var H=document.documentElement;
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine=matchMedia('(hover: hover) and (pointer: fine)').matches;
var FX=window.FX_ON||['hero','reveal','cards','cursor','count','wipe','marquee','magnet'];
function on(n){return FX.indexOf(n)>-1}
window.FXset=function(list){FX=list;apply()};

/* preparar a página */
var h1=document.querySelector('h1');
if(h1&&!h1.dataset.fx){h1.dataset.fx=1;
  (function split(node){[].slice.call(node.childNodes).forEach(function(c){
    if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(w){
      if(!w)return;if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(w));return}
      var o=document.createElement('span');o.className='fx-word';var i=document.createElement('span');i.textContent=w;o.appendChild(i);f.appendChild(o)});
      node.replaceChild(f,c)}else if(c.nodeType===1)split(c)})})(h1);
  var hs=h1.closest('section');
  [].slice.call(hs.children).forEach(function(el){if(!el.contains(h1))el.classList.add('fx-hero-after')});
  h1.parentNode.querySelectorAll(':scope>p').forEach(function(p){p.classList.add('fx-hero-after')});
}
var words=[].slice.call(document.querySelectorAll('.fx-word>span'));
words.forEach(function(w,i){w.style.transitionDelay=(.08*i)+'s'});
document.querySelectorAll('.fx-hero-after').forEach(function(el,i){el.style.transitionDelay=(.35+.12*i+.08*words.length)+'s'});

var cards=[].slice.call(document.querySelectorAll('a[href$=".html"]')).filter(function(a){return a.querySelector('h3')});
cards.forEach(function(c){c.classList.add('fx-card')});
var revealEls=[].slice.call(document.querySelectorAll('#projetos>*, #sobre>*, footer>*, #sobre li'));
revealEls.forEach(function(el){el.classList.add('fx-r')});

/* faixa */
var proj=document.getElementById('projetos');
if(on('marquee')&&proj&&!document.querySelector('.fx-band')){
  var items=['Pesquisa','GA4','Clarity','Teste de uso','Heurísticas','Figma','Handoff','UX/UI'];
  var row=items.map(function(t){return '<span>'+t+'</span><b>✦</b>'}).join('');
  var m=document.createElement('div');m.className='fx-band';m.setAttribute('aria-hidden','true');
  m.innerHTML='<div>'+row+row+'</div>';proj.parentNode.insertBefore(m,proj);
}

/* cursor */
var cur=document.createElement('div');cur.className='fx-cursor';cur.textContent='Ver case';cur.setAttribute('aria-hidden','true');if(on('cursor'))document.body.appendChild(cur);

/* transição */
var wipe=document.createElement('div');wipe.className='fx-wipe';wipe.setAttribute('aria-hidden','true');document.body.appendChild(wipe);

var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('fx-in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});

function apply(){
  ['hero','reveal','cards','marquee','magnet'].forEach(function(n){H.classList.toggle('fx-'+n,on(n)&&!reduce)});
  H.classList.toggle('fx-cursor-on',on('cursor')&&fine&&!reduce);
  revealEls.forEach(function(el){el.classList.remove('fx-in');if(on('reveal'))io.observe(el)});
  if(!on('magnet'))document.querySelectorAll('.fx-mag').forEach(function(b){b.style.transform=''});
  if(!on('cards'))cards.forEach(function(c){c.style.removeProperty('--rx');c.style.removeProperty('--ry')});
}
window.FXreplayHero=function(){H.classList.remove('fx-hero-in');void H.offsetWidth;setTimeout(function(){H.classList.add('fx-hero-in')},60)};
apply();
requestAnimationFrame(function(){setTimeout(function(){H.classList.add('fx-hero-in')},120)});

/* cards: inclinação + cursor */
cards.forEach(function(c){
  c.addEventListener('mousemove',function(e){
    var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    if(on('cards')&&!reduce){c.style.setProperty('--ry',(x*5)+'deg');c.style.setProperty('--rx',(-y*5)+'deg')}
    if(on('cursor')&&fine&&!reduce){cur.style.setProperty('--x',e.clientX+'px');cur.style.setProperty('--y',e.clientY+'px');cur.classList.add('on')}
  });
  c.addEventListener('mouseleave',function(){c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg');cur.classList.remove('on')});
  c.addEventListener('click',function(e){
    if(!on('wipe')||reduce||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;
    e.preventDefault();var href=c.getAttribute('href');
    var bg=getComputedStyle(c).backgroundColor;
    wipe.style.background=bg;wipe.style.color=getComputedStyle(c).color;wipe.textContent=c.querySelector('h3').textContent;
    wipe.className='fx-wipe';void wipe.offsetWidth;wipe.classList.add('up');cur.classList.remove('on');
    setTimeout(function(){
      if(window.FX_DEMO){wipe.classList.add('out');setTimeout(function(){wipe.className='fx-wipe'},600)}
      else location.href=href;
    },window.FX_DEMO?1100:600);
  });
});

/* ao voltar pelo navegador, a página volta do cache com a transição ainda cobrindo a tela */
addEventListener('pageshow',function(){wipe.className='fx-wipe';cur.classList.remove('on')});

/* contadores */
var nums=[].slice.call(document.querySelectorAll('a.fx-card span')).filter(function(s){return /^\d+(,\d+)?(%|×)$/.test(s.textContent.trim())});
var nio=new IntersectionObserver(function(es){es.forEach(function(e){
  if(!e.isIntersecting||!on('count')||reduce)return;
  var s=e.target,raw=s.dataset.fxv||(s.dataset.fxv=s.textContent.trim()),m=raw.match(/^([\d,]+)(.*)$/),end=parseFloat(m[1].replace(',','.')),dec=(m[1].split(',')[1]||'').length,t0=null;
  function step(t){t0=t0||t;var p=Math.min(1,(t-t0)/1200),v=end*(1-Math.pow(1-p,3));s.textContent=v.toFixed(dec).replace('.',',')+m[2];if(p<1)requestAnimationFrame(step)}
  requestAnimationFrame(step);
})},{threshold:.6});
nums.forEach(function(n){nio.observe(n)});
window.FXreplayCount=function(){nums.forEach(function(n){nio.unobserve(n);nio.observe(n)})};

/* magnéticos */
var mags=[].slice.call(document.querySelectorAll('section a[style*="999px"], footer a[style*="999px"], header a[style*="999px"]')).filter(function(a){return !a.closest('.fx-card')});
mags.forEach(function(b){b.classList.add('fx-mag');
  b.addEventListener('mousemove',function(e){if(!on('magnet')||reduce||!fine)return;var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.25)+'px,'+((e.clientY-r.top-r.height/2)*.35)+'px)'});
  b.addEventListener('mouseleave',function(){b.style.transform=''});
});
})();

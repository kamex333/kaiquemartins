(function(){
var cfg=window.TOC_CFG||{};
var hs=[].slice.call(document.querySelectorAll('h2')).filter(function(h){return !h.closest('footer')});
if(hs.length<3)return;
var items=hs.map(function(h,i){var sec=h.closest('section')||h;if(!h.id)h.id='cap-'+(i+1);
  var num=sec.querySelector('.num'),prev=h.previousElementSibling,m=prev&&prev.textContent.match(/^\s*(?:Capítulo\s*\d+|Conclusão|Bastidores|O projeto e o meu papel)\s*·?\s*(.*)$/i);var label=num?num.textContent.replace(/^\d+\s*·\s*/,'').trim():(m&&m[1]?m[1].trim():h.textContent.trim());
  if(label.length>42)label=label.slice(0,40).trim()+'…';return {h:h,sec:sec,label:label}});
var nav=document.createElement('nav');nav.className='toc';nav.setAttribute('aria-label','Capítulos do case');
nav.innerHTML='<ol>'+items.map(function(it){return '<li><a href="#'+it.h.id+'"><span class="bar" aria-hidden="true"></span><span class="lbl">'+it.label.replace(/</g,'&lt;')+'</span></a></li>'}).join('')+'</ol>';
document.body.appendChild(nav);
if(cfg.accent)nav.style.setProperty('--toc-accent',cfg.accent);
if(cfg.bg)nav.style.setProperty('--toc-bg',cfg.bg);
if(cfg.shadow)nav.style.setProperty('--toc-shadow',cfg.shadow);
var links=[].slice.call(nav.querySelectorAll('a'));
links.forEach(function(a,i){a.addEventListener('click',function(e){e.preventDefault();var y=items[i].sec.getBoundingClientRect().top+scrollY-24;scrollTo({top:y,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})})});
function upd(){var cur=-1;items.forEach(function(it,i){if(it.sec.getBoundingClientRect().top<innerHeight*.4)cur=i});
  links.forEach(function(a,i){a.classList.toggle('on',i===cur);if(i===cur)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')});
  nav.style.opacity=scrollY>innerHeight*.5?'1':'0';nav.style.pointerEvents=scrollY>innerHeight*.5?'auto':'none'}
nav.style.transition='opacity .3s ease';
addEventListener('scroll',upd,{passive:true});upd();
})();

(function(){
var H=document.documentElement,D=document;
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var ALL=['hero','reveal','arrive','count','progress','chapter','bars','mark','parallax','zoom'];
var FX=window.CM_ON||ALL;
function on(n){return FX.indexOf(n)>-1&&!reduce}
var cfg=window.CM_CFG||{};
if(cfg.color)H.style.setProperty('--cm-color',cfg.color);
if(cfg.ink)H.style.setProperty('--cm-ink',cfg.ink);
if(cfg.mark)H.style.setProperty('--cm-mark',cfg.mark);
function $$(s,r){return [].slice.call((r||D).querySelectorAll(s))}

/* título em palavras */
var h1=D.querySelector('h1'),hero=h1&&(h1.closest('header,section')||h1.parentNode);
if(h1){(function split(n){[].slice.call(n.childNodes).forEach(function(c){
  if(c.nodeType===3){var f=D.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(w){if(!w)return;
    if(/^\s+$/.test(w)){f.appendChild(D.createTextNode(w));return}
    var o=D.createElement('span');o.className='cm-word';var i=D.createElement('span');i.textContent=w;o.appendChild(i);f.appendChild(o)});n.replaceChild(f,c)}
  else if(c.nodeType===1)split(c)})})(h1);
  var words=$$('.cm-word>span',h1);words.forEach(function(w,i){w.style.transitionDelay=(.3+.07*i)+'s'});
  var sib=$$(':scope>*',h1.parentNode).filter(function(e){return e!==h1});
  sib.forEach(function(e,i){e.classList.add('cm-after');e.style.transitionDelay=(.5+.07*words.length+.1*i)+'s'});
}

/* revelar */
var CAND='h2,h3,p,figure,table,ol>li,ul>li,img,.box,.card,.stat,.bar,[style*="border-radius"]';
var rev=[];
$$('section').forEach(function(s){if(hero&&(s===hero||s.contains(hero)||hero.contains(s)))return;
  $$(CAND,s).forEach(function(el){if(el.closest('.cm-r'))return;if(rev.some(function(r){return r.contains(el)}))return;if(el.offsetHeight>1400)return;rev.push(el)})});
rev.forEach(function(el){el.classList.add('cm-r')});
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('cm-in');io.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -40px 0px'});

/* números */
var nums=$$('span,b,strong,div,p').filter(function(el){if(el.children.length)return false;var t=el.textContent.trim();
  return /^\d+(,\d+)?\s?(%|×|x)?$/.test(t)&&parseFloat(getComputedStyle(el).fontSize)>=40});
var nio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting||!on('count'))return;nio.unobserve(e.target);
  var s=e.target,raw=s.dataset.cmv||(s.dataset.cmv=s.textContent.trim()),m=raw.match(/^([\d,]+)(.*)$/),end=parseFloat(m[1].replace(',','.')),dec=(m[1].split(',')[1]||'').length,t0=null;
  s.style.fontVariantNumeric='tabular-nums';
  function st(t){t0=t0||t;var p=Math.min(1,(t-t0)/1300),v=end*(1-Math.pow(1-p,3));s.textContent=v.toFixed(dec).replace('.',',')+m[2];if(p<1)requestAnimationFrame(st)}
  requestAnimationFrame(st)})},{threshold:.6});

/* gráficos */
var bars=$$('.fill,[data-cm-bar]');bars.forEach(function(b){b.classList.add('cm-bar');b.dataset.cmw=b.style.width});
var bio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;bio.unobserve(e.target);var b=e.target;setTimeout(function(){b.style.width=b.dataset.cmw},150)})},{threshold:.5});

/* marca-texto */
var marks=$$('p b,p strong,li b,li strong').filter(function(m){return !m.closest('a,h1,h2,.cm-after')});
var mio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('cm-in');mio.unobserve(e.target)}})},{threshold:1,rootMargin:'0px 0px -15% 0px'});

/* capítulos */
var chap=D.createElement('div');chap.className='cm-chapter-pill';chap.setAttribute('aria-hidden','true');D.body.appendChild(chap);
var heads=$$('h2').map(function(h){var sec=h.closest('section');var num=sec&&sec.querySelector('.num');return {el:sec||h,label:num?num.textContent.trim():h.textContent.trim()}});

/* barra */
var bar=D.createElement('div');bar.className='cm-progress-bar';bar.setAttribute('aria-hidden','true');D.body.appendChild(bar);

/* profundidade */
var pxs=hero?$$('img',hero.closest('section')||hero).slice(0,3):[];
pxs.forEach(function(i){i.classList.add('cm-px');i.dataset.cmt=i.style.transform||''});

/* zoom */
var zs=$$('main img,section img,figure img').filter(function(i){return pxs.indexOf(i)<0&&!i.closest('a')});
var lb=D.createElement('div');lb.className='cm-lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Imagem ampliada');
lb.innerHTML='<img alt=""><button type="button">Fechar</button>';D.body.appendChild(lb);
function closeLb(){lb.classList.remove('on')}
lb.addEventListener('click',closeLb);D.addEventListener('keydown',function(e){if(e.key==='Escape')closeLb()});
zs.forEach(function(i){i.classList.add('cm-z');i.addEventListener('click',function(){if(!on('zoom'))return;var im=lb.querySelector('img');im.src=i.currentSrc||i.src;im.alt=i.alt;lb.classList.add('on');lb.querySelector('button').focus()})});

/* chegada */
var arr=D.createElement('div');arr.className='cm-arrive-panel';arr.setAttribute('aria-hidden','true');arr.textContent=cfg.title||(h1?h1.textContent:'');D.body.appendChild(arr);
function arrive(){if(!on('arrive'))return;arr.className='cm-arrive-panel show';void arr.offsetWidth;requestAnimationFrame(function(){arr.classList.add('go')})}
window.CMreplayArrive=function(){scrollTo(0,0);arrive();CMreplayHero()};
window.CMreplayHero=function(){H.classList.remove('cm-hero-in');void H.offsetWidth;setTimeout(function(){H.classList.add('cm-hero-in')},on('arrive')?700:60)};

function onScroll(){var y=scrollY,max=D.documentElement.scrollHeight-innerHeight;
  if(on('progress'))bar.style.transform='scaleX('+(max>0?y/max:0)+')';
  if(on('chapter')){var cur=null;heads.forEach(function(h){if(h.el.getBoundingClientRect().top<innerHeight*.35)cur=h});
    chap.classList.toggle('on',!!cur&&y>innerHeight*.6);if(cur&&chap.textContent!==cur.label)chap.textContent=cur.label}
  if(on('parallax'))pxs.forEach(function(i,k){var sp=[.10,.18,.06][k%3];i.style.transform=(i.dataset.cmt+' translateY('+(-y*sp)+'px)').trim()});
}
addEventListener('scroll',onScroll,{passive:true});

function apply(){
  ALL.forEach(function(n){H.classList.toggle('cm-'+n,on(n))});
  rev.forEach(function(el){el.classList.remove('cm-in');io.unobserve(el);if(on('reveal'))io.observe(el)});
  nums.forEach(function(n){nio.unobserve(n);if(n.dataset.cmv)n.textContent=n.dataset.cmv;if(on('count'))nio.observe(n)});
  bars.forEach(function(b){bio.unobserve(b);if(on('bars')){b.style.width='0%';bio.observe(b)}else b.style.width=b.dataset.cmw});
  marks.forEach(function(m){m.classList.add('cm-m');m.classList.remove('cm-in');mio.unobserve(m);if(on('mark'))mio.observe(m)});
  if(!on('parallax'))pxs.forEach(function(i){i.style.transform=i.dataset.cmt});
  if(!on('chapter'))chap.classList.remove('on');
  onScroll();
}
window.CMset=function(l){FX=l;apply()};
apply();arrive();
requestAnimationFrame(function(){setTimeout(function(){H.classList.add('cm-hero-in')},on('arrive')?700:100)});
})();

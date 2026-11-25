(function(){
var ol=document.querySelector('ol[data-tour]');if(!ol)return;
var items=[].slice.call(ol.children).map(function(li){var s=li.querySelectorAll('span'),img=li.querySelector('img');
  return {src:img.getAttribute('src'),alt:img.alt,num:s[0].textContent,title:s[1].textContent,text:s[2]?s[2].textContent:''}});
var n=items.length;
var wrap=document.createElement('div');wrap.className='rt';wrap.style.height=(n*85+15)+'vh';
var phone='<div class="rt-phone">'+items.map(function(it,i){return '<img src="'+it.src+'" alt="'+it.alt.replace(/"/g,'&quot;')+'"'+(i?' aria-hidden="true"':'')+'>'}).join('')+'</div>';
var steps='<ol class="rt-steps">'+items.map(function(it){return '<li><b>'+it.title+'</b><span>'+it.text+'</span></li>'}).join('')+'</ol>';
wrap.innerHTML='<div class="rt-stick">'+phone+'<div class="rt-side"><div class="rt-count" aria-hidden="true">1<small>de '+n+' toques</small></div>'+steps+'</div></div>';
ol.parentNode.insertBefore(wrap,ol);
var imgs=[].slice.call(wrap.querySelectorAll('.rt-phone img')),lis=[].slice.call(wrap.querySelectorAll('.rt-steps li')),count=wrap.querySelector('.rt-count');
var mq=matchMedia('(min-width: 900px)'),host=ol.closest('section')||document.body,cur=-1;
function set(i){if(i===cur)return;cur=i;
  imgs.forEach(function(im,k){im.classList.toggle('on',k===i);im.classList.toggle('past',k<i);im.setAttribute('aria-hidden',k===i?'false':'true')});
  lis.forEach(function(li,k){li.classList.toggle('on',k===i)});
  count.firstChild.nodeValue=String(i+1)}
function onScroll(){if(!host.classList.contains('rt-on'))return;var r=wrap.getBoundingClientRect(),total=r.height-innerHeight;
  var p=Math.min(.999,Math.max(0,-r.top/total));set(Math.floor(p*n))}
lis.forEach(function(li,k){li.addEventListener('click',function(){var r=wrap.getBoundingClientRect(),total=r.height-innerHeight;
  scrollTo({top:scrollY+r.top+total*(k+.5)/n,behavior:'smooth'})})});
function mode(){host.classList.toggle('rt-on',mq.matches);cur=-1;onScroll()}
(mq.addEventListener?mq.addEventListener('change',mode):mq.addListener(mode));
addEventListener('scroll',onScroll,{passive:true});mode();set(0);
})();

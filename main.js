document.getElementById('footer-year').textContent=new Date().getFullYear();

// ===== SCROLL PROGRESS BAR =====
(function(){
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const bar=document.createElement('div');
  bar.id='scroll-progress';
  document.body.appendChild(bar);
  let ticking=false;
  function update(){
    const h=document.documentElement.scrollHeight-window.innerHeight;
    const pct=h>0?(window.scrollY/h)*100:0;
    bar.style.width=pct+'%';
    ticking=false;
  }
  window.addEventListener('scroll',function(){
    if(!ticking){requestAnimationFrame(update);ticking=true;}
  },{passive:true});
  update();
})();

// ===== HINDI / HINGLISH TOGGLE =====
window.toggleHindi=function(){
  const isHi=document.documentElement.dataset.lang==='hi';
  const next=isHi?'en':'hi';
  document.documentElement.dataset.lang=next;
  document.querySelectorAll('[data-hi]').forEach(function(el){
    if(next==='hi'){
      if(!el.dataset.en)el.dataset.en=el.innerHTML;
      el.innerHTML=el.dataset.hi;
    } else {
      if(el.dataset.en)el.innerHTML=el.dataset.en;
    }
  });
  const lbl=document.getElementById('lang-label');
  const btn=document.getElementById('lang-btn');
  if(lbl)lbl.textContent=next==='hi'?'EN':'हिं';
  if(btn)btn.classList.toggle('hi-active',next==='hi');
  localStorage.setItem('dk-lang',next);
};
(function(){if(localStorage.getItem('dk-lang')==='hi')toggleHindi();})();

// Active nav detection based on current pathname
(function(){
  var seg=window.location.pathname.replace(/\/index\.html$/,'').replace(/\/$/,'').split('/').filter(Boolean);
  var cur=seg.length?seg[0]:'home';
  document.querySelectorAll('[data-page]').forEach(function(el){el.classList.toggle('active',el.dataset.page===cur);});
})();

// theme
const root=document.documentElement,tbtn=document.getElementById('theme');
const saved=localStorage.getItem('dk-theme')||'dark';
root.setAttribute('data-theme',saved);
const moonSVG='<svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;fill:none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
const sunSVG='<svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;fill:none"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
function syncIcon(){tbtn.innerHTML=root.getAttribute('data-theme')==='dark'?sunSVG:moonSVG;}
syncIcon();
tbtn.addEventListener('click',()=>{const d=root.getAttribute('data-theme')==='dark';root.setAttribute('data-theme',d?'light':'dark');localStorage.setItem('dk-theme',d?'light':'dark');syncIcon();});

// Fullscreen toggle
(function(){
  const btn=document.getElementById('fs-btn');
  const iconEnter=document.getElementById('fs-icon-enter');
  const iconExit=document.getElementById('fs-icon-exit');
  function updateIcon(){
    const isFs=!!document.fullscreenElement;
    iconEnter.style.display=isFs?'none':'block';
    iconExit.style.display=isFs?'block':'none';
  }
  function toggle(){
    if(!document.fullscreenElement){
      document.documentElement.requestFullscreen().catch(()=>{});
    } else {
      document.exitFullscreen();
    }
  }
  btn.addEventListener('click',toggle);
  document.addEventListener('fullscreenchange',updateIcon);
  document.addEventListener('keydown',e=>{
    if(e.key==='f'||e.key==='F'){
      const tag=document.activeElement?.tagName;
      if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;
      toggle();
    }
  });
})();

// mobile sidebar
const menuBtn=document.getElementById('menu'),sb=document.getElementById('sidebar');
menuBtn.addEventListener('click',()=>sb.classList.toggle('open'));
document.addEventListener('click',e=>{
  const bnavMoreEl=document.getElementById('bnav-more');
  if(!sb.contains(e.target)&&e.target!==menuBtn&&!bnavMoreEl?.contains(e.target)&&e.target!==bnavMoreEl)
    sb.classList.remove('open');
});
sb.querySelectorAll('.slink').forEach(b=>b.addEventListener('click',()=>sb.classList.remove('open')));

// App launcher — fullscreen overlay, URL never exposed
const appData = {
  agni:  { url:'https://agnicycle-865384871824.us-west2.run.app/',       name:'AgniCycle' },
  spray: { url:'https://spray-calculator-865384871824.us-west2.run.app', name:'Spray Calculator' }
};
function launchApp(id) {
  const d = appData[id];
  const fs = document.getElementById('app-fullscreen');
  document.getElementById('app-frame').src = d.url;
  document.getElementById('app-fs-name').textContent = d.name;
  fs.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeApp() {
  const fs = document.getElementById('app-fullscreen');
  fs.style.display = 'none';
  document.getElementById('app-frame').src = '';
  document.body.style.overflow = '';
}

// Metric count-up animation — triggered when stats scroll into view
(function(){
  function countUp(el,dur){
    if(el.dataset.counted)return;
    el.dataset.counted='1';
    const raw=el.dataset.target||(el.dataset.target=el.textContent.trim());
    const suffix=raw.replace(/[0-9]/g,'');
    const target=parseInt(raw);
    if(isNaN(target))return;
    el.textContent='0'+suffix;
    const start=Date.now();
    const iv=setInterval(()=>{
      const p=Math.min((Date.now()-start)/dur,1);
      el.textContent=Math.round(target*(1-Math.pow(1-p,3)))+suffix;
      if(p>=1)clearInterval(iv);
    },16);
  }
  const statEls=document.querySelectorAll('.stat .n,.stat-n');
  if(!statEls.length)return;
  if(!window.IntersectionObserver){statEls.forEach(el=>countUp(el,1600));return;}
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){countUp(e.target,1600);io.unobserve(e.target);}});
  },{threshold:.3});
  statEls.forEach(el=>io.observe(el));
})();

// Scroll entrance animations via Intersection Observer
(function(){
  if(!window.IntersectionObserver)return;
  const sel='.card,.award-item,.teach-item,.exp-item,.cert-item,.collab-card,.phd-card,.skills-block,.contact-item,.lcard,.music-card,.pub-metrics,.stats-row';
  const els=document.querySelectorAll(sel);
  if(!els.length)return;
  els.forEach(el=>{
    const rect=el.getBoundingClientRect();
    if(rect.top<window.innerHeight-40)return; // already visible — skip
    el.classList.add('reveal');
  });
  const revealed=document.querySelectorAll('.reveal');
  if(!revealed.length)return;
  const io=new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{
      if(!e.isIntersecting)return;
      // Slight stagger for siblings in same parent
      const siblings=[...e.target.parentElement.querySelectorAll('.reveal.in-view')];
      const delay=Math.min(siblings.length*60,180);
      e.target.style.animationDelay=delay+'ms';
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    });
  },{threshold:.1,rootMargin:'0px 0px -24px 0px'});
  revealed.forEach(el=>io.observe(el));
})();

// Live citation metrics from OpenAlex — cached in localStorage to avoid flicker
(function(){
  const ORCID='0000-0003-1167-9672';
  const CACHE_KEY='dk-metrics';
  const CACHE_TTL=6*60*60*1000; // 6 hours
  const labelMap={
    'citations':'cited_by_count',
    'h-index':'h_index',
    'i10':'i10_index',
    'papers':'works_count',
    'publications':'works_count'
  };
  function applyMetrics(vals,skeleton){
    document.querySelectorAll('.stat-mini,.stat,.pub-metric').forEach(el=>{
      const labelEl=el.querySelector('.stat-l,.label,.l');
      const valEl=el.querySelector('.stat-n,.n');
      if(!labelEl||!valEl)return;
      if(skeleton)valEl.classList.add('sk-loading');else valEl.classList.remove('sk-loading');
      const lbl=labelEl.textContent.toLowerCase().trim();
      for(const[key,field]of Object.entries(labelMap)){
        if(lbl.includes(key)&&vals[field]!=null){
          valEl.dataset.target=String(vals[field]);
          valEl.textContent=String(vals[field]);
          break;
        }
      }
    });
  }
  // Apply cached values immediately (no skeleton) to avoid any flicker
  try{
    const c=JSON.parse(localStorage.getItem(CACHE_KEY)||'null');
    if(c&&c.vals)applyMetrics(c.vals,false);
    else document.querySelectorAll('.stat-mini .stat-n,.stat .n,.pub-metric .n').forEach(el=>el.classList.add('sk-loading'));
    // Skip fetch if cache is fresh
    if(c&&Date.now()-c.ts<CACHE_TTL)return;
  }catch(e){
    document.querySelectorAll('.stat-mini .stat-n,.stat .n,.pub-metric .n').forEach(el=>el.classList.add('sk-loading'));
  }
  fetch('https://api.openalex.org/authors/https://orcid.org/'+ORCID+'?select=cited_by_count,summary_stats,works_count',
    {headers:{'User-Agent':'dhananjay-website/1.0 (mailto:dhkrnl37@gmail.com)'}}
  ).then(r=>r.ok?r.json():null).then(d=>{
    if(!d)return document.querySelectorAll('.sk-loading').forEach(el=>el.classList.remove('sk-loading'));
    const vals={
      cited_by_count:d.cited_by_count,
      h_index:d.summary_stats?.h_index,
      i10_index:d.summary_stats?.i10_index,
      works_count:d.works_count
    };
    applyMetrics(vals,false);
    try{localStorage.setItem(CACHE_KEY,JSON.stringify({ts:Date.now(),vals}));}catch(e){}
  }).catch(()=>document.querySelectorAll('.sk-loading').forEach(el=>el.classList.remove('sk-loading')));
})();

// Publications search + category filter
(function(){
  const search=document.getElementById('pub-search');
  const btns=document.querySelectorAll('[data-pub-filter]');
  const empty=document.getElementById('pub-empty');
  if(!search&&!btns.length)return;
  let activeFilter='all';

  function apply(){
    const term=(search?search.value.toLowerCase().trim():'');
    let anyVisible=false;
    document.querySelectorAll('.pub-section').forEach(sec=>{
      const typeMatch=activeFilter==='all'||sec.dataset.type===activeFilter;
      if(!typeMatch){
        sec.style.opacity='0';sec.style.transform='translateY(-6px)';
        setTimeout(()=>{if(sec.style.opacity==='0')sec.style.display='none';},220);
        return;
      }
      // Show section
      sec.style.display='';
      requestAnimationFrame(()=>{sec.style.opacity='1';sec.style.transform='';});
      let secVisible=false;
      sec.querySelectorAll('.pub-item').forEach(item=>{
        const show=!term||item.textContent.toLowerCase().includes(term);
        if(!show){
          item.style.opacity='0';item.style.transform='scale(.97)';
          setTimeout(()=>{if(item.style.opacity==='0')item.style.display='none';},190);
        } else {
          item.style.display='';
          requestAnimationFrame(()=>{item.style.opacity='1';item.style.transform='';});
          secVisible=true;anyVisible=true;
        }
      });
      const hd=sec.querySelector('.pub-cat-hd');
      if(hd)hd.style.display=secVisible?'':'none';
      if(secVisible)anyVisible=true;
    });
    setTimeout(()=>{if(empty)empty.style.display=anyVisible?'none':'block';},230);
  }

  if(search)search.addEventListener('input',apply);
  btns.forEach(btn=>btn.addEventListener('click',()=>{
    activeFilter=btn.dataset.pubFilter;
    btns.forEach(b=>b.classList.toggle('active',b===btn));
    apply();
  }));
})();

// Live publications list from OpenAlex
(function(){
  const ORCID='0000-0003-1167-9672';
  const ME_ORCID='https://orcid.org/'+ORCID;

  function fmtName(n){
    const p=n.trim().split(/\s+/);
    if(p.length===1)return p[0];
    return p.slice(0,-1).map(x=>x[0]).join(' ')+' '+p[p.length-1];
  }

  function fmtAuthors(auths){
    function isMe(a){return a.author.orcid===ME_ORCID||a.author.display_name==='Dhananjay Kumar';}
    if(auths.length<=5){
      return auths.map(a=>{const n=fmtName(a.author.display_name);return isMe(a)?`<b>${n}</b>`:n;}).join(', ');
    }
    const mi=auths.findIndex(isMe);
    if(mi<=2){
      const s=auths.slice(0,3).map(a=>{const n=fmtName(a.author.display_name);return isMe(a)?`<b>${n}</b>`:n;});
      return s.join(', ')+', et al.';
    }
    return fmtName(auths[0].author.display_name)+', …, <b>'+fmtName(auths[mi].author.display_name)+'</b>, et al.';
  }

  function pubHTML(w,extraClass){
    const title=w.title||'';
    const year=w.publication_year||'';
    const journal=w.primary_location?.source?.display_name||'';
    const url=w.primary_location?.landing_page_url||(w.doi?'https://doi.org/'+w.doi.replace('https://doi.org/',''):'#');
    const authors=fmtAuthors(w.authorships||[]);
    const jPart=journal?`<em>${journal}</em>`:'';
    const meta=[authors,jPart,year].filter(Boolean).join(' · ');
    return `<a href="${url}" class="pub-item${extraClass?' '+extraClass:''}" target="_blank"><div class="pub-ico j"><i class="ti ti-file-text"></i></div><div><div class="pub-title">${title}</div><div class="pub-meta">${meta}</div></div><i class="ti ti-arrow-up-right pub-arr"></i></a>`;
  }

  fetch('https://api.openalex.org/works?filter=author.orcid:'+ORCID+'&sort=publication_date:desc&per_page=50&select=title,publication_year,primary_location,authorships,doi,type',
    {headers:{'User-Agent':'dhananjay-website/1.0 (mailto:dhkrnl37@gmail.com)'}}
  ).then(r=>r.ok?r.json():null).then(data=>{
    if(!data||!data.results)return;
    const journals=data.results.filter(w=>w.type==='journal-article');

    // Update home page recent list (top 3)
    const homeList=document.getElementById('home-pubs-list');
    if(homeList&&journals.length){
      homeList.innerHTML=journals.slice(0,3).map(w=>pubHTML(w)).join('');
    }

    // Update publications page full international journals list
    const intlList=document.getElementById('intl-journals-list');
    if(intlList&&journals.length){
      intlList.innerHTML=journals.map(w=>pubHTML(w)).join('');
    }
  }).catch(()=>{});
})();

// Bottom nav — sync active state on page load
setTimeout(function(){
  const bnavMore=document.getElementById('bnav-more');
  const sb=document.getElementById('sidebar');
  if(bnavMore)bnavMore.addEventListener('click',()=>sb.classList.toggle('open'));
  // Sync active state
  var seg=window.location.pathname.replace(/\/index\.html$/,'').replace(/\/$/,'').split('/').filter(Boolean);
  var cur=seg.length?seg[0]:'home';
  const bnavItems=document.querySelectorAll('#bottom-nav .bnav[data-page]');
  const inBar=[...bnavItems].some(b=>b.dataset.page===cur);
  bnavItems.forEach(b=>b.classList.toggle('active',b.dataset.page===cur));
  if(bnavMore)bnavMore.classList.toggle('active',!inBar);
},0);


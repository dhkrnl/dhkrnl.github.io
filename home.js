// Research graph interaction (home page only) — mouse + touch
(function(){
  const svg=document.getElementById('research-graph');
  if(!svg)return;
  const gnodes=svg.querySelectorAll('.gnode');
  const glines=svg.querySelectorAll('.gline');
  const ginfo=document.getElementById('graph-info');
  const isTouch=()=>'ontouchstart' in window||navigator.maxTouchPoints>0;
  const navMap={h2:'/publications/',spray:'/tools/',cfd:'/skills/',battery:'/projects/',laser:'/phd/',altfuel:'/publications/'};
  function getDflt(){
    const hi=document.documentElement.dataset.lang==='hi';
    if(isTouch())return hi?`<span class="graph-hint">किसी node पर tap करें</span>`:`<span class="graph-hint">tap a node to explore</span>`;
    return hi?`<span class="graph-hint">node पर hover करें · खोलने के लिए click करें</span>`:`<span class="graph-hint">hover a node · click to open</span>`;
  }
  const descHi={h2:'HCNG blends, laser और spark ignition, CVCCs में flame kernel propagation',spray:'Schlieren और Mie-scattering imaging से macroscopic spray characterization',cfd:'CONVERGE CFD से 3D combustion, spray और thermal runaway की numerical modelling',battery:'EV और hybrid vehicles के लिए Li-ion cell thermal runaway modelling',laser:'Laser ignition, LIBS spectroscopy, high-speed optical engine diagnostics',altfuel:'Methanol, ethanol, HCNG — low-carbon IC engine fuels की combustion characterization'};

  // Entrance stagger: lines then nodes
  glines.forEach((l,i)=>{l.style.animation=`lineIn .4s ${.12+i*.05}s ease both`;});
  gnodes.forEach((nd,i)=>{nd.style.animation=`nodeIn .38s ${.28+i*.07}s ease both`;});

  let activeNode=null;

  function activate(nd){
    const id=nd.dataset.id,col=nd.dataset.color,desc=nd.dataset.desc,name=nd.dataset.name;
    const ring=nd.querySelector('.gnode-ring'),circ=nd.querySelector('.gnode-circle');
    gnodes.forEach(n=>n.style.opacity='0.3');
    nd.style.opacity='1';
    circ.style.filter=`drop-shadow(0 0 9px ${col})`;
    ring.style.opacity='0.85';
    ring.setAttribute('stroke-width','1.8');
    glines.forEach(l=>{
      const m=l.dataset.node===id;
      l.setAttribute('stroke',m?col:'rgba(59,130,246,.06)');
      l.setAttribute('stroke-width',m?'2.5':'1');
      l.style.opacity=m?'1':'0.4';
    });
    const dispDesc=document.documentElement.dataset.lang==='hi'?(descHi[id]||desc):desc;
    const openHint=(!isTouch()&&navMap[id])?` <span style="color:${col};font-weight:600;white-space:nowrap">↗ open</span>`:'';
    ginfo.innerHTML=`<b style="color:${col}">${name}</b> — ${dispDesc}${openHint}`;
    activeNode=nd;
  }

  function reset(){
    gnodes.forEach(n=>{
      n.style.opacity='1';
      const c=n.querySelector('.gnode-circle'),r=n.querySelector('.gnode-ring');
      if(c)c.style.filter='';
      if(r){r.style.opacity='0.35';r.setAttribute('stroke-width','1');}
    });
    glines.forEach(l=>{
      l.setAttribute('stroke','rgba(59,130,246,.15)');
      l.setAttribute('stroke-width','1.2');
      l.style.opacity='1';
    });
    ginfo.innerHTML=getDflt();
    activeNode=null;
  }

  gnodes.forEach(nd=>{
    // Mouse
    nd.addEventListener('mouseenter',()=>activate(nd));
    nd.addEventListener('mouseleave',reset);
    // Click navigates to related page (touch preventDefault below suppresses this on tap)
    nd.addEventListener('click',()=>{const u=navMap[nd.dataset.id];if(u)location.href=u;});
    // Touch — tap to toggle; tap same node again to deactivate
    nd.addEventListener('touchstart',e=>{
      e.preventDefault();
      if(activeNode===nd){reset();}else{activate(nd);}
    },{passive:false});
    // Keyboard — focus previews, Enter/Space opens
    nd.setAttribute('tabindex','0');
    nd.setAttribute('role','link');
    nd.setAttribute('aria-label',nd.dataset.name+' — '+nd.dataset.desc);
    nd.addEventListener('focus',()=>activate(nd));
    nd.addEventListener('blur',reset);
    nd.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){e.preventDefault();const u=navMap[nd.dataset.id];if(u)location.href=u;}
    });
    nd.style.cursor='pointer';
  });

  // Center DK node → projects overview
  ['dk-core','dk-core-t'].forEach(id=>{
    const el=document.getElementById(id);
    if(el)el.addEventListener('click',()=>{location.href='/projects/';});
  });

  // Tap on SVG background resets
  svg.addEventListener('touchstart',e=>{
    if(!e.target.closest('.gnode'))reset();
  },{passive:true});

  // Update hint text on first touch
  svg.addEventListener('touchstart',()=>{
    if(ginfo.innerHTML===getDflt())ginfo.innerHTML=getDflt();
  },{passive:true,once:true});

  ginfo.innerHTML=getDflt();
})();

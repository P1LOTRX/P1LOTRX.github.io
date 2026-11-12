
/* Adım demo oynatıcı: her .demo kendi zaman çizelgesini oynatır, görünürken döner. */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function sleep(ms){ return new Promise(function(r){ setTimeout(r, reduce ? 0 : ms); }); }

  // Ortak menü
  var mb = document.querySelector('.menu-btn'), links = document.querySelector('.top nav .links');
  if (mb && links) mb.addEventListener('click', function(){ var o = links.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });
  var topEl = document.getElementById('top');
  if (topEl) window.addEventListener('scroll', function(){ topEl.classList.toggle('scrolled', window.scrollY > 8); }, {passive:true});

  var TL = {
    share: [
      {s:0, f:'app', at:'.d-share', wait:900},
      {tap:1, add:{'.sheet':'up','.scrim':'on'}, wait:1300},
      {s:1, at:'.d-adim', wait:700},
      {tap:1, rm:{'.sheet':'up','.scrim':'on'}, add:{'.tst':'in'}, wait:1700},
      {s:2, hide:1, wait:1600},
      {s:3, f:'kutu', rm:{'.tst':'in'}, add:{'.newcard':'in'}, wait:1300},
      {add:{'.newcat':'in'}, wait:2400}
    ],
    voice: [
      {s:0, f:'today', at:'.plus', wait:900},
      {hold:1, add:{'.plus':'hold','.sheet':'up','.scrim':'on'}, wait:500},
      {s:1, type:['.typed','yarın sabah dokuzda annemi ara, süt al'], wait:600},
      {unhold:1, rm:{'.plus':'hold'}, s:2, add:{'.c1':'in'}, wait:500},
      {add:{'.c2':'in'}, wait:1300},
      {s:3, at:'.d-addall', wait:600},
      {tap:1, rm:{'.sheet':'up','.scrim':'on'}, add:{'.t1':'in'}, wait:300},
      {add:{'.t2':'in'}, hide:1, wait:2400}
    ],
    cal: [
      {s:0, f:'cals', at:'.d-new', wait:900},
      {tap:1, add:{'.sheet':'up','.scrim':'on'}, wait:1000},
      {s:1, at:'.d-ozel', wait:700},
      {tap:1, f:'form', rm:{'.sheet':'up','.scrim':'on'}, wait:500},
      {type:['.typed','Gitar çalışması'], wait:500},
      {at:'.d-purple', wait:600},
      {tap:1, add:{'.d-purple':'sel'}, wait:600},
      {at:'.d-create', wait:600},
      {tap:1, s:2, f:'month', wait:700},
      {at:'[data-d="3"]', wait:500},{tap:1, add:{'[data-d="3"]':'x'}, set:{'.d-cnt':'1 gün'}, wait:350},
      {at:'[data-d="4"]', wait:450},{tap:1, add:{'[data-d="4"]':'x'}, set:{'.d-cnt':'2 gün'}, wait:350},
      {at:'[data-d="6"]', wait:450},{tap:1, add:{'[data-d="6"]':'x'}, set:{'.d-cnt':'3 gün'}, wait:350},
      {at:'[data-d="10"]', wait:450},{tap:1, add:{'[data-d="10"]':'x'}, set:{'.d-cnt':'4 gün'}, wait:350},
      {s:3, hide:1, add:{'.d-goal':'in'}, wait:2600}
    ],
    close: [
      {s:0, f:'home', add:{'.banner':'in'}, wait:900},
      {at:'.banner', wait:600},
      {tap:1, rm:{'.banner':'in'}, f:'left', wait:800},
      {s:1, at:'.d-y1', wait:600},{tap:1, add:{'.r1':'gone'}, wait:500},
      {at:'.d-y2', wait:500},{tap:1, add:{'.r2':'gone'}, wait:700},
      {s:2, f:'stars', at:'.st1', wait:600},{tap:1, add:{'.st1':'on'}, wait:300},
      {at:'.st2', wait:400},{tap:1, add:{'.st2':'on'}, wait:300},
      {at:'.st3', wait:400},{tap:1, add:{'.st3':'on'}, wait:700},
      {s:3, f:'night', hide:1, add:{'.nightbg':'in'}, wait:2800}
    ],
    studio: [
      {s:0, f:'sum', at:'.d-story', wait:900},
      {tap:1, f:'st', wait:900},
      {s:1, at:'.tpl-area', wait:400},
      {swipe:1, rm:{'.k1':'on'}, add:{'.k2':'on'}, wait:900},
      {swipe:1, rm:{'.k2':'on'}, add:{'.k3':'on'}, wait:900},
      {swipe:1, rm:{'.k3':'on'}, add:{'.k1':'on'}, wait:700},
      {s:2, at:'.d-photo', wait:600},
      {tap:1, add:{'.photo':'in','.k1':'onphoto'}, wait:1000},
      {at:'.d-duo', wait:600},
      {tap:1, add:{'.photo':'duo','.d-duo':'sel'}, rm:{'.d-orig':'sel'}, wait:900},
      {s:3, at:'.d-sharebtn', wait:600},
      {tap:1, add:{'.tst':'in'}, hide:1, wait:2400}
    ],
    run: [
      {s:0, f:'move', at:'.d-start', wait:900},
      {tap:1, f:'live', run:'runLive', wait:3600},
      {s:1, at:'.d-finish', wait:600},
      {hold:1, add:{'.holdring':'in'}, wait:1300},
      {unhold:1, s:2, f:'sum', hide:1, add:{'.splits':'in'}, run:'runSum', wait:1400},
      {s:3, add:{'.d-pr':'in'}, wait:2600}
    ],
    wrapped: [
      {s:0, f:'w', card:0, wait:2300},
      {s:1, card:1, wait:2300},
      {card:2, wait:2300},
      {card:3, wait:2300},
      {s:2, card:4, wait:900},
      {at:'.wshare', wait:600},
      {tap:1, add:{'.tst':'in'}, hide:1, wait:2200}
    ]
  };

  var RUN = {
    runLive: function(root){
      var p = root.querySelector('.lroute'), L = p.getTotalLength(), km = root.querySelector('.lkm'), tm = root.querySelector('.ltm'), dot = root.querySelector('.ldot');
      p.style.strokeDasharray = L; var t0 = performance.now(), D = reduce ? 1 : 3400;
      (function f(now){ var t = Math.min(1,(now-t0)/D); p.style.strokeDashoffset = L*(1-t); var pt = p.getPointAtLength(L*t); dot.setAttribute('cx',pt.x); dot.setAttribute('cy',pt.y);
        var k = 2.4*t; km.textContent = k.toFixed(2).replace('.',','); var sec = Math.round(k*352); tm.textContent = Math.floor(sec/60)+':'+('0'+sec%60).slice(-2);
        if (t<1 && root._alive) requestAnimationFrame(f); })(t0);
    },
    runSum: function(root){ var p = root.querySelector('.sroute'); if(!p) return; var L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.getBoundingClientRect(); p.style.transition = 'stroke-dashoffset 1.2s ease'; p.style.strokeDashoffset = 0; },
    wrap: async function(root){
      var cards = root.querySelectorAll('.wcard'), bars = root.querySelectorAll('.wbar i');
      for (var i=0;i<cards.length && root._alive;i++){
        cards.forEach(function(c,j){ c.classList.toggle('on', j===i); });
        bars.forEach(function(b,j){ b.className = j<i ? 'done' : (j===i ? 'run' : ''); });
        await sleep(2300);
      }
    }
  };

  function center(screen, el){
    var a = screen.getBoundingClientRect(), b = el.getBoundingClientRect();
    return [ (b.left + b.width/2 - a.left) / a.width * 100, (b.top + b.height/2 - a.top) / a.height * 100 ];
  }

  function setup(demo){
    var name = demo.getAttribute('data-demo'), tl = TL[name]; if (!tl) return;
    var screen = demo.querySelector('.screen'), steps = demo.querySelectorAll('.dsteps li');
    var initial = screen.innerHTML, visible = false, gen = 0;
    demo.style.setProperty('--acc', getComputedStyle(demo).getPropertyValue('--acc') || '');

    function q(sel){ return screen.querySelectorAll(sel); }
    function each(map, fn){ for (var sel in map){ q(sel).forEach(function(el){ fn(el, map[sel]); }); } }

    async function play(){
      var my = ++gen;
      screen.innerHTML = initial; screen._alive = true; demo._root = screen;
      var finger = screen.querySelector('.finger');
      steps.forEach(function(li){ li.classList.remove('on','done'); });
      for (var i=0;i<tl.length;i++){
        while (!visible && !reduce) { await sleep(300); if (my !== gen) return; }
        if (my !== gen) return;
        var st = tl[i];
        if (st.s !== undefined) steps.forEach(function(li,j){ li.classList.toggle('on', j===st.s); li.classList.toggle('done', j<st.s); });
        if (st.f) q('.fr').forEach(function(fr){ fr.classList.toggle('on', fr.getAttribute('data-f') === st.f); });
        if (st.at){ var tg = screen.querySelector(st.at); if (tg){ var c = center(screen, tg); finger.classList.remove('hide'); finger.style.left = c[0]+'%'; finger.style.top = c[1]+'%'; } }
        if (st.tap){ finger.classList.add('tap'); await sleep(160); finger.classList.remove('tap'); }
        if (st.swipe){ var l0 = parseFloat(finger.style.left)||50; finger.style.transition='none'; finger.style.left=(l0+22)+'%'; finger.getBoundingClientRect(); finger.style.transition=''; finger.classList.add('tap'); finger.style.left=(l0-22)+'%'; await sleep(450); finger.classList.remove('tap'); finger.style.left=l0+'%'; }
        if (st.hold) finger.classList.add('hold');
        if (st.unhold) finger.classList.remove('hold');
        if (st.hide) finger.classList.add('hide');
        if (st.add) each(st.add, function(el,c){ el.classList.add(c); });
        if (st.rm) each(st.rm, function(el,c){ el.classList.remove(c); });
        if (st.set) each(st.set, function(el,v){ el.textContent = v; });
        if (st.card !== undefined){
          q('.wcard').forEach(function(c,j){ c.classList.toggle('on', j===st.card); });
          q('.wbar').forEach(function(bar){ bar.querySelectorAll('i').forEach(function(x,j){ x.className = j<st.card ? 'done' : (j===st.card ? 'run' : ''); }); });
        }
        if (st.run) RUN[st.run](screen);
        if (st.type){
          var el = screen.querySelector(st.type[0]), txt = st.type[1];
          for (var k=1;k<=txt.length;k++){ if (my !== gen) return; el.textContent = txt.slice(0,k); await sleep(55); }
        }
        await sleep(st.wait || 600);
      }
      steps.forEach(function(li){ li.classList.remove('on'); li.classList.add('done'); });
      if (reduce) return;
      await sleep(1400);
      if (my === gen) play();
    }

    var rb = demo.querySelector('.replay');
    if (rb) rb.addEventListener('click', function(){ screen._alive = false; play(); });
    if ('IntersectionObserver' in window){
      new IntersectionObserver(function(es){ es.forEach(function(e){ visible = e.isIntersecting; }); }, {threshold:.35}).observe(demo);
    } else visible = true;
    play();
  }
  document.querySelectorAll('.demo[data-demo]').forEach(setup);

  // Etkileşimli bahçe
  document.querySelectorAll('.yard button.pl').forEach(function(b){
    var lvl = +b.getAttribute('data-l') || 0, g = b.querySelector('.g');
    function apply(){ g.style.transform = 'scale('+(0.35+0.13*lvl)+')'; b.setAttribute('aria-label', b.getAttribute('data-n')+', büyüme '+(lvl+1)+'/6. Sulamak için dokun'); }
    apply();
    b.addEventListener('click', function(){
      lvl = (lvl+1) % 6; apply();
      var yard = b.closest('.yard'), r = b.getBoundingClientRect(), y = yard.getBoundingClientRect();
      for (var i=0;i<4;i++){ var d = document.createElement('i'); d.className='drop'; d.style.left=(r.left - y.left + r.width*(.3+.13*i))+'px'; d.style.top=(r.top - y.top + 10)+'px'; d.style.animationDelay=(i*70)+'ms'; yard.appendChild(d); setTimeout(function(x){ x.remove(); }, 900, d); }
    });
  });
})();

/* Çerez onayı ve Google Analytics (yalnızca izin verilirse yüklenir) */
(function(){
  var GA = 'G-VM0VSPVY6L', KEY = 'adim-cerez-onayi';
  function get(){ try { return localStorage.getItem(KEY); } catch(e){ return null; } }
  function set(v){ try { localStorage.setItem(KEY, v); } catch(e){} }
  function loadGA(){
    if (window.__gaLoaded) return; window.__gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ dataLayer.push(arguments); };
    gtag('consent', 'default', {analytics_storage:'granted', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
    gtag('js', new Date());
    gtag('config', GA, {allow_google_signals:false, allow_ad_personalization_signals:false});
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA; document.head.appendChild(s);
  }
  function clearGA(){
    document.cookie.split(';').forEach(function(c){ var n = c.split('=')[0].trim(); if (n.indexOf('_ga') === 0){ ['', '.adimapp.me', 'adimapp.me'].forEach(function(d){ document.cookie = n + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : ''); }); } });
  }
  var bar = document.createElement('div');
  bar.className = 'consent'; bar.hidden = true; bar.setAttribute('role', 'dialog'); bar.setAttribute('aria-label', 'Çerez tercihi');
  bar.innerHTML = '<p>İzin verirsen, siteyi iyileştirmek için Google Analytics ile hangi sayfaların okunduğunu ölçüyoruz. Bunun için çerez kullanılır; reklam için kullanılmaz. Ayrıntılar <a href="/cerezler/">çerez politikasında</a>.</p><div class="row2"><button type="button" class="no">Reddet</button><button type="button" class="yes">Kabul et</button></div>';
  document.body.appendChild(bar);
  bar.querySelector('.yes').addEventListener('click', function(){ set('evet'); bar.hidden = true; loadGA(); });
  bar.querySelector('.no').addEventListener('click', function(){ set('hayir'); bar.hidden = true; clearGA(); if (window.__gaLoaded) location.reload(); });
  document.querySelectorAll('[data-cerez]').forEach(function(b){ b.addEventListener('click', function(){ bar.hidden = false; bar.querySelector('.yes').focus(); }); });
  var v = get();
  if (v === 'evet') loadGA(); else if (v !== 'hayir') bar.hidden = false;
})();

(function(){
  if(!document.getElementById('tur')) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var top = document.getElementById('top');
  var check = '<svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // Planla
  var T = ['Annemi ara','Süt al','Ders tekrarı, 2 saat','Kitap 30 sayfa','Akşam 5 km koş','Faturayı öde'];
  var tasksEl = document.getElementById('tasks');
  tasksEl.innerHTML = T.map(function(t){return '<div class="task"><span class="box">'+check+'</span><span>'+t+'</span></div>';}).join('');
  var taskEls = tasksEl.children;

  // Takvim: Kasım 2026, 1 Kasım Pazar, Pazartesi başlangıçlı
  var cal = document.getElementById('cal');
  var heads = ['Pt','Sa','Ça','Pe','Cu','Ct','Pz'];
  var html = heads.map(function(h){return '<b>'+h+'</b>';}).join('');
  for (var e=0;e<6;e++) html += '<span class="e"></span>';
  for (var d=1; d<=30; d++) html += '<span data-d="'+d+'"'+(d===12?' class="t"':'')+'>'+d+'</span>';
  cal.innerHTML = html;
  var marked = [2,3,5,6,9,10,11,12,13];
  var calN = document.getElementById('calN');

  // Hareket
  var route2 = document.getElementById('route2'), runner = document.getElementById('runner');
  var L = route2.getTotalLength();
  route2.style.strokeDasharray = L; route2.style.strokeDashoffset = L;
  var kmEl = document.getElementById('km'), tmEl = document.getElementById('tm'), elev = document.getElementById('elev');
  var km2 = document.getElementById('km2'), km2c = document.getElementById('km2c');

  // Kutu
  var kcards = document.querySelectorAll('#kutu .kcard'), toast = document.getElementById('toast');

  // Bahçe
  var P = [
    {pot:'#B79BFF', g:'<svg viewBox="0 0 60 80" width="100%"><path d="M30 80V30" stroke="#3E8E3A" stroke-width="4"/><path d="M30 50c-12-2-18-10-18-18 10 0 18 6 18 18zM30 40c10-2 16-9 16-16-9 0-16 6-16 16z" fill="#5DB04F"/><circle cx="30" cy="22" r="10" fill="#E2367A"/><circle cx="30" cy="22" r="4" fill="#FFD23F"/></svg>'},
    {pot:'#FF9F6E', g:'<svg viewBox="0 0 60 80" width="100%"><rect x="20" y="22" width="20" height="58" rx="10" fill="#3FA35B"/><rect x="6" y="40" width="12" height="22" rx="6" fill="#3FA35B"/><rect x="42" y="34" width="12" height="20" rx="6" fill="#3FA35B"/><circle cx="30" cy="20" r="5" fill="#FF7438"/></svg>'},
    {pot:'#7FB5FF', g:'<svg viewBox="0 0 60 80" width="100%"><path d="M30 80V24" stroke="#3E8E3A" stroke-width="4"/><g fill="#FFD23F"><circle cx="30" cy="20" r="14"/></g><circle cx="30" cy="20" r="6" fill="#7A4A1E"/><path d="M30 56c-12 0-18-8-18-14 10 0 18 5 18 14z" fill="#5DB04F"/></svg>'},
    {pot:'#6FD1A8', g:'<svg viewBox="0 0 60 80" width="100%"><path d="M30 80V40" stroke="#6B4A2E" stroke-width="5"/><circle cx="30" cy="30" r="22" fill="#4CAF50"/><circle cx="22" cy="26" r="4" fill="#FF5A4E"/><circle cx="36" cy="22" r="4" fill="#FF5A4E"/><circle cx="34" cy="38" r="4" fill="#FF5A4E"/></svg>'}
  ];
  var pots = document.getElementById('pots');
  pots.innerHTML = P.map(function(p){return '<div class="plant"><div class="g" style="width:100%">'+p.g+'</div><div class="pot" style="background:'+p.pot+'"></div></div>';}).join('');
  var P2 = [P[2],P[3],P[0]].map(function(p,i){return {pot:['#FFD23F','#B79BFF','#FF9F6E'][i], g:p.g};});
  document.getElementById('pots2').innerHTML = P2.map(function(p){return '<div class="plant" style="width:30%"><div class="g" style="width:100%">'+p.g+'</div><div class="pot" style="background:'+p.pot+'"></div></div>';}).join('');
  var gs = document.querySelectorAll('#pots .g, #pots2 .g'), gtxt = document.getElementById('gtxt');

  // Fan
  var fans = [document.getElementById('fan1'),document.getElementById('fan2'),document.getElementById('fan3')];

  var tour = document.getElementById('tur');
  var arts = tour.querySelectorAll('.copy article'), scenes = tour.querySelectorAll('.scene'), steps = tour.querySelectorAll('.steps a');
  var N = 6, cur = -1;

  function fmt(n){return n.toFixed(2).replace('.',',');}
  function clamp(x){return x<0?0:x>1?1:x;}

  function render(p){
    var idx = Math.min(N-1, Math.floor(p*N));
    var t = clamp(p*N - idx);
    if (idx !== cur){
      cur = idx; tour.setAttribute('data-scene', idx);
      for (var i=0;i<N;i++){ arts[i].classList.toggle('on', i===idx); scenes[i].classList.toggle('on', i===idx); steps[i].classList.toggle('on', i===idx); }
    }
    // Her sahneyi kendi ilerlemesiyle güncelle (önceki sahneler tamam, sonrakiler başta)
    var ts = []; for (var k=0;k<N;k++) ts[k] = k<idx?1:(k>idx?0:t);
    // 0
    var done = Math.round(ts[0]*T.length);
    for (var a=0;a<taskEls.length;a++) taskEls[a].classList.toggle('done', a<done);
    var pc = Math.round(done/T.length*100);
    document.getElementById('pct').textContent = '%'+pc;
    document.getElementById('pbar').style.width = pc+'%';
    // 1
    var mc = Math.round(ts[1]*marked.length);
    for (var m=0;m<marked.length;m++){ var c = cal.querySelector('[data-d="'+marked[m]+'"]'); c.classList.toggle('x', m<mc); }
    calN.textContent = mc+' gün';
    // 2
    var r = ts[2];
    route2.style.strokeDashoffset = L*(1-r);
    var pt = route2.getPointAtLength(L*r); runner.setAttribute('cx',pt.x); runner.setAttribute('cy',pt.y);
    var kmv = 5.02*r; kmEl.textContent = fmt(kmv);
    var sec = Math.round(kmv*356); tmEl.textContent = Math.floor(sec/60)+':'+('0'+(sec%60)).slice(-2);
    elev.setAttribute('width', 200*r);
    var show2 = r>0.62; km2.setAttribute('opacity', show2?1:0); km2c.setAttribute('opacity', show2?1:0);
    // 3
    var kc = Math.round(ts[3]*(kcards.length+0.4));
    for (var q=0;q<kcards.length;q++) kcards[q].classList.toggle('out', q>=kc);
    toast.classList.toggle('out', !(ts[3]>0.15 && ts[3]<0.92));
    // 4
    for (var g=0; g<gs.length; g++){ var gt = clamp(ts[4]*1.7 - g*0.1); gs[g].style.transform = 'scale('+(0.25+0.75*gt)+')'; }
    gtxt.textContent = ts[4]>0.85 ? '7 bitki çiçek açtı. Kitap serin 30 gün.' : (ts[4]>0.35 ? '7 bitki büyüyor' : '7 bitki filizleniyor');
    // 5
    var f = ts[5];
    fans[0].style.transform = 'translate('+(-170*f)+'px,'+(20*f)+'px) rotate('+(-14*f)+'deg)';
    fans[1].style.transform = 'translate('+(170*f)+'px,'+(10*f)+'px) rotate('+(12*f)+'deg)';
    fans[2].style.transform = 'translate('+(-20*f)+'px,'+(-160*f)+'px) rotate('+(-4*f)+'deg)';
  }

  var ticking = false;
  function onScroll(){
    top.classList.toggle('scrolled', window.scrollY > 8);
    if (ticking) return; ticking = true;
    requestAnimationFrame(function(){
      ticking = false;
      var rect = tour.getBoundingClientRect();
      var total = tour.offsetHeight - window.innerHeight;
      render(clamp(-rect.top / total));
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  onScroll();

  for (var s=0;s<steps.length;s++){
    steps[s].addEventListener('click', function(ev){
      ev.preventDefault();
      var i = +this.getAttribute('data-go');
      var total = tour.offsetHeight - window.innerHeight;
      window.scrollTo({top: tour.offsetTop + total*(i+0.5)/N, behavior: reduce?'auto':'smooth'});
    });
  }

  // Şablon duvarı
  var tpl = [
    {bg:'#FF7438',fg:'#2A1206',top:'Salı akşam koşusu',n:'5,02',u:'kilometre',m:['29:48','5:56 /km']},
    {bg:'#FFFDF6',fg:'#17151F',top:'Koşu bileti No 0042',n:'19:42',u:'Kalkış, 5,02 km',m:['Varış 20:12'],ticket:true},
    {bg:'#6A3DF0',fg:'#fff',top:'Kasım özeti',n:'42 km',u:'Bu ay koştum',m:['12 koşu']},
    {bg:'#0E8A68',fg:'#fff',top:'Oruç 2026',n:'23',u:'gün tuttum',m:['Bu ay 9 gün']},
    {bg:'#17151F',fg:'#FF7AE0',top:'Gece koşusu',n:'5,02',u:'kilometre',m:['Bahane yok'],neon:true},
    {bg:'#F3E9D2',fg:'#2A1206',top:'Koşu fişi',n:'5,02 km',u:'Toplam',m:['Teşekkür ederiz'],mono:true},
    {bg:'#2F55F4',fg:'#fff',top:'Yeni rekor',n:'4:43',u:'en hızlı km',m:['Eski 4:58']},
    {bg:'#FFD23F',fg:'#17151F',top:'Kitap',n:'30',u:'gündür okuyorum',m:['Toplam 112 gün']},
    {bg:'#E2367A',fg:'#fff',top:'Okul yokuşu',n:'2:52',u:'yeni en iyin',m:['4. deneme']},
    {bg:'#D9F3EA',fg:'#0B5E47',top:'Bahçem',n:'9',u:'bitki büyüttüm',m:['2 efsane']},
    {bg:'#0B6A66',fg:'#fff',top:'Yıl özeti',n:'611',u:'km hareket',m:['86 kayıt']},
    {bg:'#FFFFFF',fg:'#17151F',top:'Dergi kapağı',n:'KOŞU',u:'Sayı 4, Kasım',m:['5,02 km']}
  ];
  function card(t){
    var font = t.mono ? 'font-family:ui-monospace,Menlo,monospace;' : '';
    var glow = t.neon ? 'text-shadow:0 0 12px #FF7AE0,0 0 2px #fff;' : '';
    var border = t.ticket ? 'box-shadow:inset 0 0 0 2px #17151F;' : (t.bg==='#FFFFFF'?'box-shadow:inset 0 0 0 1px #E9E6DF;':'');
    return '<div class="tpl" style="background:'+t.bg+';color:'+t.fg+';'+font+border+'" aria-hidden="true"><span class="logo">'+t.top+'</span><div><div class="n" style="'+glow+'">'+t.n+'</div><div class="u">'+t.u+'</div></div><div class="meta">'+t.m.map(function(x){return '<span>'+x+'</span>';}).join('')+'<span style="margin-left:auto">adım</span></div></div>';
  }
  var a1 = tpl.slice(0,6), a2 = tpl.slice(6);
  var l1 = a1.concat(a2).map(card).join(''), l2 = a2.concat(a1).map(card).join('');
  document.getElementById('lane1').innerHTML = l1 + l1;
  document.getElementById('lane2').innerHTML = l2 + l2;
})();

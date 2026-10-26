const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const copy = {
  id:{
    eyebrow:'KARYA PILIHAN · 2026', h1:'MEDIA PEMBELAJARAN', h2:'BAHASA ARAB', h3:'& EKSPERIMEN DIGITAL',
    desc:'Portofolio akademik dan interaktif yang mengeksplorasi pembelajaran bahasa Arab, teknologi pendidikan, dan desain antarmuka.',
    projects:'PROYEK',about:'TENTANG',hint:'Gunakan ↑ ↓ dan ENTER, atau klik.',status:'READY / DUA PROYEK UTAMA',works:'KARYA PILIHAN',back:'KEMBALI',
    lughoti:'Kamus digital bahasa Arab untuk siswa SMK dengan kosakata berbasis bidang keahlian dan pengalaman mobile-first.',
    lughotiMeta:['Pembelajaran Arab','EdTech','Web App'],scrabble:'Permainan papan kata bahasa Arab yang dapat dikonfigurasi, berfokus pada multiplayer lokal, interaksi huruf, dan fleksibilitas layout.',
    scrabbleMeta:['Permainan Kata Arab','Media Pembelajaran','Multiplayer Lokal'],open:'BUKA PROYEK ↗',nav:'NAVIGASI',hudOpen:'BUKA',
    aboutK:'TENTANG KARYA',aboutAr:'بين اللغة والتقنية',aboutTitle:'Bahasa,\nteknologi,\ndan pengalaman belajar.',
    aboutBody:'Saya merancang dan mengembangkan pengalaman belajar digital yang berfokus terutama pada pembelajaran bahasa Arab. Proyek saya menggabungkan desain pembelajaran, media pendidikan, pengembangan web, dan eksperimen antarmuka.',
    focus:['Pendidikan Bahasa Arab','Teknologi Pendidikan','Interactive Learning','UI / UX Experimentation']
  },
  en:{
    eyebrow:'SELECTED WORKS · 2026',h1:'ARABIC LEARNING',h2:'MEDIA',h3:'& DIGITAL EXPERIMENTS',
    desc:'Selected academic and interactive projects exploring Arabic education, educational technology, and interface design.',projects:'PROJECTS',about:'ABOUT',hint:'Use ↑ ↓ and ENTER, or click.',status:'READY / TWO FLAGSHIP PROJECTS',works:'SELECTED WORKS',back:'BACK',
    lughoti:'A digital Arabic dictionary for vocational high-school students, with field-specific vocabulary and a mobile-first learning experience.',lughotiMeta:['Arabic Learning','EdTech','Web App'],
    scrabble:'A configurable Arabic word-board game focused on local multiplayer, Arabic-letter interaction, and flexible layouts.',scrabbleMeta:['Arabic Word Game','Learning Media','Local Multiplayer'],open:'OPEN PROJECT ↗',nav:'NAVIGATE',hudOpen:'OPEN',
    aboutK:'ABOUT THE WORK',aboutAr:'بين اللغة والتقنية',aboutTitle:'Language,\ntechnology,\nand learning experiences.',
    aboutBody:'I design and develop digital learning experiences focused primarily on Arabic language education. My projects combine instructional design, educational media, web development, and interface experimentation.',
    focus:['Arabic Education','Educational Technology','Interactive Learning','UI / UX Experimentation']
  },
  ar:{
    eyebrow:'الأعمال المختارة · 2026',h1:'وسائط تعليم',h2:'اللغة العربية',h3:'والتجارب الرقمية',
    desc:'مجموعة من المشاريع الأكاديمية والتفاعلية التي تستكشف تعليم اللغة العربية، والتقنية التعليمية، وتصميم الواجهات.',projects:'المشاريع',about:'عن الأعمال',hint:'استخدم ↑ ↓ و ENTER أو انقر.',status:'جاهز / مشروعان رئيسيان',works:'الأعمال المختارة',back:'رجوع',
    lughoti:'قاموس رقمي للغة العربية صُمِّم لطلاب المدارس الثانوية المهنية، وينظّم المفردات وفق مجالات التخصص ضمن تجربة تعليمية للأجهزة المحمولة.',lughotiMeta:['تعليم العربية','تقنية تعليمية','تطبيق ويب'],
    scrabble:'لعبة كلمات عربية على لوحة قابلة للتخصيص، تركّز على اللعب الجماعي المحلي، والتفاعل مع الحروف العربية، والتخطيطات المرنة.',scrabbleMeta:['لعبة كلمات عربية','وسائط تعليمية','لعب جماعي محلي'],open:'فتح المشروع ↗',nav:'تنقّل',hudOpen:'فتح',
    aboutK:'عن الأعمال',aboutAr:'بين اللغة والتقنية',aboutTitle:'اللغة،\nوالتقنية،\nوتجارب التعلّم.',
    aboutBody:'أصمّم وأطوّر تجارب تعلّم رقمية تركّز بصورة أساسية على تعليم اللغة العربية. تجمع مشاريعي بين التصميم التعليمي، والوسائط التعليمية، وتطوير الويب، والتجريب في تصميم الواجهات.',
    focus:['تعليم اللغة العربية','التقنية التعليمية','التعلّم التفاعلي','تجريب الواجهات وتجربة المستخدم']
  }
};

let lang = localStorage.getItem('portfolio-language') || 'id';
let currentScreen = 'home';
let menuIndex = 0;
let projectIndex = 0;
const menuItems = $$('.menu-item');

function boot(){
  const bar=$('#bootBar'),pct=$('#bootPct'),boot=$('#boot'); let p=0;
  const timer=setInterval(()=>{ p += Math.ceil(Math.random()*9); if(p>=100){p=100;clearInterval(timer);setTimeout(()=>{boot.classList.add('hide');$('#app').classList.remove('is-loading')},220)} bar.style.width=p+'%';pct.textContent=p+'%';},55);
}

function setLang(next){
  lang=next; localStorage.setItem('portfolio-language',lang);
  document.documentElement.lang=lang; document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  $$('.lang').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
  const c=copy[lang];
  const map={heroEyebrow:c.eyebrow,heroLine1:c.h1,heroLine2:c.h2,heroLine3:c.h3,heroDesc:c.desc,menuProjects:c.projects,menuAbout:c.about,menuHint:c.hint,statusCopy:c.status,worksTitle:c.works,backProjects:c.back,backAbout:c.back,lughotiDesc:c.lughoti,scrabbleDesc:c.scrabble,lughotiOpen:c.open,scrabbleOpen:c.open,hudNavigate:c.nav,hudOpen:c.hudOpen,hudBack:c.back,aboutKicker:c.aboutK,aboutArabic:c.aboutAr,aboutBody:c.aboutBody};
  Object.entries(map).forEach(([id,val])=>{ const el=$('#'+id); if(el){el.animate([{opacity:.2,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:320,easing:'ease-out'});el.textContent=val;}});
  $('#aboutTitle').innerHTML=c.aboutTitle.replaceAll('\n','<br>');
  const lm=$('#lughotiMeta'), sm=$('#scrabbleMeta');lm.innerHTML=c.lughotiMeta.map(x=>`<span>${x}</span>`).join('');sm.innerHTML=c.scrabbleMeta.map(x=>`<span>${x}</span>`).join('');
  c.focus.forEach((x,i)=>$('#focus'+['One','Two','Three','Four'][i]).textContent=x);
}

function updateMenu(i){ menuIndex=(i+menuItems.length)%menuItems.length;menuItems.forEach((el,n)=>el.classList.toggle('active',n===menuIndex));const idx=menuItems[menuIndex].dataset.index||String(menuIndex+1).padStart(2,'0');const bi=$('#bigIndex');bi.style.transform='translateY(10px)';bi.style.opacity=.2;setTimeout(()=>{bi.textContent=idx;bi.style.transform='none';bi.style.opacity=1},120)}

function transitionTo(id){ if(id===currentScreen)return;const tr=$('#transition');tr.classList.remove('active');void tr.offsetWidth;tr.classList.add('active');setTimeout(()=>{ $$('.screen').forEach(s=>{s.classList.remove('active');s.setAttribute('aria-hidden','true')});const next=$('#'+id);next.classList.add('active');next.setAttribute('aria-hidden','false');currentScreen=id; },300);setTimeout(()=>tr.classList.remove('active'),800)}

function openCurrentMenu(){ const el=menuItems[menuIndex]; const target=el.dataset.target;if(target) transitionTo(target);else if(el.href) window.open(el.href,'_blank');}

function setProject(i){ projectIndex=(i+2)%2;$$('.project-tab').forEach((b,n)=>{b.classList.toggle('active',n===projectIndex);b.setAttribute('aria-selected',n===projectIndex)});$$('.project-panel').forEach((p,n)=>p.classList.toggle('active',n===projectIndex));}

$$('.lang').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
$$('.menu-item[data-target]').forEach((b,i)=>{b.addEventListener('mouseenter',()=>updateMenu(i));b.addEventListener('click',()=>transitionTo(b.dataset.target))});
$$('[data-back]').forEach(b=>b.addEventListener('click',()=>transitionTo('home')));
$$('.project-tab').forEach((b,i)=>b.addEventListener('click',()=>setProject(i)));
$('#brandBtn').addEventListener('click',()=>transitionTo('home'));

document.addEventListener('keydown',e=>{
  if(currentScreen==='home'){
    if(e.key==='ArrowDown'){e.preventDefault();updateMenu(menuIndex+1)}
    if(e.key==='ArrowUp'){e.preventDefault();updateMenu(menuIndex-1)}
    if(e.key==='Enter'){e.preventDefault();openCurrentMenu()}
  } else if(currentScreen==='projects'){
    if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();setProject(projectIndex+1)}
    if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();setProject(projectIndex-1)}
    if(e.key==='Enter'){ const link=$$('.project-panel')[projectIndex].querySelector('.project-actions a'); if(link) window.open(link.href,'_blank') }
  }
  if(e.key==='Escape'&&currentScreen!=='home') transitionTo('home');
});

// restrained pointer parallax on desktop
if(matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches){
  document.addEventListener('pointermove',e=>{const x=(e.clientX/innerWidth-.5),y=(e.clientY/innerHeight-.5);$('.orb-a').style.transform=`translate(${x*22}px,${y*18}px)`;$('.orb-b').style.transform=`translate(${-x*16}px,${-y*12}px)`;const activeVisual=$('.project-panel.active .project-visual');if(activeVisual) activeVisual.style.transform=`perspective(1200px) rotateX(${y*-1.4}deg) rotateY(${x*1.8}deg)`;});
}

setLang(lang);boot();

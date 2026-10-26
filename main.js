const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const copy = {
  id: {
    homeEyebrow:'ARABIC LEARNING MEDIA / 2026',
    homeTitle:'KARYA\nPILIHAN',
    homeArabic:'أعمال رقمية',
    homeDescription:'Media pembelajaran bahasa Arab, teknologi pendidikan, dan eksperimen antarmuka dalam satu pengalaman digital.',
    menuProjects:'PROYEK',
    menuAbout:'TENTANG',
    homeCaption:'PENDIDIKAN BAHASA ARAB DIGITAL',
    projectsHeading:'PROYEK',
    cardMeta1:'Kamus Digital Bahasa Arab Vokasi',
    cardMeta2:'Permainan Papan Kata Arab',
    lughotiKicker:'KAMUS DIGITAL BAHASA ARAB VOKASI',
    lughotiDesc:'Kamus digital bahasa Arab untuk siswa SMK dengan kosakata berbasis bidang keahlian dan pengalaman mobile-first.',
    scrabbleKicker:'PERMAINAN PAPAN KATA ARAB',
    scrabbleDesc:'Permainan papan kata bahasa Arab yang dapat dikonfigurasi, berfokus pada multiplayer lokal, interaksi huruf Arab, dan layout fleksibel.',
    open:'BUKA PROYEK ↗',
    aboutHeading:'TENTANG',
    aboutArabic:'بين اللغة والتقنية',
    aboutTitle:'Bahasa,\nteknologi,\npembelajaran.',
    aboutBody:'Saya merancang pengalaman belajar digital yang berfokus pada pembelajaran bahasa Arab. Proyek saya menggabungkan desain pembelajaran, media pendidikan, pengembangan web, dan eksperimen antarmuka.',
    focus:['Pendidikan Bahasa Arab','Teknologi Pendidikan','Interactive Learning','UI / UX Experimentation'],
    nav:'Navigasi',confirm:'Pilih',back:'Kembali'
  },
  en: {
    homeEyebrow:'ARABIC LEARNING MEDIA / 2026',
    homeTitle:'SELECTED\nWORKS',
    homeArabic:'أعمال رقمية',
    homeDescription:'Arabic learning media, educational technology, and interface experiments presented as one interactive digital experience.',
    menuProjects:'PROJECTS',
    menuAbout:'ABOUT',
    homeCaption:'DIGITAL ARABIC EDUCATION',
    projectsHeading:'PROJECTS',
    cardMeta1:'Vocational Arabic Digital Dictionary',
    cardMeta2:'Arabic Word Board Game',
    lughotiKicker:'VOCATIONAL ARABIC DIGITAL DICTIONARY',
    lughotiDesc:'A digital Arabic dictionary for vocational high-school students, organizing vocabulary around specific vocational fields through a mobile-first experience.',
    scrabbleKicker:'ARABIC WORD BOARD GAME',
    scrabbleDesc:'A configurable Arabic word-board game focused on local multiplayer, Arabic-letter interaction, and flexible layouts.',
    open:'OPEN PROJECT ↗',
    aboutHeading:'ABOUT',
    aboutArabic:'بين اللغة والتقنية',
    aboutTitle:'Language,\ntechnology,\nlearning.',
    aboutBody:'I design digital learning experiences focused primarily on Arabic language education. My projects combine instructional design, educational media, web development, and interface experimentation.',
    focus:['Arabic Education','Educational Technology','Interactive Learning','UI / UX Experimentation'],
    nav:'Navigate',confirm:'Confirm',back:'Back'
  },
  ar: {
    homeEyebrow:'وسائط تعليم اللغة العربية / 2026',
    homeTitle:'الأعمال\nالمختارة',
    homeArabic:'أعمال رقمية',
    homeDescription:'وسائط تعليم اللغة العربية، والتقنية التعليمية، وتجارب تصميم الواجهات ضمن تجربة رقمية تفاعلية واحدة.',
    menuProjects:'المشاريع',
    menuAbout:'عن الأعمال',
    homeCaption:'التعليم الرقمي للغة العربية',
    projectsHeading:'المشاريع',
    cardMeta1:'قاموس رقمي للعربية المهنية',
    cardMeta2:'لعبة كلمات عربية على لوحة',
    lughotiKicker:'قاموس رقمي للعربية المهنية',
    lughotiDesc:'قاموس رقمي للغة العربية صُمم لطلاب المدارس الثانوية المهنية، وينظم المفردات وفق مجالات التخصص ضمن تجربة موجهة للأجهزة المحمولة.',
    scrabbleKicker:'لعبة كلمات عربية على لوحة',
    scrabbleDesc:'لعبة كلمات عربية قابلة للتخصيص، تركّز على اللعب الجماعي المحلي، والتفاعل مع الحروف العربية، والتخطيطات المرنة.',
    open:'فتح المشروع ↗',
    aboutHeading:'عن الأعمال',
    aboutArabic:'بين اللغة والتقنية',
    aboutTitle:'اللغة،\nوالتقنية،\nوالتعلّم.',
    aboutBody:'أصمّم تجارب تعلّم رقمية تركّز بصورة أساسية على تعليم اللغة العربية. تجمع مشاريعي بين التصميم التعليمي، والوسائط التعليمية، وتطوير الويب، وتجريب الواجهات.',
    focus:['تعليم اللغة العربية','التقنية التعليمية','التعلّم التفاعلي','تجريب الواجهات وتجربة المستخدم'],
    nav:'تنقّل',confirm:'اختيار',back:'رجوع'
  }
};

let lang = 'id';
let theme = 'dark';
try {
  const stored = localStorage.getItem('portfolio-language');
  if (copy[stored]) lang = stored;
  const storedTheme = localStorage.getItem('portfolio-theme');
  if (storedTheme === 'light' || storedTheme === 'dark') theme = storedTheme;
} catch (_) {}

let currentScreen = 'homeScreen';
let menuIndex = 0;
let projectIndex = 0;

const menuItems = $$('.menu-option');
const screens = $$('.screen');
const wipe = $('#wipe');
const sideNumber = $('#sideNumber');
const backButton = $('#backButton');
const themeToggle = $('#themeToggle');
const themeFlash = $('#themeFlash');

function safeStoreLanguage(value){
  try { localStorage.setItem('portfolio-language', value); } catch (_) {}
}

function safeStoreTheme(value){
  try { localStorage.setItem('portfolio-theme', value); } catch (_) {}
}

function applyTheme(next, animate=false){
  theme = next === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  safeStoreTheme(theme);

  if(themeToggle){
    themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
    const label = $('#themeLabel');
    if(label) label.textContent = theme === 'light' ? 'DARK' : 'LIGHT';
  }

  const meta = $('meta[name="theme-color"]');
  if(meta) meta.setAttribute('content', theme === 'light' ? '#eaf7ff' : '#001b46');

  if(animate && themeFlash){
    themeFlash.classList.remove('active');
    void themeFlash.offsetWidth;
    themeFlash.classList.add('active');
    setTimeout(()=>themeFlash.classList.remove('active'),760);
  }
}

function toggleTheme(){
  const next = theme === 'dark' ? 'light' : 'dark';

  if(document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.startViewTransition(()=>applyTheme(next,false));
    if(themeFlash){
      themeFlash.classList.remove('active');
      void themeFlash.offsetWidth;
      themeFlash.classList.add('active');
      setTimeout(()=>themeFlash.classList.remove('active'),760);
    }
  }else{
    applyTheme(next,true);
  }
}

function setText(id, value, multiline=false){
  const el = $('#'+id);
  if(!el) return;
  if(multiline) el.innerHTML = value.split('\n').join('<br>');
  else el.textContent = value;
}

function applyLanguage(next){
  if(!copy[next]) next = 'id';

  const update = ()=>{
    lang = next;
    safeStoreLanguage(lang);

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    $('.lang-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));

    const c = copy[lang];
  setText('homeEyebrow', c.homeEyebrow);
  setText('homeTitle', c.homeTitle, true);
  setText('homeArabic', c.homeArabic);
  setText('homeDescription', c.homeDescription);
  setText('menuProjects', c.menuProjects);
  setText('menuAbout', c.menuAbout);
  setText('homeCaption', c.homeCaption);
  setText('projectsHeading', c.projectsHeading);
  setText('cardMeta1', c.cardMeta1);
  setText('cardMeta2', c.cardMeta2);
  setText('lughotiKicker', c.lughotiKicker);
  setText('lughotiDesc', c.lughotiDesc);
  setText('scrabbleKicker', c.scrabbleKicker);
  setText('scrabbleDesc', c.scrabbleDesc);
  setText('lughotiOpen', c.open);
  setText('scrabbleOpen', c.open);
  setText('aboutHeading', c.aboutHeading);
  setText('aboutArabic', c.aboutArabic);
  setText('aboutTitle', c.aboutTitle, true);
  setText('aboutBody', c.aboutBody);
  c.focus.forEach((text,i)=>setText('focus'+(i+1),text));
  setText('hudNavigate', c.nav);
  setText('hudConfirm', c.confirm);
    setText('hudBack', c.back);
  };

  if(document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    document.startViewTransition(update);
  }else{
    update();
  }
}

function updateMenu(index){
  menuIndex = (index + menuItems.length) % menuItems.length;
  menuItems.forEach((item,i)=>item.classList.toggle('active',i===menuIndex));
  const num = menuItems[menuIndex].dataset.number || String(menuIndex+1).padStart(2,'0');
  if(sideNumber){
    sideNumber.style.opacity = '.025';
    sideNumber.style.transform = 'translateY(-48%) rotate(-7deg) scale(.98)';
    setTimeout(()=>{
      sideNumber.textContent = num;
      sideNumber.style.opacity = '';
      sideNumber.style.transform = '';
    },120);
  }
}

function showScreen(id){
  if(id === currentScreen) return;

  wipe?.classList.remove('active');
  if(wipe){ void wipe.offsetWidth; wipe.classList.add('active'); }

  setTimeout(()=>{
    screens.forEach(screen=>{
      const active = screen.id === id;
      screen.classList.toggle('active',active);
      screen.setAttribute('aria-hidden',String(!active));
    });
    currentScreen = id;
    backButton.style.display = id === 'homeScreen' ? 'none' : 'block';
    sideNumber.textContent = id === 'projectsScreen' ? '01' : id === 'aboutScreen' ? '02' : menuItems[menuIndex].dataset.number || '01';
  },280);

  setTimeout(()=>wipe?.classList.remove('active'),820);
}

function activateMenu(){
  const item = menuItems[menuIndex];
  const target = item.dataset.target;
  if(target) showScreen(target);
  else if(item.href) window.open(item.href,'_blank','noopener,noreferrer');
}

function updateProject(index){
  projectIndex = (index + 2) % 2;
  $$('.project-card').forEach((card,i)=>{
    card.classList.toggle('active',i===projectIndex);
    card.setAttribute('aria-selected',String(i===projectIndex));
  });
  $$('.project-detail').forEach((detail,i)=>detail.classList.toggle('active',i===projectIndex));
}

menuItems.forEach((item,i)=>{
  item.addEventListener('pointerenter',()=>updateMenu(i));
  item.addEventListener('focus',()=>updateMenu(i));
  if(item.dataset.target){
    item.addEventListener('click',(event)=>{
      event.preventDefault();
      updateMenu(i);
      showScreen(item.dataset.target);
    });
  }
});

$('.project-card').forEach((card,i)=>{
  card.addEventListener('pointerenter',()=>updateProject(i));
  card.addEventListener('focus',()=>updateProject(i));
  card.addEventListener('click',(event)=>{
    event.preventDefault();
    updateProject(i);
  });
});

$('.lang-btn').forEach(btn=>btn.addEventListener('click',(event)=>{
  event.preventDefault();
  event.stopPropagation();
  applyLanguage(btn.dataset.lang);
}));

themeToggle?.addEventListener('click',(event)=>{
  event.preventDefault();
  event.stopPropagation();
  toggleTheme();
});

backButton.addEventListener('click',(event)=>{
  event.preventDefault();
  showScreen('homeScreen');
});

$('.detail-links a,.menu-option[href]').forEach(link=>{
  link.addEventListener('click',event=>{
    event.stopPropagation();
  });
});

document.addEventListener('keydown',event=>{
  if(currentScreen === 'homeScreen'){
    if(event.key === 'ArrowDown'){
      event.preventDefault();
      updateMenu(menuIndex+1);
    }else if(event.key === 'ArrowUp'){
      event.preventDefault();
      updateMenu(menuIndex-1);
    }else if(event.key === 'Enter'){
      event.preventDefault();
      activateMenu();
    }
  }else if(currentScreen === 'projectsScreen'){
    if(event.key === 'ArrowDown' || event.key === 'ArrowRight'){
      event.preventDefault();
      updateProject(projectIndex+1);
    }else if(event.key === 'ArrowUp' || event.key === 'ArrowLeft'){
      event.preventDefault();
      updateProject(projectIndex-1);
    }else if(event.key === 'Enter'){
      event.preventDefault();
      const link = $$('.project-detail')[projectIndex]?.querySelector('.detail-links a');
      if(link) window.open(link.href,'_blank','noopener,noreferrer');
    }
  }

  if(event.key === 'Escape' && currentScreen !== 'homeScreen'){
    event.preventDefault();
    showScreen('homeScreen');
  }
});

applyTheme(theme,false);
applyLanguage(lang);
updateMenu(0);
updateProject(0);
backButton.style.display = 'none';

if(matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.addEventListener('pointermove',event=>{
    const x = event.clientX / innerWidth - .5;
    const y = event.clientY / innerHeight - .5;
    document.documentElement.style.setProperty('--pointer-x', x.toFixed(3));
    document.documentElement.style.setProperty('--pointer-y', y.toFixed(3));

    const orb = $('.orb');
    if(orb) orb.style.transform = `translate(${x*24}px,${y*18}px)`;

    const activeVisual = $('.project-detail.active .detail-visual');
    if(activeVisual){
      activeVisual.style.transform = `perspective(1100px) rotateX(${y*-1.8}deg) rotateY(${x*2.2}deg)`;
    }
  });
}
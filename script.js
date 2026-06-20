// ── LOADER ──
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hide');
  }, 1800);
});

// ── BACK TO TOP ──
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 400);
});

// ── CUSTOM CURSOR (desktop only) ──
const cursorMain = document.getElementById('cursorMain');
const cursorTrail = document.getElementById('cursorTrail');
const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

if (isTouchDevice) {
  cursorMain.style.display = 'none';
  cursorTrail.style.display = 'none';
} else {
let mx=0,my=0,tx=0,ty=0,cursorVisible=false;
cursorMain.style.opacity='0';
cursorTrail.style.opacity='0';
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorMain.style.left = mx+'px';
  cursorMain.style.top = my+'px';
  if(!cursorVisible){
    cursorVisible=true;
    cursorMain.style.opacity='1';
    cursorTrail.style.opacity='0.5';
  }
});
function animateTrail(){
  tx += (mx-tx)*0.12;
  ty += (my-ty)*0.12;
  cursorTrail.style.left = tx+'px';
  cursorTrail.style.top = ty+'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();
document.querySelectorAll('a,button,.project-flip-wrap,.tag').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
    cursorMain.style.transform='translate(-50%,-50%) scale(2)';
    cursorTrail.style.opacity='0.2';
  });
  el.addEventListener('mouseleave',()=>{
    cursorMain.style.transform='translate(-50%,-50%) scale(1)';
    cursorTrail.style.opacity='0.5';
  });
});
}

// ── DARK MODE ──
const themeToggle = document.getElementById('themeToggle');
const themeLabel  = document.getElementById('themeLabel');
let dark = localStorage.getItem('theme')==='dark';
function applyTheme(){
  document.body.classList.toggle('dark', dark);
  // label: show what mode is currently active
  if(themeLabel) themeLabel.textContent = dark ? 'Dark' : 'Light';
}
applyTheme();
themeToggle.addEventListener('click',()=>{
  dark=!dark;
  localStorage.setItem('theme', dark?'dark':'light');
  applyTheme();
});

// ── SCROLL PROGRESS BAR ──
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll',()=>{
  const pct = (window.scrollY/(document.body.scrollHeight-window.innerHeight))*100;
  progressBar.style.width = pct+'%';
});

// ── TYPING EFFECT ──
const heroName = document.getElementById('heroName');
const cursor = document.getElementById('typingCursor');
const lines = [
  {text:'Arpita', tag:''},
  {text:'Mishra', tag:'span'}
];
let phase=0, charIdx=0;
const typedSpan = document.createElement('span');
const typedSpan2 = document.createElement('span');
typedSpan2.style.color='var(--acc)';
heroName.innerHTML='';
heroName.appendChild(typedSpan);
heroName.appendChild(cursor);
const spacer = document.createTextNode(' ');

function typeNext(){
  if(phase===0){
    if(charIdx < lines[0].text.length){
      typedSpan.textContent += lines[0].text[charIdx++];
      setTimeout(typeNext, 90);
    } else {
      heroName.insertBefore(spacer, cursor);
      heroName.insertBefore(typedSpan2, cursor);
      phase=1; charIdx=0;
      setTimeout(typeNext, 200);
    }
  } else {
    if(charIdx < lines[1].text.length){
      typedSpan2.textContent += lines[1].text[charIdx++];
      setTimeout(typeNext, 90);
    } else {
      setTimeout(()=>{ cursor.style.display='none'; }, 1800);
    }
  }
}
setTimeout(typeNext, 600);

// ── STAT COUNTERS ──
function animateCounter(el){
  const target = parseFloat(el.dataset.target);
  const decimal = parseInt(el.dataset.decimal||0);
  const suffix = el.dataset.suffix||'';
  const dur = 1800, steps = 60;
  let step=0;
  const timer = setInterval(()=>{
    step++;
    const val = target*(step/steps);
    el.textContent = val.toFixed(decimal)+suffix;
    if(step>=steps){ el.textContent=target.toFixed(decimal)+suffix; clearInterval(timer); }
  }, dur/steps);
}
let countersStarted=false;
const statsObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting && !countersStarted){
      countersStarted=true;
      document.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);
    }
  });
},{threshold:0.4});
const statsEl = document.querySelector('.stats-row');
if(statsEl) statsObs.observe(statsEl);

// ── FADE IN ON SCROLL ──
const fadeObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; }
  });
},{threshold:0.08});
document.querySelectorAll('section').forEach(el=>{
  el.style.opacity='0';
  el.style.transform='translateY(28px)';
  el.style.transition='opacity 0.65s ease, transform 0.65s ease';
  fadeObs.observe(el);
});

// ── MORPHIC ACTIVE NAV ──
const sections = document.querySelectorAll('section[id]');
const morphicLinks = document.querySelectorAll('.morphic-link');

function updateMorphic(currentId) {
  const linksArr = Array.from(morphicLinks);
  linksArr.forEach((a, i) => {
    const isActive = a.dataset.section === currentId;
    const prevActive = linksArr[i - 1]?.classList.contains('active');
    const nextActive = linksArr[i + 1]?.classList.contains('active');

    // Reset first
    a.classList.remove('active', 'round-left', 'round-right');

    if (isActive) {
      a.classList.add('active');
    }
  });

  // Apply neighbour rounding after active is set
  linksArr.forEach((a, i) => {
    if (!a.classList.contains('active')) {
      const prevIsActive = linksArr[i - 1]?.classList.contains('active');
      const nextIsActive = linksArr[i + 1]?.classList.contains('active');
      if (nextIsActive) a.classList.add('round-right');
      if (prevIsActive) a.classList.add('round-left');
    }
  });
}

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 140) current = s.id; });
  updateMorphic(current);
});

// Click override for instant feedback
morphicLinks.forEach(a => {
  a.addEventListener('click', () => {
    updateMorphic(a.dataset.section);
  });
});
// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
function toggleMenu(open){
  hamburger.classList.toggle('open', open);
  mobileMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
  mobileMenu.setAttribute('aria-hidden', !open);
  document.body.style.overflow = open ? 'hidden' : '';
}
hamburger.addEventListener('click', () => toggleMenu(!hamburger.classList.contains('open')));
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => toggleMenu(false));
});
document.addEventListener('keydown', e => {
  if(e.key === 'Escape') toggleMenu(false);
});
// ── CONTACT FORM (Formspree AJAX) ──
(function(){
  const form = document.getElementById('contactForm');
  const success = document.getElementById('cfSuccess');
  if(!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.cf-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    try {
      const res = await fetch(form.action, {
        method:'POST',
        body: new FormData(form),
        headers:{'Accept':'application/json'}
      });
      if(res.ok){
        form.reset();
        success.classList.add('show');
        btn.textContent = '✓ Sent!';
        setTimeout(()=>{ success.classList.remove('show'); btn.textContent='Send Message'; btn.disabled=false; }, 4000);
      } else {
        btn.textContent = 'Try again';
        btn.disabled = false;
      }
    } catch(_){
      btn.textContent = 'Try again';
      btn.disabled = false;
    }
  });
})();

// ── TOUCH FLIP for project cards ──
document.querySelectorAll('.project-flip-wrap').forEach(card => {
  card.addEventListener('touchend', e => {
    // Only flip if tap lands on the card itself, not on a button/link inside
    if(e.target.closest('a, button')) return;
    e.preventDefault();
    card.classList.toggle('flipped');
  }, {passive:false});
});
(function(){
  const url  = window.location.href;
  const text = 'Check out Arpita Mishra\'s portfolio — CS Engineer & Aspiring Software Developer 🚀';

  const actions = {
    twitter:  () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank'),
    linkedin: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank'),
    whatsapp: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text+' '+url)}`, '_blank'),
    copy: () => {
      navigator.clipboard.writeText(url).then(() => {
        const toast = document.getElementById('shareToast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
      });
    }
  };

  document.querySelectorAll('.share-icon-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.share;
      if(actions[type]) actions[type]();
    });
  });
})();
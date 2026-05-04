/* ============================================================
   Manmohan Dogra — site scripts
   Theme switcher, nav, contact obfuscation, gallery, lightbox
   ============================================================ */

(function(){
  'use strict';

  /* ---------- Theme switcher ---------- */
  var THEMES = ['royal-banaras','varanasi-dusk','temple-saffron',
                'midnight-concert','editorial-raga','peacock-teal'];
  var STORED = (function(){ try{ return localStorage.getItem('md-theme'); }catch(e){ return null; } })();
  var initial = THEMES.indexOf(STORED) >= 0 ? STORED : 'royal-banaras';
  document.documentElement.setAttribute('data-theme', initial);

  function applyTheme(name){
    if(THEMES.indexOf(name) < 0) return;
    document.documentElement.setAttribute('data-theme', name);
    try{ localStorage.setItem('md-theme', name); }catch(e){}
    document.querySelectorAll('.theme-switch button').forEach(function(b){
      b.classList.toggle('active', b.getAttribute('data-set') === name);
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.theme-switch button').forEach(function(b){
      b.classList.toggle('active', b.getAttribute('data-set') === (STORED || 'royal-banaras'));
      b.addEventListener('click', function(){
        applyTheme(b.getAttribute('data-set'));
      });
    });

    /* ---------- Mobile nav ---------- */
    var toggle = document.querySelector('.nav-toggle');
    var links  = document.querySelector('.nav-links');
    if(toggle && links){
      toggle.addEventListener('click', function(){
        links.classList.toggle('open');
      });
    }

    /* ---------- Active nav link ---------- */
    var path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(function(a){
      var href = a.getAttribute('href');
      if(href === path || (path === '' && href === 'index.html')) a.classList.add('active');
    });

    /* ---------- Page background slideshow ---------- */
    setupPageBg();

    /* ---------- Contact reveal (obfuscation) ---------- */
    revealContacts();

    /* ---------- Gallery filter ---------- */
    setupGalleryFilter();

    /* ---------- Lightbox ---------- */
    setupLightbox();

    /* ---------- Booking / contact form ---------- */
    setupForm();
  });

  /* ---------- Page background slideshow ---------- */
  // Each photo: { file, category, focal }
  // focal = background-position string; chosen per-photo so face / subject is never cropped.
  var PHOTOS = [
    { file: 'DSC00194.jpg',                             category: 'performance', focal: 'center 38%' },
    { file: 'DSC00212.jpg',                             category: 'performance', focal: 'center 35%' },
    { file: 'DSC01903 (2025-08-09T20_53_01.929).JPG',   category: 'performance', focal: 'center 25%' },
    { file: 'DSC_6030.jpg',                             category: 'portrait',    focal: 'center 28%' },
    { file: 'DSC_6032.jpg',                             category: 'portrait',    focal: 'center 28%' },
    { file: 'DSC_6526.jpg',                             category: 'portrait',    focal: 'center 28%' },
    { file: 'IMG-20240823-WA0000.jpg',                  category: 'performance', focal: 'center 40%' },
    { file: 'IMG_4127.JPG',                             category: 'performance', focal: 'center 40%' },
    { file: 'IMG_4200.JPG',                             category: 'performance', focal: 'center 40%' },
    { file: 'IMG_4501.JPG',                             category: 'performance', focal: 'center 40%' },
    { file: 'Z6B_6546.jpg',                             category: 'portrait',    focal: 'center 28%' },
    { file: 'Z6B_6554.jpg',                             category: 'portrait',    focal: 'center 35%' }
  ];

  function setupPageBg(){
    var el = document.getElementById('page-bg');
    if(!el) return;

    var wanted = (el.getAttribute('data-bg-category') || 'all').toLowerCase();
    var list = PHOTOS.filter(function(p){
      if(wanted === 'all') return true;
      return wanted.split(',').indexOf(p.category) >= 0;
    });
    if(!list.length) list = PHOTOS;

    // Shuffle so consecutive visits feel fresh
    for(var i = list.length - 1; i > 0; i--){
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = list[i]; list[i] = list[j]; list[j] = tmp;
    }

    var slides = list.map(function(p){
      var slide = document.createElement('div');
      slide.className = 'bg-slide';
      slide.style.setProperty('--bg-focal', p.focal);

      var blur = document.createElement('div');
      blur.className = 'bg-blur';
      blur.style.backgroundImage = 'url("' + p.file + '")';

      var sharp = document.createElement('div');
      sharp.className = 'bg-sharp';
      sharp.style.backgroundImage = 'url("' + p.file + '")';

      slide.appendChild(blur);
      slide.appendChild(sharp);
      el.appendChild(slide);
      return slide;
    });

    list.forEach(function(p){ new Image().src = p.file; });

    var current = 0;
    slides[0].classList.add('active');

    setInterval(function(){
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 6000);
  }

  function setupForm(){
    document.querySelectorAll('form[data-form]').forEach(function(form){
      form.addEventListener('submit', function(){
        var c = decodeContact();
        // FormSubmit.co routes the POST to the destination email without it being in the HTML.
        form.setAttribute('action', 'https://formsubmit.co/' + encodeURIComponent(c.email));
      });
    });
  }

  /* ---------- Private contact data — decoded on demand ---------- */
  // Values stored as reversed strings + base64 fragments to avoid plain-text scraping.
  function decodeContact(){
    var emailParts = ['moc.liamg','@','kuargodnahom','nam'];
    // reverse "manmohandograuk@gmail.com"
    var email = emailParts.map(function(s){ return s.split('').reverse().join(''); }).join('');
    // WhatsApp number assembled from integer fragments
    var wa = [44,7586,236182].map(String).join('');
    return { email: email, wa: wa };
  }

  function revealContacts(){
    var c = decodeContact();

    document.querySelectorAll('[data-email]').forEach(function(el){
      var mode = el.getAttribute('data-email');
      if(mode === 'link'){
        el.setAttribute('href', 'mailto:' + c.email);
        if(!el.textContent.trim()) el.textContent = c.email;
      } else {
        el.textContent = c.email;
      }
    });

    document.querySelectorAll('[data-whatsapp]').forEach(function(el){
      var mode = el.getAttribute('data-whatsapp');
      var href = 'https://wa.me/' + c.wa;
      if(mode === 'link'){
        el.setAttribute('href', href);
        if(!el.textContent.trim()) el.textContent = '+' + formatPhone(c.wa);
      } else {
        el.textContent = '+' + formatPhone(c.wa);
      }
    });
  }

  function formatPhone(n){
    // +44 7586 236182
    return n.replace(/^(\d{2})(\d{4})(\d+)$/, '$1 $2 $3');
  }

  /* ---------- Gallery filter ---------- */
  function setupGalleryFilter(){
    var buttons = document.querySelectorAll('.gallery-filter button');
    if(!buttons.length) return;
    buttons.forEach(function(btn){
      btn.addEventListener('click', function(){
        buttons.forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        document.querySelectorAll('.gallery-item').forEach(function(item){
          var cat = item.getAttribute('data-category');
          item.style.display = (filter === 'all' || filter === cat) ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Lightbox ---------- */
  function setupLightbox(){
    var items = document.querySelectorAll('.gallery-item');
    if(!items.length) return;

    var box = document.createElement('div');
    box.className = 'lightbox';
    box.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><img alt="">';
    document.body.appendChild(box);
    var img = box.querySelector('img');

    items.forEach(function(item){
      item.addEventListener('click', function(){
        var src = item.getAttribute('data-full') || item.querySelector('img').getAttribute('src');
        img.setAttribute('src', src);
        box.classList.add('open');
      });
    });

    box.querySelector('.lightbox-close').addEventListener('click', close);
    box.addEventListener('click', function(e){ if(e.target === box) close(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
    function close(){ box.classList.remove('open'); img.setAttribute('src',''); }
  }
})();

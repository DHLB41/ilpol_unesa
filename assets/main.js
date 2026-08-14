(function(){
  // Header shrink + shadow on scroll
  var header = document.getElementById('siteHeader');
  function onScroll(){
    if(!header) return;
    if(window.scrollY > 12){ header.classList.add('scrolled'); }
    else{ header.classList.remove('scrolled'); }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  // Mobile nav toggle
  var hamburger = document.getElementById('hamburgerBtn');
  var mobileNav = document.getElementById('mobileNav');
  if(hamburger && mobileNav){
    hamburger.addEventListener('click', function(){
      var open = mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileNav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Hero carousel (homepage only)
  var slides = document.querySelectorAll('.hero-slide');
  var dotsWrap = document.getElementById('heroDots');
  if(slides.length && dotsWrap){
    var current = 0;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    slides.forEach(function(_, i){
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Tampilkan foto ke-' + (i + 1));
      if(i === 0) dot.classList.add('active');
      dot.addEventListener('click', function(){ goTo(i); });
      dotsWrap.appendChild(dot);
    });
    function goTo(index){
      slides[current].classList.remove('active');
      dotsWrap.children[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      dotsWrap.children[current].classList.add('active');
    }
    if(!reduceMotion && slides.length > 1){
      setInterval(function(){ goTo((current + 1) % slides.length); }, 5000);
    }
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -40px 0px'});
    revealEls.forEach(function(el){ observer.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in-view'); });
  }
  // Safety net: guarantee no section stays invisible (e.g. fast scroll, anchor jump, or print/screenshot)
  setTimeout(function(){
    document.querySelectorAll('.reveal:not(.in-view)').forEach(function(el){
      el.classList.add('in-view');
    });
  }, 1200);

  // Video card placeholder click
  document.querySelectorAll('.video-card').forEach(function(btn){
    btn.addEventListener('click', function(){
      alert('Pemutar video akan tersambung ke berkas Video Profil resmi saat situs ini dipublikasikan.');
    });
  });

  // Simple contact / kritik & saran form (demo only, no backend)
  var feedbackForm = document.getElementById('feedbackForm');
  if(feedbackForm){
    feedbackForm.addEventListener('submit', function(e){
      e.preventDefault();
      feedbackForm.style.display = 'none';
      var success = document.getElementById('formSuccess');
      if(success) success.style.display = 'block';
    });
  }

  // External link interstitial page (external.html)
  var interstitial = document.getElementById('externalInterstitial');
  if(interstitial){
    var params = new URLSearchParams(window.location.search);
    var to = params.get('to') || 'https://www.unesa.ac.id';
    var label = params.get('label') || 'Universitas Negeri Surabaya';
    var desc = params.get('desc') || 'Tautan ini akan membawa Anda ke luar situs Program Studi Ilmu Politik.';
    document.getElementById('extLabel').textContent = label;
    document.getElementById('extDesc').textContent = desc;
    document.getElementById('extTarget').textContent = to;
    var goBtn = document.getElementById('extGoBtn');
    goBtn.href = to;
  }
})();

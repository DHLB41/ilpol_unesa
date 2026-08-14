/**
 * ILPOL UNESA — CMS Theme Injector
 * Versi: 1.1 | https://dhlb41.github.io/ilpol_unesa/theme.js
 *
 * Cara pakai di CMS:
 * Paste baris ini di editor HTML setiap halaman (mode Source/HTML):
 *   <script src="https://dhlb41.github.io/ilpol_unesa/theme.js" onerror="var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/DHLB41/ilpol_unesa@main/theme.js';document.head.appendChild(s);"></script>
 */
(function () {
  'use strict';

  var BASE = 'https://dhlb41.github.io/ilpol_unesa';

  /* Mirror cms-override.css di sini secara berurutan.
     Utama: GitHub Pages (gratis, auto-deploy tiap `git push`, tanpa kuota).
     Kalau gagal, browser otomatis coba mirror berikutnya. */
  var CSS_MIRRORS = [
    BASE + '/cms-override.css',
    'https://cdn.jsdelivr.net/gh/DHLB41/ilpol_unesa@main/cms-override.css',
    'https://ilpol-unesa.netlify.app/cms-override.css?v=2.2'
  ];

  /* 1 ─ Google Fonts (Fraunces + Plus Jakarta Sans) */
  var fl = document.createElement('link');
  fl.rel = 'preconnect'; fl.href = 'https://fonts.googleapis.com';
  document.head.appendChild(fl);

  var fl2 = document.createElement('link');
  fl2.rel = 'preconnect'; fl2.href = 'https://fonts.gstatic.com';
  fl2.crossOrigin = 'anonymous';
  document.head.appendChild(fl2);

  var fl3 = document.createElement('link');
  fl3.rel = 'stylesheet';
  fl3.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
  document.head.appendChild(fl3);

  /* 2 ─ CSS Override, dengan fallback antar-mirror */
  function loadCSSWithFallback(urls, index) {
    index = index || 0;
    if (index >= urls.length) {
      console.warn('[ilpol-theme] Semua mirror cms-override.css gagal dimuat.');
      return;
    }
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = urls[index];
    link.onerror = function () {
      document.head.removeChild(link);
      loadCSSWithFallback(urls, index + 1);
    };
    document.head.appendChild(link);
  }
  loadCSSWithFallback(CSS_MIRRORS);

  /* 3 ─ Tambah class ke body agar CSS override aktif */
  function applyTheme() {
    document.body.classList.add('ilpol-theme');

    /* FIX: Navbar brand — width eksplisit agar logo tidak terpotong */
    var brand = document.querySelector('a.navbar-brand, .navbar-brand');
    if (brand) {
      brand.style.setProperty('background-color', 'transparent', 'important');
      brand.style.setProperty('width', '260px', 'important');
      brand.style.setProperty('box-sizing', 'content-box', 'important');
      brand.style.setProperty('padding-right', '0', 'important');
    }

    /* 4 ─ Header sticky: tambah shadow saat scroll */
    var header = document.querySelector('header') ||
                 document.querySelector('nav') ||
                 document.querySelector('.navbar');
    if (header) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 10) {
          header.style.boxShadow = '0 6px 24px -12px rgba(11,42,74,.4)';
        } else {
          header.style.boxShadow = '0 4px 20px -8px rgba(11,42,74,.4)';
        }
      }, { passive: true });
    }

    /* 5 ─ Tambah eyebrow gold di atas judul halaman */
    var pageTitle = document.querySelector('[class*="page-title"] h1') ||
                    document.querySelector('[class*="page-header"] h1') ||
                    document.querySelector('.jumbotron h1') ||
                    document.querySelector('.breadcrumb-area h1');
    if (pageTitle && !pageTitle.previousElementSibling) {
      var eyebrow = document.createElement('p');
      eyebrow.style.cssText =
        'font-family:"Plus Jakarta Sans",sans-serif;font-size:.76rem;' +
        'font-weight:800;letter-spacing:.14em;text-transform:uppercase;' +
        'color:#F0C868;margin:0 0 10px;';
      eyebrow.textContent = 'Program Studi Ilmu Politik · FISIPOL Unesa';
      pageTitle.parentNode.insertBefore(eyebrow, pageTitle);
    }

    /* 6 ─ Smooth scroll untuk anchor link */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    /* 7 ─ Sembunyikan kotak dekoratif gelap dari template CMS
       (dikecualikan: area slider/banner agar tidak mengganggu init Revolution Slider) */
    setTimeout(function () {
      document.querySelectorAll('body *').forEach(function (el) {
        try {
          if (el.closest('.slider-wrapper, .tp-banner-container, .tp-banner')) return;
          var rect = el.getBoundingClientRect();
          if (rect.top < 100 || rect.top > 320) return;
          if (rect.width < 15 || rect.width > 200) return;
          if (rect.height < 20) return;
          if (el.textContent.trim() !== '') return;
          var bg = window.getComputedStyle(el).backgroundColor;
          var rgb = bg.match(/\d+/g);
          if (!rgb || rgb.length < 3) return;
          var luma = 0.299 * +rgb[0] + 0.587 * +rgb[1] + 0.114 * +rgb[2];
          if (luma < 100 && (+rgb[0] + +rgb[1] + +rgb[2]) > 0) {
            el.style.setProperty('display', 'none', 'important');
          }
        } catch (e) {}
      });
    }, 80);

    /* 8 ─ Animasi fade-in saat elemen masuk viewport */
    if ('IntersectionObserver' in window) {
      var style = document.createElement('style');
      style.textContent =
        '.ip-reveal{opacity:0;transform:translateY(16px);transition:opacity .6s ease,transform .6s ease;}' +
        '.ip-reveal.ip-in{opacity:1;transform:translateY(0);}';
      document.head.appendChild(style);

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('ip-in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

      /* Tambah kelas reveal ke card, section heading, dll */
      var targets =
        '.card, article, [class*="post-item"], [class*="news-item"], ' +
        'section h2, section h3, .container>h2, .row>div>.card';
      document.querySelectorAll(targets).forEach(function (el) {
        el.classList.add('ip-reveal');
        io.observe(el);
      });

      /* Safety net: reveal semua setelah 1.5 detik */
      setTimeout(function () {
        document.querySelectorAll('.ip-reveal:not(.ip-in)').forEach(function (el) {
          el.classList.add('ip-in');
        });
      }, 1500);
    }

    /* ── INJECT FOOTER MOCKUP ─────────────────────────── */
    var origFooter = document.querySelector('#footer-style-1');
    var origCopy   = document.querySelector('#copyrights');
    if (origFooter) {
      /* Ambil logo UNESA asli dari footer CMS sebelum diganti */
      var origLogoEl = origFooter.querySelector('img');
      var logoHTML = '';
      if (origLogoEl) {
        var clonedLogo = origLogoEl.cloneNode(true);
        clonedLogo.removeAttribute('style');
        clonedLogo.style.cssText = 'max-height:64px;width:auto;max-width:200px;display:block;margin-bottom:14px;';
        logoHTML = clonedLogo.outerHTML;
      }
      var pinSVG  = '<svg viewBox="0 0 24 24"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg>';
      var mailSVG = '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>';
      var igSVG   = '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>';

      var base = 'https://ilpol.fisipol.unesa.ac.id';
      var newFooter = document.createElement('footer');
      newFooter.className = 'ilpol-footer';
      newFooter.innerHTML =
        '<div class="ilpol-footer-top">' +
          '<div class="ilpol-footer-about">' +
            '<div class="ilpol-footer-logo">' + logoHTML + '</div>' +
            '<h4 style="color:#F0C868;font-size:14px;font-weight:700;margin:0 0 4px;font-family:Plus Jakarta Sans,sans-serif;">Program Studi Ilmu Politik</h4>' +
            '<p class="small">Fakultas Ilmu Sosial dan Politik<br>Universitas Negeri Surabaya</p>' +
            '<div class="ilpol-footer-contact">' +
              '<a href="https://maps.google.com/?q=Prodi+Ilmu+Politik+Unesa" target="_blank" rel="noopener">' + pinSVG + ' Jl. Ketintang, Gayungan, Surabaya, Jawa Timur 60231</a>' +
              '<a href="mailto:ilpol@unesa.ac.id">' + mailSVG + ' ilpol@unesa.ac.id</a>' +
            '</div>' +
          '</div>' +
          '<div class="ilpol-footer-col">' +
            '<h5>Navigasi</h5>' +
            '<ul>' +
              '<li><a href="' + base + '/page/sejarah">Profil</a></li>' +
              '<li><a href="' + base + '/page/dosen">Dosen &amp; Staf</a></li>' +
              '<li><a href="' + base + '/page/buku-modul">Akademik</a></li>' +
              '<li><a href="' + base + '/page/jurnal-ilmu-politik">Penelitian &amp; Publikasi</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="ilpol-footer-col">' +
            '<h5>Layanan</h5>' +
            '<ul>' +
              '<li><a href="' + base + '/page/fasilitas">Fasilitas</a></li>' +
              '<li><a href="' + base + '/page/mahasiswa-alumni">Mahasiswa &amp; Alumni</a></li>' +
              '<li><a href="' + base + '/page/kolaborasi">Kolaborasi</a></li>' +
              '<li><a href="' + base + '/page/kritik-dan-saran-website-ilmu-politik">Kritik &amp; Saran</a></li>' +
            '</ul>' +
          '</div>' +
          '<div class="ilpol-footer-map">' +
            '<h5>Lokasi</h5>' +
            '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.3719577432557!2d112.72697997357207!3d-7.312044671890937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fb001bbe31b1%3A0x14b46b99e394ac28!2sProdi%20Ilmu%20Politik!5e0!3m2!1sid!2sid!4v1728461320744!5m2!1sid!2sid" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Lokasi Prodi Ilmu Politik Unesa"></iframe>' +
            '<p>Jl. Ketintang, Gayungan, Surabaya</p>' +
          '</div>' +
        '</div>' +
        '<div class="ilpol-footer-bottom">' +
          '<p>&copy; 2026 Program Studi Ilmu Politik &mdash; FISIPOL Universitas Negeri Surabaya. Didukung oleh PPTI Universitas Negeri Surabaya.</p>' +
          '<div class="ilpol-footer-social">' +
            '<a href="https://www.instagram.com/ilpol.unesa" target="_blank" rel="noopener" aria-label="Instagram Ilmu Politik Unesa">' + igSVG + '</a>' +
          '</div>' +
        '</div>';

      origFooter.parentNode.replaceChild(newFooter, origFooter);

      /* Force-set warna h4 via JS — lebih kuat dari CSS manapun */
      setTimeout(function() {
        var h4 = document.querySelector('.ilpol-footer-about h4');
        if (h4) {
          h4.style.setProperty('color', '#F0C868', 'important');
          h4.style.setProperty('font-size', '14px', 'important');
          h4.style.setProperty('font-weight', '700', 'important');
          h4.style.setProperty('font-family', 'Plus Jakarta Sans, sans-serif', 'important');
        }
        /* Pastikan teks info footer terlihat jelas */
        var small = document.querySelector('.ilpol-footer-about .small');
        if (small) small.style.setProperty('color', '#9fb1c4', 'important');
      }, 50);
      if (origCopy) origCopy.style.setProperty('display', 'none', 'important');
    }

  }

  /* Jalankan setelah DOM siap */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyTheme);
  } else {
    applyTheme();
  }
})();

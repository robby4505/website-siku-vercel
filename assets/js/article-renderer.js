// assets/js/article-renderer.js

document.addEventListener('DOMContentLoaded', () => {
  // 1. Ambil ID artikel dari URL (misal: artikel-template.html?id=restrukturisasi-organisasi)
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');

  // 2. Cari artikel di database
  const article = BLOG_DATA.find(post => post.id === articleId);

  const app = document.getElementById('app');

  if (!article) {
    app.innerHTML = `<div class="container" style="padding: 10rem 0; text-align: center;">
      <h1>Artikel Tidak Ditemukan</h1>
      <a href="blog.html" class="btn btn--primary">Kembali ke Blog</a>
    </div>`;
    return;
  }

  // 3. Update Title Tag Browser
  document.title = `${article.title} | Blog SIKU`;

  // 4. Render Halaman Lengkap (Header + Content + Footer)
  app.innerHTML = `
    ${renderHeader()}
    
    <section class="hero" style="padding-top: 10rem; padding-bottom: 3rem; min-height: auto;">
      <div class="container hero__content" style="max-width: 900px;">
        <div class="breadcrumb" style="margin-bottom: 1rem; font-size: 0.9rem; opacity: 0.8;">
          <a href="index.html">Home</a> / <a href="blog.html">Blog</a> / <span>${article.category}</span>
        </div>
        <h1 class="hero__title" style="font-size: 2.5rem; text-align: left;">${article.title}</h1>
        <div class="article-meta" style="display: flex; gap: 1.5rem; font-size: 0.9rem; opacity: 0.9; margin-top: 1rem;">
          <span>✍️ ${article.author}</span>
          <span>📅 ${article.date}</span>
          <span>⏱️ ${article.readTime}</span>
        </div>
      </div>
    </section>

    <div class="split-layout-wrapper" style="background-color: #ffffff; padding-top: 2rem;">
      <div class="container split-layout-inner">
        
        <!-- SIDEBAR -->
        <aside class="split-sidebar">
          <div class="sidebar-widget sticky-top" style="text-align: center;">
            <div style="width: 80px; height: 80px; background-color: #0f172a; border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: #d4af37; font-size: 2rem; font-weight: bold;">S</div>
            <h3 class="sidebar-heading" style="border: none; margin-bottom: 0.5rem;">Tim Ahli SIKU</h3>
            <p class="sidebar-desc">Konsultan Manajemen & SDM berpengalaman.</p>
            <a href="kontak.html" class="btn btn--primary btn-sm" style="width: 100%;">Konsultasi Gratis</a>
          </div>
          <div class="sidebar-widget">
            <h3 class="sidebar-heading">Artikel Terkait</h3>
            <ul class="archive-list">
              ${getRelatedArticles(article.id)}
            </ul>
          </div>
        </aside>

        <!-- CONTENT -->
        <main class="split-content">
          <article class="article-card" style="border: none; box-shadow: none; padding: 0;">
            ${article.content}
            
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 2.5rem; border-radius: 1rem; text-align: center; margin-top: 3rem;">
              <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: #d4af37;">Butuh Bantuan Merancang Ulang Struktur Organisasi?</h3>
              <a href="kontak.html?subject=Konsultasi" class="btn btn--primary" style="background-color: #d4af37; color: #0f172a; font-weight: bold;">Jadwalkan Konsultasi Gratis</a>
            </div>
          </article>
        </main>
      </div>
    </div>

    ${renderFooter()}
  `;
});

// --- HELPER FUNCTIONS ---

function renderHeader() {
  return `
    <header class="header">
      <div class="container header__inner">
        <a href="index.html" class="header__brand">
          <img src="assets/images/logo-siku.png" alt="Logo SIKU" class="header__logo">
          <span class="header__name">PT SINERGI INSAN KARYA UTAMA</span>
        </a>
        <button class="header__toggle" aria-label="Menu">☰</button>
        <nav class="nav">
          <ul class="nav__list">
            <li><a href="index.html" class="nav__link">Home</a></li>
            <li><a href="about.html" class="nav__link">About Us</a></li>
            <li><a href="training-reguler.html" class="nav__link">Training Reguler</a></li>
            <li><a href="inhouse-training.html" class="nav__link">Inhouse Training</a></li>
            <li><a href="testimony.html" class="nav__link">Testimony</a></li>
            <li><a href="blog.html" class="nav__link active">Blog</a></li>
            <li><a href="career.html" class="nav__link">Career</a></li>
          </ul>
        </nav>
      </div>
    </header>
  `;
}

function renderFooter() {
  return `
    <footer class="footer">
      <div class="container footer__top">
        <div class="footer__brand">
          <img src="assets/images/logo-siku.png" alt="Logo SIKU Footer" class="footer__logo">
          <div class="footer__info">
            <p class="footer__company">PT SINERGI INSAN KARYA UTAMA</p>
            <p class="footer__legal">NIB: 0904250066404</p>
          </div>
        </div>
        <div class="footer__section">
          <h4 class="footer__nav-title">Navigasi</h4>
          <ul class="footer__links">
            <li><a href="index.html">Home</a></li>
            <li><a href="blog.html">Blog</a></li>
          </ul>
        </div>
        <div class="footer__section">
          <h4 class="footer__contact-title">Kontak</h4>
          <address class="footer__contact">
            <p>📍 Jl. Sukardi Handani No 11/27. Labuhan Ratu, Bandar Lampung - Indonesia</p>
            <p>📞 0822-7839-9722</p>
            <p>✉️ ptsiku.indonesia@gmail.com</p>
          </address>
        </div>
      </div>
      <div class="container footer__bottom">
        <p>&copy; 2026 PT Sinergi Insan Karya Utama. All rights reserved.</p>
      </div>
    </footer>
  `;
}

function getRelatedArticles(currentId) {
  // Ambil 3 artikel acak selain artikel yang sedang dibuka
  const related = BLOG_DATA.filter(p => p.id !== currentId).slice(0, 3);
  return related.map(p => `
    <li><a href="artikel-template.html?id=${p.id}">${p.title}</a></li>
  `).join('');
}
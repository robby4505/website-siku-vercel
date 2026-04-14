/**
 * SIKU - Main JavaScript
 * Entry point untuk inisialisasi website
 */

document.addEventListener('DOMContentLoaded', () => {
  initBlogArchive();
  console.log('✅ SIKU website loaded');
});

async function initBlogArchive() {
  const archiveList = document.getElementById('blog-archive');
  const categorySelect = document.getElementById('blog-category');
  if (!archiveList || !categorySelect) return;

  try {
    const response = await fetch('assets/data/blog-archive.json');
    const posts = await response.json();
    const articles = posts.slice(0, 10);

    renderBlogArchive(articles, archiveList);

    categorySelect.addEventListener('change', () => {
      const selected = categorySelect.value;
      const filtered = selected === 'all' ? articles : articles.filter(post => post.category === selected);
      renderBlogArchive(filtered, archiveList);
    });
  } catch (error) {
    console.error('Gagal memuat arsip blog:', error);
  }
}

function renderBlogArchive(posts, container) {
  container.innerHTML = '';
  if (!posts.length) {
    container.innerHTML = '<li class="blog-archive-item">Tidak ada artikel untuk kategori ini.</li>';
    return;
  }

  posts.forEach(post => {
    const item = document.createElement('li');
    item.className = 'blog-archive-item';
    item.innerHTML = `<a href="${post.url}">${post.title}</a>`;
    container.appendChild(item);
  });
}

function renderBlogCards(posts, container) {
  container.innerHTML = '';
  if (!posts.length) {
    container.innerHTML = '<p>Belum ada artikel untuk kategori ini.</p>';
    return;
  }

  posts.forEach(post => {
    const card = document.createElement('article');
    card.className = 'blog-card';
    card.innerHTML = `
      <div class="blog-card-title"><a href="${post.url}">${post.title}</a></div>
      <p>${post.excerpt}</p>
      <div class="blog-card-meta">
        <span>📅 ${post.date}</span>
        <span>🏷️ ${post.category}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

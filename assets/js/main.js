document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ SIKU website loaded');
  
  // Mobile Menu Toggle
  const toggleBtn = document.querySelector('.header__toggle');
  const nav = document.querySelector('.nav');
  
  if (toggleBtn && nav) {
    toggleBtn.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggleBtn.textContent = nav.classList.contains('open') ? '✕' : '☰';
    });
  }

  // Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        if (nav && nav.classList.contains('open')) {
          nav.classList.remove('open');
          toggleBtn.textContent = '☰';
        }
        
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
});
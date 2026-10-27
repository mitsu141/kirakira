const toggle = document.getElementById('menuToggle');
const nav = document.getElementById('mainNav');
toggle.addEventListener('click', () => {
  const opened = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(opened));
  toggle.setAttribute('aria-label', opened ? 'メニューを閉じる' : 'メニューを開く');
  toggle.textContent = opened ? '×' : '☰';
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); toggle.textContent='☰';
}));
document.querySelectorAll('.photo img').forEach(img => {
  const missing = () => img.closest('.photo').classList.add('no-image');
  img.addEventListener('error', missing);
  if (img.complete && img.naturalWidth === 0) missing();
});
const dialog = document.getElementById('lightbox');
const large = document.getElementById('largeImage');
document.querySelectorAll('.photo').forEach(card => card.addEventListener('click', () => {
  const img = card.querySelector('img'); if (!img || !img.naturalWidth) return;
  large.src = img.src; large.alt = img.alt; dialog.showModal();
}));
document.getElementById('closeLightbox').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });

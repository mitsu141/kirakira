const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  menuToggle.textContent = isOpen ? '×' : '☰';
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  });
});

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');

document.querySelectorAll('.photo-card').forEach(card => {
  card.addEventListener('click', () => {
    const image = card.querySelector('img');
    // 画像ファイルがまだ用意されていない場合は拡大表示しない
    if (!image || image.style.display === 'none' || !image.complete || image.naturalWidth === 0) return;
    lightboxImage.src = card.dataset.full;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.alt;
    lightbox.showModal();
  });
});

document.getElementById('lightboxClose').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && lightbox.open) lightbox.close();
});

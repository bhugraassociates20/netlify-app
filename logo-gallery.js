// ==========================================================================
// Logo gallery — lightbox with prev/next navigation
// ==========================================================================
(() => {
    const items = Array.from(document.querySelectorAll('.logo-gallery-item'));
    if (!items.length) return;

    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    let currentIndex = 0;

    const showPhoto = (index) => {
        currentIndex = (index + items.length) % items.length;
        const item = items[currentIndex];
        const img = item.querySelector('img');
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxCaption.textContent = item.dataset.caption || img.alt;
    };

    const openLightbox = (index) => {
        showPhoto(index);
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    items.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => showPhoto(currentIndex - 1));
    nextBtn.addEventListener('click', () => showPhoto(currentIndex + 1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1);
        if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
    });
})();

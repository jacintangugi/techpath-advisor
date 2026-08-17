document.addEventListener('DOMContentLoaded', function () {

    const galleryImgs = Array.from(document.querySelectorAll('.gallery-item img'));

    if (galleryImgs.length === 0) return;

    let currentIndex = 0;
    let overlay = null;

    function buildOverlay() {
        overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';

        overlay.innerHTML = `
            <div class="lightbox-content" role="dialog" aria-modal="true">
                <button class="lightbox-close" aria-label="Close">✕</button>
                <button class="lightbox-prev" aria-label="Previous">◀</button>
                <button class="lightbox-next" aria-label="Next">▶</button>
                <img class="lightbox-img" src="" alt="">
                <div class="lightbox-caption"></div>
            </div>
        `;

        document.body.appendChild(overlay);

        overlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        overlay.querySelector('.lightbox-prev').addEventListener('click', showPrev);
        overlay.querySelector('.lightbox-next').addEventListener('click', showNext);

        // Close when clicking outside content
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeLightbox();
        });

        // keyboard
        document.addEventListener('keydown', onKeyDown);
    }

    function openLightbox(index) {
        currentIndex = index;
        if (!overlay) buildOverlay();

        updateLightbox();
        requestAnimationFrame(() => overlay.classList.add('open'));
    }

    function closeLightbox() {
        if (!overlay) return;
        overlay.classList.remove('open');
        // remove after transition
        setTimeout(() => {
            if (overlay) {
                overlay.remove();
                overlay = null;
                document.removeEventListener('keydown', onKeyDown);
            }
        }, 220);
    }

    function updateLightbox() {
        if (!overlay) return;
        const imgEl = overlay.querySelector('.lightbox-img');
        const captionEl = overlay.querySelector('.lightbox-caption');

        const src = galleryImgs[currentIndex].getAttribute('src');
        const alt = galleryImgs[currentIndex].getAttribute('alt') || '';
        const fig = galleryImgs[currentIndex].closest('figure');
        const captionText = fig ? (fig.querySelector('figcaption') ? fig.querySelector('figcaption').textContent : '') : '';

        imgEl.src = src;
        imgEl.alt = alt;
        captionEl.textContent = captionText;
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + galleryImgs.length) % galleryImgs.length;
        updateLightbox();
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % galleryImgs.length;
        updateLightbox();
    }

    function onKeyDown(e) {
        if (!overlay) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    }

    // attach click handlers
    galleryImgs.forEach((img, i) => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function () {
            openLightbox(i);
        });
    });

});

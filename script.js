document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Simple lazy loading for images
    const images = document.querySelectorAll('img');
    const imageOptions = {
        threshold: 0,
        rootMargin: '0px 0px 50px 0px'
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                observer.unobserve(img);
            }
        });
    }, imageOptions);

    images.forEach(img => imageObserver.observe(img));

    // Lightbox / popup for full-size images
    function createLightbox() {
        const overlay = document.createElement('div');
        overlay.id = 'lightbox-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0,0,0,0.8)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = 10000;
        overlay.style.padding = '20px';
        overlay.style.boxSizing = 'border-box';

        const img = document.createElement('img');
        img.id = 'lightbox-image';
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        img.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
        img.alt = '';

        overlay.appendChild(img);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target === img) {
                overlay.style.display = 'none';
                img.src = '';
            }
        });

        document.body.appendChild(overlay);
        return { overlay, img };
    }

    const lightbox = createLightbox();

    document.querySelectorAll('.gallery-thumb').forEach(thumb => {
        thumb.style.cursor = 'zoom-in';
        thumb.addEventListener('click', () => {
            const full = thumb.dataset.full || thumb.getAttribute('data-full') || thumb.src;
            lightbox.img.src = full;
            lightbox.img.alt = thumb.alt || '';
            lightbox.overlay.style.display = 'flex';
        });
    });
});
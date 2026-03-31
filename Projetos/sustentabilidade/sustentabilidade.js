(function () {
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    const revealItems = Array.from(document.querySelectorAll('.reveal'));

    const galleryLightbox = document.getElementById('galleryLightbox');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const galleryButtons = Array.from(document.querySelectorAll('.gallery-item'));

    function translateMessage(key, fallbackText) {
        if (window.siteLanguage && typeof window.siteLanguage.t === 'function') {
            return window.siteLanguage.t(key, {}, fallbackText);
        }

        return fallbackText;
    }

    function translateDynamicText(value) {
        if (!window.siteLanguage || typeof window.siteLanguage.getCurrentLanguage !== 'function') {
            return value;
        }

        if (window.siteLanguage.getCurrentLanguage() !== 'en') {
            return value;
        }

        if (typeof window.siteLanguage.translateText === 'function') {
            return window.siteLanguage.translateText(value);
        }

        return value;
    }

    function updateThemeIcon(theme) {
        if (!themeToggle) {
            return;
        }

        const isDark = theme === 'dark';
        themeToggle.setAttribute('aria-pressed', String(isDark));
        themeToggle.setAttribute('data-theme-mode', isDark ? 'dark' : 'light');
        themeToggle.setAttribute(
            'aria-label',
            isDark
                ? translateMessage('theme.toLight', 'Alternar para tema claro')
                : translateMessage('theme.toDark', 'Alternar para tema escuro')
        );

        const icon = themeToggle.querySelector('i');
        if (!icon) {
            return;
        }

        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const initialTheme = savedTheme || systemTheme;

        html.setAttribute('data-theme', initialTheme);
        updateThemeIcon(initialTheme);

        if (!themeToggle) {
            return;
        }

        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

            html.setAttribute('data-theme', nextTheme);
            localStorage.setItem('theme', nextTheme);
            updateThemeIcon(nextTheme);
        });
    }

    function initMenu() {
        if (!menuToggle || !navLinks) {
            return;
        }

        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    function initReveal() {
        if (!revealItems.length) {
            return;
        }

        if (!('IntersectionObserver' in window)) {
            revealItems.forEach((item) => item.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries, instance) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add('is-visible');
                instance.unobserve(entry.target);
            });
        }, {
            threshold: 0.14,
            rootMargin: '0px 0px -12% 0px'
        });

        revealItems.forEach((item, index) => {
            item.style.transitionDelay = `${(index % 4) * 55}ms`;
            observer.observe(item);
        });
    }

    function openLightbox(source, caption, altText) {
        if (!galleryLightbox || !lightboxImage || !lightboxCaption) {
            return;
        }

        lightboxImage.src = source;
        lightboxImage.alt = translateDynamicText(altText || 'Imagem ampliada do projeto');
        lightboxCaption.textContent = translateDynamicText(caption || '');

        galleryLightbox.classList.add('is-open');
        galleryLightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!galleryLightbox || !lightboxImage || !lightboxCaption) {
            return;
        }

        galleryLightbox.classList.remove('is-open');
        galleryLightbox.setAttribute('aria-hidden', 'true');
        lightboxImage.src = '';
        lightboxCaption.textContent = '';
        document.body.style.overflow = '';
    }

    function initGallery() {
        if (!galleryButtons.length || !galleryLightbox) {
            return;
        }

        galleryButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const source = button.getAttribute('data-image');
                const caption = button.getAttribute('data-caption');
                const previewImage = button.querySelector('img');
                const altText = previewImage ? previewImage.alt : 'Imagem da galeria';

                if (!source) {
                    return;
                }

                openLightbox(source, caption, altText);
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        galleryLightbox.addEventListener('click', (event) => {
            if (event.target === galleryLightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && galleryLightbox.classList.contains('is-open')) {
                closeLightbox();
            }
        });
    }

    function init() {
        initTheme();
        initMenu();
        initReveal();
        initGallery();

        window.addEventListener('siteLanguageChanged', () => {
            const currentTheme = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            updateThemeIcon(currentTheme);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
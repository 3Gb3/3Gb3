// Script específico do projeto PurplePlay

const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle') || document.querySelector('.menu-toggle');
const navLinksContainer = document.getElementById('navLinks') || document.querySelector('.nav-links');

function translateMessage(key, params = {}, fallback = '') {
    if (window.siteLanguage && typeof window.siteLanguage.t === 'function') {
        return window.siteLanguage.t(key, params, fallback);
    }

    return fallback;
}

function updateThemeButton(theme) {
    if (!themeToggle) {
        return;
    }

    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('data-theme-mode', isDark ? 'dark' : 'light');
    themeToggle.setAttribute(
        'aria-label',
        isDark
            ? translateMessage('theme.toLight', {}, 'Alternar para tema claro')
            : translateMessage('theme.toDark', {}, 'Alternar para tema escuro')
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

function initializeThemeToggle() {
    const currentTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    html.setAttribute('data-theme', currentTheme);
    updateThemeButton(currentTheme);

    if (!themeToggle) {
        return;
    }

    themeToggle.addEventListener('click', () => {
        const activeTheme = html.getAttribute('data-theme');
        const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);
    });

    window.addEventListener('siteLanguageChanged', () => {
        const activeTheme = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        updateThemeButton(activeTheme);
    });
}

function closeMobileMenu() {
    if (!menuToggle || !navLinksContainer) {
        return;
    }

    navLinksContainer.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', translateMessage('nav.openMenu', {}, 'Abrir menu de navegação'));
}

function initializeMobileMenu() {
    if (!menuToggle || !navLinksContainer) {
        return;
    }

    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', translateMessage('nav.openMenu', {}, 'Abrir menu de navegação'));

    menuToggle.addEventListener('click', () => {
        const isOpen = navLinksContainer.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute(
            'aria-label',
            isOpen
                ? translateMessage('nav.closeMenu', {}, 'Fechar menu de navegação')
                : translateMessage('nav.openMenu', {}, 'Abrir menu de navegação')
        );
    });

    navLinksContainer.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    window.addEventListener('siteLanguageChanged', () => {
        const isOpen = navLinksContainer.classList.contains('active');
        menuToggle.setAttribute(
            'aria-label',
            isOpen
                ? translateMessage('nav.closeMenu', {}, 'Fechar menu de navegação')
                : translateMessage('nav.openMenu', {}, 'Abrir menu de navegação')
        );
    });
}

function initializeSmoothAnchors() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetSelector = link.getAttribute('href');
            const target = targetSelector ? document.querySelector(targetSelector) : null;

            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function initializeRevealAnimations() {
    const revealElements = Array.from(document.querySelectorAll('.purple-reveal'));
    if (!revealElements.length) {
        return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    revealElements.forEach((element, index) => {
        const delay = Math.min(index * 90, 420);
        element.style.setProperty('--purple-reveal-delay', `${delay}ms`);
    });

    if (reduceMotion || typeof window.IntersectionObserver !== 'function') {
        revealElements.forEach((element) => {
            element.classList.add('is-visible');
        });
        return;
    }

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('is-visible');
            observerInstance.unobserve(entry.target);
        });
    }, {
        root: null,
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px'
    });

    revealElements.forEach((element) => {
        observer.observe(element);
    });
}

function initializePurplePlayPage() {
    initializeThemeToggle();
    initializeMobileMenu();
    initializeSmoothAnchors();
    initializeRevealAnimations();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePurplePlayPage);
} else {
    initializePurplePlayPage();
}

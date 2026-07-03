const html = document.documentElement;
const menuToggle = document.getElementById('menuToggle');
const navLinksContainer = document.getElementById('navLinks');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');
const scrollTopBtn = document.getElementById('scrollTop');
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');
const currentYearElement = document.getElementById('currentYear');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SUBMIT_COOLDOWN_MS = 60 * 1000;
const MIN_FORM_FILL_TIME_MS = 3000;
const PAGE_TRANSITION_DELAY_MS = 460;
const PAGE_ENTER_ANIMATION_MS = 420;
const PAGE_TRANSITION_STATE_KEY = 'portfolioPageTransition';
const PAGE_TRANSITION_MAX_AGE_MS = 7000;

let pageTransitionOverlay = null;
let pageTransitionInProgress = false;

function translateMessage(key, params = {}, fallback = '') {
    if (window.siteLanguage && typeof window.siteLanguage.t === 'function') {
        return window.siteLanguage.t(key, params, fallback);
    }

    return fallback;
}

function getActiveLanguage() {
    if (window.siteLanguage && typeof window.siteLanguage.getCurrentLanguage === 'function') {
        return window.siteLanguage.getCurrentLanguage();
    }

    return 'pt';
}

html.setAttribute('data-theme', 'dark');
localStorage.removeItem('theme');
prepareIncomingPageTransition();
setupPageTransitions();
setupNavigation();
setupModals();
setupScrollTopButton();
setupFooterYear();
setupContactForm();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupVisualEffects);
} else {
    setupVisualEffects();
}

function setupNavigation() {
    if (menuToggle && navLinksContainer) {
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
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    window.addEventListener('siteLanguageChanged', () => {
        const isOpen = Boolean(navLinksContainer && navLinksContainer.classList.contains('active'));

        if (menuToggle) {
            menuToggle.setAttribute(
                'aria-label',
                isOpen
                    ? translateMessage('nav.closeMenu', {}, 'Fechar menu de navegação')
                    : translateMessage('nav.openMenu', {}, 'Abrir menu de navegação')
            );
        }

    });
}

function setupModals() {
    const modalTriggers = document.querySelectorAll('[data-modal-open]');
    const modals = document.querySelectorAll('.modal');
    let activeModal = null;
    let lastFocusedElement = null;

    if (!modalTriggers.length || !modals.length) {
        return;
    }

    const closeModal = () => {
        if (!activeModal) {
            return;
        }

        activeModal.hidden = true;
        document.body.classList.remove('modal-open');
        activeModal = null;

        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    };

    const openModal = (modalId, trigger) => {
        const modal = document.getElementById(modalId);
        if (!modal || !modal.classList.contains('modal')) {
            return;
        }

        lastFocusedElement = trigger;
        activeModal = modal;
        modal.hidden = false;
        document.body.classList.add('modal-open');

        const closeButton = modal.querySelector('[data-modal-close]');
        if (closeButton) {
            closeButton.focus();
        }
    };

    modalTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            openModal(trigger.getAttribute('data-modal-open'), trigger);
        });
    });

    modals.forEach((modal) => {
        modal.addEventListener('click', (event) => {
            const clickedCloseControl = event.target.closest('[data-modal-close]');
            if (event.target === modal || clickedCloseControl) {
                closeModal();
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && activeModal) {
            closeModal();
        }
    });
}

function setupScrollTopButton() {
    if (!scrollTopBtn) {
        return;
    }

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    });
}

function handleScroll() {
    updateActiveNavLink();

    if (scrollTopBtn) {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
    }
}

function updateActiveNavLink() {
    if (!sections.length || !navLinks.length) {
        return;
    }

    const viewportOffset = window.scrollY + 130;
    let currentSectionId = sections[0].id;

    sections.forEach((section) => {
        if (viewportOffset >= section.offsetTop) {
            currentSectionId = section.id;
        }
    });

    navLinks.forEach((link) => {
        const targetId = (link.getAttribute('href') || '').replace('#', '');
        const isActive = targetId === currentSectionId;

        link.classList.toggle('active', isActive);

        if (isActive) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
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

function setupVisualEffects() {
    setupProjectImages();
    setupScrollAnimations();
}

function setupPageTransitions() {
    const linksWithTransition = Array.from(document.querySelectorAll('a[href]')).filter((link) => {
        const destination = getLinkDestination(link);
        if (!destination) {
            return false;
        }

        return isTransitionEligibleDestination(destination);
    });

    if (!linksWithTransition.length || prefersReducedMotion) {
        return;
    }

    pageTransitionOverlay = createPageTransitionOverlay();

    linksWithTransition.forEach((link) => {
        link.addEventListener('click', (event) => {
            if (shouldSkipTransition(event, link)) {
                return;
            }

            const destination = getLinkDestination(link);
            if (!destination) {
                return;
            }

            event.preventDefault();
            navigateWithTransition(destination.href);
        });
    });

    window.addEventListener('pageshow', resetPageTransitionState);
}

function prepareIncomingPageTransition() {
    const transitionState = consumePageTransitionState();
    if (!transitionState || prefersReducedMotion) {
        return;
    }

    document.body.classList.add('page-entering');

    pageTransitionOverlay = createPageTransitionOverlay();
    if (pageTransitionOverlay) {
        pageTransitionOverlay.classList.add('visible', 'entering');
    }

    window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
            document.body.classList.add('page-enter-active');

            if (pageTransitionOverlay) {
                pageTransitionOverlay.classList.add('fade-out');
            }
        });
    });

    window.setTimeout(() => {
        document.body.classList.remove('page-entering', 'page-enter-active');

        if (pageTransitionOverlay) {
            pageTransitionOverlay.classList.remove('visible', 'entering', 'fade-out');
        }
    }, PAGE_ENTER_ANIMATION_MS + 40);
}

function savePageTransitionState(destinationUrl) {
    try {
        const destination = new URL(destinationUrl, window.location.href);
        if (destination.origin !== window.location.origin) {
            return;
        }

        const state = {
            pathname: normalizePath(destination.pathname),
            timestamp: Date.now()
        };

        sessionStorage.setItem(PAGE_TRANSITION_STATE_KEY, JSON.stringify(state));
    } catch (_error) {
        // Ignora falhas de persistencia para nao bloquear navegacao.
    }
}

function consumePageTransitionState() {
    try {
        const rawState = sessionStorage.getItem(PAGE_TRANSITION_STATE_KEY);
        if (!rawState) {
            return null;
        }

        sessionStorage.removeItem(PAGE_TRANSITION_STATE_KEY);

        const parsedState = JSON.parse(rawState);
        if (!parsedState || typeof parsedState !== 'object') {
            return null;
        }

        const currentPath = normalizePath(window.location.pathname);
        const targetPath = normalizePath(String(parsedState.pathname || ''));
        const timestamp = Number(parsedState.timestamp || 0);
        const isFreshState = Number.isFinite(timestamp) && (Date.now() - timestamp) <= PAGE_TRANSITION_MAX_AGE_MS;

        if (!targetPath || currentPath !== targetPath || !isFreshState) {
            return null;
        }

        return parsedState;
    } catch (_error) {
        return null;
    }
}

function getLinkDestination(link) {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
        return null;
    }

    try {
        return new URL(href, window.location.href);
    } catch (_error) {
        return null;
    }
}

function normalizePath(pathname) {
    return decodeURIComponent(pathname).replace(/\\/g, '/').toLowerCase();
}

function isProjectsPagePath(pathname) {
    return normalizePath(pathname).endsWith('projetos.html');
}

function isHomePagePath(pathname) {
    const normalizedPath = normalizePath(pathname);
    return normalizedPath.endsWith('index.html') || normalizedPath.endsWith('/');
}

function isTransitionEligibleDestination(destination) {
    if (destination.origin !== window.location.origin) {
        return false;
    }

    const destinationPath = normalizePath(destination.pathname);
    const currentPath = normalizePath(window.location.pathname);

    if (destinationPath === currentPath) {
        return false;
    }

    return isProjectsPagePath(destinationPath) || isHomePagePath(destinationPath);
}

function shouldSkipTransition(event, link) {
    if (pageTransitionInProgress || event.defaultPrevented) {
        return true;
    }

    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return true;
    }

    const target = (link.getAttribute('target') || '').toLowerCase();
    if (target && target !== '_self') {
        return true;
    }

    return link.hasAttribute('download');
}

function createPageTransitionOverlay() {
    const existingOverlay = document.querySelector('.page-transition-overlay');
    if (existingOverlay) {
        return existingOverlay;
    }

    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
        <div class="page-transition-card">
            <span class="page-transition-spinner" aria-hidden="true"></span>
            <span class="page-transition-text">${translateMessage('transition.loading', {}, 'Carregando...')}</span>
        </div>
    `;

    document.body.appendChild(overlay);
    return overlay;
}

function navigateWithTransition(destinationUrl) {
    if (pageTransitionInProgress) {
        return;
    }

    if (!pageTransitionOverlay) {
        pageTransitionOverlay = createPageTransitionOverlay();
    }

    pageTransitionInProgress = true;
    savePageTransitionState(destinationUrl);
    updatePageTransitionMessage(destinationUrl);
    document.body.classList.add('page-transition-prep');

    window.requestAnimationFrame(() => {
        document.body.classList.add('page-transition-active');

        if (pageTransitionOverlay) {
            pageTransitionOverlay.classList.add('visible');
        }
    });

    window.setTimeout(() => {
        window.location.assign(destinationUrl);
    }, PAGE_TRANSITION_DELAY_MS);
}

function resetPageTransitionState() {
    pageTransitionInProgress = false;
    document.body.classList.remove('page-transition-prep', 'page-transition-active');

    if (pageTransitionOverlay) {
        pageTransitionOverlay.classList.remove('visible');
    }
}

function updatePageTransitionMessage(destinationUrl) {
    if (!pageTransitionOverlay) {
        return;
    }

    const textElement = pageTransitionOverlay.querySelector('.page-transition-text');
    if (!textElement) {
        return;
    }

    textElement.textContent = getTransitionMessage(destinationUrl);
}

function getTransitionMessage(destinationUrl) {
    try {
        const destination = new URL(destinationUrl, window.location.href);

        if (isHomePagePath(destination.pathname)) {
            return translateMessage('transition.backToPortfolio', {}, 'Voltando ao site...');
        }

        if (isProjectsPagePath(destination.pathname)) {
            return translateMessage('transition.openProjects', {}, 'Abrindo projetos...');
        }
    } catch (_error) {
        return translateMessage('transition.loading', {}, 'Carregando...');
    }

    return translateMessage('transition.loading', {}, 'Carregando...');
}

function setupProjectImages() {
    const projectImages = document.querySelectorAll('.project-image img');
    if (!projectImages.length) {
        return;
    }

    projectImages.forEach((img) => {
        const imageContainer = img.parentElement;
        if (!imageContainer) {
            return;
        }

        imageContainer.classList.add('loading');

        const preloadImg = new Image();
        preloadImg.src = img.src;

        preloadImg.onload = () => {
            img.src = preloadImg.src;
            imageContainer.classList.remove('loading');
            imageContainer.classList.add('loaded');
        };

        if (img.complete && img.naturalHeight > 0) {
            imageContainer.classList.remove('loading');
            imageContainer.classList.add('loaded');
        }

        img.addEventListener('error', function handleImageError() {
            const projectCard = this.closest('.project-card');
            const projectTitle = projectCard ? projectCard.querySelector('.project-info h3')?.textContent : 'Projeto';
            const projectImageDiv = this.parentElement;

            if (!projectImageDiv) {
                return;
            }

            projectImageDiv.classList.remove('loading');
            this.remove();

            const placeholder = document.createElement('div');
            placeholder.className = 'project-placeholder';
            placeholder.textContent = projectTitle || 'Projeto';
            projectImageDiv.appendChild(placeholder);
        });

        preloadImg.onerror = () => {
            img.dispatchEvent(new Event('error'));
        };
    });
}

function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.project-card, .skills-category, .resume-item, .highlight-item, .contact-item');
    if (!animatedElements.length) {
        return;
    }

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        animatedElements.forEach(setElementVisible);
        return;
    }

    const observer = new IntersectionObserver(
        (entries, localObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setElementVisible(entry.target);
                    localObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        }
    );

    animatedElements.forEach((element) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(24px)';
        element.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
        observer.observe(element);
    });
}

function setElementVisible(element) {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
}

function setupContactForm() {
    if (!contactForm) {
        return;
    }

    contactForm.dataset.startedAt = String(Date.now());

    const requiredInputs = Array.from(contactForm.querySelectorAll('input[required], textarea[required]'));
    const submitButton = contactForm.querySelector('button[type="submit"]');

    requiredInputs.forEach((input) => {
        input.addEventListener('blur', () => {
            toggleInputValidity(input);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('invalid')) {
                toggleInputValidity(input);
            }
        });
    });

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const honeypotValue = String(formData.get('company') || '').trim();
        const startedAt = Number(contactForm.dataset.startedAt || Date.now());
        const filledTooFast = Date.now() - startedAt < MIN_FORM_FILL_TIME_MS;

        if (honeypotValue || filledTooFast) {
            showFormFeedback(translateMessage('form.blocked', {}, 'Não foi possível enviar. Atualize a página e tente novamente.'), 'error');
            return;
        }

        if (!contactForm.checkValidity()) {
            requiredInputs.forEach(toggleInputValidity);
            showFormFeedback(translateMessage('form.reviewRequired', {}, 'Revise os campos obrigatórios antes de enviar.'), 'error');
            contactForm.reportValidity();
            return;
        }

        const lastSubmit = Number(localStorage.getItem('portfolioLastSubmit') || '0');
        if (Date.now() - lastSubmit < SUBMIT_COOLDOWN_MS) {
            showFormFeedback(translateMessage('form.cooldown', {}, 'Aguarde alguns segundos antes de enviar uma nova mensagem.'), 'error');
            return;
        }

        if (!submitButton) {
            return;
        }

        const originalButtonContent = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = `<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> ${translateMessage('form.buttonSending', {}, 'Enviando...')}`;

        showFormFeedback(translateMessage('form.sending', {}, 'Enviando mensagem...'), '');

        const activeLocale = getActiveLanguage() === 'en' ? 'en-US' : 'pt-BR';

        const payload = {
            name: String(formData.get('name') || '').trim(),
            email: String(formData.get('email') || '').trim(),
            subject: String(formData.get('subject') || '').trim(),
            message: String(formData.get('message') || '').trim(),
            time: new Date().toLocaleString(activeLocale, {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        try {
            await sendContactMessage(payload);

            localStorage.setItem('portfolioLastSubmit', String(Date.now()));
            contactForm.reset();
            contactForm.dataset.startedAt = String(Date.now());

            requiredInputs.forEach((input) => {
                input.classList.remove('invalid');
            });

            showFormFeedback(translateMessage('form.success', {}, 'Mensagem enviada com sucesso. Obrigado pelo contato!'), 'success');
        } catch (error) {
            console.error('Erro ao enviar formulario:', error);
            showFormFeedback(translateMessage('form.failed', {}, 'Não foi possível enviar agora. Tente novamente em instantes ou use o e-mail direto.'), 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonContent;
        }
    });
}

function toggleInputValidity(input) {
    const value = input.value.trim();
    const isValid = value !== '' && input.checkValidity();
    input.classList.toggle('invalid', !isValid);
}

function showFormFeedback(message, type = '') {
    if (!formFeedback) {
        return;
    }

    formFeedback.textContent = message;
    formFeedback.className = `form-feedback ${type}`.trim();
}

function sendContactMessage(payload) {
    if (typeof emailjs === 'undefined' || typeof emailjs.send !== 'function') {
        return Promise.reject(new Error(translateMessage('form.emailjsUnavailable', {}, 'EmailJS não disponível')));
    }

    return emailjs.send('service_lm0ubti', 'template_y440a0r', payload);
}

function setupFooterYear() {
    if (currentYearElement) {
        currentYearElement.textContent = String(new Date().getFullYear());
    }
}

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
const LANGUAGE_GATE_TRANSITION_MS = 720;
const LANGUAGE_GATE_COVER_PROGRESS = 0.32;
const PAGE_TRANSITION_COVER_MS = LANGUAGE_GATE_TRANSITION_MS * LANGUAGE_GATE_COVER_PROGRESS;
const PAGE_TRANSITION_REVEAL_MS = LANGUAGE_GATE_TRANSITION_MS * (1 - LANGUAGE_GATE_COVER_PROGRESS);
const PAGE_COVER_HOLD_MS = 80;
const PAGE_TRANSITION_STATE_KEY = 'sitePageTransition';
const PAGE_TRANSITION_MAX_AGE_MS = 7000;
const PAGE_TRANSITION_PHASES = Object.freeze({
    IDLE: 'idle',
    ENTERING: 'entering',
    COVERED: 'covered',
    EXITING: 'exiting'
});

let pageTransitionOverlay = null;
let pageTransitionPhase = PAGE_TRANSITION_PHASES.IDLE;
let pageTransitionResetTimer = null;

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

function upgradeLegacyNavigation() {
    const isProjectDetail = normalizePath(window.location.pathname).includes('/projetos/');
    if (!isProjectDetail || document.querySelector('[data-site-header]') || navLinks.length !== 6) {
        return;
    }

    const items = [
        ['../../index.html', 'Início'],
        ['../../projetos.html', 'Projetos'],
        ['../../experiencia.html', 'Experiência'],
        ['../../habilidades.html', 'Habilidades'],
        ['../../certificacoes.html', 'Certificações'],
        ['../../contato.html', 'Fale comigo']
    ];

    navLinks.forEach((link, index) => {
        const [href, label] = items[index];
        link.href = href;
        link.textContent = label;
        link.classList.toggle('active', index === 1);
        if (index === 1) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

html.setAttribute('data-theme', 'dark');
localStorage.removeItem('theme');
upgradeLegacyNavigation();
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
    const mobileNavigationQuery = window.matchMedia('(max-width: 820px)');

    const syncMobileNavigation = () => {
        if (!menuToggle || !navLinksContainer) {
            return;
        }

        const isMobile = mobileNavigationQuery.matches;
        const isOpen = isMobile && navLinksContainer.classList.contains('active');

        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute(
            'aria-label',
            isOpen
                ? translateMessage('nav.closeMenu', {}, 'Fechar menu de navegação')
                : translateMessage('nav.openMenu', {}, 'Abrir menu de navegação')
        );

        if (isMobile) {
            navLinksContainer.setAttribute('aria-hidden', String(!isOpen));
            navLinks.forEach((link) => {
                if (isOpen) {
                    link.removeAttribute('tabindex');
                } else {
                    link.setAttribute('tabindex', '-1');
                }
            });
        } else {
            navLinksContainer.classList.remove('active');
            navLinksContainer.removeAttribute('aria-hidden');
            navLinks.forEach((link) => link.removeAttribute('tabindex'));
        }

        document.body.classList.toggle('mobile-menu-open', isOpen);
    };

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navLinksContainer.classList.toggle('active');
            syncMobileNavigation();

            if (isOpen && navLinks.length) {
                navLinks[0].focus();
            }
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', syncMobileNavigation, { passive: true });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navLinksContainer && navLinksContainer.classList.contains('active')) {
            closeMobileMenu(true);
        }
    });
    syncMobileNavigation();
    handleScroll();

    window.addEventListener('siteLanguageChanged', () => {
        syncMobileNavigation();
    });
}

function setupModals() {
    const modalTriggers = document.querySelectorAll('[data-modal-open]');
    const modals = document.querySelectorAll('.modal');
    let activeModal = null;
    let lastFocusedElement = null;
    let backgroundState = [];

    if (!modalTriggers.length || !modals.length) {
        return;
    }

    const restoreBackground = () => {
        backgroundState.forEach(({ element, ariaHidden, inert }) => {
            element.inert = inert;
            if (ariaHidden === null) {
                element.removeAttribute('aria-hidden');
            } else {
                element.setAttribute('aria-hidden', ariaHidden);
            }
        });
        backgroundState = [];
    };

    const isolateModal = (modal) => {
        backgroundState = Array.from(document.body.children)
            .filter((element) => element !== modal && element.tagName !== 'SCRIPT')
            .map((element) => ({
                element,
                ariaHidden: element.getAttribute('aria-hidden'),
                inert: element.inert
            }));

        backgroundState.forEach(({ element }) => {
            element.inert = true;
            element.setAttribute('aria-hidden', 'true');
        });
    };

    const getFocusableElements = (modal) => Array.from(
        modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter((element) => !element.hidden && element.getClientRects().length > 0);

    const closeModal = () => {
        if (!activeModal) {
            return;
        }

        activeModal.hidden = true;
        document.body.classList.remove('modal-open');
        restoreBackground();
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
        isolateModal(modal);

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
            return;
        }

        if (event.key === 'Tab' && activeModal) {
            const focusableElements = getFocusableElements(activeModal);
            if (!focusableElements.length) {
                event.preventDefault();
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
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
    const inPageLinks = Array.from(navLinks).filter((link) => (link.getAttribute('href') || '').startsWith('#'));
    if (!sections.length || !inPageLinks.length) {
        return;
    }

    const viewportOffset = window.scrollY + 130;
    let currentSectionId = sections[0].id;

    sections.forEach((section) => {
        if (viewportOffset >= section.offsetTop) {
            currentSectionId = section.id;
        }
    });

    inPageLinks.forEach((link) => {
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

function closeMobileMenu(returnFocus = false) {
    if (!menuToggle || !navLinksContainer) {
        return;
    }

    navLinksContainer.classList.remove('active');
    if (window.matchMedia('(max-width: 820px)').matches) {
        navLinksContainer.setAttribute('aria-hidden', 'true');
        navLinks.forEach((link) => link.setAttribute('tabindex', '-1'));
    } else {
        navLinksContainer.removeAttribute('aria-hidden');
        navLinks.forEach((link) => link.removeAttribute('tabindex'));
    }
    document.body.classList.remove('mobile-menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', translateMessage('nav.openMenu', {}, 'Abrir menu de navegação'));

    if (returnFocus) {
        menuToggle.focus();
    }
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
            if (isPageTransitionRunning()) {
                event.preventDefault();
                return;
            }

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

    window.addEventListener('pageshow', handlePageShow);
}

function prepareIncomingPageTransition() {
    const transitionState = consumePageTransitionState();
    if (!transitionState || prefersReducedMotion) {
        html.removeAttribute('data-page-transition-boot');
        return;
    }

    pageTransitionOverlay = createPageTransitionOverlay();
    setPageTransitionPhase(PAGE_TRANSITION_PHASES.COVERED);
    html.removeAttribute('data-page-transition-boot');

    runWhenPageIsReady(startPageTransitionExit);
}

function runWhenPageIsReady(callback) {
    const runOnNextPaint = () => {
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                window.setTimeout(callback, PAGE_COVER_HOLD_MS);
            });
        });
    };

    if (document.readyState === 'complete') {
        runOnNextPaint();
        return;
    }

    window.addEventListener('load', runOnNextPaint, { once: true });
}

function startPageTransitionExit() {
    if (pageTransitionPhase !== PAGE_TRANSITION_PHASES.COVERED) {
        return;
    }

    setPageTransitionPhase(PAGE_TRANSITION_PHASES.EXITING);

    window.clearTimeout(pageTransitionResetTimer);
    const middleBand = pageTransitionOverlay?.querySelector('.page-transition-bands span:nth-child(2)');
    middleBand?.addEventListener('animationend', resetPageTransitionState, { once: true });
    pageTransitionResetTimer = window.setTimeout(resetPageTransitionState, PAGE_TRANSITION_REVEAL_MS + 140);
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

function isTransitionEligibleDestination(destination) {
    if (destination.origin !== window.location.origin) {
        return false;
    }

    const destinationPath = normalizePath(destination.pathname);
    const currentPath = normalizePath(window.location.pathname);

    if (destinationPath === currentPath) {
        return false;
    }

    return destinationPath.endsWith('.html') || destinationPath.endsWith('/');
}

function shouldSkipTransition(event, link) {
    if (event.defaultPrevented) {
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
        <div class="language-gate__bands page-transition-bands" aria-hidden="true">
            <span></span><span></span><span></span>
        </div>
    `;

    document.body.appendChild(overlay);
    overlay.dataset.transitionState = pageTransitionPhase;
    return overlay;
}

function navigateWithTransition(destinationUrl) {
    if (isPageTransitionRunning()) {
        return;
    }

    if (!pageTransitionOverlay) {
        pageTransitionOverlay = createPageTransitionOverlay();
    }

    setPageTransitionPhase(PAGE_TRANSITION_PHASES.ENTERING);

    window.requestAnimationFrame(() => {
        if (pageTransitionPhase !== PAGE_TRANSITION_PHASES.ENTERING) {
            return;
        }

        document.body.classList.add('page-transition-active');
        pageTransitionOverlay?.classList.add('is-animating');

        window.setTimeout(() => {
            if (pageTransitionPhase !== PAGE_TRANSITION_PHASES.ENTERING) {
                return;
            }

            setPageTransitionPhase(PAGE_TRANSITION_PHASES.COVERED);
            savePageTransitionState(destinationUrl);
            window.location.assign(destinationUrl);
        }, PAGE_TRANSITION_COVER_MS);
    });
}

function setPageTransitionPhase(phase) {
    pageTransitionPhase = phase;

    if (pageTransitionOverlay) {
        pageTransitionOverlay.dataset.transitionState = phase;
    }
}

function isPageTransitionRunning() {
    return pageTransitionPhase !== PAGE_TRANSITION_PHASES.IDLE;
}

function handlePageShow(event) {
    if (event.persisted || pageTransitionPhase === PAGE_TRANSITION_PHASES.ENTERING) {
        resetPageTransitionState();
    }
}

function resetPageTransitionState() {
    window.clearTimeout(pageTransitionResetTimer);
    pageTransitionResetTimer = null;
    document.body.classList.remove('page-transition-active');
    pageTransitionOverlay?.classList.remove('is-animating');

    setPageTransitionPhase(PAGE_TRANSITION_PHASES.IDLE);
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
    const animatedElements = document.querySelectorAll('.reveal-on-scroll, .project-card, .skills-category, .resume-item, .highlight-item, .contact-item');
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

        const lastSubmit = Number(localStorage.getItem('siteLastSubmit') || '0');
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

            localStorage.setItem('siteLastSubmit', String(Date.now()));
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

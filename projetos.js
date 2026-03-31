function setupProjectsCatalog() {
    const projectCards = Array.from(document.querySelectorAll('[data-project-card]'));
    if (!projectCards.length) {
        return;
    }

    const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
    const searchInput = document.getElementById('projectSearch');
    const resultsElement = document.getElementById('projectResults');
    const emptyState = document.getElementById('projectEmptyState');
    const clearFiltersButton = document.getElementById('clearProjectFilters');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    const navigationType = navigationEntry && typeof navigationEntry.type === 'string' ? navigationEntry.type : '';
    const shouldResetStoredState = navigationType === 'reload';

    const PROJECTS_STATE_KEY = 'projectsCatalogState';
    const REVEAL_STAGGER_MS = 45;
    const MAX_STAGGER_ITEMS = 8;
    const REVEAL_ANIMATION_MS = 460;

    let activeFilter = 'all';
    let activeSearchTerm = '';
    let activeSearchNormalized = '';
    let revealCleanupTimer = null;

    const normalizeText = (value) => String(value || '').trim().toLowerCase();
    const translateMessage = (key, params = {}, fallback = '') => {
        if (window.siteLanguage && typeof window.siteLanguage.t === 'function') {
            return window.siteLanguage.t(key, params, fallback);
        }

        return fallback;
    };

    const clearAnimationState = () => {
        if (revealCleanupTimer) {
            window.clearTimeout(revealCleanupTimer);
            revealCleanupTimer = null;
        }

        projectCards.forEach((card) => {
            card.classList.remove('is-revealing');
            card.style.removeProperty('--project-reveal-delay');
        });
    };

    const updateResultsAndEmptyState = (visibleCards) => {
        if (resultsElement) {
            resultsElement.textContent = translateMessage(
                'projects.results',
                {
                    visible: visibleCards,
                    total: projectCards.length
                },
                `Mostrando ${visibleCards} de ${projectCards.length} projetos`
            );
        }

        if (emptyState) {
            emptyState.hidden = visibleCards > 0;
        }
    };

    const cardMatchesCurrentCriteria = (card) => {
        const categoryText = normalizeText(card.dataset.category || '');
        const categories = categoryText.split(/\s+/).filter(Boolean);
        const keywords = normalizeText(card.dataset.keywords || '');
        const title = normalizeText(card.querySelector('h3')?.textContent || '');
        const description = normalizeText(card.querySelector('.project-info p')?.textContent || '');
        const searchableText = `${title} ${description} ${keywords} ${categoryText}`;

        const matchesFilter = activeFilter === 'all' || categories.includes(activeFilter);
        const matchesSearch = !activeSearchNormalized || searchableText.includes(activeSearchNormalized);

        return matchesFilter && matchesSearch;
    };

    const applyVisibility = () => {
        let visibleCards = 0;

        projectCards.forEach((card) => {
            const shouldDisplay = cardMatchesCurrentCriteria(card);

            card.classList.toggle('is-hidden', !shouldDisplay);
            card.setAttribute('aria-hidden', String(!shouldDisplay));

            if (shouldDisplay) {
                visibleCards += 1;
            }
        });

        updateResultsAndEmptyState(visibleCards);
        return visibleCards;
    };

    const animateVisibleCards = () => {
        const visibleCards = projectCards.filter((card) => !card.classList.contains('is-hidden'));

        visibleCards.forEach((card, index) => {
            const delay = Math.min(index, MAX_STAGGER_ITEMS) * REVEAL_STAGGER_MS;
            card.style.setProperty('--project-reveal-delay', `${delay}ms`);
            card.classList.add('is-revealing');
        });

        const lastDelay = visibleCards.length
            ? Math.min(visibleCards.length - 1, MAX_STAGGER_ITEMS) * REVEAL_STAGGER_MS
            : 0;

        revealCleanupTimer = window.setTimeout(() => {
            visibleCards.forEach((card) => {
                card.classList.remove('is-revealing');
                card.style.removeProperty('--project-reveal-delay');
            });
        }, REVEAL_ANIMATION_MS + lastDelay + 40);
    };

    const refreshCards = ({ animate = false } = {}) => {
        clearAnimationState();

        if (animate && !prefersReducedMotion) {
            applyVisibility();
            animateVisibleCards();

            return;
        }

        applyVisibility();
    };

    const persistState = () => {
        try {
            if (activeFilter === 'all' && !activeSearchTerm) {
                sessionStorage.removeItem(PROJECTS_STATE_KEY);
                return;
            }

            const state = {
                filter: activeFilter,
                term: activeSearchTerm
            };

            sessionStorage.setItem(PROJECTS_STATE_KEY, JSON.stringify(state));
        } catch (_error) {
            // Ignora falha de persistencia para nao bloquear a pagina.
        }
    };

    const syncFilterButtons = () => {
        filterButtons.forEach((button) => {
            const buttonFilter = normalizeText(button.dataset.filter || 'all') || 'all';
            const isActive = buttonFilter === activeFilter;

            button.classList.toggle('is-active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });
    };

    const applyCurrentState = ({ animate = true, persist = true } = {}) => {
        syncFilterButtons();
        refreshCards({ animate });

        if (persist) {
            persistState();
        }
    };

    const setActiveFilter = (filterValue, options = {}) => {
        const normalizedFilter = normalizeText(filterValue || 'all') || 'all';
        const hasFilterButton = filterButtons.some((button) => normalizeText(button.dataset.filter || 'all') === normalizedFilter);

        activeFilter = hasFilterButton ? normalizedFilter : 'all';
        applyCurrentState(options);
    };

    const setSearchTerm = (termValue, options = {}) => {
        activeSearchTerm = String(termValue || '').trim();
        activeSearchNormalized = normalizeText(activeSearchTerm);
        applyCurrentState(options);
    };

    const restoreState = () => {
        try {
            const rawState = sessionStorage.getItem(PROJECTS_STATE_KEY);
            if (!rawState) {
                return false;
            }

            const parsedState = JSON.parse(rawState);
            if (!parsedState || typeof parsedState !== 'object') {
                return false;
            }

            const restoredFilter = normalizeText(parsedState.filter || 'all') || 'all';
            const hasFilterButton = filterButtons.some((button) => normalizeText(button.dataset.filter || 'all') === restoredFilter);

            activeFilter = hasFilterButton ? restoredFilter : 'all';

            if (typeof parsedState.term === 'string') {
                activeSearchTerm = parsedState.term.trim();
                activeSearchNormalized = normalizeText(activeSearchTerm);

                if (searchInput) {
                    searchInput.value = activeSearchTerm;
                }
            }

            return true;
        } catch (_error) {
            return false;
        }
    };

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const selectedFilter = normalizeText(button.dataset.filter || 'all') || 'all';
            if (selectedFilter === activeFilter) {
                return;
            }

            setActiveFilter(selectedFilter, { animate: true, persist: true });
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            setSearchTerm(event.target.value || '', { animate: true, persist: true });
        });
    }

    if (clearFiltersButton) {
        clearFiltersButton.addEventListener('click', () => {
            const shouldReset = activeFilter !== 'all' || activeSearchNormalized !== '';
            if (!shouldReset) {
                return;
            }

            activeFilter = 'all';
            activeSearchTerm = '';
            activeSearchNormalized = '';

            if (searchInput) {
                searchInput.value = '';
            }

            applyCurrentState({ animate: true, persist: true });
        });
    }

    if (shouldResetStoredState) {
        try {
            sessionStorage.removeItem(PROJECTS_STATE_KEY);
        } catch (_error) {
            // Ignora falha de limpeza para nao bloquear a pagina.
        }
    } else {
        restoreState();
    }

    applyCurrentState({ animate: false, persist: false });

    window.addEventListener('siteLanguageChanged', () => {
        clearAnimationState();
        applyCurrentState({ animate: false, persist: false });
    });

    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            clearAnimationState();
            applyCurrentState({ animate: false, persist: false });
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupProjectsCatalog);
} else {
    setupProjectsCatalog();
}

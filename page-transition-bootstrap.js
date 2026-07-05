(function () {
    const STORAGE_KEY = 'sitePageTransition';
    const MAX_AGE_MS = 7000;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    try {
        const rawState = sessionStorage.getItem(STORAGE_KEY);
        if (!rawState) {
            return;
        }

        const state = JSON.parse(rawState);
        const currentPath = decodeURIComponent(window.location.pathname).replace(/\\/g, '/').toLowerCase();
        const targetPath = decodeURIComponent(String(state?.pathname || '')).replace(/\\/g, '/').toLowerCase();
        const timestamp = Number(state?.timestamp || 0);
        const isFresh = Number.isFinite(timestamp) && (Date.now() - timestamp) <= MAX_AGE_MS;

        if (targetPath && targetPath === currentPath && isFresh) {
            document.documentElement.dataset.pageTransitionBoot = 'covered';
        }
    } catch (_error) {
        document.documentElement.removeAttribute('data-page-transition-boot');
    }
})();

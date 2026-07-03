(function () {
    const page = document.body.dataset.page || 'home';
    const headerHost = document.querySelector('[data-site-header]');
    const footerHost = document.querySelector('[data-site-footer]');

    const navigation = [
        { id: 'home', href: 'index.html', label: 'Início', en: 'Home' },
        { id: 'projects', href: 'projetos.html', label: 'Projetos', en: 'Projects' },
        { id: 'experience', href: 'experiencia.html', label: 'Experiência', en: 'Experience' },
        { id: 'skills', href: 'habilidades.html', label: 'Habilidades', en: 'Skills' },
        { id: 'certifications', href: 'certificacoes.html', label: 'Certificações', en: 'Certifications' },
        { id: 'contact', href: 'contato.html', label: 'Fale comigo', en: 'Contact' }
    ];

    if (headerHost) {
        const links = navigation.map((item) => {
            const active = item.id === page;
            return `
                <li>
                    <a href="${item.href}" class="nav-link${active ? ' active' : ''}"${active ? ' aria-current="page"' : ''}>
                        <span data-en="${item.en}">${item.label}</span>
                    </a>
                </li>`;
        }).join('');

        headerHost.innerHTML = `
            <a class="skip-link" href="#mainContent" data-en="Skip to main content">Pular para o conteúdo principal</a>
            <nav class="navbar" aria-label="Navegação principal" data-en-aria-label="Main navigation">
                <div class="container">
                    <a href="index.html" class="logo" aria-label="Página inicial de Gabriel Conci" data-en-aria-label="Gabriel Conci home page">
                        <span class="logo-mark" aria-hidden="true">GC</span>
                        <span>Gabriel Conci</span>
                    </a>
                    <ul class="nav-links" id="navLinks">${links}</ul>
                    <div class="nav-actions" aria-label="Controles de interface" data-en-aria-label="Interface controls">
                        <button class="language-toggle" id="languageToggle" type="button" aria-label="Mudar idioma para inglês" title="Mudar idioma para inglês" aria-pressed="true" data-language-switch="true" data-language="pt">
                            <span class="language-toggle__option" data-lang-label="pt">PT</span>
                            <span class="language-toggle__divider" aria-hidden="true"></span>
                            <span class="language-toggle__option" data-lang-label="en">EN</span>
                        </button>
                        <button class="menu-toggle" id="menuToggle" type="button" aria-label="Abrir menu de navegação" aria-expanded="false" aria-controls="navLinks">
                            <span></span><span></span><span></span>
                        </button>
                    </div>
                </div>
            </nav>`;
    }

    if (footerHost) {
        footerHost.innerHTML = `
            <footer class="footer">
                <div class="container footer-grid">
                    <div>
                        <a href="index.html" class="footer-brand">Gabriel Conci</a>
                        <p data-en="Technology, clarity and useful experiences.">Tecnologia, clareza e experiências úteis.</p>
                    </div>
                    <div class="footer-social" aria-label="Redes sociais" data-en-aria-label="Social networks">
                        <a href="https://github.com/3Gb3" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i class="fab fa-github"></i></a>
                        <a href="https://www.linkedin.com/in/gabriel-schwingel-conci-a0528a344/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
                        <a href="https://www.instagram.com/gbsconci/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                    </div>
                    <p class="footer-copy">&copy; <span id="currentYear">2026</span> Gabriel Schwingel Conci. <span data-en="All rights reserved.">Todos os direitos reservados.</span></p>
                </div>
            </footer>
            <button id="scrollTop" class="scroll-top" type="button" aria-label="Voltar ao topo" title="Voltar ao topo"><i class="fas fa-arrow-up"></i></button>
            <a href="https://wa.me/5551994464827" target="_blank" rel="noopener noreferrer" class="whatsapp-button" title="Fale comigo no WhatsApp" aria-label="Fale comigo no WhatsApp"><i class="fab fa-whatsapp"></i></a>`;
    }
})();

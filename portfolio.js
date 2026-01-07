// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Verifica preferência salva ou preferência do sistema
const currentTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

html.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Tratamento de imagens de projetos que não carregarem
document.addEventListener('DOMContentLoaded', () => {
    const projectImages = document.querySelectorAll('.project-image img');
    
    projectImages.forEach(img => {
        // Verifica se a imagem carregou
        img.addEventListener('error', function() {
            const projectCard = this.closest('.project-card');
            const projectTitle = projectCard.querySelector('.project-info h3').textContent;
            const projectImageDiv = this.parentElement;
            
            // Remove a imagem
            this.remove();
            
            // Cria o placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'project-placeholder';
            placeholder.textContent = projectTitle;
            
            // Adiciona o placeholder
            projectImageDiv.appendChild(placeholder);
        });
        
        // Força a verificação para imagens que já falharam
        if (!img.complete || img.naturalHeight === 0) {
            img.dispatchEvent(new Event('error'));
        }
    });
});

// Navegação suave e menu mobile
const navLinks = document.querySelectorAll('.nav-link');
const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');

// Menu mobile toggle
menuToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
});

// Navegação suave e destaque do link ativo
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Remove active de todos os links
        navLinks.forEach(l => l.classList.remove('active'));
        // Adiciona active ao link clicado
        link.classList.add('active');
        
        // Fecha o menu mobile
        navLinksContainer.classList.remove('active');
    });
});

// Destaque do link ativo ao rolar a página
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Animação de barras de habilidades quando visíveis
const skillBars = document.querySelectorAll('.skill-progress');

const animateSkills = () => {
    skillBars.forEach(bar => {
        const barPosition = bar.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (barPosition < screenPosition) {
            bar.style.width = bar.style.width;
        }
    });
};

window.addEventListener('scroll', animateSkills);

// Botão de scroll to top
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Formulário de contato
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Pega os dados do formulário
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Desabilita o botão durante o envio
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    
    // Envia usando EmailJS
    const now = new Date();
    const timeString = now.toLocaleString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    emailjs.send("service_lm0ubti", "template_y440a0r", {
        name: name,
        email: email,
        subject: subject,
        message: message,
        time: timeString
    }).then(
        function(response) {
            alert(`Obrigado, ${name}! Sua mensagem foi enviada com sucesso. Entrarei em contato em breve!`);
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        },
        function(error) {
            alert('Erro ao enviar mensagem. Por favor, tente novamente ou entre em contato diretamente pelo email.');
            console.error('Erro EmailJS:', error);
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    );
});

// Animações ao scroll (fade in)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Adiciona animação aos elementos
const animatedElements = document.querySelectorAll('.project-card, .skill-item, .resume-item, .highlight-item');

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Efeito de digitação no título (opcional)
const typingText = document.querySelector('.title');
if (typingText) {
    const text = typingText.textContent;
    typingText.textContent = '';
    let i = 0;
    
    const typeWriter = () => {
        if (i < text.length) {
            typingText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    // Inicia após 500ms
    setTimeout(typeWriter, 500);
}

// Prevenção de envio vazio no formulário
const formInputs = contactForm.querySelectorAll('input, textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() === '' && input.hasAttribute('required')) {
            input.style.borderColor = '#e53e3e';
        } else {
            input.style.borderColor = '';
        }
    });
});

// Adiciona ano atual ao footer automaticamente
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer p');
if (footerText && footerText.textContent.includes('2025')) {
    footerText.textContent = footerText.textContent.replace('2025', currentYear);
}

console.log('Portfolio carregado com sucesso! 🚀');

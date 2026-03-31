(function () {
    const STORAGE_KEY = 'portfolioLanguage';
    const DEFAULT_LANGUAGE = 'en';
    const ATTRIBUTE_NAMES = ['placeholder', 'aria-label', 'title'];
    const META_SELECTORS = [
        'meta[name="description"]',
        'meta[property="og:title"]',
        'meta[property="og:description"]',
        'meta[property="og:locale"]',
        'meta[name="twitter:title"]',
        'meta[name="twitter:description"]'
    ];

    const PT_TO_EN_TRANSLATIONS = {
        // Common UI
        'Pular para o conteúdo principal': 'Skip to main content',
        'Portfólio': 'Portfolio',
        'Sobre': 'About',
        'Currículo': 'Resume',
        'Projetos': 'Projects',
        'Habilidades': 'Skills',
        'Contato': 'Contact',
        'Navegação principal': 'Main navigation',
        'Alternar para tema escuro': 'Switch to dark theme',
        'Alternar para tema claro': 'Switch to light theme',
        'Abrir menu de navegação': 'Open navigation menu',
        'Fechar menu de navegação': 'Close navigation menu',
        'Voltar ao topo': 'Back to top',
        'Fale comigo no WhatsApp': 'Message me on WhatsApp',
        'Carregando...': 'Loading...',
        'Abrindo projetos...': 'Opening projects...',
        'Voltando ao portfolio...': 'Back to portfolio...',
        'Todos os direitos reservados.': 'All rights reserved.',
        'Gabriel Schwingel Conci. Todos os direitos reservados.': 'Gabriel Schwingel Conci. All rights reserved.',
        '© 2026 Gabriel Schwingel Conci. Todos os direitos reservados.': '© 2026 Gabriel Schwingel Conci. All rights reserved.',
        'Voltar aos Projetos': 'Back to Projects',
        'Ver no GitHub': 'View on GitHub',

        // Head metadata
        'Gabriel Schwingel Conci | Desenvolvedor Full-Stack Júnior': 'Gabriel Schwingel Conci | Junior Full-Stack Developer',
        'Portfólio de Gabriel Schwingel Conci, desenvolvedor full-stack júnior com foco em Python, Flask, IA aplicada, bots para Discord e interfaces web responsivas.': 'Portfolio of Gabriel Schwingel Conci, a junior full-stack developer focused on Python, Flask, applied AI, Discord bots, and responsive web interfaces.',
        'Conheça meu trabalho com desenvolvimento web, automação, QA e inteligência artificial aplicada.': 'Explore my work in web development, automation, QA, and applied artificial intelligence.',
        'Portfólio com projetos e experiência em Python, Flask, QA e IA aplicada.': 'Portfolio with projects and experience in Python, Flask, QA, and applied AI.',
        'Projetos - Gabriel Schwingel Conci': 'Projects - Gabriel Schwingel Conci',
        'Catálogo completo de projetos de Gabriel Schwingel Conci com foco em desenvolvimento web, automação e soluções em Python.': 'Complete project catalog by Gabriel Schwingel Conci focused on web development, automation, and Python solutions.',
        'Projeto BNCC - Gabriel Schwingel Conci': 'BNCC Project - Gabriel Schwingel Conci',
        'Sage - Bot de Discord - Gabriel Schwingel Conci': 'Sage - Discord Bot - Gabriel Schwingel Conci',
        'Projeto Sustentabilidade Empresarial - Gabriel Schwingel Conci': 'Corporate Sustainability Project - Gabriel Schwingel Conci',
        'pt_BR': 'en_US',

        // Home section
        'Desenvolvedor Full-Stack Júnior': 'Junior Full-Stack Developer',
        'Transformo ideias em soluções digitais com foco em qualidade, performance e experiências claras para o usuário.': 'I turn ideas into digital solutions focused on quality, performance, and clear user experiences.',
        'Falar Comigo': 'Talk to Me',
        'Ver Projetos': 'View Projects',
        'Baixar Currículo': 'Download Resume',
        'Resumo profissional': 'Professional summary',
        '3 Frentes': '3 Focus Areas',
        'Web, Bots e IA aplicada': 'Web, Bots, and Applied AI',
        'Desde 2024': 'Since 2024',
        'Projetos práticos em tecnologia': 'Hands-on technology projects',
        'ADS 3º Semestre': 'Systems Analysis - 3rd Semester',
        'Evolução constante com base acadêmica': 'Constant growth with academic foundation',

        // About section
        'Sobre Mim': 'About Me',
        'Sou Gabriel Schwingel Conci, desenvolvedor full-stack júnior e estudante de Análise e Desenvolvimento de Sistemas na CESUCA. Gosto de construir soluções úteis, com código limpo e foco na experiência de quem usa.': 'I am Gabriel Schwingel Conci, a junior full-stack developer and Systems Analysis and Development student at CESUCA. I enjoy building useful solutions with clean code and a strong focus on user experience.',
        'Hoje atuo com desenvolvimento web em Python/Flask, front-end com HTML/CSS/JavaScript, automação com bots para Discord e validação de fluxos conversacionais em QA para chatbots.': 'Today I work with web development in Python/Flask, front-end with HTML/CSS/JavaScript, automation with Discord bots, and conversational flow validation in chatbot QA.',
        'Desenvolvimento de aplicações web e interfaces responsivas.': 'Development of web applications and responsive interfaces.',
        'Automação e bots personalizados para comunidades no Discord.': 'Automation and custom bots for Discord communities.',
        'Experimentos com IA local usando OLLAMA, Llama 3.1 e Whisper.': 'Experiments with local AI using OLLAMA, Llama 3.1, and Whisper.',
        'Evolução contínua por meio de projetos reais e cursos práticos.': 'Continuous growth through real projects and practical courses.',
        'Pygame, Jogos 2D': 'Pygame, 2D Games',
        'Discord, Automação': 'Discord, Automation',
        'Testes, fluxos e melhoria contínua': 'Testing, flows, and continuous improvement',

        // Resume section
        'Download Currículo (PDF)': 'Download Resume (PDF)',
        'Projetos & Experiência': 'Projects & Experience',
        'Analista de QA - Foco em Chatbot': 'QA Analyst - Chatbot Focus',
        '11/2025 - Presente': '11/2025 - Present',
        'Testes e validação de chatbots e assistentes virtuais': 'Testing and validation of chatbots and virtual assistants',
        'Garantia de qualidade em sistemas de automação de atendimento': 'Quality assurance for customer service automation systems',
        'Análise de fluxos conversacionais e interações com usuários': 'Analysis of conversational flows and user interactions',
        'Identificação e documentação de bugs e melhorias': 'Identification and documentation of bugs and improvements',
        '2024 - Presente': '2024 - Present',
        'Portfólio Pessoal': 'Personal Portfolio',
        'Desenvolvimento de aplicações web usando Python (Flask), HTML, CSS e JavaScript': 'Web application development using Python (Flask), HTML, CSS, and JavaScript',
        'Criação de jogos 2D utilizando Pygame': 'Creation of 2D games using Pygame',
        'Desenvolvimento de bots para Discord com funcionalidades personalizadas': 'Development of Discord bots with custom features',
        'Implementação de IA própria utilizando OLLAMA com modelos LLMs (Llama 3.1) e Whisper para processamento de áudio': 'Implementation of custom AI using OLLAMA with LLM models (Llama 3.1) and Whisper for audio processing',
        'Projetos voltados para educação e sustentabilidade empresarial': 'Projects focused on education and corporate sustainability',
        'Formação Acadêmica': 'Education',
        'Análise e Desenvolvimento de Sistemas': 'Systems Analysis and Development',
        '2025 - Presente (3º Semestre)': '2025 - Present (3rd Semester)',
        'Desenvolvimento de sistemas e aplicações': 'Systems and application development',
        'Programação orientada a objetos e estruturas de dados': 'Object-oriented programming and data structures',
        'Desenvolvimento web e banco de dados': 'Web development and databases',
        'Projetos práticos em Python, HTML, CSS e JavaScript': 'Hands-on projects in Python, HTML, CSS, and JavaScript',
        'Ensino Médio Completo': 'High School Diploma',
        'Certificações & Cursos': 'Certifications & Courses',
        'Python do Básico ao Avançado': 'Python from Basic to Advanced',
        '2025 - Em Andamento': '2025 - In Progress',
        'Lógica da Programação em VisualG e Python': 'Programming Logic in VisualG and Python',
        'Curso de Inglês': 'English Course',
        'Informática: Word, Excel e PowerPoint': 'Computer Skills: Word, Excel, and PowerPoint',

        // Projects section (index)
        'Projetos autorais e acadêmicos com foco em utilidade real, boa experiência e evolução técnica constante.': 'Authorial and academic projects focused on real usefulness, great experience, and constant technical growth.',
        'Ver Todos os Projetos': 'View All Projects',

        // Skills section
        'Níveis organizados por experiência prática em projetos e rotinas reais.': 'Levels organized by practical experience in projects and real workflows.',
        'Linguagens e Fundamentos': 'Languages and Fundamentals',
        'Desenvolvimento Web': 'Web Development',
        'QA e Qualidade': 'QA and Quality',
        'Bots e Automação': 'Bots and Automation',
        'Inteligência Artificial': 'Artificial Intelligence',
        'Ferramentas e Rotina': 'Tools and Workflow',
        'HTML e CSS': 'HTML and CSS',
        'Lógica com VisualG': 'Logic with VisualG',
        'Front-end responsivo': 'Responsive front-end',
        'Consumo de APIs': 'API consumption',
        'Testes funcionais': 'Functional testing',
        'Documentação de bugs': 'Bug documentation',
        'Fluxos de chatbot': 'Chatbot flows',
        'Critérios de aceite': 'Acceptance criteria',
        'Automação com Python': 'Automation with Python',
        'Comandos e eventos personalizados': 'Custom commands and events',
        'Integração de APIs em bots': 'API integration in bots',
        'OLLAMA e LLMs locais': 'OLLAMA and local LLMs',
        'Llama 3.1 em cenários locais': 'Llama 3.1 in local scenarios',
        'Whisper para áudio': 'Whisper for audio',
        'Orquestração de fluxos de IA': 'AI workflow orchestration',
        'Git e GitHub': 'Git and GitHub',
        'Organização de entregas': 'Delivery organization',
        'Em evolução': 'In progress',
        'Base': 'Basic',
        'Intermediário': 'Intermediate',
        'Forte': 'Strong',
        'Aplicação:': 'Application:',
        'projetos acadêmicos e autorais com foco em resolução de problemas reais.': 'academic and personal projects focused on solving real-world problems.',
        'interfaces para portfólio, páginas de produto e fluxos integrados com APIs.': 'interfaces for portfolio pages, product pages, and API-integrated flows.',
        'atuação em validação de experiências conversacionais com foco no usuário final.': 'experience validating conversational experiences focused on the end user.',
        'bots para comunidades com recursos de moderação, utilidade e automação.': 'bots for communities with moderation, utility, and automation features.',
        'experimentação de assistentes locais e automação de tarefas com IA.': 'experimentation with local assistants and task automation with AI.',
        'rotina de estudos, documentação de tarefas e evolução contínua do portfólio.': 'study routine, task documentation, and continuous portfolio evolution.',

        // Contact section
        'Vamos Conversar!': "Let's Talk!",
        'Estou aberto a oportunidades júnior, projetos colaborativos e conversas sobre web, automação e IA aplicada.': 'I am open to junior opportunities, collaborative projects, and conversations about web, automation, and applied AI.',
        'Nome': 'Name',
        'Seu nome': 'Your name',
        'Assunto': 'Subject',
        'Assunto da mensagem': 'Message subject',
        'Mensagem': 'Message',
        'Como posso te ajudar?': 'How can I help you?',
        'Retorno por e-mail em até 2 dias úteis.': 'I reply by email within 2 business days.',
        'Empresa': 'Company',
        'Enviar Mensagem': 'Send Message',

        // Projects page
        'Portfólio em destaque': 'Portfolio Highlights',
        'Projetos construídos para gerar resultado real': 'Projects built to deliver real results',
        'Explore por tecnologia e categoria para encontrar rápido o tipo de solução que você quer analisar.': 'Explore by technology and category to quickly find the type of solution you want to review.',
        'Projetos publicados': 'Published projects',
        'Frentes principais: Web, Educação e Automação': 'Main tracks: Web, Education, and Automation',
        'Projetos com demonstração navegável': 'Projects with live walkthroughs',
        'Ferramentas de organização dos projetos': 'Project organization tools',
        'Buscar projeto': 'Search project',
        'Buscar por nome, tecnologia ou categoria': 'Search by name, technology, or category',
        'Filtrar projetos': 'Filter projects',
        'Todos': 'All',
        'Educação': 'Education',
        'Automação': 'Automation',
        'Mostrando 5 de 5 projetos': 'Showing 5 of 5 projects',
        'Abrir projeto Code Logic': 'Open Code Logic project',
        'Abrir Projeto BNCC': 'Open BNCC project',
        'Abrir projeto PurplePlay': 'Open PurplePlay project',
        'Abrir projeto Sustentabilidade Empresarial': 'Open Corporate Sustainability project',
        'Abrir projeto Sage bot para Discord': 'Open Sage Discord bot project',
        'Web App': 'Web App',
        'Aplicação web em Flask para apoiar o ensino de lógica de programação com experiência didática.': 'Flask web application designed to support programming logic education with a teaching-focused experience.',
        'Explorar projeto': 'Explore project',
        'Projeto BNCC': 'BNCC Project',
        'Aplicação educativa desenvolvida em Python com Pygame para aprendizado interativo.': 'Educational application developed in Python with Pygame for interactive learning.',
        'Front-end': 'Front-end',
        'Plataforma web de entretenimento com foco em interface, navegação fluida e experiência moderna.': 'Web entertainment platform focused on interface, smooth navigation, and modern experience.',
        'Institucional': 'Institutional',
        'Sustentabilidade Empresarial': 'Corporate Sustainability',
        'Site institucional com comunicação clara sobre práticas de sustentabilidade e impacto corporativo.': 'Institutional website with clear communication about sustainability practices and corporate impact.',
        'Sage - Bot de Discord': 'Sage - Discord Bot',
        'Bot multifuncional em Python com comandos personalizados para automação e gestão de comunidades.': 'Multifunctional Python bot with custom commands for automation and community management.',
        'Nenhum projeto encontrado': 'No projects found',
        'Tente outro termo de busca ou limpe os filtros para visualizar todos os projetos novamente.': 'Try another search term or clear the filters to view all projects again.',
        'Limpar filtros': 'Clear filters',

        // Code Logic details
        'Sobre o Projeto': 'About the Project',
        'Funcionalidades': 'Features',
        'Tecnologias Utilizadas': 'Technologies Used',
        'Objetivos do Projeto': 'Project Goals',
        'Code Logic é uma aplicação web desenvolvida com Flask destinada ao ensino de lógica de programação. O projeto utiliza Firebase para gerenciamento de banco de dados e implementa um sistema de Inteligência Artificial que analisa as respostas dos alunos, decidindo se eles podem avançar para a próxima aula e auxiliando-os a resolver os exercícios de forma personalizada.': 'Code Logic is a web application developed with Flask to teach programming logic. The project uses Firebase for database management and implements an Artificial Intelligence system that analyzes students\' answers, deciding whether they can progress to the next lesson and helping them solve exercises in a personalized way.',
        'Sistema de IA que avalia respostas e fornece feedback personalizado': 'AI system that evaluates answers and provides personalized feedback',
        'Integração com Firebase para armazenamento de dados dos usuários': 'Firebase integration for storing user data',
        'Sistema de progressão de aulas baseado em desempenho': 'Performance-based lesson progression system',
        'Interface interativa para aprendizado de lógica de programação': 'Interactive interface for learning programming logic',
        'Exercícios práticos com auxílio inteligente': 'Practical exercises with smart assistance',
        'Design responsivo e moderno': 'Responsive and modern design',
        'Banco de Dados:': 'Database:',
        'IA:': 'AI:',
        'Sistema de análise de respostas com IA': 'AI-powered answer analysis system',
        'Design:': 'Design:',
        'Interface responsiva e amigável': 'Responsive and user-friendly interface',
        'O principal objetivo do Code Logic é tornar o aprendizado de lógica de programação mais acessível e didático através do uso de Inteligência Artificial. O sistema analisa as respostas dos alunos e oferece suporte personalizado, permitindo que cada estudante aprenda no seu próprio ritmo com feedback inteligente e contextualizado.': 'The main goal of Code Logic is to make learning programming logic more accessible and educational through Artificial Intelligence. The system analyzes student answers and offers personalized support, allowing each student to learn at their own pace with intelligent, contextual feedback.',

        // BNCC details
        'Processamento de PDF': 'PDF Processing',
        'O Projeto BNCC é uma aplicação desenvolvida em Python utilizando a biblioteca Tkinter para interface gráfica. A ferramenta foi criada para auxiliar educadores na identificação de códigos da Base Nacional Comum Curricular (BNCC). O sistema realiza a leitura completa de arquivos PDF, procura por códigos da BNCC e retorna os códigos encontrados junto com seus respectivos significados. Este projeto foi desenvolvido especialmente para auxiliar no planejamento educacional e organização de conteúdos pedagógicos.': 'The BNCC Project is an application developed in Python using the Tkinter library for its graphical interface. The tool was created to help educators identify codes from Brazil\'s National Common Core Curriculum (BNCC). The system fully reads PDF files, searches for BNCC codes, and returns the codes found along with their meanings. This project was developed specifically to support educational planning and pedagogical content organization.',
        'Leitura e processamento completo de arquivos PDF': 'Full reading and processing of PDF files',
        'Busca automática por códigos da BNCC no documento': 'Automatic search for BNCC codes in the document',
        'Exibição dos códigos encontrados com seus significados': 'Display of found codes with their meanings',
        'Interface gráfica intuitiva desenvolvida com Tkinter': 'Intuitive graphical interface developed with Tkinter',
        'Sistema de análise rápida e eficiente': 'Fast and efficient analysis system',
        'Facilita o trabalho de planejamento pedagógico': 'Supports pedagogical planning work',
        'Linguagem:': 'Language:',
        'Interface Gráfica:': 'Graphical Interface:',
        'Processamento:': 'Processing:',
        'Bibliotecas de leitura e análise de PDF': 'PDF reading and analysis libraries',
        'Foco:': 'Focus:',
        'Educação e automação de processos pedagógicos': 'Education and automation of pedagogical processes',
        'O objetivo principal foi criar uma ferramenta prática que facilitasse o trabalho de identificação e organização dos códigos da BNCC em documentos educacionais. O projeto surgiu de uma necessidade real no contexto educacional, tornando mais ágil o processo de planejamento e alinhamento de conteúdos com as diretrizes da Base Nacional Comum Curricular.': 'The main objective was to create a practical tool to simplify identifying and organizing BNCC codes in educational documents. The project came from a real educational need, making planning and content alignment with BNCC guidelines faster and easier.',

        // PurplePlay details
        'PurplePlay é uma plataforma web de gerenciamento de fila de filmes desenvolvida com HTML, CSS e JavaScript puro, integrada com Firebase para banco de dados. Este foi meu primeiro site criado para a faculdade, onde os usuários podem explorar diferentes categorias de filmes, selecionar títulos de interesse, assistir trailers e adicionar filmes à sua fila pessoal de entretenimento.': 'PurplePlay is a web platform for movie queue management built with pure HTML, CSS, and JavaScript, integrated with Firebase for database support. This was my first website created for college, where users can explore movie categories, select titles of interest, watch trailers, and add films to their personal entertainment queue.',
        'Sistema de categorias de filmes organizadas': 'Organized movie category system',
        'Visualização de trailers integrada': 'Integrated trailer viewing',
        'Fila personalizada de filmes para assistir': 'Personalized watchlist queue',
        'Interface moderna e responsiva': 'Modern and responsive interface',
        'Navegação fluida e intuitiva entre categorias': 'Smooth and intuitive navigation between categories',
        'Sistema de seleção e gerenciamento de filmes': 'Movie selection and management system',
        'Frontend:': 'Frontend:',
        'Banco de Dados:': 'Database:',
        'Layout responsivo e moderno': 'Responsive and modern layout',
        'Interatividade:': 'Interactivity:',
        'JavaScript puro sem frameworks': 'Vanilla JavaScript without frameworks',
        'Como meu primeiro projeto para a faculdade, o PurplePlay foi desenvolvido para demonstrar o domínio de tecnologias web fundamentais e a capacidade de criar uma aplicação funcional e completa. O sistema de fila de filmes permite que os usuários organizem seu entretenimento de forma prática, enquanto a integração com Firebase garante a persistência dos dados entre sessões.': 'As my first college project, PurplePlay was developed to demonstrate mastery of core web technologies and the ability to build a complete functional application. The movie queue system allows users to organize their entertainment in a practical way, while Firebase integration ensures data persistence across sessions.',

        // Sage details
        'Sage é um bot de Discord desenvolvido em Python para o meu servidor pessoal. O bot foi criado para adicionar funcionalidades divertidas e úteis ao servidor, incluindo reprodução de músicas, exibição de memes, comando de ship para entretenimento dos membros, entre outras tarefas personalizadas. Foi desenvolvido utilizando Python, a biblioteca discord.py e integrações complementares.': 'Sage is a Discord bot developed in Python for my personal server. The bot was built to add useful and fun features to the server, including music playback, meme display, a ship command for member entertainment, and other custom tasks. It was developed using Python, the discord.py library, and complementary integrations.',
        'Sistema de reprodução de música no servidor': 'Server music playback system',
        'Comando para exibir memes aleatórios': 'Command to show random memes',
        'Comando SHIP para combinações divertidas entre membros': 'SHIP command for fun member pairings',
        'Comandos personalizados para entretenimento': 'Custom entertainment commands',
        'Automação de tarefas no servidor Discord': 'Task automation on the Discord server',
        'Interface de comandos simples e intuitiva': 'Simple and intuitive command interface',
        'Bibliotecas:': 'Libraries:',
        'Discord.py e bibliotecas de integração': 'Discord.py and integration libraries',
        'Entretenimento e automação para comunidades Discord': 'Entertainment and automation for Discord communities',
        'O objetivo do Sage é proporcionar entretenimento e funcionalidades úteis para o meu servidor Discord pessoal. O bot foi desenvolvido com foco em criar uma experiência mais dinâmica e divertida para os membros da comunidade, oferecendo recursos de música, memes e interações sociais através de comandos simples e personalizados.': 'Sage\'s goal is to provide entertainment and useful features for my personal Discord server. The bot was developed to create a more dynamic and fun experience for community members, offering music, memes, and social interactions through simple custom commands.',
        'Status do Projeto': 'Project Status',
        'Bot ativo no servidor pessoal': 'Bot active on personal server',

        // Sustainability details
        'Projeto Sustentabilidade Empresarial': 'Corporate Sustainability Project',
        'O Projeto Sustentabilidade Empresarial é um site desenvolvido para a faculdade com base em uma empresa real chamada América Ambiental. Após realizar uma entrevista sobre um projeto social da empresa, criei este site institucional para apresentar as práticas sustentáveis e iniciativas ambientais da organização. O projeto demonstra como empresas podem integrar responsabilidade social e ambiental em suas operações.': 'The Corporate Sustainability Project is a website developed for college based on a real company called América Ambiental. After interviewing the company about one of its social projects, I created this institutional website to present the organization\'s sustainable practices and environmental initiatives. The project shows how companies can integrate social and environmental responsibility into their operations.',
        'Apresentação do projeto social da América Ambiental': 'Presentation of América Ambiental\'s social project',
        'Interface institucional limpa e profissional': 'Clean and professional institutional interface',
        'Conteúdo informativo sobre sustentabilidade empresarial': 'Informative content about corporate sustainability',
        'Design responsivo e acessível': 'Responsive and accessible design',
        'Navegação intuitiva e organizada': 'Intuitive and organized navigation',
        'Informações baseadas em entrevista real com a empresa': 'Information based on a real interview with the company',
        'Layout institucional e responsivo': 'Institutional and responsive layout',
        'Sustentabilidade e consciência ambiental': 'Sustainability and environmental awareness',
        'Como trabalho acadêmico, o objetivo foi criar uma plataforma web que apresentasse de forma clara e profissional o projeto social da América Ambiental. O site serve como vitrine digital das práticas sustentáveis da empresa, demonstrando como a tecnologia web pode ser utilizada para promover conscientização sobre responsabilidade ambiental e social corporativa.': 'As an academic project, the objective was to create a web platform that clearly and professionally presented América Ambiental\'s social project. The site works as a digital showcase for the company\'s sustainable practices, demonstrating how web technology can promote awareness of corporate environmental and social responsibility.'
    };

    const MESSAGE_CATALOG = {
        en: {
            'nav.openMenu': 'Open navigation menu',
            'nav.closeMenu': 'Close navigation menu',
            'theme.toDark': 'Switch to dark theme',
            'theme.toLight': 'Switch to light theme',
            'transition.loading': 'Loading...',
            'transition.openProjects': 'Opening projects...',
            'transition.backToPortfolio': 'Back to portfolio...',
            'form.blocked': 'Could not send. Refresh the page and try again.',
            'form.reviewRequired': 'Please review the required fields before sending.',
            'form.cooldown': 'Wait a few seconds before sending another message.',
            'form.sending': 'Sending message...',
            'form.success': 'Message sent successfully. Thank you for reaching out!',
            'form.failed': 'Could not send right now. Try again shortly or use direct email.',
            'form.buttonSending': 'Sending...',
            'form.emailjsUnavailable': 'EmailJS unavailable',
            'projects.results': ({ visible, total }) => `Showing ${visible} of ${total} projects`
        },
        pt: {
            'nav.openMenu': 'Abrir menu de navegação',
            'nav.closeMenu': 'Fechar menu de navegação',
            'theme.toDark': 'Alternar para tema escuro',
            'theme.toLight': 'Alternar para tema claro',
            'transition.loading': 'Carregando...',
            'transition.openProjects': 'Abrindo projetos...',
            'transition.backToPortfolio': 'Voltando ao portfolio...',
            'form.blocked': 'Não foi possível enviar. Atualize a página e tente novamente.',
            'form.reviewRequired': 'Revise os campos obrigatórios antes de enviar.',
            'form.cooldown': 'Aguarde alguns segundos antes de enviar uma nova mensagem.',
            'form.sending': 'Enviando mensagem...',
            'form.success': 'Mensagem enviada com sucesso. Obrigado pelo contato!',
            'form.failed': 'Não foi possível enviar agora. Tente novamente em instantes ou use o e-mail direto.',
            'form.buttonSending': 'Enviando...',
            'form.emailjsUnavailable': 'EmailJS não disponível',
            'projects.results': ({ visible, total }) => `Mostrando ${visible} de ${total} projetos`
        }
    };

    const state = {
        currentLanguage: DEFAULT_LANGUAGE,
        originalTitle: '',
        textEntries: [],
        attributeEntries: [],
        metaEntries: [],
        normalizedPtToEn: buildTranslationLookup(PT_TO_EN_TRANSLATIONS)
    };

    function normalizeValue(value) {
        return String(value || '').replace(/\s+/g, ' ').trim();
    }

    function buildTranslationLookup(dictionary) {
        const lookup = new Map();

        Object.entries(dictionary).forEach(([ptText, enText]) => {
            lookup.set(normalizeValue(ptText), enText);
        });

        return lookup;
    }

    function resolveLanguage(language) {
        return language === 'pt' ? 'pt' : 'en';
    }

    function translateFromPortuguese(value) {
        const normalized = normalizeValue(value);
        if (!normalized) {
            return value;
        }

        return state.normalizedPtToEn.get(normalized) || value;
    }

    function translateTextNodeFromOriginal(originalText) {
        const normalized = normalizeValue(originalText);
        const translated = state.normalizedPtToEn.get(normalized);

        if (!translated) {
            return originalText;
        }

        const leadingMatch = originalText.match(/^\s*/);
        const trailingMatch = originalText.match(/\s*$/);
        const leadingWhitespace = leadingMatch ? leadingMatch[0] : '';
        const trailingWhitespace = trailingMatch ? trailingMatch[0] : '';

        return `${leadingWhitespace}${translated}${trailingWhitespace}`;
    }

    function captureTextEntries() {
        if (!document.body) {
            return;
        }

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    if (!node || !node.textContent || !node.textContent.trim()) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    const parent = node.parentElement;
                    if (!parent) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    const blockedTagNames = ['SCRIPT', 'STYLE', 'NOSCRIPT'];
                    if (blockedTagNames.includes(parent.tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const entries = [];
        let currentNode = walker.nextNode();

        while (currentNode) {
            entries.push({
                node: currentNode,
                original: currentNode.textContent
            });

            currentNode = walker.nextNode();
        }

        state.textEntries = entries;
    }

    function captureAttributeEntries() {
        if (!document.body) {
            return;
        }

        const elements = document.body.querySelectorAll('*');
        const entries = [];

        elements.forEach((element) => {
            ATTRIBUTE_NAMES.forEach((attributeName) => {
                if (!element.hasAttribute(attributeName)) {
                    return;
                }

                entries.push({
                    element,
                    attributeName,
                    original: element.getAttribute(attributeName)
                });
            });
        });

        state.attributeEntries = entries;
    }

    function captureMetaEntries() {
        const entries = [];

        META_SELECTORS.forEach((selector) => {
            const element = document.querySelector(selector);
            if (!element || !element.hasAttribute('content')) {
                return;
            }

            entries.push({
                element,
                original: element.getAttribute('content')
            });
        });

        state.metaEntries = entries;
    }

    function restorePortugueseContent() {
        document.title = state.originalTitle;

        state.textEntries.forEach((entry) => {
            entry.node.textContent = entry.original;
        });

        state.attributeEntries.forEach((entry) => {
            entry.element.setAttribute(entry.attributeName, entry.original);
        });

        state.metaEntries.forEach((entry) => {
            entry.element.setAttribute('content', entry.original);
        });
    }

    function applyEnglishContent() {
        document.title = translateFromPortuguese(state.originalTitle);

        state.textEntries.forEach((entry) => {
            entry.node.textContent = translateTextNodeFromOriginal(entry.original);
        });

        state.attributeEntries.forEach((entry) => {
            entry.element.setAttribute(entry.attributeName, translateFromPortuguese(entry.original));
        });

        state.metaEntries.forEach((entry) => {
            entry.element.setAttribute('content', translateFromPortuguese(entry.original));
        });
    }

    function updateDocumentLanguage(language) {
        document.documentElement.setAttribute('lang', language === 'en' ? 'en' : 'pt-BR');
    }

    function updateLanguageToggleButton() {
        const languageToggleButton = document.getElementById('languageToggle');
        if (!languageToggleButton) {
            return;
        }

        const isEnglish = state.currentLanguage === 'en';
        const label = isEnglish ? 'EN' : 'PT';
        const switchMessage = isEnglish ? 'Switch language to Portuguese' : 'Mudar idioma para inglês';

        languageToggleButton.textContent = label;
        languageToggleButton.setAttribute('aria-label', switchMessage);
        languageToggleButton.setAttribute('title', switchMessage);
        languageToggleButton.setAttribute('aria-pressed', String(!isEnglish));
    }

    function emitLanguageChangedEvent() {
        window.dispatchEvent(
            new CustomEvent('siteLanguageChanged', {
                detail: {
                    language: state.currentLanguage
                }
            })
        );
    }

    function applyLanguage(language, options = {}) {
        const resolvedLanguage = resolveLanguage(language);
        const shouldPersist = options.persist !== false;
        const shouldEmitEvent = options.emitEvent !== false;

        state.currentLanguage = resolvedLanguage;

        if (resolvedLanguage === 'en') {
            applyEnglishContent();
        } else {
            restorePortugueseContent();
        }

        updateDocumentLanguage(resolvedLanguage);
        updateLanguageToggleButton();

        if (shouldPersist) {
            localStorage.setItem(STORAGE_KEY, resolvedLanguage);
        }

        if (shouldEmitEvent) {
            emitLanguageChangedEvent();
        }
    }

    function initializeLanguageToggleButton() {
        const languageToggleButton = document.getElementById('languageToggle');
        if (!languageToggleButton) {
            return;
        }

        languageToggleButton.addEventListener('click', () => {
            const nextLanguage = state.currentLanguage === 'en' ? 'pt' : 'en';
            applyLanguage(nextLanguage);
        });
    }

    function interpolate(template, params = {}) {
        return String(template).replace(/\{\{\s*(\w+)\s*\}\}/g, (_match, key) => {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
                return String(params[key]);
            }

            return '';
        });
    }

    function t(key, params = {}, fallback = '') {
        const languageCatalog = MESSAGE_CATALOG[state.currentLanguage] || MESSAGE_CATALOG.pt;
        const fallbackCatalog = MESSAGE_CATALOG.pt;

        const value = languageCatalog[key] || fallbackCatalog[key];

        if (typeof value === 'function') {
            return value(params || {});
        }

        if (typeof value === 'string') {
            return interpolate(value, params || {});
        }

        return fallback || '';
    }

    function initialize() {
        state.originalTitle = document.title;
        captureTextEntries();
        captureAttributeEntries();
        captureMetaEntries();

        initializeLanguageToggleButton();

        const storedLanguage = localStorage.getItem(STORAGE_KEY);
        const preferredLanguage = resolveLanguage(storedLanguage || DEFAULT_LANGUAGE);
        applyLanguage(preferredLanguage, { persist: false, emitEvent: false });
    }

    window.siteLanguage = {
        applyLanguage,
        getCurrentLanguage: () => state.currentLanguage,
        t
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }
})();

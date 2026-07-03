(function () {
    const STORAGE_KEY = 'selectedLanguage';
    const DEFAULT_LANGUAGE = 'pt';
    const ATTRIBUTE_NAMES = ['placeholder', 'aria-label', 'title', 'alt'];
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
        'Site profissional': 'Professional website',
        'Sobre': 'About',
        'Currículo': 'Resume',
        'Projetos': 'Projects',
        'Habilidades': 'Skills',
        'Início': 'Home',
        'Experiência': 'Experience',
        'Certificações': 'Certifications',
        'Fale comigo': 'Contact',
        'Contato': 'Contact',
        'Navegação principal': 'Main navigation',
        'Controles de interface': 'Interface controls',
        'Alternar para tema escuro': 'Switch to dark theme',
        'Alternar para tema claro': 'Switch to light theme',
        'Abrir menu de navegação': 'Open navigation menu',
        'Fechar menu de navegação': 'Close navigation menu',
        'Voltar ao topo': 'Back to top',
        'Fale comigo no WhatsApp': 'Message me on WhatsApp',
        'Carregando...': 'Loading...',
        'Abrindo projetos...': 'Opening projects...',
        'Voltando ao site...': 'Back to the site...',
        'Todos os direitos reservados.': 'All rights reserved.',
        'Gabriel Schwingel Conci. Todos os direitos reservados.': 'Gabriel Schwingel Conci. All rights reserved.',
        '© 2026 Gabriel Schwingel Conci. Todos os direitos reservados.': '© 2026 Gabriel Schwingel Conci. All rights reserved.',
        'Voltar aos Projetos': 'Back to Projects',
        'Ver no GitHub': 'View on GitHub',

        // Head metadata
        'Gabriel Schwingel Conci | Desenvolvedor Full-Stack': 'Gabriel Schwingel Conci | Full-Stack Developer',
        'Site profissional de Gabriel Schwingel Conci, desenvolvedor full-stack com foco em Python, Flask, IA aplicada, bots para Discord e interfaces web responsivas.': 'Professional website of Gabriel Schwingel Conci, a full-stack developer focused on Python, Flask, applied AI, Discord bots, and responsive web interfaces.',
        'Conheça meu trabalho com desenvolvimento web, automação, QA e inteligência artificial aplicada.': 'Explore my work in web development, automation, QA, and applied artificial intelligence.',
        'Site profissional com projetos e experiência em Python, Flask, QA e IA aplicada.': 'Professional website featuring projects and experience in Python, Flask, QA, and applied AI.',
        'Site profissional de Gabriel Schwingel Conci, desenvolvedor full-stack com foco em automação, Python, FastAPI, chatbots e inteligência artificial aplicada.': 'Professional website of Gabriel Schwingel Conci, a full-stack developer focused on automation, Python, FastAPI, chatbots, and applied artificial intelligence.',
        'Experiência profissional, projetos e tecnologias de Gabriel Schwingel Conci.': 'Professional experience, projects, and technologies of Gabriel Schwingel Conci.',
        'Projetos - Gabriel Schwingel Conci': 'Projects - Gabriel Schwingel Conci',
        'Experiência | Gabriel Schwingel Conci': 'Experience | Gabriel Schwingel Conci',
        'Habilidades | Gabriel Schwingel Conci': 'Skills | Gabriel Schwingel Conci',
        'Certificações | Gabriel Schwingel Conci': 'Certifications | Gabriel Schwingel Conci',
        'Contato | Gabriel Schwingel Conci': 'Contact | Gabriel Schwingel Conci',
        'Trajetória profissional de Gabriel Schwingel Conci em Business Tech, automação, inteligência artificial, QA e desenvolvimento full-stack.': 'Gabriel Schwingel Conci professional journey in Business Tech, automation, artificial intelligence, QA, and full-stack development.',
        'Habilidades técnicas de Gabriel Schwingel Conci em desenvolvimento, automação, inteligência artificial, dados e infraestrutura.': 'Gabriel Schwingel Conci technical skills in development, automation, artificial intelligence, data, and infrastructure.',
        'Cursos, formações complementares e aprendizado contínuo de Gabriel Schwingel Conci.': 'Courses, complementary education, and continuous learning by Gabriel Schwingel Conci.',
        'Entre em contato com Gabriel Schwingel Conci para oportunidades, projetos e conversas sobre desenvolvimento, automação e inteligência artificial.': 'Contact Gabriel Schwingel Conci about opportunities, projects, development, automation, and artificial intelligence.',
        'Catálogo completo de projetos de Gabriel Schwingel Conci com foco em desenvolvimento web, automação e soluções em Python.': 'Complete project catalog by Gabriel Schwingel Conci focused on web development, automation, and Python solutions.',
        'Projeto BNCC - Gabriel Schwingel Conci': 'BNCC Project - Gabriel Schwingel Conci',
        'Sage - Bot de Discord - Gabriel Schwingel Conci': 'Sage - Discord Bot - Gabriel Schwingel Conci',
        'Projeto Sustentabilidade Empresarial - Gabriel Schwingel Conci': 'Corporate Sustainability Project - Gabriel Schwingel Conci',
        'pt_BR': 'en_US',

        // Home section
        'Desenvolvedor Full-Stack': 'Full-Stack Developer',
        'Desenvolvedor Full-Stack | Automação e IA': 'Full-Stack Developer | Automation and AI',
        'Desenvolvo automações, chatbots, APIs e integrações com inteligência artificial para conectar clientes e empresas.': 'I build automations, chatbots, APIs, and AI-powered integrations to connect customers and companies.',
        'Transformo ideias em soluções digitais com foco em qualidade, performance e experiências claras para o usuário.': 'I turn ideas into digital solutions focused on quality, performance, and clear user experiences.',
        'Falar Comigo': 'Talk to Me',
        'Ver Projetos': 'View Projects',
        'Baixar Currículo': 'Download Resume',
        'Resumo profissional': 'Professional summary',
        '3 Frentes': '3 Focus Areas',
        'Web, Bots e IA aplicada': 'Web, Bots, and Applied AI',
        'Desde 2024': 'Since 2024',
        'Projetos práticos em tecnologia': 'Hands-on technology projects',
        'ADS 4º Semestre': 'Systems Analysis - 4th Semester',
        'Evolução constante com base acadêmica': 'Constant growth with academic foundation',
        'Business Tech + QQTech': 'Business Tech + QQTech',
        'Automação e IA na Quero-Quero': 'Automation and AI at Quero-Quero',
        'Python & FastAPI': 'Python & FastAPI',
        'Serviços, APIs e integrações': 'Services, APIs, and Integrations',
        'QA + Desenvolvimento': 'QA + Development',
        'Qualidade do fluxo à entrega': 'Quality from workflow to delivery',

        // About section
        'Sobre Mim': 'About Me',
        'Sou Gabriel Schwingel Conci, desenvolvedor full-stack e estudante de Análise e Desenvolvimento de Sistemas na CESUCA. Gosto de construir soluções úteis, com código limpo e foco na experiência de quem usa.': 'I am Gabriel Schwingel Conci, a full-stack developer and Systems Analysis and Development student at CESUCA. I enjoy building useful solutions with clean code and a strong focus on user experience.',
        'Sou Gabriel Schwingel Conci, desenvolvedor full-stack com foco em automações, integrações e inteligência artificial aplicada. Gosto de construir soluções úteis, com código organizado e atenção à experiência de quem usa.': 'I am Gabriel Schwingel Conci, a full-stack developer focused on automation, integrations, and applied artificial intelligence. I enjoy building useful solutions with organized code and attention to user experience.',
        'Hoje atuo nas frentes de Business Tech e QQTech da Quero-Quero, trabalhando com ChatGraph, RabbitMQ, DBeaver, PostgreSQL e Docker Desktop.': 'Today I work in Quero-Quero\'s Business Tech and QQTech teams, using ChatGraph, RabbitMQ, DBeaver, PostgreSQL, and Docker Desktop.',
        'Hoje atuo no Business Tech da Quero-Quero, um time focado no desenvolvimento de automações, chatbots e soluções de IA que conectam clientes e empresa em fluxos de atendimento personalizados.': 'Today I work on Quero-Quero\'s Business Tech team, focused on developing automations, chatbots, and AI solutions that connect customers and the company through personalized service flows.',
        'Hoje atuo no Business Tech + QQTech da Quero-Quero, em um time focado no desenvolvimento de automações, chatbots e soluções de IA que conectam clientes e empresa em fluxos de atendimento personalizados.': 'Today I work in Business Tech + QQTech at Quero-Quero, on a team focused on developing automations, chatbots, and AI solutions that connect customers and the company through personalized service flows.',
        'Automações de atendimento nos fluxos cliente → empresa e empresa → cliente.': 'Customer service automations for customer → company and company → customer flows.',
        'Integrações com ChatGraph, RabbitMQ e OpenRouter para experiências com IA.': 'Integrations with ChatGraph, RabbitMQ, and OpenRouter for AI-powered experiences.',
        'Desenvolvimento com Python e FastAPI, além de PostgreSQL para dados.': 'Development with Python and FastAPI, with PostgreSQL for data.',
        'Rotina técnica com WSL, WinSCP, DBeaver e Docker Desktop; Node.js em aprendizado.': 'Technical workflow with WSL, WinSCP, DBeaver, and Docker Desktop; currently learning Node.js.',
        'IA Aplicada': 'Applied AI',
        'OpenRouter, atendimento': 'OpenRouter, customer service',
        'Automações': 'Automations',
        'Back-end': 'Back End',
        'Python, FastAPI, Node.js': 'Python, FastAPI, Node.js',
        'Desenvolvimento de aplicações web e interfaces responsivas.': 'Development of web applications and responsive interfaces.',
        'Automação e bots personalizados para comunidades no Discord.': 'Automation and custom bots for Discord communities.',
        'Experimentos com IA local usando OLLAMA, Llama 3.1 e Whisper.': 'Experiments with local AI using OLLAMA, Llama 3.1, and Whisper.',
        'Evolução contínua por meio de projetos reais e cursos práticos.': 'Continuous growth through real projects and practical courses.',
        'Pygame, Jogos 2D': 'Pygame, 2D Games',
        'Discord, Automação': 'Discord, Automation',
        'QQTech, dados e integrações': 'QQTech, data, and integrations',

        // Resume section
        'Download Currículo (PDF)': 'Download Resume (PDF)',
        'Projetos & Experiência': 'Projects & Experience',
        'Experiência Profissional': 'Professional Experience',
        'Desenvolvimento Autoral': 'Independent Development',
        '05/2026 - Presente': '05/2026 - Present',
        'Atuação nas frentes de Business Tech e QQTech': 'Working across the Business Tech and QQTech teams',
        'Trabalho com integrações utilizando ChatGraph e RabbitMQ': 'Integration work using ChatGraph and RabbitMQ',
        'Consulta e gerenciamento de dados com DBeaver e PostgreSQL': 'Data querying and management with DBeaver and PostgreSQL',
        'Uso do Docker Desktop no ambiente de desenvolvimento': 'Use of Docker Desktop in the development environment',
        'Atuação em um time focado no desenvolvimento de automações para o negócio': 'Working on a team focused on developing business automations',
        'Criação de chatbots e soluções de IA para a comunicação entre clientes e empresa': 'Building chatbots and AI solutions for communication between customers and the company',
        'Integrações utilizando ChatGraph, RabbitMQ e OpenRouter': 'Integrations using ChatGraph, RabbitMQ, and OpenRouter',
        'Desenvolvimento de serviços com Python e FastAPI, apoiados por PostgreSQL e DBeaver': 'Service development with Python and FastAPI, supported by PostgreSQL and DBeaver',
        'Rotina de desenvolvimento com WSL, WinSCP e Docker Desktop': 'Development workflow with WSL, WinSCP, and Docker Desktop',
        'Analista de QA - Foco em Chatbot': 'QA Analyst - Chatbot Focus',
        '11/2025 - 05/2026': '11/2025 - 05/2026',
        'Testes e validação de chatbots e assistentes virtuais': 'Testing and validation of chatbots and virtual assistants',
        'Garantia de qualidade em sistemas de automação de atendimento': 'Quality assurance for customer service automation systems',
        'Análise de fluxos conversacionais e interações com usuários': 'Analysis of conversational flows and user interactions',
        'Identificação e documentação de bugs e melhorias': 'Identification and documentation of bugs and improvements',
        '2024 - Presente': '2024 - Present',
        'Site Profissional': 'Professional Website',
        'Projetos Autorais': 'Independent Projects',
        'Desenvolvimento de aplicações web usando Python (Flask), HTML, CSS e JavaScript': 'Web application development using Python (Flask), HTML, CSS, and JavaScript',
        'Criação de jogos 2D utilizando Pygame': 'Creation of 2D games using Pygame',
        'Desenvolvimento de bots para Discord com funcionalidades personalizadas': 'Development of Discord bots with custom features',
        'Implementação de IA própria utilizando OLLAMA com modelos LLMs (Llama 3.1) e Whisper para processamento de áudio': 'Implementation of custom AI using OLLAMA with LLM models (Llama 3.1) and Whisper for audio processing',
        'Projetos voltados para educação e sustentabilidade empresarial': 'Projects focused on education and corporate sustainability',
        'Formação Acadêmica': 'Education',
        'Análise e Desenvolvimento de Sistemas': 'Systems Analysis and Development',
        '2025 - Presente (4º Semestre)': '2025 - Present (4th Semester)',
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
        'Chatbots e Automação': 'Chatbots and Automation',
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
        'Atendimento personalizado com IA': 'Personalized AI customer service',
        'WSL e WinSCP': 'WSL and WinSCP',
        'DBeaver e PostgreSQL': 'DBeaver and PostgreSQL',
        'OLLAMA e LLMs locais': 'OLLAMA and local LLMs',
        'Llama 3.1 em cenários locais': 'Llama 3.1 in local scenarios',
        'Whisper para áudio': 'Whisper for audio',
        'Orquestração de fluxos de IA': 'AI workflow orchestration',
        'Git e GitHub': 'Git and GitHub',
        'Organização de entregas': 'Delivery organization',
        'Em evolução': 'In progress',
        'Iniciando': 'Starting',
        'Base': 'Basic',
        'Intermediário': 'Intermediate',
        'Forte': 'Strong',
        'Aplicação:': 'Application:',
        'projetos acadêmicos e autorais com foco em resolução de problemas reais.': 'academic and personal projects focused on solving real-world problems.',
        'interfaces para sites profissionais, páginas de produto e fluxos integrados com APIs.': 'interfaces for professional websites, product pages, and API-integrated flows.',
        'atuação em validação de experiências conversacionais com foco no usuário final.': 'experience validating conversational experiences focused on the end user.',
        'bots para comunidades com recursos de moderação, utilidade e automação.': 'bots for communities with moderation, utility, and automation features.',
        'chatbots e automações que conectam clientes e empresa nos dois sentidos do atendimento.': 'chatbots and automations connecting customers and the company in both directions of the service flow.',
        'experimentação de assistentes locais e automação de tarefas com IA.': 'experimentation with local assistants and task automation with AI.',
        'criação de atendimentos personalizados, integração de modelos e automação de fluxos com IA.': 'creation of personalized customer service, model integration, and AI-powered workflow automation.',
        'rotina de estudos, documentação de tarefas e evolução contínua do site profissional.': 'study routine, task documentation, and continuous professional website evolution.',
        'desenvolvimento, acesso a ambientes, transferência de arquivos e gerenciamento de dados no dia a dia.': 'daily development, environment access, file transfer, and data management.',

        // Contact section
        'Vamos Conversar!': "Let's Talk!",
        'Estou aberto a oportunidades, projetos colaborativos e conversas sobre web, automação e IA aplicada.': 'I am open to opportunities, collaborative projects, and conversations about web, automation, and applied AI.',
        'Nome': 'Name',
        'Seu nome': 'Your name',
        'Assunto': 'Subject',
        'Assunto da mensagem': 'Message subject',
        'Mensagem': 'Message',
        'Como posso te ajudar?': 'How can I help you?',
        'Retorno por e-mail em até 2 dias úteis.': 'I reply by email within 2 business days.',
        'Retorno por e-mail em até 2 dias úteis. Seus dados serão usados somente para responder ao contato.': 'I reply by email within 2 business days. Your data will only be used to respond to your message.',
        'Empresa': 'Company',
        'Enviar Mensagem': 'Send Message',

        // Projects page
        'Projetos em destaque': 'Featured Projects',
        'Projetos construídos para gerar resultado real': 'Projects built to deliver real results',
        'Explore por tecnologia e categoria para encontrar rápido o tipo de solução que você quer analisar.': 'Explore by technology and category to quickly find the type of solution you want to review.',
        'Projetos publicados': 'Published projects',
        'Frentes principais: Web, Educação e Automação': 'Main tracks: Web, Education, and Automation',
        'Projetos com demonstração navegável': 'Projects with live walkthroughs',
        'Projetos com walkthrough completo': '100% walkthrough projects',
        'Ferramentas de organização dos projetos': 'Project organization tools',
        'Buscar projeto': 'Search project',
        'Buscar por nome, tecnologia ou categoria': 'Search by name, technology, or category',
        'Filtrar projetos': 'Filter projects',
        'Todos': 'All',
        'Educação': 'Education',
        'Automação': 'Automation',
        'Mostrando 7 de 7 projetos': 'Showing 7 of 7 projects',
        'Abrir projeto Ventude Planner': 'Open Ventude Planner project',
        'Painel diário do Ventude Planner': 'Ventude Planner daily dashboard',
        'Planner Web': 'Web Planner',
        'Ventude Planner': 'Ventude Planner',
        'Planner pessoal para organizar rotina, sono, compromissos e alimentação com indicadores claros em um único lugar.': 'A personal planner for organizing routines, sleep, appointments, and nutrition with clear indicators in one place.',
        'Abrir projeto Nosso Universo': 'Open Nosso Universo project',
        'Experiência 3D': '3D Experience',
        'Nosso Universo': 'Our Universe',
        'Sistema solar 3D do projeto Nosso Universo': '3D solar system from the Our Universe project',
        'Experiência web 3D que transforma uma história a dois em um universo interativo com planetas, memórias e trilha sonora.': 'A 3D web experience that transforms a couple\'s story into an interactive universe with planets, memories, and a soundtrack.',
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
        'Bot em Python para Discord com desenvolvimento atualmente pausado enquanto foco em um projeto de IA para futura integração no próprio bot.': 'Python Discord bot with development currently paused while I focus on an AI project for future integration into the bot itself.',
        'Nenhum projeto encontrado': 'No projects found',
        'Tente outro termo de busca ou limpe os filtros para visualizar todos os projetos novamente.': 'Try another search term or clear the filters to view all projects again.',
        'Limpar filtros': 'Clear filters',

        // Nosso Universo details
        'Nosso Universo - Gabriel Schwingel Conci': 'Our Universe - Gabriel Schwingel Conci',
        'Experiência web 3D criada com Three.js, planetas interativos, narrativa visual, memórias e trilha sonora.': 'A 3D web experience built with Three.js, interactive planets, visual storytelling, memories, and a soundtrack.',
        'Experiência narrativa em Three.js': 'Narrative experience in Three.js',
        'Uma experiência web imersiva que transforma momentos, sentimentos e planos para o futuro em um sistema solar totalmente navegável.': 'An immersive web experience that transforms moments, feelings, and future plans into a fully navigable solar system.',
        'Acessar experiência': 'Visit experience',
        'Ver galeria': 'View gallery',
        '7 mundos temáticos': '7 themed worlds',
        'Sistema solar navegável': 'Navigable solar system',
        'Projeto publicado': 'Published project',
        'Sobre a experiência': 'About the experience',
        'Nosso Universo usa uma navegação espacial em 3D para contar uma história de forma sensorial. Cada planeta funciona como uma seção própria, com identidade visual, movimento e conteúdo específico.': 'Our Universe uses 3D space navigation to tell a story through the senses. Each planet works as its own section, with a distinct visual identity, movement, and content.',
        'A proposta combina tecnologia e afeto em uma interface que convida a explorar, selecionar planetas e descobrir novas camadas da narrativa.': 'The concept combines technology and affection in an interface that invites visitors to explore, select planets, and discover new layers of the story.',
        'Destaques técnicos': 'Technical highlights',
        'Cena 3D com órbitas, partículas e transições de câmera': '3D scene with orbits, particles, and camera transitions',
        'Sete planetas com experiências visuais independentes': 'Seven planets with independent visual experiences',
        'Integração de áudio e playlist incorporada do Spotify': 'Audio integration and embedded Spotify playlist',
        'Interações por mouse e toque em uma interface responsiva': 'Mouse and touch interactions in a responsive interface',
        'Os mundos do projeto': 'The project worlds',
        'Solaris apresenta uma jornada cinematográfica; Aurora conta o início da história; Kronara organiza a linha do tempo; Luminis reúne memórias; Auralis guarda mensagens; Harmonia traz a trilha sonora; e Nebulor representa sonhos e planos para o futuro.': 'Solaris presents a cinematic journey; Aurora tells the beginning of the story; Kronara organizes the timeline; Luminis gathers memories; Auralis holds messages; Harmonia brings the soundtrack; and Nebulor represents dreams and plans for the future.',
        'HTML5 e CSS3': 'HTML5 and CSS3',
        'JavaScript puro': 'Vanilla JavaScript',
        'Three.js e WebGL': 'Three.js and WebGL',
        'Canvas e animações': 'Canvas and animations',
        'Spotify Embed API': 'Spotify Embed API',
        'Capturas reais da experiência publicada, registradas diretamente no projeto em funcionamento.': 'Real screenshots of the published experience, captured directly from the live project.',
        'Visão geral do sistema solar navegável': 'Overview of the navigable solar system',
        'Seleção do planeta Solaris e seu painel contextual': 'Solaris planet selection and its contextual panel',
        'Jornada cinematográfica dentro de Solaris': 'Cinematic journey inside Solaris',
        'Conhecer Nosso Universo': 'Explore Our Universe',
        'Abra a experiência publicada e navegue pelos planetas para descobrir cada parte da história.': 'Open the published experience and navigate through the planets to discover each part of the story.',
        'Abrir o site': 'Open website',

        // Ventude Planner details
        'Ventude Planner - Gabriel Schwingel Conci': 'Ventude Planner - Gabriel Schwingel Conci',
        'Planner pessoal responsivo para rotina, agenda, sono, alimentação e exercícios com autenticação e dados persistentes.': 'A responsive personal planner for routines, calendar, sleep, nutrition, and exercise with authentication and persistent data.',
        'Rotina, energia e tempo no mesmo fluxo': 'Routine, energy, and time in the same flow',
        'Um planner privado que reúne visão diária, agenda e acompanhamento alimentar para transformar uma rotina complexa em decisões simples.': 'A private planner that combines a daily overview, calendar, and nutrition tracking to turn a complex routine into simple decisions.',
        'Acessar planner': 'Visit planner',
        'Visão diária': 'Daily overview',
        'Agenda completa': 'Complete calendar',
        'Acompanhamento alimentar': 'Nutrition tracking',
        'Sobre o planner': 'About the planner',
        'Ventude Planner centraliza rotina, sono, compromissos, alimentação e exercícios em uma experiência única. O painel mostra o momento atual, o progresso do dia e os próximos passos sem sobrecarregar a navegação.': 'Ventude Planner centralizes routines, sleep, appointments, nutrition, and exercise in a single experience. The dashboard shows the current moment, daily progress, and next steps without overwhelming navigation.',
        'A aplicação foi pensada para uso contínuo: os dados ficam protegidos por autenticação, persistem no Firestore e se adaptam do desktop ao celular.': 'The application was designed for continuous use: data is protected by authentication, persists in Firestore, and adapts from desktop to mobile.',
        'Recursos principais': 'Main features',
        'Resumo diário com atividade atual, progresso, sono e saldo calórico': 'Daily summary with current activity, progress, sleep, and calorie balance',
        'Agenda por dia, semana, mês e rotina fixa': 'Calendar views by day, week, month, and recurring routine',
        'Linha do tempo com ações para concluir ou pular atividades': 'Timeline with actions to complete or skip activities',
        'Registro de alimentos, exercícios, metas e análises semanais': 'Food, exercise, goal, and weekly analytics tracking',
        'Decisões de produto': 'Product decisions',
        'A interface usa hierarquia visual compacta, categorias por cor e indicadores objetivos. Em telas menores, a navegação vira um menu lateral e os painéis reorganizam o conteúdo sem rolagem horizontal.': 'The interface uses compact visual hierarchy, color-coded categories, and objective indicators. On smaller screens, navigation becomes a side menu and panels reorganize content without horizontal scrolling.',
        'Autenticação privada': 'Private authentication',
        'Firebase Authentication': 'Firebase Authentication',
        'Persistência em nuvem': 'Cloud persistence',
        'Cloud Firestore': 'Cloud Firestore',
        'Gráficos e indicadores': 'Charts and indicators',
        'Chart.js': 'Chart.js',
        'Ícones de interface': 'Interface icons',
        'Iconify': 'Iconify',
        'Capturas reais do planner após autenticação, sem exibir os dados de acesso da conta.': 'Real screenshots of the planner after authentication, without displaying the account credentials.',
        'Resumo diário com progresso e foco da rotina': 'Daily summary with progress and routine focus',
        'Planejamento semanal com categorias e totais': 'Weekly planning with categories and totals',
        'Controle de alimentação, exercícios e meta calórica': 'Nutrition, exercise, and calorie goal tracking',
        'Conhecer o Ventude Planner': 'Explore Ventude Planner',
        'Acesse a versão publicada para conhecer o fluxo de autenticação e a experiência completa do planner.': 'Open the published version to explore the authentication flow and the complete planner experience.',
        'Abrir o planner': 'Open planner',
        'Resumo do projeto': 'Project summary',
        'Planetas do projeto': 'Project planets',

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
        'Plataforma educacional com IA': 'Educational platform with AI',
        'Aplicação web em Flask para apoiar o ensino de lógica de programação com experiência didática, análise inteligente de respostas e progressão personalizada das aulas.': 'Flask web application designed to support programming logic education with a didactic experience, intelligent answer analysis, and personalized lesson progression.',
        'Plataforma educacional': 'Educational platform',
        'Python, Flask, Firebase e IA': 'Python, Flask, Firebase, and AI',
        'Telas reais do Code Logic mostrando autenticação, módulos, explicações, exercícios e acompanhamento da jornada de aprendizado.': 'Real Code Logic screens showing authentication, modules, explanations, exercises, and progress tracking throughout the learning journey.',
        'Login e autenticação': 'Login and authentication',
        'Cadastro de usuário': 'User registration',
        'Módulos de aprendizado': 'Learning modules',
        'Explicação de conteúdo': 'Content explanation',
        'Exercícios práticos': 'Practical exercises',
        'Atividades de fixação': 'Practice activities',
        'Apresentação da plataforma': 'Platform presentation',
        'Visão geral do fluxo de estudo': 'Study flow overview',

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
        'Projeto web de entretenimento': 'Web entertainment project',
        'Plataforma web para organizar fila de filmes, navegar por categorias e consumir trailers com uma experiência visual direta, fluida e pensada para desktop e mobile.': 'Web platform to organize a movie queue, browse categories, and watch trailers with a direct, fluid visual experience designed for desktop and mobile.',
        'Snapshot do Projeto': 'Project Snapshot',
        'Categoria': 'Category',
        'Contexto': 'Context',
        'Projeto acadêmico': 'Academic project',
        'HTML, CSS, JS e Firebase': 'HTML, CSS, JS, and Firebase',
        'PurplePlay é uma plataforma web de gerenciamento de fila de filmes desenvolvida com HTML, CSS e JavaScript puro, integrada com Firebase para banco de dados. Este foi meu primeiro site criado para a faculdade, onde os usuários podem explorar diferentes categorias de filmes, selecionar títulos de interesse, assistir trailers e adicionar filmes à sua fila pessoal de entretenimento.': 'PurplePlay is a web platform for movie queue management built with pure HTML, CSS, and JavaScript, integrated with Firebase for database support. This was my first website created for college, where users can explore movie categories, select titles of interest, watch trailers, and add films to their personal entertainment queue.',
        'Sistema de categorias de filmes organizadas': 'Organized movie category system',
        'Visualização de trailers integrada': 'Integrated trailer viewing',
        'Fila personalizada de filmes para assistir': 'Personalized watchlist queue',
        'Interface moderna e responsiva': 'Modern and responsive interface',
        'Navegação fluida e intuitiva entre categorias': 'Smooth and intuitive navigation between categories',
        'Sistema de seleção e gerenciamento de filmes': 'Movie selection and management system',
        'Frontend:': 'Frontend:',
        'Layout responsivo e moderno': 'Responsive and modern layout',
        'Interatividade:': 'Interactivity:',
        'JavaScript puro sem frameworks': 'Vanilla JavaScript without frameworks',
        'Telas reais do PurplePlay desenvolvidas para fluxo de login, navegação, trailers e gestão da fila de filmes.': 'Real PurplePlay screens developed for login flow, navigation, trailers, and movie queue management.',
        'Tela de login': 'Login screen',
        'Tela principal': 'Home screen',
        'Fila de filmes': 'Movie queue',
        'Reprodução de trailer': 'Trailer playback',
        'Como meu primeiro projeto para a faculdade, o PurplePlay foi desenvolvido para demonstrar o domínio de tecnologias web fundamentais e a capacidade de criar uma aplicação funcional e completa. O sistema de fila de filmes permite que os usuários organizem seu entretenimento de forma prática, enquanto a integração com Firebase garante a persistência dos dados entre sessões.': 'As my first college project, PurplePlay was developed to demonstrate mastery of core web technologies and the ability to build a complete functional application. The movie queue system allows users to organize their entertainment in a practical way, while Firebase integration ensures data persistence across sessions.',

        // Sage details
        'Projeto de automação para Discord': 'Discord automation project',
        'Sage está em uma fase de transição para IA: a base do bot está pronta e a próxima etapa é integrar inteligência própria para elevar a automação e a experiência da comunidade.': 'Sage is in an AI transition phase: the bot core is ready and the next step is integrating its own intelligence to elevate automation and community experience.',
        'Sage é um bot para Discord desenvolvido em Python, criado para centralizar utilidades e automações no meu servidor pessoal. A base atual já contempla comandos personalizados e uma estrutura modular para facilitar futuras expansões. Neste momento, o desenvolvimento de novas funcionalidades está pausado, pois estou focado em um projeto de criação voltado para IA, que será integrado futuramente ao próprio Sage.': 'Sage is a Discord bot developed in Python, created to centralize utilities and automations on my personal server. The current base already includes custom commands and a modular structure to make future expansions easier. At the moment, development of new features is paused because I am focused on an AI creation project, which will later be integrated into Sage itself.',
        'Comandos de entretenimento (memes e interações sociais)': 'Entertainment commands (memes and social interactions)',
        'Comando SHIP para combinações divertidas entre membros': 'SHIP command for fun member pairings',
        'Automação de tarefas recorrentes no servidor Discord': 'Automation of recurring tasks on the Discord server',
        'Estrutura de comandos personalizada em Discord.py': 'Custom command structure in Discord.py',
        'Base modular para expansão de novas funcionalidades': 'Modular base for expanding new features',
        'Organização de respostas e eventos para facilitar manutenção': 'Organized responses and events to simplify maintenance',
        'Stack principal': 'Core stack',
        'Foco atual': 'Current focus',
        'Próximo marco': 'Next milestone',
        'Projeto de IA dedicado': 'Dedicated AI project',
        'Integração de IA no Sage': 'AI integration into Sage',
        'Bibliotecas:': 'Libraries:',
        'Discord.py e bibliotecas de integração': 'Discord.py and integration libraries',
        'Evolução para automação inteligente com IA': 'Evolution toward intelligent automation with AI',
        'O objetivo do Sage é evoluir para um bot mais inteligente, capaz de combinar automação, utilidade e interações contextualizadas para a comunidade. No curto prazo, meu foco está no desenvolvimento de um projeto de criação de IA dedicado. Após essa etapa, essa IA será implementada no próprio bot para ampliar suas capacidades.': 'Sage\'s objective is to evolve into a smarter bot capable of combining automation, utility, and contextual interactions for the community. In the short term, my focus is on developing a dedicated AI creation project. After this stage, that AI will be implemented in the bot itself to expand its capabilities.',
        'Status do Projeto': 'Project Status',
        'Desenvolvimento atualmente pausado: foco em projeto de criação de IA para futura integração no próprio bot.': 'Development currently paused: focus on an AI creation project for future integration into the bot itself.',
        'Roadmap de evolução': 'Evolution roadmap',
        'Roadmap de Evolução': 'Evolution Roadmap',
        'Andamento estratégico para o próximo ciclo do projeto.': 'Strategic progress for the project\'s next cycle.',
        'Pesquisa e construção da IA base': 'Research and development of the core AI',
        'Treinamento e validação dos fluxos': 'Flow training and validation',
        'Integração da IA no bot Sage': 'AI integration into the Sage bot',

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
        'Como trabalho acadêmico, o objetivo foi criar uma plataforma web que apresentasse de forma clara e profissional o projeto social da América Ambiental. O site serve como vitrine digital das práticas sustentáveis da empresa, demonstrando como a tecnologia web pode ser utilizada para promover conscientização sobre responsabilidade ambiental e social corporativa.': 'As an academic project, the objective was to create a web platform that clearly and professionally presented América Ambiental\'s social project. The site works as a digital showcase for the company\'s sustainable practices, demonstrating how web technology can promote awareness of corporate environmental and social responsibility.',

        // Sustainability details (new layout)
        'Detalhes do projeto Portal Verde América com tecnologias, recursos técnicos e galeria de imagens.': 'Portal Verde America project details with technologies, technical features, and image gallery.',
        'Projeto Institucional': 'Institutional Project',
        'Portal Verde América - Sustentabilidade Empresarial': 'Portal Verde America - Corporate Sustainability',
        'Página desenvolvida para apresentar o projeto socioambiental da América Serviços Automotivos LTDA, reforçando impacto ambiental, ações sociais e engajamento da comunidade.': 'Page developed to present the socio-environmental project of América Serviços Automotivos LTDA, highlighting environmental impact, social actions, and community engagement.',
        'Responsivo': 'Responsive',
        'O que é o projeto': 'What the project is',
        'O Portal Verde América é uma landing page institucional de impacto socioambiental. A proposta é comunicar de forma clara e emocional a iniciativa de sustentabilidade empresarial, com foco na destinação responsável de resíduos, apoio a cooperativas, contribuição para hospital de câncer infantil e melhoria contínua das ações.': 'Portal Verde America is an institutional landing page with socio-environmental impact. Its purpose is to communicate the corporate sustainability initiative in a clear and emotional way, focusing on responsible waste destination, support for cooperatives, contribution to a children\'s cancer hospital, and continuous improvement of actions.',
        'Tecnologias utilizadas': 'Technologies used',
        'Estrutura:': 'Structure:',
        'HTML5 semântico para organizar blocos e conteúdo.': 'Semantic HTML5 to organize page blocks and content.',
        'Visual:': 'Visual:',
        'CSS3 com variáveis, gradientes, sombras e layout responsivo.': 'CSS3 with variables, gradients, shadows, and responsive layout.',
        'Interações:': 'Interactions:',
        'JavaScript Vanilla para animações e navegação dinâmica.': 'Vanilla JavaScript for animations and dynamic navigation.',
        'Tipografia:': 'Typography:',
        'Google Fonts (família Poppins).': 'Google Fonts (Poppins family).',
        'Contato:': 'Contact:',
        'Link direto para WhatsApp com wa.me.': 'Direct WhatsApp link using wa.me.',
        'Recursos técnicos implementados': 'Technical features implemented',
        'Navegação de página única com âncoras internas e rolagem suave.': 'Single-page navigation with internal anchors and smooth scrolling.',
        'Animações de entrada com Intersection Observer.': 'Entrance animations using Intersection Observer.',
        'Efeito parallax leve na hero section.': 'Light parallax effect in the hero section.',
        'Hover interativo em cards de conteúdo.': 'Interactive hover effect on content cards.',
        'Botão flutuante de WhatsApp com exibição condicional no scroll.': 'Floating WhatsApp button with conditional display on scroll.',
        'Efeito de digitação no título principal.': 'Typing effect on the main title.',
        'Estrutura pronta para lazy loading de imagens com data-src.': 'Structure ready for image lazy loading using data-src.',
        'Debounce para otimização de eventos de alta frequência.': 'Debounce for high-frequency event optimization.',
        'Arquitetura e organização': 'Architecture and organization',
        'index.html: estrutura e conteúdo principal da página.': 'index.html: page structure and main content.',
        'styles.css: identidade visual, animações e responsividade.': 'styles.css: visual identity, animations, and responsiveness.',
        'script.js: interatividade, observadores de scroll e efeitos dinâmicos.': 'script.js: interactivity, scroll observers, and dynamic effects.',
        'README.md: documentação geral do projeto.': 'README.md: general project documentation.',
        'Galeria do projeto': 'Project gallery',
        'Algumas telas utilizadas para demonstrar o visual e a estrutura da landing page.': 'Some screens used to showcase the look and structure of the landing page.',
        'Abertura e hero': 'Opening and hero',
        'Conteúdo e indicadores': 'Content and indicators',
        'Fechamento e contato': 'Closing and contact',
        'Imagem institucional da América Ambiental': 'Institutional image of América Ambiental',
        'Seção de abertura com chamada principal e posicionamento institucional.': 'Opening section with the main call-to-action and institutional positioning.',
        'Blocos de conteúdo com informações sobre destinação de materiais e resultados.': 'Content blocks with information about material destination and results.',
        'Seção final com chamadas de participação e contatos da iniciativa.': 'Final section with participation calls and initiative contact channels.',
        'Resumo executivo': 'Executive summary',
        'Este projeto é uma solução estática, moderna e responsiva, construída com front-end puro, sem dependência de frameworks. O foco principal foi combinar performance, clareza de mensagem e engajamento social em uma experiência digital objetiva.': 'This project is a static, modern, and responsive solution built with pure front-end, without framework dependencies. The main focus was to combine performance, message clarity, and social engagement in an objective digital experience.',
        'Acessar site': 'Visit website',

        // Shared project presentation
        'Plataforma educacional em Flask com Firebase e inteligência artificial para apoiar o ensino de lógica de programação.': 'Educational platform built with Flask, Firebase, and artificial intelligence to support programming logic education.',
        'Apresentação da plataforma Code Logic': 'Code Logic platform presentation',
        'Ensino de lógica': 'Programming logic education',
        'Aplicação web': 'Web application',
        'IA aplicada': 'Applied AI',
        'Feedback personalizado': 'Personalized feedback',
        'Experimentar a plataforma': 'Try the platform',
        'Aprender lógica com suporte inteligente': 'Learn programming logic with intelligent support',
        'Acesse a versão publicada ou consulte o código completo no GitHub.': 'Open the live version or view the complete source code on GitHub.',
        'Ferramenta educacional em Python para localizar e interpretar códigos da BNCC em documentos PDF.': 'Educational Python tool for locating and interpreting BNCC codes in PDF documents.',
        'Educação e automação pedagógica': 'Education and pedagogical automation',
        'Leitura de PDF e busca de códigos BNCC em uma interface criada para tornar o planejamento pedagógico mais rápido e organizado.': 'PDF reading and BNCC code search in an interface designed to make pedagogical planning faster and more organized.',
        'Identidade visual do Projeto BNCC': 'BNCC Project visual identity',
        'Aplicação desktop': 'Desktop application',
        'PDF': 'PDF',
        'Leitura e análise': 'Reading and analysis',
        'Planejamento pedagógico': 'Pedagogical planning',
        'Busca automatizada': 'Automated search',
        'Identidade visual da ferramenta criada para apoiar a leitura e organização de documentos educacionais.': 'Visual identity of the tool created to support reading and organizing educational documents.',
        'Projeto BNCC — automação aplicada à educação': 'BNCC Project — automation applied to education',
        'Código e documentação': 'Code and documentation',
        'Conhecer o Projeto BNCC': 'Explore the BNCC Project',
        'Acesse o repositório para ver a implementação em Python e a documentação técnica.': 'Open the repository to view the Python implementation and technical documentation.',
        'Plataforma web para explorar filmes, assistir trailers e organizar uma fila pessoal de entretenimento.': 'Web platform for exploring movies, watching trailers, and organizing a personal entertainment queue.',
        'Entretenimento': 'Entertainment',
        'Catálogo de filmes': 'Movie catalog',
        'Fila pessoal': 'Personal queue',
        'Organização de títulos': 'Title organization',
        'Persistência de dados': 'Data persistence',
        'JavaScript Vanilla': 'Vanilla JavaScript',
        'Design responsivo': 'Responsive design',
        'Explorar o catálogo': 'Explore the catalog',
        'Organize sua próxima sessão de filmes': 'Organize your next movie session',
        'Acesse a experiência publicada ou confira a implementação completa no GitHub.': 'Open the live experience or view the complete implementation on GitHub.',
        'Bot modular em Python para Discord com comandos, automações e evolução planejada para inteligência artificial.': 'Modular Python bot for Discord with commands, automations, and planned evolution toward artificial intelligence.',
        'Automação para comunidades': 'Community automation',
        'Ver roadmap': 'View roadmap',
        'Ver recursos': 'View features',
        'Base modular': 'Modular foundation',
        'Comandos e eventos': 'Commands and events',
        'Em pausa': 'Paused',
        'Próximo ciclo com IA': 'Next cycle with AI',
        'Desenvolvimento atualmente pausado': 'Development currently paused',
        'Arquitetura modular': 'Modular architecture',
        'IA planejada': 'Planned AI',
        'Identidade do projeto': 'Project identity',
        'Sage em evolução': 'Sage in evolution',
        'O projeto mantém uma base funcional e uma identidade própria enquanto prepara o próximo ciclo de automação inteligente.': 'The project maintains a functional foundation and its own identity while preparing the next intelligent automation cycle.',
        'Sage — bot modular para comunidades no Discord': 'Sage — modular bot for Discord communities',
        'Próximo ciclo': 'Next cycle',
        'Automação com inteligência própria': 'Automation with custom intelligence',
        'A próxima etapa é conectar a base modular do Sage ao projeto de IA em desenvolvimento.': 'The next step is connecting Sage\'s modular foundation to the AI project under development.',
        'Em pesquisa e desenvolvimento': 'In research and development',
        'Landing page institucional sobre sustentabilidade, impacto ambiental e ações sociais da América Ambiental.': 'Institutional landing page about sustainability, environmental impact, and social initiatives by América Ambiental.',
        'Portal Verde América': 'Portal Verde America',
        'Abertura do Portal Verde América': 'Portal Verde America opening',
        'Comunicação de impacto': 'Impact communication',
        'Sustentabilidade': 'Sustainability',
        'Consciência ambiental': 'Environmental awareness',
        'Desktop e mobile': 'Desktop and mobile',
        'HTML5 semântico': 'Semantic HTML5',
        'Google Fonts': 'Google Fonts',
        'Performance web': 'Web performance',
        'Conhecer a iniciativa': 'Explore the initiative',
        'Sustentabilidade comunicada com clareza': 'Sustainability communicated clearly',
        'Acesse a landing page publicada ou consulte a organização do projeto no GitHub.': 'Open the published landing page or review the project organization on GitHub.',

        // Course repositories
        'Quer ver o que desenvolvi durante os cursos?': 'Want to see what I built during the courses?',
        'Os exercícios, exemplos e práticas estão organizados nestes repositórios no GitHub.': 'The exercises, examples, and practice work are organized in these GitHub repositories.',
        'Curso de Lógica e Python': 'Logic and Python Course',
        'Curso de Pandas': 'Pandas Course',
        'Curso de Python': 'Python Course',

        // Professional presentation, experience modals, and technologies
        'Tecnologias': 'Technologies',
        'Projetos em destaque': 'Featured Projects',
        'Projetos em desenvolvimento web, automação, educação e inteligência artificial aplicada.': 'Projects in web development, automation, education, and applied artificial intelligence.',
        'Catálogo de projetos': 'Project Catalog',
        'Ferramenta desktop em Python e Tkinter para ler PDFs, localizar códigos BNCC e apoiar o planejamento pedagógico.': 'Desktop tool built with Python and Tkinter to read PDFs, locate BNCC codes, and support pedagogical planning.',
        'Automações, chatbots e soluções de IA para aproximar clientes e empresa por meio de atendimentos personalizados.': 'Automations, chatbots, and AI solutions that connect customers and the company through personalized service.',
        'Qualidade de experiências conversacionais, validação de fluxos e documentação de melhorias em chatbots.': 'Conversational experience quality, flow validation, and chatbot improvement documentation.',
        'Projetos autorais em desenvolvimento web, automação, educação e inteligência artificial aplicada.': 'Independent projects in web development, automation, education, and applied artificial intelligence.',
        'Ver detalhes da atuação': 'View role details',
        'Ver detalhes dos projetos': 'View project details',
        'Cursos e desenvolvimento contínuo': 'Courses and Continuous Development',
        'Formações complementares, conteúdos estudados e exercícios disponíveis no GitHub.': 'Additional training, studied content, and exercises available on GitHub.',
        'Ver cursos': 'View courses',
        'A stack que utilizo em produtos, automações, integrações e projetos autorais.': 'The stack I use in products, automations, integrations, and independent projects.',
        'Desenvolvimento': 'Development',
        'Automação e IA': 'Automation and AI',
        'Dados e infraestrutura': 'Data and Infrastructure',
        'Fechar detalhes da experiência': 'Close experience details',
        'Fechar detalhes dos cursos': 'Close course details',
        'Experiência atual': 'Current Experience',
        'Experiência anterior': 'Previous Experience',
        'Desenvolvimento autoral': 'Independent Development',
        'Objetivo da atuação': 'Role Objective',
        'Desenvolver automações e soluções inteligentes que tornem a comunicação entre clientes e empresa mais rápida, personalizada e eficiente.': 'Develop automations and intelligent solutions that make communication between customers and the company faster, more personalized, and more efficient.',
        'O que faço': 'What I Do',
        'Criação e evolução de chatbots para fluxos cliente → empresa e empresa → cliente.': 'Creation and evolution of chatbots for customer → company and company → customer flows.',
        'Construção de atendimentos personalizados com inteligência artificial.': 'Development of personalized customer service using artificial intelligence.',
        'Integração de fluxos e mensageria utilizando ChatGraph, RabbitMQ e OpenRouter.': 'Workflow and messaging integration using ChatGraph, RabbitMQ, and OpenRouter.',
        'Desenvolvimento de serviços e APIs com Python e FastAPI.': 'Development of services and APIs with Python and FastAPI.',
        'Consulta, análise e gerenciamento de dados com PostgreSQL e DBeaver.': 'Data querying, analysis, and management with PostgreSQL and DBeaver.',
        'Trabalho em ambientes Linux por WSL, transferência de arquivos com WinSCP e execução local com Docker Desktop.': 'Work in Linux environments through WSL, file transfer with WinSCP, and local execution with Docker Desktop.',
        'Stack da rotina': 'Daily Stack',
        'Garantir que chatbots e assistentes virtuais entregassem conversas consistentes, claras e funcionais para o usuário final.': 'Ensure chatbots and virtual assistants delivered consistent, clear, and functional conversations to the end user.',
        'O que fiz': 'What I Did',
        'Execução de testes funcionais em chatbots e automações de atendimento.': 'Execution of functional tests on chatbots and customer service automations.',
        'Validação de caminhos felizes, exceções e diferentes respostas do usuário.': 'Validation of happy paths, exceptions, and different user responses.',
        'Análise de fluxos conversacionais, regras de negócio e integrações envolvidas.': 'Analysis of conversational flows, business rules, and related integrations.',
        'Identificação, reprodução e documentação de bugs com evidências claras.': 'Identification, reproduction, and documentation of bugs with clear evidence.',
        'Registro de sugestões de melhoria para experiência, conteúdo e comportamento dos fluxos.': 'Documentation of improvement suggestions for experience, content, and workflow behavior.',
        'Acompanhamento das correções até a validação final da entrega.': 'Follow-up on fixes through final delivery validation.',
        'Competências aplicadas': 'Applied Skills',
        'Validação de integrações': 'Integration Validation',
        'Projetos Full-Stack': 'Full-Stack Projects',
        'Projetos pessoais e acadêmicos': 'Personal and Academic Projects',
        'O que desenvolvo': 'What I Build',
        'Aplicações web responsivas com HTML, CSS, JavaScript, Python e Flask.': 'Responsive web applications with HTML, CSS, JavaScript, Python, and Flask.',
        'APIs e serviços voltados para automação, integrações e processamento de dados.': 'APIs and services for automation, integrations, and data processing.',
        'Projetos educacionais, experiências interativas e soluções para necessidades reais.': 'Educational projects, interactive experiences, and solutions for real needs.',
        'Bots para Discord com comandos, eventos e recursos personalizados.': 'Discord bots with custom commands, events, and features.',
        'Experimentos com IA local utilizando Ollama, modelos LLM e Whisper.': 'Local AI experiments using Ollama, LLM models, and Whisper.',
        'Publicação, documentação e evolução contínua dos projetos no GitHub.': 'Publishing, documentation, and continuous project development on GitHub.',
        'Stack dos projetos': 'Project Stack',
        'Aprendizado contínuo': 'Continuous Learning',
        'Cursos e formações complementares': 'Courses and Additional Training',
        'Uma visão organizada dos conteúdos que apoiam minha evolução técnica e profissional.': 'An organized overview of the content supporting my technical and professional development.',
        'Udemy · 2025 - Em andamento': 'Udemy · 2025 - In progress',
        'Fundamentos, orientação a objetos, automação e aplicações práticas.': 'Fundamentals, object-oriented programming, automation, and practical applications.',
        'Estruturas condicionais, repetições, funções e resolução de problemas.': 'Conditionals, loops, functions, and problem solving.',
        'Startup Morada do Vale 1 · 2019': 'Startup Morada do Vale 1 · 2019',
        'Base de comunicação, leitura e compreensão do idioma.': 'Foundation in communication, reading, and language comprehension.',
        'Startup Morada do Vale 1 · 2017': 'Startup Morada do Vale 1 · 2017',
        'Produtividade, documentos, apresentações e organização de dados.': 'Productivity, documents, presentations, and data organization.',
        'Exercícios no GitHub': 'Exercises on GitHub'
    };

    const MESSAGE_CATALOG = {
        en: {
            'nav.openMenu': 'Open navigation menu',
            'nav.closeMenu': 'Close navigation menu',
            'theme.toDark': 'Switch to dark theme',
            'theme.toLight': 'Switch to light theme',
            'transition.loading': 'Loading...',
            'transition.openProjects': 'Opening projects...',
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
        explicitEntries: [],
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

                    if (parent.closest('[data-en], .language-gate')) {
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

    function captureExplicitEntries() {
        state.explicitEntries = Array.from(document.querySelectorAll('[data-en]')).map((element) => ({
            element,
            original: element.textContent,
            english: element.getAttribute('data-en') || element.textContent
        }));
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

                const englishAttributeName = `data-en-${attributeName}`;
                entries.push({
                    element,
                    attributeName,
                    original: element.getAttribute(attributeName),
                    english: element.getAttribute(englishAttributeName)
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

        state.explicitEntries.forEach((entry) => {
            entry.element.textContent = entry.original;
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

        state.explicitEntries.forEach((entry) => {
            entry.element.textContent = entry.english;
        });

        state.attributeEntries.forEach((entry) => {
            entry.element.setAttribute(entry.attributeName, entry.english || translateFromPortuguese(entry.original));
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
        const switchMessage = isEnglish ? 'Switch language to Portuguese' : 'Mudar idioma para inglês';

        if (languageToggleButton.hasAttribute('data-language-switch')) {
            languageToggleButton.setAttribute('data-language', isEnglish ? 'en' : 'pt');
        } else {
            const label = isEnglish ? 'EN' : 'PT';
            languageToggleButton.textContent = label;
        }

        languageToggleButton.setAttribute('aria-label', switchMessage);
        languageToggleButton.setAttribute('title', switchMessage);
        languageToggleButton.setAttribute('aria-pressed', String(!isEnglish));
    }

    function triggerLanguageTransition() {
        if (!document.body) {
            return;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        document.body.classList.remove('language-switching');
        void document.body.offsetWidth;
        document.body.classList.add('language-switching');

        window.setTimeout(() => {
            document.body.classList.remove('language-switching');
        }, 320);
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
        const shouldAnimate = options.animate !== false;

        state.currentLanguage = resolvedLanguage;

        if (resolvedLanguage === 'en') {
            applyEnglishContent();
        } else {
            restorePortugueseContent();
        }

        updateDocumentLanguage(resolvedLanguage);
        updateLanguageToggleButton();

        if (shouldAnimate) {
            triggerLanguageTransition();
        }

        if (shouldPersist) {
            try {
                sessionStorage.setItem(STORAGE_KEY, resolvedLanguage);
            } catch (_error) {
                // A interface continua funcional mesmo quando o armazenamento está indisponível.
            }
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

    function getStoredLanguage() {
        try {
            const value = sessionStorage.getItem(STORAGE_KEY);
            return value === 'pt' || value === 'en' ? value : null;
        } catch (_error) {
            return null;
        }
    }

    function typeLanguageIntroductions(gate) {
        const portugueseText = 'Seja muito bem-vindo ao meu site profissional. Para visualizar o conteúdo em português, escolha a opção abaixo.';
        const englishText = 'Welcome to my professional website. To view the content in English, choose the option below.';
        const portugueseTarget = gate.querySelector('[data-typewriter="pt"]');
        const englishTarget = gate.querySelector('[data-typewriter="en"]');

        if (!portugueseTarget || !englishTarget) {
            return;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            portugueseTarget.textContent = portugueseText;
            englishTarget.textContent = englishText;
            return;
        }

        const startedAt = performance.now();
        const charactersPerSecond = 34;
        const render = (now) => {
            const visibleCharacters = Math.floor(((now - startedAt) / 1000) * charactersPerSecond);
            portugueseTarget.textContent = portugueseText.slice(0, visibleCharacters);
            englishTarget.textContent = englishText.slice(0, visibleCharacters);

            if (visibleCharacters < Math.max(portugueseText.length, englishText.length) && gate.isConnected) {
                window.requestAnimationFrame(render);
            }
        };

        window.requestAnimationFrame(render);
    }

    function completeInitialLanguageChoice(gate, language) {
        gate.querySelectorAll('button').forEach((button) => {
            button.disabled = true;
        });
        applyLanguage(language, { animate: false });

        const finish = () => {
            document.documentElement.dataset.languageChoice = 'ready';
            document.body.classList.add('site-revealed');
            gate.remove();
        };

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            finish();
            return;
        }

        gate.classList.add('is-transitioning');
        window.setTimeout(finish, 760);
    }

    function createLanguageGate() {
        const gate = document.createElement('div');
        gate.className = 'language-gate';
        gate.setAttribute('role', 'dialog');
        gate.setAttribute('aria-modal', 'true');
        gate.setAttribute('aria-labelledby', 'languageGateTitle');
        gate.innerHTML = `
            <div class="language-gate__ambient" aria-hidden="true"></div>
            <div class="language-gate__content">
                <header class="language-gate__header">
                    <span class="logo-mark" aria-hidden="true">GC</span>
                    <div><p>Gabriel Conci</p><h1 id="languageGateTitle">Escolha seu idioma <span>/ Choose your language</span></h1></div>
                </header>
                <div class="language-gate__grid">
                    <article class="language-choice language-choice--pt">
                        <span class="language-choice__code">PT-BR</span>
                        <h2>Olá, seja bem-vindo.</h2>
                        <p class="language-choice__typing" data-typewriter="pt" aria-live="polite"></p>
                        <button type="button" data-language-choice="pt">Continuar em Português <i class="fas fa-arrow-right" aria-hidden="true"></i></button>
                    </article>
                    <article class="language-choice language-choice--en" lang="en">
                        <span class="language-choice__code">EN-US</span>
                        <h2>Hello, welcome.</h2>
                        <p class="language-choice__typing" data-typewriter="en" aria-live="polite"></p>
                        <button type="button" data-language-choice="en">Continue in English <i class="fas fa-arrow-right" aria-hidden="true"></i></button>
                    </article>
                </div>
                <p class="language-gate__note">Sua escolha fica salva somente durante esta sessão. / Your choice is saved only for this session.</p>
            </div>
            <div class="language-gate__bands" aria-hidden="true"><span></span><span></span><span></span></div>`;

        document.body.appendChild(gate);
        gate.querySelectorAll('[data-language-choice]').forEach((button) => {
            button.addEventListener('click', () => completeInitialLanguageChoice(gate, button.dataset.languageChoice));
        });
        typeLanguageIntroductions(gate);
        window.setTimeout(() => gate.querySelector('[data-language-choice="pt"]')?.focus(), 80);
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
        captureExplicitEntries();
        captureAttributeEntries();
        captureMetaEntries();

        initializeLanguageToggleButton();

        const storedLanguage = getStoredLanguage();
        const preferredLanguage = resolveLanguage(storedLanguage || DEFAULT_LANGUAGE);
        applyLanguage(preferredLanguage, { persist: false, emitEvent: false, animate: false });

        const requiresInitialChoice = document.documentElement.hasAttribute('data-language-choice');

        if (storedLanguage || !requiresInitialChoice) {
            document.documentElement.dataset.languageChoice = 'ready';
            document.body.classList.add('site-revealed');
        } else {
            document.documentElement.dataset.languageChoice = 'pending';
            createLanguageGate();
        }
    }

    window.siteLanguage = {
        applyLanguage,
        getCurrentLanguage: () => state.currentLanguage,
        t,
        translateText: (value) => {
            if (state.currentLanguage !== 'en') {
                return value;
            }

            return translateFromPortuguese(value);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }
})();

-- Vértice Peak: conteúdo inicial. Idempotente (pode rodar mais de uma vez).
-- Executar DEPOIS de 0001 e 0002.

insert into public.site_settings (key, value) values
  ('branding', '{"logoUrl": "", "faviconUrl": ""}'),
  ('contact', '{"whatsapp": "", "email": "", "phone": "", "address": "", "hours": ""}'),
  ('socials', '{"instagram": "https://www.instagram.com/vertice_peak/", "facebook": "", "linkedin": "", "tiktok": "", "youtube": ""}'),
  ('seo', '{"siteTitle": "Vértice Peak — Marketing, Estratégia e Presença Digital", "siteDescription": "A Vértice Peak desenvolve soluções criativas de marketing e sites profissionais para negócios que querem fortalecer sua presença digital.", "keywords": "marketing digital, criação de sites, landing pages, identidade visual, catálogo digital", "ogImageUrl": ""}'),
  ('footer', '{"text": "Marketing, design e criação de sites profissionais para negócios.", "copyright": "Vértice Peak. Todos os direitos reservados."}'),
  ('home', '{"eyebrow": "Marketing • Estratégia • Presença Digital", "heroTitle": "Sua marca merece chegar", "heroHighlight": "ao próximo nível.", "heroSubtitle": "Transformamos criatividade e estratégia em soluções digitais que fortalecem marcas, valorizam negócios e ampliam possibilidades.", "positioning": "Criatividade com propósito. Estratégia com direção.", "primaryCta": "Conheça nossos projetos", "secondaryCta": "Vamos conversar", "servicesHeading": "Soluções para sua marca", "servicesSubtitle": "Do primeiro site à identidade completa, cada entrega é pensada para fazer sua marca ir mais longe.", "portfolioHeading": "Ideias que ganham vida na internet.", "portfolioSubtitle": "Conheça alguns dos modelos que desenvolvemos e descubra como uma presença digital profissional pode transformar a apresentação do seu negócio.", "ctaTitle": "Seu próximo nível começa com uma ideia.", "ctaText": "Conte para nós o que você deseja construir. Vamos conversar sobre uma solução digital para o seu negócio.", "bannerEnabled": false, "bannerTitle": "", "bannerText": "", "bannerLinkLabel": "", "bannerLinkUrl": "", "bannerImageUrl": ""}'),
  ('about', '{"heading": "Criatividade com propósito. Estratégia com direção.", "history": "A Vértice Peak é uma empresa de marketing dedicada a desenvolver soluções criativas para negócios que desejam fortalecer sua presença digital.\n\nUnimos visão estratégica, comunicação e design para ajudar marcas a se apresentarem com mais profissionalismo no ambiente digital.", "purposeHeading": "Mais do que presença digital. Posicionamento.", "purpose": "Acreditamos que toda marca merece uma presença digital à altura do seu trabalho. Nosso propósito é traduzir a essência de cada negócio em sites, materiais e identidades que transmitem confiança.", "differentials": ["Design alinhado à identidade do negócio", "Experiência responsiva para celulares e computadores", "Comunicação clara e profissional", "Soluções pensadas para cada tipo de empresa", "Facilidade de contato entre o negócio e seus clientes"]}')
on conflict (key) do nothing;

-- Serviços iniciais (somente se a tabela estiver vazia).
insert into public.services (title, description, icon, published, sort_order)
select * from (values
  ('Criação de sites profissionais', 'Seu negócio merece um espaço próprio na internet. Desenvolvemos sites modernos, responsivos e personalizados para apresentar sua empresa, destacar seus serviços e facilitar o contato com seus clientes.', 'globe', true, 1),
  ('Landing pages', 'Páginas focadas em uma oferta, com mensagem clara e um caminho direto para o contato.', 'target', true, 2),
  ('Catálogos digitais', 'Catálogos online para apresentar produtos e serviços com organização e um visual profissional.', 'book-open', true, 3),
  ('Marketing digital e comunicação', 'Comunicação clara e estratégica para apresentar seu negócio no ambiente digital.', 'megaphone', true, 4),
  ('Conteúdo e materiais visuais', 'Criação de conteúdo e peças visuais alinhadas à identidade da sua marca.', 'image', true, 5),
  ('Identidade visual e design', 'Design que traduz o posicionamento do seu negócio de forma consistente.', 'pen-tool', true, 6),
  ('Soluções digitais personalizadas', 'Projetos sob medida quando o seu desafio pede algo que não cabe em um pacote pronto.', 'sparkles', true, 7)
) as v(title, description, icon, published, sort_order)
where not exists (select 1 from public.services);

-- Modelos de demonstração do site atual (sem capas: envie as imagens pelo painel).
insert into public.projects (name, slug, category, short_description, description, demo_url, technologies, published, featured, sort_order)
select * from (values
  ('Amora Beauty Studio', 'amora-beauty-studio', 'Beleza e estética', 'Site para o universo da beleza, com apresentação elegante e foco na experiência do cliente.', 'Uma proposta visual voltada ao universo da beleza, com uma apresentação elegante, identidade marcante e foco na experiência do cliente.', 'https://amora-beauty-studio.vercel.app/', array['Next.js', 'Tailwind CSS'], true, true, 1),
  ('Vortex Automotive', 'vortex-automotive', 'Automotivo', 'Modelo de site para o setor automotivo, com informações comerciais e destaque aos produtos.', 'Um modelo de site para o setor automotivo, pensado para apresentar uma empresa, organizar informações comerciais e valorizar seus produtos e serviços.', 'https://vortex-automotive-ruby.vercel.app/', array['Next.js', 'Tailwind CSS'], true, true, 2),
  ('Odonto Prime', 'odonto-prime', 'Saúde e odontologia', 'Site para clínicas odontológicas, com apresentação profissional e foco em transmitir confiança.', 'Um modelo de site para clínicas odontológicas, com apresentação profissional, identidade clara e foco em transmitir confiança e facilitar o contato com os pacientes.', 'https://odonto-prime-sigma.vercel.app/', array['Next.js', 'Tailwind CSS'], true, false, 3)
) as v(name, slug, category, short_description, description, demo_url, technologies, published, featured, sort_order)
on conflict (slug) do nothing;

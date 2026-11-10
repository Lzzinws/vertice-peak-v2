import type { AboutContent, HomeContent, SiteContent, ServiceIcon } from "@/lib/types";

/**
 * Conteúdo de referência extraído do site atual da Vértice Peak. É usado apenas como
 * fallback quando o banco não está configurado ou não responde. Em produção, o conteúdo
 * editável vem sempre da tabela `site_settings` / `services`.
 */
export const DEFAULT_HOME: HomeContent = {
  eyebrow: "Marketing • Estratégia • Presença Digital",
  heroTitle: "Sua marca merece chegar",
  heroHighlight: "ao próximo nível.",
  heroSubtitle:
    "Transformamos criatividade e estratégia em soluções digitais que fortalecem marcas, valorizam negócios e ampliam possibilidades.",
  positioning: "Criatividade com propósito. Estratégia com direção.",
  primaryCta: "Conheça nossos projetos",
  secondaryCta: "Vamos conversar",
  servicesHeading: "Soluções para sua marca",
  servicesSubtitle: "Do primeiro site à identidade completa, cada entrega é pensada para fazer sua marca ir mais longe.",
  portfolioHeading: "Ideias que ganham vida na internet.",
  portfolioSubtitle:
    "Conheça alguns dos modelos que desenvolvemos e descubra como uma presença digital profissional pode transformar a apresentação do seu negócio.",
  ctaTitle: "Seu próximo nível começa com uma ideia.",
  ctaText: "Conte para nós o que você deseja construir. Vamos conversar sobre uma solução digital para o seu negócio.",
  bannerEnabled: false,
  bannerTitle: "",
  bannerText: "",
  bannerLinkLabel: "",
  bannerLinkUrl: "",
  bannerImageUrl: "",
};

export const DEFAULT_ABOUT: AboutContent = {
  heading: "Criatividade com propósito. Estratégia com direção.",
  history:
    "A Vértice Peak é uma empresa de marketing dedicada a desenvolver soluções criativas para negócios que desejam fortalecer sua presença digital.\n\nUnimos visão estratégica, comunicação e design para ajudar marcas a se apresentarem com mais profissionalismo no ambiente digital.",
  purposeHeading: "Mais do que presença digital. Posicionamento.",
  purpose:
    "Acreditamos que toda marca merece uma presença digital à altura do seu trabalho. Nosso propósito é traduzir a essência de cada negócio em sites, materiais e identidades que transmitem confiança.",
  differentials: [
    "Design alinhado à identidade do negócio",
    "Experiência responsiva para celulares e computadores",
    "Comunicação clara e profissional",
    "Soluções pensadas para cada tipo de empresa",
    "Facilidade de contato entre o negócio e seus clientes",
  ],
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  branding: { logoUrl: "", faviconUrl: "" },
  contact: { whatsapp: "", email: "", phone: "", address: "", hours: "" },
  socials: {
    instagram: "https://www.instagram.com/vertice_peak/",
    facebook: "",
    linkedin: "",
    tiktok: "",
    youtube: "",
  },
  seo: {
    siteTitle: "Vértice Peak — Marketing, Estratégia e Presença Digital",
    siteDescription:
      "A Vértice Peak desenvolve soluções criativas de marketing e sites profissionais para negócios que querem fortalecer sua presença digital.",
    keywords: "marketing digital, criação de sites, landing pages, identidade visual, catálogo digital",
    ogImageUrl: "",
  },
  footer: {
    text: "Marketing, design e criação de sites profissionais para negócios.",
    copyright: "Vértice Peak. Todos os direitos reservados.",
  },
  home: DEFAULT_HOME,
  about: DEFAULT_ABOUT,
};

export const DEFAULT_SERVICES: { title: string; description: string; icon: ServiceIcon }[] = [
  {
    title: "Criação de sites profissionais",
    description:
      "Seu negócio merece um espaço próprio na internet. Desenvolvemos sites modernos, responsivos e personalizados para apresentar sua empresa, destacar seus serviços e facilitar o contato com seus clientes.",
    icon: "globe",
  },
  {
    title: "Landing pages",
    description: "Páginas focadas em uma oferta, com mensagem clara e um caminho direto para o contato.",
    icon: "target",
  },
  {
    title: "Catálogos digitais",
    description: "Catálogos online para apresentar produtos e serviços com organização e um visual profissional.",
    icon: "book-open",
  },
  {
    title: "Marketing digital e comunicação",
    description: "Comunicação clara e estratégica para apresentar seu negócio no ambiente digital.",
    icon: "megaphone",
  },
  {
    title: "Conteúdo e materiais visuais",
    description: "Criação de conteúdo e peças visuais alinhadas à identidade da sua marca.",
    icon: "image",
  },
  {
    title: "Identidade visual e design",
    description: "Design que traduz o posicionamento do seu negócio de forma consistente.",
    icon: "pen-tool",
  },
  {
    title: "Soluções digitais personalizadas",
    description: "Projetos sob medida quando o seu desafio pede algo que não cabe em um pacote pronto.",
    icon: "sparkles",
  },
];

export const PROCESS_STEPS = [
  { title: "Entendimento", description: "Conhecemos o negócio e seus objetivos." },
  { title: "Planejamento", description: "Definimos a estrutura e a direção visual." },
  { title: "Desenvolvimento", description: "Construímos a solução e ajustamos os detalhes." },
  {
    title: "Entrega",
    description: "Apresentamos o projeto finalizado e orientamos os próximos passos conforme o serviço contratado.",
  },
];

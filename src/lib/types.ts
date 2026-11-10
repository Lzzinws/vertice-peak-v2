export const PROJECT_STATUSES = ["draft", "published"] as const;
export const LEAD_STATUSES = ["novo", "em_atendimento", "convertido", "arquivado"] as const;
export const SERVICE_ICONS = ["globe", "target", "book-open", "megaphone", "image", "pen-tool", "sparkles"] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type ServiceIcon = (typeof SERVICE_ICONS)[number];

export type Project = {
  id: string;
  name: string;
  slug: string;
  category: string;
  short_description: string;
  description: string;
  cover_image_url: string | null;
  gallery: string[];
  demo_url: string | null;
  client_name: string | null;
  technologies: string[];
  published: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: ServiceIcon;
  image_url: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Testimonial = {
  id: string;
  client_name: string;
  company: string | null;
  quote: string;
  photo_url: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Lead = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  whatsapp: string;
  service: string;
  budget: string | null;
  message: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
};

export type Branding = { logoUrl: string; faviconUrl: string };
export type Contact = { whatsapp: string; email: string; phone: string; address: string; hours: string };
export type Socials = { instagram: string; facebook: string; linkedin: string; tiktok: string; youtube: string };
export type Seo = { siteTitle: string; siteDescription: string; keywords: string; ogImageUrl: string };
export type Footer = { text: string; copyright: string };
export type HomeContent = {
  eyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  positioning: string;
  primaryCta: string;
  secondaryCta: string;
  servicesHeading: string;
  servicesSubtitle: string;
  portfolioHeading: string;
  portfolioSubtitle: string;
  ctaTitle: string;
  ctaText: string;
  bannerEnabled: boolean;
  bannerTitle: string;
  bannerText: string;
  bannerLinkLabel: string;
  bannerLinkUrl: string;
  bannerImageUrl: string;
};
export type AboutContent = {
  heading: string;
  history: string;
  purposeHeading: string;
  purpose: string;
  differentials: string[];
};

export type SiteContent = {
  branding: Branding;
  contact: Contact;
  socials: Socials;
  seo: Seo;
  footer: Footer;
  home: HomeContent;
  about: AboutContent;
};

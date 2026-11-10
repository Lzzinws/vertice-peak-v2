import { z } from "zod";
import { BILLING_PERIODS, LEAD_STATUSES, SERVICE_ICONS } from "@/lib/types";
import { parseBRL } from "@/lib/money";
import { SLUG_PATTERN } from "@/lib/slug";
import { onlyDigits } from "@/lib/whatsapp";

const httpUrl = z
  .string()
  .trim()
  .max(500, "Link muito longo")
  .refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v), "Informe um link começando com https://");

const optionalText = (max: number) => z.string().trim().max(max, `Use no máximo ${max} caracteres`);

const phone = z
  .string()
  .trim()
  .max(30)
  .refine((v) => v === "" || (onlyDigits(v).length >= 10 && onlyDigits(v).length <= 13), "Informe um telefone com DDD");

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(120),
  company: optionalText(120),
  email: z.email("Informe um e-mail válido").max(160),
  whatsapp: phone.refine((v) => v !== "", "Informe seu WhatsApp com DDD"),
  service: z.string().trim().min(2, "Escolha o serviço desejado").max(120),
  budget: optionalText(60),
  message: z.string().trim().min(10, "Conte um pouco mais sobre o projeto").max(3000),
});

export const leadStatusSchema = z.enum(LEAD_STATUSES, { message: "Status inválido" });

export const projectSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do projeto").max(120),
  slug: z
    .string()
    .trim()
    .min(2, "Informe o slug")
    .max(120)
    .regex(SLUG_PATTERN, "Use apenas letras minúsculas, números e hífens"),
  category: z.string().trim().min(2, "Informe a categoria").max(80),
  shortDescription: z.string().trim().min(10, "Escreva uma descrição curta").max(180),
  description: z.string().trim().min(10, "Escreva a descrição completa").max(8000),
  demoUrl: httpUrl,
  clientName: optionalText(120),
  technologies: z.array(z.string().trim().min(1).max(40)).max(20, "Use no máximo 20 tecnologias"),
  published: z.boolean(),
  featured: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(9999),
});

export const serviceSchema = z.object({
  title: z.string().trim().min(2, "Informe o título").max(120),
  description: z.string().trim().min(10, "Escreva a descrição").max(600),
  icon: z.enum(SERVICE_ICONS, { message: "Escolha um ícone" }),
  published: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(9999),
});

export const testimonialSchema = z.object({
  clientName: z.string().trim().min(2, "Informe o nome do cliente").max(120),
  company: optionalText(120),
  quote: z.string().trim().min(10, "Escreva o depoimento").max(800),
  published: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(9999),
});

export const generalSettingsSchema = z.object({
  branding: z.object({ logoUrl: z.string(), faviconUrl: z.string() }),
  contact: z.object({
    whatsapp: phone,
    email: z.union([z.literal(""), z.email("E-mail comercial inválido")]),
    phone: optionalText(30),
    address: optionalText(300),
    hours: optionalText(200),
  }),
  socials: z.object({
    instagram: httpUrl,
    facebook: httpUrl,
    linkedin: httpUrl,
    tiktok: httpUrl,
    youtube: httpUrl,
  }),
  seo: z.object({
    siteTitle: z.string().trim().min(3, "Informe o título do site").max(120),
    siteDescription: z.string().trim().min(20, "A descrição deve ter ao menos 20 caracteres").max(320),
    keywords: optionalText(300),
    ogImageUrl: z.string(),
  }),
  footer: z.object({ text: optionalText(300), copyright: optionalText(200) }),
});

export const homeSettingsSchema = z.object({
  eyebrow: optionalText(120),
  heroTitle: z.string().trim().min(3, "Informe o título principal").max(160),
  heroHighlight: optionalText(160),
  heroSubtitle: z.string().trim().min(10, "Escreva o subtítulo").max(400),
  positioning: optionalText(200),
  primaryCta: optionalText(60),
  secondaryCta: optionalText(60),
  servicesHeading: optionalText(160),
  servicesSubtitle: optionalText(300),
  portfolioHeading: optionalText(160),
  portfolioSubtitle: optionalText(400),
  ctaTitle: optionalText(160),
  ctaText: optionalText(400),
  bannerEnabled: z.boolean(),
  bannerTitle: optionalText(120),
  bannerText: optionalText(300),
  bannerLinkLabel: optionalText(60),
  bannerLinkUrl: httpUrl,
  bannerImageUrl: z.string(),
});

export const aboutSettingsSchema = z.object({
  heading: z.string().trim().min(3, "Informe o título").max(200),
  history: z.string().trim().min(10, "Escreva a história da empresa").max(6000),
  purposeHeading: optionalText(200),
  purpose: optionalText(3000),
  differentials: z.array(z.string().trim().min(1).max(200)).max(20, "Use no máximo 20 diferenciais"),
});

export const planSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome do plano").max(80),
  description: optionalText(300),
  priceText: z.string().trim().max(30),
  billingPeriod: z.enum(BILLING_PERIODS, { message: "Escolha a cobrança" }),
  features: z.array(z.string().trim().min(1).max(160)).max(20, "Use no máximo 20 itens"),
  highlight: z.boolean(),
  ctaLabel: z.string().trim().min(2, "Informe o texto do botão").max(40),
  published: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(9999),
}).superRefine((plan, ctx) => {
  const price = parseBRL(plan.priceText);
  if (Number.isNaN(price) || (price !== null && (price < 0 || price > 1000000))) {
    ctx.addIssue({ code: "custom", path: ["priceText"], message: "Informe um preço válido, ex.: 1.290,00 (ou deixe vazio para sob consulta)" });
  }
});

export type PlanInput = z.infer<typeof planSchema>;

export type ProjectInput = z.infer<typeof projectSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type LeadInput = z.infer<typeof leadSchema>;

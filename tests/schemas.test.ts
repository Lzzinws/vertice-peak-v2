import { describe, expect, it } from "vitest";
import { leadSchema, projectSchema, serviceSchema, homeSettingsSchema, aboutSettingsSchema, generalSettingsSchema } from "@/lib/schemas";
import { DEFAULT_HOME, DEFAULT_ABOUT, DEFAULT_SITE_CONTENT } from "@/lib/defaults";

const validLead = {
  name: "Ana Souza",
  company: "",
  email: "ana@exemplo.com",
  whatsapp: "(11) 91234-5678",
  service: "Criação de sites profissionais",
  budget: "",
  message: "Preciso de um site para minha clínica.",
};

describe("leadSchema", () => {
  it("aceita um lead válido", () => {
    expect(leadSchema.safeParse(validLead).success).toBe(true);
  });
  it("exige nome, e-mail, WhatsApp, serviço e mensagem", () => {
    const r = leadSchema.safeParse({ ...validLead, name: "A", email: "x", whatsapp: "1", message: "curta" });
    expect(r.success).toBe(false);
    const paths = r.success ? [] : r.error.issues.map((i) => i.path[0]);
    expect(paths).toEqual(expect.arrayContaining(["name", "email", "whatsapp", "message"]));
  });
  it("aceita empresa e orçamento vazios (campos opcionais)", () => {
    expect(leadSchema.safeParse({ ...validLead, company: "", budget: "" }).success).toBe(true);
  });
});

const validProject = {
  name: "Vortex Automotive",
  slug: "vortex-automotive",
  category: "Automotivo",
  shortDescription: "Modelo de site para o setor automotivo.",
  description: "Um modelo de site para o setor automotivo, pensado para apresentar uma empresa.",
  demoUrl: "https://vortex-automotive-ruby.vercel.app/",
  clientName: "",
  technologies: ["Next.js"],
  published: true,
  featured: false,
  sortOrder: 2,
};

describe("projectSchema", () => {
  it("aceita um projeto válido", () => {
    expect(projectSchema.safeParse(validProject).success).toBe(true);
  });
  it("recusa slug com maiúsculas, espaços ou acentos", () => {
    for (const slug of ["Vortex", "vortex automotive", "vórtex"]) {
      expect(projectSchema.safeParse({ ...validProject, slug }).success).toBe(false);
    }
  });
  it("recusa link de demonstração que não seja http(s)", () => {
    expect(projectSchema.safeParse({ ...validProject, demoUrl: "javascript:alert(1)" }).success).toBe(false);
    expect(projectSchema.safeParse({ ...validProject, demoUrl: "ftp://x.com" }).success).toBe(false);
  });
  it("aceita link de demonstração vazio", () => {
    expect(projectSchema.safeParse({ ...validProject, demoUrl: "" }).success).toBe(true);
  });
  it("limita a 20 tecnologias", () => {
    const technologies = Array.from({ length: 21 }, (_, i) => `T${i}`);
    expect(projectSchema.safeParse({ ...validProject, technologies }).success).toBe(false);
  });
});

describe("serviceSchema", () => {
  it("aceita apenas ícones conhecidos", () => {
    const base = { title: "Landing pages", description: "Páginas focadas em uma oferta.", published: true, sortOrder: 1 };
    expect(serviceSchema.safeParse({ ...base, icon: "globe" }).success).toBe(true);
    expect(serviceSchema.safeParse({ ...base, icon: "rocket" }).success).toBe(false);
  });
});

describe("configurações", () => {
  it("o conteúdo padrão é válido para os esquemas do painel", () => {
    expect(homeSettingsSchema.safeParse({ ...DEFAULT_HOME, bannerImageUrl: "" }).success).toBe(true);
    expect(aboutSettingsSchema.safeParse(DEFAULT_ABOUT).success).toBe(true);
    expect(
      generalSettingsSchema.safeParse({
        branding: DEFAULT_SITE_CONTENT.branding,
        contact: DEFAULT_SITE_CONTENT.contact,
        socials: DEFAULT_SITE_CONTENT.socials,
        seo: DEFAULT_SITE_CONTENT.seo,
        footer: DEFAULT_SITE_CONTENT.footer,
      }).success,
    ).toBe(true);
  });
  it("recusa e-mail comercial inválido, mas aceita vazio (a configurar)", () => {
    const base = {
      branding: DEFAULT_SITE_CONTENT.branding,
      socials: DEFAULT_SITE_CONTENT.socials,
      seo: DEFAULT_SITE_CONTENT.seo,
      footer: DEFAULT_SITE_CONTENT.footer,
    };
    const contact = (email: string) => ({ ...DEFAULT_SITE_CONTENT.contact, email });
    expect(generalSettingsSchema.safeParse({ ...base, contact: contact("sem-arroba") }).success).toBe(false);
    expect(generalSettingsSchema.safeParse({ ...base, contact: contact("") }).success).toBe(true);
  });
});

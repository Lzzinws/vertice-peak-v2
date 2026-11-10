import { describe, expect, it } from "vitest";
import { slugify, SLUG_PATTERN } from "@/lib/slug";
import { buildWhatsAppUrl, buildLeadWhatsAppUrl, onlyDigits } from "@/lib/whatsapp";
import { splitLines, splitParagraphs } from "@/lib/format";
import { validateImage, MAX_IMAGE_BYTES } from "@/lib/upload-rules";

describe("slugify", () => {
  it("remove acentos e normaliza", () => {
    expect(slugify("Amora Beauty Studio")).toBe("amora-beauty-studio");
    expect(slugify("Clínica Odontológica — São Paulo!")).toBe("clinica-odontologica-sao-paulo");
  });
  it("gera slugs aceitos pelo padrão e pelo banco", () => {
    for (const name of ["Vortex Automotive", "  Odonto   Prime  ", "Projeto #1"]) {
      expect(SLUG_PATTERN.test(slugify(name))).toBe(true);
    }
  });
  it("nunca gera slug vazio com hífens nas pontas", () => {
    expect(slugify("---")).toBe("");
    expect(slugify("  x  ")).toBe("x");
  });
});

describe("WhatsApp", () => {
  it("retorna null sem número (botão oculto)", () => {
    expect(buildWhatsAppUrl("")).toBeNull();
    expect(buildWhatsAppUrl(null)).toBeNull();
    expect(buildWhatsAppUrl("123")).toBeNull();
  });
  it("adiciona DDI 55 quando faltar", () => {
    expect(buildWhatsAppUrl("(11) 91234-5678")).toBe("https://wa.me/5511912345678");
  });
  it("mantém DDI informado e codifica a mensagem", () => {
    expect(buildWhatsAppUrl("+55 11 91234-5678", "Olá, tudo bem?")).toBe(
      "https://wa.me/5511912345678?text=Ol%C3%A1%2C%20tudo%20bem%3F",
    );
  });
  it("monta link para lead", () => {
    const url = buildLeadWhatsAppUrl("11999998888", "Ana");
    expect(url).toMatch(/^https:\/\/wa\.me\/5511999998888\?text=/);
    expect(decodeURIComponent(url!)).toContain("Ana");
  });
  it("onlyDigits remove tudo que não é número", () => {
    expect(onlyDigits("+55 (11) 9-1234")).toBe("551191234");
  });
});

describe("texto", () => {
  it("splitLines ignora linhas vazias", () => {
    expect(splitLines("a\n\n  b  \r\nc\n")).toEqual(["a", "b", "c"]);
  });
  it("splitParagraphs separa por linha em branco", () => {
    expect(splitParagraphs("um\n\ndois\n  \ntrês")).toEqual(["um", "dois", "três"]);
  });
});

describe("validateImage", () => {
  const make = (type: string, size = 1000) => new File([new Uint8Array(size)], "x", { type });
  it("aceita formatos rasters", () => {
    expect(validateImage(make("image/png"))).toBeNull();
    expect(validateImage(make("image/webp"))).toBeNull();
  });
  it("recusa SVG em galerias, mas aceita em logo", () => {
    expect(validateImage(make("image/svg+xml"))).not.toBeNull();
    expect(validateImage(make("image/svg+xml"), { allowSvg: true })).toBeNull();
  });
  it("recusa arquivos acima de 5 MB", () => {
    expect(validateImage(make("image/jpeg", MAX_IMAGE_BYTES + 1))).toMatch(/5 MB/);
  });
  it("recusa tipos não-imagem", () => {
    expect(validateImage(make("text/html"))).not.toBeNull();
  });
});

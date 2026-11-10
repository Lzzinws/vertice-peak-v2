import { describe, expect, it } from "vitest";
import { parseBRL, formatBRL, toInputPrice } from "@/lib/money";
import { planSchema } from "@/lib/schemas";

describe("parseBRL", () => {
  it("lê o formato brasileiro", () => {
    expect(parseBRL("1.290,00")).toBe(1290);
    expect(parseBRL("R$ 990")).toBe(990);
    expect(parseBRL("2.500,5")).toBe(2500.5);
    expect(parseBRL("49,90")).toBe(49.9);
  });
  it("aceita ponto decimal sem separador de milhar", () => {
    expect(parseBRL("1290.50")).toBe(1290.5);
  });
  it("trata ponto seguido de três dígitos como milhar, não decimal", () => {
    expect(parseBRL("1.290")).toBe(1290);
    expect(parseBRL("12.500")).toBe(12500);
  });
  it("vazio significa sob consulta (null)", () => {
    expect(parseBRL("")).toBeNull();
    expect(parseBRL("   ")).toBeNull();
  });
  it("rejeita valores inválidos", () => {
    expect(Number.isNaN(parseBRL("abc"))).toBe(true);
    expect(Number.isNaN(parseBRL("1.2.3,4"))).toBe(true);
    expect(Number.isNaN(parseBRL("-10"))).toBe(true);
  });
  it("formata e reconverte sem perda", () => {
    expect(formatBRL(1290)).toMatch(/1\.290,00/);
    expect(formatBRL(null)).toBe("Sob consulta");
    expect(parseBRL(toInputPrice(1290.5))).toBe(1290.5);
  });
});

const base = {
  name: "Site Essencial",
  description: "",
  priceText: "1.290,00",
  billingPeriod: "unico" as const,
  features: ["Página inicial", "Formulário de contato"],
  highlight: false,
  ctaLabel: "Quero este plano",
  published: true,
  sortOrder: 1,
};

describe("planSchema", () => {
  it("aceita um plano válido", () => {
    expect(planSchema.safeParse(base).success).toBe(true);
  });
  it("aceita preço vazio (sob consulta)", () => {
    expect(planSchema.safeParse({ ...base, priceText: "" }).success).toBe(true);
  });
  it("recusa preço inválido com mensagem no campo priceText", () => {
    const r = planSchema.safeParse({ ...base, priceText: "mil reais" });
    expect(r.success).toBe(false);
    expect(r.success ? [] : r.error.issues.map((i) => i.path[0])).toContain("priceText");
  });
  it("recusa cobrança fora da lista", () => {
    expect(planSchema.safeParse({ ...base, billingPeriod: "semanal" }).success).toBe(false);
  });
  it("limita a 20 itens", () => {
    const features = Array.from({ length: 21 }, (_, i) => `Item ${i}`);
    expect(planSchema.safeParse({ ...base, features }).success).toBe(false);
  });
});

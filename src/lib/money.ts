/**
 * Converte preço digitado em formato brasileiro ("1.290,00", "R$ 990", "990.5") em número.
 * Retorna null para vazio (sob consulta) e NaN para valor inválido.
 */
export function parseBRL(input: string): number | null {
  const cleaned = input.replace(/R\$/gi, "").replace(/\s/g, "").trim();
  if (cleaned === "") return null;

  // Com vírgula: formato brasileiro. Milhar com ponto, decimal com vírgula ("1.290,00", "990,5").
  if (cleaned.includes(",")) {
    if (!/^(\d{1,3}(\.\d{3})+|\d+),\d{1,2}$/.test(cleaned)) return Number.NaN;
    return Number(cleaned.replace(/\./g, "").replace(",", "."));
  }
  // Sem vírgula: "1.290" é milhar (não 1,29); "1290.5" é decimal com ponto.
  if (/^\d{1,3}(\.\d{3})+$/.test(cleaned)) return Number(cleaned.replace(/\./g, ""));
  if (/^\d+(\.\d{1,2})?$/.test(cleaned)) return Number(cleaned);
  return Number.NaN;
}

/** Formata para exibição: 1290 → "R$ 1.290,00"; null → "Sob consulta". */
export function formatBRL(value: number | null): string {
  if (value === null) return "Sob consulta";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

/** Valor para preencher o campo do painel: 1290 → "1.290,00"; null → "". */
export function toInputPrice(value: number | null): string {
  if (value === null) return "";
  return new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

export const BILLING_LABELS: Record<"unico" | "mensal" | "anual", string> = {
  unico: "pagamento único",
  mensal: "por mês",
  anual: "por ano",
};

/** Mantém apenas dígitos. */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * Monta o link wa.me. Aceita número com ou sem DDI; sem DDI assume Brasil (55).
 * Retorna null quando não há número válido, para o site ocultar o botão.
 */
export function buildWhatsAppUrl(phone: string | null | undefined, message?: string): string | null {
  if (!phone) return null;
  let digits = onlyDigits(phone);
  if (digits.length < 10) return null;
  if (digits.length <= 11) digits = `55${digits}`;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}

/** Link do WhatsApp para conversar sobre um lead no painel. */
export function buildLeadWhatsAppUrl(phone: string, name: string): string | null {
  return buildWhatsAppUrl(
    phone,
    `Olá, ${name}! Aqui é da Vértice Peak. Recebemos o seu contato e queremos conversar sobre o seu projeto.`,
  );
}

import type { ZodError } from "zod";

export type ActionState = {
  ok: boolean;
  message?: string;
  errors?: Record<string, string>;
  /** Valores enviados, devolvidos em caso de erro para o formulário não perder o que foi digitado. */
  values?: Record<string, string>;
  /** Incrementado a cada envio; usado como `key` do formulário para remontar os campos após erro. */
  nonce?: number;
};

export const INITIAL_STATE: ActionState = { ok: false };

/** Converte erros do zod em um mapa campo → mensagem (primeira mensagem vence). */
export function zodErrorsToRecord(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

/** Lê uma string do FormData sem espaços extras. */
export function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/** Checkbox: presente = true. */
export function getBoolean(formData: FormData, key: string): boolean {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

export function getFile(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

export function getFiles(formData: FormData, key: string): File[] {
  return formData.getAll(key).filter((v): v is File => v instanceof File && v.size > 0);
}

/** Snapshot dos campos de texto para devolver ao formulário após um erro. */
export function formValues(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string") out[key] = value;
  });
  return out;
}

/** Falha de validação padronizada: campos marcados, valores preservados. */
export function invalid(formData: FormData, errors: Record<string, string>, message = "Revise os campos destacados."): ActionState {
  return { ok: false, errors, message, values: formValues(formData) };
}

/** Envolve a action para que cada resultado tenha um nonce novo (sem usar Math.random na renderização). */
export function withNonce(
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>,
): (prev: ActionState, formData: FormData) => Promise<ActionState> {
  return async (prev, formData) => {
    const result = await action(prev, formData);
    return { ...result, nonce: (prev.nonce ?? 0) + 1 };
  };
}

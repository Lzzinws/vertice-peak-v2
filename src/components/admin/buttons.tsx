"use client";

import { useFormStatus } from "react-dom";
import { btnDanger, btnPrimary } from "@/lib/ui";

export function SubmitButton({ children, pendingText = "Salvando..." }: { children: React.ReactNode; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${btnPrimary} disabled:cursor-wait`}>
      {pending ? pendingText : children}
    </button>
  );
}

/** Botão de exclusão com confirmação. Usado dentro de <form action={...}>. */
export function ConfirmDeleteButton({ message, children = "Excluir" }: { message: string; children?: React.ReactNode }) {
  return (
    <button
      type="submit"
      className={btnDanger}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}

import { MessageCircle } from "lucide-react";

export function WhatsAppFloat({ url }: { url: string | null }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-bold text-ink shadow-[0_10px_40px_-10px_rgb(182_255_0/0.6)] transition hover:scale-105 hover:bg-white"
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}

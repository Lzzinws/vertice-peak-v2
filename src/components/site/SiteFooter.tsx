import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import type { Contact, Footer, Socials } from "@/lib/types";

type Props = { footer: Footer; contact: Contact; socials: Socials; logoUrl?: string };

const SOCIAL_LABELS: { key: keyof Socials; label: string }[] = [
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "tiktok", label: "TikTok" },
  { key: "youtube", label: "YouTube" },
];

export function SiteFooter({ footer, contact, socials, logoUrl }: Props) {
  const activeSocials = SOCIAL_LABELS.filter((s) => socials[s.key]);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-ink-2">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div className="space-y-4">
          <Logo logoUrl={logoUrl} />
          <p className="max-w-xs text-sm leading-relaxed text-muted">{footer.text}</p>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-bold text-white">Navegação</p>
          <ul className="space-y-2 text-muted">
            <li><Link className="hover:text-lime" href="/sobre">Sobre nós</Link></li>
            <li><Link className="hover:text-lime" href="/servicos">Serviços</Link></li>
            <li><Link className="hover:text-lime" href="/portfolio">Portfólio</Link></li>
            <li><Link className="hover:text-lime" href="/contato">Contato</Link></li>
          </ul>
        </div>

        <div className="space-y-3 text-sm text-muted">
          <p className="font-bold text-white">Contato</p>
          {contact.email && <p>{contact.email}</p>}
          {contact.phone && <p>{contact.phone}</p>}
          {contact.address && <p>{contact.address}</p>}
          {contact.hours && <p>{contact.hours}</p>}
          {activeSocials.length > 0 && (
            <ul className="flex flex-wrap gap-3 pt-2">
              {activeSocials.map((s) => (
                <li key={s.key}>
                  <a
                    href={socials[s.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-white/80 hover:border-lime hover:text-lime"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted sm:px-6">
          © {year} {footer.copyright}
        </p>
      </div>
    </footer>
  );
}

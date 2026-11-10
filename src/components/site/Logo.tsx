type LogoProps = { className?: string; showWord?: boolean; logoUrl?: string };

export function Logo({ className = "", showWord = true, logoUrl }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- logo enviado pelo painel (URL do Storage)
        <img src={logoUrl} alt="" className="h-9 w-9 object-contain" />
      ) : (
        <svg viewBox="0 0 64 64" className="h-9 w-9" aria-hidden="true">
          <path d="M6 54 32 6l26 48H44L32 31 20 54z" fill="#B6FF00" />
          <path d="M32 6l26 48H44L32 31z" fill="#8fd000" />
        </svg>
      )}
      {showWord && (
        <span className="font-display text-sm tracking-[0.14em] text-white">
          VÉRTICE <span className="text-lime">PEAK</span>
        </span>
      )}
    </span>
  );
}

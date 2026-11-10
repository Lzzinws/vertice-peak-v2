import Link from "next/link";
import { btnPrimary } from "@/lib/ui";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="font-display text-7xl text-lime">404</p>
      <h1 className="text-3xl font-black">Essa página não está disponível.</h1>
      <p className="text-muted">O endereço pode ter mudado ou o conteúdo foi despublicado.</p>
      <Link href="/" className={btnPrimary}>Voltar para o início</Link>
    </section>
  );
}

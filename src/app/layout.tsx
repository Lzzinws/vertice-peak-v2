import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { getSiteContent } from "@/lib/content";
import { SITE_URL } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { seo, branding } = await getSiteContent();
  const keywords = seo.keywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: seo.siteTitle, template: "%s | Vértice Peak" },
    description: seo.siteDescription,
    keywords,
    icons: branding.faviconUrl ? { icon: branding.faviconUrl } : undefined,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: "Vértice Peak",
      title: seo.siteTitle,
      description: seo.siteDescription,
      images: seo.ogImageUrl ? [{ url: seo.ogImageUrl }] : undefined,
    },
    twitter: { card: "summary_large_image", title: seo.siteTitle, description: seo.siteDescription },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col antialiased">{children}</body>
    </html>
  );
}

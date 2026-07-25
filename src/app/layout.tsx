import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { brand } from "@/lib/brand";
import { ogImage, siteUrl } from "@/lib/seo";
import { getLocale } from "next-intl/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${brand.displayName} — ${brand.tagline}`,
    template: `%s | ${brand.displayName}`,
  },
  description: brand.description,
  applicationName: brand.applicationName,
  metadataBase: new URL(siteUrl),
  authors: [{ name: brand.company.legalName, url: siteUrl }],
  publisher: brand.company.legalName,
  category: "shopping",
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    siteName: brand.displayName,
    url: siteUrl,
    locale: "en",
    title: `${brand.displayName} — ${brand.tagline}`,
    description: brand.description,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    site: brand.social.twitter,
    creator: brand.social.twitter,
    title: `${brand.displayName} — ${brand.tagline}`,
    description: brand.description,
    images: [ogImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  referrer: "origin-when-cross-origin",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The <html> element lives above the [locale] segment, so the language has to
  // come from the request rather than the route params.
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Editorial typography — Fraunces (serif display), Inter (sans body),
            JetBrains Mono (specs/SKUs/prices). Loaded via Google Fonts CDN to
            avoid the Turbopack next/font internal-module resolution bug when
            more than two Google fonts are combined via next/font/google. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,500;6..96,600;6..96,700&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

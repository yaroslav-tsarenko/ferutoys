import { brand } from "@/lib/brand";
import { routing } from "@/i18n/routing";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || brand.url
).replace(/\/$/, "");

const sameAs = [brand.social.instagram, brand.social.linkedin];

/**
 * Rendered by `src/app/opengraph-image.tsx`. Declared explicitly because pages
 * that override `openGraph` in `generateMetadata` drop the inherited file-based
 * image.
 */
export const ogImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${brand.displayName} — ${brand.tagline}`,
};

/**
 * hreflang map for a path such as "/product/foo". The store is single-locale
 * (English, no URL prefix), so each entry points at the bare path.
 */
export function localeAlternates(path: string) {
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, path || "/"]),
  );
}

/**
 * Organization node — the legal entity behind the storefront. Search engines
 * use `legalName`/`identifier` to reconcile the trading name with the registry
 * entry, so both the FeruToys brand and FERUTAX OÜ are declared here.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "@id": `${siteUrl}/#organization`,
    name: brand.displayName,
    legalName: brand.company.legalName,
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    image: `${siteUrl}/opengraph-image`,
    description: brand.description,
    email: brand.contact.email,
    ...(brand.contact.phone ? { telephone: brand.contact.phone } : {}),
    identifier: {
      "@type": "PropertyValue",
      name: "Estonian company registry code",
      value: brand.company.number,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: `${brand.company.address.line1}, ${brand.company.address.line2}`,
      addressLocality: brand.company.address.city,
      addressRegion: brand.company.address.region,
      postalCode: brand.company.address.postcode,
      addressCountry: "EE",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: brand.contact.email,
      availableLanguage: ["English", "Estonian"],
      areaServed: "EU",
    },
    sameAs,
  };
}

/** WebSite node with the sitelinks search box pointing at /search. */
export function webSiteJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: brand.displayName,
    inLanguage: locale,
    publisher: { "@id": `${siteUrl}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

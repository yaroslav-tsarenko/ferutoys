"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Globe,
  Lock,
  ChevronDown,
  Sparkles,
  PackageOpen,
  Heart,
  ShieldAlert,
} from "lucide-react";
import { FeruToysLogo } from "../FeruToysLogo";
import { brand, brandLegalLine } from "@/lib/brand";
import { useCurrency } from "@/providers/CurrencyProvider";
import visaLogo from "@/assets/visa-logo.svg";
import mastercardLogo from "@/assets/mastercard-logo.svg";
import pciDssLogo from "@/assets/pci-dss-compliant-logo-vector.svg";

/**
 * FeruToys footer — a warm, boutique, trust-forward tiered layout.
 *
 * Tiers (top → bottom):
 *   1. Top intimacy band — a private, gentle newsletter invitation.
 *   2. Refined, less-dense link tier — Shop by collection · Wellness & guides ·
 *      Customer care · Company. Collapses into soft accordions on mobile.
 *   3. Trust & reassurance row — discreet packaging, secure payment, 18+,
 *      body-safe materials, payment glyphs and tasteful social links.
 *   4. Soft legal bar — copyright, registered company details, 18+ notice,
 *      currency selector and Privacy/Terms/Cookies.
 */

// Curated collection fallback — only shown until the live category feed loads.
// Points are consistent with the /catalog/... scheme used across the app.
const fallbackCollectionLinks = [
  { href: "/catalog/for-her",     label: "For Her" },
  { href: "/catalog/for-him",     label: "For Him" },
  { href: "/catalog/for-couples", label: "For Couples" },
  { href: "/catalog/wellness",    label: "Wellness & Self-care" },
  { href: "/catalog/lingerie",    label: "Lingerie" },
  { href: "/catalog/lubricants",  label: "Lubricants & Essentials" },
  { href: "/catalog/gifting",     label: "Gifting" },
  { href: "/catalog?sort=new",    label: "New In" },
];

const wellnessLinks = [
  { href: "/blog",              label: "The Journal" },
  { href: "/guides",            label: "Guides & how-to" },
  { href: "/guides/getting-started", label: "New to this? Start here" },
  { href: "/wellness",          label: "Body-safe & wellness" },
  { href: "/faq",               label: "Questions, answered" },
];

const customerCareLinks = [
  { href: "/policies/shipping", label: "Discreet shipping" },
  { href: "/policies/returns",  label: "Returns & refunds" },
  { href: "/policies/payment",  label: "Secure payment" },
  { href: "/account/orders",    label: "Track my order" },
  { href: "/faq",               label: "Help & FAQ" },
  { href: "/contact",           label: "Contact us" },
];

const companyLinks = [
  { href: "/about",     label: "About FeruToys" },
  { href: "/policies",  label: "Our promise" },
  { href: "/policies",  label: "Sustainability" },
  { href: "/contact",   label: "Get in touch" },
];

const legalLinks = [
  { href: "/policies/privacy", label: "Privacy" },
  { href: "/policies/terms",   label: "Terms" },
  { href: "/policies/cookies", label: "Cookies" },
];

const reassuranceChips = [
  { icon: PackageOpen,  label: "Plain, discreet packaging" },
  { icon: Lock,         label: "Secure & private checkout" },
  { icon: ShieldAlert,  label: "Adults only · 18+" },
  { icon: Heart,        label: "Body-safe materials" },
];

const socialLinks = [
  { icon: FaInstagram,  label: "FeruToys on Instagram", href: brand.social.instagram },
  { icon: FaLinkedinIn, label: "FeruToys on LinkedIn",  href: brand.social.linkedin },
];

interface Group {
  key: string;
  title: string;
  items: Array<{ href: string; label: string }>;
}

function LinkGroup({ group }: { group: Group }) {
  const [open, setOpen] = useState(false);
  const panelId = `footer-group-${group.key}`;
  return (
    <div className="border-b border-[color:var(--color-bronze)]/15 md:border-b-0">
      {/* Mobile accordion trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-bronze)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:hidden"
      >
        <span className="font-display text-[15.5px] font-medium tracking-tight text-[color:var(--color-text)]">
          {group.title}
        </span>
        <ChevronDown
          size={15}
          aria-hidden
          className={`text-[color:var(--color-bronze)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {/* Desktop editorial header */}
      <h3 className="hidden pb-5 eyebrow text-[color:var(--color-bronze)] md:block">
        {group.title}
      </h3>
      <ul
        id={panelId}
        className={`grid grid-cols-1 gap-y-3 pb-5 md:pb-0 ${open ? "grid" : "hidden md:grid"}`}
      >
        {group.items.map((it) => (
          <li key={it.label}>
            <Link
              href={it.href}
              className="text-[13.5px] leading-relaxed text-[color:var(--color-text)]/70 transition-colors hover:text-[color:var(--color-primary)] focus-visible:text-[color:var(--color-primary)] focus-visible:outline-none"
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface LiveCategory {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

export function Footer() {
  const t = useTranslations("footer");
  const { currency, symbol } = useCurrency();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [liveCategories, setLiveCategories] = useState<LiveCategory[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setLiveCategories(data);
      })
      .catch(() => {});
  }, []);

  const collectionLinks =
    liveCategories.length > 0
      ? liveCategories.slice(0, 8).map((c) => ({
          href: `/catalog/${c.slug}`,
          label: c.name,
        }))
      : fallbackCollectionLinks;

  const groups: Group[] = [
    { key: "collection", title: "Shop by collection", items: collectionLinks },
    { key: "wellness",   title: "Wellness & guides",  items: wellnessLinks },
    { key: "care",       title: "Customer care",      items: customerCareLinks },
    { key: "company",    title: "Company",            items: companyLinks },
  ];

  return (
    <footer
      className="mt-auto text-[color:var(--color-text)]"
      role="contentinfo"
      style={{ backgroundColor: "var(--color-header)" }}
    >
      {/* ── 1 · TOP INTIMACY BAND ──────────────────────────────────
           A private, gentle newsletter invitation. Reuses the existing
           form handler + email/subscribed state.
      */}
      <div className="border-b border-[color:var(--color-bronze)]/15">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-bronze)]/30 px-3.5 py-1.5 eyebrow text-[color:var(--color-bronze)]">
              <Sparkles size={12} aria-hidden /> The FeruToys circle
            </span>

            <h2 className="editorial-heading font-display text-[30px] font-normal leading-tight tracking-tight text-[color:var(--color-text)] md:text-[40px]">
              Join the{" "}
              <span className="italic text-[color:var(--color-bronze)]">
                FeruToys
              </span>{" "}
              circle
            </h2>
            <p className="max-w-md text-[15px] leading-relaxed text-[color:var(--color-text)]/70">
              Early access, quiet drops, zero noise.
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!email) return;
                try {
                  await fetch("/api/newsletter", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                  });
                } catch {
                  /* silent */
                }
                setSubscribed(true);
                setEmail("");
              }}
              className="flex w-full max-w-md flex-col gap-2.5 sm:flex-row"
              aria-label="Join the FeruToys circle"
            >
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="min-w-0 flex-1 rounded-full border border-[color:var(--color-bronze)]/25 bg-[color:var(--color-text)]/5 px-5 py-3.5 text-[14.5px] text-[color:var(--color-text)] placeholder:text-[color:var(--color-text)]/45 transition-all focus:border-[color:var(--color-bronze)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-bronze)]/40"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[color:var(--color-primary)] px-7 py-3.5 text-[13.5px] font-medium text-[color:var(--color-primary-fg)] transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-bronze)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Subscribe <ArrowRight size={14} aria-hidden />
              </button>
            </form>

            {subscribed ? (
              <p className="inline-flex items-center gap-2 text-[13px] font-medium text-[color:var(--color-teal,var(--color-success))]">
                <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-teal,var(--color-success))]" />
                You&apos;re in. Something lovely is on its way.
              </p>
            ) : (
              <p className="text-[12px] text-[color:var(--color-text)]/50">
                We keep things private. Unsubscribe anytime. See our{" "}
                <Link href="/policies/privacy" className="underline underline-offset-2 hover:text-[color:var(--color-bronze)]">
                  Privacy Policy
                </Link>
                .
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── 2 · REFINED LINK TIER ──────────────────────────────────
           Generous spacing; brand block + four soft-accordion columns.
      */}
      <div className="border-b border-[color:var(--color-bronze)]/15">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_2.2fr] lg:gap-16 lg:px-8">
          {/* Brand block */}
          <div className="flex flex-col gap-5">
            <Link href="/" aria-label="FeruToys" className="w-fit">
              <FeruToysLogo size={26} tone="light" />
            </Link>
            <p className="max-w-sm text-[14px] leading-relaxed text-[color:var(--color-text)]/70">
              {brand.tagline} A considered intimacy boutique — pleasure,
              wellness and self-care, lingerie and thoughtful gifting, chosen
              with care and shipped in discreet packaging.
            </p>

            <div className="mt-1 flex flex-col gap-2.5 text-[13.5px] text-[color:var(--color-text)]/70">
              <a href={`mailto:${brand.contact.email}`} className="inline-flex items-center gap-2.5 transition-colors hover:text-[color:var(--color-bronze)]">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--color-bronze)]/25 text-[color:var(--color-bronze)]">
                  <Mail size={13} aria-hidden />
                </span>
                {brand.contact.email}
              </a>
              {brand.contact.phone && (
                <a href={brand.contact.phoneHref} className="inline-flex items-center gap-2.5 transition-colors hover:text-[color:var(--color-bronze)]">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--color-bronze)]/25 text-[color:var(--color-bronze)]">
                    <Phone size={13} aria-hidden />
                  </span>
                  {brand.contact.phone}
                </a>
              )}
              <span className="inline-flex items-start gap-2.5">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-bronze)]/25 text-[color:var(--color-bronze)]">
                  <MapPin size={13} aria-hidden />
                </span>
                <address className="not-italic leading-relaxed">
                  <strong className="font-normal text-[color:var(--color-text)]/85">
                    {brand.company.legalName}
                  </strong>
                  <br />
                  Company number {brand.company.number}
                  <br />
                  {brand.company.address.line1}, {brand.company.address.line2},
                  <br />
                  {brand.company.address.city}, {brand.company.address.region},{" "}
                  {brand.company.address.postcode}, {brand.company.address.country}
                </address>
              </span>
            </div>
          </div>

          {/* Four soft-accordion columns */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-0 sm:grid-cols-2 lg:grid-cols-4">
            {groups.map((g) => (
              <LinkGroup key={g.key} group={g} />
            ))}
          </div>
        </div>
      </div>

      {/* ── 3 · TRUST & REASSURANCE ROW ───────────────────────────── */}
      <div className="border-b border-[color:var(--color-bronze)]/15">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-8">
          {/* Reassurance chips */}
          <div className="flex flex-wrap items-center gap-2">
            {reassuranceChips.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-bronze)]/25 px-3.5 py-2 text-[12px] text-[color:var(--color-text)]/80"
              >
                <Icon size={13} aria-hidden className="shrink-0 text-[color:var(--color-bronze)]" />
                {label}
              </span>
            ))}
          </div>

          {/* Payments + social */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { src: visaLogo, alt: "Visa", height: 20 },
              { src: mastercardLogo, alt: "Mastercard", height: 18 },
              { src: pciDssLogo, alt: "PCI DSS Compliant", height: 24 },
            ].map(({ src, alt, height }) => (
              <span
                key={alt}
                className="inline-flex h-9 items-center rounded-lg bg-[#F4EFE8] px-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src.src}
                  alt={alt}
                  style={{ height, width: "auto", maxWidth: "none", display: "inline-block" }}
                  className="shrink-0"
                />
              </span>
            ))}
            <span className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[color:var(--color-bronze)]/25 px-3 text-[11px] text-[color:var(--color-text)]/80">
              <ShieldCheck size={12} aria-hidden className="text-[color:var(--color-teal,var(--color-success))]" />
              256-bit SSL
            </span>
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--color-bronze)]/25 text-[color:var(--color-text)]/80 transition-all hover:border-[color:var(--color-bronze)] hover:text-[color:var(--color-bronze)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-bronze)]/40"
              >
                <Icon size={14} aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4 · SOFT LEGAL BAR ────────────────────────────────────── */}
      <div className="text-[color:var(--color-text)]/60">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-7 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex flex-col gap-1.5 text-[12px]">
            <p>{t("copyright", { year: currentYear, storeName: brand.displayName })}</p>
            <p className="text-[11px] text-[color:var(--color-text)]/45">{brandLegalLine}</p>
            <p className="text-[11px] text-[color:var(--color-text)]/45">
              This is an adults-only boutique. You must be 18 or older to shop with us.
            </p>
          </div>

          <div className="flex flex-col gap-2.5 md:items-end">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-bronze)]/25 px-3.5 py-1.5 text-[11px] text-[color:var(--color-text)]/80">
              <Globe size={12} aria-hidden className="text-[color:var(--color-bronze)]" />
              <span>Estonia · English · {currency} {symbol}</span>
            </div>
            <nav aria-label="Legal" className="flex flex-wrap items-center gap-4">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[12px] text-[color:var(--color-text)]/55 transition-colors hover:text-[color:var(--color-bronze)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useMemo } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Link } from "@/i18n/routing";
import {
  ArrowRight,
  Sparkles,
  PackageOpen,
  HeartHandshake,
  Lock,
  Star,
} from "lucide-react";
import { PriceDisplay } from "@/components/shared/PriceDisplay/PriceDisplay";
import { getProductImage } from "@/lib/utils/product-image";
import type { HomepageProduct } from "@/lib/homepage-products";

/**
 * FeruToys hero — a full-bleed editorial statement.
 *
 * The imagery spans the entire page width (edge to edge, no container) and
 * carries the headline on top of a candlelit scrim. Below it sit a curated
 * collection rail and a discreet trust ribbon.
 *
 * Data contract preserved: the parent passes `slides` and `deals` (BannerData[]);
 * the first usable banner supplies the backdrop image and copy, otherwise the
 * editorial defaults below are used.
 */

interface BannerLike {
  id?: string;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  linkUrl?: string | null;
  ctaLabel?: string | null;
  badgeText?: string | null;
}

interface Props {
  slides?: unknown[];
  deals?: unknown[];
  /** Pool the picks rail draws from — one product per distinct category. */
  products?: HomepageProduct[];
}

/** How many product picks the rail shows. */
const PICK_COUNT = 8;

/** Art-directed boutique backdrop — fixed, so CMS banner art can't override it. */
const HERO_IMAGE = "/cover.jpg";

const HERO_FALLBACK = {
  badge: "The Midnight Edit",
  title: "Desire, dressed in silk.",
  subtitle:
    "An intimate boutique of body-safe pleasure, wellness and lingerie — curated slowly, wrapped discreetly, delivered without a word.",
  href: "/catalog",
  cta: "Explore the collection",
};

const trust = [
  { icon: PackageOpen, label: "Plain, unmarked parcels" },
  { icon: HeartHandshake, label: "Body-safe by standard" },
  { icon: Lock, label: "Private, secure checkout" },
  { icon: Star, label: "Loved by 12,000 people" },
];

function isBannerLike(v: unknown): v is BannerLike {
  return typeof v === "object" && v !== null;
}

export function HeroCarousel({ slides, deals, products }: Props) {
  const prefersReduced = useReducedMotion();

  // One product per distinct category, so the rail reads as a spread across
  // the store rather than eight variations of the same thing.
  const picks = useMemo(() => {
    const seen = new Set<string>();
    const out: HomepageProduct[] = [];

    for (const product of products ?? []) {
      const category = product.categories?.[0]?.category;
      const key = category?.slug ?? product.id;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(product);
      if (out.length === PICK_COUNT) break;
    }
    return out;
  }, [products]);

  const hero = useMemo(() => {
    const pool = [
      ...(Array.isArray(slides) ? slides : []),
      ...(Array.isArray(deals) ? deals : []),
    ].filter(isBannerLike);

    const first = pool.find((b) => (b.title ?? "").trim().length > 0);
    if (!first) return HERO_FALLBACK;

    return {
      badge: first.badgeText?.trim() || HERO_FALLBACK.badge,
      title: first.title?.trim() || HERO_FALLBACK.title,
      subtitle:
        first.subtitle?.trim() ||
        first.description?.trim() ||
        HERO_FALLBACK.subtitle,
      href: first.linkUrl?.trim() || HERO_FALLBACK.href,
      cta: first.ctaLabel?.trim() || HERO_FALLBACK.cta,
    };
  }, [slides, deals]);

  const isDefaultCopy = hero.title === HERO_FALLBACK.title;

  const rise: Variants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 18 },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReduced ? 0 : 0.8,
        delay: prefersReduced ? 0 : 0.09 * i,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <section
      className="relative w-full bg-[color:var(--color-bg)]"
      aria-label="FeruToys — featured"
    >
      {/* ── FULL-BLEED backdrop ─────────────────────────────────────── */}
      <div className="relative flex min-h-[clamp(560px,84svh,860px)] w-full items-end overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute inset-0"
          initial={{ scale: prefersReduced ? 1 : 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: prefersReduced ? 0 : 14, ease: "easeOut" }}
        >
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>

        {/* Candlelit scrims — keep the type legible over any photograph */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[rgba(20,12,16,0.94)] via-[rgba(20,12,16,0.62)] to-[rgba(20,12,16,0.18)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color:var(--color-bg)] via-[rgba(20,12,16,0.35)] to-[rgba(20,12,16,0.55)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_82%_28%,var(--color-primary-glow)_0%,transparent_62%)]"
        />
        <div
          aria-hidden
          className="warm-dots pointer-events-none absolute inset-0 opacity-25"
        />

        {/* ── Copy ── */}
        <div className="relative mx-auto w-full max-w-[1280px] px-4 pb-16 pt-28 sm:px-6 md:pb-24 md:pt-36 lg:px-8">
          <div className="max-w-[680px]">
            <motion.span
              custom={0}
              variants={rise}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.26em] text-[color:var(--color-bronze)]"
            >
              <span className="inline-block h-px w-9 bg-[color:var(--color-bronze)]" />
              {hero.badge}
              <Sparkles size={12} />
            </motion.span>

            <motion.h1
              custom={1}
              variants={rise}
              initial="hidden"
              animate="show"
              className="editorial-heading mt-7 text-balance text-[2.9rem] leading-[1] text-[#F6ECEC] sm:text-[3.4rem] md:text-[4.1rem] lg:text-[4.7rem]"
            >
              {isDefaultCopy ? (
                <>
                  Desire,{" "}
                  {/* italic serif overhangs its box — pad the trailing edge */}
                  <span
                    className="mr-[0.06em] italic text-[color:var(--color-primary-hover)]"
                    style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}
                  >
                    dressed
                  </span>{" "}
                  in silk.
                </>
              ) : (
                hero.title
              )}
            </motion.h1>

            <motion.p
              custom={2}
              variants={rise}
              initial="hidden"
              animate="show"
              className="mt-7 max-w-[540px] text-[16.5px] leading-[1.75] text-[#D8C4CB] md:text-[18px]"
            >
              {hero.subtitle}
            </motion.p>

            <motion.div
              custom={3}
              variants={rise}
              initial="hidden"
              animate="show"
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <Link
                href={hero.href}
                className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--color-primary)] px-8 py-4 text-[14.5px] font-semibold text-[color:var(--color-primary-fg)] shadow-[var(--shadow-glow-amber)] transition-all hover:bg-[color:var(--color-primary-hover)] hover:shadow-[var(--shadow-accent)]"
              >
                {hero.cta}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(246,236,236,0.28)] bg-[rgba(20,12,16,0.35)] px-7 py-4 text-[14.5px] font-semibold text-[#F6ECEC] backdrop-blur-sm transition-colors hover:border-[color:var(--color-primary-hover)] hover:text-[color:var(--color-primary-hover)]"
              >
                Browse the catalog
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Picks rail — one product per category ───────────────────── */}
      {picks.length > 0 && (
        <div className="relative mx-auto max-w-[1280px] px-4 pt-10 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-block h-px w-9 bg-[color:var(--color-bronze)]" />
              <span className="eyebrow">Handpicked across the boutique</span>
            </div>
            <Link
              href="/catalog"
              className="group inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-primary)]"
            >
              Browse everything
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto px-4 pb-8 sm:mx-0 sm:px-0">
            {picks.map((p) => {
              const price = Number(p.price);
              const comparePrice = p.comparePrice ? Number(p.comparePrice) : null;
              const category = p.categories?.[0]?.category;

              return (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className="group flex w-[168px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-[color:var(--color-hairline)] bg-[color:var(--color-bg-elevated)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-primary)]/40 hover:shadow-[var(--shadow-accent)] sm:w-[196px]"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-[color:var(--color-bg-tertiary)]">
                    <Image
                      src={getProductImage(p.images?.[0]?.url, p.name)}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 168px, 196px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {comparePrice && comparePrice > price && (
                      <span className="absolute left-2.5 top-2.5 rounded-full bg-[color:var(--color-primary)] px-2.5 py-1 font-mono text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-primary-fg)]">
                        Sale
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-1.5 p-3.5">
                    {category && (
                      <span className="truncate font-mono text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-bronze)]">
                        {category.name}
                      </span>
                    )}
                    <span className="line-clamp-2 text-[13.5px] font-medium leading-snug text-[color:var(--color-text)]">
                      {p.name}
                    </span>
                    <PriceDisplay
                      price={price}
                      comparePrice={comparePrice}
                      size="sm"
                      className="mt-auto pt-1.5"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Discreet trust ribbon ───────────────────────────────────── */}
      <div className="relative border-y border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)]/60">
        <div className="mx-auto max-w-[1280px] px-4 py-4 sm:px-6 lg:px-8">
          <ul className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-center sm:justify-between">
            {trust.map((t, i) => (
              <li key={t.label} className="flex items-center">
                {i > 0 && (
                  <span
                    aria-hidden
                    className="mx-3 hidden h-3.5 w-px bg-[color:var(--color-bronze)]/50 sm:inline-block"
                  />
                )}
                <span className="inline-flex items-center gap-2 px-2 font-mono text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-secondary)]">
                  <t.icon
                    size={13}
                    className={
                      t.icon === Lock
                        ? "text-[color:var(--color-teal)]"
                        : "text-[color:var(--color-bronze)]"
                    }
                  />
                  {t.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

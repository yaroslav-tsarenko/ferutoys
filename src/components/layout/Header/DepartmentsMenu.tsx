"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronRight, Lock, X } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { DEPARTMENTS, FACETS } from "./taxonomy";
import { useFocusTrap } from "./useFocusTrap";

export function DepartmentsMenu({
  open,
  onClose,
  counts,
}: {
  open: boolean;
  onClose: () => void;
  counts: Record<string, number>;
}) {
  const router = useRouter();
  const [activeSlug, setActiveSlug] = useState(DEPARTMENTS[0].slug);
  const trapRef = useFocusTrap<HTMLDivElement>(open);

  useEffect(() => {
    if (!open) return;
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  const active = DEPARTMENTS.find((d) => d.slug === activeSlug) ?? DEPARTMENTS[0];

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — sits under the sticky header so the bar stays visible */}
          <motion.div
            className="fixed inset-0 z-30 hidden bg-[#0F0D0B]/55 backdrop-blur-sm lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={trapRef}
            role="dialog"
            aria-label="Shop FeruToys by department"
            className="absolute inset-x-0 top-full z-40 hidden px-4 pb-6 sm:px-6 lg:block lg:px-8"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="mx-auto mt-2 max-w-[1280px] overflow-hidden rounded-2xl border border-[color:var(--color-violet)]/25 bg-[color:var(--color-bg-elevated)] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.6),0_0_40px_-16px_var(--color-primary-glow)]">
              <div className="grid grid-cols-[260px_minmax(0,1fr)_280px]">
                {/* Left rail — departments */}
                <nav
                  aria-label="Departments"
                  className="border-r border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] py-3"
                >
                  <div className="flex items-center justify-between px-5 pb-2">
                    <span className="eyebrow">Departments</span>
                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="Close departments menu"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-bg-elevated)] hover:text-[color:var(--color-primary)]"
                    >
                      <X size={14} aria-hidden />
                    </button>
                  </div>
                  <ul className="max-h-[420px] overflow-y-auto">
                    {DEPARTMENTS.map((d) => {
                      const isActive = d.slug === activeSlug;
                      return (
                        <li key={d.slug}>
                          <button
                            type="button"
                            onMouseEnter={() => setActiveSlug(d.slug)}
                            onFocus={() => setActiveSlug(d.slug)}
                            onClick={() => go(`/catalog/${d.slug}`)}
                            aria-expanded={isActive}
                            className={[
                              "group flex w-full items-center justify-between gap-2 px-5 py-2.5 text-left text-[13.5px] font-semibold transition-colors",
                              isActive
                                ? "bg-[color:var(--color-bg-elevated)] text-[color:var(--color-primary)] shadow-[inset_2px_0_0_0_var(--color-bronze)]"
                                : "text-[color:var(--color-text)] hover:bg-[color:var(--color-bg-elevated)]",
                            ].join(" ")}
                          >
                            <span className="inline-flex min-w-0 items-center gap-2.5">
                              <d.Icon
                                size={15}
                                strokeWidth={1.75}
                                aria-hidden
                                className={
                                  isActive
                                    ? "shrink-0 text-[color:var(--color-bronze)]"
                                    : "shrink-0 text-[color:var(--color-text-tertiary)] group-hover:text-[color:var(--color-bronze)]"
                                }
                              />
                              <span className="truncate">{d.name}</span>
                            </span>
                            <ChevronRight
                              size={12}
                              aria-hidden
                              className={
                                isActive
                                  ? "shrink-0 text-[color:var(--color-bronze)]"
                                  : "shrink-0 text-[color:var(--color-text-tertiary)] opacity-0 transition-opacity group-hover:opacity-100"
                              }
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                {/* Middle — active department sub-categories */}
                <div className="flex flex-col px-7 py-6">
                  <Link
                    href={`/catalog/${active.slug}`}
                    onClick={onClose}
                    className="group inline-flex items-center gap-2 font-display text-[22px] font-semibold tracking-tight text-[color:var(--color-text)] transition-colors hover:text-[color:var(--color-primary)]"
                  >
                    {active.name}
                    <ArrowRight
                      size={16}
                      aria-hidden
                      className="text-[color:var(--color-bronze)] transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                  <p className="mt-1 max-w-md text-[13px] leading-relaxed text-[color:var(--color-text-secondary)]">
                    {active.tagline}
                  </p>
                  <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-0.5">
                    {active.subs.map((sub) => {
                      const count = counts[sub.slug];
                      return (
                        <li key={sub.label}>
                          <Link
                            href={`/catalog/${sub.slug}`}
                            onClick={onClose}
                            className="group flex items-center justify-between rounded-lg px-2 py-1.5 text-[13.5px] text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-primary-tint)] hover:text-[color:var(--color-primary)]"
                          >
                            <span>{sub.label}</span>
                            {count ? (
                              <span className="spec-value text-[11px] text-[color:var(--color-text-tertiary)]">
                                {count}
                              </span>
                            ) : (
                              <ChevronRight
                                size={11}
                                aria-hidden
                                className="opacity-0 transition-opacity group-hover:opacity-100"
                              />
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Right — curated editorial promo tile */}
                <div className="p-4 pl-0">
                  <Link
                    href={active.promo.href}
                    onClick={onClose}
                    className="group relative flex h-full min-h-[280px] flex-col justify-between overflow-hidden rounded-2xl border border-[color:var(--color-violet)]/25 bg-[image:var(--gradient-hero)] p-5"
                  >
                    <div aria-hidden className="warm-dots pointer-events-none absolute inset-0 opacity-40" />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[color:var(--color-primary-glow)] blur-2xl"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-[color:var(--color-bronze-tint)] blur-2xl"
                    />
                    <div className="relative z-10">
                      <span className="mb-3 inline-flex w-fit items-center rounded-full bg-[color:var(--color-primary)] px-2.5 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-primary-fg)]">
                        {active.promo.badge}
                      </span>
                      <div className="font-display text-[20px] font-semibold leading-tight tracking-tight text-[color:var(--color-text)]">
                        {active.promo.title}
                      </div>
                      <div className="mt-1.5 text-[13px] leading-relaxed text-[color:var(--color-text)]/75">
                        {active.promo.subtitle}
                      </div>
                    </div>
                    <div className="relative z-10 mt-4 inline-flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-bronze)] transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none">
                      Discover <ArrowRight size={12} aria-hidden />
                    </div>
                  </Link>
                </div>
              </div>

              {/* Footer — facet rail + reassurance */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)]/60 px-6 py-3.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  {FACETS.map((f) => (
                    <Link
                      key={f.label}
                      href={f.href}
                      onClick={onClose}
                      className="inline-flex items-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] px-3 py-1 text-[12px] font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-bronze)] hover:text-[color:var(--color-bronze)]"
                    >
                      {f.label}
                    </Link>
                  ))}
                </div>
                <p className="inline-flex items-center gap-1.5 whitespace-nowrap text-[11.5px] text-[color:var(--color-teal)]">
                  <Lock size={12} aria-hidden /> Discreet packaging &amp; private, secure checkout
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

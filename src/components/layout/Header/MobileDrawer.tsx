"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  GitCompare,
  Heart,
  HelpCircle,
  Package,
  Shield,
  ShieldCheck,
  ShoppingBag,
  User as UserIcon,
  X,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useAuth } from "@/providers/AuthProvider";
import { FeruToysLogo } from "../FeruToysLogo";
import { CurrencySwitcher } from "./CurrencySwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBox } from "./SearchBox";
import { DEPARTMENTS, QUICK_LINKS } from "./taxonomy";
import { useFocusTrap } from "./useFocusTrap";
import { brand } from "@/lib/brand";

export function MobileDrawer({
  open,
  onClose,
  counts,
  itemCount,
}: {
  open: boolean;
  onClose: () => void;
  counts: Record<string, number>;
  itemCount: number;
}) {
  const { user, role } = useAuth();
  const [expanded, setExpanded] = useState<string | null>(null);
  const trapRef = useFocusTrap<HTMLElement>(open);

  useEffect(() => {
    if (!open) return;
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-[#0F0D0B]/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            ref={trapRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${brand.displayName} menu`}
            className="fixed inset-y-0 left-0 z-50 flex w-[92%] max-w-sm flex-col bg-[color:var(--color-bg)] shadow-xl lg:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex items-center justify-between border-b border-[color:var(--color-bronze)]/25 px-4 py-3.5">
              <Link href="/" onClick={onClose} aria-label={`${brand.displayName} — home`}>
                <FeruToysLogo size={19} />
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                data-autofocus
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-bg-secondary)] hover:text-[color:var(--color-primary)]"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            {/* Search — pinned at top */}
            <div className="border-b border-[color:var(--color-border)] px-4 py-3">
              <SearchBox variant="mobile" onNavigate={onClose} />
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3">
              {/* Quick shortcuts */}
              <div className="mb-3 flex flex-wrap gap-1.5 px-1">
                {QUICK_LINKS.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={onClose}
                    className="inline-flex items-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] px-3 py-1.5 text-[12px] font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-bronze)] hover:text-[color:var(--color-bronze)]"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>

              {/* Departments — soft accordions */}
              <div className="px-1 pb-1 pt-2">
                <span className="eyebrow">Departments</span>
              </div>
              <ul>
                {DEPARTMENTS.map((d) => {
                  const isOpen = expanded === d.slug;
                  return (
                    <li key={d.slug} className="border-b border-[color:var(--color-border)]/70">
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : d.slug)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-3 rounded-xl px-2 py-3 text-left text-[14px] font-semibold text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-bg-secondary)]"
                      >
                        <span className="inline-flex items-center gap-3">
                          <d.Icon
                            size={16}
                            strokeWidth={1.75}
                            aria-hidden
                            className="text-[color:var(--color-bronze)]"
                          />
                          {d.name}
                        </span>
                        <ChevronDown
                          size={14}
                          aria-hidden
                          className={`text-[color:var(--color-text-tertiary)] transition-transform motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <ul className="flex flex-col gap-0.5 pb-3 pl-10 pr-2">
                              <li>
                                <Link
                                  href={`/catalog/${d.slug}`}
                                  onClick={onClose}
                                  className="block rounded-lg px-2 py-1.5 text-sm font-semibold text-[color:var(--color-primary)]"
                                >
                                  Shop all {d.short}
                                </Link>
                              </li>
                              {d.subs.map((sub) => (
                                <li key={sub.label}>
                                  <Link
                                    href={`/catalog/${sub.slug}`}
                                    onClick={onClose}
                                    className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-bg-secondary)]"
                                  >
                                    {sub.label}
                                    {counts[sub.slug] ? (
                                      <span className="spec-value text-[10px] text-[color:var(--color-text-tertiary)]">
                                        {counts[sub.slug]}
                                      </span>
                                    ) : null}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>

              {/* Account / saved / basket */}
              <div className="mt-4 px-1 pb-1">
                <span className="eyebrow">Your boutique</span>
              </div>
              <ul className="flex flex-col gap-0.5">
                {[
                  { href: "/account", label: user ? "My account" : "Members / Sign in", icon: UserIcon },
                  { href: "/account/orders", label: "My orders", icon: Package },
                  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
                  { href: "/account/wishlist", label: "Saved edits", icon: GitCompare },
                  { href: "/cart", label: `Basket${itemCount > 0 ? ` (${itemCount})` : ""}`, icon: ShoppingBag },
                  { href: "/contact", label: "Private concierge", icon: HelpCircle },
                ].map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm font-semibold text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-bg-secondary)]"
                    >
                      <l.icon size={15} strokeWidth={1.75} aria-hidden className="text-[color:var(--color-primary)]" />
                      {l.label}
                    </Link>
                  </li>
                ))}
                {user && (role === "ADMIN" || role === "SUPER_ADMIN") && (
                  <li>
                    <NextLink
                      href="/admin"
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm font-semibold text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-bg-secondary)]"
                    >
                      <Shield size={15} strokeWidth={1.75} aria-hidden className="text-[color:var(--color-primary)]" />
                      Admin panel
                    </NextLink>
                  </li>
                )}
              </ul>

              {/* Reassurance */}
              <div className="mt-4 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] p-3.5">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-[color:var(--color-teal)]">
                  <ShieldCheck size={14} aria-hidden /> Private &amp; discreet
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-[color:var(--color-text-secondary)]">
                  Unbranded packaging · Free EU delivery over €40 · Secure, private checkout.
                </p>
                <span className="mt-2 inline-flex items-center rounded-full border border-[color:var(--color-bronze)]/40 bg-[color:var(--color-bronze-tint)] px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-bronze)]">
                  18+ Adults only
                </span>
              </div>
            </div>

            {/* Footer — auth + preferences */}
            <div className="border-t border-[color:var(--color-border)] px-4 py-3.5">
              {!user && (
                <div className="mb-3 grid grid-cols-2 gap-2">
                  <Link
                    href="/auth/login"
                    onClick={onClose}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--color-primary)] text-sm font-semibold text-[color:var(--color-primary-fg)] transition-colors hover:bg-[color:var(--color-primary-hover)]"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={onClose}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--color-primary)] text-sm font-semibold text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-primary-tint)]"
                  >
                    Create account
                  </Link>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] px-1.5 py-1">
                  <CurrencySwitcher />
                </div>
                <div className="text-[color:var(--color-text)]">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

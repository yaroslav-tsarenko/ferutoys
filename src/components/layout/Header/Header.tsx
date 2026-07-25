"use client";

import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  GitCompare,
  Heart,
  HelpCircle,
  Leaf,
  Lock,
  Menu,
  Package,
  Search,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  User as UserIcon,
  X,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/routing";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useCurrency } from "@/providers/CurrencyProvider";
import { brand } from "@/lib/brand";
import { FeruToysLogo } from "../FeruToysLogo";
import { ThemeToggle } from "./ThemeToggle";
import { CurrencySwitcher } from "./CurrencySwitcher";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SearchBox } from "./SearchBox";
import { DepartmentsMenu } from "./DepartmentsMenu";
import { MobileDrawer } from "./MobileDrawer";
import { QUICK_LINKS } from "./taxonomy";

interface ApiCategory {
  slug: string;
  _count?: { products: number };
  children?: ApiCategory[];
}

const RIBBON_MESSAGES = [
  { icon: Truck, text: "Free EU delivery over €40 · Delivered discreetly" },
  { icon: Package, text: "Discreet, unbranded packaging on every order" },
  { icon: Lock, text: "Secure & private checkout — your details stay yours" },
  { icon: Leaf, text: "Body-safe materials, chosen with care" },
];

function flattenCounts(cats: ApiCategory[], into: Record<string, number>) {
  for (const c of cats) {
    if (c._count?.products) into[c.slug] = c._count.products;
    if (c.children?.length) flattenCounts(c.children, into);
  }
}

/** Masthead nav — Bodoni small-caps, hairline underline on hover. */
const navLinkClass =
  "font-brand text-[13px] uppercase tracking-[0.2em] text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text)]";

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { itemCount, cartBounce, cart, removeItem } = useCart();
  const { user, role } = useAuth();
  const { symbol, convert } = useCurrency();

  const [scrolled, setScrolled] = useState(false);
  const [deptOpen, setDeptOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [ribbonIdx, setRibbonIdx] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        // Hysteresis keeps the header from flip-flopping as its own collapse
        // shifts the page height.
        setScrolled((prev) => (prev ? y > 2 : y > 8));
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen || deptOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, deptOpen]);

  useEffect(() => {
    const timer = setInterval(
      () => setRibbonIdx((i) => (i + 1) % RIBBON_MESSAGES.length),
      5000,
    );
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const map: Record<string, number> = {};
          flattenCounts(data, map);
          setCounts(map);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSearchOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const items = cart.items;
  const subtotal = cart.subtotal;
  const RibbonIcon = RIBBON_MESSAGES[ribbonIdx].icon;

  return (
    <MotionConfig reducedMotion="user">
      <header
        role="banner"
        className={[
          "sticky top-0 z-40 w-full transition-shadow duration-300",
          scrolled
            ? "glass shadow-[0_1px_0_0_var(--color-hairline),0_16px_40px_-28px_rgba(0,0,0,0.7)]"
            : "bg-[color:var(--color-bg)]",
        ].join(" ")}
      >
        {/* ── Utility strip — discreet promises + shop preferences ───── */}
        {!scrolled && (
          <div className="border-b border-[color:var(--color-bronze)]/15">
            <div className="mx-auto flex h-9 max-w-[1400px] items-center gap-3 px-4 sm:px-6 lg:px-10">
              <span
                className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.22em] text-[color:var(--color-bronze)]"
                title="For adults aged 18 and over"
              >
                18+
              </span>
              <span
                aria-hidden
                className="hidden h-3 w-px bg-[color:var(--color-bronze)]/25 sm:block"
              />
              <span className="hidden items-center gap-1.5 whitespace-nowrap font-mono text-[9.5px] uppercase tracking-[0.18em] text-[color:var(--color-violet)] sm:inline-flex">
                <ShieldCheck size={11} aria-hidden /> Private &amp; discreet
              </span>

              <div className="pointer-events-none flex min-w-0 flex-1 justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={ribbonIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="hidden min-w-0 items-center gap-1.5 truncate whitespace-nowrap font-mono text-[9.5px] uppercase tracking-[0.16em] text-[color:var(--color-text)]/60 md:inline-flex"
                  >
                    <RibbonIcon
                      size={11}
                      aria-hidden
                      className="shrink-0 text-[color:var(--color-bronze)]"
                    />
                    <span className="truncate">{RIBBON_MESSAGES[ribbonIdx].text}</span>
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="ml-auto flex shrink-0 items-center gap-1 text-[color:var(--color-text)]">
                <ThemeToggle />
                <span
                  aria-hidden
                  className="hidden h-3 w-px bg-[color:var(--color-bronze)]/25 sm:block"
                />
                <CurrencySwitcher />
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}

        {/* ── Masthead — utilities flank a centred wordmark ──────────── */}
        <div className="relative">
          <div
            className={[
              "mx-auto grid max-w-[1400px] grid-cols-[auto_1fr_auto] items-center gap-3 px-4 transition-[padding] duration-300 ease-out sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-4 lg:px-10",
              scrolled ? "py-2.5" : "py-5",
            ].join(" ")}
          >
            {/* Left — browsing entries */}
            <div className="flex items-center gap-1 justify-self-start">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-haspopup="dialog"
                aria-expanded={mobileOpen}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-primary-tint)] lg:hidden"
              >
                <Menu size={20} aria-hidden />
              </button>

              <button
                type="button"
                onClick={() => setDeptOpen((v) => !v)}
                aria-haspopup="dialog"
                aria-expanded={deptOpen}
                aria-label={`Browse ${brand.displayName} departments`}
                className={[
                  "hidden items-center gap-2.5 py-2 lg:inline-flex",
                  navLinkClass,
                  deptOpen ? "!text-[color:var(--color-primary)]" : "",
                ].join(" ")}
              >
                <span className="flex flex-col gap-[3px]" aria-hidden>
                  <span className="block h-px w-4 bg-current" />
                  <span className="block h-px w-4 bg-current" />
                  <span className="block h-px w-2.5 bg-current" />
                </span>
                Departments
              </button>

              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                aria-expanded={searchOpen}
                aria-label={searchOpen ? "Close search" : "Open search"}
                className={[
                  "ml-2 hidden items-center gap-2 py-2 lg:inline-flex",
                  navLinkClass,
                  searchOpen ? "!text-[color:var(--color-primary)]" : "",
                ].join(" ")}
              >
                {searchOpen ? (
                  <X size={15} aria-hidden />
                ) : (
                  <Search size={15} aria-hidden />
                )}
                Search
              </button>
            </div>

            {/* Centre — the wordmark carries the brand */}
            <Link
              href="/"
              aria-label={`${brand.displayName} — home`}
              className="justify-self-center"
            >
              <FeruToysLogo size={scrolled ? 20 : 27} />
            </Link>

            {/* Right — account, saved, basket */}
            <div className="flex items-center gap-0.5 justify-self-end">
              <button
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
                aria-label="Search"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-primary-tint)] lg:hidden"
              >
                <Search size={19} strokeWidth={1.5} aria-hidden />
              </button>

              <div
                ref={accountRef}
                className="relative hidden lg:block"
                onMouseEnter={() => setAccountOpen(true)}
                onMouseLeave={() => setAccountOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setAccountOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  aria-label={user ? "Account menu" : "Members — sign in"}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-primary-tint)] hover:text-[color:var(--color-primary)]"
                >
                  <UserIcon size={19} strokeWidth={1.5} aria-hidden />
                </button>
                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      role="menu"
                      aria-label="Account"
                      className="absolute right-0 top-full z-30 w-72 overflow-hidden rounded-2xl border border-[color:var(--color-violet)]/25 bg-[color:var(--color-bg-elevated)] p-2 shadow-lg"
                    >
                      {!user ? (
                        <>
                          <Link
                            href="/auth/login"
                            role="menuitem"
                            className="flex items-center justify-center rounded-xl bg-[color:var(--color-primary)] px-3 py-2.5 text-center text-[13px] font-semibold text-[color:var(--color-primary-fg)] transition-colors hover:bg-[color:var(--color-primary-hover)]"
                          >
                            Sign in
                          </Link>
                          <Link
                            href="/auth/register"
                            role="menuitem"
                            className="mt-1 flex items-center justify-center rounded-xl border border-[color:var(--color-border)] px-3 py-2.5 text-center text-[13px] font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                          >
                            Create account
                          </Link>
                          <div aria-hidden className="my-2 h-px bg-[color:var(--color-border)]" />
                        </>
                      ) : (
                        <div className="mb-2 rounded-xl bg-[color:var(--color-primary-tint)] p-3">
                          <div className="eyebrow">Signed in as</div>
                          <div className="mt-0.5 truncate text-sm font-semibold text-[color:var(--color-text)]">
                            {user.email}
                          </div>
                        </div>
                      )}
                      {[
                        { href: "/account", icon: UserIcon, label: "My account" },
                        { href: "/account/orders", icon: Package, label: "My orders" },
                        { href: "/account/wishlist", icon: Heart, label: "Wishlist" },
                        { href: "/account/wishlist", icon: GitCompare, label: "Saved edits" },
                        { href: "/contact", icon: HelpCircle, label: "Private concierge" },
                      ].map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          role="menuitem"
                          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-primary-tint)] hover:text-[color:var(--color-primary)]"
                        >
                          <item.icon size={14} aria-hidden className="text-[color:var(--color-primary)]" />
                          {item.label}
                        </Link>
                      ))}
                      {user && (role === "ADMIN" || role === "SUPER_ADMIN") && (
                        <NextLink
                          href="/admin"
                          role="menuitem"
                          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-primary-tint)] hover:text-[color:var(--color-primary)]"
                        >
                          <Shield size={14} aria-hidden className="text-[color:var(--color-primary)]" />
                          Admin panel
                        </NextLink>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/account/wishlist"
                aria-label="Wishlist"
                className="hidden h-10 w-10 items-center justify-center rounded-full text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-primary-tint)] hover:text-[color:var(--color-primary)] lg:inline-flex"
              >
                <Heart size={19} strokeWidth={1.5} aria-hidden />
              </Link>

              {/* Basket — brass hairline capsule, mini-cart on hover */}
              <div
                className="relative ml-1.5"
                onMouseEnter={() => setMiniCartOpen(true)}
                onMouseLeave={() => setMiniCartOpen(false)}
              >
                <Link
                  href="/cart"
                  aria-label={`${t("cart")}${itemCount > 0 ? ` — ${itemCount} items` : ""}`}
                  className="relative inline-flex h-10 items-center gap-2 rounded-full border border-[color:var(--color-bronze)]/45 px-3.5 text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-bronze)] hover:text-[color:var(--color-bronze)]"
                >
                  <span className="relative">
                    <ShoppingBag size={18} strokeWidth={1.5} aria-hidden />
                    {itemCount > 0 && (
                      <motion.span
                        key={cartBounce}
                        initial={cartBounce > 0 ? { scale: 0.5 } : false}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 10, stiffness: 400 }}
                        className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[color:var(--color-primary)] px-1 font-mono text-[9px] font-bold tabular-nums text-[color:var(--color-primary-fg)]"
                      >
                        {itemCount > 99 ? "99+" : itemCount}
                      </motion.span>
                    )}
                  </span>
                  <span className="spec-value hidden text-[12px] font-semibold sm:inline">
                    {symbol}
                    {convert(subtotal).toFixed(2)}
                  </span>
                </Link>

                <AnimatePresence>
                  {miniCartOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full z-30 hidden w-[340px] overflow-hidden rounded-2xl border border-[color:var(--color-violet)]/25 bg-[color:var(--color-bg-elevated)] p-4 shadow-lg lg:block"
                    >
                      <div className="flex items-center justify-between pb-3">
                        <span className="eyebrow">
                          Basket · {itemCount} item{itemCount === 1 ? "" : "s"}
                        </span>
                        <span className="spec-value text-[13px] font-bold text-[color:var(--color-primary)]">
                          {symbol}
                          {convert(subtotal).toFixed(2)}
                        </span>
                      </div>
                      {items.length === 0 ? (
                        <div className="py-8 text-center text-sm text-[color:var(--color-text-tertiary)]">
                          Your basket is empty
                        </div>
                      ) : (
                        <>
                          <ul className="max-h-72 space-y-2 overflow-y-auto">
                            {items.slice(0, 4).map((it) => (
                              <li
                                key={it.productId}
                                className="flex items-center gap-3 rounded-xl border border-[color:var(--color-border)] p-2"
                              >
                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[rgb(252,252,252)]">
                                  {it.imageUrl && (
                                    <Image
                                      src={it.imageUrl}
                                      alt={it.name}
                                      fill
                                      sizes="56px"
                                      className="object-contain p-1"
                                    />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="truncate text-xs font-semibold text-[color:var(--color-text)]">
                                    {it.name}
                                  </div>
                                  <div className="spec-value mt-0.5 text-[11px] text-[color:var(--color-text-tertiary)]">
                                    {it.quantity} × {symbol}
                                    {convert(it.price).toFixed(2)}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeItem(it.productId)}
                                  aria-label={`Remove ${it.name}`}
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-[color:var(--color-text-tertiary)] transition-colors hover:bg-[color:var(--color-primary-tint)] hover:text-[color:var(--color-primary)]"
                                >
                                  <Trash2 size={12} aria-hidden />
                                </button>
                              </li>
                            ))}
                          </ul>
                          {items.length > 4 && (
                            <div className="pt-2 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-bronze)]">
                              + {items.length - 4} more
                            </div>
                          )}
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <Link
                              href="/cart"
                              className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-border)] px-2 py-2.5 text-center text-[12px] font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                            >
                              View basket
                            </Link>
                            <Link
                              href="/checkout"
                              className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-primary)] px-2 py-2.5 text-center text-[12px] font-semibold text-[color:var(--color-primary-fg)] transition-colors hover:bg-[color:var(--color-primary-hover)]"
                            >
                              Checkout
                            </Link>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* ── Centred editorial nav ─────────────────────────────────── */}
          <nav
            aria-label="Quick shortcuts"
            className={[
              "hidden overflow-hidden border-t border-[color:var(--color-hairline)] transition-[max-height,opacity] duration-300 ease-out motion-reduce:transition-none lg:block",
              scrolled ? "max-h-0 border-t-0 opacity-0" : "max-h-14 opacity-100",
            ].join(" ")}
          >
            <ul className="mx-auto flex max-w-[1400px] items-center justify-center gap-9 px-4 py-3 sm:px-6 lg:px-10">
              {QUICK_LINKS.map((l) => {
                const active =
                  pathname === l.href.split("?")[0] && l.href.includes("/catalog/");
                return (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={[
                        navLinkClass,
                        "relative inline-block pb-1 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-[color:var(--color-bronze)] after:transition-transform hover:after:scale-x-100",
                        active
                          ? "!text-[color:var(--color-bronze)] after:scale-x-100"
                          : "",
                      ].join(" ")}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* ── Search panel — slides open beneath the masthead ───────── */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden border-t border-[color:var(--color-hairline)] bg-[color:var(--color-bg-secondary)]/70"
              >
                <div className="mx-auto max-w-[880px] px-4 py-5 sm:px-6">
                  <SearchBox />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Departments mega-panel — anchored to the masthead */}
          <DepartmentsMenu
            open={deptOpen}
            onClose={() => setDeptOpen(false)}
            counts={counts}
          />
        </div>
      </header>

      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        counts={counts}
        itemCount={itemCount}
      />
    </MotionConfig>
  );
}

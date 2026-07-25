"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, Clock, Search } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useCurrency } from "@/providers/CurrencyProvider";
import { DEPARTMENTS, RECENT_SEARCH_KEY } from "./taxonomy";

interface ProductHit {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  images?: { url: string }[];
}

interface Option {
  key: string;
  kind: "recent" | "product" | "dept";
  label: string;
  href?: string;
  product?: ProductHit;
}

export function SearchBox({
  variant = "desktop",
  onNavigate,
}: {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const { symbol, convert } = useCurrency();
  const listboxId = useId();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [fetched, setFetched] = useState<ProductHit[]>([]);
  const [recent, setRecent] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(RECENT_SEARCH_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Live product suggestions — debounced against the existing /api/search.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) return;
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}&limit=5`, {
        signal: ctrl.signal,
      })
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setFetched(data);
        })
        .catch(() => {});
    }, 220);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);

  const pushRecent = (q: string) => {
    setRecent((prev) => {
      const next = [q, ...prev.filter((v) => v !== q)].slice(0, 6);
      try {
        localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(next));
      } catch {
        /* noop */
      }
      return next;
    });
  };

  const close = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const submit = (q?: string) => {
    const value = (q ?? query).trim();
    if (!value) return;
    pushRecent(value);
    router.push(`/search?q=${encodeURIComponent(value)}`);
    close();
    onNavigate?.();
  };

  const options: Option[] = useMemo(() => {
    const products = query.trim().length >= 2 ? fetched : [];
    const opts: Option[] = [];
    if (query.trim().length < 2 && recent.length > 0) {
      for (const q of recent) {
        opts.push({ key: `recent-${q}`, kind: "recent", label: q });
      }
    }
    for (const p of products) {
      opts.push({
        key: `product-${p.id}`,
        kind: "product",
        label: p.name,
        href: `/product/${p.slug}`,
        product: p,
      });
    }
    for (const d of DEPARTMENTS.slice(0, query.trim().length >= 2 ? 3 : 6)) {
      opts.push({
        key: `dept-${d.slug}`,
        kind: "dept",
        label: d.name,
        href: `/catalog/${d.slug}`,
      });
    }
    return opts;
  }, [query, recent, fetched]);

  const selectOption = (opt: Option) => {
    if (opt.kind === "recent") {
      setQuery(opt.label);
      submit(opt.label);
      return;
    }
    if (opt.href) {
      router.push(opt.href);
      close();
      onNavigate?.();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      close();
      inputRef.current?.blur();
      return;
    }
    if (!open || options.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? options.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectOption(options[activeIndex]);
    }
  };

  const showPanel = open && options.length > 0;

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1">
      <form
        role="search"
        aria-label={`Search FeruToys`}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="group/search relative flex h-11 min-w-0 items-center rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-elevated)] pr-1 transition-all duration-200 focus-within:border-[color:var(--color-primary)] focus-within:shadow-[0_0_0_3px_var(--color-primary-glow)]"
      >
        <Search
          size={16}
          aria-hidden
          className="ml-4 shrink-0 text-[color:var(--color-text-tertiary)]"
        />

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined
          }
          aria-label="Search products"
          placeholder="Search pleasure, wellness, lingerie…"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={onKeyDown}
          className={[
            "min-w-0 flex-1 bg-transparent text-[14px] text-[color:var(--color-text)] placeholder:text-[color:var(--color-text-tertiary)] focus:outline-none",
            variant === "desktop" ? "px-3.5" : "pl-4 pr-2",
          ].join(" ")}
        />
        <button
          type="submit"
          aria-label="Search"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-primary)] text-[color:var(--color-primary-fg)] transition-colors hover:bg-[color:var(--color-primary-hover)]"
        >
          <Search size={15} aria-hidden />
        </button>
      </form>

      {showPanel && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-[color:var(--color-violet)]/25 bg-[color:var(--color-bg-elevated)] p-1.5 shadow-lg">
          <ul id={listboxId} role="listbox" aria-label="Search suggestions">
            {options.map((opt, i) => {
              const active = i === activeIndex;
              const rowClass = [
                "flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[13.5px] transition-colors",
                active
                  ? "bg-[color:var(--color-primary-tint)] text-[color:var(--color-primary)]"
                  : "text-[color:var(--color-text)] hover:bg-[color:var(--color-bg-secondary)]",
              ].join(" ");
              return (
                <li
                  key={opt.key}
                  id={`${listboxId}-${i}`}
                  role="option"
                  aria-selected={active}
                >
                  <button
                    type="button"
                    tabIndex={-1}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectOption(opt);
                    }}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={rowClass}
                  >
                    {opt.kind === "recent" && (
                      <Clock
                        size={13}
                        aria-hidden
                        className="shrink-0 text-[color:var(--color-text-tertiary)]"
                      />
                    )}
                    {opt.kind === "dept" && (
                      <ArrowRight
                        size={13}
                        aria-hidden
                        className="shrink-0 text-[color:var(--color-bronze)]"
                      />
                    )}
                    {opt.kind === "product" && (
                      <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-[rgb(252,252,252)]">
                        {opt.product?.images?.[0]?.url && (
                          <Image
                            src={opt.product.images[0].url}
                            alt=""
                            fill
                            sizes="36px"
                            className="object-contain p-0.5"
                          />
                        )}
                      </span>
                    )}
                    <span className="min-w-0 flex-1 truncate">{opt.label}</span>
                    {opt.kind === "product" && opt.product && (
                      <span className="spec-value shrink-0 text-[12px] text-[color:var(--color-bronze)]">
                        {symbol}
                        {convert(Number(opt.product.price)).toFixed(2)}
                      </span>
                    )}
                    {opt.kind === "recent" && (
                      <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--color-text-tertiary)]">
                        Recent
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

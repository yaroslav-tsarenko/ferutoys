"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/routing";
import { FeruToysLogo } from "@/components/layout/FeruToysLogo";
import { brand } from "@/lib/brand";
import { ShieldCheck, Lock } from "lucide-react";

const COOKIE = "ss_age_verified";
const EXIT_URL = "https://www.google.com";

function persistVerified(remember: boolean) {
  // Remember → a year-long cookie. Otherwise a session cookie so we re-ask on
  // the next fresh visit, plus sessionStorage to survive soft navigations.
  if (remember) {
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `${COOKIE}=true; path=/; max-age=${maxAge}; SameSite=Lax`;
  } else {
    document.cookie = `${COOKIE}=true; path=/; SameSite=Lax`;
    try {
      sessionStorage.setItem(COOKIE, "true");
    } catch {
      /* private mode — cookie still covers us */
    }
  }
}

/**
 * 18+ age-verification gate. Rendered on every page inside the locale layout,
 * which reads the confirmation cookie server-side and passes `initialVerified`
 * so verified shoppers never see a flash of the gate (SSR-safe).
 */
export function AgeGate({ initialVerified }: { initialVerified: boolean }) {
  const [open, setOpen] = useState(!initialVerified);
  const [remember, setRemember] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);

  // Confirm entry.
  const confirm = useCallback(() => {
    persistVerified(remember);
    setOpen(false);
  }, [remember]);

  // Decline → leave for a neutral safe destination.
  const decline = useCallback(() => {
    window.location.href = EXIT_URL;
  }, []);

  // Body scroll-lock + focus management + focus trap while the gate is open.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // Move focus into the dialog.
    primaryRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      // Esc must NOT bypass verification.
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (e.key !== "Tab") return;
      const card = cardRef.current;
      if (!card) return;
      const focusables = card.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 motion-safe:animate-[ssFade_.4s_ease]"
      aria-hidden={false}
    >
      {/* Dimmed, softly blurred backdrop hinting the boutique behind. */}
      <div className="absolute inset-0 bg-[#160C12]/80 backdrop-blur-xl" />

      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="agegate-title"
        aria-describedby="agegate-desc"
        className="relative w-full max-w-md overflow-hidden rounded-[24px] border border-[color:var(--color-bronze)]/25 bg-[color:var(--color-bg-elevated)] p-8 text-center shadow-2xl motion-safe:animate-[ssScaleIn_.45s_cubic-bezier(0.16,1,0.3,1)] sm:p-10"
        style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)" }}
      >
        {/* Candlelit glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(208,168,95,0.35), transparent 70%)" }}
        />

        <div className="relative flex flex-col items-center gap-6">
          <FeruToysLogo size={22} />

          <div className="space-y-2">
            <p className="eyebrow">Adults only · 18+</p>
            <h2
              id="agegate-title"
              className="font-display text-3xl font-medium leading-tight text-[color:var(--color-text)]"
            >
              Before you enter…
            </h2>
            <p
              id="agegate-desc"
              className="mx-auto max-w-sm text-sm leading-relaxed text-[color:var(--color-text-secondary)]"
            >
              {brand.displayName} is an intimate lifestyle boutique for adults. Please
              confirm you are 18 or older to continue. Everything ships in plain,
              discreet packaging.
            </p>
          </div>

          <p className="font-display text-lg text-[color:var(--color-text)]">
            Are you 18 or older?
          </p>

          <div className="flex w-full flex-col gap-3">
            <button
              ref={primaryRef}
              type="button"
              onClick={confirm}
              className="w-full rounded-full bg-[color:var(--color-primary)] px-6 py-3.5 text-sm font-semibold tracking-wide text-[color:var(--color-primary-fg)] transition-all hover:bg-[color:var(--color-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-bronze)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-bg-elevated)]"
            >
              Yes, I'm 18+ — enter
            </button>
            <button
              type="button"
              onClick={decline}
              className="w-full rounded-full border border-[color:var(--color-border)] px-6 py-3 text-sm font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-text-secondary)] hover:text-[color:var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-bronze)]"
            >
              No, take me back
            </button>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-[color:var(--color-text-secondary)]">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-[color:var(--color-border)] accent-[color:var(--color-primary)]"
            />
            Remember me on this device
          </label>

          <div className="flex flex-col items-center gap-2 border-t border-[color:var(--color-border)] pt-5 text-[11px] text-[color:var(--color-text-tertiary)]">
            <span className="inline-flex items-center gap-1.5">
              <Lock size={12} className="text-[color:var(--color-teal)]" />
              Private &amp; discreet — your visit stays between us.
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-[color:var(--color-teal)]" />
              By entering you agree to our{" "}
              <Link href="/terms" className="underline hover:text-[color:var(--color-primary)]">
                Terms
              </Link>{" "}
              &amp;{" "}
              <Link href="/privacy" className="underline hover:text-[color:var(--color-primary)]">
                Privacy
              </Link>
              .
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

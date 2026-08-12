"use client";

import { useRef } from "react";
import { Link } from "@/i18n/routing";
import { motion, useInView } from "framer-motion";
import { BookOpen, Calculator, FileText, ArrowUpRight } from "lucide-react";

const articles = [
  {
    icon: BookOpen,
    eyebrow: "Guide",
    title: "Choosing your first toy",
    desc: "A gentle, judgement-free starting point — what to look for and where to begin with confidence.",
    href: "/catalog/erotic-toys-kits-17158",
  },
  {
    icon: FileText,
    eyebrow: "Reference",
    title: "Body-safe materials, explained",
    desc: "Silicone, glass and steel — how to read materials so what you buy is always safe for your body.",
    href: "/catalog?search=body-safe",
  },
  {
    icon: Calculator,
    eyebrow: "Care",
    title: "Cleaning & caring for your pieces",
    desc: "Simple aftercare that keeps everything hygienic and lasting — plus the cleaners we recommend.",
    href: "/catalog/care-and-stimulation-clean-care-23420",
  },
];

export function KnowledgeHub() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section ref={ref}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[color:var(--color-line)] pb-6">
        <div className="flex max-w-2xl flex-col gap-2">
          <span className="eyebrow">Knowledge hub</span>
          <h2 className="font-serif text-3xl font-medium tracking-tight text-[color:var(--color-text)] sm:text-[40px]">
            Resources to help you spec right
          </h2>
          <p className="text-sm text-[color:var(--color-text-secondary)]">
            Warm, practical guidance to help you shop with confidence and care.
          </p>
        </div>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-primary)] transition-colors hover:text-[color:var(--color-primary-hover)]"
        >
          Browse the catalog <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {articles.map((a, i) => (
          <motion.div
            key={a.title}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: i * 0.08 }}
          >
            <Link
              href={a.href}
              className="group flex h-full flex-col gap-3 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)] p-6 transition-colors hover:border-[color:var(--color-primary)]"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--color-primary-tint)] text-[color:var(--color-primary)]">
                <a.icon size={20} />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
                {a.eyebrow}
              </span>
              <h3 className="font-serif text-xl font-medium leading-snug tracking-tight text-[color:var(--color-text)]">
                {a.title}
              </h3>
              <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                {a.desc}
              </p>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--color-primary)] transition-transform group-hover:translate-x-1">
                Read <ArrowUpRight size={14} />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

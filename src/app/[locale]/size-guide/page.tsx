import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Ruler, Heart, Droplet } from "lucide-react";

export const metadata: Metadata = {
  title: "Size & Materials Guide",
  description:
    "FeruToys size & materials guide — how to read toy dimensions, choose lingerie sizes, understand body-safe materials, and care for your intimate products.",
};

const TOY_SIZES = [
  { size: "Petite",   insertable: "7–11 cm",  girth: "2.5–3.5 cm", best: "New to toys · gentle exploration" },
  { size: "Standard", insertable: "11–15 cm", girth: "3.5–4.5 cm", best: "Most popular · everyday pleasure" },
  { size: "Large",    insertable: "15–19 cm", girth: "4.5–5.5 cm", best: "Confident users · fuller sensation" },
  { size: "XL",       insertable: "19 cm+",   girth: "5.5 cm+",    best: "Experienced · maximum fill" },
];

const LINGERIE_SIZES = [
  { size: "XS",  bust: "76–81",  waist: "58–63",  hips: "84–89" },
  { size: "S",   bust: "81–86",  waist: "63–68",  hips: "89–94" },
  { size: "M",   bust: "86–91",  waist: "68–74",  hips: "94–99" },
  { size: "L",   bust: "91–97",  waist: "74–81",  hips: "99–104" },
  { size: "XL",  bust: "97–104", waist: "81–89",  hips: "104–112" },
];

const MATERIALS = [
  {
    title: "Body-safe silicone",
    detail:
      "Non-porous, hypoallergenic and soft to the touch. Easy to clean and long-lasting. Use only water-based lubricant to protect the surface.",
  },
  {
    title: "Glass & metal",
    detail:
      "Non-porous and firm, ideal for temperature play. Compatible with all lubricants. Inspect for chips before each use and store padded.",
  },
  {
    title: "ABS hard plastic",
    detail:
      "Firm, smooth and non-porous. Common on bullet vibrators and wands. Works with any lubricant and wipes clean easily.",
  },
];

function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[color:var(--color-line)]">
      <table className="w-full min-w-[420px] border-collapse text-sm">
        <thead className="bg-[color:var(--color-bg-secondary)] text-left text-[color:var(--color-text)]">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="border-b border-[color:var(--color-line)] px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={
                i % 2 === 0
                  ? "bg-[color:var(--color-bg-elevated)]"
                  : "bg-[color:var(--color-bg)]"
              }
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`border-b border-[color:var(--color-line)] px-4 py-3 ${
                    j === 0
                      ? "font-mono font-semibold text-[color:var(--color-text)] tabular-nums"
                      : "text-[color:var(--color-text-secondary)]"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SizeGuidePage() {
  return (
    <div className="mx-auto w-full max-w-[var(--container-content)] px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-10 flex flex-col gap-3 border-b border-[color:var(--color-line)] pb-8 sm:mb-14">
        <span className="eyebrow">FeruToys · Guide</span>
        <h1 className="font-display text-[36px] font-semibold leading-tight tracking-tight text-[color:var(--color-text)] sm:text-[52px]">
          Size &amp; materials guide
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-[color:var(--color-text-secondary)] sm:text-lg">
          A gentle reference for the things people ask before they buy: how to
          read toy dimensions, choose the right lingerie size, understand
          body-safe materials and care for your products. If you&apos;re still
          unsure — email our team, we answer discreetly within 24 hours.
        </p>
      </div>

      {/* Toy dimensions */}
      <section className="mb-14">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <div>
            <span className="eyebrow">Toys</span>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-[color:var(--color-text)]">
              Reading toy dimensions
            </h2>
          </div>
          <Link
            href="/catalog/erotic-toys-vibrators-17172"
            className="hidden font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-primary)] hover:underline sm:inline-flex sm:items-center sm:gap-1"
          >
            Shop toys <ArrowRight size={14} />
          </Link>
        </div>
        <p className="mb-5 max-w-2xl text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
          <strong className="text-[color:var(--color-text)]">Insertable length</strong> is the
          usable length, not the total. <strong className="text-[color:var(--color-text)]">Girth</strong> is
          the diameter at the widest point. When in doubt, size down — comfort
          comes first.
        </p>
        <Table
          headers={["Size", "Insertable", "Girth (diameter)", "Best for"]}
          rows={TOY_SIZES.map((r) => [r.size, r.insertable, r.girth, r.best])}
        />
      </section>

      {/* Lingerie sizing */}
      <section className="mb-14">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <div>
            <span className="eyebrow">Apparel</span>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-[color:var(--color-text)]">
              Lingerie &amp; apparel sizing
            </h2>
          </div>
          <Link
            href="/catalog/erotic-clothing-women-s-erotic-clothing-23422-23422"
            className="hidden font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-primary)] hover:underline sm:inline-flex sm:items-center sm:gap-1"
          >
            Shop lingerie <ArrowRight size={14} />
          </Link>
        </div>
        <p className="mb-5 max-w-2xl text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
          Measurements are in centimetres. Measure over bare skin, keeping the
          tape snug but not tight. If you fall between sizes, choose the larger
          for a relaxed fit.
        </p>
        <Table
          headers={["Size", "Bust (cm)", "Waist (cm)", "Hips (cm)"]}
          rows={LINGERIE_SIZES.map((r) => [r.size, r.bust, r.waist, r.hips])}
        />
      </section>

      {/* Materials */}
      <section className="mb-14">
        <div className="mb-6 flex items-center gap-2 text-[color:var(--color-text)]">
          <Heart size={18} className="text-[color:var(--color-primary)]" />
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Body-safe materials
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {MATERIALS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)] p-5"
            >
              <h3 className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-primary)]">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Lubricant compatibility note */}
      <section className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)] p-6">
        <div className="mb-2 flex items-center gap-2 text-[color:var(--color-text)]">
          <Droplet size={16} className="text-[color:var(--color-primary)]" />
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em]">
            Lubricant &amp; care notes
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
          Use <strong className="text-[color:var(--color-text)]">water-based lubricant</strong> with
          silicone toys — silicone-based lubricant can degrade the surface.
          Glass, metal and ABS are compatible with all lubricants. Clean toys
          before and after each use with warm water and a suitable toy cleaner,
          let them dry fully, and store them apart in a clean, dry place.
        </p>
      </section>

      <div className="mt-10 flex items-center justify-center">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--color-primary)] px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-all hover:bg-[color:var(--color-primary-hover)]"
        >
          <Ruler size={13} /> Browse catalog <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}

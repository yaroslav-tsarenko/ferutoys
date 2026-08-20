import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { Heart, Truck, Shield, Award } from "lucide-react";

const values = [
  { icon: <Heart size={28} strokeWidth={1.5} />, title: "Judgement-Free", desc: "Pleasure and wellness are personal. We curate with care and respect, so you can explore intimacy on your own terms." },
  { icon: <Truck size={28} strokeWidth={1.5} />, title: "Discreet & Reliable", desc: "Every order ships in plain, neutral packaging with trusted carriers — private from the moment you check out to the moment it arrives." },
  { icon: <Shield size={28} strokeWidth={1.5} />, title: "Body-Safe Quality", desc: "We stock body-safe materials from trusted makers, chosen for comfort, safety and lasting quality." },
  { icon: <Award size={28} strokeWidth={1.5} />, title: "Private & Secure", desc: "Secure, private checkout and careful handling of your data — because your privacy is never an afterthought." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[var(--max-width)] px-4 pb-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center sm:mb-12">
          <span className="eyebrow">Our story</span>
          <h1 className="mb-4 mt-3 font-serif text-4xl font-medium tracking-tight text-[color:var(--color-text)] sm:text-5xl">
            About <span className="text-[color:var(--color-accent)]">FeruToys</span>
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-[color:var(--color-text-secondary)] sm:text-lg">
            We&apos;re a considered intimacy boutique based in Estonia, shipping across Europe. Our mission is to make pleasure, wellness and self-care feel welcoming, tasteful and free of judgement — chosen with care and delivered with discretion.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:mb-12 sm:grid-cols-2 sm:gap-5">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)] p-5 sm:p-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--color-primary-tint)] text-[color:var(--color-primary)]">
                {v.icon}
              </div>
              <h3 className="mb-2 text-[17px] font-semibold text-[color:var(--color-text)]">{v.title}</h3>
              <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)]">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-[color:var(--color-primary)] p-8 text-center text-[color:var(--color-primary-fg)] sm:p-10">
          <h2 className="mb-3 font-serif text-3xl font-medium tracking-tight sm:text-4xl">Our Promise</h2>
          <p className="mx-auto max-w-lg text-[15px] leading-relaxed opacity-90">
            We stand behind everything we sell. If something isn&apos;t right, we&apos;ll make it right — discreetly and without fuss. That&apos;s our promise to you.
          </p>
        </div>
      </div>
    </div>
  );
}

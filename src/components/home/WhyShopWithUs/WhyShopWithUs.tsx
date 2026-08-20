"use client";

import { Shield, Zap, Heart, RefreshCw, Award, Headphones } from "lucide-react";
import { motion } from "framer-motion";

const reasons = [
  {
    icon: Shield,
    title: "Secure shopping",
    desc: "Your data is protected with enterprise-grade encryption and secure payments.",
  },
  {
    icon: Zap,
    title: "Fast, discreet delivery",
    desc: "Free shipping on orders over €100, sent in plain, unmarked packaging.",
  },
  {
    icon: Heart,
    title: "Body-safe products",
    desc: "Every product is body-safe and sourced from trusted, vetted brands you can rely on.",
  },
  {
    icon: RefreshCw,
    title: "Easy returns",
    desc: "Changed your mind? Our voluntary 30-day return commitment has you covered, alongside your statutory rights.",
  },
  {
    icon: Award,
    title: "Private by design",
    desc: "Secure, private checkout and careful handling of your data — your privacy is never an afterthought.",
  },
  {
    icon: Headphones,
    title: "Caring support",
    desc: "Our team replies discreetly within 24 hours to help with anything you need.",
  },
];

export function WhyShopWithUs() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-[var(--container-content)] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center gap-2 border-b border-[color:var(--color-line)] pb-6 text-center">
          <span className="eyebrow">Why FeruToys</span>
          <h2 className="font-serif text-3xl font-medium tracking-tight text-[color:var(--color-text)] sm:text-[40px]">
            Why choose FeruToys
          </h2>
          <p className="max-w-xl text-sm text-[color:var(--color-text-secondary)]">
            Body-safe intimacy essentials with discreet delivery and caring support.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                className="flex flex-col gap-3 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)] p-6"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--color-primary-tint)] text-[color:var(--color-primary)]">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl font-medium tracking-tight text-[color:var(--color-text)]">
                  {reason.title}
                </h3>
                <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                  {reason.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

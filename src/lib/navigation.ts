/**
 * FeruToys — the single source of truth for the boutique's taxonomy.
 *
 * Header flyouts, the hero collection rail and the footer "Shop" columns all
 * read from here so the same warm, inclusive taxonomy stays coherent across the
 * whole shell. Labels are deliberately non-clinical and tasteful.
 *
 * Links point at real, working routes:
 *   - /catalog                       → full catalogue
 *   - /catalog/[slug]                → a live category (matched to DB slugs at runtime)
 *   - /search?q=…                    → curated audience / facet rails
 */

export type NavLink = { label: string; href: string };

export type Department = {
  key: string;
  label: string;
  /** Wide-tracked micro-label shown above the flyout heading. */
  eyebrow: string;
  /** One-line editorial line for the flyout. */
  blurb: string;
  /** Curated sub-categories. `slugHints` are matched against live categories. */
  links: NavLink[];
  /** A soft image-led promo tile inside the flyout. */
  promo: {
    title: string;
    copy: string;
    href: string;
    cta: string;
  };
};

const q = (term: string) => `/search?q=${encodeURIComponent(term)}`;
const cat = (slug: string) => `/catalog/${slug}`;

/** Shop-by-audience — inclusive of all genders and orientations. */
export const AUDIENCES: NavLink[] = [
  { label: "For Her", href: q("for her") },
  { label: "For Him", href: q("for him") },
  { label: "For Couples", href: q("couples") },
  { label: "For Everyone", href: "/catalog" },
  { label: "LGBTQ+ Friendly", href: q("inclusive") },
];

/** Cross-cutting facets used for rails and the footer. */
export const FACETS: NavLink[] = [
  { label: "New In", href: "/catalog?sort=newest" },
  { label: "Best Sellers", href: "/catalog?sort=popular" },
  { label: "Under £25", href: "/catalog?max=25" },
  { label: "Premium & Luxury", href: q("luxury") },
  { label: "Body-Safe Materials", href: q("body safe silicone") },
  { label: "Beginner-Friendly", href: q("beginner") },
  { label: "Deals", href: "/catalog?deals=1" },
];

export const DEPARTMENTS: Department[] = [
  {
    key: "toys",
    label: "Toys & Pleasure",
    eyebrow: "The pleasure edit",
    blurb: "Considered, body-safe design — quiet, powerful and beautifully made.",
    links: [
      { label: "Vibrators", href: q("vibrator") },
      { label: "Wands & Massagers", href: q("wand massager") },
      { label: "Dildos", href: q("dildo") },
      { label: "Anal & Prostate", href: q("anal prostate") },
      { label: "Couples' Toys", href: q("couples vibrator") },
      { label: "Cock Rings", href: q("ring") },
      { label: "Clitoral & Suction", href: q("clitoris suction") },
      { label: "Kegel & Pelvic Wellness", href: q("kegel pelvic") },
      { label: "App-Controlled / Smart", href: q("app remote") },
      { label: "Discreet & Travel", href: q("travel") },
    ],
    promo: {
      title: "Quiet luxury",
      copy: "Whisper-quiet, rechargeable and travel-ready.",
      href: q("luxury vibrator"),
      cta: "Discover premium",
    },
  },
  {
    key: "lingerie",
    label: "Lingerie & Apparel",
    eyebrow: "Considered lingerie",
    blurb: "From everyday soft to occasion pieces — in every size.",
    links: [
      { label: "Bras & Sets", href: q("lingerie set") },
      { label: "Bodysuits", href: q("bodysuit") },
      { label: "Robes & Sleepwear", href: q("robe") },
      { label: "Plus-Size", href: q("plus size lingerie") },
      { label: "Costumes & Roleplay", href: q("costume") },
      { label: "Accessories", href: q("lingerie accessory") },
    ],
    promo: {
      title: "Slow mornings",
      copy: "Silk robes and soft loungewear made to linger in.",
      href: q("silk robe"),
      cta: "Shop loungewear",
    },
  },
  {
    key: "play",
    label: "Sensual Play",
    eyebrow: "Tasteful play",
    blurb: "Beginner-friendly to advanced — soft restraints, blindfolds and kits.",
    links: [
      { label: "Restraints", href: q("restraints cuffs") },
      { label: "Blindfolds", href: q("blindfold") },
      { label: "Ticklers & Feathers", href: q("feather tickler") },
      { label: "Beginner Kits", href: q("bondage kit") },
      { label: "Impact", href: q("paddle whip") },
      { label: "Collars & Cuffs", href: q("collar cuffs") },
    ],
    promo: {
      title: "Start softly",
      copy: "Thoughtful introductory kits, curated for two.",
      href: q("beginner kit"),
      cta: "Explore kits",
    },
  },
  {
    key: "wellness",
    label: "Wellness & Essentials",
    eyebrow: "Body-safe wellness",
    blurb: "Lubricants, intimate care and calm — tested and body-considerate.",
    links: [
      { label: "Lubricants", href: q("lubricant") },
      { label: "Massage Oils & Candles", href: q("massage candle oil") },
      { label: "Intimate Care & Hygiene", href: q("intimate care") },
      { label: "Toy Cleaners", href: q("toy cleaner") },
      { label: "Condoms & Protection", href: q("condoms") },
      { label: "Arousal & Enhancers", href: q("arousal") },
    ],
    promo: {
      title: "The essentials",
      copy: "Everything to care for yourself and your toys.",
      href: q("intimate care"),
      cta: "Shop wellness",
    },
  },
  {
    key: "gifting",
    label: "Gifting & Sets",
    eyebrow: "Considered gifting",
    blurb: "Beautifully boxed curations, wrapped in discretion.",
    links: [
      { label: "Gift Sets", href: q("gift set") },
      { label: "Couples' Kits", href: q("couples kit") },
      { label: "Beginner Bundles", href: q("beginner bundle") },
      { label: "Gift Cards", href: "/gift-cards" },
      { label: "Date-Night Boxes", href: q("date night") },
    ],
    promo: {
      title: "Date-night boxes",
      copy: "A little occasion, thoughtfully assembled.",
      href: q("date night"),
      cta: "Find a gift",
    },
  },
];

/** Top-bar reassurance promises — rotated in the header utility strip. */
export const REASSURANCES: string[] = [
  "Plain, discreet packaging — always",
  "Free EU delivery over €40",
  "Secure & private checkout",
  "Body-safe materials only",
];

/** Footer link columns (kept coherent with the departments above). */
export const FOOTER_COLUMNS: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Shop by collection",
    links: [
      { label: "Toys & Pleasure", href: q("vibrator") },
      { label: "Lingerie & Apparel", href: q("lingerie") },
      { label: "Sensual Play", href: q("bondage") },
      { label: "Wellness & Essentials", href: q("lubricant") },
      { label: "Gifting & Sets", href: q("gift set") },
      { label: "New In", href: "/catalog?sort=newest" },
    ],
  },
  {
    heading: "Wellness & guides",
    links: [
      { label: "The FeruToys Journal", href: "/blog" },
      { label: "Beginner's guides", href: "/blog?topic=beginners" },
      { label: "Body-safe materials", href: "/blog?topic=materials" },
      { label: "Caring for your toys", href: "/blog?topic=care" },
      { label: "Inclusive pleasure", href: "/blog?topic=inclusive" },
    ],
  },
  {
    heading: "Customer care",
    links: [
      { label: "Discreet shipping", href: "/shipping" },
      { label: "Returns & exchanges", href: "/returns" },
      { label: "Secure payment", href: "/payment" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About FeruToys", href: "/about" },
      { label: "Our promise", href: "/about#promise" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
];

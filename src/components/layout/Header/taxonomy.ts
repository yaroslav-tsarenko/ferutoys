import {
  Users,
  Zap,
  Gem,
  Flame,
  HeartHandshake,
  Shirt,
  Feather,
  Droplets,
  Leaf,
  Gift,
} from "lucide-react";

export interface SubCategory {
  label: string;
  slug: string;
}

export interface Department {
  slug: string;
  name: string;
  short: string;
  Icon: React.ElementType;
  tagline: string;
  subs: SubCategory[];
  promo: { title: string; subtitle: string; href: string; badge: string };
}

/**
 * The full FeruToys category taxonomy — the single source of truth for the
 * Departments mega-menu, the mobile accordions and (later) the footer.
 * Labels are deliberately warm, inclusive and non-clinical.
 *
 * Slugs point at real vendor-feed categories where a confident match exists;
 * aspirational slugs with no DB category yet fall back gracefully — the
 * category page redirects unknown slugs to /catalog.
 */
export const DEPARTMENTS: Department[] = [
  {
    slug: "for-everyone",
    name: "Shop by Audience",
    short: "Audience",
    Icon: Users,
    tagline: "Every body, every pairing — curated edits for exactly who you are.",
    subs: [
      { label: "For Her", slug: "for-her" },
      { label: "For Him", slug: "for-him" },
      { label: "For Couples", slug: "for-couples" },
      { label: "For Everyone", slug: "for-everyone" },
      { label: "LGBTQ+ Friendly", slug: "lgbtq-friendly" },
      { label: "Beginners", slug: "beginners" },
    ],
    promo: {
      title: "Your first ritual",
      subtitle: "A gentle, curated edit to begin with confidence",
      href: "/catalog/beginners",
      badge: "Curated",
    },
  },
  {
    slug: "erotic-toys-vibrators-17172",
    name: "Vibrators",
    short: "Vibrators",
    Icon: Zap,
    tagline: "From whisper-quiet bullets to app-controlled wonders — body-safe, beautiful.",
    subs: [
      { label: "Rabbit Vibrators", slug: "vibrators-double-vibrators-17179" },
      { label: "Bullet Vibrators", slug: "vibrators-bullet-and-egg-vibrators-17173" },
      { label: "Clitoral & Suction", slug: "erotic-toys-clitoral-suction-17170" },
      { label: "Wand Massagers", slug: "vibrators-massagers-17175" },
      { label: "G-Spot", slug: "vibrators-g-spot-vibrators-17180" },
      { label: "Egg & Remote", slug: "vibrators-bullet-and-egg-vibrators-17173" },
      { label: "App-Controlled / Smart", slug: "app-controlled-vibrators" },
      { label: "Wearable", slug: "vibrators-butterflies-17174" },
    ],
    promo: {
      title: "The quiet luxury edit",
      subtitle: "Whisper-quiet favourites, loved by members",
      href: "/catalog/erotic-toys-vibrators-17172",
      badge: "Best loved",
    },
  },
  {
    slug: "erotic-toys-dildos-17143",
    name: "Dildos",
    short: "Dildos",
    Icon: Gem,
    tagline: "Sculptural forms in silicone, glass and ceramic — made to feel like art.",
    subs: [
      { label: "Realistic Dildos", slug: "dildos-realistic-vibrators-17144" },
      { label: "Glass & Ceramic", slug: "glass-ceramic-dildos" },
      { label: "Silicone", slug: "dildos-classic-dildos-17146" },
      { label: "Suction-Cup", slug: "suction-cup-dildos" },
      { label: "Strap-On & Harness", slug: "dildos-dildos-with-harnesses-27555" },
      { label: "Double-Ended", slug: "dildos-double-penetration-17147" },
    ],
    promo: {
      title: "The sculpture gallery",
      subtitle: "Hand-finished, body-safe classics",
      href: "/catalog/erotic-toys-dildos-17143",
      badge: "Artisan",
    },
  },
  {
    slug: "erotic-toys-anal-toys-17151",
    name: "Anal Play",
    short: "Anal",
    Icon: Flame,
    tagline: "Considered introductions and confident favourites — always at your pace.",
    subs: [
      { label: "Butt Plugs", slug: "anal-toys-plugs-17153" },
      { label: "Anal Beads", slug: "anal-toys-anal-balls-17152" },
      { label: "Prostate Massagers", slug: "erotic-toys-prostate-massage-devices-17116" },
      { label: "Training Kits", slug: "erotic-toys-dilators-17141" },
      { label: "Tails & Jewels", slug: "tails-jewels" },
    ],
    promo: {
      title: "Begin beautifully",
      subtitle: "Gentle training sets with everything you need",
      href: "/catalog/erotic-toys-dilators-17141",
      badge: "Beginner-kind",
    },
  },
  {
    slug: "couples-toys",
    name: "Couples' Toys",
    short: "Couples",
    Icon: HeartHandshake,
    tagline: "Shared closeness — tender pieces to explore together, at your own pace.",
    subs: [
      { label: "Couples' Vibrators", slug: "vibrators-couple-vibrators-17178" },
      { label: "Cock Rings", slug: "erotic-toys-rings-17114" },
      { label: "Remote-Control Play", slug: "remote-control-play" },
      { label: "Sex Machines", slug: "erotic-toys-machines-and-equipment-17168" },
    ],
    promo: {
      title: "Closer, together",
      subtitle: "A tender collection to share and discover",
      href: "/catalog/vibrators-couple-vibrators-17178",
      badge: "Date night",
    },
  },
  {
    slug: "erotic-clothing-women-s-erotic-clothing-23422-23422",
    name: "Lingerie & Apparel",
    short: "Lingerie",
    Icon: Shirt,
    tagline: "Silk, lace and soft tailoring — inclusive sizing, made to feel like you.",
    subs: [
      { label: "Stockings & Hold-Ups", slug: "hosiery-tights-stockings-30401-30401" },
      { label: "Bodysuits & Teddies", slug: "women-s-erotic-clothing-teddies-bodysuits-27572-27572" },
      { label: "Bras & Sets", slug: "women-s-erotic-clothing-lingerie-sets-27576-27576" },
      { label: "Suspenders & Garters", slug: "hosiery-garters-suspenders-30402" },
      { label: "Robes & Sleepwear", slug: "women-s-erotic-clothing-nightgowns-27575" },
      { label: "Costumes & Roleplay", slug: "women-s-erotic-clothing-costumes-27578" },
      { label: "Plus-Size", slug: "plus-size-lingerie" },
      { label: "Accessories", slug: "women-s-erotic-clothing-accessories-27569-27569" },
    ],
    promo: {
      title: "The silk edit",
      subtitle: "Inclusive sizing, from soft everyday to occasion",
      href: "/catalog/women-s-erotic-clothing-lingerie-sets-27576-27576",
      badge: "New season",
    },
  },
  {
    slug: "sex-and-sensuality-bondage-20455",
    name: "Sensual Play",
    short: "Sensual",
    Icon: Feather,
    tagline: "Feather-light teasing to considered restraint — tasteful, consensual, kind.",
    subs: [
      { label: "Restraints & Cuffs", slug: "bondage-handcuffs-23418-23418" },
      { label: "Blindfolds", slug: "bondage-blindfolds-23419-23419" },
      { label: "Ticklers & Feathers", slug: "slap-and-tickle-stimulators-23403-23403" },
      { label: "Beginner Bondage Kits", slug: "beginner-bondage-kits" },
      { label: "Collars & Leashes", slug: "bondage-collars-23411" },
      { label: "Impact", slug: "sex-and-sensuality-slap-and-tickle-20454" },
      { label: "Ropes & Ties", slug: "bondage-ropes-23413" },
    ],
    promo: {
      title: "The Midnight Edit",
      subtitle: "Velvet, silk and satin — restraint, refined",
      href: "/catalog/sex-and-sensuality-bondage-20455",
      badge: "After dark",
    },
  },
  {
    slug: "care-and-stimulation-lubricants-licks-17103",
    name: "Lubricants & Essentials",
    short: "Essentials",
    Icon: Droplets,
    tagline: "Body-safe formulas, gentle on skin — the quiet heroes of every drawer.",
    subs: [
      { label: "Water-Based Lube", slug: "water-based-lube" },
      { label: "Silicone-Based Lube", slug: "silicone-based-lube" },
      { label: "Hybrid Lube", slug: "hybrid-lube" },
      { label: "Flavoured Lube", slug: "flavoured-lube" },
      { label: "Warming & Cooling", slug: "warming-cooling-lube" },
      { label: "Massage Oils & Candles", slug: "wellbeing-and-erotic-massage-massage-oils-17090" },
      { label: "Arousal Gels", slug: "sex-and-sensuality-sexual-stimulators-17190" },
    ],
    promo: {
      title: "The essentials",
      subtitle: "Body-safe formulas, chosen with care",
      href: "/catalog/care-and-stimulation-lubricants-licks-17103",
      badge: "Everyday",
    },
  },
  {
    slug: "sex-and-sensuality-care-and-stimulation-17094",
    name: "Intimate Wellness & Care",
    short: "Wellness",
    Icon: Leaf,
    tagline: "Body-positive self-care — hygiene, protection and mindful rituals.",
    subs: [
      { label: "Toy Cleaners", slug: "care-and-stimulation-clean-care-23420" },
      { label: "Intimate Hygiene", slug: "care-and-stimulation-intimate-care-creams-gels-17099" },
      { label: "Condoms & Protection", slug: "sex-and-sensuality-safe-sex-and-contraceptives-17208" },
      { label: "Kegel & Pelvic Trainers", slug: "erotic-toys-chinese-balls-17125" },
      { label: "Enhancers & Supplements", slug: "care-and-stimulation-aphrodisiacs-17095" },
    ],
    promo: {
      title: "A moment for you",
      subtitle: "Mindful self-care, chosen with care",
      href: "/catalog/sex-and-sensuality-wellbeing-and-erotic-massage-17089",
      badge: "Self-care",
    },
  },
  {
    slug: "erotic-toys-kits-17158",
    name: "Gifting & Sets",
    short: "Gifting",
    Icon: Gift,
    tagline: "Beautifully wrapped sets and gift cards — thoughtful, discreet, welcome.",
    subs: [
      { label: "Gift Sets", slug: "erotic-toys-kits-17158" },
      { label: "Couples' Kits", slug: "wellbeing-and-erotic-massage-massage-kits-17092" },
      { label: "Beginner Bundles", slug: "beginner-bundles" },
      { label: "Date-Night Boxes", slug: "date-night-boxes" },
      { label: "Gift Cards", slug: "gift-cards" },
    ],
    promo: {
      title: "The art of gifting",
      subtitle: "Curated sets, wrapped with discretion",
      href: "/catalog/erotic-toys-kits-17158",
      badge: "Gift-ready",
    },
  },
];

/** High-intent shortcuts — quick-nav pills beneath the main bar. */
export const QUICK_LINKS: { label: string; href: string }[] = [
  { label: "Best Sellers", href: "/catalog?sort=popular" },
  { label: "New In", href: "/catalog?sort=newest" },
  { label: "Deals", href: "/catalog?onSale=true" },
  { label: "Couples", href: "/catalog/vibrators-couple-vibrators-17178" },
  { label: "Wellness", href: "/catalog/sex-and-sensuality-wellbeing-and-erotic-massage-17089" },
];

/** Facet rail — filters, not departments. Shown inside the mega-menu footer. */
export const FACETS: { label: string; href: string }[] = [
  { label: "New In", href: "/catalog?sort=newest" },
  { label: "Best Sellers", href: "/catalog?sort=popular" },
  { label: "Deals", href: "/catalog?onSale=true" },
  { label: "Under £40", href: "/catalog?maxPrice=40" },
  { label: "Premium / Luxury", href: "/catalog?minPrice=80&sort=popular" },
  { label: "Body-Safe Materials", href: "/catalog?search=body-safe" },
  { label: "Discreet & Travel", href: "/catalog?search=travel" },
];

export const SEARCH_SCOPES = [
  { value: "all", label: "All departments" },
  ...DEPARTMENTS.map((d) => ({ value: d.slug, label: d.short })),
];

export const RECENT_SEARCH_KEY = "ferutoys-recent-search";

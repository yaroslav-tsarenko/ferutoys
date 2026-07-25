import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Seeds the Silk & Spark catalogue with a tasteful intimacy / adult-wellness
 * range: a category tree matching the boutique nav plus ~5000 products spread
 * across the sub-categories, each with realistic names, brands, prices, unique
 * slugs/SKUs, a short + long description and a branded placeholder image.
 *
 * Run:  npx tsx scripts/import-sex-toys.ts
 */

const connectionString =
  process.env.DIRECT_URL ||
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const TARGET = 5000;

// ── Deterministic PRNG so re-runs are stable ─────────────────────────────
let seed = 20260720;
function rng() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}
function chance(p: number) {
  return rng() < p;
}
function priceBetween(min: number, max: number) {
  const v = min + rng() * (max - min);
  // Charm pricing → .99 / .95
  const base = Math.floor(v);
  return Number((base + (chance(0.5) ? 0.99 : 0.95)).toFixed(2));
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Category tree: top departments → sub-categories ──────────────────────
type SubDef = {
  name: string;
  desc: string;
  brands: string[];
  materials: string[];
  adjectives: string[];
  nouns: string[];
  priceMin: number;
  priceMax: number;
  weight: number; // relative share of the 5000 products
};

type DeptDef = {
  name: string;
  desc: string;
  subs: SubDef[];
};

const LUXE_BRANDS = ["LELO", "We-Vibe", "Womanizer", "Satisfyer", "Dame", "Maude", "Fun Factory"];
const HIM_BRANDS = ["Tenga", "Fleshlight", "Arcwave", "Satisfyer Men", "Bathmate"];
const KINK_BRANDS = ["Bijoux Indiscrets", "Coco de Mer", "Fifty Shades", "Liebe Seele", "UPKO"];
const WELLNESS_BRANDS = ["Maude", "Dame", "Sustain", "Ohnut", "Elvie", "Intimina"];
const LUBE_BRANDS = ["Sliquid", "Pjur", "Sutil", "System JO", "Durex", "Maude"];
const LINGERIE_BRANDS = ["Bluebella", "Coco de Mer", "Fleur du Mal", "Honey Birdette", "Lounge"];

const FINISHES = ["Blush", "Deep Rose", "Aubergine", "Midnight", "Champagne", "Sage", "Ivory", "Plum", "Slate", "Rosewood"];

const departments: DeptDef[] = [
  {
    name: "For Her",
    desc: "Considered pleasure designed for her — from whisper-quiet vibrators to sculptural wands.",
    subs: [
      {
        name: "Vibrators",
        desc: "Ergonomic, body-safe vibrators in quiet, powerful designs.",
        brands: LUXE_BRANDS,
        materials: ["Body-safe silicone", "Medical-grade silicone", "Silky ABS"],
        adjectives: ["Whisper", "Velvet", "Aurora", "Lumen", "Muse", "Soft", "Bloom", "Halo", "Ember", "Serene"],
        nouns: ["Vibrator", "Bullet", "Mini Vibe", "Petite", "Wand Vibe"],
        priceMin: 29,
        priceMax: 149,
        weight: 10,
      },
      {
        name: "Wand Massagers",
        desc: "Full-body wand massagers with deep, rumbly power.",
        brands: LUXE_BRANDS,
        materials: ["Body-safe silicone", "Soft-touch silicone"],
        adjectives: ["Grand", "Aurora", "Cordless", "Deluxe", "Studio", "Signature"],
        nouns: ["Wand", "Wand Massager", "Power Wand"],
        priceMin: 59,
        priceMax: 199,
        weight: 6,
      },
      {
        name: "Clitoral & Air-Pulse",
        desc: "Touch-free air-pulse stimulators for a gentler, deeper sensation.",
        brands: ["Womanizer", "Satisfyer", "LELO", "We-Vibe"],
        materials: ["Body-safe silicone"],
        adjectives: ["Pro", "Premium", "Liberty", "Starlet", "Next", "Duo", "Classic"],
        nouns: ["Air-Pulse Stimulator", "Pleasure Air", "Clitoral Massager"],
        priceMin: 39,
        priceMax: 199,
        weight: 8,
      },
      {
        name: "Rabbit Vibrators",
        desc: "Dual-action rabbits for internal and external pleasure at once.",
        brands: LUXE_BRANDS,
        materials: ["Body-safe silicone"],
        adjectives: ["Soraya", "Ina", "Dual", "Luxe", "Bloom", "Rhythm"],
        nouns: ["Rabbit", "Dual Vibrator", "Rabbit Vibe"],
        priceMin: 49,
        priceMax: 189,
        weight: 6,
      },
      {
        name: "Dildos",
        desc: "Sculptural, body-safe dildos with lifelike or artful designs.",
        brands: ["Fun Factory", "Dame", "Tantus", "Blush"],
        materials: ["Platinum silicone", "Body-safe silicone", "Dual-density silicone"],
        adjectives: ["Curve", "Classic", "Sculpt", "Realistic", "Ripple", "Wave", "Slim"],
        nouns: ["Dildo", "Silicone Dildo", "Curved Dildo"],
        priceMin: 24,
        priceMax: 119,
        weight: 6,
      },
    ],
  },
  {
    name: "For Him",
    desc: "Refined self-care and stamina essentials for him.",
    subs: [
      {
        name: "Strokers & Sleeves",
        desc: "Discreet, ultra-soft strokers and reusable sleeves.",
        brands: HIM_BRANDS,
        materials: ["TPE elastomer", "Superskin", "Soft elastomer"],
        adjectives: ["Original", "Air", "Deep Throat", "Cloud", "Flip", "Zero", "Premium"],
        nouns: ["Stroker", "Masturbator", "Sleeve", "Cup"],
        priceMin: 14,
        priceMax: 99,
        weight: 8,
      },
      {
        name: "Cock Rings",
        desc: "Stretchy, comfortable rings for firmer, longer-lasting sensation.",
        brands: ["We-Vibe", "LELO", "Tenga", "Bathmate"],
        materials: ["Body-safe silicone", "Stretch silicone"],
        adjectives: ["Vibrating", "Dual", "Stretch", "Pro", "Couples", "Classic"],
        nouns: ["Ring", "Cock Ring", "Vibrating Ring"],
        priceMin: 12,
        priceMax: 129,
        weight: 6,
      },
      {
        name: "Prostate Massagers",
        desc: "Ergonomic, body-safe prostate massagers for deeper pleasure.",
        brands: ["LELO", "Aneros", "Fun Factory", "We-Vibe"],
        materials: ["Body-safe silicone"],
        adjectives: ["Hugo", "Loki", "Bruno", "Helix", "Wave", "Remote"],
        nouns: ["Prostate Massager", "P-Spot Massager"],
        priceMin: 34,
        priceMax: 189,
        weight: 5,
      },
    ],
  },
  {
    name: "For Couples",
    desc: "Shared pleasure — wearables, remote play and toys made for two.",
    subs: [
      {
        name: "Couples' Vibrators",
        desc: "Hands-free wearables designed to be worn together.",
        brands: ["We-Vibe", "LELO", "Dame", "Fun Factory"],
        materials: ["Body-safe silicone"],
        adjectives: ["Chorus", "Sync", "Match", "Unite", "Eva", "Tango", "Duet"],
        nouns: ["Couples' Vibrator", "Wearable Vibe", "Worn Vibrator"],
        priceMin: 49,
        priceMax: 199,
        weight: 6,
      },
      {
        name: "Remote & App Control",
        desc: "App-connected toys for playful long-distance and in-room control.",
        brands: ["We-Vibe", "LELO", "Lovense", "Satisfyer"],
        materials: ["Body-safe silicone"],
        adjectives: ["Connect", "App", "Remote", "Long-Distance", "Smart"],
        nouns: ["Remote Vibrator", "App-Controlled Vibe", "Wearable"],
        priceMin: 39,
        priceMax: 179,
        weight: 5,
      },
      {
        name: "Strap-Ons & Harnesses",
        desc: "Comfortable harnesses and pegging sets for shared exploration.",
        brands: ["Fun Factory", "Tantus", "SpareParts", "Blush"],
        materials: ["Platinum silicone", "Vegan-friendly fabric"],
        adjectives: ["Share", "Vibe", "Deluxe", "Adjustable", "Beginner"],
        nouns: ["Strap-On Set", "Harness", "Pegging Kit"],
        priceMin: 34,
        priceMax: 159,
        weight: 4,
      },
    ],
  },
  {
    name: "Wellness & Self-care",
    desc: "Body-safe intimate wellness — pelvic health, sleep, cycle and calm.",
    subs: [
      {
        name: "Pelvic Floor Trainers",
        desc: "Guided kegel and pelvic-floor sets for strength and control.",
        brands: WELLNESS_BRANDS,
        materials: ["Body-safe silicone"],
        adjectives: ["Guided", "Smart", "Weighted", "Progressive", "Trainer"],
        nouns: ["Kegel Set", "Pelvic Trainer", "Ben Wa Balls"],
        priceMin: 19,
        priceMax: 149,
        weight: 5,
      },
      {
        name: "Menstrual Care",
        desc: "Reusable cups, discs and period-care essentials.",
        brands: ["Intimina", "Elvie", "Saalt", "Maude"],
        materials: ["Medical-grade silicone"],
        adjectives: ["Reusable", "Soft", "Compact", "Everyday"],
        nouns: ["Menstrual Cup", "Menstrual Disc", "Cup Set"],
        priceMin: 14,
        priceMax: 39,
        weight: 3,
      },
      {
        name: "Massage & Bath",
        desc: "Sensual massage candles, oils and calming bath rituals.",
        brands: ["Maude", "Bijoux Indiscrets", "Dame", "Coco de Mer"],
        materials: ["Soy wax", "Natural oils"],
        adjectives: ["Warming", "Calm", "Ritual", "Glow", "Amber", "Rose"],
        nouns: ["Massage Candle", "Massage Oil", "Bath Ritual"],
        priceMin: 12,
        priceMax: 49,
        weight: 4,
      },
    ],
  },
  {
    name: "Lingerie",
    desc: "Considered lingerie — from everyday soft to occasion pieces.",
    subs: [
      {
        name: "Lingerie Sets",
        desc: "Matching bra and brief sets in lace, mesh and silk.",
        brands: LINGERIE_BRANDS,
        materials: ["French lace", "Silk", "Recycled mesh"],
        adjectives: ["Marseille", "Colette", "Aria", "Odette", "Provence", "Noir", "Rosewood"],
        nouns: ["Lingerie Set", "Bra & Brief Set", "Lace Set"],
        priceMin: 29,
        priceMax: 129,
        weight: 6,
      },
      {
        name: "Bodysuits & Chemises",
        desc: "Fluid bodysuits, slips and chemises for occasion and everyday.",
        brands: LINGERIE_BRANDS,
        materials: ["Silk", "Stretch lace", "Satin"],
        adjectives: ["Slip", "Fluid", "Sheer", "Draped", "Bias-cut"],
        nouns: ["Chemise", "Bodysuit", "Slip Dress"],
        priceMin: 34,
        priceMax: 149,
        weight: 4,
      },
      {
        name: "Robes & Loungewear",
        desc: "Silk robes and soft loungewear for slow mornings.",
        brands: ["Lounge", "Fleur du Mal", "Honey Birdette", "Maude"],
        materials: ["Washable silk", "Modal", "Satin"],
        adjectives: ["Silk", "Longline", "Wrap", "Kimono", "Soft"],
        nouns: ["Robe", "Kimono Robe", "Lounge Set"],
        priceMin: 39,
        priceMax: 169,
        weight: 3,
      },
    ],
  },
  {
    name: "Lubricants & Essentials",
    desc: "Body-safe lubricants, toy care and protection.",
    subs: [
      {
        name: "Lubricants",
        desc: "Water- and silicone-based lubricants, tested and body-safe.",
        brands: LUBE_BRANDS,
        materials: ["Water-based", "Silicone-based", "Aloe-based", "Hybrid"],
        adjectives: ["Everyday", "Silk", "Natural", "Sensitive", "Glide", "Hybrid"],
        nouns: ["Lubricant", "Personal Lubricant", "Glide"],
        priceMin: 8,
        priceMax: 29,
        weight: 6,
      },
      {
        name: "Toy Cleaners & Care",
        desc: "Gentle antibacterial cleaners and storage for your toys.",
        brands: ["Sliquid", "System JO", "Maude", "Dame"],
        materials: ["Alcohol-free formula"],
        adjectives: ["Refresh", "Pure", "Foaming", "Gentle", "Everyday"],
        nouns: ["Toy Cleaner", "Cleansing Spray", "Storage Bag"],
        priceMin: 6,
        priceMax: 24,
        weight: 4,
      },
      {
        name: "Condoms & Protection",
        desc: "Ultra-thin, body-considerate condoms and protection.",
        brands: ["Durex", "Sustain", "Hanx", "Skyn"],
        materials: ["Natural latex", "Non-latex", "Vegan-friendly"],
        adjectives: ["Ultra-Thin", "Natural", "Feel", "Close Fit", "Extra Safe"],
        nouns: ["Condoms", "Condom Pack", "Protection Set"],
        priceMin: 6,
        priceMax: 22,
        weight: 4,
      },
    ],
  },
  {
    name: "Bondage & Kink",
    desc: "Beginner-friendly to advanced play — soft restraints, blindfolds and kits.",
    subs: [
      {
        name: "Restraints & Cuffs",
        desc: "Soft, adjustable cuffs and ties for gentle restraint play.",
        brands: KINK_BRANDS,
        materials: ["Vegan leather", "Satin", "Soft bondage tape"],
        adjectives: ["Soft", "Satin", "Adjustable", "Bow", "Vegan", "Beginner"],
        nouns: ["Cuffs", "Wrist Restraints", "Bondage Ties"],
        priceMin: 14,
        priceMax: 89,
        weight: 4,
      },
      {
        name: "Blindfolds & Sensory",
        desc: "Blindfolds, feathers and sensory-play accessories.",
        brands: KINK_BRANDS,
        materials: ["Satin", "Vegan leather", "Feather"],
        adjectives: ["Silk", "Satin", "Sensory", "Tease", "Bow"],
        nouns: ["Blindfold", "Feather Tickler", "Sensory Set"],
        priceMin: 9,
        priceMax: 49,
        weight: 3,
      },
      {
        name: "Beginner Kits",
        desc: "Thoughtfully curated introductory kink and bondage kits.",
        brands: KINK_BRANDS,
        materials: ["Vegan leather", "Satin", "Body-safe silicone"],
        adjectives: ["Starter", "Discover", "Explore", "Weekend", "Couples"],
        nouns: ["Bondage Kit", "Beginner Set", "Play Kit"],
        priceMin: 24,
        priceMax: 129,
        weight: 3,
      },
    ],
  },
  {
    name: "Gifting",
    desc: "Curated gift sets and cards for every occasion.",
    subs: [
      {
        name: "Gift Sets",
        desc: "Beautifully boxed curations for couples and self-gifting.",
        brands: ["Silk & Spark", "Maude", "Dame", "LELO"],
        materials: ["Assorted"],
        adjectives: ["Date Night", "First Night", "Self-care", "Couples", "Discover", "Luxe"],
        nouns: ["Gift Set", "Curated Box", "Duo Set"],
        priceMin: 29,
        priceMax: 179,
        weight: 4,
      },
      {
        name: "Gift Cards",
        desc: "Digital gift cards, wrapped in discretion.",
        brands: ["Silk & Spark"],
        materials: ["Digital"],
        adjectives: ["Digital", "E-", "Classic"],
        nouns: ["Gift Card", "E-Gift Card"],
        priceMin: 20,
        priceMax: 200,
        weight: 1,
      },
    ],
  },
];

// New In is a virtual department populated by isFeatured/newest — no products
// created directly under it, so it always reflects the freshest catalogue.

function buildName(sub: SubDef) {
  const brand = pick(sub.brands);
  const adj = pick(sub.adjectives);
  const noun = pick(sub.nouns);
  const finish = chance(0.5) ? ` — ${pick(FINISHES)}` : "";
  return { brand, name: `${brand} ${adj} ${noun}${finish}` };
}

function buildDescription(sub: SubDef, name: string, material: string) {
  const care = pick([
    "Fully waterproof and rechargeable.",
    "USB-rechargeable with a travel-friendly design.",
    "Whisper-quiet and discreet.",
    "Easy to clean and travel-ready.",
    "Hypoallergenic and phthalate-free.",
    "Designed for comfort and everyday confidence.",
  ]);
  return {
    short: `${material}. ${sub.desc}`,
    long: `The ${name} is part of the Silk & Spark ${sub.name.toLowerCase()} edit. Crafted from ${material.toLowerCase()}, it is designed to feel considered, refined and reassuringly body-safe. ${sub.desc} ${care} Shipped in plain, discreet packaging with secure and private checkout.`,
  };
}

async function main() {
  console.log("→ Connecting and clearing existing catalogue…");
  await prisma.productCategory.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // ── Categories ────────────────────────────────────────────────────────
  const subCategoryIds: { id: string; sub: SubDef }[] = [];
  let deptSort = 0;
  for (const dept of departments) {
    const parent = await prisma.category.create({
      data: {
        name: dept.name,
        slug: slugify(dept.name),
        description: dept.desc,
        sortOrder: deptSort++,
        isActive: true,
        imageUrl: `https://placehold.co/800x600/2A1C24/D0A85F/png?text=${encodeURIComponent(dept.name)}`,
      },
    });
    let subSort = 0;
    for (const sub of dept.subs) {
      const child = await prisma.category.create({
        data: {
          name: sub.name,
          slug: slugify(`${dept.name}-${sub.name}`),
          description: sub.desc,
          parentId: parent.id,
          sortOrder: subSort++,
          isActive: true,
          imageUrl: `https://placehold.co/800x600/2A1C24/D0A85F/png?text=${encodeURIComponent(sub.name)}`,
        },
      });
      subCategoryIds.push({ id: child.id, sub });
    }
  }
  // Virtual "New In" department (no children — filled by newest products).
  await prisma.category.create({
    data: {
      name: "New In",
      slug: "new-in",
      description: "The latest arrivals across the Silk & Spark edit.",
      sortOrder: deptSort++,
      isActive: true,
    },
  });
  console.log(`✓ Categories created: ${departments.length} departments + New In, ${subCategoryIds.length} sub-categories`);

  // ── Distribute product counts across subs by weight ────────────────────
  const totalWeight = subCategoryIds.reduce((s, x) => s + x.sub.weight, 0);
  const plan = subCategoryIds.map((x) => ({
    ...x,
    count: Math.max(1, Math.round((x.sub.weight / totalWeight) * TARGET)),
  }));
  let planned = plan.reduce((s, x) => s + x.count, 0);
  // Trim/pad to hit TARGET exactly
  let i = 0;
  while (planned > TARGET) {
    if (plan[i % plan.length].count > 1) {
      plan[i % plan.length].count--;
      planned--;
    }
    i++;
  }
  while (planned < TARGET) {
    plan[i % plan.length].count++;
    planned++;
    i++;
  }

  console.log(`→ Generating ${planned} products…`);

  const usedSlugs = new Set<string>();
  let uidCounter = 1;
  let skuSeq = 1000;
  let created = 0;
  const BATCH = 200;

  for (const entry of plan) {
    let remaining = entry.count;
    while (remaining > 0) {
      const take = Math.min(BATCH, remaining);
      const productsData: any[] = [];
      const rows: {
        slug: string;
        images: string[];
        alt: string;
      }[] = [];

      for (let n = 0; n < take; n++) {
        const { brand, name } = buildName(entry.sub);
        const baseSlug = slugify(name);
        let slug = baseSlug;
        // Guaranteed-unique: append the SKU sequence (monotonic) on any clash.
        if (usedSlugs.has(slug)) slug = `${baseSlug}-${skuSeq}`;
        while (usedSlugs.has(slug)) slug = `${baseSlug}-${skuSeq}-${uidCounter++}`;
        usedSlugs.add(slug);

        const material = pick(entry.sub.materials);
        const { short, long } = buildDescription(entry.sub, name, material);
        const price = priceBetween(entry.sub.priceMin, entry.sub.priceMax);
        const hasSale = chance(0.28);
        const comparePrice = hasSale
          ? Number((price * (1.15 + rng() * 0.35)).toFixed(2))
          : null;
        const sku = `SS-${String(skuSeq++).padStart(6, "0")}`;
        const featured = chance(0.06);
        const quantity = 8 + Math.floor(rng() * 240);

        const imgText = encodeURIComponent(brand);
        const images = [
          `https://placehold.co/900x1100/241722/D0A85F/png?text=${imgText}`,
          `https://placehold.co/900x1100/2A1C24/C25E77/png?text=${encodeURIComponent(entry.sub.name)}`,
        ];

        productsData.push({
          name,
          slug,
          sku,
          brand,
          description: long,
          shortDescription: short,
          price,
          comparePrice,
          quantity,
          trackInventory: true,
          status: "ACTIVE",
          isFeatured: featured,
          condition: "new",
          metaTitle: `${name} | Silk & Spark`,
          metaDescription: short.slice(0, 160),
          metadata: { material, department: entry.sub.name },
        });
        rows.push({ slug, images, alt: name });
      }

      await prisma.product.createMany({ data: productsData, skipDuplicates: true });

      // Fetch ids back for the just-inserted slugs, then link images + category.
      const inserted = await prisma.product.findMany({
        where: { slug: { in: rows.map((r) => r.slug) } },
        select: { id: true, slug: true },
      });
      const idBySlug = new Map(inserted.map((p) => [p.slug, p.id]));

      const imageData: any[] = [];
      const catData: any[] = [];
      for (const r of rows) {
        const pid = idBySlug.get(r.slug);
        if (!pid) continue;
        r.images.forEach((url, idx) =>
          imageData.push({ url, alt: r.alt, sortOrder: idx, productId: pid }),
        );
        catData.push({ productId: pid, categoryId: entry.id });
      }
      await prisma.productImage.createMany({ data: imageData, skipDuplicates: true });
      await prisma.productCategory.createMany({ data: catData, skipDuplicates: true });

      created += take;
      remaining -= take;
      if (created % 1000 < BATCH) console.log(`  …${created}/${planned}`);
    }
  }

  const [pc, cc] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
  ]);
  console.log(`\n✓ Done. Products: ${pc}, Categories: ${cc}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

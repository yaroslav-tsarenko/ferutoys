import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // ── Utility Links ──────────────────────────────────
    const utilityLinks = [
      { label: "About Us", linkUrl: "/about", icon: "Info", position: "left", sortOrder: 0 },
      { label: "Shipping & Delivery", linkUrl: "/policies/shipping", icon: "Truck", position: "left", sortOrder: 1 },
      { label: "Returns", linkUrl: "/policies/returns", icon: "RotateCcw", position: "left", sortOrder: 2 },
      { label: "Warranty", linkUrl: "/policies/warranty", icon: "ShieldCheck", position: "left", sortOrder: 3 },
      { label: "Track Order", linkUrl: "/account/orders", icon: "Package", position: "left", sortOrder: 4 },
      { label: "Contact", linkUrl: "/contact", icon: "Phone", position: "right", sortOrder: 5 },
    ];

    for (const link of utilityLinks) {
      await prisma.utilityLink.upsert({
        where: { id: `seed-utility-${link.sortOrder}` },
        update: link,
        create: { id: `seed-utility-${link.sortOrder}`, ...link },
      });
    }

    // ── Promo Strip Items ──────────────────────────────
    const promoStripItems = [
      { icon: "Truck", title: "Free EU Delivery", subtitle: "On orders over €100", sortOrder: 0 },
      { icon: "PackageOpen", title: "Discreet Packaging", subtitle: "Plain, neutral parcels", sortOrder: 1 },
      { icon: "RotateCcw", title: "30-Day Returns", subtitle: "No fine print", sortOrder: 2 },
      { icon: "Shield", title: "Secure & Private", subtitle: "PCI-DSS · 256-bit SSL", sortOrder: 3 },
      { icon: "Heart", title: "Body-Safe Materials", subtitle: "Chosen with care", sortOrder: 4 },
    ];

    for (const item of promoStripItems) {
      await prisma.promoStripItem.upsert({
        where: { id: `seed-promo-${item.sortOrder}` },
        update: item,
        create: { id: `seed-promo-${item.sortOrder}`, ...item },
      });
    }

    // ── Homepage Tabs (quick-access chips) ─────────────
    const tabs = [
      { label: "Deals", icon: "Zap", linkUrl: "/catalog?onSale=true", color: "#B76E79", sortOrder: 0 },
      { label: "Vibrators", icon: "Sparkles", linkUrl: "/catalog/erotic-toys-vibrators-17172", color: "#B76E79", sortOrder: 1 },
      { label: "Dildos", icon: "Heart", linkUrl: "/catalog/erotic-toys-dildos-17143", color: "#B76E79", sortOrder: 2 },
      { label: "Anal Play", icon: "Circle", linkUrl: "/catalog/erotic-toys-anal-toys-17151", color: "#9C6B8E", sortOrder: 3 },
      { label: "Couples", icon: "Users", linkUrl: "/catalog/vibrators-couple-vibrators-17178", color: "#9C6B8E", sortOrder: 4 },
      { label: "Lingerie", icon: "Shirt", linkUrl: "/catalog/erotic-clothing-women-s-erotic-clothing-23422-23422", color: "#B76E79", sortOrder: 5 },
      { label: "Sensual Play", icon: "Flame", linkUrl: "/catalog/sex-and-sensuality-bondage-20455", color: "#9C6B8E", sortOrder: 6 },
      { label: "Lubricants", icon: "Droplet", linkUrl: "/catalog/care-and-stimulation-lubricants-licks-17103", color: "#7C9C8E", sortOrder: 7 },
      { label: "New in", icon: "Sparkles", linkUrl: "/catalog?sort=newest", color: "#7C9C8E", sortOrder: 8 },
    ];

    for (const tab of tabs) {
      await prisma.homepageTab.upsert({
        where: { id: `seed-tab-${tab.sortOrder}` },
        update: tab,
        create: { id: `seed-tab-${tab.sortOrder}`, ...tab },
      });
    }

    // ── Hero Slides ────────────────────────────────────
    const heroSlides = [
      {
        type: "HERO" as const,
        title: "Intimacy, beautifully considered",
        subtitle: "The FeruToys edit",
        description: "Pleasure, wellness and self-care — chosen with care, shipped in discreet packaging, with private checkout.",
        linkUrl: "/catalog/erotic-toys-vibrators-17172",
        ctaLabel: "Shop vibrators",
        bgColor: "#2A1A24",
        textColor: "#F5EDF1",
        badgeText: "EDIT 01",
        sortOrder: 0,
      },
      {
        type: "HERO" as const,
        title: "For two, and for you",
        subtitle: "Couples & connection",
        description: "Toys and essentials designed to be shared — gentle, body-safe and made for closeness.",
        linkUrl: "/catalog/vibrators-couple-vibrators-17178",
        ctaLabel: "Shop couples",
        bgColor: "#3A1F2E",
        textColor: "#F5EDF1",
        badgeText: "EDIT 02",
        sortOrder: 1,
      },
      {
        type: "HERO" as const,
        title: "Soft, sheer, considered",
        subtitle: "Lingerie & apparel",
        description: "Thoughtfully chosen lingerie and apparel — for yourself or someone you love. Discreetly delivered.",
        linkUrl: "/catalog/erotic-clothing-women-s-erotic-clothing-23422-23422",
        ctaLabel: "Shop lingerie",
        bgColor: "#2E1A3A",
        textColor: "#F5EDF1",
        badgeText: "EDIT 03",
        sortOrder: 2,
      },
    ];

    for (let i = 0; i < heroSlides.length; i++) {
      await prisma.banner.upsert({
        where: { id: `seed-hero-${i}` },
        update: heroSlides[i],
        create: { id: `seed-hero-${i}`, ...heroSlides[i] },
      });
    }

    // ── Deal Cards ─────────────────────────────────────
    const dealCards = [
      {
        type: "DEAL_CARD" as const,
        title: "Bestselling Vibrators",
        subtitle: "Body-safe silicone",
        description: "Whisper-quiet, rechargeable and body-safe — our most-loved vibrators, now on offer.",
        linkUrl: "/catalog/erotic-toys-vibrators-17172",
        ctaLabel: "Shop now",
        bgColor: "#2A1A24",
        textColor: "#F5EDF1",
        oldPrice: "€89.00",
        newPrice: "€69.00",
        discountText: "-22%",
        sortOrder: 0,
      },
      {
        type: "DEAL_CARD" as const,
        title: "Couples' Essentials Set",
        subtitle: "For closeness",
        description: "A curated set of couples' toys and body-safe lubricant — designed to be shared.",
        linkUrl: "/catalog/vibrators-couple-vibrators-17178",
        ctaLabel: "Shop now",
        bgColor: "#3A1F2E",
        textColor: "#F5EDF1",
        oldPrice: "€119.00",
        newPrice: "€99.00",
        discountText: "-17%",
        sortOrder: 1,
      },
    ];

    for (let i = 0; i < dealCards.length; i++) {
      await prisma.banner.upsert({
        where: { id: `seed-deal-${i}` },
        update: dealCards[i],
        create: { id: `seed-deal-${i}`, ...dealCards[i] },
      });
    }

    // ── Small Promo Banners (department tiles) ─────────
    const smallPromos = [
      {
        type: "PROMO_SMALL" as const,
        title: "Sensual Play",
        subtitle: "Explore, gently",
        linkUrl: "/catalog/sex-and-sensuality-bondage-20455",
        ctaLabel: "Shop Sensual Play",
        bgColor: "#2A1A24",
        textColor: "#F5EDF1",
        sortOrder: 0,
      },
      {
        type: "PROMO_SMALL" as const,
        title: "Lubricants & Essentials",
        subtitle: "Body-safe care",
        linkUrl: "/catalog/care-and-stimulation-lubricants-licks-17103",
        ctaLabel: "Shop Essentials",
        bgColor: "#3A1F2E",
        textColor: "#F5EDF1",
        sortOrder: 1,
      },
      {
        type: "PROMO_SMALL" as const,
        title: "Gifting & Sets",
        subtitle: "Thoughtfully curated",
        linkUrl: "/catalog/erotic-toys-kits-17158",
        ctaLabel: "Shop Gifting",
        bgColor: "#2E1A3A",
        textColor: "#F5EDF1",
        sortOrder: 2,
      },
    ];

    for (let i = 0; i < smallPromos.length; i++) {
      await prisma.banner.upsert({
        where: { id: `seed-promo-small-${i}` },
        update: smallPromos[i],
        create: { id: `seed-promo-small-${i}`, ...smallPromos[i] },
      });
    }

    // ── Wide Promo Banner ──────────────────────────────
    const widePromo = {
      type: "PROMO_WIDE" as const,
      title: "Free EU shipping over €100",
      subtitle: "Discreet, private delivery",
      description: "A considered intimacy boutique shipping from Estonia. Plain packaging, 30-day returns, no fine print.",
      linkUrl: "/catalog",
      ctaLabel: "Shop the catalog",
      bgColor: "#2A1A24",
      textColor: "#F5EDF1",
      badgeText: "ALWAYS ON",
      sortOrder: 0,
    };

    await prisma.banner.upsert({
      where: { id: "seed-promo-wide-0" },
      update: widePromo,
      create: { id: "seed-promo-wide-0", ...widePromo },
    });

    // ── Brands ─────────────────────────────────────────
    const brands = [
      "LELO", "We-Vibe", "Womanizer", "Satisfyer", "Fun Factory", "Tenga",
      "Svakom", "Pjur", "Durex", "System JO", "Njoy", "Doxy",
    ];

    for (let i = 0; i < brands.length; i++) {
      const slug = brands[i].toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      await prisma.brand.upsert({
        where: { id: `seed-brand-${i}` },
        update: { name: brands[i], logoUrl: `/brands/${slug}.svg`, linkUrl: `/catalog`, sortOrder: i },
        create: {
          id: `seed-brand-${i}`,
          name: brands[i],
          logoUrl: `/brands/${slug}.svg`,
          linkUrl: `/catalog`,
          sortOrder: i,
        },
      });
    }

    // ── Homepage Sections ──────────────────────────────
    // categorySlug values match real Category.slug rows in the DB.
    const sections = [
      {
        title: "Best Deals",
        subtitle: "Save on selected favourites",
        slug: "best-deals",
        filterType: "onSale",
        maxProducts: 5,
        viewAllUrl: "/catalog?onSale=true",
        viewAllLabel: "View all deals",
        bgStyle: "white",
        columns: 5,
        sortOrder: 0,
      },
      {
        title: "New Arrivals",
        subtitle: "Fresh drops this week",
        slug: "new-arrivals",
        filterType: "newest",
        maxProducts: 5,
        viewAllUrl: "/catalog?sort=newest",
        viewAllLabel: "View all new",
        bgStyle: "gray",
        columns: 5,
        sortOrder: 1,
      },
      {
        title: "Vibrators",
        subtitle: "Whisper-quiet, body-safe, rechargeable",
        slug: "vibrators",
        filterType: "category",
        categorySlug: "erotic-toys-vibrators-17172",
        maxProducts: 5,
        viewAllUrl: "/catalog/erotic-toys-vibrators-17172",
        viewAllLabel: "Shop vibrators",
        bgStyle: "white",
        columns: 5,
        sortOrder: 2,
      },
      {
        title: "Dildos",
        subtitle: "Considered shapes, body-safe materials",
        slug: "dildos",
        filterType: "category",
        categorySlug: "erotic-toys-dildos-17143",
        maxProducts: 5,
        viewAllUrl: "/catalog/erotic-toys-dildos-17143",
        viewAllLabel: "Shop dildos",
        bgStyle: "white",
        columns: 5,
        sortOrder: 3,
      },
      {
        title: "Couples' Toys",
        subtitle: "Designed to be shared",
        slug: "couples-toys",
        filterType: "category",
        categorySlug: "vibrators-couple-vibrators-17178",
        maxProducts: 5,
        viewAllUrl: "/catalog/vibrators-couple-vibrators-17178",
        viewAllLabel: "Shop couples",
        bgStyle: "gray",
        columns: 5,
        sortOrder: 4,
      },
      {
        title: "Lubricants & Essentials",
        subtitle: "Body-safe care and comfort",
        slug: "lubricants-essentials",
        filterType: "category",
        categorySlug: "care-and-stimulation-lubricants-licks-17103",
        maxProducts: 5,
        viewAllUrl: "/catalog/care-and-stimulation-lubricants-licks-17103",
        viewAllLabel: "Shop essentials",
        bgStyle: "white",
        columns: 5,
        sortOrder: 5,
      },
      {
        title: "Featured",
        subtitle: "Hand-picked by our team",
        slug: "featured",
        filterType: "featured",
        maxProducts: 5,
        viewAllUrl: "/catalog",
        viewAllLabel: "View all featured",
        bgStyle: "white",
        columns: 5,
        sortOrder: 6,
      },
      {
        title: "All Products",
        subtitle: "Browse the full catalog",
        slug: "all-products",
        filterType: "all",
        maxProducts: 10,
        viewAllUrl: "/catalog",
        viewAllLabel: "View all products",
        bgStyle: "white",
        columns: 5,
        sortOrder: 7,
      },
    ];

    for (const section of sections) {
      await prisma.homepageSection.upsert({
        where: { slug: section.slug },
        update: section,
        create: section,
      });
    }

    return NextResponse.json({
      success: true,
      seeded: {
        utilityLinks: utilityLinks.length,
        promoStripItems: promoStripItems.length,
        tabs: tabs.length,
        heroSlides: heroSlides.length,
        dealCards: dealCards.length,
        smallPromos: smallPromos.length,
        widePromos: 1,
        brands: brands.length,
        sections: sections.length,
      },
    });
  } catch (error) {
    console.error("Error seeding homepage data:", error);
    return NextResponse.json({ error: "Failed to seed homepage data" }, { status: 500 });
  }
}

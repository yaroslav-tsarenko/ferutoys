import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

const STATIC_PATHS: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "daily", priority: 1 },
  { path: "/catalog", changeFrequency: "daily", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.5 },
  { path: "/size-guide", changeFrequency: "monthly", priority: 0.4 },
  { path: "/policies", changeFrequency: "monthly", priority: 0.3 },
  { path: "/policies/privacy", changeFrequency: "monthly", priority: 0.3 },
  { path: "/policies/terms", changeFrequency: "monthly", priority: 0.3 },
  { path: "/policies/returns", changeFrequency: "monthly", priority: 0.3 },
  { path: "/policies/shipping", changeFrequency: "monthly", priority: 0.3 },
  { path: "/policies/payment", changeFrequency: "monthly", priority: 0.3 },
  { path: "/policies/warranty", changeFrequency: "monthly", priority: 0.3 },
  { path: "/policies/cookies", changeFrequency: "monthly", priority: 0.3 },
];

function entry(
  path: string,
  lastModified: Date,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteUrl}${path || "/"}`,
    lastModified,
    changeFrequency,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const now = new Date();

  return [
    ...STATIC_PATHS.map((p) => entry(p.path, now, p.changeFrequency, p.priority)),
    ...categories.map((c) => entry(`/catalog/${c.slug}`, c.updatedAt, "weekly", 0.7)),
    ...products.map((p) => entry(`/product/${p.slug}`, p.updatedAt, "weekly", 0.8)),
  ];
}

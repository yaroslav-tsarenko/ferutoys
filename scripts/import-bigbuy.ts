import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Imports the real BigBuy "Sex and sensuality" catalogue (taxonomy 17088) into
 * the Silk & Spark database — real product names, descriptions, prices, SKUs,
 * EANs, brands and official BigBuy product photography (white-background studio
 * shots, not explicit imagery).
 *
 * Run:  npx tsx scripts/import-bigbuy.ts
 */

const API_KEY = process.env.BIGBUY_API_PRODUCTION;
const API_BASE = "https://api.bigbuy.eu";
const ROOT_TAXONOMY = 17088; // "Sex and sensuality"
const ISO = "en";

if (!API_KEY) {
  console.error("Missing BIGBUY_API_PRODUCTION in env");
  process.exit(1);
}

const connectionString =
  process.env.DIRECT_URL ||
  process.env.DATABASE_URL ||
  "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function bbGet<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path}`;
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });
    if (res.status === 429) {
      const wait = 2000 * (attempt + 1);
      console.warn(`  429 rate-limited, waiting ${wait}ms…`);
      await sleep(wait);
      continue;
    }
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`BigBuy ${res.status} on ${path}: ${body.slice(0, 200)}`);
    }
    return (await res.json()) as T;
  }
  throw new Error(`BigBuy repeatedly rate-limited on ${path}`);
}

// Fetch every page of a paginated endpoint (pageSize=1000).
async function bbPaginate<T>(basePath: string): Promise<T[]> {
  const out: T[] = [];
  for (let page = 1; ; page++) {
    const sep = basePath.includes("?") ? "&" : "?";
    const chunk = await bbGet<T[]>(`${basePath}${sep}pageSize=1000&page=${page}`);
    if (!Array.isArray(chunk) || chunk.length === 0) break;
    out.push(...chunk);
    process.stdout.write(`\r    …page ${page} (+${chunk.length}, total ${out.length})   `);
    if (chunk.length < 1000) break;
    await sleep(150);
  }
  process.stdout.write("\n");
  return out;
}

// ── Types (partial) ──────────────────────────────────────────────────────
type BBTaxonomy = { id: number; name: string; parentTaxonomy: number; url: string; urlImages?: string };
type BBProduct = {
  id: number;
  sku: string;
  ean13?: string;
  taxonomy: number;
  manufacturer?: number;
  wholesalePrice?: number;
  retailPrice?: number;
  inShopsPrice?: number;
  active?: number;
  condition?: string;
  weight?: number;
};
type BBInfo = { id: number; sku: string; name: string; description?: string; url?: string };
type BBImages = { id: number; images: { url: string; isCover?: boolean; name?: string; position?: number }[] };
type BBManufacturer = { id: number; name: string };

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function stripToShort(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);
}

async function main() {
  console.log("→ Fetching BigBuy taxonomy tree…");
  const taxonomies = await bbGet<BBTaxonomy[]>(`/rest/catalog/taxonomies.json?isoCode=${ISO}`);
  const byId = new Map<number, BBTaxonomy>(taxonomies.map((t) => [t.id, t]));

  // Collect subtree of ROOT_TAXONOMY.
  const byParent = new Map<number, BBTaxonomy[]>();
  for (const t of taxonomies) {
    if (!byParent.has(t.parentTaxonomy)) byParent.set(t.parentTaxonomy, []);
    byParent.get(t.parentTaxonomy)!.push(t);
  }
  const subtree = new Set<number>([ROOT_TAXONOMY]);
  const stack = [ROOT_TAXONOMY];
  while (stack.length) {
    const p = stack.pop()!;
    for (const c of byParent.get(p) ?? []) {
      if (!subtree.has(c.id)) {
        subtree.add(c.id);
        stack.push(c.id);
      }
    }
  }
  console.log(`  subtree taxonomies: ${subtree.size}`);

  console.log("→ Fetching products (base)…");
  const products = await bbPaginate<BBProduct>(
    `/rest/catalog/products.json?parentTaxonomy=${ROOT_TAXONOMY}&isoCode=${ISO}`,
  );
  console.log(`  products: ${products.length}`);

  console.log("→ Fetching product information (names/descriptions)…");
  const infos = await bbPaginate<BBInfo>(
    `/rest/catalog/productsinformation.json?parentTaxonomy=${ROOT_TAXONOMY}&isoCode=${ISO}`,
  );
  const infoById = new Map<number, BBInfo>(infos.map((i) => [i.id, i]));
  console.log(`  info records: ${infos.length}`);

  console.log("→ Fetching product images…");
  const images = await bbPaginate<BBImages>(
    `/rest/catalog/productsimages.json?parentTaxonomy=${ROOT_TAXONOMY}&isoCode=${ISO}`,
  );
  const imagesById = new Map<number, BBImages["images"]>(images.map((i) => [i.id, i.images]));
  console.log(`  image records: ${images.length}`);

  console.log("→ Fetching manufacturers…");
  const manufacturers = await bbGet<BBManufacturer[]>(`/rest/catalog/manufacturers.json?isoCode=${ISO}`);
  const brandById = new Map<number, string>(manufacturers.map((m) => [m.id, m.name]));
  console.log(`  manufacturers: ${manufacturers.length}`);

  // ── Determine which taxonomies are actually used, + ancestor chain ──────
  const usedTax = new Set<number>();
  for (const p of products) {
    let t: number | undefined = p.taxonomy;
    while (t && !usedTax.has(t)) {
      usedTax.add(t);
      const parent: number | undefined = byId.get(t)?.parentTaxonomy;
      t = parent && subtree.has(parent) ? parent : undefined;
    }
  }
  usedTax.add(ROOT_TAXONOMY);
  console.log(`  used taxonomies (with ancestors): ${usedTax.size}`);

  // ── Wipe existing catalogue ─────────────────────────────────────────────
  console.log("→ Clearing existing catalogue…");
  await prisma.productCategory.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  // ── Create categories (parents before children) ─────────────────────────
  console.log("→ Creating categories…");
  const catIdByTax = new Map<number, string>();
  // Topologically insert: repeatedly create nodes whose parent is done (or root).
  const pending = [...usedTax];
  let guard = 0;
  while (pending.length && guard < 1000) {
    guard++;
    const nextRound: number[] = [];
    for (const taxId of pending) {
      const t = byId.get(taxId);
      if (!t) continue;
      const isRoot = taxId === ROOT_TAXONOMY;
      const parentTax = t.parentTaxonomy;
      const parentReady = isRoot || !usedTax.has(parentTax) || catIdByTax.has(parentTax);
      if (!parentReady) {
        nextRound.push(taxId);
        continue;
      }
      const parentId =
        !isRoot && usedTax.has(parentTax) ? catIdByTax.get(parentTax) ?? null : null;
      const created = await prisma.category.create({
        data: {
          name: t.name,
          slug: slugify(`${t.url || t.name}-${t.id}`),
          parentId,
          isActive: true,
          sortOrder: 0,
          imageUrl: t.urlImages || null,
        },
      });
      catIdByTax.set(taxId, created.id);
    }
    if (nextRound.length === pending.length) {
      // No progress — attach the rest directly to root to avoid a stall.
      for (const taxId of nextRound) {
        const t = byId.get(taxId)!;
        const created = await prisma.category.create({
          data: {
            name: t.name,
            slug: slugify(`${t.url || t.name}-${t.id}`),
            parentId: catIdByTax.get(ROOT_TAXONOMY) ?? null,
            isActive: true,
          },
        });
        catIdByTax.set(taxId, created.id);
      }
      break;
    }
    pending.length = 0;
    pending.push(...nextRound);
  }
  console.log(`  categories created: ${catIdByTax.size}`);

  // ── Build & insert products in batches ──────────────────────────────────
  console.log("→ Building products…");
  const usedSlugs = new Set<string>();
  let skipped = 0;
  let created = 0;

  const BATCH = 500;
  let batchProducts: any[] = [];
  let batchMeta: { slug: string; taxonomy: number; images: string[]; alt: string }[] = [];

  async function flush() {
    if (batchProducts.length === 0) return;
    await prisma.product.createMany({ data: batchProducts, skipDuplicates: true });
    const inserted = await prisma.product.findMany({
      where: { slug: { in: batchMeta.map((m) => m.slug) } },
      select: { id: true, slug: true },
    });
    const idBySlug = new Map(inserted.map((p) => [p.slug, p.id]));
    const imageData: any[] = [];
    const catData: any[] = [];
    for (const m of batchMeta) {
      const pid = idBySlug.get(m.slug);
      if (!pid) continue;
      m.images.forEach((url, idx) =>
        imageData.push({ url, alt: m.alt, sortOrder: idx, productId: pid }),
      );
      const catId = catIdByTax.get(m.taxonomy);
      if (catId) catData.push({ productId: pid, categoryId: catId });
    }
    if (imageData.length)
      await prisma.productImage.createMany({ data: imageData, skipDuplicates: true });
    if (catData.length)
      await prisma.productCategory.createMany({ data: catData, skipDuplicates: true });
    created += inserted.length;
    process.stdout.write(`\r    …inserted ${created}   `);
    batchProducts = [];
    batchMeta = [];
  }

  for (const p of products) {
    const info = infoById.get(p.id);
    if (!info || !info.name) {
      skipped++;
      continue;
    }
    let slug = info.url ? slugify(info.url) : slugify(`${info.name}-${p.id}`);
    if (usedSlugs.has(slug)) slug = `${slug}-${p.id}`;
    if (usedSlugs.has(slug)) {
      skipped++;
      continue;
    }
    usedSlugs.add(slug);

    const price =
      p.inShopsPrice && p.inShopsPrice > 0
        ? p.inShopsPrice
        : p.retailPrice && p.retailPrice > 0
          ? p.retailPrice
          : p.wholesalePrice && p.wholesalePrice > 0
            ? Number((p.wholesalePrice * 1.6).toFixed(2))
            : 9.99;
    // Show a compare-at strike only when the RRP genuinely exceeds our price.
    const comparePrice =
      p.retailPrice && p.retailPrice > price ? Number(p.retailPrice.toFixed(2)) : null;

    const brand = p.manufacturer ? brandById.get(p.manufacturer) ?? null : null;
    const rawImgs = imagesById.get(p.id) ?? [];
    const orderedImgs = [...rawImgs].sort(
      (a, b) => (b.isCover ? 1 : 0) - (a.isCover ? 1 : 0) || (a.position ?? 0) - (b.position ?? 0),
    );
    const imgUrls = orderedImgs.map((i) => i.url).filter(Boolean).slice(0, 6);

    batchProducts.push({
      name: info.name,
      slug,
      sku: p.sku,
      ean: p.ean13 || null,
      gtin: p.ean13 || null,
      brand,
      description: info.description || null,
      shortDescription: info.description ? stripToShort(info.description) : null,
      price,
      comparePrice,
      costPrice: p.wholesalePrice ?? null,
      quantity: 25,
      trackInventory: true,
      status: p.active ? "ACTIVE" : "DRAFT",
      isFeatured: false,
      condition: (p.condition || "new").toLowerCase(),
      weight: p.weight ?? null,
      metaTitle: `${info.name} | Silk & Spark`,
      metaDescription: info.description ? stripToShort(info.description).slice(0, 160) : null,
      metadata: { bigbuyId: p.id, taxonomy: p.taxonomy },
    });
    batchMeta.push({ slug, taxonomy: p.taxonomy, images: imgUrls, alt: info.name });

    if (batchProducts.length >= BATCH) await flush();
  }
  await flush();
  process.stdout.write("\n");

  // Mark a spread of products as featured across categories.
  const featured = await prisma.product.findMany({
    where: { status: "ACTIVE", images: { some: {} } },
    select: { id: true },
    take: 400,
    orderBy: { createdAt: "desc" },
  });
  await prisma.product.updateMany({
    where: { id: { in: featured.map((f) => f.id) } },
    data: { isFeatured: true },
  });

  const [pc, cc, ic, lc] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.productImage.count(),
    prisma.productCategory.count(),
  ]);
  console.log(
    `\n✓ Done. Products: ${pc} (skipped ${skipped}), Categories: ${cc}, Images: ${ic}, Links: ${lc}, Featured: ${featured.length}`,
  );
}

main()
  .catch((e) => {
    console.error("\n" + (e?.stack || e));
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

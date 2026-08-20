import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { brand } from "./brand";

// Numeric coercion compatible with Prisma Decimal or plain numbers
type Numish = number | { toNumber?: () => number } | undefined | null;

function toNum(v: Numish): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  if (typeof v === "object" && typeof v.toNumber === "function") return v.toNumber();
  return Number(v);
}

function formatEur(amount: number): string {
  // Avoid the € glyph — StandardFonts (WinAnsi) render it inconsistently; use "EUR"
  return `EUR ${amount.toFixed(2)}`;
}

function formatDate(d: Date | string | undefined): string {
  const date = d ? new Date(d) : new Date();
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function shortId(order: { orderNumber?: string; orderId: string }): string {
  const raw = order.orderNumber || order.orderId;
  return raw.slice(-8).toUpperCase();
}

function shippingLabelFor(method: string): string {
  if (method === "express") return "Express (2-3 days)";
  if (method === "free") return "Economy (7-14 days)";
  return "Standard (5-7 days)";
}

// Strip characters the standard WinAnsi fonts cannot encode
function safe(input: string): string {
  return (input || "")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/[•]/g, "-")
    // drop any remaining non-Latin1 characters
    .replace(/[^\x20-\xFF]/g, "");
}

interface InvoiceItem {
  productName: string;
  productSku: string;
  quantity: number;
  price: Numish;
  total: Numish;
}

interface InvoiceAddress {
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string | null;
  city?: string;
  province?: string | null;
  postalCode?: string;
  country?: string;
}

export interface InvoicePdfData {
  orderId: string;
  orderNumber?: string;
  customerName: string;
  customerEmail: string;
  items: InvoiceItem[];
  subtotal: Numish;
  taxAmount: Numish;
  shippingCost: Numish;
  discountAmount?: Numish;
  total: Numish;
  shippingMethod: string;
  shippingAddress?: InvoiceAddress;
  createdAt?: Date | string;
}

const BRAND = rgb(0.898, 0.224, 0.208); // #E53935
const DARK = rgb(0.102, 0.102, 0.18); // #1A1A2E
const MUTED = rgb(0.4, 0.4, 0.4);
const LINE = rgb(0.9, 0.9, 0.9);

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 50;

function formatAddressLines(addr?: InvoiceAddress): string[] {
  if (!addr) return ["-"];
  const lines: string[] = [];
  const name = [addr.firstName, addr.lastName].filter(Boolean).join(" ");
  if (name) lines.push(name);
  if (addr.address1) lines.push(addr.address1);
  if (addr.address2) lines.push(addr.address2);
  const cityLine = [addr.city, addr.postalCode].filter(Boolean).join(", ");
  if (cityLine) lines.push(cityLine);
  if (addr.country) lines.push(addr.country);
  return lines.length ? lines.map(safe) : ["-"];
}

export async function generateInvoicePdf(data: InvoicePdfData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([PAGE_W, PAGE_H]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const id = shortId(data);
  const date = formatDate(data.createdAt);
  let y = PAGE_H - MARGIN;

  const text = (
    p: PDFPage,
    str: string,
    x: number,
    yy: number,
    size: number,
    f: PDFFont,
    color = DARK,
  ) => {
    p.drawText(safe(str), { x, y: yy, size, font: f, color });
  };

  const textRight = (str: string, xRight: number, yy: number, size: number, f: PDFFont, color = DARK) => {
    const w = f.widthOfTextAtSize(safe(str), size);
    text(page, str, xRight - w, yy, size, f, color);
  };

  // ── Header ──────────────────────────────────────────────
  text(page, "FeruToys", MARGIN, y - 8, 24, bold, BRAND);
  textRight("INVOICE", PAGE_W - MARGIN, y - 6, 22, bold, DARK);
  textRight(`#${id}`, PAGE_W - MARGIN, y - 24, 11, font, MUTED);
  textRight(date, PAGE_W - MARGIN, y - 38, 11, font, MUTED);

  y -= 60;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_W - MARGIN, y },
    thickness: 2,
    color: LINE,
  });
  y -= 24;

  // ── From / Bill To ─────────────────────────────────────
  const colRightX = PAGE_W / 2 + 10;
  const blockTop = y;

  text(page, "FROM", MARGIN, y, 9, bold, MUTED);
  text(page, "BILLED TO", colRightX, y, 9, bold, MUTED);
  y -= 16;

  const fromLines = [
    brand.company.legalName,
    `Registration number: ${brand.company.number}`,
    `${brand.company.address.line1}, ${brand.company.address.line2}`,
    `${brand.company.address.city}, ${brand.company.address.region}`,
    `${brand.company.address.postcode}, ${brand.company.address.country}`,
    brand.contact.email,
  ];
  const billLines = [data.customerName, data.customerEmail];

  let yLeft = y;
  for (const l of fromLines) {
    text(page, l, MARGIN, yLeft, 10, font, DARK);
    yLeft -= 14;
  }
  let yRight = y;
  for (const l of billLines) {
    text(page, l, colRightX, yRight, 10, font, DARK);
    yRight -= 14;
  }

  y = Math.min(yLeft, yRight) - 10;

  // ── Ship To / Shipping method ──────────────────────────
  void blockTop;
  text(page, "SHIP TO", MARGIN, y, 9, bold, MUTED);
  text(page, "SHIPPING METHOD", colRightX, y, 9, bold, MUTED);
  y -= 16;

  const shipLines = formatAddressLines(data.shippingAddress);
  yLeft = y;
  for (const l of shipLines) {
    text(page, l, MARGIN, yLeft, 10, font, DARK);
    yLeft -= 14;
  }
  text(page, shippingLabelFor(data.shippingMethod), colRightX, y, 10, font, DARK);

  y = yLeft - 20;

  // ── Items table ────────────────────────────────────────
  const colProduct = MARGIN;
  const colQty = 360;
  const colUnit = 430;
  const colTotal = PAGE_W - MARGIN;

  page.drawRectangle({
    x: MARGIN,
    y: y - 6,
    width: PAGE_W - MARGIN * 2,
    height: 22,
    color: rgb(0.97, 0.97, 0.97),
  });
  text(page, "PRODUCT", colProduct + 6, y, 9, bold, MUTED);
  text(page, "QTY", colQty, y, 9, bold, MUTED);
  text(page, "UNIT", colUnit, y, 9, bold, MUTED);
  textRight("TOTAL", colTotal - 6, y, 9, bold, MUTED);
  y -= 24;

  for (const item of data.items) {
    text(page, item.productName, colProduct + 6, y, 10, font, DARK);
    text(page, `SKU: ${item.productSku}`, colProduct + 6, y - 12, 8, font, MUTED);
    text(page, String(item.quantity), colQty, y, 10, font, DARK);
    text(page, formatEur(toNum(item.price)), colUnit, y, 10, font, DARK);
    textRight(formatEur(toNum(item.total)), colTotal - 6, y, 10, bold, DARK);
    y -= 28;
    page.drawLine({
      start: { x: MARGIN, y: y + 8 },
      end: { x: PAGE_W - MARGIN, y: y + 8 },
      thickness: 0.5,
      color: LINE,
    });
  }

  y -= 6;

  // ── Totals ─────────────────────────────────────────────
  const totalsX = 360;
  const shipping = toNum(data.shippingCost);
  const discount = toNum(data.discountAmount);

  const totalRow = (label: string, value: string, strong = false, color = DARK) => {
    text(page, label, totalsX, y, strong ? 12 : 10, strong ? bold : font, color);
    textRight(value, colTotal - 6, y, strong ? 12 : 10, strong ? bold : font, color);
    y -= strong ? 20 : 16;
  };

  totalRow("Subtotal", formatEur(toNum(data.subtotal)));
  totalRow(
    `Shipping (${shippingLabelFor(data.shippingMethod)})`,
    shipping === 0 ? "Free" : formatEur(shipping),
  );
  totalRow("Tax (21%)", formatEur(toNum(data.taxAmount)));
  if (discount > 0) {
    totalRow("Discount", `-${formatEur(discount)}`, false, rgb(0.18, 0.49, 0.2));
  }
  page.drawLine({
    start: { x: totalsX, y: y + 6 },
    end: { x: PAGE_W - MARGIN, y: y + 6 },
    thickness: 1.5,
    color: LINE,
  });
  y -= 12;
  totalRow("Total", formatEur(toNum(data.total)), true);

  // ── Footer note ────────────────────────────────────────
  const footerY = MARGIN + 30;
  page.drawLine({
    start: { x: MARGIN, y: footerY + 18 },
    end: { x: PAGE_W - MARGIN, y: footerY + 18 },
    thickness: 0.5,
    color: LINE,
  });
  text(
    page,
    "VAT is included in the prices shown where applicable. This invoice serves as proof of purchase.",
    MARGIN,
    footerY,
    8,
    font,
    MUTED,
  );
  text(
    page,
    "For any questions, contact info@ferutoys.com - (c) FeruToys, ferutoys.com",
    MARGIN,
    footerY - 12,
    8,
    font,
    MUTED,
  );

  return doc.save();
}

export function invoiceFileName(data: { orderNumber?: string; orderId: string }): string {
  return `invoice-${shortId(data)}.pdf`;
}

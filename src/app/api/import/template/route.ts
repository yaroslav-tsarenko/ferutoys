import { NextResponse } from "next/server";

export async function GET() {
  const headers = [
    "name", "sku", "price", "comparePrice", "quantity", "description",
    "shortDescription", "category", "subCategory", "subSubCategory",
    "brand", "weight", "status", "imageUrl", "gtin", "ean", "mpn",
    "googleCategory", "condition", "characteristics",
  ];

  const sampleRow = [
    "Silk Touch Rechargeable Vibrator", "SKU-001", "69.00", "89.00", "20",
    "A whisper-quiet, body-safe silicone vibrator with multiple patterns and USB-C charging — soft to the touch and fully waterproof.",
    "Body-safe silicone · 10 patterns · USB-C rechargeable · waterproof.",
    "Erotic Toys", "Vibrators", "",
    "LELO", "0.25", "ACTIVE", "", "", "", "", "Health & Beauty > Personal Care > Massagers", "new",
    "Material>>Body:Body-safe silicone|Power>>Charging:USB-C rechargeable|Feature>>Waterproof:IPX7|Feature>>Noise:Under 50dB|Dimension>>Insertable:11cm",
  ];

  const csv = [headers.join(","), sampleRow.join(",")].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=import-template.csv",
    },
  });
}

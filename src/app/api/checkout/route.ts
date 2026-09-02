import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validators/checkout";
import { getSessionUser } from "@/lib/auth";
import { sendOrderConfirmationEmail, sendOrderInvoiceEmail } from "@/lib/email";
import { scheduleEmail } from "@/lib/email-jobs";
import { resolveDiscount, markDiscountUsed } from "@/lib/discounts";
import { ColibrixAPI } from "@/lib/payments/colibrix";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();

    const body = await request.json();
    const validated = checkoutSchema.parse(body);
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!validated.contact.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const productIds = items.map((item: { productId: string }) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const orderItems = items.map((item: { productId: string; quantity: number; variantName?: string }) => {
      const product = productMap.get(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);

      const itemTotal = Number(product.price) * item.quantity;
      subtotal += itemTotal;

      return {
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        variantName: item.variantName || null,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal,
      };
    });

    const discount = await resolveDiscount({
      userId: user?.id ?? null,
      email: validated.contact.email,
      code: validated.discountCode ?? null,
    });

    const discountAmount = discount ? +(subtotal * (discount.percent / 100)).toFixed(2) : 0;
    const discountedSubtotal = subtotal - discountAmount;

    const taxRate = 21;
    const taxAmount = +(discountedSubtotal * (taxRate / 100)).toFixed(2);
    const shippingCost = discountedSubtotal >= 100 ? 0 : 5.99;
    const total = +(discountedSubtotal + taxAmount + shippingCost).toFixed(2);

    const order = await prisma.order.create({
      data: {
        userId: user?.id || null,
        customerName: `${validated.shipping.firstName} ${validated.shipping.lastName}`,
        customerEmail: validated.contact.email,
        customerPhone: validated.contact.phone,
        shippingAddress: validated.shipping,
        shippingMethod: validated.shippingMethod,
        shippingCost,
        subtotal,
        taxAmount,
        discountAmount,
        discountCode: discount?.code ?? null,
        discountPercent: discount?.percent ?? null,
        total,
        paymentMethod: "transfermit",
        items: { create: orderItems },
      },
      include: { items: true },
    });

    if (discount) {
      await markDiscountUsed(discount, user?.id ?? null);
    }

    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { quantity: { decrement: item.quantity } },
      });
    }

    // Initialize payment on Colibrix
    let redirectUrl = "";
    try {
      const api = new ColibrixAPI();

      const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "localhost:5555";
      const proto = request.headers.get("x-forwarded-proto") || "http";
      const baseUrl = `${proto}://${host}`;

      // Colibrix CloudFront WAF blocks request payloads containing "localhost" or "127.0.0.1".
      // 1. Webhook URL must always be a public HTTPS endpoint
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ferutoys.com";
      const webhookUrl = `${siteUrl.replace(/\/+$/, "")}/api/webhooks/colibrix`;

      // 2. Return URL: in local dev, use lvh.me (points to 127.0.0.1) to avoid WAF block while redirecting to localhost
      let returnBaseUrl = baseUrl;
      if (host.includes("localhost") || host.includes("127.0.0.1")) {
        const port = host.split(":")[1] || "5555";
        returnBaseUrl = `http://lvh.me:${port}`;
      }

      // Convert total amount to minor units (cents)
      const amountInMinor = Math.round(total * 100);

      const paymentData = {
        order: {
          amount: amountInMinor,
          currency: "EUR",
          description: `Order ${order.orderNumber || order.id} payment`,
          reference_id: order.id,
        },
        payment_method: {
          type: "card" as const,
        },
        available_payment_methods: ["card", "apple_pay", "google_pay"] as const,
        customer: {
          first_name: validated.shipping.firstName,
          last_name: validated.shipping.lastName,
          email: validated.contact.email,
          phone: validated.contact.phone || undefined,
          address: {
            line1: validated.shipping.address1,
            city: validated.shipping.city,
            country: validated.shipping.country,
            postal_code: validated.shipping.postalCode,
            state: validated.shipping.province || undefined,
          },
        },
        settings: {
          expires_in: 900,
          language: "en-GB",
          return_url: `${returnBaseUrl}/order/confirmed?orderId=${order.id}`,
          webhook_url: webhookUrl,
        },
      };

      const colibrixRes = await api.createPaymentSession(paymentData);

      if (colibrixRes && colibrixRes.transaction_id) {
        const { transaction_id: paymentId, redirect_url: rUrl } = colibrixRes;

        // Update order with paymentId
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentId: paymentId,
          },
        });

        redirectUrl = rUrl || "";
      } else {
        throw new Error("Colibrix did not return a valid transaction_id.");
      }
    } catch (e) {
      console.error("Colibrix payment creation failed:", e);

      // Rollback order creation
      await prisma.order.delete({
        where: { id: order.id },
      });

      // Restore stock inventory
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { quantity: { increment: item.quantity } },
        });
      }

      return NextResponse.json(
        { error: "Payment initialization failed. Please try again." },
        { status: 500 }
      );
    }

    const emailPayload = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: order.items,
      subtotal: order.subtotal,
      taxAmount: order.taxAmount,
      shippingCost: order.shippingCost,
      discountAmount: order.discountAmount,
      total: order.total,
      shippingMethod: order.shippingMethod || "standard",
      shippingAddress: validated.shipping,
      createdAt: order.createdAt,
    };

    scheduleEmail(`order confirmation ${order.orderNumber}`, () => sendOrderConfirmationEmail(emailPayload));
    scheduleEmail(`order invoice ${order.orderNumber}`, () => sendOrderInvoiceEmail(emailPayload));

    return NextResponse.json({ ...order, redirectUrl }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

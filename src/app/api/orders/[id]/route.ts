import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ColibrixAPI } from "@/lib/payments/colibrix";
import { sendOrderConfirmationEmail, sendOrderInvoiceEmail } from "@/lib/email";
import { scheduleEmail } from "@/lib/email-jobs";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        user: { select: { name: true, email: true, avatarUrl: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If order is still PENDING and has paymentId (transaction_id from Colibrix),
    // sync status directly with Colibrix API in case webhook was delayed
    if (order.paymentStatus === "PENDING" && order.paymentId) {
      try {
        const api = new ColibrixAPI();
        const trxStatus = await api.getTransactionStatus(order.paymentId);
        const status = (trxStatus?.status || "").toLowerCase();

        if (status === "successful" || status === "success" || status === "paid") {
          order = await prisma.order.update({
            where: { id: order.id },
            data: {
              status: "CONFIRMED",
              paymentStatus: "PAID",
            },
            include: {
              items: true,
              user: { select: { name: true, email: true, avatarUrl: true } },
            },
          });

          const emailPayload = {
            orderId: order.id,
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            items: order.items,
            subtotal: Number(order.subtotal),
            taxAmount: Number(order.taxAmount),
            shippingCost: Number(order.shippingCost),
            discountAmount: Number(order.discountAmount),
            total: Number(order.total),
            shippingMethod: order.shippingMethod || "standard",
            shippingAddress: (order.shippingAddress as any) || {},
            createdAt: order.createdAt,
          };

          scheduleEmail(`order confirmation ${order.orderNumber}`, () => sendOrderConfirmationEmail(emailPayload));
          scheduleEmail(`order invoice ${order.orderNumber}`, () => sendOrderInvoiceEmail(emailPayload));
        } else if (status === "failed" || status === "declined" || status === "cancelled" || status === "error") {
          order = await prisma.order.update({
            where: { id: order.id },
            data: {
              status: "CANCELLED",
              paymentStatus: "FAILED",
            },
            include: {
              items: true,
              user: { select: { name: true, email: true, avatarUrl: true } },
            },
          });
        }
      } catch (e) {
        console.error("Failed to query Colibrix transaction status:", e);
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

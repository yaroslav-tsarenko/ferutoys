import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const signatureKey = process.env.COLIBRIX_SIGNATURE_KEY;
    const rawBody = await request.text();

    // Verify signature if the signature key is configured
    if (signatureKey && signatureKey !== "your_colibrix_signature_key_here" && signatureKey.trim() !== "") {
      const signatureV2 = request.headers.get("x-signature-v2") || request.headers.get("X-Signature-V2");
      const signatureLegacy = request.headers.get("x-signature") || request.headers.get("X-Signature");

      let isValid = false;

      if (signatureV2) {
        const expectedSignature = crypto
          .createHmac("sha256", signatureKey)
          .update(rawBody)
          .digest("hex");
        const signatureBuffer = Buffer.from(signatureV2);
        const expectedSignatureBuffer = Buffer.from(expectedSignature);

        if (
          signatureBuffer.length === expectedSignatureBuffer.length &&
          crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
        ) {
          isValid = true;
        }
      } else if (signatureLegacy) {
        const expectedLegacy = crypto
          .createHash("sha256")
          .update(rawBody + signatureKey)
          .digest("hex");
        const signatureBuffer = Buffer.from(signatureLegacy);
        const expectedSignatureBuffer = Buffer.from(expectedLegacy);

        if (
          signatureBuffer.length === expectedSignatureBuffer.length &&
          crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
        ) {
          isValid = true;
        }
      }

      if (!isValid && (signatureV2 || signatureLegacy)) {
        console.error("[Colibrix Webhook] Signature verification failed");
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    console.log("[Colibrix Webhook] Received webhook event:", payload);

    const {
      event_type,
      transaction_operation,
      transaction_status,
      payment_token,
      order: orderPayload,
    } = payload;

    const referenceId = orderPayload?.reference_id;

    if (!referenceId) {
      console.error("[Colibrix Webhook] Missing order.reference_id in payload");
      return NextResponse.json({ error: "Missing reference_id" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: referenceId },
    });

    if (!order) {
      console.error(`[Colibrix Webhook] Order not found for id: ${referenceId}`);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Process status updates
    if (transaction_status === "success") {
      switch (transaction_operation) {
        case "charge":
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: "CONFIRMED",
              paymentStatus: "PAID",
              paymentId: payment_token,
            },
          });
          console.log(`[Colibrix Webhook] Order ${order.id} paid successfully via charge`);
          break;

        case "refund":
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: "REFUNDED",
              paymentStatus: "REFUNDED",
              paymentId: payment_token,
            },
          });
          console.log(`[Colibrix Webhook] Order ${order.id} refunded successfully`);
          break;

        case "cancel":
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: "CANCELLED",
              paymentStatus: "FAILED",
              paymentId: payment_token,
            },
          });
          console.log(`[Colibrix Webhook] Order ${order.id} cancelled successfully`);
          break;

        default:
          console.log(`[Colibrix Webhook] Unhandled successful operation: ${transaction_operation}`);
          break;
      }
    } else if (transaction_status === "failed") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "CANCELLED",
          paymentStatus: "FAILED",
          paymentId: payment_token,
        },
      });
      console.log(`[Colibrix Webhook] Order ${order.id} marked failed (operation: ${transaction_operation})`);
    } else if (transaction_status === "pending" || transaction_status === "new") {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PENDING",
          paymentId: payment_token,
        },
      });
      console.log(`[Colibrix Webhook] Order ${order.id} payment pending`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Colibrix Webhook] Internal handler error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();

  const headersList = await headers();

  const signature = headersList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);
    return new Response("Webhook Processing Failed", { status: 500 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const customerId = session.customer as string;
    const enrollmentId = session.metadata?.enrollmentId;
    const courseId = session.metadata?.courseId;

    if (!enrollmentId || !courseId) {
      return new Response("Missing metadata", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        stripeCustomerId: customerId,
      },
    });

    if (!user) {
      throw new Error("User not Found...");
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        id: enrollmentId,
      },
    });

    if (enrollment?.status === "Active") {
      return new Response("Already processed", { status: 200 });
    }

    await prisma.enrollment.update({
      where: {
        id: enrollmentId,
      },
      data: {
        userId: user.id,
        courseId: courseId,
        amount: (session.amount_total ?? 0) / 100,
        status: "Active",
      },
    });
  }
  return new Response(null, { status: 200 });
}

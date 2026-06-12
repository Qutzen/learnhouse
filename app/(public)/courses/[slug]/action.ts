"use server";

import { requireUser } from "@/app/data/user/require-user";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { request } from "@arcjet/next";
import Stripe from "stripe";

type EnrollmentResponse =
  | {
      status: "success";
      message: string;
      checkoutUrl?: string | null;
    }
  | {
      status: "error";
      message: string;
    };

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 3,
  }),
);

export async function enrollInCourseAction(
  courseId: string,
): Promise<EnrollmentResponse> {
  const user = await requireUser();
  try {
    const req = await request();

    const decision = await aj.protect(req, {
      fingerprint: user.id,
    });

    if (decision.isDenied()) {
      return {
        status: "error",
        message: "You have been Blocked",
      };
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        title: true,
        price: true,
        slug: true,
        stripePriceId: true,
      },
    });

    if (!course) {
      return {
        status: "error",
        message: "Course not Found",
      };
    }

    let stripeCustomerId: string;

    const userWithStripeCustomerId = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (userWithStripeCustomerId?.stripeCustomerId) {
      stripeCustomerId = userWithStripeCustomerId.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerId = customer.id;

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeCustomerId: stripeCustomerId,
        },
      });
    }

    // const result = await prisma.$transaction(async (tx) => {
    //   const existingEnrollment = await tx.enrollment.findUnique({
    //     where: {
    //       userId_courseId: {
    //         userId: user.id,
    //         courseId: courseId,
    //       },
    //     },
    //     select: {
    //       status: true,
    //       id: true,
    //     },
    //   });
    //   if (existingEnrollment?.status === "Active") {
    //     return null;
    //   }

    //   let enrollment;
    //   if (existingEnrollment) {
    //     enrollment = await tx.enrollment.update({
    //       where: {
    //         id: existingEnrollment.id,
    //       },
    //       data: {
    //         amount: course.price,
    //         status: "Pending",
    //         updatedAt: new Date(),
    //       },
    //     });
    //   } else {
    //     enrollment = await tx.enrollment.create({
    //       data: {
    //         userId: user.id,
    //         courseId: course.id,
    //         amount: course.price,
    //         status: "Pending",
    //       },
    //     });
    //   }

    //   const checkoutSession = await stripe.checkout.sessions.create({
    //     customer: stripeCustomerId,
    //     line_items: [
    //       {
    //         price: "price_1ThWkvQjr0ReqUH4zBuRAmqm",
    //         quantity: 1,
    //       },
    //     ],
    //     mode: "payment",
    //     success_url: `${env.BETTER_AUTH_URL}/payment/success`,
    //     cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
    //     metadata: {
    //       userId: user.id,
    //       courseId: course.id,
    //       enrollmentId: enrollment.id,
    //     },
    //   });
    //   return {
    //     enrollment: enrollment,
    //     checkoutUrl: checkoutSession.url,
    //   };
    // });

    const enrollment = await prisma.$transaction(async (tx) => {
      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId,
          },
        },
        select: {
          id: true,
          status: true,
        },
      });

      if (existingEnrollment?.status === "Active") {
        return null;
      }

      if (existingEnrollment?.status === "Pending") {
        return await tx.enrollment.update({
          where: {
            id: existingEnrollment.id,
          },
          data: {
            updatedAt: new Date(),
          },
        });
      }

      if (existingEnrollment) {
        return await tx.enrollment.update({
          where: {
            id: existingEnrollment.id,
          },
          data: {
            amount: course.price,
            status: "Pending",
            updatedAt: new Date(),
          },
        });
      }

      return await tx.enrollment.create({
        data: {
          userId: user.id,
          courseId: course.id,
          amount: course.price,
          status: "Pending",
        },
      });
    });
    if (!enrollment) {
      return {
        status: "success",
        message: "You are already enrolled in this Course",
      };
    }
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: course.stripePriceId!,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${env.BETTER_AUTH_URL}/payment/success`,
      cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
      metadata: {
        userId: user.id,
        courseId: course.id,
        enrollmentId: enrollment.id,
      },
    });

    return {
      status: "success",
      message: "Redirecting to payment",
      checkoutUrl: checkoutSession.url,
    };

    // checkoutUrl = result.checkoutUrl as string;

    // return {
    //   status: "success",
    //   message: "Stripe Customer Created",
    // };
  } catch (error) {
    console.error("ENROLL ERROR:", error);

    if (error instanceof Stripe.errors.StripeError) {
      return {
        status: "error" as const,
        message: error.message,
      };
    }

    return {
      status: "error" as const,
      message:
        error instanceof Error ? error.message : "Failed to enroll in course",
    };
  }
}

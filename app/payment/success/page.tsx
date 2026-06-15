"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const [countdown, setCountdown] = useState(10);

  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/dashboard");
    }, 10000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl  p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="relative mb-8 flex justify-center">
          <div className="absolute h-24 w-24 animate-ping rounded-full bg-green-400 opacity-20"></div>

          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-500 shadow-xl">
            <svg
              className="h-12 w-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-bold">Payment Successful!</h1>

        <p className="mb-6 text-lg text-muted-foreground">
          Congrats, Your Payment was Successfull.
          <br /> You Should now access to the Course!
        </p>

        <div className="mb-8 rounded-lg bg-slate-50 p-4">
          <p className="text-slate-700">
            You will be automatically redirected in{" "}
            <span className="font-bold text-red-600">{countdown}</span> seconds.
          </p>
        </div>

        <Button asChild variant="outline" className="h-10 rounded-md">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}

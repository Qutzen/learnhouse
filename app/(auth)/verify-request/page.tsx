import { Suspense } from "react";
import VerifyRequestForm from "./VerifyRequestForm";

export default function VerifyRequestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyRequestForm />
    </Suspense>
  );
}

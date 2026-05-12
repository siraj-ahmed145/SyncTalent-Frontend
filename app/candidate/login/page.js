import { Suspense } from "react";
import CandidateLogin from "./CandidateLogin";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CandidateLogin />
    </Suspense>
  );
}
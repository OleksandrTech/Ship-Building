import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
          <div className="h-6 w-32 rounded bg-zinc-200" />
          <div className="mt-4 h-4 w-64 rounded bg-zinc-100" />
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}


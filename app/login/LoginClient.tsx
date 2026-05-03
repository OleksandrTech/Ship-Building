"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";


export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    { type: "idle" } | { type: "sent" } | { type: "error"; message: string }
  >({ type: "idle" });

  function getCallbackUrl() {
    const url = new URL("/auth/callback", window.location.href);
    url.searchParams.set("redirectTo", redirectTo);
    return url.toString();
  }

  async function signInWithGoogle() {
    setStatus({ type: "idle" });
    const supabase = createSupabaseBrowserClient();
    const callbackUrl = getCallbackUrl();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl },
    });
    if (error) setStatus({ type: "error", message: error.message });
  }

  async function signInWithMagicLink(e: FormEvent) {
    e.preventDefault();
    setStatus({ type: "idle" });
    const supabase = createSupabaseBrowserClient();
    const callbackUrl = getCallbackUrl();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callbackUrl },
    });
    if (error) setStatus({ type: "error", message: error.message });
    else setStatus({ type: "sent" });
  }

  async function maybeGoHome() {
    router.push("/");
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Admin sign in</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Sign in to access the admin panel.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        <button
          type="button"
          onClick={signInWithGoogle}
          className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Continue with Google
        </button>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-200" />
          <div className="text-xs uppercase tracking-wide text-zinc-500">or</div>
          <div className="h-px flex-1 bg-zinc-200" />
        </div>

        <form onSubmit={signInWithMagicLink} className="flex flex-col gap-3">
          <label className="text-sm font-medium">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="you@company.com"
            className="h-11 rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
          />
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium hover:bg-zinc-50"
          >
            Send magic link
          </button>
        </form>

        {status.type === "sent" ? (
          <p className="text-sm text-emerald-700">
            Magic link sent. Check your inbox.
          </p>
        ) : null}
        {status.type === "error" ? (
          <p className="text-sm text-red-700">{status.message}</p>
        ) : null}

        <button
          type="button"
          onClick={maybeGoHome}
          className="mt-4 text-left text-sm text-zinc-600 underline underline-offset-4 hover:text-zinc-900"
        >
          Back to website
        </button>
      </div>
    </div>
  );
}


"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type SiteSettingsRow = {
  id: number;
  company_name: string;
  contact_email: string;
  contact_phone: string;
};

type ServiceRow = {
  id: string;
  title: string;
  sort_order: number;
};

export default function AdminDashboard({
  userEmail,
  initialSettings,
  initialServices,
}: {
  userEmail: string;
  initialSettings: SiteSettingsRow | null;
  initialServices: ServiceRow[];
}) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [settings, setSettings] = useState<SiteSettingsRow>({
    id: 1,
    company_name: initialSettings?.company_name ?? "Company",
    contact_email: initialSettings?.contact_email ?? "hello@example.com",
    contact_phone: initialSettings?.contact_phone ?? "+1 555 000 0000",
  });

  const [services, setServices] = useState<ServiceRow[]>(initialServices);
  const [newServiceTitle, setNewServiceTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<
    null | { type: "ok" | "error"; text: string }
  >(null);

  async function signOut() {
    setBusy(true);
    setMessage(null);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function saveSettings(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);

    const { error } = await supabase.from("site_settings").upsert(
      {
        id: 1,
        company_name: settings.company_name,
        contact_email: settings.contact_email,
        contact_phone: settings.contact_phone,
      },
      { onConflict: "id" }
    );

    if (error) setMessage({ type: "error", text: error.message });
    else {
      setMessage({ type: "ok", text: "Saved." });
      router.refresh();
    }
    setBusy(false);
  }

  async function addService(e: FormEvent) {
    e.preventDefault();
    const title = newServiceTitle.trim();
    if (!title) return;

    setBusy(true);
    setMessage(null);

    const nextSort =
      services.length === 0
        ? 0
        : Math.max(...services.map((s) => s.sort_order ?? 0)) + 1;

    const { data, error } = await supabase
      .from("services")
      .insert({ title, sort_order: nextSort })
      .select("id,title,sort_order")
      .single();

    if (error) setMessage({ type: "error", text: error.message });
    else {
      setServices((prev) =>
        [...prev, data].sort((a, b) => a.sort_order - b.sort_order)
      );
      setNewServiceTitle("");
      setMessage({ type: "ok", text: "Service added." });
      router.refresh();
    }
    setBusy(false);
  }

  function patchServiceLocal(id: string, patch: Partial<ServiceRow>) {
    setServices((prev) =>
      prev
        .map((s) => (s.id === id ? { ...s, ...patch } : s))
        .sort((a, b) => a.sort_order - b.sort_order)
    );
  }

  async function saveService(id: string) {
    const existing = services.find((s) => s.id === id);
    if (!existing) return;

    setBusy(true);
    setMessage(null);

    const { error } = await supabase
      .from("services")
      .update({ title: existing.title, sort_order: existing.sort_order })
      .eq("id", id);

    if (error) setMessage({ type: "error", text: error.message });
    else {
      setMessage({ type: "ok", text: "Service saved." });
      router.refresh();
    }

    setBusy(false);
  }

  async function deleteService(id: string) {
    setBusy(true);
    setMessage(null);

    const snapshot = services;
    setServices((prev) => prev.filter((s) => s.id !== id));

    const { error } = await supabase.from("services").delete().eq("id", id);

    if (error) {
      setServices(snapshot);
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "ok", text: "Service deleted." });
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <>
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Signed in as <span className="font-medium">{userEmail}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={signOut}
          disabled={busy}
          className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium hover:bg-zinc-50 disabled:opacity-60"
        >
          Sign out
        </button>
      </div>

      {message ? (
        <div
          className={[
            "mt-6 rounded-md border px-4 py-3 text-sm",
            message.type === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-900",
          ].join(" ")}
        >
          {message.text}
        </div>
      ) : null}

      <div className="mt-8 grid grid-cols-1 gap-8">
        <section className="rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="text-base font-semibold">Company settings</h2>
          <form onSubmit={saveSettings} className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm font-medium">
              Company name
              <input
                value={settings.company_name}
                onChange={(e) =>
                  setSettings((s) => ({ ...s, company_name: e.target.value }))
                }
                className="h-11 rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
              />
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                Contact email
                <input
                  value={settings.contact_email}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, contact_email: e.target.value }))
                  }
                  type="email"
                  className="h-11 rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Contact phone
                <input
                  value={settings.contact_phone}
                  onChange={(e) =>
                    setSettings((s) => ({ ...s, contact_phone: e.target.value }))
                  }
                  className="h-11 rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
                />
              </label>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                disabled={busy}
                className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
              >
                Save settings
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-6">
          <h2 className="text-base font-semibold">Services</h2>
          <form onSubmit={addService} className="mt-5 flex gap-3">
            <input
              value={newServiceTitle}
              onChange={(e) => setNewServiceTitle(e.target.value)}
              placeholder="New service name"
              className="h-11 flex-1 rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
            />
            <button
              type="submit"
              disabled={busy}
              className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              Add
            </button>
          </form>

          <div className="mt-6 grid gap-3">
            {services.length === 0 ? (
              <p className="text-sm text-zinc-600">No services yet.</p>
            ) : (
              services.map((s) => (
                <div
                  key={s.id}
                  className="grid grid-cols-1 gap-3 rounded-md border border-zinc-200 p-4 sm:grid-cols-[1fr_120px_auto_auto]"
                >
                  <label className="grid gap-2 text-sm font-medium">
                    Name
                    <input
                      value={s.title}
                      onChange={(e) =>
                        patchServiceLocal(s.id, { title: e.target.value })
                      }
                      className="h-10 rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    Order
                    <input
                      value={String(s.sort_order ?? 0)}
                      onChange={(e) =>
                        patchServiceLocal(s.id, {
                          sort_order: Number.parseInt(e.target.value || "0", 10),
                        })
                      }
                      inputMode="numeric"
                      className="h-10 rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-zinc-900"
                    />
                  </label>
                  <div className="flex items-end justify-end">
                    <button
                      type="button"
                      onClick={() => saveService(s.id)}
                      disabled={busy}
                      className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-3 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
                    >
                      Save
                    </button>
                  </div>
                  <div className="flex items-end justify-end">
                    <button
                      type="button"
                      onClick={() => deleteService(s.id)}
                      disabled={busy}
                      className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium hover:bg-zinc-50 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </>
  );
}


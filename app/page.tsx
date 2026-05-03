import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const [{ data: settings }, { data: services }] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("services").select("*").order("sort_order", { ascending: true }),
  ]);

  const companyName = settings?.company_name ?? "Company";
  const contactEmail = settings?.contact_email ?? "hello@example.com";
  const contactPhone = settings?.contact_phone ?? "+1 555 000 0000";

  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-16">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-medium text-zinc-500">Welcome</p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
            {companyName}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-zinc-600">
            This page is powered by Supabase. Update content from the admin panel
            and it will appear here automatically.
          </p>
        </header>

        <section className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="text-base font-semibold text-zinc-900">Services</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-700">
              {(services ?? []).length === 0 ? (
                <li className="text-zinc-500">No services added yet.</li>
              ) : (
                services!.map((s) => (
                  <li key={s.id} className="rounded-md border border-zinc-100 p-3">
                    {s.title}
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h2 className="text-base font-semibold text-zinc-900">Contact</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="rounded-md border border-zinc-100 p-3">
                <div className="text-xs font-medium text-zinc-500">Email</div>
                <a
                  className="mt-1 block font-medium text-zinc-900 underline underline-offset-4"
                  href={`mailto:${contactEmail}`}
                >
                  {contactEmail}
                </a>
              </div>
              <div className="rounded-md border border-zinc-100 p-3">
                <div className="text-xs font-medium text-zinc-500">Phone</div>
                <a
                  className="mt-1 block font-medium text-zinc-900 underline underline-offset-4"
                  href={`tel:${contactPhone}`}
                >
                  {contactPhone}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

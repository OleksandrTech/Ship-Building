import GalleryCarousel from "@/components/GalleryCarousel";
import { toGalleryViews, type GalleryImageRow } from "@/lib/gallery";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createSupabaseServerClient();
  const [{ data: settings }, { data: services }, { data: galleryRows }] =
    await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("services").select("*").order("sort_order", { ascending: true }),
      supabase
        .from("gallery_images")
        .select("id,storage_path,sort_order")
        .order("sort_order", { ascending: true }),
    ]);

  const companyName = settings?.company_name ?? "Company";
  const contactEmail = settings?.contact_email ?? "hello@example.com";
  const contactPhone = settings?.contact_phone ?? "+1 555 000 0000";
  const galleryImages = toGalleryViews((galleryRows ?? []) as GalleryImageRow[]);

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 scale-105 bg-[url('/images/ship-background.jpg')] bg-cover bg-center bg-no-repeat blur-md"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-black/45"
      />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-16">
        <header className="flex flex-col gap-3">
          <h1 className="text-4xl font-semibold tracking-tight text-white drop-shadow-md sm:text-5xl">
            {companyName}
          </h1>
        </header>

        <section className="mt-12 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-sm">
            <h2 className="text-base font-semibold text-white">Services</h2>
            <ul className="mt-4 space-y-2 text-sm text-white/90">
              {(services ?? []).length === 0 ? (
                <li className="text-white/60">No services added yet.</li>
              ) : (
                services!.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-md border border-white/15 bg-white/5 p-3"
                  >
                    {s.title}
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="flex flex-col justify-center">
            <GalleryCarousel images={galleryImages} />
          </div>

          <div className="rounded-xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-sm">
            <h2 className="text-base font-semibold text-white">Contact</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="rounded-md border border-white/15 bg-white/5 p-3">
                <div className="text-xs font-medium text-white/60">Email</div>
                <a
                  className="mt-1 block font-medium text-white underline underline-offset-4 hover:text-white/80"
                  href={`mailto:${contactEmail}`}
                >
                  {contactEmail}
                </a>
              </div>
              <div className="rounded-md border border-white/15 bg-white/5 p-3">
                <div className="text-xs font-medium text-white/60">Phone</div>
                <a
                  className="mt-1 block font-medium text-white underline underline-offset-4 hover:text-white/80"
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

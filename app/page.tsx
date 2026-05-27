import SiteHeader from "@/components/SiteHeader";
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
  const mainDescription = settings?.main_description ?? "Built on a foundation of precision engineering and deep maritime knowledge, we construct vessels designed to perform in the world's most demanding conditions. Whether cargo, offshore, or passenger — every ship we deliver is a testament to craftsmanship and technical excellence.";
  const servicesDescription = settings?.services_description ?? "";
  const galleryDescription = settings?.gallery_description ?? "";
  const contactsDescription = settings?.contacts_description ?? "";
  const galleryImages = toGalleryViews((galleryRows ?? []) as GalleryImageRow[]);

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      {/* Fixed blurred background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 scale-105 bg-[url('/images/ship-background.jpg')] bg-cover bg-center bg-no-repeat blur-md"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-black/45"
      />

      {/* Fixed white header */}
      <SiteHeader companyName={companyName} />

      <main className="relative z-10 mx-auto flex w-full flex-1 flex-col px-6 pt-24 pb-16 sm:max-w-6xl">
        <header className="flex flex-col items-center gap-3">
          <h1 className="text-4xl font-semibold tracking-tight text-white drop-shadow-md sm:text-5xl">
            {companyName}
          </h1>

          {mainDescription && (
            <div className="mt-8 text-center text-white/80 text-base leading-relaxed max-w-2xl mx-auto">
              <p>{mainDescription}</p>
            </div>
          )}
        </header>

        <section id="section-services" className="mt-12 grid grid-cols-1 items-stretch gap-8 rounded-xl transition-colors duration-300">
          <div className="rounded-xl border border-white/20 bg-white/10 p-12 shadow-lg backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white">Services</h2>
            {servicesDescription && (
              <p className="mt-2 text-sm text-white/80">{servicesDescription}</p>
            )}
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
        </section>

        <div id="section-gallery" className="mt-8 flex flex-col justify-center rounded-xl transition-colors duration-300">
          {galleryDescription && (
            <p className="text-center text-sm text-white/80 mb-4">{galleryDescription}</p>
          )}
          <GalleryCarousel images={galleryImages} />
        </div>

        <section id="section-contacts" className="mt-8 rounded-xl border border-white/20 bg-white/10 p-12 shadow-lg backdrop-blur-sm transition-colors duration-300">
          <h2 className="text-xl font-semibold text-white">Contact</h2>
          {contactsDescription && (
            <p className="mt-2 text-sm text-white/80">{contactsDescription}</p>
          )}
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
        </section>
      </main>
    </div>
  );
}
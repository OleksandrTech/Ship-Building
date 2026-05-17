import { redirect } from "next/navigation";
import { toGalleryViews, type GalleryImageRow } from "@/lib/gallery";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/admin");

  const [{ data: settings }, { data: services }, { data: galleryRows }] =
    await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("services").select("*").order("sort_order", { ascending: true }),
      supabase
        .from("gallery_images")
        .select("id,storage_path,sort_order")
        .order("sort_order", { ascending: true }),
    ]);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-12">
      <AdminDashboard
        userEmail={user.email ?? ""}
        initialSettings={settings ?? null}
        initialServices={services ?? []}
        initialGallery={toGalleryViews((galleryRows ?? []) as GalleryImageRow[])}
      />
    </div>
  );
}


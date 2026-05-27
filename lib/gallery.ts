import { SUPABASE_URL } from "@/lib/supabase/env";

export type GalleryImageRow = {
  id: string;
  storage_path: string;
  sort_order: number;
  description?: string;
};

export type GalleryImageView = GalleryImageRow & {
  url: string;
};

export function getGalleryPublicUrl(storagePath: string): string {
  if (!SUPABASE_URL) return "";
  const encoded = storagePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${SUPABASE_URL}/storage/v1/object/public/gallery/${encoded}`;
}

export function toGalleryViews(rows: GalleryImageRow[]): GalleryImageView[] {
  return rows.map((row) => ({
    ...row,
    url: getGalleryPublicUrl(row.storage_path),
  }));
}

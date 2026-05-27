"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { GalleryImageView } from "@/lib/gallery";

const SWIPE_THRESHOLD_PX = 48;

export default function GalleryCarousel({ images, description }: { images: GalleryImageView[]; description?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const count = images.length;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActiveIndex(((index % count) + count) % count);
    },
    [count]
  );

  const currentIndex = count === 0 ? 0 : activeIndex % count;

  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);
  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || count <= 1) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;
    if (delta > SWIPE_THRESHOLD_PX) goPrev();
    else if (delta < -SWIPE_THRESHOLD_PX) goNext();
  }

  if (count === 0) {
    return (
      <div className="flex min-h-[220px] md:min-h-[400px] items-center justify-center rounded-xl bg-white px-6 py-10 text-sm text-zinc-500">
        Фотографии пока не добавлены
      </div>
    );
  }

  const prevIndex = (currentIndex - 1 + count) % count;
  const nextIndex = (currentIndex + 1) % count;

  const slots =
    count === 1
      ? [{ image: images[0], role: "center" as const }]
      : [
          { image: images[prevIndex], role: "side" as const },
          { image: images[currentIndex], role: "center" as const },
          { image: images[nextIndex], role: "side" as const },
        ];

return (
  <div
    className="relative rounded-xl border border-white/20 bg-white/10 px-8 pt-12 pb-8 backdrop-blur-sm shadow-lg overflow-hidden"
    onTouchStart={onTouchStart}
    onTouchEnd={onTouchEnd}
  >
    <h2 className="text-xl font-semibold text-white mt-0 mb-4">Gallery</h2>
    {description && (
      <p className="text-sm text-white/80 mb-10">{description}</p>
    )}

    <div className="relative w-full overflow-hidden">
      {/* центральный слайд задаёт высоту блока */}
      {slots.filter(s => s.role === "center").map(({ image }) => (
        <div key={image.id} className="carousel-aspect relative w-full aspect-[16/9] md:aspect-[16/10]" />
      ))}
      <style>{`
        @media (max-width: 767px) {
          .carousel-aspect {
            aspect-ratio: 16/12 !important;
          }
        }
      `}</style>

      <div className="absolute inset-0 flex items-center justify-center">
        {slots.map(({ image, role }) => (
          <button
            key={`${image.id}-${role}`}
            type="button"
            onClick={() => {
              if (role === "side") {
                const idx = images.findIndex((img) => img.id === image.id);
                if (idx >= 0) goTo(idx);
              }
            }}
            className={[
              "absolute shrink-0 overflow-hidden rounded-xl transition-all duration-500 ease-out",
              role === "center"
                ? "inset-0 z-10 shadow-xl"
                : "inset-0 opacity-60 cursor-pointer hover:opacity-80",
              role === "side" && image.id === images[prevIndex]?.id
                ? "-translate-x-[82%] scale-90"
                : "",
              role === "side" && image.id === images[nextIndex]?.id
                ? "translate-x-[82%] scale-90"
                : "",
            ].join(" ")}
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <Image
                src={image.url}
                alt=""
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 896px"
                unoptimized
              />
            </div>
            {role === "center" && image.description && (
              <div className="absolute bottom-2 left-2 right-2 bg-black/80 text-white text-xs p-2 text-center backdrop-blur-sm rounded-lg md:bottom-4 md:left-4 md:right-4 md:text-sm md:p-3 md:rounded-xl">
                {image.description}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>

    {count > 1 ? (
      <>
        <button
          type="button"
          onClick={goPrev}
          aria-label="past photo"
          className="absolute left-4 top-1/2 z-20 h-12 w-12 -translate-y-1/2 flex items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-2xl text-zinc-700 shadow-lg transition hover:bg-white"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="next photo"
          className="absolute right-4 top-1/2 z-20 h-12 w-12 -translate-y-1/2 flex items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-2xl text-zinc-700 shadow-lg transition hover:bg-white"
        >
          ›
        </button>
      </>
    ) : null}
  </div>
  );
}

"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { GalleryImageView } from "@/lib/gallery";

const SWIPE_THRESHOLD_PX = 48;

export default function GalleryCarousel({ images }: { images: GalleryImageView[] }) {
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
      <div className="flex min-h-[220px] items-center justify-center rounded-xl bg-white px-6 py-10 text-sm text-zinc-500">
        Фотографии пока не добавлены
      </div>
    );
  }

  const prevIndex = (currentIndex - 1 + count) % count;
  const nextIndex = (currentIndex + 1) % count;

  const slots =
    count === 1
      ? [{ image: images[0], role: "center" as const }]
      : count === 2
        ? [
            { image: images[prevIndex], role: "side" as const },
            { image: images[currentIndex], role: "center" as const },
            { image: images[nextIndex], role: "side" as const },
          ]
        : [
            { image: images[prevIndex], role: "side" as const },
            { image: images[currentIndex], role: "center" as const },
            { image: images[nextIndex], role: "side" as const },
          ];

  return (
    <div
      className="relative rounded-xl bg-white shadow-lg overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative h-80 sm:h-96 md:h-[28rem] w-full overflow-hidden">
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
                "relative shrink-0 overflow-hidden transition-all duration-500 ease-out",
                role === "center"
                  ? "h-64 w-80 sm:h-72 sm:w-96 md:h-80 md:w-[28rem] z-10 shadow-xl scale-100"
                  : "h-64 w-80 sm:h-72 sm:w-96 md:h-80 md:w-[28rem] opacity-60 scale-90 cursor-pointer hover:opacity-80",
                role === "side" && image.id === images[prevIndex]?.id ? "-translate-x-1/2" : "",
                role === "side" && image.id === images[nextIndex]?.id ? "translate-x-1/2" : "",
              ].join(" ")}
            >
              <Image
                src={image.url}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 320px, 384px"
                unoptimized
              />
            </button>
          ))}
        </div>
      </div>

      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Предыдущее фото"
            className="absolute left-4 top-1/2 z-20 h-12 w-12 -translate-y-1/2 flex items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-2xl text-zinc-700 shadow-lg transition hover:bg-white md:flex"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Следующее фото"
            className="absolute right-4 top-1/2 z-20 h-12 w-12 -translate-y-1/2 flex items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-2xl text-zinc-700 shadow-lg transition hover:bg-white md:flex"
          >
            ›
          </button>
        </>
      ) : null}
    </div>
  );
}

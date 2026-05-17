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
            { image: images[currentIndex], role: "center" as const },
            {
              image: images[currentIndex === 0 ? 1 : 0],
              role: "side" as const,
            },
          ]
        : [
            { image: images[prevIndex], role: "side" as const },
            { image: images[currentIndex], role: "center" as const },
            { image: images[nextIndex], role: "side" as const },
          ];

  return (
    <div
      className="relative rounded-xl bg-white px-4 py-8 shadow-lg sm:px-8"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Предыдущее фото"
            className="absolute left-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-xl text-zinc-700 shadow-md transition hover:bg-zinc-50 md:flex"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Следующее фото"
            className="absolute right-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-xl text-zinc-700 shadow-md transition hover:bg-zinc-50 md:flex"
          >
            ›
          </button>
        </>
      ) : null}

      <div className="flex items-end justify-center gap-3 sm:gap-5 md:gap-6">
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
              "relative shrink-0 overflow-hidden rounded-lg bg-zinc-100 transition-all duration-300",
              role === "center"
                ? "h-52 w-44 sm:h-64 sm:w-56 md:h-72 md:w-64 z-10 shadow-md"
                : "h-36 w-28 sm:h-44 sm:w-36 md:h-52 md:w-44 opacity-80 scale-95 cursor-pointer hover:opacity-100",
            ].join(" ")}
          >
            <Image
              src={image.url}
              alt=""
              fill
              className="object-cover"
              sizes={role === "center" ? "(max-width: 768px) 224px, 256px" : "(max-width: 768px) 144px, 176px"}
              unoptimized
            />
          </button>
        ))}
      </div>

      {count > 1 ? (
        <p className="mt-4 text-center text-xs text-zinc-500 md:hidden">
          Свайпните влево или вправо
        </p>
      ) : null}
    </div>
  );
}

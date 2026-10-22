"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { NowItem } from "@/types";

interface NowTimelineProps {
  readonly items: readonly NowItem[];
}

interface ActivePhotoModal {
  readonly url: string;
  readonly title: string;
  readonly index: number;
  readonly total: number;
}

export function NowTimeline({ items }: NowTimelineProps) {
  const [activePhoto, setActivePhoto] = useState<ActivePhotoModal | null>(null);

  // Close modal on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActivePhoto(null);
      }
    },
    []
  );

  useEffect(() => {
    if (activePhoto) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activePhoto, handleKeyDown]);

  if (!items || items.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border-2 border-dashed border-dark-one/15 p-8 text-center">
        <p className="font-content text-sm text-muted">
          No current updates posted yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <>
      <ul className="mt-6 divide-y divide-dark-one/15">
        {items.map((item, index) => {
          const visualImages = [
            item.image,
            ...(Array.isArray(item.images) ? item.images : []),
          ].filter((u): u is string => Boolean(u && u.trim().length > 0));

          const isBook =
            item.link?.includes("amazon.") ||
            item.link?.includes("goodreads.") ||
            item.title.toLowerCase().includes("reading");
          const isVideo =
            item.link?.includes("youtube.") ||
            item.link?.includes("youtu.be") ||
            item.link?.includes("vimeo.");

          return (
            <li
              key={item.id ?? `${item.title}-${index}`}
              className="group grid grid-cols-1 gap-4 py-8 sm:grid-cols-[200px_1fr] sm:gap-8 transition-colors hover:bg-white/40 px-3 sm:px-4 rounded-2xl"
            >
              {/* Date & Status */}
              <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-2.5">
                <span className="font-content text-xs sm:text-sm font-medium text-muted">
                  {item.date}
                </span>
                <span className="font-content w-fit rounded-lg border border-accent bg-accent/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-dark-one">
                  {item.status}
                </span>
              </div>

              {/* Content Column */}
              <div className="flex flex-col gap-3 min-w-0">
                <h2 className="font-header text-xl sm:text-2xl font-bold text-dark-one group-hover:text-accent-strong transition-colors">
                  {item.title}
                </h2>

                <p className="font-content text-sm sm:text-base leading-relaxed text-muted whitespace-pre-line">
                  {item.description}
                </p>

                {/* Visual Gallery / Photos */}
                {visualImages.length > 0 && (
                  <div className="mt-2">
                    {visualImages.length === 1 ? (
                      /* Single Cover / Photo display */
                      <div className="relative inline-block max-w-sm sm:max-w-md w-full">
                        <button
                          type="button"
                          onClick={() =>
                            setActivePhoto({
                              url: visualImages[0],
                              title: item.title,
                              index: 1,
                              total: 1,
                            })
                          }
                          className="group/photo relative block aspect-16/10 sm:aspect-16/9 w-full overflow-hidden rounded-2xl border-2 border-dark-one/15 bg-neutral-100 shadow-xs focus:outline-none focus:ring-2 focus:ring-accent cursor-zoom-in text-left"
                          aria-label={`View photo for ${item.title} full size`}
                        >
                          <Image
                            src={visualImages[0]}
                            alt={`${item.title} preview`}
                            fill
                            sizes="(max-width: 640px) 100vw, 420px"
                            className="object-cover transition-transform duration-300 group-hover/photo:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 transition-colors group-hover/photo:bg-black/15 flex items-end justify-end p-2.5">
                            <span className="opacity-0 group-hover/photo:opacity-100 transition-opacity font-content text-[11px] font-semibold bg-dark-one/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-md shadow-xs">
                              Click to view ↗
                            </span>
                          </div>
                        </button>
                      </div>
                    ) : (
                      /* Multi-Photo Grid (e.g. seminar/conference albums) */
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-content text-[11px] font-bold uppercase tracking-wider text-muted">
                            Event Photos ({visualImages.length})
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-xl">
                          {visualImages.map((imgUrl, imgIdx) => (
                            <button
                              key={`${imgUrl}-${imgIdx}`}
                              type="button"
                              onClick={() =>
                                setActivePhoto({
                                  url: imgUrl,
                                  title: item.title,
                                  index: imgIdx + 1,
                                  total: visualImages.length,
                                })
                              }
                              className="group/photo relative aspect-4/3 w-full overflow-hidden rounded-xl border border-dark-one/15 bg-neutral-100 shadow-2xs focus:outline-none focus:ring-2 focus:ring-accent cursor-zoom-in text-left"
                              aria-label={`View photo ${imgIdx + 1} of ${visualImages.length} for ${item.title}`}
                            >
                              <Image
                                src={imgUrl}
                                alt={`${item.title} photo ${imgIdx + 1}`}
                                fill
                                sizes="(max-width: 640px) 50vw, 200px"
                                className="object-cover transition-transform duration-300 group-hover/photo:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/0 transition-colors group-hover/photo:bg-black/20 flex items-center justify-center">
                                <span className="opacity-0 group-hover/photo:opacity-100 transition-opacity font-content text-[11px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded">
                                  Zoom
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Resource Link Button */}
                {item.link && (
                  <div className="pt-2">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border-2 border-accent-strong bg-accent-strong/5 px-4 py-2 font-content text-xs sm:text-sm font-bold text-accent-strong transition-all duration-200 hover:border-accent hover:bg-accent hover:text-dark-one hover:shadow-2xs group/link"
                      aria-label={`${item.linkText || "Explore Resource"} (opens in a new window)`}
                    >
                      {isBook && <span aria-hidden="true">📖</span>}
                      {isVideo && <span aria-hidden="true">🎬</span>}
                      <span>{item.linkText || "Explore Resource"}</span>
                      <svg
                        aria-hidden="true"
                        className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Photo preview for ${activePhoto.title}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-6"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div className="w-full flex items-center justify-between pb-3 text-white">
              <div className="flex items-center gap-2">
                <span className="font-header text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md">
                  {activePhoto.title}
                </span>
                {activePhoto.total > 1 && (
                  <span className="font-content text-xs text-neutral-300">
                    ({activePhoto.index} of {activePhoto.total})
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                className="rounded-full bg-white/10 hover:bg-white/25 p-2 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Close photo preview"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Photo Container */}
            <div className="relative aspect-4/3 sm:aspect-16/10 w-full max-h-[80vh] overflow-hidden rounded-2xl border border-white/20 bg-neutral-900 shadow-2xl">
              <Image
                src={activePhoto.url}
                alt={activePhoto.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

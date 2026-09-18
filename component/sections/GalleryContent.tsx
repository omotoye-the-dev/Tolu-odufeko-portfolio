"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import type { GalleryItem } from "@/types";
import { GalleryLightbox } from "@/component/UI/GalleryLightbox";

interface GalleryContentProps {
  readonly items: readonly GalleryItem[];
}

export function GalleryContent({ items }: GalleryContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Extract unique categories in alphabetical order
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const item of items) {
      if (item.category && item.category.trim().length > 0) {
        set.add(item.category.trim());
      }
    }
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [items]);

  // Filter items based on active category
  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") {
      return items;
    }
    return items.filter(
      (item) => item.category?.trim().toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [items, selectedCategory]);

  return (
    <div className="w-full">
      {/* Category Filter Pills */}
      {categories.length > 2 && (
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setSelectedCategory(category);
                  setLightboxIndex(null);
                }}
                className={clsx(
                  "rounded-full px-5 py-2 font-content text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent",
                  isSelected
                    ? "bg-dark-one text-white shadow-md shadow-dark-one/15 scale-105"
                    : "bg-faint text-muted hover:bg-dark-one/10 hover:text-dark-one border border-dark-one/5"
                )}
              >
                {category}
                {category === "All" && (
                  <span className="ml-1.5 opacity-70">({items.length})</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid of Photos */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-dark-one/20 bg-faint/50 p-12 text-center sm:p-16">
          <span className="text-4xl" aria-hidden="true">
            📷
          </span>
          <h2 className="mt-4 font-header text-lg font-bold text-dark-one">
            No photos found
          </h2>
          <p className="mt-1.5 max-w-sm font-content text-sm text-muted">
            {selectedCategory === "All"
              ? "The gallery showcase is being curated. Check back soon for updates."
              : `No photos currently found under "${selectedCategory}". Try selecting another category.`}
          </p>
          {selectedCategory !== "All" && (
            <button
              type="button"
              onClick={() => setSelectedCategory("All")}
              className="mt-5 rounded-xl bg-dark-one px-5 py-2 font-content text-xs font-semibold text-white transition-colors hover:bg-accent hover:text-dark-one"
            >
              Show all photos
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
          {filteredItems.map((item, index) => {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightboxIndex(index)}
                aria-label={`View photo: ${item.title}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-dark-one/10 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-dark-one/25 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {/* Photo container */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-faint">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* Gradient Overlay for hover contrast */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Expand icon on hover */}
                  <div className="absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                      />
                    </svg>
                  </div>

                  {/* Category Pill */}
                  {item.category && (
                    <div className="absolute left-3.5 top-3.5">
                      <span className="rounded-full bg-white/90 px-3 py-1 font-content text-xs font-semibold text-dark-one shadow-sm backdrop-blur-sm">
                        {item.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Caption Footer */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h2 className="font-header text-base font-bold text-dark-one group-hover:text-accent transition-colors duration-200 line-clamp-1">
                      {item.title}
                    </h2>
                    {item.caption && (
                      <p className="mt-1 font-content text-xs text-muted line-clamp-2">
                        {item.caption}
                      </p>
                    )}
                  </div>

                  {item.eventDate && (
                    <p className="mt-3 font-content text-[11px] font-medium text-muted/70">
                      {new Date(item.eventDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      <GalleryLightbox
        items={filteredItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIndex) => setLightboxIndex(newIndex)}
      />
    </div>
  );
}

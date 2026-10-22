"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { clsx } from "clsx";
import type { GalleryItem } from "@/types";

interface GalleryLightboxProps {
  readonly items: readonly GalleryItem[];
  readonly currentIndex: number | null;
  readonly onClose: () => void;
  readonly onNavigate: (newIndex: number) => void;
}

export function GalleryLightbox({
  items,
  currentIndex,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < items.length;
  const currentItem = isOpen && currentIndex !== null ? items[currentIndex] : null;

  const [photoIndex, setPhotoIndex] = useState<number>(0);

  // Reset photo index whenever a different gallery item is opened
  useEffect(() => {
    setPhotoIndex(0);
  }, [currentIndex]);

  // Consolidate primary image + any additional album images
  const albumPhotos = useMemo(() => {
    if (!currentItem) return [];
    const extra = Array.isArray(currentItem.images) ? currentItem.images : [];
    return [currentItem.imageUrl, ...extra];
  }, [currentItem]);

  const hasMultiplePhotosInAlbum = albumPhotos.length > 1;
  const currentPhotoUrl = albumPhotos[photoIndex] ?? currentItem?.imageUrl;

  const handlePreviousPhoto = useCallback(() => {
    if (photoIndex > 0) {
      setPhotoIndex((prev) => prev - 1);
    } else if (currentIndex !== null && items.length > 1) {
      // Move to previous gallery item
      const prevIndex = (currentIndex - 1 + items.length) % items.length;
      onNavigate(prevIndex);
    }
  }, [photoIndex, currentIndex, items.length, onNavigate]);

  const handleNextPhoto = useCallback(() => {
    if (photoIndex < albumPhotos.length - 1) {
      setPhotoIndex((prev) => prev + 1);
    } else if (currentIndex !== null && items.length > 1) {
      // Move to next gallery item
      const nextIndex = (currentIndex + 1) % items.length;
      onNavigate(nextIndex);
    }
  }, [photoIndex, albumPhotos.length, currentIndex, items.length, onNavigate]);

  // Handle keyboard events (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePreviousPhoto();
      } else if (e.key === "ArrowRight") {
        handleNextPhoto();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, handlePreviousPhoto, handleNextPhoto]);

  // Lock body scroll when lightbox is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !currentItem || !currentPhotoUrl) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={currentItem.title}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 backdrop-blur-md p-3 sm:p-6 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Navigation Bar */}
      <div
        className="w-full max-w-6xl flex items-center justify-between text-white py-2 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {currentItem.category && (
            <span className="rounded-full bg-accent/20 border border-accent/40 px-3 py-1 font-content text-xs font-semibold text-accent">
              {currentItem.category}
            </span>
          )}

          {hasMultiplePhotosInAlbum ? (
            <span className="rounded-full bg-white/10 px-2.5 py-1 font-content text-xs text-white/90">
              Photo {photoIndex + 1} of {albumPhotos.length}
            </span>
          ) : null}

          <span className="font-content text-xs text-white/50">
            Album {currentIndex + 1} / {items.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close photo preview"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
        >
          <svg
            aria-hidden="true"
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

      {/* Center Image Stage */}
      <div
        className="relative flex flex-1 w-full max-w-6xl items-center justify-center my-auto min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Button */}
        {(items.length > 1 || hasMultiplePhotosInAlbum) && (
          <button
            type="button"
            onClick={handlePreviousPhoto}
            aria-label="Previous photo"
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/60 text-white/90 transition-all hover:bg-black/90 hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer shadow-lg"
          >
            <svg
              aria-hidden="true"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Center Main Photo */}
        <div className="relative h-full w-full max-h-[65vh] sm:max-h-[70vh] flex items-center justify-center">
          <Image
            key={currentPhotoUrl}
            src={currentPhotoUrl}
            alt={`${currentItem.title} - photo ${photoIndex + 1}`}
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-contain transition-opacity duration-300"
            priority
          />
        </div>

        {/* Next Button */}
        {(items.length > 1 || hasMultiplePhotosInAlbum) && (
          <button
            type="button"
            onClick={handleNextPhoto}
            aria-label="Next photo"
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/60 text-white/90 transition-all hover:bg-black/90 hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer shadow-lg"
          >
            <svg
              aria-hidden="true"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Album Thumbnails Strip (Only rendered if album has multiple photos) */}
      {hasMultiplePhotosInAlbum && (
        <div
          className="w-full max-w-3xl flex items-center justify-center gap-2 overflow-x-auto py-2 px-4 z-10 scrollbar-none"
          onClick={(e) => e.stopPropagation()}
        >
          {albumPhotos.map((url, idx) => {
            const isSelected = idx === photoIndex;
            return (
              <button
                key={`${url}-${idx}`}
                type="button"
                onClick={() => setPhotoIndex(idx)}
                aria-label={`Jump to photo ${idx + 1}`}
                className={clsx(
                  "relative h-12 w-16 sm:h-14 sm:w-20 shrink-0 overflow-hidden rounded-lg transition-all cursor-pointer",
                  isSelected
                    ? "ring-2 ring-accent scale-105 opacity-100 shadow-md"
                    : "opacity-50 hover:opacity-100 hover:scale-102"
                )}
              >
                <Image
                  src={url}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Bottom Details & Caption Bar */}
      <div
        className="w-full max-w-3xl flex flex-col items-center text-center text-white pt-2 pb-1 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-header text-lg sm:text-xl font-bold text-white tracking-wide">
          {currentItem.title}
        </h3>

        {currentItem.caption && (
          <p className="mt-1 font-content text-xs sm:text-sm text-white/80 max-w-xl line-clamp-2">
            {currentItem.caption}
          </p>
        )}

        {currentItem.eventDate && (
          <p className="mt-1 font-content text-[11px] font-medium text-white/50">
            {new Date(currentItem.eventDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>
    </div>
  );
}

export default GalleryLightbox;

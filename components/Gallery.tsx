"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Wrench } from "lucide-react";
import { getGalleryImages, type GalleryCategory, type GalleryImage } from "@/lib/gallery";

type GalleryProps = {
  category: GalleryCategory;
};

const PLACEHOLDER_COUNT = 6;

export default function Gallery({ category }: GalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getGalleryImages(category).then((result) => {
      if (!cancelled) {
        setImages(result);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [category]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse border border-border bg-surface"
          />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    // Graceful fallback: no Firebase config yet, or the folder is empty.
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
          <div
            key={i}
            className="flex aspect-square flex-col items-center justify-center gap-3 border border-dashed border-border bg-gradient-to-br from-surface to-background text-accent-dark transition-colors hover:border-accent hover:text-accent"
          >
            <Wrench size={28} strokeWidth={1.5} />
            <span className="px-4 text-center text-xs uppercase tracking-widest">
              Photo coming soon
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((image) => (
        <figure
          key={image.path}
          className="group relative aspect-square overflow-hidden border border-border bg-surface"
        >
          <Image
            src={image.url}
            alt={image.caption ?? `${category} plumbing project`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Extremely defensive: hide broken images if a download URL
              // ever goes stale, rather than showing a broken-image icon.
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {image.caption && (
            <figcaption className="absolute inset-x-0 bottom-0 bg-background/80 px-3 py-2 text-xs text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {image.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}

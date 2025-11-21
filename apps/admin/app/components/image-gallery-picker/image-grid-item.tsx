"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

interface ImageGridItemProps {
  url: string;
  alt: string;
  size: number;
  isSelected: boolean;
  onSelect: (url: string) => void;
}

/**
 * Komponen untuk menampilkan individual image card di gallery
 * Menampilkan preview image, selected state, dan info saat hover
 */
export function ImageGridItem({
  url,
  alt,
  size,
  isSelected,
  onSelect,
}: ImageGridItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(url)}
      className={cn(
        "relative aspect-square rounded-lg border-2 overflow-hidden transition-all hover:scale-105 hover:shadow-md group",
        isSelected
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-primary/50",
      )}
    >
      <Image
        src={url}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, 33vw"
        unoptimized
      />

      {isSelected && (
        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
          <div className="bg-primary rounded-full p-1">
            <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-xs text-white truncate">{alt}</p>
        <p className="text-xs text-white/70">{(size / 1024).toFixed(1)} KB</p>
      </div>
    </button>
  );
}

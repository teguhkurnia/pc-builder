"use client";

import { Search, Loader2 } from "lucide-react";
import { Input } from "@repo/ui/components/ui/input";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { EmptyState } from "./empty-state";
import { ImageGridItem } from "./image-grid-item";

interface Asset {
  id: number;
  filename: string;
  originalFilename: string;
  mimetype: string;
  size: number;
  url: string;
  path: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

interface GalleryTabProps {
  assets: Asset[];
  isLoading: boolean;
  isError: boolean;
  error?: { message?: string } | null;
  searchQuery: string;
  selectedImageUrl?: string;
  totalImages?: number;
  onSearchChange: (query: string) => void;
  onSelectImage: (url: string) => void;
}

/**
 * Komponen Gallery Tab untuk menampilkan dan memilih image dari gallery
 * Includes search bar, image grid, dan empty/error states
 */
export function GalleryTab({
  assets,
  isLoading,
  isError,
  error,
  searchQuery,
  selectedImageUrl,
  totalImages,
  onSearchChange,
  onSelectImage,
}: GalleryTabProps) {
  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-280px)]">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search images by filename..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Image Grid */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <EmptyState
            icon={
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            }
            title="Loading images..."
          />
        ) : isError ? (
          <EmptyState
            title="Failed to load images"
            error={error?.message || "Unknown error"}
          />
        ) : assets.length === 0 ? (
          <EmptyState
            title={
              searchQuery
                ? "No images found matching your search"
                : "No images in gallery"
            }
            description="Upload images to get started"
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4">
            {assets.map((asset) => (
              <ImageGridItem
                key={asset.id}
                url={asset.url}
                alt={asset.originalFilename}
                size={asset.size}
                isSelected={selectedImageUrl === asset.url}
                onSelect={onSelectImage}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Gallery Footer */}
      <div className="text-sm text-muted-foreground">
        {totalImages
          ? `${totalImages} image${totalImages !== 1 ? "s" : ""} total`
          : ""}
      </div>
    </div>
  );
}

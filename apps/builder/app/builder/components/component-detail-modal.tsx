"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import {
  X,
  Heart,
  ExternalLink,
  Copy,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

interface Component {
  id: number;
  name: string;
  type: string;
  price: number;
  imageUrl?: string | null;
  specifications: Record<string, string | number | boolean>;
}

interface ComponentDetailModalProps {
  component: Component | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (componentId: number) => void;
  onRemove?: (componentId: number) => void;
  isSelected?: boolean;
}

export default function ComponentDetailModal({
  component,
  isOpen,
  onClose,
  onSelect,
  onRemove,
  isSelected = false,
}: ComponentDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!component) return null;

  // Mock multiple images (in real app, component would have multiple images)
  const images = component.imageUrl
    ? [component.imageUrl]
    : ["/placeholder-component.jpg"];

  const specs = component.specifications as Record<
    string,
    string | number | boolean
  >;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCopyLink = async () => {
    // Copy component link to clipboard
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/component/${component.id}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const componentTypeColors: Record<string, string> = {
    CPU: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    GPU: "bg-red-500/10 text-red-500 border-red-500/20",
    MOTHERBOARD: "bg-green-500/10 text-green-500 border-green-500/20",
    RAM: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    STORAGE: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    PSU: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    CASE: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    COOLING: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  className={`${componentTypeColors[component.type] || "bg-slate-500/10 text-slate-500"} border`}
                >
                  {component.type}
                </Badge>
              </div>
              <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                {component.name}
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Left Column - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800">
              {component.imageUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={images[currentImageIndex]}
                    alt={component.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Image Navigation */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePreviousImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>

                      {/* Image Counter */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <span>No Image</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery (if multiple images) */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`
                      aspect-square rounded-lg overflow-hidden border-2 transition-all
                      ${
                        index === currentImageIndex
                          ? "border-blue-500 ring-2 ring-blue-500/30"
                          : "border-slate-200 dark:border-slate-700 hover:border-blue-300"
                      }
                    `}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={`${component.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFavorited(!isFavorited)}
                className={isFavorited ? "text-red-500 border-red-500" : ""}
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${isFavorited ? "fill-current" : ""}`}
                />
                {isFavorited ? "Favorited" : "Favorite"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className={copied ? "border-green-500 text-green-500" : ""}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={`/component/${component.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in Tab
                </a>
              </Button>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="flex flex-col">
            {/* Price */}
            <div className="mb-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                Price
              </p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {formatPrice(component.price)}
              </p>
            </div>

            {/* Specifications */}
            <div className="flex-1 mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Specifications
              </h3>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {Object.entries(specs).length > 0 ? (
                    Object.entries(specs).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"
                      >
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span className="text-sm text-slate-900 dark:text-white text-right">
                          {String(value)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No specifications available
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              {isSelected ? (
                <>
                  <Button
                    onClick={() => onRemove?.(component.id)}
                    variant="destructive"
                    className="w-full"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove from Build
                  </Button>
                  <Badge className="w-full justify-center py-2 bg-green-500">
                    Currently Selected
                  </Badge>
                </>
              ) : (
                <Button
                  onClick={() => {
                    onSelect?.(component.id);
                    onClose();
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Select this Component
                </Button>
              )}

              <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                Component ID: #{component.id}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

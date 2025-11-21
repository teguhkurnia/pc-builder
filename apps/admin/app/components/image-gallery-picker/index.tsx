"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { api } from "../../utils/api";
import { Button } from "@repo/ui/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/ui/sheet";
import { Input } from "@repo/ui/components/ui/input";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import {
  ImageIcon,
  Search,
  Loader2,
  CheckCircle2,
  Upload,
  X,
  FileImage,
} from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

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

interface ImageGalleryPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (imageUrl: string) => void;
  selectedImage?: string;
}

export default function ImageGalleryPicker({
  open,
  onOpenChange,
  onSelect,
  selectedImage,
}: ImageGalleryPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>(
    selectedImage,
  );
  const [activeTab, setActiveTab] = useState<"gallery" | "upload">("gallery");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch images from API
  const { data, isLoading, error, refetch } = api.assets.list.useQuery(
    {
      type: "IMAGE",
      search: searchQuery || undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
      limit: 50,
      offset: 0,
    },
    {
      enabled: open, // Only fetch when sheet is open
    },
  );

  const handleSelectImage = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
  };

  const handleConfirm = () => {
    if (selectedImageUrl) {
      onSelect(selectedImageUrl);
      onOpenChange(false);
      // Reset state
      setActiveTab("gallery");
      setSelectedFiles([]);
    }
  };

  const handleCancel = () => {
    setSelectedImageUrl(selectedImage);
    setActiveTab("gallery");
    setSelectedFiles([]);
    onOpenChange(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/"),
      );
      setSelectedFiles((prev) => [...prev, ...imageFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("http://localhost:4000/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();

      if (result.success && result.files && result.files.length > 0) {
        // Refetch gallery images
        await refetch();

        // Auto-select first uploaded image
        const firstUploadedImage = result.files[0];
        if (firstUploadedImage) {
          setSelectedImageUrl(firstUploadedImage.url);
        }

        // Switch to gallery tab
        setActiveTab("gallery");
        setSelectedFiles([]);

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload images. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Select Image</SheetTitle>
          <SheetDescription>
            Choose an image from your gallery or upload a new one.
          </SheetDescription>
        </SheetHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "gallery" | "upload")}
          className="mt-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gallery">
              <ImageIcon className="h-4 w-4 mr-2" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </TabsTrigger>
          </TabsList>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="mt-4">
            <div className="flex flex-col gap-4 h-[calc(100vh-280px)]">
              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search images by filename..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Image Grid */}
              <ScrollArea className="flex-1">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-2">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      Failed to load images
                    </p>
                    <p className="text-xs text-destructive">
                      {error.message || "Unknown error"}
                    </p>
                  </div>
                ) : !data?.assets || data.assets.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-2">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      {searchQuery
                        ? "No images found matching your search"
                        : "No images in gallery"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Upload images to get started
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-4">
                    {data.assets.map((asset: Asset) => (
                      <button
                        key={asset.id}
                        type="button"
                        onClick={() => handleSelectImage(asset.url)}
                        className={cn(
                          "relative aspect-square rounded-lg border-2 overflow-hidden transition-all hover:scale-105 hover:shadow-md group",
                          selectedImageUrl === asset.url
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border hover:border-primary/50",
                        )}
                      >
                        <Image
                          src={asset.url}
                          alt={asset.originalFilename}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 33vw"
                          unoptimized
                        />
                        {selectedImageUrl === asset.url && (
                          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                            <div className="bg-primary rounded-full p-1">
                              <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-xs text-white truncate">
                            {asset.originalFilename}
                          </p>
                          <p className="text-xs text-white/70">
                            {(asset.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Gallery Footer */}
              <div className="text-sm text-muted-foreground">
                {data?.pagination.total
                  ? `${data.pagination.total} image${data.pagination.total !== 1 ? "s" : ""} total`
                  : ""}
              </div>
            </div>
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload" className="mt-4">
            <div className="flex flex-col gap-4 h-[calc(100vh-280px)]">
              {/* Upload Area */}
              <div className="flex-1 flex flex-col gap-4">
                {/* File Input */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                    selectedFiles.length > 0
                      ? "border-primary/50 bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-accent/50",
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">
                    Click to upload images
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>

                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                  <ScrollArea className="flex-1">
                    <div className="space-y-2">
                      <p className="text-sm font-medium mb-2">
                        Selected Files ({selectedFiles.length})
                      </p>
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                        >
                          <FileImage className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(index)}
                            disabled={isUploading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}

                {/* Upload Button */}
                {selectedFiles.length > 0 && (
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload {selectedFiles.length} image
                        {selectedFiles.length !== 1 ? "s" : ""}
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t mt-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedImageUrl}
          >
            Select Image
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

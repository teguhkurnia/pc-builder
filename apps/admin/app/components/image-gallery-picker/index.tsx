"use client";

import { useState, useRef } from "react";
import { useDebounce } from "use-debounce";
import { useListAssets, useUploadImage } from "../../hooks/api/useAssets";
import { Button } from "@repo/ui/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { ImageIcon, Upload } from "lucide-react";
import { GalleryTab } from "./gallery-tab";
import { UploadTab } from "./upload-tab";
import { useFileDragDrop } from "../../hooks/useFileDragDrop";
import { filterImageFiles } from "../../utils/file";

interface ImageGalleryPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (imageUrl: string) => void;
  selectedImage?: string;
}

/**
 * Image Gallery Picker Component
 * Modal untuk memilih image dari gallery atau upload image baru
 * Mendukung drag & drop, search, dan preview
 */
export default function ImageGalleryPicker({
  open,
  onOpenChange,
  onSelect,
  selectedImage,
}: ImageGalleryPickerProps) {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>(
    selectedImage,
  );
  const [activeTab, setActiveTab] = useState<"gallery" | "upload">("gallery");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debounce search query untuk mengurangi request ke server
  // Tunggu 500ms setelah user berhenti mengetik
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  // Custom hooks
  const { assets, pagination, isLoading, isError, error } = useListAssets({
    type: "IMAGE",
    search: debouncedSearchQuery || undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
    limit: 50,
    offset: 0,
  });

  const { uploadImage } = useUploadImage();

  const { isDragging, dragHandlers } = useFileDragDrop((files) => {
    const imageFiles = filterImageFiles(files);
    setSelectedFiles((prev) => [...prev, ...imageFiles]);
  });

  // Event handlers
  const handleSelectImage = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
  };

  const handleConfirm = () => {
    if (selectedImageUrl) {
      onSelect(selectedImageUrl);
      handleClose();
    }
  };

  const handleCancel = () => {
    setSelectedImageUrl(selectedImage);
    handleClose();
  };

  const handleClose = () => {
    setActiveTab("gallery");
    setSelectedFiles([]);
    onOpenChange(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const imageFiles = filterImageFiles(files);
      setSelectedFiles((prev) => [...prev, ...imageFiles]);
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);

    try {
      const result = await uploadImage(selectedFiles);

      if (result.success && result.files && result.files.length > 0) {
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
      alert(
        error instanceof Error
          ? error.message
          : "Failed to upload images. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl px-6">
        <SheetHeader className="px-0">
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

          <TabsContent value="gallery" className="mt-4">
            <GalleryTab
              assets={assets}
              isLoading={isLoading}
              isError={isError}
              error={error}
              searchQuery={searchQuery}
              selectedImageUrl={selectedImageUrl}
              totalImages={pagination?.total}
              onSearchChange={setSearchQuery}
              onSelectImage={handleSelectImage}
            />
          </TabsContent>

          <TabsContent value="upload" className="mt-4">
            <UploadTab
              selectedFiles={selectedFiles}
              isUploading={isUploading}
              isDragging={isDragging}
              fileInputRef={fileInputRef}
              dragHandlers={dragHandlers}
              onFileSelect={handleFileSelect}
              onFileInputClick={handleFileInputClick}
              onRemoveFile={handleRemoveFile}
              onUpload={handleUpload}
            />
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

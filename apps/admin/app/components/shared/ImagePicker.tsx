"use client";

import * as React from "react";
import { useState } from "react";
import { Loader2, Upload, X, Image as ImageIcon, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import { useListAssets, useUploadImage, useDeleteAsset } from "../../hooks/useAssets";
import { toast } from "@repo/ui/components/ui/use-toast";

interface ImagePickerProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export function ImagePicker({
  value,
  onChange,
  label = "Image",
  className = "",
}: ImagePickerProps) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: assetsData, isLoading, refetch } = useListAssets({
    type: "IMAGE",
    search: searchQuery || undefined,
  });

  const { uploadImage } = useUploadImage();
  const deleteAsset = useDeleteAsset();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const result = await uploadImage(Array.from(files));

      if (result.success && result.files && result.files.length > 0) {
        // Select the first uploaded image
        onChange(result.files[0].url);
        toast({
          title: "Upload successful",
          description: `${result.files.length} image(s) uploaded`,
        });
        refetch();
      }
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleSelectImage = (url: string) => {
    onChange(url);
    setOpen(false);
    toast({
      title: "Image selected",
      description: "Image has been selected successfully",
    });
  };

  const handleDeleteImage = async (filename: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await deleteAsset.mutateAsync({ filename });
      toast({
        title: "Image deleted",
        description: "Image has been deleted successfully",
      });
      // If the deleted image was selected, clear selection
      if (value?.includes(filename)) {
        onChange("");
      }
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  const handleRemoveSelected = () => {
    onChange("");
    toast({
      title: "Image removed",
      description: "Selected image has been removed",
    });
  };

  return (
    <div className={className}>
      <Label className="mb-2 block">{label}</Label>

      {/* Preview Selected Image */}
      {value && (
        <div className="mb-3 relative inline-block">
          <img
            src={value}
            alt="Selected"
            className="h-32 w-32 object-cover rounded-lg border border-gray-300"
          />
          <button
            type="button"
            onClick={handleRemoveSelected}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Picker Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" className="w-full">
            <ImageIcon className="mr-2 h-4 w-4" />
            {value ? "Change Image" : "Select Image"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Select or Upload Image</DialogTitle>
            <DialogDescription>
              Choose an existing image or upload a new one
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="gallery" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>

            <TabsContent value="gallery" className="flex-1 overflow-auto mt-4">
              {/* Search */}
              <div className="mb-4">
                <Input
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Gallery Grid */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : assetsData?.assets && assetsData.assets.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {assetsData.assets.map((asset) => (
                    <div
                      key={asset.id}
                      className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all cursor-pointer"
                    >
                      <img
                        src={asset.url}
                        alt={asset.originalFilename}
                        className="w-full h-full object-cover"
                        onClick={() => handleSelectImage(asset.url)}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleSelectImage(asset.url)}
                          >
                            Select
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteImage(asset.filename);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                        <p className="text-white text-xs truncate">
                          {asset.originalFilename}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <ImageIcon className="h-12 w-12 mb-2" />
                  <p>No images found</p>
                  <p className="text-sm">Upload some images to get started</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="upload" className="flex-1 mt-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="hidden"
                  id="image-upload-input"
                />
                <Label
                  htmlFor="image-upload-input"
                  className="cursor-pointer flex flex-col items-center"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-12 w-12 text-gray-400 animate-spin mb-4" />
                      <p className="text-lg font-medium text-gray-700">
                        Uploading...
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Click to upload images
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, WebP, GIF up to 5MB
                      </p>
                    </>
                  )}
                </Label>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <p className="font-medium mb-2">Upload Guidelines:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Maximum file size: 5MB per image</li>
                  <li>Supported formats: JPG, PNG, WebP, GIF, SVG</li>
                  <li>You can upload multiple images at once</li>
                  <li>Images will be automatically added to the gallery</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

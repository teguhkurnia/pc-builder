"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { ImageIcon, X } from "lucide-react";
import ImageGalleryPicker from "./index";

/**
 * Example 1: Basic Usage with useState
 */
export function BasicExample() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Usage Example</CardTitle>
        <CardDescription>
          Simple image selection using useState
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Product Image</Label>
          {selectedImage ? (
            <div className="relative w-full aspect-video rounded-lg border overflow-hidden group mt-2">
              <Image
                src={selectedImage}
                alt="Selected product"
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setGalleryOpen(true)}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Change
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setSelectedImage(undefined)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full h-32 border-dashed mt-2"
              onClick={() => setGalleryOpen(true)}
            >
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Select from Gallery
                </span>
              </div>
            </Button>
          )}
        </div>

        {selectedImage && (
          <div className="text-sm text-muted-foreground">
            Selected: <code className="text-xs">{selectedImage}</code>
          </div>
        )}

        <ImageGalleryPicker
          open={galleryOpen}
          onOpenChange={setGalleryOpen}
          onSelect={(imageUrl) => setSelectedImage(imageUrl)}
          selectedImage={selectedImage}
        />
      </CardContent>
    </Card>
  );
}

/**
 * Example 2: React Hook Form Integration
 */
interface FormValues {
  title: string;
  description: string;
  imageUrl: string | null;
}

export function FormExample() {
  const [galleryOpen, setGalleryOpen] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      imageUrl: null,
    },
  });

  const imageUrl = watch("imageUrl");

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted:", data);
    alert(`Form submitted!\nTitle: ${data.title}\nImage: ${data.imageUrl}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>React Hook Form Example</CardTitle>
        <CardDescription>
          Integration with form validation and submission
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter title..."
              {...register("title", { required: true })}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter description..."
              {...register("description")}
            />
          </div>

          <div>
            <Label>Featured Image</Label>
            {imageUrl ? (
              <div className="relative w-full aspect-video rounded-lg border overflow-hidden group mt-2">
                <Image
                  src={imageUrl}
                  alt="Featured"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setGalleryOpen(true)}
                  >
                    Change
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => setValue("imageUrl", null)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full h-32 border-dashed mt-2"
                onClick={() => setGalleryOpen(true)}
              >
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Select Featured Image
                  </span>
                </div>
              </Button>
            )}
          </div>

          <Button type="submit" className="w-full">
            Submit Form
          </Button>
        </form>

        <ImageGalleryPicker
          open={galleryOpen}
          onOpenChange={setGalleryOpen}
          onSelect={(url) => setValue("imageUrl", url)}
          selectedImage={imageUrl || undefined}
        />
      </CardContent>
    </Card>
  );
}

/**
 * Example 3: Multiple Image Selection (Gallery)
 */
export function MultipleImagesExample() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const handleAddImage = (imageUrl: string) => {
    setImages((prev) => [...prev, imageUrl]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multiple Images Example</CardTitle>
        <CardDescription>
          Build an image gallery with multiple selections
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={() => setGalleryOpen(true)}>
          <ImageIcon className="h-4 w-4 mr-2" />
          Add Image
        </Button>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((imageUrl, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg border overflow-hidden group"
              >
                <Image
                  src={imageUrl}
                  alt={`Image ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No images added yet</p>
          </div>
        )}

        <ImageGalleryPicker
          open={galleryOpen}
          onOpenChange={setGalleryOpen}
          onSelect={handleAddImage}
        />
      </CardContent>
    </Card>
  );
}

/**
 * Example 4: Avatar/Profile Picture Selector
 */
export function AvatarExample() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avatar/Profile Picture Example</CardTitle>
        <CardDescription>
          Select profile picture with circular preview
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-6">
          <div className="relative">
            {avatarUrl ? (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-border group">
                <Image
                  src={avatarUrl}
                  alt="Avatar"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setGalleryOpen(true)}
                    className="text-xs"
                  >
                    Change
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center text-muted-foreground">
                <ImageIcon className="h-8 w-8" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <Button onClick={() => setGalleryOpen(true)}>
              {avatarUrl ? "Change Avatar" : "Select Avatar"}
            </Button>
            {avatarUrl && (
              <Button
                variant="outline"
                onClick={() => setAvatarUrl(undefined)}
              >
                Remove Avatar
              </Button>
            )}
          </div>
        </div>

        <ImageGalleryPicker
          open={galleryOpen}
          onOpenChange={setGalleryOpen}
          onSelect={(imageUrl) => setAvatarUrl(imageUrl)}
          selectedImage={avatarUrl}
        />
      </CardContent>
    </Card>
  );
}

/**
 * Example Page Component
 * Combine all examples in one page
 */
export default function ImageGalleryPickerExamples() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Image Gallery Picker Examples</h1>
        <p className="text-muted-foreground">
          Different use cases and integration patterns for the ImageGalleryPicker component
        </p>
      </div>

      <div className="grid gap-8">
        <BasicExample />
        <FormExample />
        <MultipleImagesExample />
        <AvatarExample />
      </div>

      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Quick Start</h2>
        <pre className="bg-background p-4 rounded-md overflow-x-auto text-sm">
          <code>{`import ImageGalleryPicker from "@/components/image-gallery-picker";

function MyComponent() {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<string>();

  return (
    <>
      <Button onClick={() => setOpen(true)}>Select Image</Button>

      <ImageGalleryPicker
        open={open}
        onOpenChange={setOpen}
        onSelect={setImage}
        selectedImage={image}
      />
    </>
  );
}`}</code>
        </pre>
      </div>
    </div>
  );
}

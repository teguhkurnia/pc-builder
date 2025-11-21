"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ListComponentsSchema, SpecsConfig } from "@repo/api/models";
import {
  createComponentSchema,
  CreateComponentSchema,
  getSpecFieldSchema,
} from "@repo/api/models";
import { Button } from "@repo/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/ui/dialog";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { Loader2, ImageIcon, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import ImageGalleryPicker from "../../image-gallery-picker";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateComponentSchema) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: ListComponentsSchema[number];
  mode?: "create" | "edit";
}

const componentTypes = Object.keys(SpecsConfig);

export default function ComponentModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  defaultValues,
  mode = "create",
}: Props) {
  const [selectedType, setSelectedType] = useState<string>(componentTypes[0]!);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>();

  const formSchema = useMemo(() => {
    const specsSchema = getSpecFieldSchema(selectedType);
    return createComponentSchema.and(
      z.object({
        specifications: specsSchema || z.record(z.string(), z.any()),
      }),
    );
  }, [selectedType]);

  type FormValues = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    getValues,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: selectedType as CreateComponentSchema["type"],
      price: 0,
      imageUrl: null,
      specifications: {},
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name,
        type: defaultValues.type,
        price: defaultValues.price,
        imageUrl: defaultValues.imageUrl,
        specifications: defaultValues.specifications,
      });
      setSelectedImage(defaultValues.imageUrl || undefined);
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    reset({
      name: getValues("name"),
      type: selectedType as CreateComponentSchema["type"],
      price: getValues("price"),
      imageUrl: getValues("imageUrl"),
      specifications: {},
    });
  }, [selectedType, setValue, reset, getValues]);

  const handleFormSubmit = async (data: FormValues) => {
    // Sync selectedImage to form data
    const submitData = {
      ...data,
      imageUrl: selectedImage || null,
    };
    console.log("Form Data:", submitData);
    await onSubmit(submitData);
  };

  const specificationFields = SpecsConfig[selectedType] || [];

  console.log(errors);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Component" : "Edit Component"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Fill in the details to add a new component to your inventory."
              : "Update the component details below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="grid gap-4 py-4 h-fit">
              {/* Name Field */}
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Intel Core i9-13900K"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Type Field */}
              <div className="grid gap-2">
                <Label htmlFor="type">
                  Type <span className="text-destructive">*</span>
                </Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedType(value);
                      }}
                    >
                      <SelectTrigger
                        className={errors.type ? "border-destructive" : ""}
                      >
                        <SelectValue placeholder="Select component type" />
                      </SelectTrigger>
                      <SelectContent>
                        {componentTypes.map((type: string) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && (
                  <p className="text-sm text-destructive">
                    {errors.type.message}
                  </p>
                )}
              </div>

              {/* Price Field */}
              <div className="grid gap-2">
                <Label htmlFor="price">
                  Price (USD) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("price", { valueAsNumber: true })}
                  className={errors.price ? "border-destructive" : ""}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>

              {/* Image Field */}
              <div className="grid gap-2">
                <Label htmlFor="image">Product Image</Label>
                <div className="flex gap-2">
                  {selectedImage ? (
                    <div className="relative w-full aspect-video rounded-lg border overflow-hidden group">
                      <Image
                        src={selectedImage}
                        alt="Selected product"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => setGalleryOpen(true)}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Change
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedImage(undefined);
                            setValue("imageUrl", null);
                          }}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-32 border-dashed"
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
              </div>
            </div>

            <ScrollArea className="max-h-96">
              <div className="grid px-2">
                {/* Specifications */}
                {selectedType && specificationFields && (
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <Label>
                        Specifications{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                    </div>
                    <div className="grid gap-3">
                      {specificationFields.map((field) => (
                        <div key={field.name} className="grid gap-2">
                          <Label
                            htmlFor={`spec-${field.name}`}
                            className="text-sm"
                          >
                            {field.label}
                          </Label>
                          {field.type === "select" && field.options ? (
                            <Controller
                              name={`specifications.${field.name}`}
                              control={control}
                              render={({ field: formField }) => (
                                <Select
                                  value={String(formField.value || "")}
                                  onValueChange={formField.onChange}
                                >
                                  <SelectTrigger id={`spec-${field.name}`}>
                                    <SelectValue
                                      placeholder={`Select ${field.label.toLowerCase()}`}
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options.map((option: string) => (
                                      <SelectItem key={option} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          ) : (
                            <Controller
                              name={`specifications.${field.name}`}
                              control={control}
                              render={({ field: formField }) => (
                                <Input
                                  id={`spec-${field.name}`}
                                  type={field.type || "text"}
                                  placeholder={field.placeholder}
                                  value={String(formField.value || "")}
                                  onChange={(e) => {
                                    const value =
                                      field.type === "number"
                                        ? parseFloat(e.target.value)
                                        : e.target.value;
                                    formField.onChange(value);
                                  }}
                                />
                              )}
                            />
                          )}

                          {errors.specifications?.[field.name] && (
                            <p className="text-sm text-destructive">
                              {String(
                                errors.specifications[field.name]?.message ||
                                  "",
                              )}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!selectedType && (
                  <div className="rounded-lg border border-dashed border-border p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Select a component type to see specification fields
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                  ? "Add Component"
                  : "Update Component"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      <ImageGalleryPicker
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        onSelect={(imageUrl) => {
          setSelectedImage(imageUrl);
          setValue("imageUrl", imageUrl);
        }}
        selectedImage={selectedImage}
      />
    </Dialog>
  );
}

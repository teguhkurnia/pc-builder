"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@repo/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { ImagePicker } from "../shared/ImagePicker";
import { useCreateComponent } from "../../hooks/useComponents";
import { toast } from "@repo/ui/components/ui/use-toast";
import { ComponentType } from "@repo/db";

// Form schema
const componentFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum([
    "CPU",
    "MOTHERBOARD",
    "RAM",
    "STORAGE",
    "GPU",
    "PSU",
    "CASE",
    "COOLING",
  ]),
  price: z.number().positive("Price must be positive"),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  specifications: z.record(z.string(), z.any()).default({}),
});

type ComponentFormData = z.infer<typeof componentFormSchema>;

interface ComponentFormExampleProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ComponentFormExample({
  onSuccess,
  onCancel,
}: ComponentFormExampleProps) {
  const createComponent = useCreateComponent();

  const form = useForm<ComponentFormData>({
    resolver: zodResolver(componentFormSchema),
    defaultValues: {
      name: "",
      type: "CPU",
      price: 0,
      imageUrl: "",
      specifications: {},
    },
  });

  const onSubmit = async (data: ComponentFormData) => {
    try {
      await createComponent.mutateAsync({
        name: data.name,
        type: data.type,
        price: data.price,
        imageUrl: data.imageUrl || null,
        specifications: data.specifications,
      });

      toast({
        title: "Component created",
        description: `${data.name} has been created successfully`,
      });

      form.reset();
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Failed to create component",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Intel Core i9-13900K" {...field} />
              </FormControl>
              <FormDescription>
                The product name of the component
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type Field */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select component type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CPU">CPU</SelectItem>
                  <SelectItem value="MOTHERBOARD">Motherboard</SelectItem>
                  <SelectItem value="RAM">RAM</SelectItem>
                  <SelectItem value="STORAGE">Storage</SelectItem>
                  <SelectItem value="GPU">GPU</SelectItem>
                  <SelectItem value="PSU">Power Supply</SelectItem>
                  <SelectItem value="CASE">Case</SelectItem>
                  <SelectItem value="COOLING">Cooling</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The category of this component
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price Field */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>Price in USD</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Picker Field */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <ImagePicker
                label="Product Image"
                value={field.value}
                onChange={field.onChange}
              />
              <FormDescription>
                Select or upload an image for this component
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={createComponent.isPending}>
            {createComponent.isPending ? "Creating..." : "Create Component"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

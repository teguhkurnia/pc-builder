"use client";

import { trpc } from "../lib/trpc";
import type { AssetType } from "@repo/db";

export interface UseListAssetsOptions {
  type?: AssetType;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: "createdAt" | "size" | "filename";
  sortOrder?: "asc" | "desc";
}

/**
 * Hook to list assets with filtering and pagination
 */
export function useListAssets(options: UseListAssetsOptions = {}) {
  return trpc.assets.list.useQuery(options, {
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook to get asset by ID
 */
export function useAssetById(id: number) {
  return trpc.assets.getById.useQuery(
    { id },
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
    }
  );
}

/**
 * Hook to get asset by filename
 */
export function useAssetByFilename(filename: string) {
  return trpc.assets.getByFilename.useQuery(
    { filename },
    {
      enabled: !!filename,
      refetchOnWindowFocus: false,
    }
  );
}

/**
 * Hook to delete asset
 */
export function useDeleteAsset() {
  const utils = trpc.useUtils();

  return trpc.assets.delete.useMutation({
    onSuccess: () => {
      // Invalidate and refetch asset list
      utils.assets.list.invalidate();
    },
  });
}

/**
 * Hook to upload image (uses Fastify endpoint, not tRPC)
 */
export function useUploadImage() {
  const utils = trpc.useUtils();

  const uploadImage = async (file: File | File[]) => {
    const formData = new FormData();

    if (Array.isArray(file)) {
      file.forEach((f) => formData.append("file", f));
    } else {
      formData.append("file", file);
    }

    const response = await fetch("http://localhost:4000/api/upload/image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Upload failed");
    }

    const result = await response.json();

    // Invalidate asset list to refetch with new uploads
    utils.assets.list.invalidate();

    return result;
  };

  return { uploadImage };
}

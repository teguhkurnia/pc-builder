"use client";

import { ListAssetsRequest } from "@repo/api/models";
import { api } from "../../utils/api";

/**
 * Hook to list assets with filtering and pagination
 */
export function useListAssets(options: ListAssetsRequest) {
  const query = api.assets.list.useQuery(options, {
    refetchOnWindowFocus: false,
    staleTime: 30000, // 30 seconds
  });

  return {
    assets: query.data?.assets ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}

/**
 * Hook to get asset by ID
 */
export function useAssetById(id: number) {
  const query = api.assets.getById.useQuery(
    { id },
    {
      enabled: !!id,
      refetchOnWindowFocus: false,
    },
  );

  return {
    asset: query.data,
  };
}

/**
 * Hook to get asset by filename
 */
export function useAssetByFilename(filename: string) {
  const query = api.assets.getByFilename.useQuery(
    { filename },
    {
      enabled: !!filename,
      refetchOnWindowFocus: false,
    },
  );

  return {
    asset: query.data,
  };
}

/**
 * Hook to delete asset
 */
export function useDeleteAsset() {
  const utils = api.useUtils();

  const mutation = api.assets.delete.useMutation({
    onSuccess: () => {
      // Invalidate and refetch asset list
      utils.assets.list.invalidate();
    },
  });

  return {
    deleteAsset: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}

/**
 * Hook to upload image (uses Fastify endpoint, not tRPC)
 */
export function useUploadImage() {
  const utils = api.useUtils();

  const uploadImage = async (files: File[]) => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

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
    await utils.assets.list.invalidate();

    return result;
  };

  return { uploadImage };
}

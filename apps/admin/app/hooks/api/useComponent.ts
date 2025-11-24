import { ListComponentsRequestSchema } from "@repo/api/models";
import { api } from "../../utils/api";

export const useListComponents = (params?: ListComponentsRequestSchema) => {
  const query = api.components.list.useInfiniteQuery(
    {
      search: params?.search,
      type: params?.type,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
      limit: params?.limit ?? 20,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 1000 * 60 * 5, // Cache 5 minutes
      refetchOnWindowFocus: false,
    },
  );

  // Flatten all pages into a single array
  const components = query.data?.pages.flatMap((page) => page.items) ?? [];

  return {
    components,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
};

// Create component
export const useCreateComponent = () => {
  const utils = api.useUtils();

  const mutation = api.components.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch components list
      utils.components.list.invalidate();
    },
  });

  return {
    createComponent: mutation.mutateAsync,
    isCreating: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

// Update component
export const useUpdateComponent = () => {
  const utils = api.useUtils();

  const mutation = api.components.update.useMutation({
    onSuccess: () => {
      // Invalidate and refetch components list
      utils.components.list.invalidate();
    },
  });

  return {
    updateComponent: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

// Delete component
export const useDeleteComponent = () => {
  const utils = api.useUtils();

  const mutation = api.components.delete.useMutation({
    onSuccess: () => {
      // Invalidate and refetch components list
      utils.components.list.invalidate();
    },
  });

  return {
    deleteComponent: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

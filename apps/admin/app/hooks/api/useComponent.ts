import { ListComponentsRequestSchema } from "@repo/api/models";
import { api } from "../../utils/api";

export const useListComponents = (params?: ListComponentsRequestSchema) => {
  const query = api.components.list.useQuery(params, {
    staleTime: 1000 * 60 * 5, // Cache 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    components: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
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

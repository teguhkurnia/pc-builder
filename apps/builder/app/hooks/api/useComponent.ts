import { ListComponentsRequestSchema } from "@repo/api/models";
import { api } from "../../utils/api";

export const useListComponents = (params?: ListComponentsRequestSchema) => {
  // Gunakan useInfiniteQuery untuk infinite scroll
  const query = api.components.list.useInfiniteQuery(
    {
      search: params?.search,
      type: params?.type,
      sortBy: params?.sortBy,
      sortOrder: params?.sortOrder,
      limit: params?.limit ?? 20,
      // Include dependency IDs in query key untuk auto-reset ketika dependencies berubah
      cpuId: params?.cpuId,
      motherboardId: params?.motherboardId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 1000 * 60 * 5, // Cache 5 menit
      refetchOnWindowFocus: false,
    },
  );

  // Flatten semua pages jadi satu array
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

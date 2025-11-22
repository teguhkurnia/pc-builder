import { api } from "../../utils/api";

export const useListBuilds = () => {
  const query = api.builds.list.useQuery(undefined, {
    staleTime: 1000 * 60 * 5, // Cache 5 menit
    refetchOnWindowFocus: false,
  });

  return {
    builds: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useGetBuild = (id: number | null) => {
  const query = api.builds.get.useQuery(
    { id: id! },
    {
      enabled: id !== null, // Only fetch when id is available
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  );

  return {
    build: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

export const useCreateBuild = () => {
  const utils = api.useContext();

  return api.builds.create.useMutation({
    onSuccess: () => {
      utils.builds.list.invalidate();
    },
  });
};

export const useUpdateBuild = () => {
  const utils = api.useContext();

  return api.builds.update.useMutation({
    onSuccess: (data) => {
      utils.builds.list.invalidate();
      utils.builds.get.invalidate({ id: data.id });
    },
  });
};

export const useDeleteBuild = () => {
  const utils = api.useContext();

  return api.builds.delete.useMutation({
    onSuccess: () => {
      utils.builds.list.invalidate();
    },
  });
};

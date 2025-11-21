import { api } from "../../utils/api";

export const useListComponents = () => {
  // Kita membungkus query tRPC di sini
  const query = api.components.list.useQuery(undefined, {
    // Anda bisa menaruh default config di sini agar UI component bersih
    staleTime: 1000 * 60 * 5, // Cache 5 menit
    refetchOnWindowFocus: false,
  });

  // Kita bisa memodifikasi return value-nya agar lebih enak dipakai UI
  return {
    components: query.data ?? [], // Default empty array biar gak perlu cek null di UI
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

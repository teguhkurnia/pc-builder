import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export interface ComponentParams {
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  debouncedSearch: string;
  filterType: string;
  setFilterType: (type: string) => void;
  sortBy: "name" | "price" | "date";
  setSortBy: (sortBy: "name" | "price" | "date") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

export function useComponentParams(): ComponentParams {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State initialization
  const [view, setView] = useState<"grid" | "list">(
    (searchParams.get("view") as "grid" | "list") || "grid",
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [filterType, setFilterType] = useState(
    searchParams.get("type") || "all",
  );
  const [sortBy, setSortBy] = useState<"name" | "price" | "date">(
    (searchParams.get("sortBy") as ComponentParams["sortBy"]) || "name",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.get("sortOrder") as ComponentParams["sortOrder"]) || "asc",
  );

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // URL Sync logic
  useEffect(() => {
    const params = new URLSearchParams();
    if (view !== "grid") params.set("view", view);
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (filterType !== "all") params.set("type", filterType);
    if (sortBy !== "name") params.set("sortBy", sortBy);
    if (sortOrder !== "asc") params.set("sortOrder", sortOrder);

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    router.replace(newUrl, { scroll: false });
  }, [view, debouncedSearch, filterType, sortBy, sortOrder, router]);

  const clearFilters = () => {
    setSearchQuery("");
    setFilterType("all");
    setSortBy("name");
    setSortOrder("asc");
    setView("grid");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    filterType !== "all" ||
    sortBy !== "name" ||
    sortOrder !== "asc";

  return {
    view,
    setView,
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    filterType,
    setFilterType,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    clearFilters,
    hasActiveFilters,
  };
}

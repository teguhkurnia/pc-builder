import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs";
import {
  Filter,
  Grid3x3,
  List,
  Loader2,
  Plus,
  Search,
  Share2,
  X,
} from "lucide-react";
import { ComponentParams } from "../../hooks/useComponentParams";

// --- HEADER COMPONENT ---
export function ComponentsHeader({
  totalCount,
  hasFilters,
  onClear,
  onShare,
  onAdd,
}: {
  totalCount: number;
  hasFilters: boolean;
  onClear: () => void;
  onShare: () => void;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">Components</h1>
          {hasFilters && (
            <Badge variant="secondary" className="text-xs">
              Filtered
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Manage your PC components inventory{" "}
          {hasFilters && (
            <span className="text-xs ml-1">• {totalCount} results</span>
          )}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {hasFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClear}
            className="hidden md:flex"
          >
            <X className="mr-2 h-4 w-4" /> Clear Filters
          </Button>
        )}
        <Button variant="outline" size="icon" onClick={onShare}>
          <Share2 className="h-4 w-4" />
        </Button>
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Component
        </Button>
      </div>
    </div>
  );
}

// --- TOOLBAR COMPONENT ---
export function ComponentsToolbar({
  params,
  isFetching,
  types,
  typeIcons,
}: {
  params: ComponentParams;
  isFetching: boolean;
  types: string[];
  typeIcons: Record<string, string>;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search components..."
                className="pl-9 pr-9"
                value={params.searchQuery}
                onChange={(e) => params.setSearchQuery(e.target.value)}
              />
              {isFetching && params.searchQuery && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>

            {/* Sort & View */}
            <div className="flex items-center gap-2">
              <Select
                value={`${params.sortBy}-${params.sortOrder}`}
                onValueChange={(val) => {
                  const [by, order] = val.split("-");
                  params.setSortBy(by as ComponentParams["sortBy"]);
                  params.setSortOrder(order as ComponentParams["sortOrder"]);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="price-asc">Price (Low-High)</SelectItem>
                  <SelectItem value="price-desc">Price (High-Low)</SelectItem>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
              <Tabs
                value={params.view}
                onValueChange={(v) => params.setView(v as "grid" | "list")}
              >
                <TabsList>
                  <TabsTrigger value="grid">
                    <Grid3x3 className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list">
                    <List className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Type Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {types.map((type) => (
              <Button
                key={type}
                variant={params.filterType === type ? "default" : "outline"}
                size="sm"
                onClick={() => params.setFilterType(type)}
                className="whitespace-nowrap"
              >
                {type === "all" ? (
                  <>
                    <Filter className="mr-2 h-3 w-3" /> All
                  </>
                ) : (
                  <>
                    <span className="mr-2">{typeIcons[type]}</span> {type}
                  </>
                )}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

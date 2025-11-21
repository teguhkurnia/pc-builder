"use client";

import { CreateComponentSchema, ListComponentsSchema } from "@repo/api/models";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Loader2, Package, Plus } from "lucide-react";
import { Suspense, useState } from "react";
import { toast } from "sonner";

// Hooks & Components
import ComponentGridCard from "../../components/component/grid-card";
import ComponentListCard from "../../components/component/list-card";
import ComponentModal from "../../components/component/modal";
import {
  ComponentsHeader,
  ComponentsToolbar,
} from "../../components/component/page-section";
import {
  useCreateComponent,
  useDeleteComponent,
  useListComponents,
  useUpdateComponent,
} from "../../hooks/api/useComponent";
import { useComponent } from "../../hooks/useComponent";
import { useComponentParams } from "../../hooks/useComponentParams";

function ComponentsPageContent() {
  // 1. Logic & State
  const params = useComponentParams();
  const { componentTypes, componentTypeIcons } = useComponent();

  const { components, isLoading, isFetching } = useListComponents({
    search: params.debouncedSearch || undefined,
    type: params.filterType !== "all" ? params.filterType : undefined,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });

  const { createComponent, isCreating } = useCreateComponent();
  const { updateComponent, isUpdating } = useUpdateComponent();
  const { deleteComponent } = useDeleteComponent();

  // Modal State
  const [modalState, setModalState] = useState<{
    open: boolean;
    type: "create" | "edit";
    component: ListComponentsSchema[number] | undefined;
  }>({
    open: false,
    type: "create",
    component: undefined,
  });

  // 2. Handlers
  const handleModalSubmit = async (data: CreateComponentSchema) => {
    if (modalState.type === "create") {
      await createComponent(data);
    } else if (modalState.type === "edit" && modalState.component) {
      await updateComponent({ id: modalState.component.id, data });
    }
    setModalState({ ...modalState, open: false });
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteComponent({ id });
    }
  };

  const handleShareURL = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const openCreate = () =>
    setModalState({ open: true, type: "create", component: undefined });
  const openEdit = (comp: ListComponentsSchema[number]) =>
    setModalState({ open: true, type: "edit", component: comp });

  // 3. Empty State Helper
  const renderEmptyState = () => (
    <Card>
      <CardContent className="flex h-48 flex-col items-center justify-center gap-2">
        <Package className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">
          {params.hasActiveFilters
            ? "No components found matching your filters"
            : "No components found"}
        </p>
        <Button variant="outline" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Your First Component
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* HEADER & TOOLBAR */}
      <ComponentsHeader
        totalCount={components?.length || 0}
        hasFilters={params.hasActiveFilters}
        onClear={params.clearFilters}
        onShare={handleShareURL}
        onAdd={openCreate}
      />

      <ComponentsToolbar
        params={params}
        isFetching={isFetching}
        types={componentTypes}
        typeIcons={componentTypeIcons}
      />

      {/* CONTENT AREA */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : components.length === 0 ? (
        renderEmptyState()
      ) : params.view === "grid" ? (
        // GRID VIEW
        <div className="relative">
          {isFetching && (
            <div className="absolute inset-0 z-10 bg-background/50 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {components.map((comp) => (
              <ComponentGridCard
                key={comp.id}
                component={comp}
                onEdit={() => openEdit(comp)}
                onDelete={() => handleDelete(comp.id, comp.name)}
              />
            ))}
          </div>
        </div>
      ) : (
        // LIST VIEW
        <Card>
          <CardHeader>
            <CardTitle>All Components ({components.length})</CardTitle>
            <CardDescription>View and manage inventory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {components.map((comp) => (
              <ComponentListCard
                key={comp.id}
                component={comp}
                onEdit={() => openEdit(comp)}
                onDelete={() => handleDelete(comp.id, comp.name)}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* MODAL */}
      <ComponentModal
        open={modalState.open}
        onOpenChange={(val) =>
          setModalState((prev) => ({ ...prev, open: val }))
        }
        mode={modalState.type}
        defaultValues={modalState.component}
        onSubmit={handleModalSubmit}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
}

export default function ComponentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ComponentsPageContent />
    </Suspense>
  );
}

# 🚀 API Quick Reference - Admin Dashboard

Quick reference guide untuk developer yang bekerja dengan Admin Dashboard PC Builder.

## 📡 Available API Endpoints

### Components API

| Method | Endpoint | Type | Description |
|--------|----------|------|-------------|
| `components.list` | Query | READ | Get all components |
| `components.create` | Mutation | CREATE | Add new component |
| `components.update` | Mutation | UPDATE | Edit component |
| `components.delete` | Mutation | DELETE | Remove component |

---

## 🎣 Custom Hooks

### useListComponents()

```typescript
import { useListComponents } from "@/hooks/api/useComponent";

const { components, isLoading, isError, error, refetch } = useListComponents();

// components: Component[]
// isLoading: boolean
// isError: boolean
// error: TRPCError | null
// refetch: () => void
```

**Features:**
- ✅ Auto-caching (5 minutes)
- ✅ No refetch on window focus
- ✅ Returns empty array by default

---

### useCreateComponent()

```typescript
import { useCreateComponent } from "@/hooks/api/useComponent";

const { createComponent, isCreating, isError, error } = useCreateComponent();

// Usage
await createComponent({
  name: "Intel Core i9-13900K",
  type: "CPU",
  price: 589.99,
  specifications: {
    cores: 24,
    threads: 32,
    baseClock: "3.0 GHz"
  }
});
```

**Input Schema:**
```typescript
{
  name: string;
  type: "CPU" | "MOTHERBOARD" | "RAM" | "STORAGE" | "GPU" | "PSU" | "CASE" | "COOLING";
  price: number;
  specifications: object; // JSON object
  createdAt?: Date;
  updatedAt?: Date;
}
```

---

### useUpdateComponent()

```typescript
import { useUpdateComponent } from "@/hooks/api/useComponent";

const { updateComponent, isUpdating, isError, error } = useUpdateComponent();

// Usage
await updateComponent({
  id: 1,
  data: {
    name: { set: "New Name" },
    price: { set: 599.99 },
    specifications: { cores: 24 }
  }
});
```

**Input Schema:**
```typescript
{
  id: number;
  data: {
    name?: { set: string };
    type?: { set: ComponentType };
    price?: { set: number };
    specifications?: object;
  }
}
```

---

### useDeleteComponent()

```typescript
import { useDeleteComponent } from "@/hooks/api/useComponent";

const { deleteComponent, isDeleting, isError, error } = useDeleteComponent();

// Usage
await deleteComponent({ id: 1 });
```

**Input Schema:**
```typescript
{
  id: number;
}
```

---

## 🎨 Toast Notifications

```typescript
import { toast } from "sonner";

// Success
toast.success("Title", {
  description: "Optional description text"
});

// Error
toast.error("Error occurred", {
  description: "Error details here"
});

// Loading
toast.loading("Processing...");

// Info
toast.info("Information");

// Warning
toast.warning("Warning message");
```

---

## 📝 Form Validation Example

```typescript
const validateForm = (): boolean => {
  const errors: Partial<ComponentFormData> = {};

  if (!formData.name.trim()) {
    errors.name = "Name is required";
  }

  if (!formData.type) {
    errors.type = "Type is required";
  }

  if (!formData.price || parseFloat(formData.price) <= 0) {
    errors.price = "Valid price is required";
  }

  if (!formData.specifications.trim()) {
    errors.specifications = "Specifications are required";
  } else {
    try {
      JSON.parse(formData.specifications);
    } catch {
      errors.specifications = "Must be valid JSON";
    }
  }

  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};
```

---

## 🔄 Complete CRUD Flow

### Create Component

```typescript
const handleCreate = async () => {
  // 1. Validate
  if (!validateForm()) {
    toast.error("Please fix form errors");
    return;
  }

  try {
    // 2. Parse JSON
    const specs = JSON.parse(formData.specifications);

    // 3. Create
    await createComponent({
      name: formData.name,
      type: formData.type as ComponentType,
      price: parseFloat(formData.price),
      specifications: specs,
    });

    // 4. Success
    toast.success("Created successfully!");
    setDialogOpen(false);
    resetForm();
  } catch (error) {
    toast.error("Failed to create", {
      description: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
```

### Update Component

```typescript
const handleUpdate = async () => {
  if (!selectedComponent || !validateForm()) return;

  try {
    const specs = JSON.parse(formData.specifications);

    await updateComponent({
      id: selectedComponent.id,
      data: {
        name: { set: formData.name },
        type: { set: formData.type as ComponentType },
        price: { set: parseFloat(formData.price) },
        specifications: specs,
      },
    });

    toast.success("Updated successfully!");
    setDialogOpen(false);
  } catch (error) {
    toast.error("Failed to update");
  }
};
```

### Delete Component

```typescript
const handleDelete = async (id: number, name: string) => {
  if (!confirm(`Delete "${name}"?`)) return;

  try {
    await deleteComponent({ id });
    toast.success("Deleted successfully!");
  } catch (error) {
    toast.error("Failed to delete");
  }
};
```

---

## 🎯 Component Types

```typescript
type ComponentType = 
  | "CPU"
  | "MOTHERBOARD"
  | "RAM"
  | "STORAGE"
  | "GPU"
  | "PSU"
  | "CASE"
  | "COOLING";
```

---

## 🎨 Component Type Colors

```typescript
const componentTypeColors: Record<string, string> = {
  CPU: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  MOTHERBOARD: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  RAM: "bg-green-500/10 text-green-500 border-green-500/20",
  STORAGE: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  GPU: "bg-red-500/10 text-red-500 border-red-500/20",
  PSU: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  CASE: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  COOLING: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
};
```

---

## 🔍 Search & Filter Example

```typescript
const [searchQuery, setSearchQuery] = useState("");
const [filterType, setFilterType] = useState<string>("all");

const filteredComponents = components.filter((component) => {
  const matchesSearch = component.name
    .toLowerCase()
    .includes(searchQuery.toLowerCase());
  const matchesType = filterType === "all" || component.type === filterType;
  return matchesSearch && matchesType;
});
```

---

## 🎭 Loading States

```typescript
// In component
{isLoading ? (
  <div className="flex items-center justify-center h-48">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </div>
) : (
  <DataTable data={filteredComponents} />
)}

// In button
<Button disabled={isCreating}>
  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {isCreating ? "Creating..." : "Create"}
</Button>
```

---

## 🚨 Error Handling

```typescript
try {
  await createComponent(data);
  toast.success("Success!");
} catch (error) {
  console.error("Error:", error);
  
  toast.error("Operation failed", {
    description: error instanceof Error 
      ? error.message 
      : "Please try again later."
  });
}
```

---

## 📦 Import Paths

```typescript
// Hooks
import { useListComponents, useCreateComponent } from "@/hooks/api/useComponent";

// UI Components
import { Button } from "@repo/ui/components/ui/button";
import { Card } from "@repo/ui/components/ui/card";
import { Dialog } from "@repo/ui/components/ui/dialog";
import { Input } from "@repo/ui/components/ui/input";
import { Select } from "@repo/ui/components/ui/select";
import { Badge } from "@repo/ui/components/ui/badge";

// Icons
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";

// Toast
import { toast } from "sonner";

// Types
import type { Component } from "@prisma/client";
```

---

## ⚡ Performance Tips

### 1. React Query Caching
```typescript
// Components list cached for 5 minutes
const { components } = useListComponents();
// No refetch on window focus by default
```

### 2. Optimistic Updates (Optional)
```typescript
const mutation = api.components.update.useMutation({
  onMutate: async (newData) => {
    await utils.components.list.cancel();
    const previous = utils.components.list.getData();
    utils.components.list.setData(undefined, (old) => 
      old?.map(c => c.id === newData.id ? { ...c, ...newData } : c)
    );
    return { previous };
  },
  onError: (err, newData, context) => {
    utils.components.list.setData(undefined, context?.previous);
  },
});
```

### 3. Debounced Search (TODO)
```typescript
import { useMemo } from "react";
import { debounce } from "lodash";

const debouncedSearch = useMemo(
  () => debounce((query: string) => setSearchQuery(query), 300),
  []
);
```

---

## 🧪 Testing Checklist

- [ ] Create component with valid data
- [ ] Create fails with empty fields
- [ ] Create fails with invalid JSON
- [ ] Update component successfully
- [ ] Delete with confirmation
- [ ] Search filters correctly
- [ ] Type filter works
- [ ] Toast appears on success
- [ ] Toast appears on error
- [ ] Loading states show during API calls

---

## 🔗 Related Files

| File | Purpose |
|------|---------|
| `app/(dashboard)/components/page.tsx` | Main UI component |
| `app/hooks/api/useComponent.ts` | Custom hooks |
| `packages/api/src/routers/app.router.ts` | tRPC router |
| `packages/api/src/services/components/` | Service layer |
| `packages/db/prisma/schema.prisma` | Database schema |

---

## 📚 Additional Resources

- [Full CRUD Documentation](./CRUD_IMPLEMENTATION.md)
- [Component Documentation](./COMPONENTS.md)
- [Dashboard Overview](./README_DASHBOARD.md)
- [tRPC Docs](https://trpc.io/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Sonner Toast Docs](https://sonner.emilkowal.ski/)

---

**Quick Start:**
```bash
cd apps/admin
pnpm dev
# Open http://localhost:3001
```

**Version:** 1.1.0  
**Last Updated:** November 2024
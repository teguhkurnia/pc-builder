# 🔧 CRUD Implementation - Component Management

Dokumentasi lengkap implementasi Create, Read, Update, Delete untuk Component Management di Admin Dashboard.

## ✅ Implementation Status

- ✅ **CREATE** - Add new component
- ✅ **READ** - List all components
- ✅ **UPDATE** - Edit existing component
- ✅ **DELETE** - Remove component

## 📦 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Dashboard UI                        │
│              (apps/admin/app/(dashboard))                    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Custom Hooks Layer                        │
│          (apps/admin/app/hooks/api/useComponent.ts)         │
│                                                              │
│  - useListComponents()                                       │
│  - useCreateComponent()                                      │
│  - useUpdateComponent()                                      │
│  - useDeleteComponent()                                      │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      tRPC Client                             │
│                 (React Query + tRPC)                         │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      tRPC Router                             │
│              (packages/api/src/routers)                      │
│                                                              │
│  - components.list     (query)                               │
│  - components.create   (mutation)                            │
│  - components.update   (mutation)                            │
│  - components.delete   (mutation)                            │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                             │
│           (packages/api/src/services/components)             │
│                                                              │
│  - list.service.ts                                           │
│  - create.service.ts                                         │
│  - update.service.ts                                         │
│  - delete.service.ts                                         │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Prisma ORM                                │
│                   (packages/db)                              │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    MySQL Database                            │
│                  (Component Table)                           │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 API Endpoints

### 1. List Components (READ)

**Endpoint**: `components.list`  
**Type**: Query  
**Input**: None  
**Output**: `Component[]`

```typescript
// Service: packages/api/src/services/components/list.service.ts
export async function listComponents(): Promise<ListComponentsSchema> {
  const services = await db.component.findMany();
  return services;
}
```

**Router**:
```typescript
components: {
  list: publicProcedure.query(async ({ ctx }) => {
    return await listComponents();
  }),
}
```

**Usage**:
```typescript
const { components, isLoading, isError, error, refetch } = useListComponents();
```

---

### 2. Create Component (CREATE)

**Endpoint**: `components.create`  
**Type**: Mutation  
**Input**: `ComponentCreateInput`  
**Output**: `Component`

```typescript
// Service: packages/api/src/services/components/create.service.ts
export async function createComponent(
  input: z.infer<typeof ComponentCreateInputSchema>
): Promise<any> {
  const validatedInput = ComponentCreateInputSchema.parse(input);
  const component = await db.component.create({
    data: validatedInput,
  });
  return component;
}
```

**Router**:
```typescript
create: publicProcedure
  .input(ComponentCreateInputSchema)
  .mutation(async ({ input }) => {
    return await createComponent(input);
  }),
```

**Usage**:
```typescript
const { createComponent, isCreating, isError, error } = useCreateComponent();

await createComponent({
  name: "Intel Core i9-13900K",
  type: "CPU",
  price: 589.99,
  specifications: {
    cores: 24,
    threads: 32,
    baseClock: "3.0 GHz",
    boostClock: "5.8 GHz"
  }
});
```

---

### 3. Update Component (UPDATE)

**Endpoint**: `components.update`  
**Type**: Mutation  
**Input**: `{ id: number, data: ComponentUpdateInput }`  
**Output**: `Component`

```typescript
// Service: packages/api/src/services/components/update.service.ts
export async function updateComponent(
  id: number,
  input: z.infer<typeof ComponentUpdateInputSchema>
): Promise<any> {
  // Check if exists
  const existingComponent = await db.component.findUnique({ where: { id } });
  if (!existingComponent) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }
  
  // Update
  const component = await db.component.update({
    where: { id },
    data: input,
  });
  return component;
}
```

**Router**:
```typescript
update: publicProcedure
  .input(
    z.object({
      id: z.number(),
      data: ComponentUpdateInputSchema,
    })
  )
  .mutation(async ({ input }) => {
    return await updateComponent(input.id, input.data);
  }),
```

**Usage**:
```typescript
const { updateComponent, isUpdating, isError, error } = useUpdateComponent();

await updateComponent({
  id: 1,
  data: {
    name: { set: "Intel Core i9-14900K" },
    price: { set: 599.99 },
    specifications: { cores: 24, threads: 32 }
  }
});
```

---

### 4. Delete Component (DELETE)

**Endpoint**: `components.delete`  
**Type**: Mutation  
**Input**: `{ id: number }`  
**Output**: `Component`

```typescript
// Service: packages/api/src/services/components/delete.service.ts
export async function deleteComponent(id: number): Promise<any> {
  // Check if exists
  const existingComponent = await db.component.findUnique({ where: { id } });
  if (!existingComponent) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }
  
  // Delete
  const component = await db.component.delete({ where: { id } });
  return component;
}
```

**Router**:
```typescript
delete: publicProcedure
  .input(z.object({ id: z.number() }))
  .mutation(async ({ input }) => {
    return await deleteComponent(input.id);
  }),
```

**Usage**:
```typescript
const { deleteComponent, isDeleting, isError, error } = useDeleteComponent();

await deleteComponent({ id: 1 });
```

---

## 🎨 UI Implementation

### Form Component

Located at: `apps/admin/app/(dashboard)/components/page.tsx`

**Features**:
- ✅ Add Component Dialog
- ✅ Edit Component Dialog
- ✅ Delete Confirmation
- ✅ Form Validation
- ✅ Loading States
- ✅ Error Handling
- ✅ Toast Notifications

### Form Fields

```typescript
interface ComponentFormData {
  name: string;           // Component name
  type: string;           // Component type (enum)
  price: string;          // Price in USD
  specifications: string; // JSON string
}
```

### Component Types (Enum)

```typescript
const componentTypes = [
  "CPU",
  "MOTHERBOARD",
  "RAM",
  "STORAGE",
  "GPU",
  "PSU",
  "CASE",
  "COOLING",
] as const;
```

### Form Validation

```typescript
const validateForm = (): boolean => {
  const errors: Partial<ComponentFormData> = {};

  // Name validation
  if (!formData.name.trim()) {
    errors.name = "Name is required";
  }

  // Type validation
  if (!formData.type) {
    errors.type = "Type is required";
  }

  // Price validation
  if (!formData.price || parseFloat(formData.price) <= 0) {
    errors.price = "Valid price is required";
  }

  // Specifications validation
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

## 🔔 Toast Notifications

Using **Sonner** library for toast notifications.

### Installation

```bash
pnpm add sonner next-themes
```

### Setup

```tsx
// apps/admin/app/(dashboard)/components/ToasterWrapper.tsx
"use client";

import { Toaster } from "@repo/ui/components/ui/sonner";

export function ToasterWrapper() {
  return <Toaster />;
}
```

```tsx
// apps/admin/app/(dashboard)/layout.tsx
import { ToasterWrapper } from "./components/ToasterWrapper";

export default function DashboardLayout({ children }) {
  return (
    <div>
      {children}
      <ToasterWrapper />
    </div>
  );
}
```

### Usage

```typescript
import { toast } from "sonner";

// Success
toast.success("Component created successfully!", {
  description: "Intel Core i9-13900K has been added to your inventory.",
});

// Error
toast.error("Failed to create component", {
  description: "Please try again later.",
});

// Loading
toast.loading("Creating component...");
```

---

## 📝 Code Examples

### Complete Create Flow

```typescript
const handleAddComponent = async () => {
  // 1. Validate form
  if (!validateForm()) {
    toast.error("Please fix the form errors");
    return;
  }

  try {
    // 2. Parse JSON specifications
    const specifications = JSON.parse(formData.specifications);

    // 3. Call API
    await createComponent({
      name: formData.name,
      type: formData.type as ComponentType,
      price: parseFloat(formData.price),
      specifications,
    });

    // 4. Show success toast
    toast.success("Component created successfully!", {
      description: `${formData.name} has been added to your inventory.`,
    });

    // 5. Close dialog & reset form
    setIsAddDialogOpen(false);
    resetForm();
    
    // React Query automatically refetches due to cache invalidation
  } catch (error) {
    console.error("Error creating component:", error);
    toast.error("Failed to create component", {
      description: error instanceof Error ? error.message : "Please try again later.",
    });
  }
};
```

### Complete Update Flow

```typescript
const handleEditComponent = async () => {
  if (!selectedComponent || !validateForm()) {
    toast.error("Please fix the form errors");
    return;
  }

  try {
    const specifications = JSON.parse(formData.specifications);

    await updateComponent({
      id: selectedComponent.id,
      data: {
        name: { set: formData.name },
        type: { set: formData.type as ComponentType },
        price: { set: parseFloat(formData.price) },
        specifications,
      },
    });

    toast.success("Component updated successfully!", {
      description: `${formData.name} has been updated.`,
    });

    setIsEditDialogOpen(false);
    setSelectedComponent(null);
    resetForm();
  } catch (error) {
    console.error("Error updating component:", error);
    toast.error("Failed to update component", {
      description: error instanceof Error ? error.message : "Please try again later.",
    });
  }
};
```

### Complete Delete Flow

```typescript
const handleDeleteComponent = async (id: number, name: string) => {
  // 1. Confirmation
  if (!confirm(`Are you sure you want to delete "${name}"?`)) {
    return;
  }

  try {
    // 2. Call API
    await deleteComponent({ id });

    // 3. Show success toast
    toast.success("Component deleted successfully!", {
      description: `${name} has been removed from your inventory.`,
    });
    
    // React Query automatically refetches
  } catch (error) {
    console.error("Error deleting component:", error);
    toast.error("Failed to delete component", {
      description: error instanceof Error ? error.message : "Please try again later.",
    });
  }
};
```

---

## 🔄 React Query Integration

### Cache Invalidation

All mutations automatically invalidate the components list cache:

```typescript
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
```

### Optimistic Updates (Optional)

```typescript
const mutation = api.components.update.useMutation({
  onMutate: async (newComponent) => {
    // Cancel outgoing refetches
    await utils.components.list.cancel();

    // Snapshot previous value
    const previousComponents = utils.components.list.getData();

    // Optimistically update
    utils.components.list.setData(undefined, (old) => 
      old?.map(c => c.id === newComponent.id ? { ...c, ...newComponent } : c)
    );

    return { previousComponents };
  },
  onError: (err, newComponent, context) => {
    // Rollback on error
    utils.components.list.setData(undefined, context?.previousComponents);
  },
  onSettled: () => {
    // Refetch after mutation
    utils.components.list.invalidate();
  },
});
```

---

## 🛡️ Error Handling

### Service Layer

```typescript
try {
  // Database operation
  const component = await db.component.create({ data });
  return component;
} catch (error) {
  logger.error("Error creating component:", error);

  // Zod validation error
  if (error instanceof Error && error.name === "ZodError") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid component data",
      cause: error,
    });
  }

  // Generic error
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Failed to create component",
  });
}
```

### UI Layer

```typescript
try {
  await createComponent(data);
  toast.success("Success!");
} catch (error) {
  console.error("Error:", error);
  toast.error("Failed", {
    description: error instanceof Error ? error.message : "Unknown error",
  });
}
```

---

## 📊 Database Schema

```prisma
model Component {
  id             Int           @id @default(autoincrement())
  name           String
  type           ComponentType
  price          Float
  specifications Json
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}

enum ComponentType {
  CPU
  MOTHERBOARD
  RAM
  STORAGE
  GPU
  PSU
  CASE
  COOLING
}
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] **Create Component**
  - [ ] Valid data creates component successfully
  - [ ] Empty fields show validation errors
  - [ ] Invalid JSON shows error
  - [ ] Success toast appears
  - [ ] Dialog closes after success
  - [ ] List refreshes automatically

- [ ] **Update Component**
  - [ ] Edit dialog pre-fills with existing data
  - [ ] Valid updates save successfully
  - [ ] Validation works on edit form
  - [ ] Success toast appears
  - [ ] List refreshes with updated data

- [ ] **Delete Component**
  - [ ] Confirmation dialog appears
  - [ ] Canceling confirmation works
  - [ ] Successful delete removes from list
  - [ ] Success toast appears
  - [ ] List refreshes automatically

- [ ] **List Components**
  - [ ] All components display in table
  - [ ] Search filters correctly
  - [ ] Type filter works
  - [ ] Loading state shows during fetch
  - [ ] Error state handles fetch errors

---

## 🚀 Performance Considerations

### 1. React Query Caching
- Components list cached for 5 minutes
- Reduces unnecessary API calls
- Manual invalidation after mutations

### 2. Debounced Search
```typescript
// TODO: Add debounce to search
const debouncedSearch = useMemo(
  () => debounce((query) => setSearchQuery(query), 300),
  []
);
```

### 3. Pagination (Future)
```typescript
// TODO: Add pagination
const { data, fetchNextPage, hasNextPage } = api.components.list.useInfiniteQuery({
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
```

---

## 📚 Related Files

### Frontend (Admin App)
- `apps/admin/app/(dashboard)/components/page.tsx` - Main UI
- `apps/admin/app/hooks/api/useComponent.ts` - Hooks
- `apps/admin/app/utils/api.ts` - tRPC client setup
- `apps/admin/app/(dashboard)/components/ToasterWrapper.tsx` - Toast wrapper

### Backend (API Package)
- `packages/api/src/routers/app.router.ts` - tRPC router
- `packages/api/src/services/components/list.service.ts` - List service
- `packages/api/src/services/components/create.service.ts` - Create service
- `packages/api/src/services/components/update.service.ts` - Update service
- `packages/api/src/services/components/delete.service.ts` - Delete service

### Database (DB Package)
- `packages/db/prisma/schema.prisma` - Database schema
- `packages/db/src/generated/schemas/` - Zod schemas

---

## ✅ Completion Summary

### What's Working
- ✅ Full CRUD operations
- ✅ Form validation
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling
- ✅ React Query caching
- ✅ Automatic cache invalidation
- ✅ Type safety (TypeScript + Zod)

### What's Next
- [ ] Add optimistic updates
- [ ] Implement pagination
- [ ] Add debounced search
- [ ] Add bulk operations
- [ ] Add image upload
- [ ] Add export functionality
- [ ] Add component preview
- [ ] Add version history

---

**Last Updated**: November 2024  
**Status**: ✅ Fully Implemented  
**Version**: 1.0.0
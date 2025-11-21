# PC Builder Platform - API Documentation

**Version**: 1.0.0  
**Last Updated**: December 2024  
**API Type**: tRPC (Type-Safe RPC)

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Code Examples](#code-examples)
8. [Rate Limiting](#rate-limiting)
9. [Versioning](#versioning)

---

## Overview

The PC Builder API is built with **tRPC**, providing end-to-end type-safe APIs without code generation. All API calls are type-checked at compile time, ensuring reliability and great developer experience.

### Key Features

- ✅ **Full Type Safety** - TypeScript types from database to client
- ✅ **No Code Generation** - Types inferred automatically
- ✅ **Built-in Validation** - Zod schema validation
- ✅ **React Query Integration** - Automatic caching and state management
- ✅ **SuperJSON Support** - Serializes complex types (Date, Map, Set, etc.)
- ✅ **Error Handling** - Structured error responses

### Base URLs

| Environment | URL | Description |
|-------------|-----|-------------|
| **Development** | `http://localhost:4000/trpc` | Standalone Fastify server |
| **Next.js (Admin)** | `http://localhost:3001/api/trpc` | Admin dashboard API |
| **Next.js (Builder)** | `http://localhost:3000/api/trpc` | Builder app API |
| **Production** | TBD | Production endpoint |

---

## Getting Started

### Installation (Client-Side)

```typescript
// Already installed in Next.js apps
import { trpc } from '~/utils/trpc';

// In components
export function ComponentList() {
  const { data, isLoading, error } = trpc.component.list.useQuery();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data?.map(component => (
        <div key={component.id}>{component.name}</div>
      ))}
    </div>
  );
}
```

### tRPC Client Setup

```typescript
// apps/admin/utils/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@repo/api';

export const trpc = createTRPCReact<AppRouter>();
```

### Provider Setup

```typescript
// apps/admin/app/layout.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '~/utils/trpc';
import { useState } from 'react';
import superjson from 'superjson';

export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: 'http://localhost:3001/api/trpc',
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

---

## Authentication

### Current Status

🔄 **In Development** - Authentication is not yet implemented.

### Planned Authentication Flow

```typescript
// Future implementation
const login = trpc.auth.login.useMutation({
  onSuccess: (data) => {
    // JWT token stored in HTTP-only cookie
    localStorage.setItem('user', JSON.stringify(data.user));
  },
});

login.mutate({ email: 'user@example.com', password: 'password' });
```

### Protected Endpoints (Future)

```typescript
// Future: Protected procedures
const protectedProcedure = publicProcedure.use(
  async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({ ctx: { user: ctx.user } });
  }
);
```

---

## API Endpoints

### Component Router

#### 📋 List All Components

**Endpoint**: `component.list`  
**Type**: Query  
**Auth**: Public

**Request:**
```typescript
const { data } = trpc.component.list.useQuery();
```

**Response:**
```typescript
Component[] // Array of all components

// Example:
[
  {
    id: 1,
    name: "Intel Core i7-13700K",
    type: "CPU",
    price: 419.99,
    specifications: {
      cores: 16,
      threads: 24,
      baseClock: "3.4 GHz",
      boostClock: "5.4 GHz",
      socket: "LGA1700",
      tdp: "125W"
    },
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  // ... more components
]
```

---

#### 🔍 Get Component by ID

**Endpoint**: `component.getById`  
**Type**: Query  
**Auth**: Public

**Input Schema:**
```typescript
{
  id: number // Component ID
}
```

**Request:**
```typescript
const { data } = trpc.component.getById.useQuery({ id: 1 });
```

**Response:**
```typescript
Component | null

// Example:
{
  id: 1,
  name: "AMD Ryzen 9 7950X",
  type: "CPU",
  price: 699.99,
  specifications: {
    cores: 16,
    threads: 32,
    baseClock: "4.5 GHz",
    boostClock: "5.7 GHz",
    socket: "AM5",
    tdp: "170W"
  },
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2024-01-15T10:30:00Z"
}
```

---

#### ➕ Create Component

**Endpoint**: `component.create`  
**Type**: Mutation  
**Auth**: Public (Future: Admin only)

**Input Schema:**
```typescript
{
  name: string;          // Min 1, Max 255 characters
  type: ComponentType;   // Enum: CPU, GPU, RAM, etc.
  price: number;         // Must be positive
  specifications: Record<string, unknown>; // JSON object
}
```

**Request:**
```typescript
const createMutation = trpc.component.create.useMutation({
  onSuccess: () => {
    // Invalidate cache to refetch list
    trpc.useContext().component.list.invalidate();
  },
});

createMutation.mutate({
  name: "NVIDIA GeForce RTX 4080",
  type: "GPU",
  price: 1199.99,
  specifications: {
    chipset: "NVIDIA RTX 4080",
    memory: "16GB GDDR6X",
    coreClock: "2205 MHz",
    boostClock: "2505 MHz",
    tdp: "320W"
  }
});
```

**Response:**
```typescript
Component // Newly created component

// Example:
{
  id: 42,
  name: "NVIDIA GeForce RTX 4080",
  type: "GPU",
  price: 1199.99,
  specifications: {
    chipset: "NVIDIA RTX 4080",
    memory: "16GB GDDR6X",
    coreClock: "2205 MHz",
    boostClock: "2505 MHz",
    tdp: "320W"
  },
  createdAt: "2024-12-20T15:45:00Z",
  updatedAt: "2024-12-20T15:45:00Z"
}
```

---

#### ✏️ Update Component

**Endpoint**: `component.update`  
**Type**: Mutation  
**Auth**: Public (Future: Admin only)

**Input Schema:**
```typescript
{
  id: number;                              // Component ID
  data: {
    name?: string;                         // Optional
    type?: ComponentType;                  // Optional
    price?: number;                        // Optional
    specifications?: Record<string, unknown>; // Optional
  }
}
```

**Request:**
```typescript
const updateMutation = trpc.component.update.useMutation({
  onSuccess: () => {
    trpc.useContext().component.list.invalidate();
    trpc.useContext().component.getById.invalidate({ id });
  },
});

updateMutation.mutate({
  id: 42,
  data: {
    price: 1099.99, // Price reduced
    specifications: {
      chipset: "NVIDIA RTX 4080",
      memory: "16GB GDDR6X",
      coreClock: "2205 MHz",
      boostClock: "2505 MHz",
      tdp: "320W",
      availability: "In Stock" // Added field
    }
  }
});
```

**Response:**
```typescript
Component // Updated component

// Example:
{
  id: 42,
  name: "NVIDIA GeForce RTX 4080",
  type: "GPU",
  price: 1099.99, // Updated
  specifications: {
    chipset: "NVIDIA RTX 4080",
    memory: "16GB GDDR6X",
    coreClock: "2205 MHz",
    boostClock: "2505 MHz",
    tdp: "320W",
    availability: "In Stock" // New field
  },
  createdAt: "2024-12-20T15:45:00Z",
  updatedAt: "2024-12-20T16:30:00Z" // Updated timestamp
}
```

---

#### 🗑️ Delete Component

**Endpoint**: `component.delete`  
**Type**: Mutation  
**Auth**: Public (Future: Admin only)

**Input Schema:**
```typescript
{
  id: number // Component ID to delete
}
```

**Request:**
```typescript
const deleteMutation = trpc.component.delete.useMutation({
  onSuccess: () => {
    trpc.useContext().component.list.invalidate();
  },
});

deleteMutation.mutate({ id: 42 });
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
}

// Example:
{
  success: true,
  message: "Component deleted successfully"
}
```

---

### Product Router (Future)

#### 📋 List Products
**Status**: 🔄 Planned

```typescript
// Future endpoint
const { data } = trpc.product.list.useQuery();
```

#### ➕ Create Product Bundle
**Status**: 🔄 Planned

```typescript
// Future endpoint
trpc.product.create.useMutation({
  name: "Gaming PC Build",
  components: [1, 5, 8, 12], // Component IDs
  discount: 0.1, // 10% discount
});
```

---

### User Router (Future)

#### 🔐 Login
**Status**: 🔄 Planned

```typescript
// Future endpoint
trpc.auth.login.useMutation({
  email: "user@example.com",
  password: "password123"
});
```

#### 👤 Get User Profile
**Status**: 🔄 Planned

```typescript
// Future endpoint
const { data } = trpc.user.me.useQuery();
```

---

## Data Models

### Component

```typescript
interface Component {
  id: number;
  name: string;
  type: ComponentType;
  price: number;
  specifications: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
```

### ComponentType Enum

```typescript
enum ComponentType {
  CPU = "CPU",
  MOTHERBOARD = "MOTHERBOARD",
  RAM = "RAM",
  STORAGE = "STORAGE",
  GPU = "GPU",
  PSU = "PSU",
  CASE = "CASE",
  COOLING = "COOLING"
}
```

### Specification Structures

#### CPU Specifications
```typescript
{
  cores: number;
  threads: number;
  baseClock: string;    // e.g., "3.4 GHz"
  boostClock: string;   // e.g., "5.4 GHz"
  socket: string;       // e.g., "LGA1700", "AM5"
  tdp: string;          // e.g., "125W"
}
```

#### GPU Specifications
```typescript
{
  chipset: string;      // e.g., "NVIDIA RTX 4080"
  memory: string;       // e.g., "16GB GDDR6X"
  coreClock: string;    // e.g., "2205 MHz"
  boostClock: string;   // e.g., "2505 MHz"
  tdp: string;          // e.g., "320W"
}
```

#### RAM Specifications
```typescript
{
  capacity: string;     // e.g., "32GB"
  speed: string;        // e.g., "6000 MHz"
  type: string;         // e.g., "DDR5"
  casLatency: string;   // e.g., "CL36"
}
```

#### Storage Specifications
```typescript
{
  capacity: string;     // e.g., "1TB"
  type: string;         // e.g., "NVMe SSD"
  interface: string;    // e.g., "PCIe 4.0 x4"
  readSpeed: string;    // e.g., "7000 MB/s"
  writeSpeed: string;   // e.g., "5000 MB/s"
  formFactor: string;   // e.g., "M.2 2280"
}
```

#### Motherboard Specifications
```typescript
{
  socket: string;       // e.g., "LGA1700"
  chipset: string;      // e.g., "Z790"
  formFactor: string;   // e.g., "ATX"
  memorySlots: number;  // e.g., 4
  maxMemory: string;    // e.g., "128GB"
}
```

#### PSU Specifications
```typescript
{
  wattage: string;      // e.g., "850W"
  efficiency: string;   // e.g., "80+ Gold"
  modular: string;      // e.g., "Fully Modular"
  formFactor: string;   // e.g., "ATX"
}
```

#### Case Specifications
```typescript
{
  formFactor: string;   // e.g., "ATX Mid Tower"
  dimensions: string;   // e.g., "210 x 464 x 474 mm"
  driveBays: {
    "3.5inch": number;
    "2.5inch": number;
  };
}
```

#### Cooling Specifications
```typescript
{
  type: string;         // e.g., "AIO Liquid"
  radiatorSize: string; // e.g., "280mm"
  fans: number;         // e.g., 2
  tdpRating: string;    // e.g., "250W"
}
```

---

## Error Handling

### Error Types

tRPC uses standardized error codes:

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `BAD_REQUEST` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Not authorized |
| `NOT_FOUND` | 404 | Resource not found |
| `TIMEOUT` | 408 | Request timeout |
| `CONFLICT` | 409 | Resource conflict |
| `PRECONDITION_FAILED` | 412 | Precondition failed |
| `PAYLOAD_TOO_LARGE` | 413 | Request too large |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |

### Error Response Format

```typescript
{
  error: {
    message: string;
    code: string;
    data: {
      code: string;
      httpStatus: number;
      path: string;
      zodError?: ZodError; // If validation error
    };
  };
}
```

### Error Handling Examples

#### Client-Side Error Handling

```typescript
// Using useQuery
const { data, error } = trpc.component.list.useQuery();

if (error) {
  console.error('Error code:', error.data?.code);
  console.error('Error message:', error.message);
  
  // Show user-friendly message
  if (error.data?.code === 'NOT_FOUND') {
    return <div>Component not found</div>;
  }
  
  return <div>Error: {error.message}</div>;
}
```

```typescript
// Using useMutation
const createMutation = trpc.component.create.useMutation({
  onError: (error) => {
    if (error.data?.code === 'BAD_REQUEST') {
      // Validation error
      console.error('Validation errors:', error.data.zodError);
      toast.error('Invalid input data');
    } else {
      toast.error(`Error: ${error.message}`);
    }
  },
  onSuccess: () => {
    toast.success('Component created successfully');
  },
});
```

#### Validation Errors

```typescript
// Zod validation error
{
  error: {
    message: "Validation error",
    code: "BAD_REQUEST",
    data: {
      code: "BAD_REQUEST",
      httpStatus: 400,
      path: "component.create",
      zodError: {
        issues: [
          {
            code: "too_small",
            minimum: 1,
            type: "string",
            inclusive: true,
            message: "Name must be at least 1 character",
            path: ["name"]
          },
          {
            code: "invalid_type",
            expected: "number",
            received: "string",
            message: "Price must be a number",
            path: ["price"]
          }
        ]
      }
    }
  }
}
```

---

## Code Examples

### Complete CRUD Example

```typescript
'use client';

import { trpc } from '~/utils/trpc';
import { useState } from 'react';

export function ComponentManager() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  // Query: List all components
  const { data: components, isLoading } = trpc.component.list.useQuery();
  
  // Query: Get single component
  const { data: component } = trpc.component.getById.useQuery(
    { id: selectedId! },
    { enabled: !!selectedId } // Only fetch when ID is set
  );
  
  // Mutation: Create component
  const createMutation = trpc.component.create.useMutation({
    onSuccess: () => {
      trpc.useContext().component.list.invalidate();
    },
  });
  
  // Mutation: Update component
  const updateMutation = trpc.component.update.useMutation({
    onSuccess: () => {
      trpc.useContext().component.list.invalidate();
      trpc.useContext().component.getById.invalidate({ id: selectedId! });
    },
  });
  
  // Mutation: Delete component
  const deleteMutation = trpc.component.delete.useMutation({
    onSuccess: () => {
      trpc.useContext().component.list.invalidate();
      setSelectedId(null);
    },
  });
  
  const handleCreate = () => {
    createMutation.mutate({
      name: "New Component",
      type: "CPU",
      price: 299.99,
      specifications: { cores: 8, threads: 16 }
    });
  };
  
  const handleUpdate = (id: number) => {
    updateMutation.mutate({
      id,
      data: { price: 249.99 }
    });
  };
  
  const handleDelete = (id: number) => {
    if (confirm('Are you sure?')) {
      deleteMutation.mutate({ id });
    }
  };
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <button onClick={handleCreate}>Create Component</button>
      
      <ul>
        {components?.map(c => (
          <li key={c.id}>
            {c.name} - ${c.price}
            <button onClick={() => setSelectedId(c.id)}>View</button>
            <button onClick={() => handleUpdate(c.id)}>Update</button>
            <button onClick={() => handleDelete(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
      
      {component && (
        <div>
          <h2>{component.name}</h2>
          <p>Price: ${component.price}</p>
          <pre>{JSON.stringify(component.specifications, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

### Optimistic Updates

```typescript
const updateMutation = trpc.component.update.useMutation({
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await trpc.useContext().component.list.cancel();
    
    // Snapshot current value
    const previous = trpc.useContext().component.list.getData();
    
    // Optimistically update cache
    trpc.useContext().component.list.setData(undefined, (old) =>
      old?.map(c => c.id === newData.id ? { ...c, ...newData.data } : c)
    );
    
    // Return context for rollback
    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    trpc.useContext().component.list.setData(undefined, context?.previous);
  },
  onSettled: () => {
    // Refetch after mutation
    trpc.useContext().component.list.invalidate();
  },
});
```

### Pagination (Future)

```typescript
const { data, fetchNextPage, hasNextPage } = 
  trpc.component.list.useInfiniteQuery(
    { limit: 20 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
```

---

## Rate Limiting

### Current Status

⚠️ **Not Implemented** - No rate limiting currently in place.

### Planned Implementation

```typescript
// Future: Rate limiting configuration
{
  max: 100,          // 100 requests
  timeWindow: 60000, // per minute
  ban: 86400000,     // 24 hour ban after limit exceeded
}
```

---

## Versioning

### Current Version

**v1.0.0** - Initial release

### Versioning Strategy

- **Breaking Changes** - Major version bump (v2.0.0)
- **New Features** - Minor version bump (v1.1.0)
- **Bug Fixes** - Patch version bump (v1.0.1)

### Future Versioning (If Needed)

```typescript
// Future: API versioning
const v1Router = router({
  component: componentRouterV1,
});

const v2Router = router({
  component: componentRouterV2,
});

export const appRouter = router({
  v1: v1Router,
  v2: v2Router,
});
```

---

## Best Practices

### 1. Cache Invalidation

```typescript
// Always invalidate related queries after mutations
const createMutation = trpc.component.create.useMutation({
  onSuccess: () => {
    // Invalidate list
    trpc.useContext().component.list.invalidate();
    
    // Optionally refetch immediately
    trpc.useContext().component.list.refetch();
  },
});
```

### 2. Loading States

```typescript
const { data, isLoading, isFetching } = trpc.component.list.useQuery();

// isLoading: First fetch
// isFetching: Any fetch (including refetch)

if (isLoading) return <Spinner />;
if (isFetching) return <LoadingOverlay />;
```

### 3. Error Boundaries

```typescript
import { TRPCClientError } from '@trpc/client';

try {
  const result = await trpcClient.component.create.mutate(data);
} catch (error) {
  if (error instanceof TRPCClientError) {
    console.error('tRPC Error:', error.data?.code);
  }
}
```

### 4. Type Inference

```typescript
import type { AppRouter } from '@repo/api';
import type { inferRouterOutputs } from '@trpc/server';

// Infer types from router
type RouterOutput = inferRouterOutputs<AppRouter>;
type Component = RouterOutput['component']['list'][number];
```

---

## Additional Resources

### Official Documentation

- [tRPC Documentation](https://trpc.io/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zod Documentation](https://zod.dev/)

### Project Documentation

- [README.md](./README.md) - Project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development guide

---

**API Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintained by**: PC Builder Team

For API support or questions, contact the development team.
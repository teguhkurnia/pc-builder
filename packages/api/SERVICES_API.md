# Services Public API Layer

## Overview

This document explains how to use the services public API layer in the `@repo/api` package. The public API layer provides a clean and maintainable way to import service functions without directly accessing internal implementation files.

## Why Use Public API Layer?

### ❌ Bad Practice - Direct Imports
```typescript
// DON'T do this - tightly coupled to internal structure
import { createAsset } from "@repo/api/src/services/assets/create.service";
import { listAssets } from "@repo/api/src/services/assets/list.service";
import { deleteAsset } from "@repo/api/src/services/assets/delete.service";
```

**Problems:**
- Violates encapsulation
- Creates tight coupling to internal file structure
- Hard to maintain when refactoring
- Exposes implementation details
- If folder structure changes, all imports break

### ✅ Good Practice - Public API Layer
```typescript
// DO this - clean, maintainable imports
import { createAsset, listAssets, deleteAsset } from "@repo/api/src/services";
```

**Benefits:**
- Clean separation between public API and internal implementation
- Easy to refactor internal structure without breaking consumers
- Clear contract of what's available
- Single source of truth for service exports
- Better encapsulation

## Available Services

### Assets Services

Import assets services from the public API:

```typescript
import { 
  createAsset, 
  listAssets, 
  deleteAsset,
  getAssetById,
  getAssetByFilename 
} from "@repo/api/src/services";
```

Or use the namespace import:

```typescript
import { assetsService } from "@repo/api/src/services";

// Usage
await assetsService.createAsset({ ... });
await assetsService.listAssets({ ... });
await assetsService.deleteAsset({ ... });
```

#### `createAsset(input: CreateAssetInput)`

Creates a new asset record in the database.

**Parameters:**
- `input.filename` - Unique filename for the asset
- `input.originalFilename` - Original filename from upload
- `input.mimetype` - MIME type of the file
- `input.size` - File size in bytes
- `input.url` - Public URL to access the file
- `input.path` - Filesystem path to the file
- `input.type` - Asset type: `"IMAGE"` | `"DOCUMENT"` | `"OTHER"` (default: `"IMAGE"`)

**Returns:** Asset object

**Example:**
```typescript
const asset = await createAsset({
  filename: "abc123.jpg",
  originalFilename: "photo.jpg",
  mimetype: "image/jpeg",
  size: 102400,
  url: "http://localhost:4000/uploads/images/abc123.jpg",
  path: "/path/to/uploads/abc123.jpg",
  type: "IMAGE"
});
```

#### `listAssets(input: ListAssetsInput)`

Lists assets with filtering, sorting, and pagination.

**Parameters:**
- `input.type` - Filter by asset type (optional)
- `input.search` - Search in filename or original filename (optional)
- `input.sortBy` - Sort field: `"createdAt"` | `"size"` | `"filename"` (default: `"createdAt"`)
- `input.sortOrder` - Sort order: `"asc"` | `"desc"` (default: `"desc"`)
- `input.limit` - Number of results (default: 50, max: 100)
- `input.offset` - Offset for pagination (default: 0)

**Returns:** Object with `assets` array and `pagination` info

**Example:**
```typescript
const result = await listAssets({
  type: "IMAGE",
  sortBy: "createdAt",
  sortOrder: "desc",
  limit: 20,
  offset: 0
});

console.log(result.assets); // Array of assets
console.log(result.pagination.total); // Total count
console.log(result.pagination.hasMore); // More results available?
```

#### `deleteAsset(input: DeleteAssetInput)`

Deletes an asset from both database and filesystem.

**Parameters:**
- `input.id` - Asset ID (optional, use either id or filename)
- `input.filename` - Asset filename (optional, use either id or filename)

**Returns:** Object with success status and deleted asset info

**Example:**
```typescript
// Delete by filename
const result = await deleteAsset({ filename: "abc123.jpg" });

// Delete by ID
const result = await deleteAsset({ id: 123 });

console.log(result.success); // true
console.log(result.message); // "Asset abc123.jpg deleted successfully"
```

#### `getAssetById(id: number)`

Gets a single asset by its ID.

**Parameters:**
- `id` - Asset ID

**Returns:** Asset object

**Throws:** Error if asset not found

**Example:**
```typescript
const asset = await getAssetById(123);
```

#### `getAssetByFilename(filename: string)`

Gets a single asset by its filename.

**Parameters:**
- `filename` - Asset filename

**Returns:** Asset object

**Throws:** Error if asset not found

**Example:**
```typescript
const asset = await getAssetByFilename("abc123.jpg");
```

## Adding New Services

When you add new service modules, follow these steps:

### 1. Create Service Files

Create your service files in a new directory:
```
packages/api/src/services/your-service/
  ├── create.service.ts
  ├── list.service.ts
  ├── update.service.ts
  └── delete.service.ts
```

### 2. Create Barrel Export

Create `index.ts` in your service directory:

```typescript
// packages/api/src/services/your-service/index.ts
export { createYourThing } from "./create.service";
export { listYourThings } from "./list.service";
export { updateYourThing } from "./update.service";
export { deleteYourThing } from "./delete.service";
```

### 3. Update Public API Layer

Update `packages/api/src/services/index.ts`:

```typescript
// Add namespace export
export * as yourServiceName from "./your-service";

// Add individual exports for convenience
export {
  createYourThing,
  listYourThings,
  updateYourThing,
  deleteYourThing,
} from "./your-service";
```

### 4. Done!

Now consumers can import your services:

```typescript
import { createYourThing, listYourThings } from "@repo/api/src/services";
```

## Package Exports

The package.json defines these exports:

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./models": "./src/models/index.ts",
    "./services": "./src/services/index.ts"
  }
}
```

This allows clean imports:
- `@repo/api` - Main package exports (tRPC router, context, etc.)
- `@repo/api/models` - Zod schemas and types
- `@repo/api/src/services` - All service functions (current module resolution)

> **Note:** With current `moduleResolution: "node"`, use `@repo/api/src/services`. If you upgrade to `moduleResolution: "node16"` or `"bundler"`, you can use `@repo/api/services`.

## Type Safety

All service functions are fully typed with TypeScript:

```typescript
import { createAsset } from "@repo/api/src/services";
import { CreateAssetInput } from "@repo/api/models";

// TypeScript will enforce the correct input type
const input: CreateAssetInput = {
  filename: "test.jpg",
  originalFilename: "photo.jpg",
  mimetype: "image/jpeg",
  size: 1024,
  url: "http://example.com/test.jpg",
  path: "/uploads/test.jpg",
  type: "IMAGE"
};

const asset = await createAsset(input);
// asset is fully typed with Asset type
```

## Best Practices

1. **Always use the public API layer** - Never import directly from service files
2. **Import types from models** - Use `@repo/api/models` for input/output types
3. **Handle errors properly** - Services throw `TRPCError`, catch and handle them
4. **Use TypeScript** - Leverage type safety for input validation
5. **Check return values** - Services may return success flags and messages

## Error Handling

Services use tRPC error handling:

```typescript
import { TRPCError } from "@trpc/server";
import { createAsset } from "@repo/api/src/services";

try {
  const asset = await createAsset(input);
} catch (error) {
  if (error instanceof TRPCError) {
    console.error(`Error [${error.code}]: ${error.message}`);
  }
}
```

Common error codes:
- `BAD_REQUEST` - Invalid input data
- `NOT_FOUND` - Resource not found
- `INTERNAL_SERVER_ERROR` - Server error

## Migration Guide

If you have existing code using direct imports:

### Before
```typescript
import { createAsset } from "@repo/api/src/services/assets/create.service";
import { listAssets } from "@repo/api/src/services/assets/list.service";
```

### After
```typescript
import { createAsset, listAssets } from "@repo/api/src/services";
```

That's it! The function signatures and behavior remain the same.
# Upload Integration Documentation

Dokumentasi lengkap untuk sistem upload file yang terintegrasi dengan `@repo/api` dan `@repo/db`.

## 📋 Overview

Sistem upload menggunakan arsitektur hybrid:
1. **Fastify Multipart** - Handle file upload (POST multipart/form-data)
2. **Prisma Database** - Menyimpan metadata file
3. **tRPC API** - Operasi CRUD untuk metadata (list, get, delete)

### Mengapa Hybrid?

- **Fastify untuk upload**: tRPC tidak mendukung multipart/form-data dengan baik
- **tRPC untuk metadata**: Konsisten dengan API architecture yang ada
- **Database untuk metadata**: Single source of truth, mendukung search/filter/pagination

---

## 🗄️ Database Schema

### Asset Model

```prisma
enum AssetType {
  IMAGE
  DOCUMENT
  OTHER
}

model Asset {
  id               Int       @id @default(autoincrement())
  filename         String    @unique
  originalFilename String
  mimetype         String
  size             Int
  type             AssetType @default(IMAGE)
  url              String
  path             String
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt

  @@index([type])
  @@index([createdAt])
}
```

### Component Model (Updated)

```prisma
model Component {
  id             Int           @id @default(autoincrement())
  name           String
  type           ComponentType
  price          Float
  imageUrl       String?       // <-- New field
  specifications Json
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}
```

---

## 🔌 API Architecture

### Fastify Endpoints (File Operations)

#### Upload Image
```http
POST /api/upload/image
Content-Type: multipart/form-data

FormData: file (single or multiple)
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully uploaded 1 file(s)",
  "files": [
    {
      "filename": "1700000000000-abc123-image.jpg",
      "originalFilename": "image.jpg",
      "url": "http://localhost:4000/uploads/images/1700000000000-abc123-image.jpg",
      "size": 123456,
      "mimetype": "image/jpeg",
      "uploadedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Process:**
1. Validate file (type, size)
2. Generate unique filename
3. Save to filesystem (`uploads/images/`)
4. **Save metadata to database** (Asset model)
5. Return file info with URL

#### List Images (Legacy - menggunakan database)
```http
GET /api/upload/images
```

**Response:**
```json
{
  "success": true,
  "images": [...],
  "total": 10
}
```

#### Delete Image (Legacy - menggunakan database)
```http
DELETE /api/upload/image/:filename
```

---

### tRPC Procedures (Metadata Operations)

#### `assets.list`

List assets dengan filtering dan pagination.

**Input:**
```typescript
{
  type?: "IMAGE" | "DOCUMENT" | "OTHER";
  search?: string;
  limit?: number;      // default: 50, max: 100
  offset?: number;     // default: 0
  sortBy?: "createdAt" | "size" | "filename";  // default: "createdAt"
  sortOrder?: "asc" | "desc";  // default: "desc"
}
```

**Output:**
```typescript
{
  assets: Asset[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}
```

**Example:**
```typescript
// Get all images, sorted by newest
const result = await trpc.assets.list.query({
  type: "IMAGE",
  sortBy: "createdAt",
  sortOrder: "desc",
  limit: 20
});

// Search images
const result = await trpc.assets.list.query({
  type: "IMAGE",
  search: "product"
});
```

#### `assets.getById`

Get asset by ID.

**Input:**
```typescript
{ id: number }
```

**Output:**
```typescript
Asset
```

#### `assets.getByFilename`

Get asset by filename.

**Input:**
```typescript
{ filename: string }
```

**Output:**
```typescript
Asset
```

#### `assets.delete`

Delete asset (removes file from filesystem and database).

**Input:**
```typescript
{
  id?: number;
  filename?: string;
}
```

**Output:**
```typescript
{
  success: boolean;
  message: string;
  deletedAsset: Asset;
}
```

---

## 🎯 Frontend Integration

### React Hooks

#### `useListAssets`

```typescript
import { useListAssets } from "@/hooks/useAssets";

function MyComponent() {
  const { data, isLoading, error } = useListAssets({
    type: "IMAGE",
    search: "product",
    limit: 20
  });

  return (
    <div>
      {data?.assets.map(asset => (
        <img key={asset.id} src={asset.url} alt={asset.originalFilename} />
      ))}
    </div>
  );
}
```

#### `useUploadImage`

```typescript
import { useUploadImage } from "@/hooks/useAssets";

function UploadButton() {
  const { uploadImage } = useUploadImage();

  const handleUpload = async (file: File) => {
    try {
      const result = await uploadImage(file);
      console.log("Uploaded:", result.files[0].url);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <input
      type="file"
      onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
    />
  );
}
```

#### `useDeleteAsset`

```typescript
import { useDeleteAsset } from "@/hooks/useAssets";

function DeleteButton({ filename }: { filename: string }) {
  const deleteAsset = useDeleteAsset();

  const handleDelete = async () => {
    try {
      await deleteAsset.mutateAsync({ filename });
      console.log("Deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

### ImagePicker Component

Complete component dengan upload + gallery selection.

```typescript
import { ImagePicker } from "@/components/shared/ImagePicker";
import { useForm } from "react-hook-form";

function ComponentForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      imageUrl: ""
    }
  });

  return (
    <form>
      <input {...form.register("name")} />
      
      <ImagePicker
        value={form.watch("imageUrl")}
        onChange={(url) => form.setValue("imageUrl", url)}
        label="Product Image"
      />
      
      <button type="submit">Save</button>
    </form>
  );
}
```

**Features:**
- ✅ Upload new images (drag & drop ready)
- ✅ Browse gallery with search
- ✅ Preview selected image
- ✅ Delete images from gallery
- ✅ Responsive design
- ✅ Loading states

---

## 🔄 Data Flow

### Upload Flow

```
1. User selects file in frontend
   ↓
2. FormData sent to POST /api/upload/image (Fastify)
   ↓
3. Fastify validates file (type, size)
   ↓
4. Generate unique filename
   ↓
5. Save file to uploads/images/
   ↓
6. Call createAsset() service
   ↓
7. Prisma saves metadata to Asset table
   ↓
8. Return URL to frontend
   ↓
9. Frontend updates form field with URL
   ↓
10. When form submitted, imageUrl saved to Component
```

### List Flow

```
1. Frontend calls useListAssets()
   ↓
2. tRPC query: assets.list
   ↓
3. listAssets() service queries database
   ↓
4. Prisma returns assets with filtering/sorting
   ↓
5. tRPC returns data to frontend
   ↓
6. Frontend displays gallery
```

### Delete Flow

```
1. User clicks delete button
   ↓
2. Frontend calls useDeleteAsset()
   ↓
3. tRPC mutation: assets.delete
   ↓
4. deleteAsset() service:
   - Find asset in database
   - Delete file from filesystem
   - Delete record from database
   ↓
5. tRPC invalidates assets.list cache
   ↓
6. Frontend refetches gallery
```

---

## 📁 File Structure

```
pc-builder/
├── packages/
│   ├── db/
│   │   ├── prisma/
│   │   │   ├── schema.prisma          # Asset + Component models
│   │   │   └── migrations/
│   │   │       └── *_add_assets_table/
│   │   └── src/
│   │       ├── index.ts               # Export AssetType enum
│   │       └── generated/schemas/     # Zod schemas
│   │
│   └── api/
│       └── src/
│           ├── models/
│           │   └── asset.ts           # Zod validation schemas
│           ├── services/
│           │   └── assets/
│           │       ├── create.service.ts
│           │       ├── list.service.ts
│           │       ├── get.service.ts
│           │       └── delete.service.ts
│           └── routers/
│               ├── assets.router.ts   # tRPC router
│               └── app.router.ts      # Main router (includes assets)
│
└── apps/
    ├── server/
    │   ├── uploads/
    │   │   ├── images/               # Uploaded files
    │   │   └── .gitignore
    │   └── src/
    │       ├── routes/
    │       │   └── upload.ts         # Fastify upload routes
    │       ├── utils/
    │       │   └── file-validation.ts
    │       └── index.ts              # Register routes
    │
    └── admin/
        └── app/
            ├── hooks/
            │   └── useAssets.ts      # React hooks
            └── components/
                ├── shared/
                │   └── ImagePicker.tsx
                └── components/
                    └── ComponentFormExample.tsx
```

---

## 🔒 Security

### File Validation

1. **Type Whitelist**
   ```typescript
   const ALLOWED_IMAGE_TYPES = [
     "image/jpeg",
     "image/png",
     "image/webp",
     "image/gif",
     "image/svg+xml"
   ];
   ```

2. **Size Limit**
   ```typescript
   const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
   ```

3. **Filename Sanitization**
   ```typescript
   // Remove special chars, prevent directory traversal
   const safeName = path.basename(filename)
     .replace(/[^a-z0-9._-]/gi, '-');
   ```

4. **Unique Filenames**
   ```typescript
   // Format: {timestamp}-{randomHash}-{sanitizedName}.{ext}
   const uniqueName = `${Date.now()}-${randomBytes(8).toString('hex')}-${safeName}`;
   ```

5. **Path Validation**
   - All paths use `path.basename()` to prevent directory traversal
   - Files saved only to designated `uploads/images/` directory

---

## 🧪 Testing

### Manual Testing

#### 1. Upload Image
```bash
curl -X POST http://localhost:4000/api/upload/image \
  -F "file=@./test-image.jpg"
```

#### 2. List Images (tRPC)
```typescript
// In React component or test
const { data } = trpc.assets.list.useQuery({ type: "IMAGE" });
```

#### 3. Delete Image (tRPC)
```typescript
await trpc.assets.delete.mutate({ filename: "xyz.jpg" });
```

### Test Script
```bash
cd apps/server
./test-upload.sh
```

### Browser Test
Open `apps/server/test-upload.html` in browser.

---

## 🚀 Deployment Considerations

### Production Checklist

- [ ] **Environment Variables**
  ```env
  DATABASE_URL=...
  NODE_ENV=production
  ```

- [ ] **File Storage**
  - Consider using cloud storage (S3, Cloudinary) instead of local filesystem
  - Update `createAsset()` to save to S3 and store S3 URL

- [ ] **CORS**
  - Update allowed origins in `apps/server/src/index.ts`
  - Match your production domain

- [ ] **File Size Limits**
  - Adjust based on your needs
  - Consider CDN for serving images

- [ ] **Authentication**
  - Add auth middleware to upload/delete endpoints
  - Protect tRPC procedures

- [ ] **Rate Limiting**
  - Add rate limiting to upload endpoint
  - Prevent abuse

### Cloud Storage Integration

Example with AWS S3:

```typescript
// packages/api/src/services/assets/create.service.ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadToS3(file: Buffer, filename: string) {
  const s3 = new S3Client({ region: "us-east-1" });
  
  await s3.send(new PutObjectCommand({
    Bucket: "my-bucket",
    Key: `uploads/${filename}`,
    Body: file,
    ContentType: mimetype
  }));
  
  return `https://my-bucket.s3.amazonaws.com/uploads/${filename}`;
}
```

---

## 📊 Performance

### Optimization Tips

1. **Pagination**
   - Always use `limit` and `offset` for large datasets
   - Default limit: 50, max: 100

2. **Caching**
   - tRPC queries cached automatically
   - Set `staleTime` for asset list:
     ```typescript
     useListAssets({ ... }, { staleTime: 30000 })
     ```

3. **Image Optimization**
   - Consider adding image resize/compress on upload
   - Use lazy loading for gallery
   - Generate thumbnails for preview

4. **Database Indexes**
   - Indexes on `type` and `createdAt` already added
   - Consider adding index on `filename` if searching by filename

---

## 🐛 Troubleshooting

### Common Issues

#### Upload fails with "File too large"
- Check `MAX_FILE_SIZE` in `file-validation.ts`
- Check Fastify multipart limits in `apps/server/src/index.ts`

#### Images not showing in gallery
- Check database connection
- Verify Asset records created: `SELECT * FROM Asset;`
- Check file exists in `uploads/images/`

#### CORS errors
- Update CORS origins in `apps/server/src/index.ts`
- Ensure frontend URL matches allowed origins

#### Delete fails
- Check file permissions on `uploads/` directory
- Verify asset exists in database
- Check server logs for error details

---

## 📝 Migration Guide

If you have existing images not in database:

```typescript
// Script to migrate existing files to database
import { readdir } from "fs/promises";
import { stat } from "fs/promises";
import { createAsset } from "@repo/api/src/services/assets/create.service";

const UPLOAD_DIR = "./uploads/images";

async function migrateExistingFiles() {
  const files = await readdir(UPLOAD_DIR);
  
  for (const filename of files) {
    const filepath = path.join(UPLOAD_DIR, filename);
    const stats = await stat(filepath);
    
    await createAsset({
      filename,
      originalFilename: filename,
      mimetype: "image/jpeg", // Adjust based on actual type
      size: stats.size,
      url: `http://localhost:4000/uploads/images/${filename}`,
      path: filepath,
      type: "IMAGE"
    });
    
    console.log(`Migrated: ${filename}`);
  }
}

migrateExistingFiles();
```

---

## 🔮 Future Enhancements

- [ ] Image optimization (resize, compress)
- [ ] Multiple asset types (documents, videos)
- [ ] Folder/album organization
- [ ] Bulk upload
- [ ] Image editing (crop, rotate)
- [ ] CDN integration
- [ ] Asset usage tracking (which components use which images)
- [ ] Automatic cleanup of unused assets
- [ ] Image search by visual similarity
- [ ] Support for external URLs (not just uploads)

---

## 📚 References

- [Fastify Multipart Plugin](https://github.com/fastify/fastify-multipart)
- [Prisma Documentation](https://www.prisma.io/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [React Hook Form](https://react-hook-form.com/)
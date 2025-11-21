# Upload Feature - Quick Start Guide

Panduan cepat untuk menggunakan fitur upload file/gambar yang terintegrasi dengan database.

## 🚀 Quick Start

### 1. Run Migration

```bash
cd packages/db
pnpm prisma migrate dev
```

### 2. Start Server

```bash
cd apps/server
pnpm dev
```

Server akan jalan di `http://localhost:4000`

### 3. Test Upload

#### Via cURL:
```bash
curl -X POST http://localhost:4000/api/upload/image \
  -F "file=@/path/to/your/image.jpg"
```

#### Via Browser:
Buka `apps/server/test-upload.html` di browser

---

## 💻 Usage in React/Next.js

### 1. Import Hooks

```typescript
import { useListAssets, useUploadImage, useDeleteAsset } from "@/hooks/useAssets";
```

### 2. List Images

```typescript
function Gallery() {
  const { data, isLoading } = useListAssets({
    type: "IMAGE",
    limit: 20
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-4 gap-4">
      {data?.assets.map(asset => (
        <img key={asset.id} src={asset.url} alt={asset.originalFilename} />
      ))}
    </div>
  );
}
```

### 3. Upload Image

```typescript
function Uploader() {
  const { uploadImage } = useUploadImage();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadImage(file);
      console.log("Uploaded URL:", result.files[0].url);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return <input type="file" onChange={handleUpload} />;
}
```

### 4. Use ImagePicker Component

```typescript
import { ImagePicker } from "@/components/shared/ImagePicker";
import { useForm } from "react-hook-form";

function ProductForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      imageUrl: ""
    }
  });

  return (
    <form>
      <input {...form.register("name")} placeholder="Product name" />
      
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

---

## 🔌 API Endpoints

### Upload (Fastify)

```http
POST /api/upload/image
Content-Type: multipart/form-data

Response:
{
  "success": true,
  "files": [
    {
      "filename": "1700000000-abc123-image.jpg",
      "url": "http://localhost:4000/uploads/images/...",
      "size": 123456,
      "mimetype": "image/jpeg"
    }
  ]
}
```

### List (tRPC)

```typescript
// Via React Hook
const { data } = trpc.assets.list.useQuery({
  type: "IMAGE",
  search: "product",
  limit: 20,
  sortBy: "createdAt",
  sortOrder: "desc"
});

// Response:
{
  assets: Asset[],
  pagination: {
    total: 100,
    limit: 20,
    offset: 0,
    hasMore: true
  }
}
```

### Delete (tRPC)

```typescript
const deleteAsset = useDeleteAsset();

await deleteAsset.mutateAsync({
  filename: "image.jpg"
  // or
  id: 123
});
```

---

## 📂 Where Files are Stored

- **Filesystem**: `apps/server/uploads/images/`
- **Database**: `Asset` table in MySQL
- **URL**: `http://localhost:4000/uploads/images/{filename}`

---

## 🎯 Common Use Cases

### Use Case 1: Component with Image

```typescript
import { ImagePicker } from "@/components/shared/ImagePicker";

function ComponentForm() {
  const [formData, setFormData] = useState({
    name: "RTX 4090",
    type: "GPU",
    price: 1599,
    imageUrl: ""  // <-- URL from upload
  });

  return (
    <form>
      <ImagePicker
        value={formData.imageUrl}
        onChange={(url) => setFormData({ ...formData, imageUrl: url })}
      />
      
      {/* When submitted, imageUrl is saved to Component table */}
      <button onClick={() => createComponent(formData)}>
        Save
      </button>
    </form>
  );
}
```

### Use Case 2: Gallery Browser

```typescript
function ImageGallery() {
  const [search, setSearch] = useState("");
  const { data } = useListAssets({ 
    type: "IMAGE", 
    search 
  });

  return (
    <div>
      <input 
        placeholder="Search..." 
        onChange={(e) => setSearch(e.target.value)}
      />
      
      <div className="grid grid-cols-4 gap-4">
        {data?.assets.map(asset => (
          <div key={asset.id}>
            <img src={asset.url} />
            <p>{asset.originalFilename}</p>
            <p>{formatFileSize(asset.size)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Use Case 3: Bulk Upload

```typescript
function BulkUploader() {
  const { uploadImage } = useUploadImage();
  const [uploading, setUploading] = useState(false);

  const handleBulkUpload = async (files: FileList) => {
    setUploading(true);
    try {
      const result = await uploadImage(Array.from(files));
      console.log(`Uploaded ${result.files.length} files`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <input
      type="file"
      multiple
      onChange={(e) => e.target.files && handleBulkUpload(e.target.files)}
      disabled={uploading}
    />
  );
}
```

---

## 🔒 File Constraints

- **Max size**: 5MB per file
- **Allowed types**: JPG, PNG, WebP, GIF, SVG
- **Max files per request**: 10 files
- **Storage**: Local filesystem (production: consider S3)

---

## 📝 Database Schema

```sql
-- Asset table stores file metadata
CREATE TABLE Asset (
  id INT PRIMARY KEY AUTO_INCREMENT,
  filename VARCHAR(255) UNIQUE,
  originalFilename VARCHAR(255),
  mimetype VARCHAR(100),
  size INT,
  type ENUM('IMAGE', 'DOCUMENT', 'OTHER') DEFAULT 'IMAGE',
  url VARCHAR(500),
  path VARCHAR(500),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_createdAt (createdAt)
);

-- Component table now has imageUrl field
ALTER TABLE Component ADD COLUMN imageUrl VARCHAR(500);
```

---

## 🧪 Testing

### Test Upload via cURL

```bash
curl -X POST http://localhost:4000/api/upload/image \
  -F "file=@./test.jpg"
```

### Test List via tRPC

```typescript
// In React component
const { data } = trpc.assets.list.useQuery({ type: "IMAGE" });
console.log(data.assets);
```

### Run Test Script

```bash
cd apps/server
./test-upload.sh
```

### Test in Browser

```bash
# Open test page
open apps/server/test-upload.html
```

---

## 📚 Full Documentation

- **Complete API Docs**: `apps/server/UPLOAD_API.md`
- **Integration Guide**: `apps/server/UPLOAD_INTEGRATION.md`

---

## 💡 Tips

1. **Always validate on frontend**: Check file size/type before upload
2. **Use ImagePicker component**: Pre-built with gallery + upload
3. **Handle errors**: Show user-friendly messages
4. **Loading states**: Show spinner during upload
5. **Preview images**: Let users see what they're uploading
6. **Search functionality**: Use `search` param in `useListAssets`

---

## 🐛 Troubleshooting

### Upload fails
- Check server is running on port 4000
- Verify file size < 5MB
- Check file type is allowed (JPG, PNG, WebP, GIF, SVG)

### Images not showing
- Check database connection
- Verify Asset records: `SELECT * FROM Asset;`
- Check files exist in `apps/server/uploads/images/`

### CORS errors
- Update CORS origins in `apps/server/src/index.ts`
- Add your frontend URL to allowed origins

---

## 🚀 Production Deployment

For production, consider:

1. **Use cloud storage** (AWS S3, Cloudinary)
2. **Add authentication** to upload/delete endpoints
3. **Implement rate limiting**
4. **Add CDN** for serving images
5. **Enable image optimization** (resize, compress)

Example S3 integration in docs: `UPLOAD_INTEGRATION.md`

---

**Ready to go!** 🎉

Start uploading images and using them in your components!
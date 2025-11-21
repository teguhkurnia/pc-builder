# Upload API Documentation

API untuk upload dan management file/gambar di PC Builder server.

## 📋 Overview

Server menyediakan endpoints untuk:
- ✅ Upload single/multiple images
- ✅ List semua uploaded images
- ✅ Delete uploaded images
- ✅ Serve static files

## 🔧 Configuration

### File Constraints
- **Max file size**: 5MB per file
- **Max files per request**: 10 files
- **Allowed types**: JPG, PNG, WebP, GIF, SVG
- **Storage location**: `apps/server/uploads/images/`

### Base URL
```
http://localhost:4000
```

---

## 📡 API Endpoints

### 1. Upload Image(s)

Upload single atau multiple images.

**Endpoint**: `POST /api/upload/image`

**Content-Type**: `multipart/form-data`

**Request Body**:
```
FormData dengan field "file" atau multiple files
```

**cURL Example**:
```bash
# Single file
curl -X POST http://localhost:4000/api/upload/image \
  -F "file=@/path/to/image.jpg"

# Multiple files
curl -X POST http://localhost:4000/api/upload/image \
  -F "file=@/path/to/image1.jpg" \
  -F "file=@/path/to/image2.png"
```

**JavaScript Example**:
```javascript
// Single file
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:4000/api/upload/image', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
console.log(result);
```

**Response Success** (200):
```json
{
  "success": true,
  "message": "Successfully uploaded 1 file(s)",
  "files": [
    {
      "filename": "1704123456-a1b2c3d4-product-image.jpg",
      "originalFilename": "product-image.jpg",
      "url": "http://localhost:4000/uploads/images/1704123456-a1b2c3d4-product-image.jpg",
      "size": 245678,
      "mimetype": "image/jpeg",
      "uploadedAt": "2024-01-01T12:34:56.789Z"
    }
  ]
}
```

**Response Error** (400):
```json
{
  "success": false,
  "error": "Invalid file type. Allowed types: image/jpeg, image/jpg, image/png, image/webp, image/gif, image/svg+xml"
}
```

**Response Error** (400):
```json
{
  "success": false,
  "error": "File size exceeds maximum allowed size of 5 MB"
}
```

---

### 2. List All Images

Mendapatkan daftar semua uploaded images.

**Endpoint**: `GET /api/upload/images`

**cURL Example**:
```bash
curl http://localhost:4000/api/upload/images
```

**JavaScript Example**:
```javascript
const response = await fetch('http://localhost:4000/api/upload/images');
const result = await response.json();
console.log(result.images);
```

**Response Success** (200):
```json
{
  "success": true,
  "images": [
    {
      "filename": "1704123456-a1b2c3d4-gpu-rtx4090.jpg",
      "url": "http://localhost:4000/uploads/images/1704123456-a1b2c3d4-gpu-rtx4090.jpg",
      "size": 345678,
      "createdAt": "2024-01-01T12:34:56.789Z"
    },
    {
      "filename": "1704123400-e5f6g7h8-cpu-i9.png",
      "url": "http://localhost:4000/uploads/images/1704123400-e5f6g7h8-cpu-i9.png",
      "size": 123456,
      "createdAt": "2024-01-01T12:30:00.000Z"
    }
  ],
  "total": 2
}
```

---

### 3. Delete Image

Menghapus uploaded image by filename.

**Endpoint**: `DELETE /api/upload/image/:filename`

**Parameters**:
- `filename` (path): Nama file yang akan dihapus

**cURL Example**:
```bash
curl -X DELETE http://localhost:4000/api/upload/image/1704123456-a1b2c3d4-product-image.jpg
```

**JavaScript Example**:
```javascript
const filename = '1704123456-a1b2c3d4-product-image.jpg';
const response = await fetch(`http://localhost:4000/api/upload/image/${filename}`, {
  method: 'DELETE',
});
const result = await response.json();
```

**Response Success** (200):
```json
{
  "success": true,
  "message": "File 1704123456-a1b2c3d4-product-image.jpg deleted successfully"
}
```

**Response Error** (404):
```json
{
  "success": false,
  "message": "File not found"
}
```

---

### 4. Access Static Files

Mengakses uploaded images via static URL.

**Endpoint**: `GET /uploads/images/:filename`

**Example**:
```html
<!-- Direct access in HTML -->
<img src="http://localhost:4000/uploads/images/1704123456-a1b2c3d4-product-image.jpg" alt="Product">
```

**Browser URL**:
```
http://localhost:4000/uploads/images/1704123456-a1b2c3d4-product-image.jpg
```

---

## 🎯 Frontend Integration Examples

### React Component - Upload Image

```tsx
import { useState } from 'react';

function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const response = await fetch('http://localhost:4000/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success && result.files?.[0]) {
        setImageUrl(result.files[0].url);
        console.log('Uploaded URL:', result.files[0].url);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {imageUrl && (
        <div>
          <p>Upload successful!</p>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '300px' }} />
          <p>URL: {imageUrl}</p>
        </div>
      )}
    </div>
  );
}
```

### React Hook Form Integration

```tsx
import { useForm } from 'react-hook-form';

interface ComponentFormData {
  name: string;
  imageUrl: string;
  // ... other fields
}

function ComponentForm() {
  const { register, setValue, watch } = useForm<ComponentFormData>();
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const response = await fetch('http://localhost:4000/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.success && result.files?.[0]) {
        // Set the URL to the form field
        setValue('imageUrl', result.files[0].url);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const imageUrl = watch('imageUrl');

  return (
    <form>
      <input {...register('name')} placeholder="Component name" />
      
      <div>
        <label>Component Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
        />
        {uploading && <p>Uploading...</p>}
        {imageUrl && (
          <img src={imageUrl} alt="Preview" style={{ maxWidth: '200px' }} />
        )}
      </div>

      {/* Hidden input to store the URL */}
      <input type="hidden" {...register('imageUrl')} />
      
      <button type="submit">Save Component</button>
    </form>
  );
}
```

### Image Gallery Picker

```tsx
import { useEffect, useState } from 'react';

interface UploadedImage {
  filename: string;
  url: string;
  size: number;
  createdAt: string;
}

function ImageGalleryPicker({ onSelect }: { onSelect: (url: string) => void }) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/upload/images');
      const result = await response.json();
      if (result.success) {
        setImages(result.images);
      }
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/upload/image/${filename}`,
        { method: 'DELETE' }
      );
      const result = await response.json();
      if (result.success) {
        // Reload images
        loadImages();
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  if (loading) return <p>Loading images...</p>;

  return (
    <div className="grid grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image.filename} className="border rounded p-2">
          <img
            src={image.url}
            alt={image.filename}
            className="w-full h-32 object-cover cursor-pointer"
            onClick={() => onSelect(image.url)}
          />
          <p className="text-xs truncate">{image.filename}</p>
          <button
            onClick={() => handleDelete(image.filename)}
            className="text-red-500 text-xs"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔒 Security Features

1. **File Type Validation**: Hanya menerima image files (jpg, png, webp, gif, svg)
2. **File Size Limit**: Maximum 5MB per file
3. **Filename Sanitization**: Mencegah directory traversal attacks
4. **Unique Filenames**: Menggunakan timestamp + random hash untuk mencegah conflicts
5. **Path Validation**: Sanitize user input untuk mencegah path manipulation

---

## 🧪 Testing

### Test Upload
```bash
# Prepare test image
curl -X POST http://localhost:4000/api/upload/image \
  -F "file=@./test-image.jpg"
```

### Test List
```bash
curl http://localhost:4000/api/upload/images
```

### Test Delete
```bash
curl -X DELETE http://localhost:4000/api/upload/image/[FILENAME]
```

### Test Access
```bash
curl http://localhost:4000/uploads/images/[FILENAME] --output downloaded.jpg
```

---

## 📝 Notes

1. **Storage**: Files disimpan di `apps/server/uploads/images/` (tidak masuk git)
2. **Filename Format**: `{timestamp}-{randomHash}-{sanitizedOriginalName}.{ext}`
3. **URL Format**: `http://localhost:4000/uploads/images/{filename}`
4. **Production**: Untuk production, consider menggunakan cloud storage (S3, Cloudinary, etc.)

---

## 🚀 Next Steps

- [ ] Add pagination untuk image list
- [ ] Add search/filter untuk image gallery
- [ ] Add image optimization (resize, compress)
- [ ] Add cloud storage integration (S3, Cloudinary)
- [ ] Add authentication untuk upload/delete endpoints
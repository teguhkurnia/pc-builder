# Image Gallery Picker Component

Component reusable untuk memilih gambar dari gallery atau upload gambar baru menggunakan Sheet (slide-in panel).

## Location

`apps/admin/app/components/image-gallery-picker/index.tsx`

Component ini berada di folder global `app/components` sehingga dapat digunakan di berbagai page/module.

## Features

- ✅ **Gallery Tab**: Browse images dari database
- ✅ **Upload Tab**: Upload gambar baru langsung dari picker
- ✅ **Search**: Search by filename
- ✅ **Preview**: Preview gambar dengan hover effect
- ✅ **Selected State**: Visual indicator untuk gambar yang dipilih
- ✅ **Multi-upload**: Upload multiple files sekaligus
- ✅ **Auto-select**: Otomatis select gambar setelah upload
- ✅ **Auto-refresh**: Gallery otomatis refresh setelah upload
- ✅ **File validation**: Hanya accept image files
- ✅ **Responsive**: Grid layout yang responsive
- ✅ **Type-safe**: Full TypeScript support

## Usage

### Basic Usage

```tsx
import { useState } from "react";
import ImageGalleryPicker from "@/components/image-gallery-picker";

function MyComponent() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>();

  return (
    <>
      <Button onClick={() => setGalleryOpen(true)}>
        Select Image
      </Button>

      <ImageGalleryPicker
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        onSelect={(imageUrl) => setSelectedImage(imageUrl)}
        selectedImage={selectedImage}
      />
    </>
  );
}
```

### With React Hook Form

```tsx
import { useForm } from "react-hook-form";
import ImageGalleryPicker from "@/components/image-gallery-picker";

function FormComponent() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const { setValue, watch } = useForm();
  const imageUrl = watch("imageUrl");

  return (
    <ImageGalleryPicker
      open={galleryOpen}
      onOpenChange={setGalleryOpen}
      onSelect={(url) => setValue("imageUrl", url)}
      selectedImage={imageUrl}
    />
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `open` | `boolean` | Yes | Controls sheet visibility |
| `onOpenChange` | `(open: boolean) => void` | Yes | Callback when sheet open state changes |
| `onSelect` | `(imageUrl: string) => void` | Yes | Callback when image is selected and confirmed |
| `selectedImage` | `string \| undefined` | No | Currently selected image URL (for highlight) |

## Component Structure

### Tabs

1. **Gallery Tab**
   - Search bar untuk filter images
   - Grid layout gambar-gambar yang ada
   - Click to select
   - Pagination info

2. **Upload Tab**
   - Drag & drop area (click to browse)
   - File list dengan preview
   - Remove individual files
   - Upload button

### States

```tsx
const [activeTab, setActiveTab] = useState<"gallery" | "upload">("gallery");
const [isUploading, setIsUploading] = useState(false);
const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
const [selectedImageUrl, setSelectedImageUrl] = useState<string | undefined>();
```

## API Integration

### Gallery - tRPC Query

```typescript
api.assets.list.useQuery({
  type: "IMAGE",
  search: searchQuery || undefined,
  sortBy: "createdAt",
  sortOrder: "desc",
  limit: 50,
  offset: 0
}, {
  enabled: open // Only fetch when sheet is open
});
```

### Upload - REST API

```typescript
const formData = new FormData();
selectedFiles.forEach(file => formData.append("files", file));

const response = await fetch("http://localhost:4000/api/upload/image", {
  method: "POST",
  body: formData,
});
```

**Response:**
```typescript
{
  success: boolean;
  message?: string;
  files?: Array<{
    filename: string;
    originalFilename: string;
    url: string;
    size: number;
    mimetype: string;
    uploadedAt: string;
  }>;
  error?: string;
}
```

## Features Detail

### 1. Gallery Tab

**Search:**
- Real-time search by filename
- Clear visual feedback
- Empty state saat tidak ada hasil

**Image Grid:**
- Responsive: 2 kolom (mobile), 3 kolom (desktop)
- Square aspect ratio
- Hover effects:
  - Scale up animation
  - Shadow
  - Overlay dengan filename & size

**Selection:**
- Click to select
- Visual indicator (checkmark icon)
- Border highlight
- Can change selection anytime

### 2. Upload Tab

**File Selection:**
- Click area to browse files
- Multiple file selection
- Automatic image type filtering
- Visual feedback when files selected

**File List:**
- Shows all selected files
- Display filename & size
- Remove button per file
- Scroll untuk banyak file

**Upload Process:**
- Upload button dengan counter
- Loading state saat uploading
- Auto-refresh gallery after upload
- Auto-select first uploaded image
- Auto-switch ke gallery tab
- Clear upload state after success

**Error Handling:**
- Alert untuk upload error
- Console log untuk debugging
- Tidak clear files saat error

## Flow Diagram

```
User Opens Picker
       ↓
   [Gallery Tab]  ←→  [Upload Tab]
       ↓                    ↓
   Browse Images      Select Files
       ↓                    ↓
   Click Image        Upload Files
       ↓                    ↓
   [Selected] ←──────  Auto-Select
       ↓
   Click "Select Image"
       ↓
   onSelect(imageUrl)
       ↓
   Sheet Closes
```

## Styling

### Tailwind Classes

**Sheet:**
- `sm:max-w-2xl` - Max width untuk desktop
- `w-full` - Full width untuk mobile

**Tabs:**
- Grid layout untuk tab triggers
- Icons untuk visual clarity

**Gallery Grid:**
- `grid-cols-2 md:grid-cols-3` - Responsive columns
- `aspect-square` - Square images
- `hover:scale-105` - Zoom on hover
- `ring-2 ring-primary/20` - Selected indicator

**Upload Area:**
- `border-dashed` - Dashed border untuk drop zone
- `border-primary/50 bg-primary/5` - Active state
- `hover:border-primary/50` - Hover state

## Example Integration

### Component Modal Integration

```tsx
// State
const [galleryOpen, setGalleryOpen] = useState(false);
const [selectedImage, setSelectedImage] = useState<string | undefined>();

// Preview Area
{selectedImage ? (
  <div className="relative w-full aspect-video rounded-lg border overflow-hidden group">
    <Image src={selectedImage} alt="Product" fill className="object-cover" />
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100">
      <Button onClick={() => setGalleryOpen(true)}>Change</Button>
      <Button onClick={() => setSelectedImage(undefined)}>Remove</Button>
    </div>
  </div>
) : (
  <Button onClick={() => setGalleryOpen(true)}>
    <ImageIcon className="h-8 w-8" />
    Select from Gallery
  </Button>
)}

// Picker
<ImageGalleryPicker
  open={galleryOpen}
  onOpenChange={setGalleryOpen}
  onSelect={(url) => {
    setSelectedImage(url);
    setValue("imageUrl", url);
  }}
  selectedImage={selectedImage}
/>
```

## Dependencies

- `@trpc/react-query` - API data fetching
- `@repo/ui` - UI components
  - Sheet
  - Button
  - Input
  - ScrollArea
  - Tabs
- `next/image` - Optimized image rendering
- `lucide-react` - Icons
- Native `FormData` & `fetch` - File upload

## File Size Limits

Sesuai server configuration:
- Max file size: 10MB per file
- Supported formats: PNG, JPG, GIF, WebP
- Multiple files: Unlimited (dalam batas wajar)

## Performance Optimizations

1. **Lazy Loading**: Query hanya jalan saat sheet open
2. **Image Optimization**: Next.js Image component
3. **Auto Cleanup**: Reset state saat sheet close
4. **Efficient Refetch**: Hanya refetch setelah upload success
5. **File Type Filter**: Filter di client sebelum upload

## Error Handling

### Network Errors
```typescript
try {
  const response = await fetch(...);
  if (!response.ok) throw new Error("Upload failed");
} catch (error) {
  alert("Failed to upload images. Please try again.");
}
```

### File Validation
```typescript
const imageFiles = Array.from(files).filter(file => 
  file.type.startsWith("image/")
);
```

### Empty States
- No images in gallery
- No search results
- Failed to load images
- No files selected

## Browser Compatibility

- Modern browsers dengan FormData support
- File API support
- ES6+ features
- CSS Grid support

## Accessibility

- Keyboard navigation untuk tabs
- ARIA labels dari shadcn/ui components
- Focus management
- Screen reader friendly

## Future Improvements

- [ ] Toast notifications (instead of alert)
- [ ] Drag & drop untuk upload area
- [ ] Image preview modal (full size)
- [ ] Crop/resize before upload
- [ ] Progress bar untuk upload
- [ ] Delete image dari gallery
- [ ] Pagination untuk gallery (load more)
- [ ] Image metadata editor
- [ ] Folder/category organization
- [ ] Bulk selection & operations
- [ ] Image compression before upload
- [ ] WebP conversion
- [ ] CDN URL support

## Troubleshooting

### Upload tidak jalan
- Cek server running di localhost:4000
- Cek CORS configuration
- Cek file size limits
- Cek network tab di DevTools

### Gallery tidak muncul
- Cek tRPC connection
- Cek database connection
- Cek console untuk errors

### Images tidak tampil
- Cek image URLs valid
- Cek CORS untuk image serving
- Cek Next.js image domains config
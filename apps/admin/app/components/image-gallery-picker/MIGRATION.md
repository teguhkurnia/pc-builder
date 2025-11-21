# Migration Guide: Image Gallery Picker

## Overview

Image Gallery Picker telah dipindahkan dari folder component-specific ke folder global untuk meningkatkan reusability di seluruh aplikasi.

## Changes Summary

### Location Change

**Before:**
```
apps/admin/app/components/component/image-gallery-picker/index.tsx
```

**After:**
```
apps/admin/app/components/image-gallery-picker/index.tsx
```

### New Features Added

✅ **Upload Tab** - Upload gambar baru langsung dari picker
✅ **Multi-file Upload** - Upload multiple files sekaligus
✅ **Auto-refresh Gallery** - Gallery otomatis refresh setelah upload
✅ **Auto-select** - Otomatis select gambar pertama setelah upload
✅ **File Preview** - Preview files sebelum upload
✅ **File Management** - Remove individual files sebelum upload

## Migration Steps

### Step 1: Update Import Path

**Old Import:**
```tsx
import ImageGalleryPicker from "../image-gallery-picker";
// atau
import ImageGalleryPicker from "@/components/component/image-gallery-picker";
```

**New Import:**
```tsx
// Relative path (dari component folder)
import ImageGalleryPicker from "../../image-gallery-picker";

// Absolute path (recommended)
import ImageGalleryPicker from "@/components/image-gallery-picker";
```

### Step 2: Update Component Usage (No Breaking Changes)

Props dan penggunaan component **TIDAK BERUBAH**. Semua existing code akan tetap berfungsi:

```tsx
// ✅ This still works exactly the same
<ImageGalleryPicker
  open={galleryOpen}
  onOpenChange={setGalleryOpen}
  onSelect={(imageUrl) => setSelectedImage(imageUrl)}
  selectedImage={selectedImage}
/>
```

### Step 3: Optional - Leverage New Features

Setelah migrasi, users dapat menggunakan fitur upload baru tanpa perubahan code. Upload tab akan otomatis tersedia di dalam picker.

## File-by-File Migration

### Component Modal

**File:** `apps/admin/app/components/component/modal/index.tsx`

**Before:**
```tsx
import ImageGalleryPicker from "../image-gallery-picker";
```

**After:**
```tsx
import ImageGalleryPicker from "../../image-gallery-picker";
```

**Status:** ✅ Already migrated

### Future Components

For any new components using ImageGalleryPicker:

```tsx
// ✅ Recommended: Absolute import
import ImageGalleryPicker from "@/components/image-gallery-picker";

// ✅ Alternative: Relative import (adjust based on file location)
import ImageGalleryPicker from "../../image-gallery-picker";
```

## API Changes

### No Breaking Changes

All props remain the same:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `open` | `boolean` | Yes | Controls sheet visibility |
| `onOpenChange` | `(open: boolean) => void` | Yes | Callback when sheet closes |
| `onSelect` | `(imageUrl: string) => void` | Yes | Callback when image selected |
| `selectedImage` | `string \| undefined` | No | Currently selected image |

### New Internal Features (No Code Changes Required)

1. **Tabs Component** - Gallery & Upload tabs
2. **File Upload** - Direct upload from picker
3. **Auto-refresh** - Gallery refetches after upload
4. **Auto-select** - First uploaded image auto-selected

## Testing Checklist

After migration, test these scenarios:

- [ ] Open image picker from component modal
- [ ] Search for images in gallery
- [ ] Select an image from gallery
- [ ] Confirm selection works
- [ ] Cancel without selecting
- [ ] Upload new image (new feature)
- [ ] Verify uploaded image appears in gallery
- [ ] Verify uploaded image auto-selected
- [ ] Test with React Hook Form integration
- [ ] Test image preview in modal
- [ ] Test change/remove image buttons

## Benefits of Migration

### 1. Reusability
Component dapat digunakan di berbagai page/module:
- Component management
- Product catalog
- User profiles
- Blog posts
- Settings pages
- Any feature requiring image selection

### 2. Centralized Updates
Single source of truth untuk image picker functionality. Updates benefit semua consumers.

### 3. Consistent UX
Consistent image selection experience across entire application.

### 4. Built-in Upload
Upload functionality tersedia dimana saja component digunakan.

## Example Usage in Different Contexts

### 1. Component Modal (Existing)

```tsx
// apps/admin/app/components/component/modal/index.tsx
import ImageGalleryPicker from "@/components/image-gallery-picker";

function ComponentModal() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>();

  return (
    <>
      <Button onClick={() => setGalleryOpen(true)}>
        Select Image
      </Button>

      <ImageGalleryPicker
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        onSelect={setSelectedImage}
        selectedImage={selectedImage}
      />
    </>
  );
}
```

### 2. Product Page (New)

```tsx
// apps/admin/app/(dashboard)/products/page.tsx
import ImageGalleryPicker from "@/components/image-gallery-picker";

function ProductPage() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [productImage, setProductImage] = useState<string>();

  return (
    <>
      {/* Product form with image */}
      <ImageGalleryPicker
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        onSelect={setProductImage}
        selectedImage={productImage}
      />
    </>
  );
}
```

### 3. Profile Settings (New)

```tsx
// apps/admin/app/(dashboard)/settings/page.tsx
import ImageGalleryPicker from "@/components/image-gallery-picker";

function SettingsPage() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>();

  return (
    <>
      {/* Profile avatar upload */}
      <ImageGalleryPicker
        open={galleryOpen}
        onOpenChange={setGalleryOpen}
        onSelect={setAvatarUrl}
        selectedImage={avatarUrl}
      />
    </>
  );
}
```

## Troubleshooting

### Import Error After Migration

**Error:**
```
Cannot find module '@/components/component/image-gallery-picker'
```

**Solution:**
Update import path to new location:
```tsx
import ImageGalleryPicker from "@/components/image-gallery-picker";
```

### TypeScript Path Alias Issues

If `@/components/...` doesn't work, check `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./app/*"]
    }
  }
}
```

### Component Not Found

Ensure old folder is deleted and new folder exists:

```bash
# Should NOT exist
apps/admin/app/components/component/image-gallery-picker/

# Should exist
apps/admin/app/components/image-gallery-picker/
```

## Rollback Plan (If Needed)

If issues occur, temporary rollback:

1. Copy component back to old location
2. Revert import changes
3. Report issues to team
4. Fix issues in new location
5. Re-migrate

## New Features Guide

### Using Upload Feature

Users can now upload images directly from picker:

1. Open ImageGalleryPicker
2. Click "Upload" tab
3. Click upload area or drag files
4. Review selected files
5. Click "Upload X images"
6. Wait for upload completion
7. Uploaded images appear in gallery
8. First uploaded image auto-selected
9. Click "Select Image" to confirm

### Upload Flow Diagram

```
User Opens Picker
       ↓
   [Upload Tab]
       ↓
   Click Upload Area
       ↓
   Select Files (Multi)
       ↓
   Review File List
       ↓
   Remove Unwanted Files (Optional)
       ↓
   Click "Upload X images"
       ↓
   [Uploading...]
       ↓
   Gallery Auto-refreshes
       ↓
   First Image Auto-selected
       ↓
   Switch to Gallery Tab
       ↓
   Click "Select Image"
```

## Performance Considerations

### Before Migration
- Component loaded only when modal opened
- Single instance in component modal

### After Migration
- Component can be used in multiple places
- Each instance lazy loads when sheet opens
- Shared tRPC cache across instances
- Upload refetches only affected instance

### Optimization Tips

1. **Lazy Load**: Only render picker when needed
```tsx
{galleryOpen && (
  <ImageGalleryPicker ... />
)}
```

2. **Memoize Callbacks**: Prevent unnecessary re-renders
```tsx
const handleSelect = useCallback((url: string) => {
  setImage(url);
}, []);
```

3. **Debounce Search**: Already handled internally
```tsx
// Search is debounced by tRPC query
```

## Support & Resources

- **Documentation**: `apps/admin/app/components/image-gallery-picker/README.md`
- **Examples**: `apps/admin/app/components/image-gallery-picker/example-usage.tsx`
- **Migration Guide**: This file
- **API Docs**: `/packages/api/SERVICES_API.md`

## Timeline

- **Migration Started**: [Current Date]
- **Status**: ✅ Complete
- **Breaking Changes**: None
- **Components Migrated**: 1/1 (Component Modal)
- **New Features Available**: Upload, Multi-file, Auto-select

## Changelog

### Version 2.0.0 (Current)

**Added:**
- Upload tab with direct file upload
- Multi-file selection and upload
- Auto-refresh gallery after upload
- Auto-select first uploaded image
- File preview before upload
- Individual file removal
- Tabs navigation (Gallery/Upload)

**Changed:**
- Component location moved to global `components` folder
- Import path updated

**Fixed:**
- None (No bugs in previous version)

**Migration Required:**
- Update import paths only
- No props or API changes

### Version 1.0.0 (Previous)

**Features:**
- Gallery browsing
- Image search
- Image selection
- Selected state indicator

## Future Enhancements

Planned features for next versions:

- [ ] Toast notifications (replace alert)
- [ ] Drag & drop upload area
- [ ] Upload progress indicator
- [ ] Image cropping before upload
- [ ] Delete image from gallery
- [ ] Pagination/infinite scroll
- [ ] Image metadata editor
- [ ] Bulk operations
- [ ] CDN integration

## Questions?

For questions about migration or new features:
1. Check README.md for usage examples
2. Check example-usage.tsx for code samples
3. Check this migration guide
4. Ask team in Slack #frontend channel
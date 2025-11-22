# PC Builder App 🖥️

Aplikasi web untuk membangun konfigurasi PC secara interaktif dengan pendekatan **step-by-step** dan **automatic compatibility checking**.

## 🎯 Fitur Utama

### Step-by-Step Builder dengan Dependency System
- **8 Langkah Pemilihan Komponen (Urutan Logis):**
  1. ⚡ CPU (Processor) - **Required** - *Base component*
  2. 🔧 Motherboard - **Required** - *Locked until CPU selected, must match socket*
  3. 💾 RAM (Memory) - **Required** - *Locked until Motherboard selected, must match type*
  4. 🎮 GPU (Graphics Card) - *Optional*
  5. 💿 Storage - **Required**
  6. 🔌 PSU (Power Supply) - **Required**
  7. ❄️ Cooling - *Optional* - *Locked until CPU selected, must match socket*
  8. 📦 Case - **Required** - *Locked until Motherboard selected, must match form factor*

### Fitur Lengkap
- ✅ **Smart Compatibility System** - Automatic checking untuk socket, memory type, form factor
- ✅ **Dependency Locking** - Component terkunci sampai dependencies terpenuhi
- ✅ **Required/Optional Indicators** - Visual marking untuk component wajib
- ✅ **Auto-filtering** - Hanya tampilkan component yang compatible
- ✅ **Progress Tracking** - Visual progress bar menampilkan kemajuan build
- ✅ **Step Indicators** - Navigasi mudah antar komponen dengan lock/unlock status
- ✅ **Auto-save** - Build otomatis tersimpan saat memilih komponen
- ✅ **Search Components** - Cari komponen berdasarkan nama di setiap step
- ✅ **Live Price Calculation** - Total harga dihitung otomatis real-time
- ✅ **Skip Steps** - Opsi untuk melewati komponen yang tidak wajib (only optional)
- ✅ **Component Detail Modal** - Modal lengkap dengan image gallery, specifications, dan actions
- ✅ **Build Summary** - Panel ringkasan build dengan semua komponen terpilih (clickable untuk detail)
- ✅ **Responsive Design** - Optimal di desktop, tablet, dan mobile
- ✅ **Dark Mode Support** - Tema terang dan gelap

## 🏗️ Arsitektur

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.9.2
- **API**: tRPC
- **Database**: Prisma + MySQL
- **UI**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query (via tRPC)
- **Icons**: Lucide React

### Struktur Folder
```
apps/builder/
├── app/
│   ├── builder/
│   │   ├── components/
│   │   │   └── component-detail-modal.tsx  # Detail modal component
│   │   └── page.tsx           # Main builder page (step-by-step UI)
│   ├── hooks/
│   │   └── api/
│   │       ├── useBuild.ts    # tRPC hooks untuk Build
│   │       └── useComponent.ts # tRPC hooks untuk Component
│   ├── utils/
│   │   └── api.ts             # tRPC client setup
│   ├── layout.tsx
│   ├── page.tsx               # Homepage (redirect ke /builder)
│   └── globals.css
└── package.json
```

## 🚀 Development

### Prerequisites
```bash
# Install dependencies
pnpm install

# Setup database
cd packages/db
npx prisma migrate dev
npx prisma generate
```

### Run Development Server
```bash
# Di root project
pnpm --filter @repo/builder dev

# Atau dari root dengan turbo
pnpm dev
```

App akan berjalan di: http://localhost:3000

### Build untuk Production
```bash
pnpm --filter @repo/builder build
pnpm --filter @repo/builder start
```

## 📊 Database Schema

### Build Model
```prisma
model Build {
  id            Int         @id @default(autoincrement())
  name          String
  status        BuildStatus @default(DRAFT)
  totalPrice    Float       @default(0)
  
  // Component Relations
  cpuId         Int?
  cpu           Component?  @relation("BuildCPU")
  motherboardId Int?
  motherboard   Component?  @relation("BuildMotherboard")
  ramId         Int?
  ram           Component?  @relation("BuildRAM")
  storageId     Int?
  storage       Component?  @relation("BuildStorage")
  gpuId         Int?
  gpu           Component?  @relation("BuildGPU")
  psuId         Int?
  psu           Component?  @relation("BuildPSU")
  caseId        Int?
  case          Component?  @relation("BuildCase")
  coolingId     Int?
  cooling       Component?  @relation("BuildCooling")
  
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

enum BuildStatus {
  DRAFT      // Build sedang dalam proses
  COMPLETED  // Build selesai dipilih semua komponen
  SAVED      // Build disimpan untuk nanti
}
```

## 🎨 UI/UX Design

### Color Scheme
- **Primary**: Blue (untuk selection & actions)
- **Success**: Green (untuk completed steps)
- **Neutral**: Slate (untuk backgrounds & text)

### Interactive Elements
- **Step Indicators**: 
  - Current step: Blue border & background
  - Completed step: Green border & background with checkmark
  - Locked step: Grey border, lock icon, reduced opacity, disabled
  - Pending step: Neutral border & background
  - Click untuk navigasi langsung ke step tertentu (kecuali locked)
  - Required steps marked with red asterisk (*)

- **Component Cards**:
  - Hover state untuk feedback visual
  - Selected state dengan blue border & badge
  - Compatibility badge (green checkmark) untuk compatibility info
  - Key specifications ditampilkan dengan chip
  - "Details" button muncul on hover untuk membuka modal
  - Click card untuk select component
  - Auto-filtered untuk hanya tampilkan compatible components

- **Component Detail Modal**:
  - Large image preview dengan navigation
  - Multiple image gallery (thumbnails)
  - Complete specifications list dengan scroll
  - Action buttons: Favorite, Copy Link, Open in Tab
  - Select/Remove from build
  - Visual status indicator (selected/not selected)

- **Build Summary Panel**:
  - Click selected component untuk view details
  - Hover effect untuk feedback interaktif
  - Info icon indicator pada component terpilih
  - Lock icon pada locked steps
  - Dependency info untuk locked components ("Needs: CPU, Motherboard")
  - Required marker (*) untuk wajib components

- **Progress Bar**:
  - Animated gradient (blue to purple)
  - Smooth transitions saat progress berubah

- **Info Banner**:
  - Explains compatibility system
  - Required component indicators
  - Lock/unlock mechanism description

## 🔌 API Endpoints (tRPC)

### Builds Router
```typescript
// List all builds
api.builds.list.useQuery(input?: {
  search?: string;
  status?: "DRAFT" | "COMPLETED" | "SAVED";
  sortBy?: "name" | "totalPrice" | "createdAt";
  sortOrder?: "asc" | "desc";
})

// Get single build
api.builds.get.useQuery({ id: number })

// Create new build
api.builds.create.useMutation({
  name: string;
  status?: "DRAFT" | "COMPLETED" | "SAVED";
  cpuId?: number;
  motherboardId?: number;
  // ... other component IDs
})

// Update build
api.builds.update.useMutation({
  id: number;
  data: {
    name?: string;
    status?: "DRAFT" | "COMPLETED" | "SAVED";
    // ... component IDs
  }
})

// Delete build
api.builds.delete.useMutation({ id: number })
```

### Components Router
```typescript
// List components (with filtering)
api.components.list.useQuery(input?: {
  search?: string;
  type?: ComponentType;
  sortBy?: "name" | "price" | "date";
  sortOrder?: "asc" | "desc";
})
```

## 💡 Cara Penggunaan

### Basic Flow
1. **Homepage** → Auto-redirect ke `/builder`
2. **Read Info Banner** → Understand compatibility system
3. **Start Building** → Mulai dari Step 1 (CPU) - *Required*
4. **Select CPU** → Pilih processor (unlocks Motherboard & Cooling)
5. **Select Motherboard** → Hanya tampil yang compatible dengan CPU socket (unlocks RAM & Case)
6. **Select RAM** → Hanya tampil yang sesuai memory type motherboard
7. **Browse Other Components** → GPU (optional), Storage, PSU
8. **Select Cooling** → Jika diperlukan, hanya tampil yang compatible dengan CPU socket
9. **Select Case** → Hanya tampil yang fit dengan motherboard form factor
10. **Auto-save** → Build otomatis tersimpan dengan status DRAFT
11. **View Details** → Hover card dan klik "Details" untuk spesifikasi lengkap
12. **Review Build** → Klik component di Summary panel untuk review details
13. **Complete** → Klik "Complete Build" (checks all required components)
14. **Build Saved** → Status berubah menjadi COMPLETED

### Tips
- 🔒 **Follow the Order**: Start dengan CPU untuk unlock dependencies
- ⚠️ **Check Compatibility**: Green badge = compatible dengan parts yang dipilih
- ⚡ **Skip Optional Steps**: Hanya optional components bisa di-skip (GPU, Cooling)
- 🔍 **Search**: Gunakan search box untuk menemukan komponen spesifik
- 💡 **Auto-filtering**: Hanya compatible components yang ditampilkan
- 💰 **Price Tracking**: Total price update otomatis saat pilih/ganti komponen
- 📝 **Custom Name**: Edit nama build di panel Summary
- 🎯 **Navigate Smart**: Locked steps tidak bisa diakses sampai dependencies terpenuhi
- 🔎 **View Details**: Hover component card dan klik "Details" untuk info lengkap
- 📋 **Review Selection**: Klik component di Summary panel untuk review spesifikasi
- ❤️ **Favorite Components**: Mark komponen favorit untuk referensi cepat (coming soon)
- 🔗 **Share Component**: Copy link komponen untuk share dengan teman
- 🗑️ **Remove Component**: Hapus komponen dari build via detail modal
- 📌 **Required First**: Pastikan semua required components (*) dipilih sebelum complete

## 🛠️ Customization

### Menambah/Mengurangi Build Steps
Edit array `BUILD_STEPS` di `/app/builder/page.tsx`:

```typescript
const BUILD_STEPS = [
  { key: "cpu", label: "Processor (CPU)", type: "CPU", icon: Cpu },
  // Add your custom steps here
];
```

### Styling
- Tailwind classes dapat dimodifikasi langsung
- Global styles di `globals.css`
- Dark mode support via `dark:` prefix
- Modal menggunakan shadcn/ui Dialog component
- Smooth transitions dan hover effects

## 📦 Dependencies

### Main Dependencies
```json
{
  "@repo/api": "workspace:*",         // tRPC router & services
  "@repo/ui": "workspace:*",          // shadcn/ui components (Dialog, Button, Badge, ScrollArea, dll)
  "@tanstack/react-query": "^5.90.10",
  "@trpc/next": "^11.7.1",
  "lucide-react": "latest",           // Icons (Info, Heart, Copy, Check, dll)
  "next": "^16.0.1",
  "react": "^19.2.0"
}
```

## 🐛 Troubleshooting

### Build tidak tersimpan
- Pastikan server API (`apps/server`) sudah running
- Check console untuk error messages
- Verify database connection di `.env`

### Komponen tidak muncul
- Pastikan ada data di database (via admin panel)
- Check filter & search query
- Verify component type sesuai dengan step

### TypeScript Errors
```bash
# Regenerate Prisma client
cd packages/db
npx prisma generate

# Check types
pnpm check-types
```

## ✨ Recent Updates

### Smart Compatibility System (Latest)
- ✅ **Dependency-based locking** - Components terkunci sampai prerequisites terpenuhi
- ✅ **Auto-filtering** - Hanya tampilkan compatible components
- ✅ **Socket compatibility** - Motherboard & Cooling must match CPU socket
- ✅ **Memory type checking** - RAM must match Motherboard memory type
- ✅ **Form factor validation** - Case must fit Motherboard form factor
- ✅ **Required/Optional marking** - Visual indicators untuk wajib components
- ✅ **Logical component order** - CPU → Motherboard → RAM → ... → Case
- ✅ **Lock indicators** - Lock icons, tooltips, dan dependency info
- ✅ **Smart navigation** - Auto-skip locked steps, prevent invalid access
- ✅ **Validation on complete** - Check all required components before finish
- ✅ **Compatibility badges** - Green checkmark untuk matching specs
- ✅ **Info banner** - Explains system to new users

### Component Detail Modal (Previous)
- ✅ Large image preview dengan navigation controls
- ✅ Multiple image gallery support (thumbnails)
- ✅ Complete specifications dengan scrollable area
- ✅ Action buttons: Favorite, Copy Link, Open in Tab
- ✅ Select/Remove component dari modal
- ✅ Visual feedback untuk actions (copy success, favorite state)
- ✅ Clickable components di Build Summary panel
- ✅ Hover effects dan smooth animations

## 📝 TODO / Future Improvements
- [ ] Multiple images per component (backend support)
- [ ] Favorite components persistence
- [ ] ~~Compatibility checking antar komponen~~ ✅ **DONE**
- [ ] Advanced compatibility (PCIe lanes, M.2 slots, SATA ports)
- [ ] PSU wattage calculation based on selected components
- [ ] Bottleneck detection (CPU-GPU pairing)
- [ ] Build templates (Gaming, Workstation, Budget, dll)
- [ ] Build comparison
- [ ] Share build via URL
- [ ] Print/Export build summary
- [ ] User authentication & saved builds per user
- [ ] Component reviews & ratings
- [ ] Price history tracking & alerts
- [ ] Alternative component suggestions
- [ ] Benchmark scores integration

## 🤝 Contributing
Lihat file `.cursorrules` di root project untuk coding standards dan best practices.

## 📄 License
Private project - PC Builder Platform
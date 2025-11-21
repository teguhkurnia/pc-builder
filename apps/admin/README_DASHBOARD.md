# PC Builder Admin Dashboard

Admin dashboard untuk mengelola komponen PC, produk, dan konfigurasi pada platform PC Builder.

## 🚀 Fitur

### Dashboard Overview
- **Statistik Real-time**: Menampilkan total komponen, produk, harga rata-rata, dan pengguna aktif
- **Distribusi Komponen**: Visualisasi distribusi komponen berdasarkan tipe
- **Activity Feed**: Timeline aktivitas terbaru di platform
- **Quick Actions**: Akses cepat ke fitur-fitur utama

### Manajemen Komponen
- ✅ **CRUD Operations**: Tambah, edit, dan hapus komponen PC
- 🔍 **Search & Filter**: Cari komponen berdasarkan nama dan filter berdasarkan tipe
- 📊 **Table View**: Tampilan tabel lengkap dengan semua informasi komponen
- 🏷️ **Type Badges**: Badge berwarna untuk setiap tipe komponen
- 💾 **JSON Specifications**: Support untuk spesifikasi dalam format JSON

### Tipe Komponen yang Didukung
- **CPU** - Processor
- **MOTHERBOARD** - Motherboard
- **RAM** - Memory
- **STORAGE** - Hard Drive / SSD
- **GPU** - Graphics Card
- **PSU** - Power Supply
- **CASE** - PC Case
- **COOLING** - Cooling System

### Manajemen Produk (Coming Soon)
- Pre-built PC configurations
- Product catalog management

### Settings
- **General Settings**: Konfigurasi aplikasi, currency, timezone
- **Profile Management**: Update profile dan password
- **Notifications**: Atur preferensi notifikasi
- **Appearance**: Theme (light/dark) dan language settings
- **Security**: Two-factor authentication, session timeout

## 🎨 UI Components

Dashboard ini menggunakan **shadcn/ui** components yang ada di `@repo/ui`:

- `Button` - Tombol dengan berbagai variant
- `Card` - Container untuk konten
- `Table` - Tabel data dengan sorting
- `Dialog` - Modal untuk form
- `Input` - Text input fields
- `Select` - Dropdown select
- `Textarea` - Multi-line text input
- `Badge` - Label untuk status/kategori
- `Avatar` - User avatar
- `DropdownMenu` - Context menu
- `Separator` - Visual divider

## 📁 Struktur Folder

```
apps/admin/app/
├── (dashboard)/                 # Dashboard layout group
│   ├── components/             # Dashboard components
│   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   └── Header.tsx         # Top header with search & profile
│   ├── dashboard/             # Dashboard overview page
│   │   └── page.tsx
│   ├── components/            # Components management
│   │   └── page.tsx
│   ├── products/              # Products management
│   │   └── page.tsx
│   ├── settings/              # Settings page
│   │   └── page.tsx
│   └── layout.tsx             # Dashboard layout wrapper
├── components/                 # Shared app components
├── hooks/                      # Custom React hooks
│   └── api/
│       └── useComponent.ts    # Component API hooks
├── utils/                      # Utility functions
├── layout.tsx                  # Root layout
└── page.tsx                    # Home page (redirects to dashboard)
```

## 🔧 Tech Stack

- **Next.js 16** - React framework dengan App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS
- **shadcn/ui** - Re-usable UI components
- **tRPC** - End-to-end typesafe APIs
- **React Query** - Data fetching & caching
- **Lucide React** - Icon library

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (package manager)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Run development server:
```bash
pnpm dev
```

3. Open browser:
```
http://localhost:3001
```

## 📝 Usage

### Adding a Component

1. Navigate to **Components** page
2. Click **Add Component** button
3. Fill in the form:
   - **Name**: e.g., "Intel Core i9-13900K"
   - **Type**: Select dari dropdown (CPU, GPU, etc.)
   - **Price**: Masukkan harga dalam USD
   - **Specifications**: JSON object, contoh:
   ```json
   {
     "cores": 24,
     "threads": 32,
     "baseClock": "3.0 GHz",
     "boostClock": "5.8 GHz",
     "tdp": "125W"
   }
   ```
4. Click **Add Component**

### Editing a Component

1. Di tabel Components, click icon **⋮** (more options)
2. Select **Edit**
3. Update informasi yang diperlukan
4. Click **Save Changes**

### Deleting a Component

1. Di tabel Components, click icon **⋮** (more options)
2. Select **Delete**
3. Confirm deletion

### Search & Filter

- **Search**: Ketik nama komponen di search box
- **Filter by Type**: Pilih tipe komponen dari dropdown filter
- **Export**: Click icon download untuk export data

## 🎯 Component Type Colors

Setiap tipe komponen memiliki warna badge yang unik:

- 🔵 **CPU** - Blue
- 🟣 **MOTHERBOARD** - Purple
- 🟢 **RAM** - Green
- 🟡 **STORAGE** - Yellow
- 🔴 **GPU** - Red
- 🟠 **PSU** - Orange
- 🔷 **CASE** - Cyan
- 🟦 **COOLING** - Indigo

## 🔌 API Integration

Dashboard menggunakan tRPC untuk komunikasi dengan backend:

```typescript
// Example: useListComponents hook
const { components, isLoading, refetch } = useListComponents();
```

Hook yang tersedia:
- `useListComponents()` - Fetch semua komponen
- TODO: `useCreateComponent()` - Create komponen baru
- TODO: `useUpdateComponent()` - Update komponen
- TODO: `useDeleteComponent()` - Delete komponen

## 🎨 Customization

### Theme Colors

Colors didefinisikan di `globals.css` menggunakan CSS variables:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  /* ... */
}
```

### Navigation

Edit navigasi di `Sidebar.tsx`:

```typescript
const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  // Add more items...
];
```

## 📊 Features Roadmap

### Completed ✅
- [x] Dashboard layout dengan sidebar
- [x] Dashboard overview dengan statistics
- [x] Components list dengan table
- [x] Search dan filter komponen
- [x] Add/Edit component dialog
- [x] Settings page
- [x] Responsive design

### In Progress 🚧
- [ ] API integration untuk CRUD operations
- [ ] Form validation
- [ ] Loading states
- [ ] Error handling

### Planned 📋
- [ ] Products management
- [ ] User management
- [ ] Analytics dashboard
- [ ] Bulk operations
- [ ] Image upload
- [ ] Export to CSV/Excel
- [ ] Dark mode toggle
- [ ] Multi-language support

## 🐛 Known Issues

1. **API Integration**: CRUD operations masih menggunakan console.log, perlu diintegrasikan dengan tRPC mutations
2. **Form Validation**: Belum ada validasi form, perlu tambahkan Zod schema
3. **Error Boundaries**: Belum ada error handling yang proper

## 🤝 Contributing

Untuk menambahkan fitur atau memperbaiki bug:

1. Create new branch
2. Make changes
3. Test thoroughly
4. Submit PR

## 📄 License

Private - Internal use only

---

**Last Updated**: 2024
**Version**: 1.0.0
**Maintained by**: PC Builder Team
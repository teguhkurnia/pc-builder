# PC Builder - Admin Dashboard

Modern admin dashboard untuk mengelola komponen PC, produk, dan konfigurasi pada platform PC Builder.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-latest-black)

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open browser
# http://localhost:3001
```

## 📚 Documentation

- **[Quick Start Guide](./QUICKSTART.md)** - Setup dan instalasi
- **[Dashboard Overview](./README_DASHBOARD.md)** - Fitur dan penggunaan lengkap
- **[Component Documentation](./COMPONENTS.md)** - UI components yang digunakan
- **[Development Checklist](./CHECKLIST.md)** - Deployment & maintenance
- **[Project Summary](./SUMMARY.md)** - Ringkasan lengkap project

## ✨ Features

### ✅ Completed
- 🎨 **Modern UI** - Built with shadcn/ui & Tailwind CSS
- 📊 **Dashboard Overview** - Statistics, charts, dan activity feed
- 🔧 **Component Management** - Full CRUD untuk PC components
- 🔍 **Search & Filter** - Real-time search dan filter by type
- ⚙️ **Settings** - Comprehensive settings page
- 📱 **Responsive Design** - Mobile-friendly layout
- 🎯 **TypeScript** - Full type safety
- 🚀 **Performance** - Optimized with React Query caching
- ✅ **API Integration** - tRPC mutations fully implemented
- ✅ **Form Validation** - Client-side validation with error messages
- ✅ **Toast Notifications** - Success/error feedback with Sonner
- ✅ **CRUD Operations** - Create, Read, Update, Delete components
- ✅ **Dynamic Specifications** - Type-specific input fields with select dropdowns

### 🔄 In Progress
- Authentication system
- Authorization & role management

### 📋 Planned
- Products management
- Image upload
- Analytics dashboard
- Dark mode toggle
- Multi-language support

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** shadcn/ui + Tailwind CSS 4
- **State Management:** React Query + tRPC
- **Database:** Prisma ORM (MySQL)
- **Icons:** Lucide React
- **Language:** TypeScript

## 📁 Project Structure

```
apps/admin/
├── app/
│   ├── (dashboard)/         # Dashboard routes
│   │   ├── components/      # Sidebar, Header
│   │   ├── dashboard/       # Overview page
│   │   ├── components/      # Component CRUD
│   │   ├── products/        # Products page
│   │   ├── settings/        # Settings page
│   │   └── layout.tsx       # Dashboard layout
│   ├── components/          # Shared components
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   └── layout.tsx           # Root layout
├── public/                  # Static assets
└── *.md                     # Documentation
```

## 🎯 Available Pages

- **`/dashboard`** - Overview dengan statistics
- **`/components`** - Manage PC components (CPU, GPU, RAM, etc.)
- **`/products`** - Manage PC builds (coming soon)
- **`/settings`** - Application settings

## 🔌 Development

```bash
# Development server (port 3001)
pnpm dev

# Type checking
pnpm check-types

# Linting
pnpm lint

# Production build
pnpm build

# Start production server
pnpm start
```

## 📊 Component Types

Dashboard mendukung 8 tipe komponen PC:

- 🔵 **CPU** - Processors
- 🟣 **MOTHERBOARD** - Motherboards
- 🟢 **RAM** - Memory modules
- 🟡 **STORAGE** - Hard drives & SSDs
- 🔴 **GPU** - Graphics cards
- 🟠 **PSU** - Power supplies
- 🔷 **CASE** - PC cases
- 🟦 **COOLING** - Cooling systems

## 🎨 UI Components

Menggunakan komponen dari `@repo/ui` package:

- Button, Card, Table
- Dialog, Input, Select, Textarea
- Badge, Avatar, DropdownMenu
- Label, Separator, ScrollArea

## 🎯 Latest Updates

### Dynamic Specifications with Select Support (✅ v1.3.0)
- ✅ Type-specific input fields for each component type
- ✅ **Select dropdowns** for standardized values (NEW!)
- ✅ Pre-defined options for common specifications
- ✅ No JSON knowledge required - simple form inputs
- ✅ Auto type conversion (numbers vs strings)
- ✅ 8 component types with tailored fields:
  - CPU (cores, threads, clock speeds, TDP, **socket dropdown**)
  - Motherboard (**socket dropdown**, chipset, **form factor dropdown**, memory)
  - RAM (**capacity dropdown**, speed, **type dropdown**, CAS latency)
  - Storage (**capacity**, **type**, **interface**, speeds, **form factor** - all dropdowns)
  - GPU (chipset, memory, clocks, TDP)
  - PSU (**wattage**, **efficiency**, **modular**, **form factor** - all dropdowns)
  - Case (**form factor dropdown**, dimensions, drive bays)
  - Cooling (**type dropdown**, **radiator size dropdown**, fans, TDP rating)

See [DYNAMIC_SPECS.md](./DYNAMIC_SPECS.md) for complete field definitions and options.

### CRUD Implementation (✅ v1.1.0)
- ✅ Create new components with validation
- ✅ Read/List all components with caching
- ✅ Update existing components
- ✅ Delete components with confirmation
- ✅ Toast notifications for all actions
- ✅ Loading states during API calls
- ✅ Error handling with user feedback

See [CRUD_IMPLEMENTATION.md](./CRUD_IMPLEMENTATION.md) for detailed documentation.

## 🐛 Known Issues

1. Authentication belum diimplementasikan
2. Mobile sidebar perlu hamburger menu
3. Dark mode toggle belum ada
4. Pagination untuk large datasets

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit PR

## 📄 License

Private - Internal use only

---

**Version:** 1.3.0
**Last Updated:** November 2024  
**Maintained by:** PC Builder Team

## 📖 Documentation

- [Dashboard Overview](./README_DASHBOARD.md) - Complete feature guide
- [Dynamic Specifications](./DYNAMIC_SPECS.md) - Type-specific form fields
- [CRUD Implementation](./CRUD_IMPLEMENTATION.md) - API integration details
- [API Quick Reference](./API_QUICK_REFERENCE.md) - Developer quick guide
- [Quick Start](./QUICKSTART.md) - Setup instructions
- [Components](./COMPONENTS.md) - UI component documentation
- [Checklist](./CHECKLIST.md) - Deployment guide
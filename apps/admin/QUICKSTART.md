# 🚀 Quick Start - PC Builder Admin Dashboard

Panduan cepat untuk menjalankan admin dashboard PC Builder.

## ⚡ Quick Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Setup Database
```bash
# Generate Prisma client
cd packages/db
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev
```

### 3. Run Admin Dashboard
```bash
# From root directory
pnpm --filter @repo/admin dev

# Or navigate to admin folder
cd apps/admin
pnpm dev
```

### 4. Open Browser
```
http://localhost:3001
```

## 📱 Dashboard Access

Default admin credentials (update sesuai setup Anda):
- Email: `admin@pcbuilder.com`
- Password: `(setup your own)`

## 🎯 Available Pages

- **Dashboard** - `/dashboard` - Overview & statistics
- **Components** - `/components` - Manage PC components
- **Products** - `/products` - Manage PC builds (coming soon)
- **Settings** - `/settings` - Application settings

## 🛠️ Development Commands

```bash
# Run dev server (port 3001)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type checking
pnpm check-types

# Linting
pnpm lint
```

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: shadcn/ui + Tailwind CSS 4
- **State Management**: React Query + tRPC
- **Database**: Prisma ORM
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## 🎨 UI Components Used

All components from `@repo/ui` package:

- `Button`, `Card`, `Table`
- `Dialog`, `Input`, `Select`, `Textarea`
- `Badge`, `Avatar`, `DropdownMenu`
- `Label`, `Separator`, `ScrollArea`

## 📁 Project Structure

```
apps/admin/
├── app/
│   ├── (dashboard)/           # Dashboard routes
│   │   ├── components/        # Sidebar, Header
│   │   ├── dashboard/         # Overview page
│   │   ├── components/        # Components CRUD
│   │   ├── products/          # Products page
│   │   ├── settings/          # Settings page
│   │   └── layout.tsx         # Dashboard layout
│   ├── components/            # Shared components
│   ├── hooks/                 # Custom hooks (API, etc)
│   ├── utils/                 # Utilities
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home (redirect)
├── public/                    # Static assets
└── package.json
```

## 🔌 API Integration

### tRPC Endpoints (example)

```typescript
// List all components
const { components, isLoading } = useListComponents();

// TODO: Add component
const createMutation = api.components.create.useMutation();

// TODO: Update component
const updateMutation = api.components.update.useMutation();

// TODO: Delete component
const deleteMutation = api.components.delete.useMutation();
```

## 🎯 Next Steps

1. ✅ Setup database dan run migrations
2. ✅ Run admin dashboard
3. 🔄 Implement tRPC mutations untuk CRUD
4. 🔄 Add form validation dengan Zod
5. 🔄 Add toast notifications
6. 🔄 Implement authentication
7. 🔄 Add image upload untuk components
8. 🔄 Build products management
9. 🔄 Add analytics dashboard
10. 🔄 Deploy to production

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or use different port
PORT=3002 pnpm dev
```

### Prisma client not found
```bash
cd packages/db
pnpm prisma generate
```

### UI components not found
```bash
# Rebuild packages
pnpm install
```

## 📚 Documentation

- [Full Dashboard README](./README_DASHBOARD.md)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Next.js Docs](https://nextjs.org/docs)
- [tRPC Docs](https://trpc.io)

## 💡 Tips

- Use `Cmd/Ctrl + K` untuk quick search (coming soon)
- Dark mode available di Settings
- All data is cached dengan React Query (5min stale time)
- Components auto-refresh setelah mutations

---

**Happy Building! 🎉**
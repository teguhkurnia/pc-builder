# PC Builder - Custom PC Configuration Platform

A comprehensive PC building platform with admin panel, component management, and asset handling built with modern web technologies.

## 🚀 Project Overview

PC Builder is a monorepo application that allows users to configure custom PC builds and provides administrators with tools to manage components, specifications, and product images.

### Key Features

- **Admin Dashboard**: Complete component CRUD with dynamic specifications
- **Image Gallery**: Browse and upload product images with search
- **Component Management**: Manage CPUs, GPUs, RAM, Storage, and more
- **Type-Safe API**: tRPC with full TypeScript support
- **Asset Management**: Upload, store, and serve product images
- **Responsive UI**: Modern design with dark mode support

## 📁 What's Inside?

This Turborepo includes the following packages/apps:

### Apps

- **`admin`**: Admin dashboard for managing components and assets (Next.js)
- **`builder`**: PC builder interface for end users (Next.js)
- **`server`**: Upload and file serving backend (Fastify)

### Packages

- **`@repo/api`**: tRPC API with service layer architecture
- **`@repo/db`**: Prisma database client and schemas
- **`@repo/ui`**: Shared UI components (shadcn/ui based)
- **`@repo/eslint-config`**: ESLint configurations
- **`@repo/typescript-config`**: Shared TypeScript configs

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TailwindCSS** - Utility-first CSS
- **shadcn/ui** - High-quality UI components
- **tRPC** - End-to-end typesafe APIs
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Fastify** - Fast web framework
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Database
- **Winston** - Logging

### Development
- **Turborepo** - Monorepo build system
- **pnpm** - Package manager
- **TypeScript** - Type safety
- **ESLint & Prettier** - Code quality

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (or use `.nvmrc` with `nvm use`)
- pnpm 8+
- PostgreSQL database

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd pc-builder
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Setup environment variables**

Create `.env` files in required apps:

```bash
# packages/db/.env
DATABASE_URL="postgresql://user:password@localhost:5432/pcbuilder"

# apps/server/.env (optional)
PORT=4000
```

4. **Setup database**
```bash
cd packages/db
pnpm db:push
# or
pnpm db:migrate
```

5. **Start development servers**
```bash
# From root directory
pnpm dev
```

This will start:
- Admin dashboard: http://localhost:3000
- Builder app: http://localhost:3001
- Upload server: http://localhost:4000

### Run Specific Apps

```bash
# Admin dashboard only
pnpm dev --filter=admin

# Upload server only
pnpm dev --filter=server

# Builder app only
pnpm dev --filter=builder
```

## 📖 Documentation

Comprehensive documentation is available in the following locations:

### Project Documentation
- [**SETUP.md**](./SETUP.md) - Detailed setup instructions
- [**ARCHITECTURE.md**](./ARCHITECTURE.md) - System architecture overview
- [**DEVELOPMENT.md**](./DEVELOPMENT.md) - Development guidelines
- [**API.md**](./API.md) - API reference and endpoints
- [**CONTRIBUTING.md**](./CONTRIBUTING.md) - Contribution guidelines

### App-Specific Documentation
- [**Admin Dashboard**](./apps/admin/README.md) - Admin panel documentation
- [**Upload Server**](./apps/server/UPLOAD_API.md) - Upload API reference

### Package Documentation
- [**API Services**](./packages/api/SERVICES_API.md) - Service layer documentation
- [**Database**](./packages/db/README.md) - Prisma schema and migrations

### Quick References
- [**API Quick Reference**](./apps/admin/API_QUICK_REFERENCE.md)
- [**Upload Quickstart**](./UPLOAD_QUICKSTART.md)
- [**Components Guide**](./apps/admin/COMPONENTS.md)

## 🏗️ Project Structure

```
pc-builder/
├── apps/
│   ├── admin/              # Admin dashboard (Next.js)
│   │   ├── app/
│   │   │   ├── (dashboard)/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── utils/
│   │   └── package.json
│   ├── builder/            # PC builder app (Next.js)
│   └── server/             # Upload server (Fastify)
│       ├── src/
│       │   ├── routes/
│       │   └── utils/
│       └── uploads/        # Uploaded files
├── packages/
│   ├── api/                # tRPC API & services
│   │   ├── src/
│   │   │   ├── models/
│   │   │   ├── routers/
│   │   │   └── services/
│   │   └── package.json
│   ├── db/                 # Prisma database
│   │   ├── prisma/
│   │   └── src/
│   ├── ui/                 # Shared components
│   │   └── src/components/
│   ├── eslint-config/      # ESLint configs
│   └── typescript-config/  # TypeScript configs
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.json
```

## 🎯 Key Features

### Admin Dashboard

- **Component Management**: Full CRUD for PC components
- **Dynamic Specifications**: Type-specific fields (CPU, GPU, RAM, etc.)
- **Image Gallery Picker**: 
  - Browse existing images with search
  - Upload new images directly
  - Multi-file upload support
  - Auto-refresh after upload
- **Responsive Layouts**: Grid and list views
- **Settings**: Appearance customization, dark mode

### Image Gallery Picker

Reusable component with dual functionality:

```tsx
import ImageGalleryPicker from "@/components/image-gallery-picker";

function MyComponent() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>();

  return (
    <ImageGalleryPicker
      open={galleryOpen}
      onOpenChange={setGalleryOpen}
      onSelect={setSelectedImage}
      selectedImage={selectedImage}
    />
  );
}
```

Features:
- Gallery browsing with search
- Multi-file upload with preview
- Auto-select after upload
- Tabs navigation (Gallery/Upload)

### API Architecture

Clean service layer with public API:

```tsx
// ✅ Good - Using public API layer
import { createAsset, listAssets } from "@repo/api/src/services";

// tRPC integration
const { data } = api.assets.list.useQuery({
  type: "IMAGE",
  limit: 50,
});
```

### Upload System

RESTful upload API with:
- File validation (type, size, format)
- Database integration
- Static file serving
- Comprehensive error handling

## 🛠️ Development

### Build

Build all apps and packages:

```bash
pnpm build

# Or specific package
pnpm build --filter=@repo/api
```

### Type Checking

```bash
pnpm typecheck
```

### Linting

```bash
pnpm lint

# Fix issues
pnpm lint --fix
```

### Database

```bash
# Generate Prisma client
pnpm db:generate

# Push schema changes
pnpm db:push

# Create migration
pnpm db:migrate

# Open Prisma Studio
pnpm db:studio
```

### Testing Upload

```bash
cd apps/server
./test-upload.sh
# or
open test-upload.html
```

## 🗄️ Database Schema

### Component
- Dynamic specifications (JSONB)
- Type-based validation
- Price and availability
- Product images

### Asset
- File metadata
- Type categorization (IMAGE, DOCUMENT, OTHER)
- Searchable filenames
- Size tracking

See [database documentation](./packages/db/README.md) for details.

## 🎨 UI Components

Based on shadcn/ui with custom additions:

- **Layout**: Sidebar, Header, Container
- **Forms**: Input, Select, Textarea, Label
- **Feedback**: Dialog, Sheet, Toast, Skeleton
- **Data Display**: Table, Card, Badge, Avatar
- **Navigation**: Dropdown Menu, Tabs, Collapsible

See [components documentation](./apps/admin/COMPONENTS.md).

## 📝 Component Types

Supported PC components with dynamic specifications:

- **CPU**: Cores, threads, base/boost clock, socket, TDP
- **GPU**: VRAM, core clock, memory type, TDP, outputs
- **RAM**: Capacity, speed, type, latency, voltage
- **Storage**: Capacity, type, interface, read/write speeds
- **Motherboard**: Socket, chipset, form factor, RAM slots
- **PSU**: Wattage, efficiency, modular, form factor
- **Cooling**: Type, fan size, TDP, noise level
- **Case**: Form factor, PSU support, cooling options

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests and documentation
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🔗 Useful Links

### Turborepo
- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)

### Technologies
- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Project Resources
- [Documentation Index](./DOCS_INDEX.md)
- [Changelog](./CHANGELOG.md)
- [Development Guide](./DEVELOPMENT.md)

## 🚧 Roadmap

### Phase 1 (Current)
- ✅ Admin dashboard with component CRUD
- ✅ Image gallery and upload
- ✅ Database schema and migrations
- ✅ tRPC API layer
- ✅ Upload server

### Phase 2 (Planned)
- [ ] PC builder interface for end users
- [ ] Build compatibility checker
- [ ] Price calculation and optimization
- [ ] Build saving and sharing
- [ ] User authentication

### Phase 3 (Future)
- [ ] Build templates and recommendations
- [ ] Performance benchmarks
- [ ] Price tracking and alerts
- [ ] Community builds showcase
- [ ] E-commerce integration

## 💬 Support

For questions and support:

1. Check the [documentation](./DOCS_INDEX.md)
2. Search [existing issues](../../issues)
3. Create a [new issue](../../issues/new)
4. Join our community discussions

## 👏 Acknowledgments

Built with amazing open-source projects:

- [Turborepo](https://turborepo.com) by Vercel
- [Next.js](https://nextjs.org) by Vercel
- [shadcn/ui](https://ui.shadcn.com) by shadcn
- [tRPC](https://trpc.io) by the tRPC team
- [Prisma](https://www.prisma.io) by Prisma

---

**Built with ❤️ using Turborepo, Next.js, and TypeScript**
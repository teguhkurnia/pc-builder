# PC Builder Platform - Development Guide

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintained by**: PC Builder Team

---

## Table of Contents

1. [Development Environment](#development-environment)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Git Workflow](#git-workflow)
6. [Testing](#testing)
7. [Debugging](#debugging)
8. [Performance Optimization](#performance-optimization)
9. [Common Tasks](#common-tasks)
10. [Best Practices](#best-practices)

---

## Development Environment

### IDE Setup

#### Visual Studio Code (Recommended)

**Required Extensions:**
- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- Prisma (`prisma.prisma`)
- Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)

**Recommended Extensions:**
- Error Lens (`usernamehw.errorlens`)
- GitLens (`eamodio.gitlens`)
- Auto Rename Tag (`formulahendry.auto-rename-tag`)
- Path Intellisense (`christian-kohler.path-intellisense`)

**VS Code Settings:**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

#### WebStorm/IntelliJ IDEA

- Enable ESLint
- Enable Prettier
- Install Prisma plugin
- Configure TypeScript to use workspace version

### Terminal Setup

```bash
# Install development tools globally
npm install -g turbo
npm install -g prisma

# Setup aliases (add to .bashrc or .zshrc)
alias dev="pnpm dev"
alias build="pnpm build"
alias lint="pnpm lint"
alias types="pnpm check-types"
```

---

## Project Structure

### Monorepo Organization

```
pc-builder/
├── apps/                   # Deployable applications
│   ├── admin/             # Admin dashboard (Next.js)
│   ├── builder/           # PC builder app (Next.js)
│   └── server/            # Standalone API server (Fastify)
│
├── packages/              # Shared packages
│   ├── api/              # tRPC API layer
│   ├── db/               # Prisma database client
│   ├── ui/               # Shared React components
│   ├── eslint-config/    # ESLint configurations
│   └── typescript-config/# TypeScript configurations
│
└── [config files]        # Root configuration files
```

### File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| React Components | PascalCase | `ComponentCard.tsx` |
| Utilities | kebab-case | `format-price.ts` |
| Hooks | camelCase with `use` prefix | `useComponentList.ts` |
| Types | PascalCase | `types.ts`, `Component.ts` |
| Constants | UPPER_SNAKE_CASE | `API_ENDPOINTS.ts` |
| Configs | kebab-case | `eslint.config.js` |

### Import Organization

```typescript
// 1. External dependencies
import { useState } from 'react';
import { trpc } from '@trpc/client';

// 2. Internal packages (@repo/*)
import { db } from '@repo/db';
import { Button } from '@repo/ui/components/ui/button';

// 3. Relative imports (same package)
import { formatPrice } from '~/utils/format';
import { ComponentCard } from './component-card';

// 4. Types
import type { Component } from '@repo/db';
```

---

## Development Workflow

### Starting Development

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install dependencies (if package.json changed)
pnpm install

# 3. Generate Prisma client (if schema changed)
pnpm prisma:generate

# 4. Run migrations (if new migrations)
cd packages/db
pnpm prisma migrate dev

# 5. Start development servers
cd ../..
pnpm dev
```

### Hot Reload

All applications support hot reload:

- **Next.js apps**: Automatic on file save
- **Fastify server**: Using `tsx watch`
- **Shared packages**: Changes reflected immediately

### Working with Packages

#### Creating a New Shared Package

```bash
# 1. Create package directory
mkdir packages/new-package
cd packages/new-package

# 2. Initialize package.json
cat > package.json << EOF
{
  "name": "@repo/new-package",
  "version": "0.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {},
  "devDependencies": {
    "@repo/typescript-config": "workspace:*",
    "typescript": "5.9.2"
  }
}
EOF

# 3. Create tsconfig.json
cat > tsconfig.json << EOF
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
EOF

# 4. Create src directory
mkdir src
touch src/index.ts
```

#### Using a Package in an App

```json
// apps/admin/package.json
{
  "dependencies": {
    "@repo/new-package": "workspace:*"
  }
}
```

```typescript
// apps/admin/app/page.tsx
import { something } from '@repo/new-package';
```

---

## Coding Standards

### TypeScript

#### Type Definitions

```typescript
// ✅ Good: Explicit types for function parameters and returns
export function calculateTotal(
  components: Component[]
): number {
  return components.reduce((sum, c) => sum + c.price, 0);
}

// ❌ Avoid: Implicit any types
export function calculateTotal(components) {
  return components.reduce((sum, c) => sum + c.price, 0);
}
```

#### Interfaces vs Types

```typescript
// ✅ Use interfaces for object shapes
interface ComponentCardProps {
  component: Component;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

// ✅ Use types for unions, intersections, utilities
type ComponentType = 'CPU' | 'GPU' | 'RAM';
type Optional<T> = T | null;
```

#### Null Safety

```typescript
// ✅ Good: Handle null/undefined explicitly
const component = components.find(c => c.id === id);
if (!component) {
  throw new Error('Component not found');
}
return component;

// ✅ Good: Use optional chaining
const price = component?.price ?? 0;

// ❌ Avoid: Non-null assertion without checks
return components.find(c => c.id === id)!;
```

### React

#### Component Structure

```typescript
// ✅ Good: Functional component with TypeScript
import { useState } from 'react';
import type { Component } from '@repo/db';

interface ComponentCardProps {
  component: Component;
  onEdit?: (id: number) => void;
}

export function ComponentCard({ component, onEdit }: ComponentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleEdit = () => {
    onEdit?.(component.id);
  };

  return (
    <div className="component-card">
      <h3>{component.name}</h3>
      <p>${component.price}</p>
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
}
```

#### Hooks Rules

```typescript
// ✅ Good: Custom hooks
export function useComponentList() {
  const { data, isLoading, error } = trpc.component.list.useQuery();
  
  return {
    components: data ?? [],
    isLoading,
    error,
  };
}

// ✅ Good: Extract complex logic
export function useComponentForm(initialData?: Component) {
  const [formData, setFormData] = useState(initialData);
  const mutation = trpc.component.create.useMutation();
  
  const handleSubmit = async (data: ComponentInput) => {
    await mutation.mutateAsync(data);
  };
  
  return { formData, handleSubmit, isSubmitting: mutation.isLoading };
}
```

#### State Management

```typescript
// ✅ Good: Local state for UI
const [isOpen, setIsOpen] = useState(false);

// ✅ Good: React Query for server state
const { data } = trpc.component.list.useQuery();

// ✅ Good: Context for global UI state
const { theme, setTheme } = useTheme();

// ❌ Avoid: Using React Query for local UI state
const [isOpen] = trpc.ui.isModalOpen.useQuery(); // Wrong!
```

### CSS/Tailwind

#### Class Organization

```typescript
// ✅ Good: Use cn() utility for conditional classes
import { cn } from '@repo/ui/lib/utils';

<div className={cn(
  "base-class",
  "layout-class",
  isActive && "active-class",
  variant === "primary" && "primary-variant"
)}>
```

#### Component Variants (CVA)

```typescript
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-sm",
        lg: "h-11 px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### API/tRPC

#### Router Organization

```typescript
// packages/api/src/routers/component.ts
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';

export const componentRouter = router({
  // Queries (read operations)
  list: publicProcedure
    .query(async () => {
      return db.component.findMany();
    }),
  
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return db.component.findUnique({ where: { id: input.id } });
    }),
  
  // Mutations (write operations)
  create: publicProcedure
    .input(createComponentSchema)
    .mutation(async ({ input }) => {
      return db.component.create({ data: input });
    }),
});
```

#### Input Validation

```typescript
// ✅ Good: Use Zod schemas
const createComponentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  type: z.enum(['CPU', 'GPU', 'RAM', 'STORAGE', 'MOTHERBOARD', 'PSU', 'CASE', 'COOLING']),
  price: z.number().positive('Price must be positive'),
  specifications: z.record(z.unknown()),
});

// ✅ Good: Reuse schemas
const updateComponentSchema = createComponentSchema.partial();
```

---

## Git Workflow

### Branch Naming

```bash
# Format: <type>/<description>
feature/add-product-crud
bugfix/fix-price-calculation
hotfix/critical-security-issue
chore/update-dependencies
docs/improve-setup-guide
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: <type>(<scope>): <description>

# Types:
feat:     # New feature
fix:      # Bug fix
docs:     # Documentation only
style:    # Code style (formatting, missing semi-colons, etc)
refactor: # Code refactoring
perf:     # Performance improvement
test:     # Adding or updating tests
chore:    # Maintenance tasks
ci:       # CI/CD changes

# Examples:
git commit -m "feat(admin): add component filtering by type"
git commit -m "fix(api): resolve price calculation bug"
git commit -m "docs: update setup instructions"
git commit -m "refactor(ui): extract button variants to CVA"
git commit -m "chore(deps): update next.js to 16.0.1"
```

### Pull Request Workflow

```bash
# 1. Create feature branch
git checkout -b feature/add-new-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add new feature"

# 3. Keep branch updated
git fetch origin
git rebase origin/main

# 4. Push to remote
git push origin feature/add-new-feature

# 5. Create Pull Request on GitHub/GitLab
# 6. Address review comments
# 7. Merge after approval
```

### Pre-commit Checklist

- [ ] Code is formatted (`pnpm format`)
- [ ] No linting errors (`pnpm lint`)
- [ ] Types are correct (`pnpm check-types`)
- [ ] Tests pass (when implemented)
- [ ] Database migrations are created (if schema changed)
- [ ] Documentation is updated
- [ ] Commit message follows convention

---

## Testing

### Unit Testing (Planned)

```typescript
// Example: Component test with React Testing Library
import { render, screen } from '@testing-library/react';
import { ComponentCard } from './component-card';

describe('ComponentCard', () => {
  it('renders component name and price', () => {
    const component = {
      id: 1,
      name: 'Intel Core i7',
      type: 'CPU',
      price: 399.99,
      specifications: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    render(<ComponentCard component={component} />);

    expect(screen.getByText('Intel Core i7')).toBeInTheDocument();
    expect(screen.getByText('$399.99')).toBeInTheDocument();
  });
});
```

### Integration Testing (Planned)

```typescript
// Example: tRPC endpoint test
import { appRouter } from '@repo/api';
import { createCallerFactory } from '@trpc/server';

describe('Component Router', () => {
  const createCaller = createCallerFactory(appRouter);
  const caller = createCaller({});

  it('creates a component', async () => {
    const result = await caller.component.create({
      name: 'Test CPU',
      type: 'CPU',
      price: 299.99,
      specifications: { cores: 8 },
    });

    expect(result.name).toBe('Test CPU');
    expect(result.type).toBe('CPU');
  });
});
```

### E2E Testing (Planned)

```typescript
// Example: Playwright test
import { test, expect } from '@playwright/test';

test('admin can create component', async ({ page }) => {
  await page.goto('http://localhost:3001/components');
  await page.click('text=Add Component');
  
  await page.fill('[name="name"]', 'Test GPU');
  await page.selectOption('[name="type"]', 'GPU');
  await page.fill('[name="price"]', '999.99');
  
  await page.click('button[type="submit"]');
  
  await expect(page.locator('text=Test GPU')).toBeVisible();
});
```

---

## Debugging

### Browser DevTools

```typescript
// Add debugging statements
console.log('Component data:', component);
console.table(components);
console.trace('Call stack');

// Use debugger statement
function handleSubmit(data: ComponentInput) {
  debugger; // Pauses execution
  mutation.mutate(data);
}
```

### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "pnpm dev --filter=@repo/admin"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3001"
    }
  ]
}
```

### tRPC Debugging

```typescript
// Enable tRPC link logging
import { loggerLink } from '@trpc/client';

const trpcClient = trpc.createClient({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === 'development' ||
        (opts.direction === 'down' && opts.result instanceof Error),
    }),
    httpBatchLink({ url: '...' }),
  ],
});
```

### Database Debugging

```typescript
// Enable Prisma query logging
const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
  ],
});

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query);
  console.log('Duration: ' + e.duration + 'ms');
});
```

---

## Performance Optimization

### React Performance

```typescript
// ✅ Use React.memo for expensive components
export const ComponentCard = React.memo(({ component }: Props) => {
  return <div>{component.name}</div>;
});

// ✅ Use useMemo for expensive calculations
const totalPrice = useMemo(() => {
  return components.reduce((sum, c) => sum + c.price, 0);
}, [components]);

// ✅ Use useCallback for stable function references
const handleDelete = useCallback((id: number) => {
  deleteMutation.mutate({ id });
}, [deleteMutation]);
```

### React Query Optimization

```typescript
// ✅ Configure stale times appropriately
const { data } = trpc.component.list.useQuery(undefined, {
  staleTime: 1000 * 60 * 5, // 5 minutes
  cacheTime: 1000 * 60 * 30, // 30 minutes
});

// ✅ Use prefetching
const utils = trpc.useContext();
await utils.component.getById.prefetch({ id: 1 });

// ✅ Implement pagination
const { data, fetchNextPage } = trpc.component.list.useInfiniteQuery(
  { limit: 20 },
  { getNextPageParam: (lastPage) => lastPage.nextCursor }
);
```

### Database Optimization

```typescript
// ✅ Select only needed fields
const components = await db.component.findMany({
  select: { id: true, name: true, price: true },
});

// ✅ Use proper indexing (in schema)
model Component {
  id   Int    @id @default(autoincrement())
  type ComponentType
  
  @@index([type])
}

// ✅ Use pagination
const components = await db.component.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
});
```

---

## Common Tasks

### Adding a New Component Type

```typescript
// 1. Update Prisma schema
enum ComponentType {
  CPU
  GPU
  RAM
  STORAGE
  MOTHERBOARD
  PSU
  CASE
  COOLING
  MONITOR // New type
}

// 2. Create migration
// cd packages/db
// pnpm prisma migrate dev --name add_monitor_type

// 3. Update admin form specifications
// apps/admin/components/component-form.tsx
```

### Adding a New tRPC Endpoint

```typescript
// 1. Add to router
export const componentRouter = router({
  // ...existing endpoints
  
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      return db.component.findMany({
        where: { name: { contains: input.query } },
      });
    }),
});

// 2. Use in component
const { data } = trpc.component.search.useQuery({ query: 'Intel' });
```

### Adding a New UI Component

```typescript
// 1. Create component in packages/ui
// packages/ui/src/components/ui/badge.tsx
export function Badge({ children, variant }: BadgeProps) {
  return <span className={badgeVariants({ variant })}>{children}</span>;
}

// 2. Export from package
// packages/ui/src/index.ts
export { Badge } from './components/ui/badge';

// 3. Use in apps
import { Badge } from '@repo/ui/components/ui/badge';
```

---

## Best Practices

### Security

```typescript
// ✅ Validate all inputs
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// ✅ Sanitize user input
import DOMPurify from 'isomorphic-dompurify';
const clean = DOMPurify.sanitize(userInput);

// ❌ Never expose sensitive data
// Don't include passwords, tokens, etc. in API responses
```

### Error Handling

```typescript
// ✅ Handle errors gracefully
try {
  const result = await mutation.mutateAsync(data);
} catch (error) {
  if (error instanceof TRPCClientError) {
    toast.error(error.message);
  } else {
    toast.error('An unexpected error occurred');
  }
}

// ✅ Provide user-friendly error messages
if (error.data?.code === 'NOT_FOUND') {
  return <div>Component not found. Please try again.</div>;
}
```

### Code Review Checklist

- [ ] Code follows project style guide
- [ ] No console.logs in production code
- [ ] Error handling is implemented
- [ ] TypeScript types are correct (no `any`)
- [ ] Components are properly memoized if needed
- [ ] Database queries are optimized
- [ ] Security best practices followed
- [ ] Documentation is updated
- [ ] No hardcoded values (use constants/env vars)

---

## Resources

### Official Documentation
- [Turborepo](https://turborepo.com/docs)
- [Next.js](https://nextjs.org/docs)
- [tRPC](https://trpc.io/docs)
- [Prisma](https://www.prisma.io/docs)
- [React Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)

### Internal Documentation
- [README.md](./README.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [API.md](./API.md)
- [SETUP.md](./SETUP.md)

---

**Development Guide Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintained by**: PC Builder Team

Happy coding! 🚀
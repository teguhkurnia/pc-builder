# 🎨 Admin Dashboard Components

Dokumentasi lengkap komponen-komponen yang digunakan di Admin Dashboard PC Builder.

## 📋 Table of Contents

- [Layout Components](#layout-components)
- [Dashboard Components](#dashboard-components)
- [Form Components](#form-components)
- [Data Display](#data-display)
- [Navigation](#navigation)
- [Feedback](#feedback)

---

## Layout Components

### Sidebar
**File**: `app/(dashboard)/components/Sidebar.tsx`

Navigasi utama dashboard dengan menu items.

**Features**:
- Logo dan branding
- Menu navigasi dengan icons
- Active state highlighting
- Logout button
- Responsive design

**Menu Items**:
```typescript
- Dashboard (LayoutDashboard icon)
- Components (Cpu icon)
- Products (Package icon)
- Settings (Settings icon)
```

**Usage**:
```tsx
<Sidebar className="w-64" />
```

---

### Header
**File**: `app/(dashboard)/components/Header.tsx`

Top header dengan search bar dan user menu.

**Features**:
- Global search input
- Notification bell dengan badge
- User profile dropdown
- Avatar dengan fallback

**Dropdown Menu**:
- Profile
- Settings
- Logout

**Usage**:
```tsx
<Header />
```

---

### Dashboard Layout
**File**: `app/(dashboard)/layout.tsx`

Wrapper layout untuk semua dashboard pages.

**Structure**:
```
┌─────────────────────────────────┐
│ Sidebar │     Header            │
│         │─────────────────────── │
│         │                        │
│  Nav    │   Main Content         │
│  Items  │   (children)           │
│         │                        │
│         │                        │
└─────────────────────────────────┘
```

---

## Dashboard Components

### Stats Card
**Location**: Dashboard overview page

Menampilkan statistik dengan icon dan trend.

**Features**:
- Icon di header
- Value dengan format yang sesuai
- Description text
- Trend indicator (up/down)
- Color-coded icons

**Example**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Total Components</CardTitle>
    <Cpu className="h-4 w-4" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">156</div>
    <p className="text-muted-foreground">Active in inventory</p>
    <div className="text-green-600">
      <TrendingUp /> +12% from last month
    </div>
  </CardContent>
</Card>
```

---

### Component Distribution
**Location**: Dashboard overview page

Visualisasi distribusi komponen per tipe.

**Features**:
- List semua tipe komponen
- Count per tipe
- Colored indicators
- Loading state

---

### Recent Activity
**Location**: Dashboard overview page

Timeline aktivitas terbaru di platform.

**Features**:
- Dot indicators
- Activity title
- Description
- Timestamp
- Auto-scroll

---

### Quick Actions
**Location**: Dashboard overview page

Card dengan link ke fitur-fitur utama.

**Features**:
- Large icons
- Title & description
- Hover effects
- Direct links

---

## Form Components

### Add Component Dialog
**Location**: `/components` page

Modal form untuk menambah komponen baru.

**Fields**:
- **Name**: Text input (required)
- **Type**: Select dropdown (required)
- **Price**: Number input (required)
- **Specifications**: Textarea JSON (required)

**Validation**:
- All fields required
- Price must be number
- Specifications must be valid JSON

**Actions**:
- Cancel (outline button)
- Add Component (primary button)

**Example**:
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogTrigger asChild>
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Add Component
    </Button>
  </DialogTrigger>
  <DialogContent>
    {/* Form fields */}
  </DialogContent>
</Dialog>
```

---

### Edit Component Dialog
**Location**: `/components` page

Modal form untuk edit komponen existing.

**Features**:
- Pre-filled dengan data existing
- Same fields sebagai Add Dialog
- Update confirmation
- Cancel action

---

### Search Input
**Location**: `/components` page

Search bar untuk filter komponen.

**Features**:
- Search icon di kiri
- Real-time filtering
- Placeholder text
- Clear on demand

**Usage**:
```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2" />
  <Input 
    placeholder="Search components..."
    className="pl-9"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div>
```

---

### Filter Dropdown
**Location**: `/components` page

Dropdown untuk filter berdasarkan tipe.

**Options**:
- All Types (default)
- CPU
- MOTHERBOARD
- RAM
- STORAGE
- GPU
- PSU
- CASE
- COOLING

**Usage**:
```tsx
<Select value={filterType} onValueChange={setFilterType}>
  <SelectTrigger>
    <Filter className="mr-2 h-4 w-4" />
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Types</SelectItem>
    {componentTypes.map(type => (
      <SelectItem key={type} value={type}>{type}</SelectItem>
    ))}
  </SelectContent>
</Select>
```

---

## Data Display

### Components Table
**Location**: `/components` page

Tabel lengkap untuk menampilkan semua komponen.

**Columns**:
1. **Name** - Component name (bold)
2. **Type** - Badge dengan warna
3. **Price** - Formatted currency ($)
4. **Specifications** - JSON preview (truncated)
5. **Updated** - Date formatted
6. **Actions** - Dropdown menu

**Features**:
- Sortable columns
- Row hover effect
- Responsive design
- Empty state
- Loading state

**Empty State**:
```tsx
<div className="flex flex-col items-center justify-center">
  <p className="text-muted-foreground">No components found</p>
  <Button onClick={openAddDialog}>
    <Plus /> Add Your First Component
  </Button>
</div>
```

---

### Type Badge
**Location**: Components table

Colored badge untuk tipe komponen.

**Colors**:
- 🔵 CPU - Blue
- 🟣 MOTHERBOARD - Purple
- 🟢 RAM - Green
- 🟡 STORAGE - Yellow
- 🔴 GPU - Red
- 🟠 PSU - Orange
- 🔷 CASE - Cyan
- 🟦 COOLING - Indigo

**Usage**:
```tsx
<Badge 
  variant="outline"
  className={componentTypeColors[type]}
>
  {type}
</Badge>
```

**Color Map**:
```typescript
const componentTypeColors = {
  CPU: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  MOTHERBOARD: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  // ... etc
};
```

---

### Card Component
**Usage**: Throughout dashboard

Container untuk konten dengan header dan body.

**Variants**:
```tsx
// Basic card
<Card>
  <CardContent>Content here</CardContent>
</Card>

// Card with header
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>

// Card with footer
<Card>
  <CardHeader>...</CardHeader>
  <CardContent>...</CardContent>
  <CardFooter>Actions</CardFooter>
</Card>
```

---

## Navigation

### Navigation Links
**Location**: Sidebar

Active state dengan background color.

**Styling**:
```tsx
// Active state
className="bg-primary text-primary-foreground"

// Inactive state
className="text-muted-foreground hover:bg-accent hover:text-accent-foreground"
```

---

### Breadcrumbs
**Status**: Coming soon

Navigate antara pages hierarchy.

---

## Feedback

### Dropdown Menu Actions
**Location**: Components table

Context menu untuk row actions.

**Actions**:
- Edit (dengan icon)
- Delete (destructive color)

**Usage**:
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleEdit}>
      <Edit className="mr-2 h-4 w-4" />
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem 
      className="text-destructive"
      onClick={handleDelete}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### Loading States
**Status**: In progress

Skeleton loaders dan spinners.

**Current**:
```tsx
// Simple loading
{isLoading && (
  <div className="flex items-center justify-center">
    <p className="text-muted-foreground">Loading...</p>
  </div>
)}
```

**TODO**: Add skeleton components

---

### Toast Notifications
**Status**: Coming soon

Success/error notifications setelah actions.

---

## 🎨 Design System

### Colors
Menggunakan Tailwind CSS variables dari `globals.css`:

```css
--background
--foreground
--card
--primary
--secondary
--muted
--accent
--destructive
--border
```

### Spacing
Consistent spacing dengan Tailwind:
- `gap-2`, `gap-4`, `gap-6` - Grid/flex gaps
- `p-4`, `p-6` - Padding
- `space-y-4`, `space-y-6` - Vertical spacing

### Typography
- **Headings**: `text-3xl font-bold` (h1), `text-lg font-semibold` (h3)
- **Body**: `text-sm`, `text-base`
- **Muted**: `text-muted-foreground`

### Borders
- `border-border` - Default border color
- `rounded-lg` - Default radius
- `rounded-md` - Smaller radius

### Shadows
Minimal shadows, mostly using borders.

---

## 📱 Responsive Design

### Breakpoints
```typescript
// Tailwind breakpoints
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
```

### Mobile Considerations
- Sidebar hidden di mobile (`hidden lg:block`)
- Grid columns responsive (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`)
- Flex direction changes (`flex-col md:flex-row`)

---

## 🔧 Component Props

### Common Props Pattern
```typescript
interface ComponentProps {
  className?: string;      // Styling override
  children?: ReactNode;    // Content
  variant?: "default" | "outline" | ...;
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  onClick?: () => void;
}
```

### Button Variants
- `default` - Primary blue
- `destructive` - Red
- `outline` - Bordered
- `secondary` - Gray
- `ghost` - Transparent
- `link` - Text only

### Button Sizes
- `default` - h-10 px-4
- `sm` - h-9 px-3
- `lg` - h-11 px-8
- `icon` - h-10 w-10

---

## 🎯 Best Practices

### Component Organization
```tsx
// 1. Imports
import { Button } from "@repo/ui/components/ui/button";

// 2. Types/Interfaces
interface Props { ... }

// 3. Constants
const COLORS = { ... };

// 4. Component
export function MyComponent({ prop }: Props) {
  // Hooks
  const [state, setState] = useState();
  
  // Handlers
  const handleClick = () => { ... };
  
  // Render
  return <div>...</div>;
}
```

### State Management
- Local state dengan `useState`
- Server state dengan React Query
- Form state dengan controlled inputs

### Error Handling
```tsx
{isError && (
  <div className="text-destructive">
    Error: {error?.message}
  </div>
)}
```

### Loading States
```tsx
{isLoading ? (
  <Skeleton />
) : (
  <Content />
)}
```

---

## 📚 Resources

- [shadcn/ui Components](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://radix-ui.com)

---

**Last Updated**: 2024
**Version**: 1.0.0
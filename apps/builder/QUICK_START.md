# PC Builder App - Quick Start Guide 🚀

## ⚡ TL;DR

```bash
# Install dependencies
pnpm install

# Run migrations
cd packages/db && npx prisma migrate dev

# Start builder app
pnpm --filter @repo/builder dev

# Open browser
open http://localhost:3000
```

---

## 🎯 What You Need to Know

### Main Files
```
apps/builder/app/
├── builder/
│   ├── page.tsx                        # ⭐ Main builder interface
│   └── components/
│       └── component-detail-modal.tsx  # ⭐ Detail modal
├── hooks/api/
│   ├── useBuild.ts                     # ⭐ Build CRUD hooks
│   └── useComponent.ts                 # ⭐ Component hooks
└── page.tsx                            # Homepage (redirects)
```

### Key Features
1. **Step-by-step builder** - 8 komponen (CPU → Cooling)
2. **Component detail modal** - Click "Details" atau component di summary
3. **Auto-save** - Build otomatis tersimpan
4. **Live price** - Total harga real-time
5. **Search** - Filter komponen per step

---

## 🔧 How It Works

### Build Flow
```
User selects component
    ↓
handleSelectComponent(componentId)
    ↓
Update buildState
    ↓
Create/Update Build (tRPC)
    ↓
Auto-calculate totalPrice
    ↓
Save to database
    ↓
UI updates
```

### State Management
```typescript
const [currentStep, setCurrentStep] = useState(0);
const [buildState, setBuildState] = useState<BuildState>({
  name: "My Build",
  cpuId?: number,
  motherboardId?: number,
  // ... other components
});
const [buildId, setBuildId] = useState<number | null>(null);
```

---

## 🎨 UI Components Used

### shadcn/ui
- `Dialog` - Modal
- `Button` - All buttons
- `Card` - Component cards
- `Input` - Search & build name
- `Badge` - Status indicators
- `ScrollArea` - Scrollable specs

### Lucide Icons
- `Cpu, Boxes, MemoryStick, HardDrive` - Component icons
- `MonitorPlay, Zap, Box, Fan` - More component icons
- `Info, Heart, Copy, Check` - Action icons
- `ChevronLeft, ChevronRight` - Navigation

---

## 📝 Common Tasks

### Add New Build Step
```typescript
// In page.tsx
const BUILD_STEPS = [
  // ... existing steps
  { 
    key: "monitor", 
    label: "Monitor", 
    type: "MONITOR", 
    icon: Monitor 
  },
];

// Update BuildState interface
interface BuildState {
  // ... existing fields
  monitorId?: number;
}
```

### Modify Component Card Display
```typescript
// In page.tsx, find this section:
filteredComponents.map((component) => {
  // Modify card rendering here
})
```

### Customize Modal
```typescript
// Edit: component-detail-modal.tsx
// Sections:
// 1. Image Gallery (line ~130)
// 2. Specifications (line ~240)
// 3. Action Buttons (line ~200 & ~270)
```

### Change Price Format
```typescript
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR", // Change to "USD" for dollars
    minimumFractionDigits: 0,
  }).format(price);
};
```

---

## 🔌 API Hooks

### useBuild.ts
```typescript
// List builds
const { builds, isLoading } = useListBuilds();

// Get single build
const { build } = useGetBuild(buildId);

// Create build
const createMutation = useCreateBuild();
await createMutation.mutateAsync({ name: "My Build" });

// Update build
const updateMutation = useUpdateBuild();
await updateMutation.mutateAsync({ 
  id: buildId, 
  data: { cpuId: 123 } 
});

// Delete build
const deleteMutation = useDeleteBuild();
await deleteMutation.mutateAsync({ id: buildId });
```

### useComponent.ts
```typescript
// List all components
const { components, isLoading, refetch } = useListComponents();

// Components are auto-filtered by type in builder
const cpus = components.filter(c => c.type === "CPU");
```

---

## 🎯 Customization Tips

### Change Color Scheme
```typescript
// In page.tsx
const componentTypeColors: Record<string, string> = {
  CPU: "bg-blue-500/10 text-blue-500",    // Change blue to your color
  GPU: "bg-red-500/10 text-red-500",      // Change red to your color
  // ...
};
```

### Modify Step Order
```typescript
// In page.tsx - just reorder BUILD_STEPS array
const BUILD_STEPS = [
  { key: "case", label: "Case", type: "CASE", icon: Box },  // Case first!
  { key: "cpu", label: "Processor (CPU)", type: "CPU", icon: Cpu },
  // ...
];
```

### Add Validation
```typescript
// In handleCompleteBuild()
const handleCompleteBuild = async () => {
  // Add your validation
  if (!buildState.cpuId || !buildState.gpuId) {
    alert("CPU and GPU are required!");
    return;
  }
  
  // Complete build
  await updateBuildMutation.mutateAsync({...});
};
```

---

## 🐛 Debugging

### Build not saving?
```typescript
// Check console for errors
console.log("Build ID:", buildId);
console.log("Build State:", buildState);

// Check mutation status
console.log("Creating:", createBuildMutation.isPending);
console.log("Error:", createBuildMutation.error);
```

### Components not showing?
```typescript
// Check data
console.log("All components:", components);
console.log("Filtered:", filteredComponents);
console.log("Current step type:", currentStepConfig.type);
```

### Modal not opening?
```typescript
// Check state
console.log("Selected ID:", selectedComponentForDetail);
console.log("Component:", componentForDetail);
console.log("Is selected?:", isComponentSelected);
```

---

## 📊 Database Queries

### Get build with all components
```typescript
const build = await db.build.findUnique({
  where: { id },
  include: {
    cpu: true,
    motherboard: true,
    ram: true,
    storage: true,
    gpu: true,
    psu: true,
    case: true,
    cooling: true,
  },
});
```

### Calculate total price
```typescript
// Auto-calculated in create/update service
const componentIds = [
  input.cpuId,
  input.motherboardId,
  // ...
].filter(id => id !== undefined);

const components = await db.component.findMany({
  where: { id: { in: componentIds } },
});

const totalPrice = components.reduce((sum, c) => sum + c.price, 0);
```

---

## 🎨 Styling Guide

### Tailwind Classes Cheat Sheet
```typescript
// Backgrounds
"bg-slate-50 dark:bg-slate-900"           // Light/dark bg
"bg-blue-50 dark:bg-blue-950"             // Colored bg

// Borders
"border border-slate-200 dark:border-slate-800"  // Border
"border-2 border-blue-500"                       // Thick colored

// Text
"text-slate-900 dark:text-white"          // Primary text
"text-slate-600 dark:text-slate-400"      // Secondary text

// Hover
"hover:bg-slate-100 dark:hover:bg-slate-800"    // Hover bg
"hover:border-blue-300"                          // Hover border

// Transitions
"transition-all"                          // Smooth transitions
"transition-colors"                       // Color transitions only
```

---

## 🚀 Performance Tips

### Optimize Re-renders
```typescript
// Use useMemo for expensive calculations
const totalPrice = useMemo(() => {
  return BUILD_STEPS.reduce((sum, step) => {
    // ... calculation
  }, 0);
}, [buildState, components]);

// Use useCallback for functions
const handleSelectComponent = useCallback((id: number) => {
  // ... handler
}, [buildId, buildState]);
```

### Lazy Load Images
```typescript
// Use Next.js Image component
import Image from "next/image";

<Image 
  src={component.imageUrl} 
  alt={component.name}
  width={400}
  height={400}
  loading="lazy"
/>
```

---

## 📚 Useful Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [tRPC Docs](https://trpc.io/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

### Project Files
- `README.md` - Full documentation
- `FEATURES.md` - Complete feature list
- `.cursorrules` - Coding standards

---

## 💡 Pro Tips

1. **Use TypeScript strictly** - No `any` types!
2. **Follow .cursorrules** - Consistent code style
3. **Test on mobile** - Responsive design is key
4. **Use dark mode** - Check both themes
5. **Check console** - No errors/warnings
6. **Prisma generate** - After schema changes
7. **Auto-format** - Use ESLint/Prettier
8. **Git commit often** - Small, focused commits

---

## ✅ Checklist untuk New Features

- [ ] Update Prisma schema jika perlu
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma migrate dev`
- [ ] Create/update Zod schemas
- [ ] Create/update services
- [ ] Update tRPC router
- [ ] Create/update hooks
- [ ] Update UI components
- [ ] Test functionality
- [ ] Check TypeScript errors
- [ ] Test responsive design
- [ ] Test dark mode
- [ ] Update documentation

---

**Happy Coding! 🎉**
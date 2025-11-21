# 🎯 Dynamic Specification Fields

Documentation for the dynamic specification input system in the Component Management page.

## 📋 Overview

Instead of using a JSON textarea for component specifications, the form now displays **dynamic input fields** based on the selected component type. Each component type has its own set of relevant specification fields.

## ✨ Features

- ✅ **Type-Specific Fields** - Different fields for each component type
- ✅ **User-Friendly** - No need to write JSON manually
- ✅ **Auto-Type Conversion** - Numeric fields automatically converted to numbers
- ✅ **Select Dropdowns** - Pre-defined options for common specifications
- ✅ **Validation** - At least one specification field required
- ✅ **Clean UI** - Organized fields with labels and placeholders

## 🎨 Component Types & Fields

### CPU
```typescript
{
  cores: number        // e.g., 24 (number input)
  threads: number      // e.g., 32 (number input)
  baseClock: string    // e.g., "3.0 GHz" (text input)
  boostClock: string   // e.g., "5.8 GHz" (text input)
  tdp: string          // e.g., "125W" (text input)
  socket: string       // e.g., "LGA1700" (select dropdown)
}
```

**Example:**
- Cores: `24` (number input)
- Threads: `32` (number input)
- Base Clock: `3.0 GHz` (text input)
- Boost Clock: `5.8 GHz` (text input)
- TDP: `125W` (text input)
- Socket: `LGA1700` (select: LGA1700, LGA1200, AM5, AM4, LGA2066)

---

### MOTHERBOARD
```typescript
{
  socket: string       // e.g., "LGA1700" (select dropdown)
  chipset: string      // e.g., "Z790" (text input)
  formFactor: string   // e.g., "ATX" (select dropdown)
  memorySlots: number  // e.g., 4 (number input)
  maxMemory: string    // e.g., "128GB" (text input)
  pcie: string         // e.g., "3x PCIe 4.0" (text input)
}
```

**Example:**
- Socket: `LGA1700` (select: LGA1700, LGA1200, AM5, AM4, LGA2066)
- Chipset: `Z790` (text input)
- Form Factor: `ATX` (select: ATX, Micro-ATX, Mini-ITX, E-ATX)
- Memory Slots: `4` (number input)
- Max Memory: `128GB` (text input)
- PCIe Slots: `3x PCIe 4.0` (text input)

---

### RAM
```typescript
{
  capacity: string     // e.g., "16GB" (select dropdown)
  speed: string        // e.g., "3200MHz" (text input)
  type: string         // e.g., "DDR4" (select dropdown)
  cas: string          // e.g., "CL16" (text input)
  voltage: string      // e.g., "1.35V" (text input)
}
```

**Example:**
- Capacity: `16GB` (select: 8GB, 16GB, 32GB, 64GB, 128GB)
- Speed: `3200MHz` (text input)
- Type: `DDR4` (select: DDR4, DDR5)
- CAS Latency: `CL16` (text input)
- Voltage: `1.35V` (text input)

---

### STORAGE
```typescript
{
  capacity: string     // e.g., "1TB" (select dropdown)
  type: string         // e.g., "NVMe SSD" (select dropdown)
  interface: string    // e.g., "PCIe 4.0 x4" (select dropdown)
  readSpeed: string    // e.g., "7000 MB/s" (text input)
  writeSpeed: string   // e.g., "5300 MB/s" (text input)
  formFactor: string   // e.g., "M.2 2280" (select dropdown)
}
```

**Example:**
- Capacity: `1TB` (select: 256GB, 512GB, 1TB, 2TB, 4TB, 8TB)
- Type: `NVMe SSD` (select: NVMe SSD, SATA SSD, HDD)
- Interface: `PCIe 4.0 x4` (select: PCIe 4.0 x4, PCIe 3.0 x4, SATA III)
- Read Speed: `7000 MB/s` (text input)
- Write Speed: `5300 MB/s` (text input)
- Form Factor: `M.2 2280` (select: M.2 2280, M.2 2260, M.2 22110, 2.5 inch, 3.5 inch)

---

### GPU
```typescript
{
  chipset: string      // e.g., "RTX 4090"
  memory: string       // e.g., "24GB GDDR6X"
  coreClock: string    // e.g., "2230 MHz"
  boostClock: string   // e.g., "2520 MHz"
  tdp: string          // e.g., "450W"
  outputs: string      // e.g., "3x DP, 1x HDMI"
}
```

**Example:**
- Chipset: `RTX 4090`
- Memory: `24GB GDDR6X`
- Core Clock: `2230 MHz`
- Boost Clock: `2520 MHz`
- TDP: `450W`
- Outputs: `3x DP, 1x HDMI`

---

### PSU (Power Supply)
```typescript
{
  wattage: string      // e.g., "850W" (select dropdown)
  efficiency: string   // e.g., "80+ Gold" (select dropdown)
  modular: string      // e.g., "Fully Modular" (select dropdown)
  formFactor: string   // e.g., "ATX" (select dropdown)
}
```

**Example:**
- Wattage: `850W` (select: 450W, 550W, 650W, 750W, 850W, 1000W, 1200W)
- Efficiency: `80+ Gold` (select: 80+ White, 80+ Bronze, 80+ Silver, 80+ Gold, 80+ Platinum, 80+ Titanium)
- Modular: `Fully Modular` (select: Non-Modular, Semi-Modular, Fully Modular)
- Form Factor: `ATX` (select: ATX, SFX, SFX-L)

---

### CASE
```typescript
{
  formFactor: string        // e.g., "Mid Tower" (select dropdown)
  motherboardSupport: string // e.g., "ATX, mATX, ITX" (text input)
  maxGpuLength: string      // e.g., "380mm" (text input)
  maxCpuCooler: string      // e.g., "165mm" (text input)
  driveBays: string         // e.g., "2x 3.5", 4x 2.5"" (text input)
}
```

**Example:**
- Form Factor: `Mid Tower` (select: Full Tower, Mid Tower, Mini Tower, Small Form Factor)
- Motherboard Support: `ATX, mATX, ITX` (text input)
- Max GPU Length: `380mm` (text input)
- Max CPU Cooler Height: `165mm` (text input)
- Drive Bays: `2x 3.5", 4x 2.5"` (text input)

---

### COOLING
```typescript
{
  type: string         // e.g., "AIO Liquid Cooler" (select dropdown)
  radiatorSize: string // e.g., "360mm" (select dropdown)
  fanSize: string      // e.g., "3x 120mm" (text input)
  tdp: string          // e.g., "250W" (text input)
  height: string       // e.g., "165mm" (text input)
}
```

**Example:**
- Type: `AIO Liquid Cooler` (select: Air Cooler, AIO Liquid Cooler, Custom Loop)
- Radiator Size: `360mm` (select: 120mm, 240mm, 280mm, 360mm, 420mm)
- Fan Size: `3x 120mm` (text input)
- TDP Rating: `250W` (text input)
- Height: `165mm` (text input)

---

## 🔧 Implementation Details

### Data Structure

```typescript
// Form data structure
interface ComponentFormData {
  name: string;
  type: string;
  price: string;
  specifications: Record<string, string>; // Key-value pairs
}

// Specification field definition
const specificationFields: Record<
  string,
  Array<{
    name: string;
    label: string;
    type?: string;        // "text" | "number" | "select"
    placeholder?: string;
    options?: string[];   // For select fields
  }>
> = {
  CPU: [...],
  MOTHERBOARD: [...],
  // etc.
};
```

### Auto Type Conversion

Numeric strings are automatically converted to numbers when saving:

```typescript
// Input: "24" (string)
// Saved: 24 (number)

// Input: "3.0 GHz" (string)
// Saved: "3.0 GHz" (string)

const specifications = Object.entries(formData.specifications).reduce(
  (acc, [key, value]) => {
    if (value && value.trim() !== "") {
      const numValue = parseFloat(value);
      acc[key] = !isNaN(numValue) && /^\d+(\.\d+)?$/.test(value.trim())
        ? numValue
        : value;
    }
    return acc;
  },
  {} as Record<string, string | number>
);
```

### Validation Rules

1. **At least one field required** - User must fill at least one specification field
2. **Type selection required** - Must select component type before specifications appear
3. **Empty fields ignored** - Empty specification fields are not saved to database

```typescript
// Validation
const hasSpecifications = Object.values(formData.specifications).some(
  (value) => value && value.trim() !== "",
);
if (!hasSpecifications) {
  errors.specifications = "At least one specification is required";
}
```

---

## 🎨 UI Behavior

### Form Flow

1. **Select Component Type** → Specification fields appear
2. **Fill Specification Fields** → At least one required
3. **Submit Form** → Data converted and saved

### Visual States

```typescript
// No type selected
{!formData.type && (
  <div className="rounded-lg border border-dashed border-border p-8 text-center">
    <p className="text-sm text-muted-foreground">
      Select a component type to see specification fields
    </p>
  </div>
)}

// Type selected - show fields
{formData.type && specificationFields[formData.type] && (
  <div className="grid gap-3 rounded-lg border border-border p-4">
    {/* Dynamic fields here */}
  </div>
)}
```

### Field Styling

- ✅ Labeled inputs with descriptive text
- ✅ Placeholders with examples
- ✅ Border container for visual grouping
- ✅ Responsive grid layout
- ✅ Error messages at section level

---

## 📝 Usage Example

### Creating a CPU Component

**Step 1:** Fill basic info
- Name: `Intel Core i9-13900K`
- Type: `CPU` ← **Specification fields appear**
- Price: `589.99`

**Step 2:** Fill specifications
- Cores: `24`
- Threads: `32`
- Base Clock: `3.0 GHz`
- Boost Clock: `5.8 GHz`
- TDP: `125W`
- Socket: `LGA1700`

**Step 3:** Submit
- Data saved as:
```json
{
  "name": "Intel Core i9-13900K",
  "type": "CPU",
  "price": 589.99,
  "specifications": {
    "cores": 24,
    "threads": 32,
    "baseClock": "3.0 GHz",
    "boostClock": "5.8 GHz",
    "tdp": "125W",
    "socket": "LGA1700"
  }
}
```

---

## 🔄 Editing Components

When editing a component:

1. **Dialog opens** with pre-filled data
2. **Specifications converted** from database to form format
3. **User edits** any field
4. **Submit updates** with new values

```typescript
// Converting from DB to form
const specs = component.specifications as Record<string, string | number>;
const specificationsForForm = Object.entries(specs).reduce(
  (acc, [key, value]) => {
    acc[key] = String(value); // Convert all to strings for inputs
    return acc;
  },
  {} as Record<string, string>
);
```

---

## 🎯 Benefits

### For Users
- ✅ **No JSON knowledge required** - Simple form inputs
- ✅ **Clear field labels** - Know what to enter
- ✅ **Example placeholders** - Guidance for each field
- ✅ **Type-safe inputs** - Number fields for numeric values
- ✅ **Select dropdowns** - Pre-defined options for common values
- ✅ **Consistent data** - Standardized values across components

### For Developers
- ✅ **Type safety** - TypeScript interfaces
- ✅ **Validation** - Built-in field validation
- ✅ **Extensible** - Easy to add new component types
- ✅ **Maintainable** - Clear field definitions

---

## 🚀 Adding New Component Types

To add a new component type:

1. **Add to enum** (in Prisma schema)
```prisma
enum ComponentType {
  CPU
  MOTHERBOARD
  // ... existing types
  NEW_TYPE  // Add here
}
```

2. **Add specification fields**
```typescript
const specificationFields = {
  // ... existing types
  NEW_TYPE: [
    { name: "field1", label: "Field 1", placeholder: "e.g., value" },
    { name: "field2", label: "Field 2", type: "number", placeholder: "e.g., 10" },
    { name: "field3", label: "Field 3", type: "select", options: ["Option 1", "Option 2"] },
  ],
};
```

3. **Add color (optional)**
```typescript
const componentTypeColors = {
  // ... existing types
  NEW_TYPE: "bg-pink-500/10 text-pink-500 border-pink-500/20",
};
```

4. **Done!** - New type automatically works in the form

---

## 🧪 Testing Checklist

- [ ] Select each component type - correct fields appear
- [ ] Fill numeric fields - saved as numbers
- [ ] Fill text fields - saved as strings
- [ ] Select dropdown options - values saved correctly
- [ ] Leave some fields empty - only filled fields saved
- [ ] Submit with all fields empty - validation error
- [ ] Edit component - fields pre-filled correctly (including selects)
- [ ] Change type while editing - fields update
- [ ] Mixed numeric/text/select fields - types preserved
- [ ] All select dropdowns show correct options

---

## 📊 Database Storage

Specifications are stored as JSON in MySQL:

```sql
-- Component table
CREATE TABLE Component (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  type ENUM('CPU', 'MOTHERBOARD', ...),
  price DECIMAL(10,2),
  specifications JSON,  -- Dynamic fields stored here
  createdAt DATETIME,
  updatedAt DATETIME
);

-- Example record
{
  "id": 1,
  "name": "Intel Core i9-13900K",
  "type": "CPU",
  "price": 589.99,
  "specifications": {
    "cores": 24,
    "threads": 32,
    "baseClock": "3.0 GHz",
    "boostClock": "5.8 GHz",
    "tdp": "125W",
    "socket": "LGA1700"
  }
}
```

---

## 🎨 UI Screenshots

### Before (JSON Textarea)
```
┌─────────────────────────────────────────┐
│ Specifications (JSON format) *          │
│ ┌─────────────────────────────────────┐ │
│ │ {                                   │ │
│ │   "cores": 24,                      │ │
│ │   "threads": 32,                    │ │
│ │   "baseClock": "3.0 GHz"            │ │
│ │ }                                   │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### After (Dynamic Fields)
```
┌─────────────────────────────────────────┐
│ Specifications *                         │
│ ┌─────────────────────────────────────┐ │
│ │ Cores                               │ │
│ │ [24                             ]   │ │
│ │                                     │ │
│ │ Threads                             │ │
│ │ [32                             ]   │ │
│ │                                     │ │
│ │ Base Clock                          │ │
│ │ [3.0 GHz                        ]   │ │
│ │                                     │ │
│ │ Boost Clock                         │ │
│ │ [5.8 GHz                        ]   │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 📚 Related Files

| File | Purpose |
|------|---------|
| `app/(dashboard)/components/page.tsx` | Main implementation |
| `packages/db/prisma/schema.prisma` | ComponentType enum |
| `CRUD_IMPLEMENTATION.md` | Full CRUD documentation |

---

**Version:** 1.3.0  
**Last Updated:** November 2024  
**Status:** ✅ Implemented & Tested

## 🆕 Changelog

### v1.3.0 - Select Field Support
- Added select dropdown support for common specification fields
- Pre-defined options for standardized values:
  - CPU: Socket types (LGA1700, AM5, etc.)
  - RAM: Capacity (8GB-128GB), Type (DDR4/DDR5)
  - Storage: Capacity, Type, Interface, Form Factor
  - PSU: Wattage, Efficiency ratings, Modular types
  - Case: Form factors
  - Cooling: Types, Radiator sizes
- Improved user experience with consistent data entry
- Reduced typos and variations in component data

### v1.2.0 - Dynamic Specification Fields
- Replaced JSON textarea with type-specific input fields
- Auto type conversion for numeric values
- Field validation and error messages

### v1.1.0 - CRUD Implementation
- Full Create, Read, Update, Delete operations
- Toast notifications and loading states
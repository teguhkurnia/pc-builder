# PC Builder - Compatibility System Guide 🔒

## Overview

PC Builder menggunakan **Smart Compatibility System** yang otomatis mengecek kompatibilitas antar komponen dan mengunci langkah-langkah yang bergantung pada pemilihan komponen sebelumnya.

---

## 🎯 Tujuan Sistem

1. **Mencegah Incompatibility** - User tidak bisa memilih komponen yang tidak kompatibel
2. **Guided Experience** - User dipandu step-by-step dengan urutan yang logis
3. **Educational** - User belajar tentang dependencies antar komponen PC
4. **Error Prevention** - Validasi built-in sebelum complete build

---

## 📋 Build Steps Order (Logical)

### Step 1: CPU (Processor) ⚡
- **Status**: Required ✅
- **Dependencies**: None
- **Unlocks**: Motherboard, Cooling
- **Why First?**: CPU socket adalah base untuk kompatibilitas Motherboard dan Cooling

### Step 2: Motherboard 🔧
- **Status**: Required ✅
- **Dependencies**: CPU (socket must match)
- **Unlocks**: RAM, Case
- **Locked Until**: CPU selected
- **Compatibility Check**: `motherboard.socket === cpu.socket`

### Step 3: RAM (Memory) 💾
- **Status**: Required ✅
- **Dependencies**: Motherboard (memory type must match)
- **Unlocks**: Nothing
- **Locked Until**: Motherboard selected
- **Compatibility Check**: `ram.memory_type === motherboard.memory_type`

### Step 4: GPU (Graphics Card) 🎮
- **Status**: Optional ⭕
- **Dependencies**: None
- **Unlocks**: Nothing
- **Note**: Optional jika CPU punya integrated graphics

### Step 5: Storage 💿
- **Status**: Required ✅
- **Dependencies**: None
- **Unlocks**: Nothing
- **Note**: At least one storage device needed

### Step 6: PSU (Power Supply) 🔌
- **Status**: Required ✅
- **Dependencies**: None (future: total wattage)
- **Unlocks**: Nothing
- **Note**: Should provide enough wattage for all components

### Step 7: Cooling ❄️
- **Status**: Optional ⭕
- **Dependencies**: CPU (socket must match)
- **Unlocks**: Nothing
- **Locked Until**: CPU selected
- **Compatibility Check**: `cooling.socket === cpu.socket`

### Step 8: Case 📦
- **Status**: Required ✅
- **Dependencies**: Motherboard (form factor must fit)
- **Unlocks**: Nothing
- **Locked Until**: Motherboard selected
- **Compatibility Check**: `case.form_factor supports motherboard.form_factor`

---

## 🔐 Dependency Rules

### Rule 1: CPU → Motherboard
**Requirement**: Socket compatibility

```typescript
// Example
CPU: { socket: "LGA1700" }
Motherboard: { socket: "LGA1700" } // ✅ Compatible
Motherboard: { socket: "AM5" }     // ❌ Incompatible (filtered out)
```

**Why?**: CPU dan Motherboard harus memiliki socket yang sama agar CPU bisa dipasang.

### Rule 2: Motherboard → RAM
**Requirement**: Memory type compatibility

```typescript
// Example
Motherboard: { memory_type: "DDR5" }
RAM: { type: "DDR5" }  // ✅ Compatible
RAM: { type: "DDR4" }  // ❌ Incompatible (filtered out)
```

**Why?**: Motherboard hanya support satu jenis memory (DDR4 atau DDR5).

### Rule 3: CPU → Cooling
**Requirement**: Socket compatibility

```typescript
// Example
CPU: { socket: "LGA1700" }
Cooling: { socket: "LGA1700" }                    // ✅ Compatible
Cooling: { compatibility: ["LGA1700", "AM5"] }    // ✅ Compatible
Cooling: { socket: "AM4" }                        // ❌ Incompatible
```

**Why?**: Cooler mounting mechanism berbeda untuk setiap socket.

### Rule 4: Motherboard → Case
**Requirement**: Form factor compatibility

```typescript
// Example
Motherboard: { form_factor: "ATX" }
Case: { form_factor: "ATX" }                           // ✅ Compatible
Case: { compatibility: ["ATX", "Micro-ATX"] }          // ✅ Compatible
Case: { form_factor: "Mini-ITX" }                      // ❌ Too small
```

**Why?**: Case harus cukup besar untuk fit motherboard size.

---

## 🎨 Visual Indicators

### Lock Icon 🔒
- **Where**: Step indicators, Summary panel
- **Meaning**: Step is locked, dependencies not met
- **Color**: Grey/Slate
- **Tooltip**: Shows which component needs to be selected first

### Required Marker (*)
- **Where**: Step indicators, Summary panel
- **Meaning**: Component is required for build completion
- **Color**: Red
- **Action**: Cannot skip this step

### Compatibility Badge ✓
- **Where**: Component cards
- **Meaning**: Component is compatible with selected parts
- **Color**: Green
- **Info**: Shows matching spec (socket, memory type, etc)

### Disabled State
- **Where**: Locked step indicators
- **Style**: Reduced opacity, cursor not-allowed
- **Interaction**: Cannot click, shows tooltip on hover

---

## 🔄 User Flow Examples

### Scenario 1: First Time User
1. Opens builder → Sees info banner
2. Reads about compatibility system
3. Starts at Step 1 (CPU) - only unlocked step
4. Selects CPU (e.g., Intel i7-13700K, LGA1700)
5. Step 2 (Motherboard) & Step 7 (Cooling) unlock
6. Goes to Motherboard → Only sees LGA1700 boards
7. Selects Motherboard (e.g., ASUS Z790, DDR5)
8. Step 3 (RAM) & Step 8 (Case) unlock
9. Goes to RAM → Only sees DDR5 memory
10. Continues building with compatible parts

### Scenario 2: Trying to Access Locked Step
1. User at Step 1 (CPU)
2. Tries to click Step 3 (RAM) indicator
3. Step is locked (grey, disabled)
4. Hover shows tooltip: "Locked: Must match motherboard memory type"
5. User realizes needs to select CPU → Motherboard first
6. Follows correct order

### Scenario 3: Changing CPU Mid-Build
1. User already selected: CPU (Intel) → Motherboard (LGA1700)
2. User goes back to Step 1, changes CPU to AMD (AM5)
3. System auto-resets Motherboard selection (incompatible)
4. Motherboard step locked again
5. User must reselect compatible AM5 motherboard
6. Cascading reset untuk RAM if memory type changes

---

## ⚙️ Technical Implementation

### Compatibility Check Function
```typescript
const isComponentCompatible = (component, stepKey) => {
  const filter = getCompatibilityFilter(stepKey);
  if (!filter) return true; // No dependencies

  const specs = component.specifications;

  switch (stepKey) {
    case "motherboard":
      return specs.socket === filter.socket;
    case "ram":
      return specs.type === filter.memoryType;
    case "cooling":
      return specs.socket === filter.socket ||
             specs.compatibility?.includes(filter.socket);
    case "case":
      return specs.form_factor === filter.formFactor ||
             specs.compatibility?.includes(filter.formFactor);
    default:
      return true;
  }
};
```

### Step Locking Function
```typescript
const isStepLocked = (stepIndex) => {
  const step = BUILD_STEPS[stepIndex];
  if (!step || step.dependsOn.length === 0) return false;

  // Check if all dependencies are fulfilled
  return step.dependsOn.some((depKey) => {
    const componentId = buildState[`${depKey}Id`];
    return !componentId;
  });
};
```

### Auto-filtering Components
```typescript
const currentComponents = components.filter((c) => {
  if (c.type !== currentStepConfig.type) return false;
  return isComponentCompatible(c, currentStepConfig.key);
});
```

---

## 📊 Compatibility Matrix

| Component    | Depends On   | Check Field      | Example Values           |
|--------------|-------------|------------------|--------------------------|
| Motherboard  | CPU         | socket           | LGA1700, AM5, AM4        |
| RAM          | Motherboard | memory_type      | DDR5, DDR4               |
| Cooling      | CPU         | socket           | LGA1700, AM5, Universal  |
| Case         | Motherboard | form_factor      | ATX, Micro-ATX, Mini-ITX |

---

## 🚨 Validation Rules

### On Component Selection
- ✅ Check compatibility with dependent components
- ✅ Auto-save to database
- ✅ Unlock next dependent steps
- ✅ Update total price

### On Step Navigation
- ✅ Block navigation to locked steps
- ✅ Auto-skip locked steps in Next button
- ✅ Show tooltip for locked steps

### On Build Completion
- ✅ Check all required components selected
- ✅ Show alert if missing required parts
- ✅ List missing components
- ✅ Prevent completion until valid

---

## 🎓 Educational Aspects

### What Users Learn
1. **Build Order Matters** - Can't just pick parts randomly
2. **Socket Compatibility** - CPU and Motherboard must match
3. **Memory Standards** - DDR4 vs DDR5 differences
4. **Form Factors** - Motherboard and Case sizing
5. **Dependencies** - How PC components relate to each other

### Info Provided
- Dependency tooltips on locked steps
- Compatibility badges showing matching specs
- Info banner explaining the system
- Empty state messages guiding next action
- Required markers showing critical components

---

## 🔧 Component Specification Requirements

### For Compatibility to Work, Components Must Have:

#### CPU Specifications
```typescript
{
  socket: "LGA1700" | "AM5" | "AM4" | etc,
  // Other specs...
}
```

#### Motherboard Specifications
```typescript
{
  socket: "LGA1700" | "AM5" | "AM4" | etc,
  memory_type: "DDR5" | "DDR4",
  form_factor: "ATX" | "Micro-ATX" | "Mini-ITX",
  // Other specs...
}
```

#### RAM Specifications
```typescript
{
  type: "DDR5" | "DDR4",
  // or
  memory_type: "DDR5" | "DDR4",
  // Other specs...
}
```

#### Cooling Specifications
```typescript
{
  socket: "LGA1700" | "AM5" | "AM4" | "Universal",
  // or
  compatibility: ["LGA1700", "AM5", "AM4"],
  // Other specs...
}
```

#### Case Specifications
```typescript
{
  form_factor: "ATX" | "Micro-ATX" | "Mini-ITX",
  // or
  compatibility: ["ATX", "Micro-ATX", "Mini-ITX"],
  // Other specs...
}
```

---

## 🐛 Troubleshooting

### Problem: All steps are locked
**Solution**: Make sure to start from Step 1 (CPU). CPU is the only unlocked step initially.

### Problem: No compatible components showing
**Solution**: 
- Check previous selections (CPU, Motherboard)
- Try different CPU/Motherboard with more common specs
- Verify component specifications in database

### Problem: Can't complete build
**Solution**: 
- Check alert message for missing required components
- Look for red asterisk (*) on incomplete steps
- Ensure all required components are selected

### Problem: Want to change CPU after selecting Motherboard
**Solution**: 
- Go back to Step 1, select new CPU
- Motherboard will be auto-reset if incompatible
- Reselect compatible Motherboard
- Continue with build

---

## 🚀 Future Enhancements

### Planned Improvements
- [ ] **Advanced Socket Checking** - Check PCIe generations, M.2 slots
- [ ] **PSU Wattage Calculator** - Auto-calculate total wattage needed
- [ ] **Bottleneck Detection** - Warn if CPU-GPU pairing is unbalanced
- [ ] **RGB Compatibility** - Check RGB header compatibility
- [ ] **Dimension Checking** - GPU length vs Case clearance
- [ ] **Cooling Performance** - TDP vs Cooler rating
- [ ] **Multi-component Support** - Multiple storage, multiple RAM sticks
- [ ] **Alternative Suggestions** - Suggest similar compatible components

### Enhancement Ideas
- Smart recommendations based on selected components
- Price/performance ratio calculator
- Build presets (Gaming, Workstation, Budget)
- Component comparison tool
- Benchmark integration
- Real-time stock checking
- Price history & alerts

---

## 📚 Resources

### Learn More About PC Components
- CPU Sockets: Intel LGA vs AMD AM series
- Memory Standards: DDR4 vs DDR5 differences
- Motherboard Form Factors: ATX, Micro-ATX, Mini-ITX
- PCIe Generations: 3.0, 4.0, 5.0
- Power Supply: 80+ certifications, wattage

### For Developers
- See `QUICK_START.md` for implementation details
- See `FEATURES.md` for complete feature list
- See `README.md` for setup instructions
- See `.cursorrules` for coding standards

---

## 💡 Best Practices

### For Users
1. Start with CPU selection (base component)
2. Read compatibility badges carefully
3. Don't skip required components
4. Review build summary before completing
5. Use detail modal to verify specs

### For Developers
1. Always validate component specs in database
2. Provide clear error messages
3. Test all dependency chains
4. Handle edge cases gracefully
5. Keep compatibility logic simple and maintainable

---

## 📞 Support

If you encounter compatibility issues:
1. Check component specifications in database
2. Verify all required fields are present
3. Review console for error messages
4. Check COMPATIBILITY_GUIDE.md (this file)
5. Contact development team

---

**Version**: 2.0.0  
**Last Updated**: 2024-11-22  
**Status**: ✅ Production Ready
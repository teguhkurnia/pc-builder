# PC Builder - Web Scraping Scripts 🕷️

Collection of web scraping scripts untuk mengumpulkan data komponen PC dari berbagai sumber.

## 📋 Overview

Scripts ini menggunakan **Cheerio** dan **Axios** untuk scraping data komponen PC dari website PC-Kombo, dengan validasi menggunakan **Zod** dan langsung menyimpan ke database menggunakan **Prisma**.

---

## 🎯 Available Scripts

### 1. CPU Scraper (`scrape-cpu.ts`)
Scrapes processor data dengan detailed specifications:
- **Model Info**: producer, mpn, ean, upc, year
- **Clock Speeds**: baseClock, turboClock, unlockedMultiplier
- **Cores & Threads**: cores, threads
- **Cache**: l1Cache, l2Cache, l3Cache
- **Power & Socket**: tdp, socket (LGA1700, AM5, AM4, dll)
- **Graphics**: integratedGraphics (iGPU)
- **Additional**: architecture, process, maxMemory, memoryChannels, pcieVersion, productPage

**URL**: `https://www.pc-kombo.com/ca/components/cpus`

### 2. Motherboard Scraper (`scrape-motherboard.ts`)
Scrapes motherboard data dengan specifications:
- socket (compatibility dengan CPU)
- chipset
- memoryType (DDR4/DDR5) - untuk RAM compatibility
- memorySlots & maxMemory
- formFactor (ATX, Micro-ATX, Mini-ITX) - untuk Case compatibility
- pcieSlots, m2Slots, sataPorts
- usbPorts, ethernet, wifi

**URL**: `https://www.pc-kombo.com/ca/components/motherboards`

### 3. RAM Scraper (`scrape-ram.ts`)
Scrapes memory data dengan specifications:
- type (DDR4/DDR5) - untuk Motherboard compatibility
- capacity (8GB, 16GB, 32GB, dll)
- speed (3200MHz, 3600MHz, dll)
- modules (1x8GB, 2x8GB, dll)
- casLatency, voltage
- ecc, rgb

**URL**: `https://www.pc-kombo.com/ca/components/ram`

### 4. GPU Scraper (`scrape-gpu.ts`)
Scrapes graphics card data dengan specifications:
- chipset (RTX 4090, RX 7900 XTX, dll)
- memory (VRAM)
- coreClock & boostClock
- cudaCores / streamProcessors
- tdp
- length, width, slots
- powerConnectors
- recommendedPsu

**URL**: `https://www.pc-kombo.com/ca/components/graphicscards`

### 5. Storage Scraper (`scrape-storage.ts`)
Scrapes storage device data dengan specifications:
- type (SSD, HDD, NVMe)
- capacity (500GB, 1TB, 2TB, dll)
- interface (SATA, NVMe, M.2)
- formFactor
- readSpeed/writeSpeed
- cache, tbw, nandType
- controller, rpm (for HDD)

**URL**: `https://www.pc-kombo.com/ca/components/storage`

### 6. PSU Scraper (`scrape-psu.ts`)
Scrapes power supply data dengan specifications:
- wattage (650W, 750W, 850W, dll)
- efficiency (80+ Gold, Platinum, Titanium)
- modular (Full, Semi, Non-Modular)
- formFactor (ATX, SFX)
- pcieConnectors/sataConnectors/molexConnectors
- fanSize, noiseLevel
- warranty, pfc, protection

**URL**: `https://www.pc-kombo.com/ca/components/powersupplies`

### 7. Case Scraper (`scrape-case.ts`)
Scrapes PC case data dengan specifications:
- formFactor (ATX, Micro-ATX, Mini-ITX) - untuk Motherboard compatibility
- compatibility (supported motherboard sizes)
- maxGpuLength
- maxCpuCoolerHeight
- driveBays, expansionSlots
- frontPanelUsb
- sidePanel, psuPosition
- dimensions, weight
- fansIncluded/maxFans
- radiatorSupport, rgb

**URL**: `https://www.pc-kombo.com/ca/components/cases`

### 8. Cooling Scraper (`scrape-cooling.ts`)
Scrapes CPU cooler data dengan specifications:
- socket (LGA1700, AM5, AM4, dll) - untuk CPU compatibility
- compatibility (multiple socket support)
- type (Air Cooler, AIO, Custom Loop)
- coolerHeight
- fanSize, radiatorSize
- tdpRating
- noiseLevel, rpm
- rgb, fanCount

**URL**: `https://www.pc-kombo.com/ca/components/cpucoolers`

---

## 🚀 Usage

### Prerequisites
```bash
# Make sure you're in the root directory
cd pc-builder

# Install dependencies
pnpm install
```

### Run Individual Scrapers

```bash
# Scrape CPUs
pnpm --filter @repo/scripts tsx src/scrape-cpu.ts

# Scrape Motherboards
pnpm --filter @repo/scripts tsx src/scrape-motherboard.ts

# Scrape RAM
pnpm --filter @repo/scripts tsx src/scrape-ram.ts

# Scrape GPUs
pnpm --filter @repo/scripts tsx src/scrape-gpu.ts

# Scrape Storage
pnpm --filter @repo/scripts tsx src/scrape-storage.ts

# Scrape PSUs
pnpm --filter @repo/scripts tsx src/scrape-psu.ts

# Scrape Cases
pnpm --filter @repo/scripts tsx src/scrape-case.ts

# Scrape Cooling
pnpm --filter @repo/scripts tsx src/scrape-cooling.ts
```

### Run All Scrapers (Recommended Order)

```bash
# 1. CPU first (needed for motherboard & cooling compatibility)
pnpm --filter @repo/scripts tsx src/scrape-cpu.ts

# 2. Motherboard (needed for RAM & case compatibility)
pnpm --filter @repo/scripts tsx src/scrape-motherboard.ts

# 3. RAM (depends on motherboard memory type)
pnpm --filter @repo/scripts tsx src/scrape-ram.ts

# 4. Cooling (depends on CPU socket)
pnpm --filter @repo/scripts tsx src/scrape-cooling.ts

# 5. Case (depends on motherboard form factor)
pnpm --filter @repo/scripts tsx src/scrape-case.ts

# 6. GPU, Storage, PSU (independent)
pnpm --filter @repo/scripts tsx src/scrape-gpu.ts
pnpm --filter @repo/scripts tsx src/scrape-storage.ts
pnpm --filter @repo/scripts tsx src/scrape-psu.ts
```

---

## 🔧 How It Works

### 1. Fetch HTML
```typescript
const { data } = await axios.get(url, {
  headers: {
    "User-Agent": "Mozilla/5.0 ..." // Prevent blocking
  }
});
```

### 2. Parse with Cheerio
```typescript
const $ = cheerio(data);
const elements = $("#hardware li");
```

### 3. Extract Specifications
```typescript
const getSpec = (label: string): string => {
  return $("dt")
    .filter((i, el) => $(el).text().trim() === label)
    .next()
    .text()
    .trim();
};
```

### 4. Validate with Zod
```typescript
const validatedComponent = componentSchema.parse(component);
```

### 5. Save to Database
```typescript
await db.component.create({
  data: validatedComponent,
});
```

### 6. Handle Errors
- Validation errors → Save to JSON file (`scraped-data/*.json`)
- Duplicate entries → Skip with log message
- Network errors → Log error message

---

## 📊 Data Structure

### Common Fields (All Components)
```typescript
{
  name: string,           // Component name
  type: ComponentType,    // CPU, MOTHERBOARD, RAM, etc
  price: number,          // Price in currency
  imageUrl: string | null, // Product image URL
  specifications: object   // Component-specific specs
}
```

### Compatibility Fields (Important!)

#### CPU
```typescript
specifications: {
  // Model Info
  producer: string,        // "Intel", "AMD"
  mpn: string,            // Manufacturer Part Number
  ean: string,            // European Article Number
  upc: string,            // Universal Product Code
  year: string,           // Release year
  
  // Clock speeds
  baseClock: string,      // "3.5 GHz"
  turboClock: string,     // "5.0 GHz"
  unlockedMultiplier: string, // "Yes" or checkmark
  
  // Cores & Threads
  cores: number,          // 8, 16, etc
  threads: number,        // 16, 32, etc
  
  // Cache
  l1Cache: string,        // L1 cache size
  l2Cache: string,        // L2 cache size
  l3Cache: string,        // L3 cache size
  
  // Power & Socket (CRITICAL for compatibility)
  tdp: string,            // "125 W"
  socket: string,         // "LGA1700", "AM5", "AM4", etc
  
  // Graphics
  integratedGraphics: string, // "Intel UHD 770" or undefined
  
  // Additional Info
  architecture: string,    // "Zen 4", "Raptor Lake"
  process: string,         // "5nm", "7nm"
  maxMemory: string,       // "128GB DDR5"
  memoryChannels: string,  // "Dual Channel"
  pcieVersion: string,     // "PCIe 5.0"
  productPage: string,     // Manufacturer URL
}
```

#### Motherboard
```typescript
specifications: {
  socket: string,        // Must match CPU socket
  memoryType: string,    // "DDR4" or "DDR5"
  formFactor: string,    // "ATX", "Micro-ATX", "Mini-ITX"
  // ... other specs
}
```

#### RAM
```typescript
specifications: {
  type: string, // "DDR4" or "DDR5" - must match motherboard
  // ... other specs
}
```

#### Cooling
```typescript
specifications: {
  socket: string,        // Must match CPU socket
  compatibility: string, // Multiple socket support
  // ... other specs
}
```

#### Case
```typescript
specifications: {
  formFactor: string,    // Must support motherboard form factor
  compatibility: string, // Supported motherboard sizes
  // ... other specs
}
```

---

## 📁 Output Files

### Database (Primary)
Data disimpan langsung ke database via Prisma:
```sql
INSERT INTO Component (name, type, price, imageUrl, specifications)
VALUES (...)
```

### JSON Files (Backup/Fallback)
Jika validation gagal, data disimpan ke:
```
scraped-data/
├── cpus.json
├── motherboards.json
├── rams.json
├── gpus.json
├── storages.json
├── psus.json
├── cases.json
└── coolings.json
```

---

## ⚠️ Important Notes

### Rate Limiting
- Scripts tidak implement rate limiting
- Bisa menyebabkan IP blocking jika terlalu cepat
- **Recommendation**: Tambahkan delay antar requests

### Example Rate Limiting:
```typescript
// Add this helper function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Use in scraping loop
for (let i = 0; i < elements.length; i++) {
  const element = elements[i];
  const url = $(element).find("a").attr("href") || "";
  
  const component = await scrapeComponentDetail(url);
  // ... process component
  
  // Wait 1 second between requests
  await delay(1000);
}
```

### Duplicate Handling
- Scripts check for existing components by name
- If exists, skips and logs: `"Component already exists, skipping: {name}"`
- No updates to existing data (insert only)

### Error Handling
- Validation errors → Saved to JSON
- Network errors → Logged to console
- Missing specs → Uses empty string or default values

---

## 🐛 Troubleshooting

### Problem: No elements found
**Solution**:
- Check if website structure changed
- Verify selector: `$("#hardware li")`
- Check User-Agent header

### Problem: Validation errors
**Solution**:
- Check `scraped-data/*.json` files for invalid data
- Review Zod schema requirements
- Some specs might be optional but marked as required

### Problem: Database errors
**Solution**:
- Ensure Prisma client is generated: `npx prisma generate`
- Check database connection in `.env`
- Verify schema matches component types

### Problem: 403 Forbidden / 429 Too Many Requests
**Solution**:
- Add delay between requests
- Change User-Agent header
- Use proxy (advanced)
- Reduce concurrent requests

---

## 🔍 Validation Schemas

Each scraper uses Zod for validation:

```typescript
const componentSchema = createComponentSchema.extend({
  specifications: z.object({
    // Component-specific fields
    field1: z.string(),
    field2: z.number(),
    field3: z.string().optional(),
  }),
});
```

### Required vs Optional
- **Required**: Will throw error if missing
- **Optional**: Uses `.optional()`, allows undefined
- Check individual scraper files for specific requirements

---

## 📈 Performance Tips

1. **Run scrapers during off-peak hours**
2. **Add rate limiting** (see example above)
3. **Use database indexes** for faster lookups
4. **Batch operations** instead of individual inserts
5. **Cache parsed HTML** if scraping multiple times

---

## 🚦 Best Practices

1. **Respect robots.txt**: Check `https://www.pc-kombo.com/robots.txt`
2. **Use User-Agent**: Identify your scraper properly
3. **Handle errors gracefully**: Don't crash on single failure
4. **Log progress**: Know where you are in the scraping process
5. **Store raw data**: Keep JSON backups for validation failures
6. **Test on small dataset first**: Don't scrape everything at once

---

## 📝 Maintenance

### Updating Schemas
If website structure changes, update:
1. CSS selectors in scraper functions
2. Zod validation schemas
3. Field mappings in `getSpec()` calls

### Adding New Fields
1. Add to Zod schema
2. Add to `getSpec()` extraction
3. Update Prisma schema if needed
4. Run migration: `npx prisma migrate dev`

---

## 🎯 Future Improvements

- [ ] Add rate limiting by default
- [ ] Implement retry logic for failed requests
- [ ] Add progress bars (using `cli-progress`)
- [ ] Support multiple sources (not just PC-Kombo)
- [ ] Add image downloading
- [ ] Implement incremental updates (update existing)
- [ ] Add concurrent scraping with queue
- [ ] Create master script to run all scrapers
- [ ] Add cron job support for scheduled scraping
- [ ] Implement data validation dashboard

---

## 📄 License

Private project - PC Builder Platform

---

**Last Updated**: 2024-11-22  
**Version**: 1.0.0
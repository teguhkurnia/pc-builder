# Changelog - PC Builder Scraping Scripts

All notable changes to the scraping scripts will be documented in this file.

## [2.0.0] - 2024-11-22

### 🎉 Major Release - Complete Scraper Suite

#### Added
- **7 New Scrapers** for complete PC component coverage:
  - `scrape-motherboard.ts` - Motherboard scraper with compatibility specs
  - `scrape-ram.ts` - RAM scraper with memory type compatibility
  - `scrape-gpu.ts` - Graphics card scraper
  - `scrape-storage.ts` - Storage device scraper
  - `scrape-psu.ts` - Power supply scraper
  - `scrape-case.ts` - PC case scraper with form factor compatibility
  - `scrape-cooling.ts` - CPU cooler scraper with socket compatibility

#### Enhanced
- **CPU Scraper (`scrape-cpu.ts`)** - Significantly expanded specifications:
  - **Model Info**: Producer, MPN, EAN, UPC, Year
  - **Clock Details**: Base Clock, Turbo Clock, Unlocked Multiplier
  - **Cache Hierarchy**: L1, L2, L3 Cache
  - **Integrated Graphics**: iGPU detection and model
  - **Advanced Specs**: Architecture, Process, Max Memory, Memory Channels, PCIe Version
  - **Product Links**: Manufacturer product page URL
  
#### Improved
- Refactored CPU scraper with cleaner code structure
- Added `getSpec()` helper function for consistent data extraction
- Better error handling for missing specifications
- Integrated graphics detection (handles checkmarks and text)
- More robust number parsing with fallback values

#### Documentation
- Created comprehensive `README.md` with:
  - Detailed usage instructions
  - Compatibility matrix
  - Troubleshooting guide
  - Best practices
  - Performance tips
- Added specification examples for all component types
- Documented compatibility fields for builder system integration

---

## [1.0.0] - 2024-11-20 (Initial)

### Added
- Initial CPU scraper implementation
- Basic specifications extraction:
  - Cores & Threads
  - Base Clock & Boost Clock
  - TDP
  - Socket
- Zod validation schema
- Database integration via Prisma
- JSON fallback for validation errors
- Duplicate prevention by name

---

## Compatibility System Integration

### Critical Fields for Builder Compatibility

The following fields are essential for the Smart Compatibility System in the builder app:

#### CPU
- `socket` - Matches with Motherboard and Cooling

#### Motherboard
- `socket` - Must match CPU socket
- `memory_type` - Matches with RAM (DDR4/DDR5)
- `form_factor` - Matches with Case (ATX/Micro-ATX/Mini-ITX)

#### RAM
- `type` - Must match Motherboard memory_type

#### Cooling
- `socket` - Must match CPU socket
- `compatibility` - Multiple socket support

#### Case
- `form_factor` - Must support Motherboard form factor
- `compatibility` - Supported motherboard sizes

---

## Specification Changes

### CPU Specifications v1.0.0 → v2.0.0

#### Removed
- ~~`baseClock`~~ → Renamed to `base_clock`
- ~~`boostClock`~~ → Renamed to `turbo_clock`

#### Added (New in v2.0.0)
- `producer` - Manufacturer name (Intel, AMD)
- `mpn` - Manufacturer Part Number
- `ean` - European Article Number
- `upc` - Universal Product Code
- `year` - Release year
- `unlocked_multiplier` - Overclocking support
- `l1_cache` - L1 cache size
- `l2_cache` - L2 cache size
- `l3_cache` - L3 cache size (previously just "cache")
- `integrated_graphics` - iGPU model
- `architecture` - CPU microarchitecture
- `process` - Manufacturing process (5nm, 7nm)
- `max_memory` - Maximum RAM support
- `memory_channels` - Memory channel configuration
- `pcie_version` - PCIe generation support
- `product_page` - Manufacturer product URL

#### Changed
- `baseClock` → `base_clock` (snake_case for consistency)
- `boostClock` → `turbo_clock` (more accurate naming)
- All optional fields now properly marked with `.optional()`

---

## Migration Guide

### For Existing Data

If you have existing CPU data from v1.0.0, you may need to:

1. **Re-run the scraper** to get new detailed fields
2. **Update field names** in existing data:
   ```sql
   -- Example migration (if needed)
   UPDATE Component 
   SET specifications = JSON_SET(
     specifications,
     '$.base_clock', JSON_EXTRACT(specifications, '$.baseClock'),
     '$.turbo_clock', JSON_EXTRACT(specifications, '$.boostClock')
   )
   WHERE type = 'CPU';
   ```

3. **Or simply delete and re-scrape**:
   ```sql
   DELETE FROM Component WHERE type = 'CPU';
   ```
   Then run: `pnpm --filter @repo/scripts tsx src/scrape-cpu.ts`

---

## Future Plans

### v2.1.0 (Planned)
- [ ] Add rate limiting to prevent IP blocking
- [ ] Implement retry logic for failed requests
- [ ] Add progress bars for better UX
- [ ] Support for multiple data sources
- [ ] Image downloading and hosting
- [ ] Incremental updates (update existing data)

### v2.2.0 (Planned)
- [ ] Concurrent scraping with queue system
- [ ] Master script to run all scrapers in sequence
- [ ] Cron job support for scheduled updates
- [ ] Data validation dashboard
- [ ] Price tracking and history

### v3.0.0 (Future)
- [ ] Machine learning for spec extraction
- [ ] Automatic compatibility rule detection
- [ ] Multi-language support
- [ ] API for external integrations

---

## Breaking Changes

### v2.0.0
- **CPU Schema**: Field names changed from camelCase to snake_case
  - `baseClock` → `base_clock`
  - `boostClock` → `turbo_clock`
- **New Required Fields**: Some previously optional fields are now required (with validation)
- **Validation**: Stricter Zod schemas may reject previously accepted data

---

## Contributors

- Initial Implementation: Development Team
- v2.0.0 Enhancement: Development Team
- Documentation: Development Team

---

## License

Private project - PC Builder Platform

---

**Last Updated**: 2024-11-22  
**Current Version**: 2.0.0
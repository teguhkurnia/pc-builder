/**
 * Public API Layer for Services
 *
 * This file serves as the main entry point for all service functions.
 * Import services from here instead of directly from individual service files.
 *
 * @example
 * // ✅ Good - Using public API layer
 * import { assetsService } from "@repo/api/services";
 *
 * // ❌ Bad - Direct import from service files
 * import { createAsset } from "@repo/api/src/services/assets/create.service";
 */

// Assets Services
export * as assetsService from "./assets";

// Re-export individual functions for convenience (optional)
export {
  createAsset,
  listAssets,
  deleteAsset,
  getAssetById,
  getAssetByFilename,
} from "./assets";

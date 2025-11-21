import { z } from "zod";

// AssetType enum schema
export const assetTypeSchema = z.enum(["IMAGE", "DOCUMENT", "OTHER"]);

// Create asset schema (for internal use when saving upload metadata)
export const createAssetSchema = z.object({
  filename: z.string().min(1),
  originalFilename: z.string().min(1),
  mimetype: z.string().min(1),
  size: z.number().int().positive(),
  url: z.string().url(),
  path: z.string().min(1),
  type: assetTypeSchema.optional().default("IMAGE"),
});

export type CreateAssetInput = z.infer<typeof createAssetSchema>;

// List assets request schema
export const listAssetsRequestSchema = z.object({
  type: assetTypeSchema.optional(),
  search: z.string().optional(),
  limit: z.number().int().positive().max(100).optional().default(50),
  offset: z.number().int().nonnegative().optional().default(0),
  sortBy: z
    .enum(["createdAt", "size", "filename"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type ListAssetsRequest = z.infer<typeof listAssetsRequestSchema>;

// Delete asset schema
export const deleteAssetSchema = z
  .object({
    id: z.number().int().positive().optional(),
    filename: z.string().optional(),
  })
  .refine((data) => data.id !== undefined || data.filename !== undefined, {
    message: "Either id or filename must be provided",
  });

export type DeleteAssetInput = z.infer<typeof deleteAssetSchema>;

// Get asset schema
export const getAssetByIdSchema = z.object({
  id: z.number().int().positive(),
});

export const getAssetByFilenameSchema = z.object({
  filename: z.string().min(1),
});

// Asset response schema (what we return from API)
export const assetResponseSchema = z.object({
  id: z.number(),
  filename: z.string(),
  originalFilename: z.string(),
  mimetype: z.string(),
  size: z.number(),
  type: assetTypeSchema,
  url: z.string(),
  path: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type AssetResponse = z.infer<typeof assetResponseSchema>;

// List assets response schema
export const listAssetsResponseSchema = z.object({
  assets: z.array(assetResponseSchema),
  pagination: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    hasMore: z.boolean(),
  }),
});

export type ListAssetsResponse = z.infer<typeof listAssetsResponseSchema>;

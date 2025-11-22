import { BuildSchema } from "@repo/db/schemas";
import z from "zod";

// 1. List/Query Request Schema
export const listBuildsRequestSchema = z
  .object({
    search: z.string().optional(),
    status: z.enum(["DRAFT", "COMPLETED", "SAVED"]).optional(),
    sortBy: z.enum(["name", "totalPrice", "createdAt"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  })
  .optional();

export type ListBuildsRequestSchema = z.infer<typeof listBuildsRequestSchema>;

// 2. List/Query Response Schema
export const listBuildsSchema = z.array(
  BuildSchema.extend({
    cpu: z.any().optional(),
    motherboard: z.any().optional(),
    ram: z.any().optional(),
    storage: z.any().optional(),
    gpu: z.any().optional(),
    psu: z.any().optional(),
    case: z.any().optional(),
    cooling: z.any().optional(),
  }),
);
export type ListBuildsSchema = z.infer<typeof listBuildsSchema>;

// 3. Get Single Build Response Schema
export const getBuildSchema = BuildSchema.extend({
  cpu: z.any().optional(),
  motherboard: z.any().optional(),
  ram: z.any().optional(),
  storage: z.any().optional(),
  gpu: z.any().optional(),
  psu: z.any().optional(),
  case: z.any().optional(),
  cooling: z.any().optional(),
});
export type GetBuildSchema = z.infer<typeof getBuildSchema>;

// 4. Create Schema
export const createBuildSchema = z.object({
  name: z.string().min(1, "Build name is required"),
  status: z.enum(["DRAFT", "COMPLETED", "SAVED"]).default("DRAFT"),
  cpuId: z.number().optional(),
  motherboardId: z.number().optional(),
  ramId: z.number().optional(),
  storageId: z.number().optional(),
  gpuId: z.number().optional(),
  psuId: z.number().optional(),
  caseId: z.number().optional(),
  coolingId: z.number().optional(),
});
export type CreateBuildSchema = z.infer<typeof createBuildSchema>;

// 5. Update Schema
export const updateBuildSchema = createBuildSchema.partial();
export type UpdateBuildSchema = z.infer<typeof updateBuildSchema>;

// 6. Update Component Schema (untuk update component tertentu di build)
export const updateBuildComponentSchema = z.object({
  componentType: z.enum([
    "cpu",
    "motherboard",
    "ram",
    "storage",
    "gpu",
    "psu",
    "case",
    "cooling",
  ]),
  componentId: z.number().nullable(),
});
export type UpdateBuildComponentSchema = z.infer<
  typeof updateBuildComponentSchema
>;

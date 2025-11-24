import { ComponentSchema } from "@repo/db/schemas";
import z from "zod";

export const listComponentsRequestSchema = z
  .object({
    search: z.string().optional(),
    type: z.string().optional(),
    sortBy: z.enum(["name", "price", "date"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    limit: z.number().min(1).max(100).default(20),
    cursor: z.number().optional(), // ID of last item from previous page
    // Dependency IDs for compatibility filtering
    cpuId: z.number().optional(),
    motherboardId: z.number().optional(),
  })
  .optional();

export type ListComponentsRequestSchema = z.infer<
  typeof listComponentsRequestSchema
>;

export const listComponentsSchema = z.array(
  ComponentSchema.extend({
    specifications: z.record(z.string(), z.any()),
  }),
);
export type ListComponentsSchema = z.infer<typeof listComponentsSchema>;

// Paginated response schema
export const listComponentsResponseSchema = z.object({
  items: listComponentsSchema,
  nextCursor: z.number().optional(),
  hasMore: z.boolean(),
});
export type ListComponentsResponseSchema = z.infer<
  typeof listComponentsResponseSchema
>;

export const createComponentSchema = ComponentSchema.omit({
  createdAt: true,
  updatedAt: true,
  id: true,
});
export type CreateComponentSchema = z.infer<typeof createComponentSchema>;

export const updateComponentSchema = createComponentSchema.partial();
export type UpdateComponentSchema = z.infer<typeof updateComponentSchema>;

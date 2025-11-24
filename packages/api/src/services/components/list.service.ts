import { db, Prisma } from "@repo/db";
import logger from "../../utils/logger";
import { TRPCError } from "@trpc/server";
import { ListComponentsResponseSchema } from "../../models";

interface ListComponentsInput {
  search?: string;
  type?: string;
  sortBy?: "name" | "price" | "date";
  sortOrder?: "asc" | "desc";
  limit?: number;
  cursor?: number;
  cpuId?: number;
  motherboardId?: number;
}

export async function listComponents(
  input?: ListComponentsInput,
): Promise<ListComponentsResponseSchema> {
  try {
    // Build where clause for filtering with AND conditions
    const andConditions: Prisma.ComponentWhereInput[] = [];

    // Search filter - search in component name
    if (input?.search) {
      andConditions.push({
        name: {
          contains: input.search,
        },
      });
    }

    // Type filter
    if (input?.type && input.type !== "all") {
      andConditions.push({
        type: input.type as any,
      });
    }

    // Compatibility filtering based on dependencies
    if (input?.cpuId && input?.type) {
      // Get CPU specifications for compatibility checks
      const cpu = await db.component.findUnique({
        where: { id: input.cpuId },
      });

      if (cpu) {
        const cpuSpecs = cpu.specifications as Record<string, any>;

        // Filter motherboards by CPU socket
        if (input.type === "MOTHERBOARD" && cpuSpecs.socket) {
          andConditions.push({
            specifications: {
              path: "$.socket",
              equals: cpuSpecs.socket,
            } as any,
          });
        }

        // Filter cooling by CPU socket
        if (input.type === "COOLING" && cpuSpecs.socket) {
          andConditions.push({
            specifications: {
              path: "$.socket",
              equals: cpuSpecs.socket,
            } as any,
          });
        }
      }
    }

    if (input?.motherboardId && input?.type) {
      // Get motherboard specifications for compatibility checks
      const motherboard = await db.component.findUnique({
        where: { id: input.motherboardId },
      });

      if (motherboard) {
        const mbSpecs = motherboard.specifications as Record<string, any>;

        // Filter RAM by motherboard memory type
        if (input.type === "RAM" && mbSpecs.memoryType) {
          andConditions.push({
            OR: [
              {
                specifications: {
                  path: "$.type",
                  equals: mbSpecs.memoryType,
                } as any,
              },
              {
                specifications: {
                  path: "$.memoryType",
                  equals: mbSpecs.memoryType,
                } as any,
              },
            ],
          });
        }

        // Filter cases by motherboard form factor
        if (input.type === "CASE" && mbSpecs.formFactor) {
          andConditions.push({
            specifications: {
              path: "$.formFactor",
              equals: mbSpecs.formFactor,
            } as any,
          });
        }
      }
    }

    // Pagination setup
    const limit = input?.limit ?? 20;
    const cursor = input?.cursor;

    // Add cursor condition to AND conditions if cursor exists
    if (cursor) {
      andConditions.push({
        id: {
          lt: cursor, // Get items with ID less than cursor (for infinite scroll going down)
        },
      });
    }

    // Combine all conditions with AND
    const where: Prisma.ComponentWhereInput =
      andConditions.length > 0 ? { AND: andConditions } : {};

    // Build orderBy clause for sorting
    // Always include id DESC as secondary sort for consistent cursor pagination
    let orderBy: Prisma.ComponentOrderByWithRelationInput[] = [
      { id: "desc" }, // Primary sort for cursor pagination
    ];

    if (input?.sortBy) {
      const order = input.sortOrder || "asc";

      switch (input.sortBy) {
        case "name":
          orderBy = [{ name: order }, { id: "desc" }];
          break;
        case "price":
          orderBy = [{ price: order }, { id: "desc" }];
          break;
        case "date":
          orderBy = [{ updatedAt: order }, { id: "desc" }];
          break;
        default:
          orderBy = [{ id: "desc" }];
      }
    }

    // Fetch components with filters, sorting, and pagination
    // Fetch limit + 1 to check if there are more items
    const components = await db.component.findMany({
      where,
      orderBy,
      take: limit + 1,
    });

    // Check if there are more items
    const hasMore = components.length > limit;

    // Remove the extra item if we have more
    const items = hasMore ? components.slice(0, limit) : components;

    // Get the cursor for the next page (ID of the last item)
    const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;

    // Transform specifications to Record<string, any>
    const transformedItems = items.map((component) => ({
      ...component,
      specifications: component.specifications as Record<string, any>,
    }));

    return {
      items: transformedItems,
      nextCursor,
      hasMore,
    };
  } catch (error) {
    logger.error("Error listing components:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to list components",
    });
  }
}

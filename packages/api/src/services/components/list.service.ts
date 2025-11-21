import { db, Prisma } from "@repo/db";
import logger from "../../utils/logger";
import { TRPCError } from "@trpc/server";
import { ListComponentsSchema } from "../../models";

interface ListComponentsInput {
  search?: string;
  type?: string;
  sortBy?: "name" | "price" | "date";
  sortOrder?: "asc" | "desc";
}

export async function listComponents(
  input?: ListComponentsInput,
): Promise<ListComponentsSchema> {
  try {
    // Build where clause for filtering
    const where: Prisma.ComponentWhereInput = {};

    // Search filter - search in component name
    if (input?.search) {
      where.name = {
        contains: input.search,
      };
    }

    // Type filter
    if (input?.type && input.type !== "all") {
      where.type = input.type as any;
    }

    // Build orderBy clause for sorting
    let orderBy: Prisma.ComponentOrderByWithRelationInput = {
      name: "asc", // Default sort
    };

    if (input?.sortBy) {
      const order = input.sortOrder || "asc";

      switch (input.sortBy) {
        case "name":
          orderBy = { name: order };
          break;
        case "price":
          orderBy = { price: order };
          break;
        case "date":
          orderBy = { updatedAt: order };
          break;
        default:
          orderBy = { name: "asc" };
      }
    }

    // Fetch components with filters and sorting
    const components = await db.component.findMany({
      where,
      orderBy,
    });

    // Transform specifications to Record<string, any>
    return components.map((component) => ({
      ...component,
      specifications: component.specifications as Record<string, any>,
    }));
  } catch (error) {
    logger.error("Error listing components:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to list components",
    });
  }
}

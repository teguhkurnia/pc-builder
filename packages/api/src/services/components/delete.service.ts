import { db } from "@repo/db";
import logger from "../../utils/logger";
import { TRPCError } from "@trpc/server";

export async function deleteComponent(id: number): Promise<any> {
  try {
    // Check if component exists
    const existingComponent = await db.component.findUnique({
      where: { id },
    });

    if (!existingComponent) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `Component with id ${id} not found`,
      });
    }

    // Delete component from database
    const component = await db.component.delete({
      where: { id },
    });

    logger.info("Component deleted successfully:", {
      id: component.id,
      name: component.name,
    });
    return component;
  } catch (error) {
    logger.error("Error deleting component:", error);

    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to delete component",
    });
  }
}

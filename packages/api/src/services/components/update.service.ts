import { db, ComponentUpdateInputSchema } from "@repo/db";
import logger from "../../utils/logger";
import { TRPCError } from "@trpc/server";
import type { z } from "zod";

export async function updateComponent(
  id: number,
  input: z.infer<typeof ComponentUpdateInputSchema>,
): Promise<any> {
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

    // Validate input
    const validatedInput = ComponentUpdateInputSchema.parse(input);

    // Update component in database
    const component = await db.component.update({
      where: { id },
      data: validatedInput,
    });

    logger.info("Component updated successfully:", {
      id: component.id,
      name: component.name,
    });
    return component;
  } catch (error) {
    logger.error("Error updating component:", error);

    if (error instanceof TRPCError) {
      throw error;
    }

    if (error instanceof Error && error.name === "ZodError") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid component data",
        cause: error,
      });
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update component",
    });
  }
}

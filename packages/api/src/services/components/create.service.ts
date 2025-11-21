import { db } from "@repo/db";
import { TRPCError } from "@trpc/server";
import { createComponentSchema, CreateComponentSchema } from "../../models";
import logger from "../../utils/logger";

export async function createComponent(
  input: CreateComponentSchema,
): Promise<any> {
  try {
    // Validate input
    const validatedInput = createComponentSchema.parse(input);

    // Create component in database
    const component = await db.component.create({
      data: validatedInput,
    });

    logger.info("Component created successfully:", {
      id: component.id,
      name: component.name,
    });
    return component;
  } catch (error) {
    logger.error("Error creating component:", error);

    if (error instanceof Error && error.name === "ZodError") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid component data",
        cause: error,
      });
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create component",
    });
  }
}

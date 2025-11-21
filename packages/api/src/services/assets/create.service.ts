import { db } from "@repo/db";
import { CreateAssetInput } from "../../models";
import { logger } from "../../utils";
import { TRPCError } from "@trpc/server";

export async function createAsset(input: CreateAssetInput) {
  try {
    const asset = await db.asset.create({
      data: {
        filename: input.filename,
        originalFilename: input.originalFilename,
        mimetype: input.mimetype,
        size: input.size,
        url: input.url,
        path: input.path,
        type: input.type || "IMAGE",
      },
    });

    return asset;
  } catch (error) {
    logger.error("Error creating asset:", error);

    if (error instanceof Error && error.name === "ZodError") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid asset data",
        cause: error,
      });
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create asset",
    });
  }
}

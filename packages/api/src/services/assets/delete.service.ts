import { db } from "@repo/db";
import { promises as fs } from "fs";
import { DeleteAssetInput } from "../../models";
import { TRPCError } from "@trpc/server";
import { logger } from "../../utils";

export async function deleteAsset(input: DeleteAssetInput) {
  // Find the asset
  const asset = await db.asset.findFirst({
    where: input.id ? { id: input.id } : { filename: input.filename },
  });

  if (!asset) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Asset not found",
    });
  }

  // Delete file from filesystem
  try {
    await fs.unlink(asset.path);
  } catch (error) {
    logger.error(`Failed to delete file: ${asset.path}`, error);
  }

  try {
    // Delete from database
    await db.asset.delete({
      where: { id: asset.id },
    });

    return {
      success: true,
      message: `Asset ${asset.filename} deleted successfully`,
      deletedAsset: asset,
    };
  } catch (error) {
    logger.error("Error deleting asset from database:", error);

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to delete asset from database",
    });
  }
}

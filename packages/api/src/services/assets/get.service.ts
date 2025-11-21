import { db } from "@repo/db";

export async function getAssetById(id: number) {
  const asset = await db.asset.findUnique({
    where: { id },
  });

  if (!asset) {
    throw new Error("Asset not found");
  }

  return asset;
}

export async function getAssetByFilename(filename: string) {
  const asset = await db.asset.findUnique({
    where: { filename },
  });

  if (!asset) {
    throw new Error("Asset not found");
  }

  return asset;
}

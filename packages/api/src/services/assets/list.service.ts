import { db } from "@repo/db";
import { ListAssetsRequest, ListAssetsResponse } from "../../models";

export async function listAssets(
  input: ListAssetsRequest,
): Promise<ListAssetsResponse> {
  const {
    type,
    search,
    limit = 50,
    offset = 0,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = input;

  const where: any = {};

  // Filter by type
  if (type) {
    where.type = type;
  }

  // Search by filename or original filename
  if (search) {
    where.OR = [
      { filename: { contains: search } },
      { originalFilename: { contains: search } },
    ];
  }

  // Get total count
  const total = await db.asset.count({ where });

  // Get assets with pagination and sorting
  const assets = await db.asset.findMany({
    where,
    orderBy: {
      [sortBy]: sortOrder,
    },
    take: limit,
    skip: offset,
  });

  return {
    assets,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  };
}

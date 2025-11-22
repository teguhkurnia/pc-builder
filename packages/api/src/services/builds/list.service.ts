import { db } from "@repo/db";
import type { ListBuildsRequestSchema } from "../../models";

export async function listBuilds(input?: ListBuildsRequestSchema) {
  const whereClause: any = {};

  // Search filter
  if (input?.search) {
    whereClause.name = {
      contains: input.search,
    };
  }

  // Status filter
  if (input?.status) {
    whereClause.status = input.status;
  }

  // Sorting
  const sortBy = input?.sortBy || "createdAt";
  const sortOrder = input?.sortOrder || "desc";

  const builds = await db.build.findMany({
    where: whereClause,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      cpu: true,
      motherboard: true,
      ram: true,
      storage: true,
      gpu: true,
      psu: true,
      case: true,
      cooling: true,
    },
  });

  return builds;
}

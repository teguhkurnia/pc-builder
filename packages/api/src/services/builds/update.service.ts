import { TRPCError } from "@trpc/server";
import { db } from "@repo/db";
import type { UpdateBuildSchema } from "../../models";

export async function updateBuild(id: number, input: UpdateBuildSchema) {
  // Check if build exists
  const existingBuild = await db.build.findUnique({
    where: { id },
  });

  if (!existingBuild) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Build with id ${id} not found`,
    });
  }

  // Calculate total price based on updated components
  let totalPrice = existingBuild.totalPrice;

  // Determine which component IDs to use (updated or existing)
  const componentIds = [
    input.cpuId ?? existingBuild.cpuId,
    input.motherboardId ?? existingBuild.motherboardId,
    input.ramId ?? existingBuild.ramId,
    input.storageId ?? existingBuild.storageId,
    input.gpuId ?? existingBuild.gpuId,
    input.psuId ?? existingBuild.psuId,
    input.caseId ?? existingBuild.caseId,
    input.coolingId ?? existingBuild.coolingId,
  ].filter((id): id is number => id !== null && id !== undefined);

  // Recalculate total price if any component changed
  if (componentIds.length > 0) {
    const components = await db.component.findMany({
      where: {
        id: {
          in: componentIds,
        },
      },
      select: {
        id: true,
        price: true,
      },
    });

    totalPrice = components.reduce((sum, comp) => sum + comp.price, 0);
  } else {
    totalPrice = 0;
  }

  const build = await db.build.update({
    where: { id },
    data: {
      name: input.name,
      status: input.status,
      totalPrice,
      cpuId: input.cpuId,
      motherboardId: input.motherboardId,
      ramId: input.ramId,
      storageId: input.storageId,
      gpuId: input.gpuId,
      psuId: input.psuId,
      caseId: input.caseId,
      coolingId: input.coolingId,
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

  return build;
}

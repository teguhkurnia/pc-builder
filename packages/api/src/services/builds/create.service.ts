import { db } from "@repo/db";
import type { CreateBuildSchema } from "../../models";

export async function createBuild(input: CreateBuildSchema) {
  // Calculate total price based on selected components
  let totalPrice = 0;

  // Fetch all component prices if IDs are provided
  const componentIds = [
    input.cpuId,
    input.motherboardId,
    input.ramId,
    input.storageId,
    input.gpuId,
    input.psuId,
    input.caseId,
    input.coolingId,
  ].filter((id): id is number => id !== undefined);

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
  }

  const build = await db.build.create({
    data: {
      name: input.name,
      status: input.status || "DRAFT",
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

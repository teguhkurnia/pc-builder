import { TRPCError } from "@trpc/server";
import { db } from "@repo/db";

export async function getBuild(id: number) {
  const build = await db.build.findUnique({
    where: { id },
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

  if (!build) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Build with id ${id} not found`,
    });
  }

  return build;
}

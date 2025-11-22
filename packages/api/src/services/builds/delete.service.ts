import { TRPCError } from "@trpc/server";
import { db } from "@repo/db";

export async function deleteBuild(id: number) {
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

  // Delete the build
  await db.build.delete({
    where: { id },
  });

  return { success: true, id };
}

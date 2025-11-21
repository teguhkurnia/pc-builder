import { z } from "zod";
import {
  listAssetsRequestSchema,
  deleteAssetSchema,
  getAssetByIdSchema,
  getAssetByFilenameSchema,
} from "../models/asset";
import { listAssets } from "../services/assets/list.service";
import { deleteAsset } from "../services/assets/delete.service";
import {
  getAssetById,
  getAssetByFilename,
} from "../services/assets/get.service";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const assetsRouter = createTRPCRouter({
  list: publicProcedure
    .input(listAssetsRequestSchema)
    .query(async ({ input }) => {
      return await listAssets(input);
    }),

  getById: publicProcedure
    .input(getAssetByIdSchema)
    .query(async ({ input }) => {
      return await getAssetById(input.id);
    }),

  getByFilename: publicProcedure
    .input(getAssetByFilenameSchema)
    .query(async ({ input }) => {
      return await getAssetByFilename(input.filename);
    }),

  delete: publicProcedure
    .input(deleteAssetSchema)
    .mutation(async ({ input }) => {
      return await deleteAsset(input);
    }),
});

import { z } from "zod";
import {
  createComponentSchema,
  listComponentsRequestSchema,
  updateComponentSchema,
  createBuildSchema,
  listBuildsRequestSchema,
  updateBuildSchema,
} from "../models";
import { createComponent } from "../services/components/create.service";
import { deleteComponent } from "../services/components/delete.service";
import { listComponents } from "../services/components/list.service";
import { updateComponent } from "../services/components/update.service";
import { createBuild } from "../services/builds/create.service";
import { deleteBuild } from "../services/builds/delete.service";
import { listBuilds } from "../services/builds/list.service";
import { getBuild } from "../services/builds/get.service";
import { updateBuild } from "../services/builds/update.service";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { assetsRouter } from "./assets.router";

export const appRouter = createTRPCRouter({
  components: {
    list: publicProcedure
      .input(listComponentsRequestSchema)
      .query(async ({ input }) => {
        return await listComponents(input);
      }),

    create: publicProcedure
      .input(createComponentSchema)
      .mutation(async ({ input }) => {
        return await createComponent(input);
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          data: updateComponentSchema,
        }),
      )
      .mutation(async ({ input }) => {
        return await updateComponent(input.id, input.data);
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteComponent(input.id);
      }),
  },

  assets: assetsRouter,

  builds: {
    list: publicProcedure
      .input(listBuildsRequestSchema)
      .query(async ({ input }) => {
        return await listBuilds(input);
      }),

    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getBuild(input.id);
      }),

    create: publicProcedure
      .input(createBuildSchema)
      .mutation(async ({ input }) => {
        return await createBuild(input);
      }),

    update: publicProcedure
      .input(
        z.object({
          id: z.number(),
          data: updateBuildSchema,
        }),
      )
      .mutation(async ({ input }) => {
        return await updateBuild(input.id, input.data);
      }),

    delete: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteBuild(input.id);
      }),
  },
});

export type AppRouter = typeof appRouter;

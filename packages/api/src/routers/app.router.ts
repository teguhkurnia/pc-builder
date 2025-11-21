import { z } from "zod";
import {
  createComponentSchema,
  listComponentsRequestSchema,
  updateComponentSchema,
} from "../models";
import { createComponent } from "../services/components/create.service";
import { deleteComponent } from "../services/components/delete.service";
import { listComponents } from "../services/components/list.service";
import { updateComponent } from "../services/components/update.service";
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
});

export type AppRouter = typeof appRouter;

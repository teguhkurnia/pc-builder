import { db } from "@repo/db";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import z, { ZodError } from "zod";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson, // Penting: Biar Date & Map object aman dikirim
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? z.treeifyError(error.cause) : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

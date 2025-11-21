import type { AppRouter } from "@repo/api";
import { createTRPCReact, type CreateTRPCReact } from "@trpc/react-query";

export const api: CreateTRPCReact<AppRouter, unknown> =
  createTRPCReact<AppRouter>();

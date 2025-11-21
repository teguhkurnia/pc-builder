import { db } from "@repo/db";

export { appRouter, type AppRouter } from "./routers/app.router";
export { createTRPCContext } from "./trpc";

export const checkDatabaseConnection = async () => {
  try {
    // Query paling ringan untuk tes koneksi
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    // Kita lempar errornya agar bisa ditangkap di log server
    throw error;
  }
};

import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import dotenv from "dotenv";
import path from "path";
import {
  type CreateFastifyContextOptions,
  fastifyTRPCPlugin,
} from "@trpc/server/adapters/fastify";
import {
  appRouter,
  checkDatabaseConnection,
  createTRPCContext,
} from "@repo/api";
import { type TRPCError } from "@trpc/server";
import { uploadRoutes } from "./routes/upload";

dotenv.config({
  path: "../../.env",
});

const server = Fastify({
  logger: true,
  maxParamLength: 5000,
});

async function main() {
  // Register CORS
  await server.register(cors, {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  });

  // Register multipart for file uploads
  await server.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
      files: 10, // Max 10 files per request
    },
  });

  // Register static file serving for uploads
  await server.register(fastifyStatic, {
    root: path.join(process.cwd(), "uploads"),
    prefix: "/uploads/",
    decorateReply: false,
  });

  // Register upload routes
  await uploadRoutes(server);

  await server.register(fastifyTRPCPlugin, {
    prefix: "api/trpc",
    trpcOptions: {
      router: appRouter,
      createContext: ({ req, res }: CreateFastifyContextOptions) =>
        createTRPCContext({ headers: req.headers as unknown as Headers }),
      onError({ path, error }: { path?: string; error: TRPCError }) {
        console.error(`Error in tRPC handler on path '${path}':`, error);
      },
    },
  });

  // Health check endpoint
  server.get("/api/health", async (req, reply) => {
    const start = performance.now();

    try {
      await checkDatabaseConnection();

      const duration = performance.now() - start;

      return {
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: {
          status: "connected",
          latency: `${duration.toFixed(2)}ms`,
        },
        service: "pc-builder-server",
      };
    } catch (error) {
      server.log.error(error);
      reply.code(503);
      return {
        status: "error",
        timestamp: new Date().toISOString(),
        database: {
          status: "disconnected",
        },
      };
    }
  });

  try {
    await server.listen({ port: 4000 });
    console.log("🚀 Server tRPC jalan di http://localhost:4000/api/trpc");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();

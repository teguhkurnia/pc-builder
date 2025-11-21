import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { MultipartFile } from "@fastify/multipart";
import { pipeline } from "stream/promises";
import { createWriteStream, promises as fs } from "fs";
import * as path from "path";
import {
  generateUniqueFilename,
  sanitizeFilename,
  validateUploadedFile,
  formatFileSize,
} from "../utils/file-validation";
import { createAsset, listAssets, deleteAsset } from "@repo/api/services";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "images");

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

interface UploadedFileInfo {
  filename: string;
  originalFilename: string;
  url: string;
  size: number;
  mimetype: string;
  uploadedAt: string;
}

interface UploadResponse {
  success: boolean;
  message?: string;
  files?: UploadedFileInfo[];
  error?: string;
}

interface ListImagesResponse {
  success: boolean;
  images: Array<{
    filename: string;
    url: string;
    size: number;
    createdAt: string;
  }>;
  total: number;
}

interface DeleteImageResponse {
  success: boolean;
  message: string;
}

export async function uploadRoutes(fastify: FastifyInstance) {
  // Ensure upload directory exists on startup
  await ensureUploadDir();

  /**
   * Upload single or multiple images
   * POST /api/upload/image
   */
  fastify.post<{ Reply: UploadResponse }>(
    "/api/upload/image",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const parts = request.parts();
        const uploadedFiles: UploadedFileInfo[] = [];

        for await (const part of parts) {
          if (part.type === "file") {
            const file = part as MultipartFile;

            // Validate file
            const validation = validateUploadedFile(
              file.mimetype,
              // @ts-ignore - file has bytes property after upload
              file.file.bytesRead || 0,
            );

            if (!validation.valid) {
              reply.code(400);
              return {
                success: false,
                error: validation.error,
              };
            }

            // Generate unique filename
            const uniqueFilename = generateUniqueFilename(
              file.filename,
              file.mimetype,
            );
            const filepath = path.join(UPLOAD_DIR, uniqueFilename);

            // Save file
            await pipeline(file.file, createWriteStream(filepath));

            // Get file stats for size
            const stats = await fs.stat(filepath);

            // Construct file info
            const baseUrl = `${request.protocol}://${request.hostname}:4000`;
            const fileUrl = `${baseUrl}/uploads/images/${uniqueFilename}`;

            // Save to database
            const asset = await createAsset({
              filename: uniqueFilename,
              originalFilename: file.filename,
              mimetype: file.mimetype,
              size: stats.size,
              url: fileUrl,
              path: filepath,
              type: "IMAGE",
            });

            const fileInfo: UploadedFileInfo = {
              filename: uniqueFilename,
              originalFilename: file.filename,
              url: fileUrl,
              size: stats.size,
              mimetype: file.mimetype,
              uploadedAt: asset.createdAt.toISOString(),
            };

            uploadedFiles.push(fileInfo);

            fastify.log.info(
              `File uploaded and saved to DB: ${uniqueFilename}`,
            );
          }
        }

        if (uploadedFiles.length === 0) {
          reply.code(400);
          return {
            success: false,
            error: "No files uploaded",
          };
        }

        return {
          success: true,
          message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
          files: uploadedFiles,
        };
      } catch (error) {
        fastify.log.error(error);
        reply.code(500);
        return {
          success: false,
          error: "Failed to upload file",
        };
      }
    },
  );

  /**
   * List all uploaded images
   * GET /api/upload/images
   */
  fastify.get<{ Reply: ListImagesResponse }>(
    "/api/upload/images",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // Get images from database
        const result = await listAssets({
          type: "IMAGE",
          sortBy: "createdAt",
          sortOrder: "desc",
          limit: 100,
          offset: 0,
        });

        const images = result.assets.map((asset) => ({
          filename: asset.filename,
          url: asset.url,
          size: asset.size,
          createdAt: asset.createdAt.toISOString(),
        }));

        return {
          success: true,
          images,
          total: result.pagination.total,
        };
      } catch (error) {
        fastify.log.error(error);
        reply.code(500);
        return {
          success: true,
          images: [],
          total: 0,
        };
      }
    },
  );

  /**
   * Delete uploaded image
   * DELETE /api/upload/image/:filename
   */
  fastify.delete<{
    Params: { filename: string };
    Reply: DeleteImageResponse;
  }>(
    "/api/upload/image/:filename",
    async (
      request: FastifyRequest<{ Params: { filename: string } }>,
      reply: FastifyReply,
    ) => {
      try {
        const { filename } = request.params;

        // Sanitize filename to prevent directory traversal
        const safeFilename = sanitizeFilename(filename);

        // Delete from database (will also delete file)
        const result = await deleteAsset({ filename: safeFilename });

        fastify.log.info(
          `File deleted from DB and filesystem: ${safeFilename}`,
        );

        return {
          success: result.success,
          message: result.message,
        };
      } catch (error: any) {
        fastify.log.error(error);

        if (error.message === "Asset not found") {
          reply.code(404);
          return {
            success: false,
            message: "File not found",
          };
        }

        reply.code(500);
        return {
          success: false,
          message: error.message || "Failed to delete file",
        };
      }
    },
  );
}

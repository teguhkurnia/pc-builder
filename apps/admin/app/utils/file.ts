/**
 * Format bytes to human-readable file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Filter only image files from FileList or File array
 */
export function filterImageFiles(files: FileList | File[]): File[] {
  const fileArray = Array.isArray(files) ? files : Array.from(files);
  return fileArray.filter((file) => file.type.startsWith("image/"));
}

"use client";

import { Upload } from "lucide-react";
import { cn } from "@repo/ui/lib/utils";

interface DropZoneProps {
  isDragging: boolean;
  hasFiles: boolean;
  onFileInputClick: () => void;
  dragHandlers: {
    onDragEnter: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
}

/**
 * Komponen drop zone untuk drag & drop file upload
 * Menampilkan area upload dengan visual feedback saat drag
 */
export function DropZone({
  isDragging,
  hasFiles,
  onFileInputClick,
  dragHandlers,
}: DropZoneProps) {
  return (
    <div
      onClick={onFileInputClick}
      {...dragHandlers}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
        isDragging
          ? "border-primary bg-primary/10 scale-[1.02]"
          : hasFiles
            ? "border-primary/50 bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-accent/50",
      )}
    >
      <Upload
        className={cn(
          "h-12 w-12 mx-auto mb-4 transition-all pointer-events-none",
          isDragging ? "text-primary scale-110" : "text-muted-foreground",
        )}
      />
      <p className="text-sm font-medium mb-1 pointer-events-none">
        {isDragging ? "Drop images here" : "Click to upload or drag & drop"}
      </p>
      <p className="text-xs text-muted-foreground pointer-events-none">
        PNG, JPG, GIF up to 10MB
      </p>
    </div>
  );
}

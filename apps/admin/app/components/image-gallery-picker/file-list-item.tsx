"use client";

import { FileImage, X } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { formatFileSize } from "../../utils/file";

interface FileListItemProps {
  file: File;
  index: number;
  onRemove: (index: number) => void;
  disabled?: boolean;
}

/**
 * Komponen untuk menampilkan individual file di upload list
 * Menampilkan nama file, ukuran, dan tombol remove
 */
export function FileListItem({
  file,
  index,
  onRemove,
  disabled = false,
}: FileListItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
      <FileImage className="h-8 w-8 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(file.size)}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(index)}
        disabled={disabled}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

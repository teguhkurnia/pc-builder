"use client";

import { Loader2, Upload as UploadIcon } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { DropZone } from "./drop-zone";
import { FileListItem } from "./file-list-item";

interface UploadTabProps {
  selectedFiles: File[];
  isUploading: boolean;
  isDragging: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  dragHandlers: {
    onDragEnter: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
  };
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileInputClick: () => void;
  onRemoveFile: (index: number) => void;
  onUpload: () => void;
}

/**
 * Komponen Upload Tab untuk upload image baru
 * Includes drag & drop zone, file list, dan upload button
 */
export function UploadTab({
  selectedFiles,
  isUploading,
  isDragging,
  fileInputRef,
  dragHandlers,
  onFileSelect,
  onFileInputClick,
  onRemoveFile,
  onUpload,
}: UploadTabProps) {
  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-280px)]">
      <div className="flex-1 flex flex-col gap-4">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={onFileSelect}
          className="hidden"
        />

        {/* Drop Zone */}
        <DropZone
          isDragging={isDragging}
          hasFiles={selectedFiles.length > 0}
          onFileInputClick={onFileInputClick}
          dragHandlers={dragHandlers}
        />

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <ScrollArea className="flex-1">
            <div className="space-y-2">
              <p className="text-sm font-medium mb-2">
                Selected Files ({selectedFiles.length})
              </p>
              {selectedFiles.map((file, index) => (
                <FileListItem
                  key={`${file.name}-${index}`}
                  file={file}
                  index={index}
                  onRemove={onRemoveFile}
                  disabled={isUploading}
                />
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Upload Button */}
        {selectedFiles.length > 0 && (
          <Button onClick={onUpload} disabled={isUploading} className="w-full">
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadIcon className="mr-2 h-4 w-4" />
                Upload {selectedFiles.length} image
                {selectedFiles.length !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

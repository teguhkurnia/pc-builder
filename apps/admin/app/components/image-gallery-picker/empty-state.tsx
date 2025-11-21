"use client";

import { ImageIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  error?: string;
}

/**
 * Komponen untuk menampilkan empty state atau error state
 * Digunakan untuk loading, error, dan empty data states
 */
export function EmptyState({
  icon,
  title,
  description,
  error,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-2">
      {icon || <ImageIcon className="h-12 w-12 text-muted-foreground/50" />}
      <p className="text-sm text-muted-foreground">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

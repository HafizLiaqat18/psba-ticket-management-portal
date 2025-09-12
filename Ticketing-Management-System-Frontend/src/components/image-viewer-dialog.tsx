"use client";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";

interface ImageViewerDialogProps {
  src: string | null;
  alt: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageViewerDialog({
  src,
  alt,
  isOpen,
  onOpenChange,
}: ImageViewerDialogProps) {
  if (!src) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-5xl p-4 border-none shadow-none">
        <DialogHeader>
          <DialogTitle>Image Preview</DialogTitle>
        </DialogHeader>
        <div
          className="relative flex items-center justify-center"
          style={{
            width: "100%",
            minWidth: "500px",
            minHeight: "500px",
            maxHeight: "50vh",
          }}
        >
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            fill
            style={{ objectFit: "contain" }}
            className="rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

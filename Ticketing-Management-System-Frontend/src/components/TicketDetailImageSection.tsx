"use client";

import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Paperclip, ImageIcon } from "lucide-react";
import { useState } from "react";
import { ImageViewerDialog } from "./image-viewer-dialog";

interface TicketDetailImageSectionProps {
  title?: string;
  images: string[];
}

export default function TicketDetailImageSection({
  title = "Attachments",
  images,
}: TicketDetailImageSectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
    <Card className="rounded-xl border border-gray-200 shadow-lg bg-white overflow-hidden transition-all duration-200 hover:shadow-xl p-1 gap-1 500">
      <CardHeader className="bg-white py-2 px-4">
        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <Paperclip className="w-5 h-5 text-green-600" />
          {title}
          <span className="text-sm font-normal text-gray-500">
            ({images?.length ?? 0})
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images?.map((image, index) => (
            <div
              key={index}
              className="relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200 bg-gray-50 hover:shadow-md transition-all duration-200"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`Attachment ${index + 1}`}
                className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                width={200}
                height={150}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

     <ImageViewerDialog
            src={selectedImage}
            alt="Attachment Preview"
            isOpen={!!selectedImage}
            onOpenChange={() => setSelectedImage(null)}
          />
          </>
  );
}

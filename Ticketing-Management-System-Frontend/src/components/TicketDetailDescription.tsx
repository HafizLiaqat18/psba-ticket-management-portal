import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface TicketDetailDescriptionProps {
  description?: string;
}

export default function TicketDetailDescription({ description }: TicketDetailDescriptionProps) {
  return (
    <Card className="rounded-xl border border-gray-200 shadow-lg bg-white overflow-hidden transition-all duration-200 hover:shadow-xl pt-1 gap-0.5">
      <CardHeader className="bg-white py-2 px-4">
        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-600" />
          Description
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 py-4">
        <p className="text-gray-700 leading-relaxed text-sm">
          {description || "No description available."}
        </p>
      </CardContent>
    </Card>
  );
}

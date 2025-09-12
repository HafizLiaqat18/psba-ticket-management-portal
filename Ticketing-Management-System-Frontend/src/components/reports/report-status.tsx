"use client";

import { useState } from "react";
import { WeeklyReport } from "@/types/report";
import { formatDateTime } from "@/utils/helper";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface ReportStatusTimelineProps {
  report: WeeklyReport;
}

const stages = [
  { key: "createdAt", label: "Report Created" },
  { key: "clearedByItAt", label: "Cleared by IT" },
  { key: "clearedByMonitoringAt", label: "Cleared by Monitoring" },
  { key: "clearedByOperationsAt", label: "Cleared by Operations" },
];

const colors: Record<string, string> = {
  reached: "bg-[#388E3C] text-[#388E3C]",
  pending: "bg-gray-300 text-gray-400",
};

export function ReportStatusTimeline({ report }: ReportStatusTimelineProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Map report timestamps to stage keys (convert Date to string if needed)
  const times: Record<string, string | undefined> = {
    createdAt:
      typeof report?.createdAt === "string"
        ? report.createdAt
        : report.createdAt?.toISOString(),
    clearedByItAt: report?.clearedByItAt
      ? new Date(report.clearedByItAt).toISOString()
      : undefined,
    clearedByMonitoringAt: report?.clearedByMonitoringAt
      ? new Date(report.clearedByMonitoringAt).toISOString()
      : undefined,
    clearedByOperationsAt: report?.clearedByOperationsAt
      ? new Date(report.clearedByOperationsAt).toISOString()
      : undefined,
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className="bg-green-600 text-white"
        >
          <Clock className="h-4 w-4 mr-2" />
          Current Status
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[900px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Report Status Timeline
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center gap-0 py-6">
          {stages.map((stage, idx) => {
            const reached = !!times[stage.key];
            const dotColor = reached ? colors.reached : colors.pending;
            const textColor = reached ? "text-[#388E3C]" : "text-gray-400";
            const showLine = idx < stages.length - 1;

            return (
              <div key={stage.key} className="flex items-center gap-0">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${dotColor} flex items-center justify-center`}
                  />
                  <span className={`mt-2 text-xs font-semibold ${textColor}`}>
                    {stage.label}
                  </span>
                  {reached && times[stage.key] && (
                    <span className="text-xs text-gray-500 mt-1">
                      {formatDateTime(times[stage.key]!)}
                    </span>
                  )}
                </div>
                {showLine && (
                  <div className="w-16 h-1 mx-2 rounded-full bg-gray-300" />
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

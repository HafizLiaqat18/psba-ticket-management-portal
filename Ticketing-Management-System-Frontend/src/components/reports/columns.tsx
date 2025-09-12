"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatDateTime } from "@/utils/helper";
import { Button } from "@/components/ui/button";
import { WeeklyReport } from "@/types/report";
import { generateExcelReport } from "@/utils/helper";
import { Download, Pencil } from "lucide-react";

export const getWeeklyReportColumns = (): ColumnDef<WeeklyReport>[] => {
  return [
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {formatDateTime(row.original.createdAt)}
        </span>
      ),
    },
    {
      accessorKey: "clearedByItAt",
      header: "Cleared By IT At",
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.clearedByItAt
            ? formatDateTime(row.original.clearedByItAt)
            : "Not cleared"}
        </span>
      ),
    },
    {
      accessorKey: "clearedByMonitoringAt",
      header: "Cleared By Monitoring At",
      cell: ({ row }) => (
        <span className="text-sm flex justify-center">
          {row.original.clearedByMonitoringAt
            ? formatDateTime(row.original.clearedByMonitoringAt)
            : "Not cleared"}
        </span>
      ),
    },
    {
      accessorKey: "clearedByOperationsAt",
      header: "Cleared By Operations At",
      cell: ({ row }) => (
        <span className="text-sm flex justify-center">
          {row.original.clearedByOperationsAt
            ? formatDateTime(row.original.clearedByOperationsAt)
            : "Not cleared"}
        </span>
      ),
    },
    {
      id: "download",
      header: "Download Report",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex justify-center gap-2"
            onClick={() => generateExcelReport(row.original)}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      ),
    },
    
  ];
};

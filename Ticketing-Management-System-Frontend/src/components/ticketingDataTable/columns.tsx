"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Ticket } from "@/types/tickets";
import { getStatusBadge } from "@/components/helper-components";
import { formatDateTime } from "@/utils/helper";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const getTicketColumns = (
  handleViewTicket: (ticket: Ticket) => void
): ColumnDef<Ticket>[] => [
  {
    accessorKey: "title",
    header: () => <span className="pl-7">Title</span>,
    cell: ({ row }) => (
      <span className="pl-7 font-medium">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => <span>{row.original.createdBy?.assignedTo?.name}</span>,
  },
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.original.status),
  },

  // ✅ New Columns
  {
    accessorKey: "estimatedResolutionTime",
    header: "Estimated Resolution Time",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.estimatedResolutionTime
          ? formatDateTime(row.original.estimatedResolutionTime)
          : "Not set yet"}
      </span>
    ),
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned To",
    cell: ({ row }) => {
      const assignedTo = row.original.assignedTo;
      if (typeof assignedTo === "string") {
        return assignedTo;
      }
      return assignedTo?.name || "";
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <span className="capitalize font-semibold">{row.original.priority}</span>
    ),
  },

  {
    id: "actions",
    header: () => <span className="pl-10">View</span>,
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="sm"
        className="text-black-600 hover:text-black-800 hover:bg-black-50 cursor-pointer"
        onClick={() => {
          handleViewTicket(row.original);
        }}
      >
        <Eye className="h-4 w-4 mr-1" /> View
      </Button>
    ),
  },
];

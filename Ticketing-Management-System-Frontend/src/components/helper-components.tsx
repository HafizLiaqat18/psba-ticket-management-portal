"use client";

import { Badge } from "@/components/ui/badge";

export function getStatusBadge(status: string) {
  switch (status.toLowerCase()) {
    case "open":
      return (
        <Badge className="bg-red-100 text-sm text-red-700 border-red-200  hover:bg-red-100 px-1.5  border-2 rounded-3xl">
          Open
        </Badge>
      );
    case "in-progress":
      return (
        <Badge className="bg-yellow-100 text-sm text-yellow-700 border-yellow-200 hover:bg-yellow-100 px-1.5  border-2 rounded-3xl">
          In Progress
        </Badge>
      );
    case "resolved":
      return (
        <Badge className="bg-green-100 text-sm text-green-700 border-green-200 hover:bg-green-100 px-1.5  border-2 rounded-3xl">
          Resolved
        </Badge>
      );
    case "closed":
      return (
        <Badge className="bg-gray-100 text-sm text-gray-700 border-gray-500 hover:bg-gray-100 px-1.5  border-2 rounded-3xl">
          Closed
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function getPriorityBadge(priority: string) {
  switch (priority.toLowerCase()) {
    case "high":
      return (
        <Badge className="bg-red-700 text-white hover:bg-red-100 px-1.5  rounded-3xl">
          High
        </Badge>
      );
    case "medium":
      return (
        <Badge className="bg-yellow-200 text-white hover:bg-orange-100 px-1.5  rounded-3xl">
          Medium
        </Badge>
      );
    case "low":
      return (
        <Badge className="bg-green-400 text-black hover:bg-blue-100 px-1.5  rounded-3xl">
          Low
        </Badge>
      );
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
}

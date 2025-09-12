import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Info,
  User,
  CalendarDays,
  FlagTriangleRight,
  Tag,
  UserCheck,
  TimerIcon,
} from "lucide-react";
import { Timer } from "@/components/timer";
import { Ticket } from "@/types/tickets";
import { getStatusBadge } from "./helper-components";
import { formatDuration } from "@/utils/helper";
interface TicketDetailsSectionProps {
  ticket: Ticket;
  formatTime: (timestamp: number) => string;
}



export default function TicketDetailsSection({
  ticket,
  formatTime,
}: TicketDetailsSectionProps) {
  return (
    <Card className="rounded-xl border border-gray-200 shadow-lg bg-white overflow-hidden transition-all duration-200 hover:shadow-xl pt-0">
      <CardHeader className="bg-white h-1 px-4">
        <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <Info className="w-5 h-5 text-green-600" />
          Ticket Details
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 py-4 px-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-green-700" strokeWidth={2.5} />
          <span>
            Created by:{" "}
            <span className="font-medium text-gray-900">
              {ticket?.createdBy?.assignedTo?.name || "N/A"}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-green-700" strokeWidth={2.5} />
          <span>
            Created At:{" "}
            <span className="font-medium text-gray-900">
              {ticket?.createdAt
                ? formatTime(new Date(ticket.createdAt).getTime())
                : "N/A"}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FlagTriangleRight className="w-4 h-4 text-green-700" strokeWidth={2.5} />
          <span>Status:</span>
          {getStatusBadge(ticket?.status)}
        </div>

        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-green-700" strokeWidth={2.5} />
          <span>
            Priority:{" "}
            <span className="px-3 py-1 rounded-full text-xs font-medium border">
              {ticket.priority || "N/A"}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-green-700" strokeWidth={2.5} />
          <span>
            Assigned To:{" "}
            <span className="font-medium text-gray-900">
              {ticket?.assignedTo?.name || "N/A"}
            </span>
          </span>
        </div>

        {ticket.status !== "resolved" && ticket.status !== "closed" && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CalendarDays className="h-4 w-4 text-green-700" />
            <span>Remaining Time:</span>
            {ticket?.estimatedResolutionTime ? (
              <Timer
                estimatedResolutionTime={ticket.estimatedResolutionTime}
                status={ticket.status}
              />
            ) : (
              <span className="font-bold italic">Opened</span>
            )}
          </div>
        )}

        {ticket.status === "closed" && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarDays className="h-4 w-4 text-green-700" />
          <span>Resolved In:</span>
            {formatDuration(ticket.resolvedIn as number)}
            <TimerIcon color="green" size={20}/>
        </div> 
        )}
      </CardContent>
    </Card>
  );
}

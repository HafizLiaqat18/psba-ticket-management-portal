"use client";

import { Ticket } from "@/types/tickets";
import { formatTime } from "@/utils/helper";

export function StatusTimeline({ ticket }: { ticket: Ticket }) {
  const statusSteps = [
    { status: "open", time: ticket?.createdAt },
    ticket?.inProgressAt && {
      status: "in-progress",
      time: ticket?.inProgressAt,
    },
    ticket?.resolvedAt && { status: "resolved", time: ticket.resolvedAt },
    ticket?.closedAt && { status: "closed", time: ticket.closedAt },
  ].filter(Boolean) as { status: string; time: string }[];

  const statusOrder = ["open", "in-progress", "resolved", "closed"];

  // const colors: Record<string, { dot: string; text: string }> = {
  //   open: { dot: "bg-[#C62828]", text: "text-[#C62828]" },
  //   "in-progress": {
  //     dot: "bg-[#FFB300]",
  //     text: "text-[#FFB300]",
  //   },
  //   resolved: { dot: "bg-[#388E3C]", text: "text-[#388E3C]" },
  //   closed: { dot: "bg-[#0288D1]", text: "text-[#0288D1]" },
  // };

  const colors: Record<string, { dot: string; text: string }> = {
    open: { dot: "bg-[#388E3C]", text: "text-[#388E3C]" },
    "in-progress": {
      dot: "bg-[#388E3C]",
      text: "text-[#388E3C]",
    },
    resolved: { dot: "bg-[#388E3C]", text: "text-[#388E3C]" },
    closed: { dot: "bg-[#388E3C]", text: "text-[#388E3C]" },
  };

  return (
    <div className="space-y-0 pb-4">
      {statusOrder.map((status, index) => {
        const step = statusSteps.find((s) => s.status === status);
        const reached = !!step;

        const dotColor = reached ? colors[status].dot : "bg-gray-400";
        const textColor = reached ? colors[status].text : "text-gray-400";
        const lineColor = reached ? colors[status].dot : "bg-gray-300";

        return (
          <div key={status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-3 h-3 rounded-full ${dotColor}`} />
              {index < statusOrder.length - 1 && (
                <div className={`w-px h-12 ${lineColor}`} />
              )}
            </div>

            <div>
              <p className={`font-medium -mt-1 capitalize ${textColor}`}>
                {status.replace("-", " ")}
              </p>
              {reached && (
                <p className="text-xs text-neutral-warm-500">
                  {formatTime(new Date(step.time).getTime())}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

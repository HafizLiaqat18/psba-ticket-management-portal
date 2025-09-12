"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  estimatedResolutionTime?: string;
  status?: string;
  className?: string;
}

export function Timer({
  estimatedResolutionTime,
  status,
  className,
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  const calculateTimeLeft = (dueDateIso: string) => {
    const now = new Date();
    const dueDate = new Date(dueDateIso);
    const diffMs = dueDate.getTime() - now.getTime();

    if (diffMs < 0) return "Overdue";

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return `${String(diffHours).padStart(2, "0")}:${String(
      diffMinutes
    ).padStart(2, "0")}:${String(diffSeconds).padStart(2, "0")} `;
  };

  useEffect(() => {
    if (
      !estimatedResolutionTime ||
      status === "resolved" ||
      status === "closed"
    ) {
      setTimeLeft("");
      return;
    }

    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft(estimatedResolutionTime));
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [estimatedResolutionTime, status]);

  if (!timeLeft || status === "resolved" || status === "closed") {
    return null;
  }

  const isOverdue = timeLeft === "Delayed";

  return (
    <div
      className={`flex items-center gap-1 text-sm font-semibold ${
        isOverdue ? "text-red-600" : "text-gray-700"
      } ${className}`}
    >
      <span>{timeLeft}</span>
      <Clock className="w-4 h-4 text-gray-600" />
    </div>
  );
}

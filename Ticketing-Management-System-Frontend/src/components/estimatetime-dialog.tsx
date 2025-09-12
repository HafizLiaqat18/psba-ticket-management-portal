"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { setCurrentTicket } from "@/utils/helper";
import { Ticket } from "@/types/tickets";

type EstimateTimeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setTicket: (ticket: Ticket) => void;
  ticketId: string;
};

export function EstimateTimeDialog({
  open,
  onOpenChange,
  setTicket,
  ticketId,
}: EstimateTimeDialogProps) {
  const [date, setDate] = useState<Date | null>(null);
  const [hour, setHour] = useState<string>("");
  const [minute, setMinute] = useState<string>("");
  const [priority, setPriority] = useState<string>("");

  const now = new Date();
  const today = useMemo(
    () => new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    []
  );
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Check if selected date/time is in the future
  const isValidDateTime = () => {
    if (!date || hour === "" || minute === "") return false;

    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(Number(hour), Number(minute), 0, 0);

    return selectedDateTime > now;
  };

  // Get available hours based on selected date
  const getAvailableHours = () => {
    if (!date) return [];

    const isToday = date.getTime() === today.getTime();
    const hours = Array.from({ length: 24 }, (_, i) => i);

    if (isToday) {
      // If today, only show hours from current hour onwards
      return hours.filter((hour) => hour >= currentHour);
    }

    return hours;
  };

  // Get available minutes based on selected date and hour
  const getAvailableMinutes = () => {
    if (!date || hour === "") return ["00", "15", "30", "45"];

    const isToday = date.getTime() === today.getTime();
    const selectedHour = Number(hour);
    const allMinutes = ["00", "15", "30", "45"];

    if (isToday && selectedHour === currentHour) {
      // If today and current hour, only show minutes after current minute
      return allMinutes.filter((min) => Number(min) > currentMinute);
    }

    return allMinutes;
  };

  // Reset hour and minute when date changes to today and current selections are invalid
  useEffect(() => {
    if (date) {
      const isToday = date.getTime() === today.getTime();

      if (isToday) {
        // If date is today and selected hour is in the past, reset hour
        if (hour !== "" && Number(hour) < currentHour) {
          setHour("");
          setMinute("");
        }
        // If hour is current hour and selected minute is in the past, reset minute
        else if (
          hour !== "" &&
          Number(hour) === currentHour &&
          minute !== "" &&
          Number(minute) <= currentMinute
        ) {
          setMinute("");
        }
      }
    }
  }, [date, hour, minute, currentHour, currentMinute, today]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setDate(null);
      setHour("");
      setMinute("");
      setPriority("");
    }
  }, [open]);

  const handleSet = async () => {
    if (!isValidDateTime()) return;

    const fullDate = new Date(date!);
    fullDate.setHours(Number(hour), Number(minute), 0, 0);

    const payload = {
      estimatedResolutionTime: fullDate.toISOString(),
      priority: priority || "medium",
    };

    try {
      console.log("🔼 Sending to API:", payload);
      const { data } = await api.patch(`/ticket/set-time/${ticketId}`, payload);
      toast.success("Estimated resolution time set successfully.");

      setTicket(data.data.ticket);
      onOpenChange(false);
      setCurrentTicket(data.data.ticket);
    } catch (error) {
      toast.error("Failed to set estimated resolution time.");
      console.error("❌ Error setting estimated resolution time:", error);
    }
  };

  const availableHours = getAvailableHours();
  const availableMinutes = getAvailableMinutes();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Estimated Resolution Time</DialogTitle>
          <DialogDescription>
            Please estimate how long it will take to resolve this ticket.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Date Picker */}
          <div>
            <Label className="py-2">Pick a Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? date.toDateString() : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date ?? undefined}
                  onSelect={(d) => {
                    if (d && d >= today) {
                      setDate(d);
                      // Reset hour and minute when date changes
                      setHour("");
                      setMinute("");
                    }
                  }}
                  disabled={(d) => d < today}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Hour & Minute Select */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <Label className="py-2">Hour</Label>
              <Select
                value={hour}
                onValueChange={(value) => {
                  setHour(value);
                  setMinute(""); // Reset minute when hour changes
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent>
                  {availableHours.map((h) => (
                    <SelectItem key={h} value={String(h).padStart(2, "0")}>
                      {String(h).padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/2">
              <Label className="py-2">Minute</Label>
              <Select value={minute} onValueChange={setMinute} disabled={!hour}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Minute" />
                </SelectTrigger>
                <SelectContent>
                  {availableMinutes.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority Select */}
          <div>
            <Label className="py-2">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!isValidDateTime()}
            onClick={handleSet}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Clock className="h-4 w-4 mr-2" />
            Set Time
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Ticket } from "@/types/tickets";
import api from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import toast from "react-hot-toast";
import { useTicket } from "@/context/ticket-context";

type ReferTicketDialogProps = {
  ticket: Ticket;
  setTicket: Dispatch<SetStateAction<Ticket>>;
};

export default function ReferTicketDialog({
  ticket,
  setTicket,
}: ReferTicketDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [referReason, setReferReason] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReferred, setIsReferred] = useState(false);
  const { user } = useAuth();
  const { departments } = useTicket();

  const handleReferTicket = async () => {
    if (!referReason.trim() || !selectedDepartment) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await api.patch(
        `/ticket/refer-department/${ticket._id}`,
        {
          comment: referReason,
          departmentId: selectedDepartment,
        }
      );
      toast.success("Ticket referred successfully.");
      setTicket(data.data.ticket);
      setIsReferred(true);
      setReferReason("");
      setSelectedDepartment("");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to refer ticket. Please try again.");
      console.error("Error referring ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setReferReason("");
    setSelectedDepartment("");
    setIsOpen(false);
  };

  if (user?.role === "user") {
    return null;
  }

  // Only show the button if ticket status is not resolved
  if (ticket.status === "resolved" || ticket.status === "closed") {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isReferred || isSubmitting}
          className="bg-green-600 hover:bg-green-700 text-white hover:text-white shadow-sm hover:shadow-md transition-all duration-200"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          {isReferred ? "Reffered Ticket" : " Refer Ticket"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] p-6 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800">
        <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-800">
          <DialogTitle className="text-3xl font-extrabold flex items-center gap-3 text-gray-900 dark:text-gray-50">
            <ExternalLink className="h-8 w-8 text-green-600" />
            Refer Ticket
          </DialogTitle>
          <DialogDescription className="text-md text-gray-600 dark:text-gray-400 mt-2">
            Please provide a reason for referring this ticket and select the
            department to send it to.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-6">
          <div className="grid gap-2">
            <Label
              htmlFor="refer-reason"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Reason for Referral <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="refer-reason"
              placeholder="Explain why this ticket needs to be referred..."
              value={referReason}
              onChange={(e) => setReferReason(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 min-h-[100px] focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-y"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="department"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Department <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent className="rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-lg">
                {departments?.map((dept) => {
                  if (dept._id === user?.assignedTo?._id) return null;
                  return (
                    <SelectItem key={dept?._id} value={dept?._id}>
                      {dept?.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Select the department that can better handle this ticket.
            </p>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-gray-200 dark:border-gray-800 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="px-6 py-3 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleReferTicket}
            disabled={
              !referReason.trim() || !selectedDepartment || isSubmitting
            }
            className="px-6 py-3 text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Referring...
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4 mr-2" />
                {isReferred ? "Referred" : "Refer Ticket"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { CheckCircle2, XCircle } from "lucide-react";
import api from "@/lib/api";
import { Ticket } from "@/types/tickets";

interface CloseTicketDialogProps {
  ticket: Ticket;
  setTicket: (ticket: Ticket) => void;
}

export function CloseTicketDialog({
  ticket,
  setTicket,
}: CloseTicketDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = async () => {
    if (!feedback.trim()) {
      toast.error("Please provide feedback before closing the ticket.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await api.patch(`/ticket/close-ticket/${ticket._id}`, {
        feedback: feedback.trim(),
      });

      setTicket(data.data.ticket);

      toast.success("Ticket closed successfully!");

      // Reset form and close dialog
      setFeedback("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error closing ticket:", error);
      toast.error("Failed to close ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFeedback("");
    setIsOpen(false);
  };

  // Only show the button if ticket status is 'resolved'
  if (ticket.status !== "resolved") {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="px-6 py-3 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 bg-green-600 hover:bg-green-700">
          <CheckCircle2 className="mr-2 h-5 w-5" />
          Close Ticket
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] p-6 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800">
        <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-800">
          <DialogTitle className="text-3xl font-extrabold flex items-center gap-3 text-gray-900 dark:text-gray-50">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            Close Ticket
          </DialogTitle>
          <DialogDescription className="text-md text-gray-600 dark:text-gray-400 mt-2">
            Please provide feedback about the resolution before closing this
            ticket.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="grid gap-2">
            <Label
              htmlFor="feedback"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Feedback <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Please share your feedback about the resolution. How satisfied are you with the solution provided?"
              className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 min-h-[120px] focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-y"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Your feedback helps us improve our service quality.
            </p>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-gray-200 dark:border-gray-800 gap-2">
          <Button
            type="button"
            variant="outline"
            size={"sm"}
            onClick={handleCancel}
            className="px-6 py-3 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200"
            disabled={isSubmitting}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting || !feedback.trim()}
            className="px-6 py-3 text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Closing...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Close Ticket
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

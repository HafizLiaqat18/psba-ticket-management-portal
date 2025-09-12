"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { Ticket } from "@/types/tickets";
import api from "@/lib/api";
import { setCurrentTicket } from "@/utils/helper";
import toast from "react-hot-toast";

type ResolveTicketDialogProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  ticketId: string;
  setTicket: Dispatch<SetStateAction<Ticket>>;
};

export function ResolveTicketDialog({
  open,
  setOpen,
  setTicket,
  ticketId,
}: ResolveTicketDialogProps) {
  const [resolveComment, setResolveComment] = useState("");

  const handleResolve = async () => {
    try {
      const { data } = await api.patch(`/ticket/set-resolved/${ticketId}`, {
        comment: resolveComment,
      });
      toast.success("Ticket resolved successfully.");
      setCurrentTicket(data.data.ticket);
      setTicket(data.data.ticket);
    } catch (error) {
      toast.error("Failed to resolve ticket. Please try again");
      console.error("Error resolving ticket:", error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolve Ticket</DialogTitle>
          <DialogDescription>
            Please provide a resolution comment for this ticket.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="resolve-comment" className="py-2">
              Final Remarks
            </Label>
            <Textarea
              id="resolve-comment"
              placeholder="Describe how this ticket was resolved..."
              value={resolveComment}
              onChange={(e) => setResolveComment(e.target.value)}
              className="min-h-24"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleResolve}
            disabled={!resolveComment.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Resolve Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

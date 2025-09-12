"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { CheckCircle, ListChecks, Play } from "lucide-react";

import { useEffect, useState } from "react";
import { Ticket } from "@/types/tickets";
import { useParams } from "next/navigation";
import ReferTicketDialog from "@/components/referdepartment-dialog";
import { ResolveTicketDialog } from "@/components/resolveticket-dialog";
import { EstimateTimeDialog } from "@/components/estimatetime-dialog";

import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { formatTime } from "@/utils/helper";
import { StatusTimeline } from "@/components/status-timeline";

import { CloseTicketDialog } from "@/components/close-ticket-dialog";
import showError from "@/components/send-error";
import TicketDetailComment from "@/components/TicketDetailComment";
import TicketDetailDescription from "@/components/TicketDetailDescription";
import TicketDetailsSection from "@/components/TicketDetailsSection";
import TicketDetailImageSection from "@/components/TicketDetailImageSection";

export default function TicketingDetailPage() {
  const params = useParams();
  const [ticket, setTicket] = useState<Ticket>({} as Ticket);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [showEstimateDialog, setShowEstimateDialog] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    async function getTicket() {
      try {
        const { data } = await api.get(`/ticket/get-ticket/${params.id}`);
        setTicket(data.data.ticket);
      } catch (err) {
        showError(err);
      } finally {
        setIsLoading(false);
      }
    }
    getTicket();
  }, [params.id]);

  const handleStartProgress = () => {
    setShowEstimateDialog(true);
  };

  const handleAddComment = async () => {
    try {
      if (!newComment.trim()) return;

      const { data } = await api.patch(`/ticket/add-comment/${ticket._id}`, {
        comment: newComment,
      });

      // Make sure we're using the complete updated ticket with populated comments
      setTicket(data.data.ticket);
      setNewComment("");
      toast.success("Comment added successfully.");
    } catch (error) {
      toast.error("Failed to add comment. Please try again.");
      console.error("Error adding comment:", error);
    }
  };

  if (isLoading) {
    return <>Loading....</>;
  }

  return (
    <div className="min-h-screen p-5 bg-gray-50 font-sans flex flex-col px-8">
      <header className="mt-5 flex justify-between items-center w-full rounded-xl border border-gray-300 p-4 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white px-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="flex flex-row gap-4 items-center">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight space-x-3">
                {ticket?.title} 
               
              </h1>
              <span className="text-xl text-gray-700 font-semibold">(Ticket ID: {ticket.customId?.toString()})</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {ticket.createdBy._id === user?._id &&
            ticket?.status === "resolved" && (
              <CloseTicketDialog ticket={ticket} setTicket={setTicket} />
            )}
          {ticket.createdBy?._id !== user?._id && (
            <div className="flex gap-2">
              <ReferTicketDialog ticket={ticket} setTicket={setTicket} />

              {ticket?.status === "open" &&
                ticket?.assignedTo?._id === user?.assignedTo?._id && (
                  <Button
                    onClick={handleStartProgress}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transition cursor-pointer"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Accept Ticket
                  </Button>
                )}
              {ticket?.status === "in-progress" && (
                <Button
                  onClick={() => setShowResolveDialog(true)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transition"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Resolved
                </Button>
              )}
            </div>
          )}
        </div>
      </header>
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-6 md:py-4  w-full">
        <div className="lg:col-span-2 space-y-6">
          <TicketDetailsSection ticket={ticket} formatTime={formatTime} />

          <TicketDetailDescription description={ticket.description} />

          {ticket?.images?.length > 0 && (
            <TicketDetailImageSection
              images={ticket?.images || []}
              title="Attachments"
            />
          )}
        </div>

        <div className="lg:col-span-1.5 space-y-6">
          <Card className="rounded-xl border border-gray-200 shadow-lg bg-white overflow-hidden transition-all duration-200 hover:shadow-xl p-1 gap-1">
            <CardHeader className="bg-white px-4">
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-green-600" />
                Status History
              </CardTitle>
            </CardHeader>
            <div className="px-4">
              <StatusTimeline ticket={ticket} />
            </div>
          </Card>

          <TicketDetailComment
            ticket={ticket}
            newComment={newComment}
            setNewComment={setNewComment}
            handleAddComment={handleAddComment}
            formatTime={formatTime}
          />
        </div>
      </div>

      <EstimateTimeDialog
        open={showEstimateDialog}
        onOpenChange={setShowEstimateDialog}
        setTicket={setTicket}
        ticketId={ticket._id}
      />

      <ResolveTicketDialog
        open={showResolveDialog}
        setOpen={setShowResolveDialog}
        setTicket={setTicket}
        ticketId={ticket._id}
      />
    </div>
  );
}

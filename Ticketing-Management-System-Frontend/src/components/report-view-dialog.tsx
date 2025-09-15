"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Eye, MessageSquare } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { MarketReport } from "@/types/report";

interface ReportViewDialogProps {
  market: MarketReport;
  onReportUpdate?: (updatedMarket: MarketReport) => void;
  totaldisabled: boolean;
}

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleDateString("en-US", options);
};

export function ReportViewDialog({
  market,
  onReportUpdate,
  totaldisabled,
}: ReportViewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState(market.comments || "");
  const [submittingComment, setSubmittingComment] = useState(false);

  const handleAddComment = async () => {
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      setSubmittingComment(true);
      await api.patch(`/report/update-security-report/${market._id}`, {
        comments: comment,
      });

      // Create updated market object
      const updatedMarket: MarketReport = {
        ...market,
        comments: comment,
        updatedAt: new Date().toISOString(), // Update the timestamp
      };

      toast.success("Comment added successfully");
      setIsOpen(false);

      // Pass the updated market to parent to update state
      onReportUpdate?.(updatedMarket);
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setComment(market.comments || "");
    }
  };

  if (!market.isSubmitted) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          View Report
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] p-0 rounded-xl shadow-2xl border border-gray-200 max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 pb-4 border-b border-gray-200 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-gray-900">
            <Eye className="h-6 w-6 text-primary" />
            {market.marketId.name} - Security Report
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Sahulat Bazaar Name - Disabled */}
            <div className="grid gap-2">
              <Label className="text-sm font-medium text-gray-700">
                Sahulat Bazaar Name
              </Label>
              <Input
                value={market.marketId.name}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Created At - Disabled */}
              <div className="grid gap-2">
                <Label className="text-sm font-medium text-gray-700">
                  Created At
                </Label>
                <Input
                  value={formatDate(market.createdAt)}
                  disabled
                  className="bg-gray-100"
                />
              </div>

              {/* Submitted Status - Disabled */}
              <div className="grid gap-2">
                <Label className="text-sm font-medium text-gray-700">
                  Submitted
                </Label>
                <Input
                  value={market.isSubmitted ? "Yes" : "No"}
                  disabled
                  className="bg-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Total CCTV - Disabled */}
              <div className="grid gap-2">
                <Label className="text-sm font-medium text-gray-700">
                  Total CCTV
                </Label>
                <Input
                  value={market.totalCCTV || 0}
                  disabled
                  className="bg-gray-100"
                />
              </div>

              {/* Faulty CCTV - Disabled */}
              <div className="grid gap-2">
                <Label className="text-sm font-medium text-gray-700">
                  Faulty CCTV
                </Label>
                <Input
                  value={market.faultyCCTV || 0}
                  disabled
                  className="bg-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Metal Detectors - Disabled */}
              <div className="grid gap-2">
                <Label className="text-sm font-medium text-gray-700">
                  Metal Detectors
                </Label>
                <Input
                  value={market.metalDetectors || 0}
                  disabled
                  className="bg-gray-100"
                />
              </div>

              {/* Faulty Metal Detectors - Disabled */}
              <div className="grid gap-2">
                <Label className="text-sm font-medium text-gray-700">
                  Faulty Metal Detectors
                </Label>
                <Input
                  value={market.faultyMetalDetectors || 0}
                  disabled
                  className="bg-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Walkthrough Gates - Disabled */}
              <div className="grid gap-2">
                <Label className="text-sm font-medium text-gray-700">
                  Walkthrough Gates
                </Label>
                <Input
                  value={market.walkthroughGates || 0}
                  disabled
                  className="bg-gray-100"
                />
              </div>

              {/* Faulty Walkthrough Gates - Disabled */}
              <div className="grid gap-2">
                <Label className="text-sm font-medium text-gray-700">
                  Faulty Walkthrough Gates
                </Label>
                <Input
                  value={market.faultyWalkthroughGates || 0}
                  disabled
                  className="bg-gray-100"
                />
              </div>
            </div>

            {/* Biometric Status - Disabled */}
            <div className="grid gap-2">
              <Label className="text-sm font-medium text-gray-700">
                Biometric Status
              </Label>
              <Input
                value={market.biometricStatus ? "Active" : "Inactive"}
                disabled
                className="bg-gray-100"
              />
            </div>

            {/* Comments - Only this field is enabled */}
            <div className="grid gap-2">
              <Label
                htmlFor="comment"
                className="text-sm font-medium text-gray-700"
              >
                IT Department Comments <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="comment"
                placeholder="Enter your comments about this security report..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px] resize-none"
                rows={4}
                disabled={totaldisabled}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-4 border-t border-gray-200 flex-shrink-0">
          <Button
            onClick={handleAddComment}
            disabled={submittingComment || !comment.trim()}
            className="bg-green-600 hover:bg-green-700"
          >
            {submittingComment ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4 mr-2" />
                Save Comment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

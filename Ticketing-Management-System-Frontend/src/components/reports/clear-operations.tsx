"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Send, AlertTriangle } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export function ClearOperationsDialog({
  id,
  cleared,
  clearedByIT,
  clearedByMonitoring,
}: {
  id: string;
  cleared: boolean;
  clearedByIT: boolean;
  clearedByMonitoring: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);

  const handleSendToOperations = async () => {
    try {
      await api.patch(`/report/clear-by-operations/${id}`);
      toast.success("Report sent to Operations Department successfully!");
      setIsOpen(false);
      setShouldShow(false);
    } catch (error) {
      console.error("Error sending report to Operations:", error);
      toast.error("Failed to send report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  if (!shouldShow) {
    return null;
  }

  if (!clearedByIT || !clearedByMonitoring || cleared) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-green-600 hover:bg-green-700 text-white hover:text-white shadow-sm hover:shadow-md transition-all duration-200"
        >
          <Send className="h-4 w-4 mr-2" />
          Final Report
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px] p-6 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800">
        <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-800">
          <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-50">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            Confirm Finalize
          </DialogTitle>
          <DialogDescription className="text-md text-gray-600 dark:text-gray-400 mt-2">
            This action will send the compiled report
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <p className="font-medium mb-1">
                Are you sure you want to send this report to the Operations
                Department?
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Once sent, the report will be reviewed by the Operations team.
              </p>
            </div>
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
            onClick={handleSendToOperations}
            disabled={isSubmitting}
            className="px-6 py-3 text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Yes, Send Report
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

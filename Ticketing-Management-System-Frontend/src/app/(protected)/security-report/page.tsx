"use client";

import { useAuth } from "@/context/auth-context";
import { SecurityReportDialog } from "@/components/security-report-dialog";

export default function SecurityReportPage() {
  const { user } = useAuth();

  const canReport = user?.assignedToType === "Market";

  return (
    <div className="flex bg-gray-50 flex-1 flex-col gap-6 p-6">
      <div className="mx-4">
        <h1 className="text-3xl font-extrabold">Security & Surveillance Report</h1>
        <p className="text-gray-600 mt-1">
          Submit the weekly security status for your Sahulat Bazar. This form mirrors the dialog used on the dashboard.
        </p>
      </div>

      <div className="mx-4">
        {canReport ? (
          <SecurityReportDialog />
        ) : (
          <div className="rounded-md border bg-white p-4 text-gray-700">
            You are not assigned to a Sahulat Bazar. This page is available for bazar-assigned users.
          </div>
        )}
      </div>
    </div>
  );
}

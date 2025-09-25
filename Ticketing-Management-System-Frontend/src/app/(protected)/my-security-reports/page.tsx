"use client";

import { useAuth } from "@/context/auth-context";

export default function MySecurityReportsPage() {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6 px-10 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Security & Surveillance Reports</h1>
          <p className="text-gray-600 text-sm mt-1">
            Submit your Security & Surveillance status report using the sidebar menu.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Create Security Report
          </h2>
          <p className="text-gray-600 mb-6">
            Use the "My Security & Surveillance Reports" option in the sidebar to submit your weekly Security & Surveillance status report.
          </p>
        </div>
      </div>
    </div>
  );
}

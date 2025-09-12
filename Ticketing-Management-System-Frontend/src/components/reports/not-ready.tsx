"use client";

import { FileWarning } from "lucide-react";

export default function NotReadyWeeklyReport() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 px-4">
      <div className="flex flex-col items-center gap-4 bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <FileWarning className="h-16 w-16 text-yellow-500 mb-2" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Weekly Report</h1>
        <p className="text-lg text-gray-700 text-center">
          The weekly report is{" "}
          <span className="font-semibold text-yellow-600">
            not prepared yet
          </span>
          .
        </p>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Please check back later. Once the report is compiled, it will be
          available here.
        </p>
      </div>
    </div>
  );
}

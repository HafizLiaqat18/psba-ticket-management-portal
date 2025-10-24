"use client";

import SecurityReportsPage from "./report-page";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { WeeklyReport } from "@/types/report";

import { useAuth } from "@/context/auth-context";
import NotReadyWeeklyReport from "@/components/reports/not-ready";

export default function Page() {
  const [reportData, setReportData] = useState<WeeklyReport>(
    {} as WeeklyReport
  );
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchWeeklyReport();
  }, []);

  const fetchWeeklyReport = async () => {
    try {
      setLoading(true);
      const { data } = await api("/report/get-weekly-report");
      console.log("Weekly Report Data:", data);
      console.log("Markets Report:", data.data.report.marketsReport);
      if (data.data.report.marketsReport && data.data.report.marketsReport.length > 0) {
        console.log("First market report:", data.data.report.marketsReport[0]);
        console.log("Market ID:", data.data.report.marketsReport[0].marketId);
      }
      setReportData(data.data.report);
    } catch (error) {
      console.error("Error fetching weekly report:", error);
    } finally {
      setLoading(false);
    }
  };

  if (
    !reportData?.clearedByIt &&
    user?.assignedTo.name.includes("Monitoring")
  ) {
    return <NotReadyWeeklyReport />;
  }

  if (
    !reportData?.clearedByMonitoring &&
    user?.assignedTo.name.includes("Operation")
  ) {
    return <NotReadyWeeklyReport />;
  }

  return (
    <div>
      <SecurityReportsPage
        reportData={reportData}
        loading={loading}
        setReportData={setReportData}
      />
    </div>
  );
}

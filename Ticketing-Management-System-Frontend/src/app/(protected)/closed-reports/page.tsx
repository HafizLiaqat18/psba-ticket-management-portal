"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, FileDown, TicketIcon } from "lucide-react";
import { DataTable } from "@/components/ticketingDataTable/DataTable";
import { getWeeklyReportColumns } from "@/components/reports/columns"; // ✅ custom columns
import { WeeklyReport } from "@/types/report";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import showError from "@/components/send-error";
import { generateExcelReport } from "@/utils/helper"; // ✅ your download util

export default function CloseReportPage() {
  const [selectDate, setSelectDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const getReports = async () => {
    if (!selectDate || !fromDate) {
      toast.error("Please select both Select Date and From Date");
      return;
    }
    if (new Date(selectDate) > new Date(fromDate)) {
      toast.error("Select Date cannot be later than From Date");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/report/get-report-by-date", {
        startDate: selectDate,
        endDate: fromDate,
      });

      setReports(res?.data.data.report);
      console.log(res?.data);
    } catch (error) {
      showError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    setSelectDate(weekAgo.toISOString().split("T")[0]);
    setFromDate(today.toISOString().split("T")[0]);
  }, []);

  const columns = getWeeklyReportColumns();

  return (
    <div className="flex bg-gray-50 flex-1 flex-col gap-4 p-6">
      {/* Page Header */}
      <div className="flex justify-between mx-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Previous Weekly Reports
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Search, review, and download your completed reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={getReports}
            disabled={isLoading}
            className="h-8 bg-green-600 hover:bg-green-700 text-white font-medium"
            size={"sm"}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-3"></div>
                Searching...
              </>
            ) : (
              <span className="flex items-center justify-center">
                <TicketIcon className="h-4 w-4 mr-2" /> Get Reports
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Search Form */}
      <div className="grid grid-cols-1 mt-5 md:grid-cols-4 gap-6 items-end mx-10">
        <div className="space-y-2">
          <Label htmlFor="selectDate" className="flex items-center  gap-2">
            <CalendarDays className="w-4 h-4  text-green-600" /> Select Date
          </Label>
          <Input
            id="selectDate"
            className="bg-white "
            type="date"
            value={selectDate}
            onChange={(e) => setSelectDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fromDate" className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-green-600" /> From Date
          </Label>
          <Input
            id="fromDate"
            className="bg-white"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {reports.length > 0 ? (
        <DataTable
          columns={columns}
          data={reports}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      ) : (
        !isLoading && (
          <div className="text-center py-12 text-slate-500">
            <TicketIcon className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No reports found for the selected date range.</p>
          </div>
        )
      )}
    </div>
  );
}

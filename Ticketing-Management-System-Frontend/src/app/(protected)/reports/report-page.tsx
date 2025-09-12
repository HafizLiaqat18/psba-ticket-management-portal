"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, ChevronLeft, ChevronRight } from "lucide-react";

import { generateExcelReport } from "@/utils/helper";
import { ReportViewDialog } from "@/components/report-view-dialog";
import { MarketReport, WeeklyReport } from "@/types/report";
import { SendMonitoringDialog } from "@/components/reports/send-monitoring";
import { SendOperationsDialog } from "@/components/reports/send-operations";
import { ClearOperationsDialog } from "@/components/reports/clear-operations";
import { ReportStatusTimeline } from "@/components/reports/report-status";
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

interface pageProps {
  reportData: WeeklyReport;
  loading: boolean;
  setReportData: React.Dispatch<React.SetStateAction<WeeklyReport>>;
}

export default function SecurityReportsPage({
  reportData,
  loading,
  setReportData,
}: pageProps) {
  const [activeTab, setActiveTab] = useState("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Reset to first page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleReportUpdate = (updatedMarket: MarketReport) => {
    setReportData((prevData) => {
      if (!prevData) return prevData;

      return {
        ...prevData,
        marketsReport: prevData.marketsReport.map((market) =>
          market._id === updatedMarket._id ? updatedMarket : market
        ),
      };
    });
  };

  const allMarkets = reportData?.marketsReport || [];
  const submittedMarkets = allMarkets.filter((market) => market.isSubmitted);
  const notSubmittedMarkets = allMarkets.filter(
    (market) => !market.isSubmitted
  );

  // Get current tab data
  const getCurrentTabData = () => {
    switch (activeTab) {
      case "submitted":
        return submittedMarkets;
      case "not-submitted":
        return notSubmittedMarkets;
      default:
        return allMarkets;
    }
  };

  const currentTabData = getCurrentTabData();
  const totalPages = Math.ceil(currentTabData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPageData = currentTabData.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  const renderMarketTable = (markets: MarketReport[]) => (
    <div className="space-y-4">
      <Table className="bg-white rounded-md p-2">
        <TableHeader className="px-2">
          <TableRow>
            <TableHead>Market Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Submitted At</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {markets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No reports found
              </TableCell>
            </TableRow>
          ) : (
            markets.map((market) => (
              <TableRow key={market._id}>
                <TableCell className="font-medium">
                  {market.marketId.name}
                </TableCell>
                <TableCell>{formatDate(market.createdAt)}</TableCell>
                <TableCell>
                  {market?.updatedAt
                    ? formatDate(market.updatedAt)
                    : "Not submitted Yet"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={market.isSubmitted ? "default" : "destructive"}
                  >
                    {market.isSubmitted ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <ReportViewDialog
                    market={market}
                    onReportUpdate={handleReportUpdate}
                    totaldisabled={reportData.clearedByIt}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {currentTabData.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Rows per page:</span>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={handleRowsPerPageChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, currentTabData.length)} of{" "}
              {currentTabData.length} results
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading weekly report...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 px-10 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Weekly Security Reports</h1>
        </div>
        <div className="flex gap-2">
          <ReportStatusTimeline report={reportData} />
          <Button
            onClick={() => reportData && generateExcelReport(reportData)}
            variant="outline"
            className="bg-green-600 text-white"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Generate Excel Report
          </Button>
          <>
            <SendMonitoringDialog
              id={reportData?._id || ""}
              cleared={reportData.clearedByIt}
            />
            <SendOperationsDialog
              id={reportData?._id || ""}
              cleared={reportData.clearedByMonitoring}
              clearedByIT={reportData.clearedByIt}
            />
            <ClearOperationsDialog
              id={reportData?._id || ""}
              cleared={reportData.clearedByOperations}
              clearedByIT={reportData.clearedByIt}
              clearedByMonitoring={reportData.clearedByMonitoring}
            />
          </>
        </div>
      </div>
      <div className="flex flex-end">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-[40%] grid-cols-3">
            <TabsTrigger value="all">
              All Markets ({allMarkets.length})
            </TabsTrigger>
            <TabsTrigger value="submitted">
              Submitted ({submittedMarkets.length})
            </TabsTrigger>
            <TabsTrigger value="not-submitted">
              Not Submitted ({notSubmittedMarkets.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {renderMarketTable(currentPageData)}
          </TabsContent>

          <TabsContent value="submitted" className="mt-6">
            {renderMarketTable(currentPageData)}
          </TabsContent>

          <TabsContent value="not-submitted" className="mt-6">
            {renderMarketTable(currentPageData)}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

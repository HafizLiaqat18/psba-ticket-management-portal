import { Ticket } from "@/types/tickets";
import * as XLSX from "xlsx";
import { WeeklyReport } from "@/types/report";
import { format } from "path";

function formatDateTime(dateString: string | Date) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(timestamp: number) {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return date.toLocaleString("en-US", options);
}

function setCurrentTicket(t: Ticket) {
  const ticket = JSON.stringify(t);
  sessionStorage.setItem("currentTicket", ticket);
  return;
}

function getCurrentTicket(): Ticket | null {
  const t = sessionStorage.getItem("currentTicket");
  return t ? JSON.parse(t) : null;
}

const generateExcelReport = (reportData: WeeklyReport) => {
  if (!reportData) return;

  const excelData = reportData.marketsReport.map((report) => ({
    "Sahulat Bazaar Name": report.marketId.name,
    "Created At": formatDateTime(report.createdAt),
    Submitted: report.isSubmitted ? "Yes" : "No",
    "Submitted At": report.submittedAt
      ? formatDateTime(report.submittedAt)
      : "N/A",
    CCTV: report.totalCCTV || 0,
    "Faulty CCTV": report.faultyCCTV || 0,
    "Walkthrough Gates": report.walkthroughGates || 0,
    "Faulty Walkthrough Gates": report.faultyWalkthroughGates || 0,
    "Metal Detectors": report.metalDetectors || 0,
    "Faulty Metal Detectors": report.faultyMetalDetectors || 0,
    "Biometric Status": report.biometricStatus ? "Yes" : "No",
    Comments: report.comments || "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Security Report");

  const fileName = `Security_Report_${
    new Date().toISOString().split("T")[0]
  }.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

function formatDuration(ms?: number | null) {
  if (ms == null || isNaN(ms)) return "N/A";
  if (ms < 0) ms = 0;

  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  if (ms < minute) {
    const s = Math.floor(ms / 1000);
    return `${s} ${s === 1 ? "second" : "seconds"}`;
  } else if (ms < hour) {
    const m = Math.floor(ms / minute);
    return `${m} ${m === 1 ? "minute" : "minutes"}`;
  } else if (ms < day) {
    const h = Math.floor(ms / hour);
    return `${h} ${h === 1 ? "hour" : "hours"}`;
  } else if (ms < month) {
    const d = Math.floor(ms / day);
    return `${d} ${d === 1 ? "day" : "days"}`;
  } else if (ms < year) {
    const mo = Math.floor(ms / month);
    return `${mo} ${mo === 1 ? "month" : "months"}`;
  } else {
    const y = Math.floor(ms / year);
    return `${y} ${y === 1 ? "year" : "years"}`;
  }
}

const generateTicketsExcel = (tickets: Ticket[]) => {
  if (!tickets?.length) return;

  const excelData = tickets.map((t) => ({
    "Ticket ID": t._id,
    Title: t.title,
    Description: t.description,
    "Department": t.assignedTo?.name ?? "",
    Priority: t.priority,
    Status: t.status,
    "Created By": t.createdBy?.name ?? "",
    "Created By (Assigned To)": t.createdBy?.assignedTo?.name ?? "",
    // Images: (t.images ?? []).join(", "),
    "Created At": formatDateTime(t.createdAt),
    "In Progress At": t.inProgressAt ? formatDateTime(t.inProgressAt) : "N/A",
    "Estimated Resolution Time": t.estimatedResolutionTime ? formatDateTime(t.estimatedResolutionTime) : "N/A",
    "Resolved At": t.resolvedAt ? formatDateTime(t.resolvedAt) : "N/A",
    "Closed At": t.closedAt ? formatDateTime(t.closedAt) : "N/A",
    "ResolvedIn":formatDuration(t.resolvedIn as number),
    Comments: (t.comments ?? [])
      .map(
        (c) =>
          `${c.commentedBy?.name ?? "Unknown"}: ${c.comment} (${formatDateTime(
            c.createdAt
          )})`
      )
      .join(" | "),
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  // Auto width for columns (cap at 60 chars)
  const headers = Object.keys(excelData[0] ?? {}) as Array<keyof typeof excelData[0]>;
  const colWidths = headers.map((h) => {
    const maxLen = Math.max(
      h.length,
      ...excelData.map((row) => String(row[h] ?? "").length)
    );
    return { wch: Math.min(60, maxLen + 2) };
  });
  (worksheet as any)["!cols"] = colWidths;

  // Autofilter over full range
  if (worksheet["!ref"]) {
    (worksheet as any)["!autofilter"] = { ref: worksheet["!ref"] };
  }

  // Freeze header row
  (worksheet as any)["!freeze"] = { ySplit: 1, topLeftCell: "A2" };

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");

  const fileName = `Tickets_Report_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export {
  formatDateTime,
  setCurrentTicket,
  getCurrentTicket,
  formatTime,
  generateExcelReport,
  generateTicketsExcel,
  formatDuration
};

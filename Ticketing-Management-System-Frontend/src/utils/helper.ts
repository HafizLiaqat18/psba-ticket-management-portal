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

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([]);

  // Add header information
  const currentDate = new Date().toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  // Header rows
  XLSX.utils.sheet_add_aoa(worksheet, [
    ["PUNJAB SAHULAT BAZAARS AUTHORITY"],
    ["Security & Surveillance Report by IT Department"],
    [`Date: ${currentDate}`, "", "", "", "", "", "", "", `Day: ${new Date().toLocaleDateString("en-US", { weekday: "long" })}`],
    [],
    ["Bazaar Name", "CCTV Camera(s)", "Faulty CCTV Camera(s)", "Walkthrough Gates", "Faulty Walkthrough Gates", "Metal Detectors", "Faulty Metal Detectors", "Biometric Status (Yes/No)", "Comments/Remarks by the IT Department"]
  ], { origin: "A1" });

  // Add data rows
  const dataStartRow = 6;
  reportData.marketsReport.forEach((report, index) => {
    const rowData = [
  (report.marketId?.name ?? ""),
      report.totalCCTV || 0,
      report.faultyCCTV || 0,
      report.walkthroughGates || 0,
      report.faultyWalkthroughGates || 0,
      report.metalDetectors || 0,
      report.faultyMetalDetectors || 0,
      report.biometricStatus ? "YES" : "NO",
      report.comments || ""
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: `A${dataStartRow + index}` });
  });

  // Add totals row
  const totalRow = dataStartRow + reportData.marketsReport.length;
  const totals = reportData.marketsReport.reduce((acc, report) => ({
    totalCCTV: acc.totalCCTV + (report.totalCCTV || 0),
    faultyCCTV: acc.faultyCCTV + (report.faultyCCTV || 0),
    walkthroughGates: acc.walkthroughGates + (report.walkthroughGates || 0),
    faultyWalkthroughGates: acc.faultyWalkthroughGates + (report.faultyWalkthroughGates || 0),
    metalDetectors: acc.metalDetectors + (report.metalDetectors || 0),
    faultyMetalDetectors: acc.faultyMetalDetectors + (report.faultyMetalDetectors || 0)
  }), { totalCCTV: 0, faultyCCTV: 0, walkthroughGates: 0, faultyWalkthroughGates: 0, metalDetectors: 0, faultyMetalDetectors: 0 });

  XLSX.utils.sheet_add_aoa(worksheet, [
    ["Total", totals.totalCCTV, totals.faultyCCTV, totals.walkthroughGates, totals.faultyWalkthroughGates, totals.metalDetectors, totals.faultyMetalDetectors, "", ""]
  ], { origin: `A${totalRow}` });

  // Set column widths
  worksheet['!cols'] = [
    { wch: 20 }, // Bazaar Name
    { wch: 15 }, // CCTV Camera(s)
    { wch: 18 }, // Faulty CCTV Camera(s)
    { wch: 18 }, // Walkthrough Gates
    { wch: 22 }, // Faulty Walkthrough Gates
    { wch: 16 }, // Metal Detectors
    { wch: 20 }, // Faulty Metal Detectors
    { wch: 18 }, // Biometric Status
    { wch: 35 }  // Comments
  ];

  // Apply styling and conditional formatting
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  
  // Style header rows
  for (let R = 0; R <= 4; R++) {
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[cellAddress]) continue;
      
      worksheet[cellAddress].s = {
        font: { bold: true, sz: R < 2 ? 14 : 12 },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        }
      };
    }
  }

  // Apply conditional formatting to data rows
  for (let R = dataStartRow - 1; R < totalRow; R++) {
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[cellAddress]) continue;

      // Initialize cell style with default border
      if (!worksheet[cellAddress].s) {
        worksheet[cellAddress].s = {};
      }
      
      worksheet[cellAddress].s.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      };

      // Apply conditional formatting only to numeric columns (skip bazaar name and comments)
      if (C >= 1 && C <= 6) { // Columns B to G (CCTV, Faulty CCTV, Gates, Faulty Gates, Metal, Faulty Metal)
        const cellValue = worksheet[cellAddress].v;
        
        if (typeof cellValue === 'number') {
          if (cellValue > 0) {
            // Red background for values > 0
            worksheet[cellAddress].s.fill = {
              fgColor: { rgb: "FFCCCC" }
            };
          } else if (cellValue === 0) {
            // Green background for values = 0
            worksheet[cellAddress].s.fill = {
              fgColor: { rgb: "CCFFCC" }
            };
          }
        }
      }
    }
  }

  // Style totals row
  for (let C = range.s.c; C <= range.e.c; C++) {
    const cellAddress = XLSX.utils.encode_cell({ r: totalRow - 1, c: C });
    if (!worksheet[cellAddress]) continue;
    
    // Initialize style object
    worksheet[cellAddress].s = {
      font: { bold: true },
      border: {
        top: { style: 'thick' },
        bottom: { style: 'thick' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      }
    };

    // Apply conditional formatting to totals row for numeric columns
    if (C >= 1 && C <= 6) { // Columns B to G (numeric columns)
      const cellValue = worksheet[cellAddress].v;
      
      if (typeof cellValue === 'number') {
        if (cellValue > 0) {
          worksheet[cellAddress].s.fill = { fgColor: { rgb: "FFCCCC" } }; // Red
        } else if (cellValue === 0) {
          worksheet[cellAddress].s.fill = { fgColor: { rgb: "CCFFCC" } }; // Green
        }
      } else {
        // Default gray background for non-numeric cells in totals row
        worksheet[cellAddress].s.fill = { fgColor: { rgb: "E6E6E6" } };
      }
    } else {
      // Default gray background for bazaar name and comments columns
      worksheet[cellAddress].s.fill = { fgColor: { rgb: "E6E6E6" } };
    }
  }

  // Merge header cells
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }, // Main title
    { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } }, // Subtitle
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, "Security Report");

  const fileName = `PSBA_Security_Surveillance_Report_${new Date().toISOString().split("T")[0]}.xlsx`;
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

// components/tickets/DashboardTabs.tsx
"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateTicketDialog } from "@/components/createticket-dialog";
import { SecurityReportDialog } from "./security-report-dialog";

export default function DashboardTabs({
  activeTab,
  setActiveTab,
  getTabCount,
}: any) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mx-10">
      <div className="py-3.5 flex justify-between">
        <TabsList className="grid w-[40%] grid-cols-4">
          <TabsTrigger value="all">All ({getTabCount("all")})</TabsTrigger>
          <TabsTrigger value="open">Open ({getTabCount("open")})</TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({getTabCount("in-progress")})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            Resolved ({getTabCount("resolved")})
          </TabsTrigger>
        </TabsList>
        <div className="flex gap-2">
          <SecurityReportDialog />
          <CreateTicketDialog />
        </div>
      </div>
    </Tabs>
  );
}

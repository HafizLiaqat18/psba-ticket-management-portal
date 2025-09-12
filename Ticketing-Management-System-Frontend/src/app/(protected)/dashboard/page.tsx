"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/auth-context";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import DashboardTabs from "@/components/DashboardTabs";
import { DataTable } from "@/components/ticketingDataTable/DataTable";
import { getTicketColumns } from "@/components/ticketingDataTable/columns";
import { Ticket } from "@/types/tickets";
import showError from "@/components/send-error";

export default function TicketManagementPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await api.get(`/ticket/${user?.assignedTo?._id}`);
        const data = res.data;
        if (data?.data?.tickets) {
          setTickets(data?.data?.tickets);
        }
      } catch (err) {
        showError(err);
      }
    }

    if (!isLoading && user?.assignedTo?._id) {
      fetchTickets();
    }
  }, [user, isLoading]);

  const filteredTickets = useMemo(() => {
    if (activeTab === "all") return tickets;

    return tickets.filter((ticket) => {
      const status = ticket.status?.toLowerCase();
      if (activeTab === "resolved") {
        return status === "resolved" || status === "closed";
      }
      if (activeTab === "in-progress") {
        return status === "in-progress";
      }
      return status === activeTab;
    });
  }, [tickets, activeTab]);

  const getTabCount = (status: string) => {
    if (status === "all") return tickets.length;

    return tickets.filter((ticket) => {
      const s = ticket.status?.toLowerCase();
      if (status === "resolved") return s === "resolved" || s === "closed";
      if (status === "in-progress") return s === "in-progress"; // <-- fix here
      return s === status;
    }).length;
  };

  const handleViewTicket = (ticket: Ticket) => {
    router.replace(`/ticketdetails/${ticket._id}`);
  };

  return (
    <div className="flex bg-gray-50 flex-1 flex-col gap-4 p-4">
      <h1 className="text-3xl  mx-10  font-extrabold">
        {user?.assignedTo?.name}
      </h1>
      <DashboardTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        getTabCount={getTabCount}
      />
      <DataTable
        columns={getTicketColumns(handleViewTicket)}
        data={filteredTickets}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />
    </div>
  );
}

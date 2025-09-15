"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, TicketIcon, Tag, Search } from "lucide-react";
import { DataTable } from "@/components/ticketingDataTable/DataTable";
import { getTicketColumns } from "@/components/ticketingDataTable/columns";
import type { Ticket } from "@/types/tickets";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import showError from "@/components/send-error";
import {generateTicketsExcel} from '@/utils/helper';
import { useAuth } from "@/context/auth-context";

export default function CloseTicketsPage() {
  const [selectDate, setSelectDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [ticketType, setTicketType] = useState<"created" | "assigned">(
    "created"
  );
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [isDownloading,setIsDownloading]=useState(false)
  const [customId,setCustomId]=useState<number>(0)
  const {user} = useAuth();


  const router = useRouter();
  // Reusable fetcher used by both auto and manual flows
  const fetchTickets = async (
    params: { startDate: string; endDate: string; ticketType: "created" | "assigned" }
  ) => {
    setIsLoading(true);
    try {
      const res = await api.post("/ticket/get-tickets", params);
      setTickets(res?.data?.data?.tickets ?? []);
    } catch (error) {
      showError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Raw fetch helper that returns list without touching component state
  const fetchTicketsList = async (
    params: { startDate: string; endDate: string; ticketType: "created" | "assigned" }
  ): Promise<Ticket[]> => {
    const res = await api.post("/ticket/get-tickets", params);
    return res?.data?.data?.tickets ?? [];
  };

  const getTickets = async () => {
    if (!selectDate || !fromDate) {
      toast.error("Please select both Select Date and From Date");
      return;
    }
    if (new Date(selectDate) > new Date(fromDate)) {
      toast.error("Select Date cannot be later than From Date");
      return;
    }
    await fetchTickets({ startDate: selectDate, endDate: fromDate, ticketType });
  };

  

  const handleDownloadReport = async () => {
    if (!selectDate || !fromDate) {
      toast.error("Please select both Select Date and From Date");
      return;
    }
    if (new Date(selectDate) > new Date(fromDate)) {
      toast.error("Select Date cannot be later than From Date");
      return;
    }

    setIsDownloading(true);
    try {
      const res = await api.post("/ticket/get-tickets", {
        startDate: selectDate,
        endDate: fromDate,
        ticketType,
      });

      const fetched = res?.data?.data?.tickets ?? [];
      setTickets(fetched);

      if (!fetched.length) {
        toast.error("No tickets found for the selected date range.");
        return;
      }

      generateTicketsExcel(fetched);
    } catch (error) {
      showError(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSearch= async ()=>{
    try {
      const res = await api.get(`/ticket/customid/${customId}`);
      const customTicket= res?.data?.data?.ticket ? [res.data.data.ticket] :[]
      setTickets(customTicket);
    } catch (error) {
      toast.error("No Ticket Found with this ID")
    } finally {
      setIsLoading(false);
    }
  }

  // Ensure auto-fetch runs only once (handles React Strict Mode double-invoke in dev)
  const didAutoFetchRef = useRef(false);
  useEffect(() => {
    if (didAutoFetchRef.current) return;
    didAutoFetchRef.current = true;

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // Initialize inputs to today's range
    setSelectDate(todayStr);
    setFromDate(todayStr);

    // Auto-load all closed tickets for today: created + assigned
    const loadAllForToday = async () => {
      setIsLoading(true);
      try {
        const [created, assigned] = await Promise.all([
          fetchTicketsList({ startDate: todayStr, endDate: todayStr, ticketType: "created" }),
          fetchTicketsList({ startDate: todayStr, endDate: todayStr, ticketType: "assigned" }),
        ]);
        const merged = [...created, ...assigned];
        const uniqueById = Array.from(new Map(merged.map((t) => [t._id, t])).values());
        setTickets(uniqueById);
      } catch (error) {
        showError(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllForToday();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewTicket = (ticket: Ticket) => {
    router.replace(`/ticketdetails/${ticket._id}`);
  };

  const columns = getTicketColumns(handleViewTicket);

  return (
    <div className="flex bg-gray-50 flex-1 flex-col gap-4 p-6">
      {/* Page Header */}
      <div className="flex justify-between mx-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Closed Tickets</h1>
          <p className="text-slate-600 text-sm mt-1">
            Search and review your completed support tickets
          </p>
        </div>
        <div className="flex  gap-2">
          <Button
            onClick={getTickets}
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
                <TicketIcon className="h-4 w-4 mr-2" /> Get Tickets
              </span>
            )}
          </Button>
          <Button
            onClick={handleDownloadReport}
            disabled={isDownloading}
            className="h-8 bg-green-600 hover:bg-green-700 text-white font-medium"
            size={"sm"}
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-3"></div>
                Searching...
              </>
            ) : (
              <span className="flex items-center justify-center">
                <TicketIcon className="h-4 w-4 mr-2" /> Download Report
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

        <div className="space-y-2 ">
          <Label htmlFor="ticketType" className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-green-600" /> Ticket Type
          </Label>

          <Select
            value={ticketType}
            onValueChange={(value: "created" | "assigned") =>
              setTicketType(value)
            }
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Created by Me</SelectItem>
              <SelectItem value="assigned">Assigned to Me</SelectItem>
            </SelectContent>
          </Select>
        </div>

{ user?.role ==="superadmin" &&       <div className="space-y-2">
          <Label htmlFor="searchBar" className="flex items-center gap-2">
            <TicketIcon className="w-4 h-4 text-green-600" /> Search Tickets
          </Label>
            <div className="flex items-center border border-green-500 rounded-md">
            <Input
              id="searchBar"
              className="flex-1 bg-white border-none focus:ring-0"
              type="text"
              onChange={(e) => setCustomId(Number(e.target.value))}
              placeholder="Search by ticket ID or keyword"
            />
            <Button
              onClick={() => handleSearch()}
              className="bg-green-500 hover:bg-green-600 text-white px-4"
            >
              <Search className="w-4 h-4" />
            </Button>
            </div>
        </div>}
      </div>

      {/* Table */}
      {tickets.length > 0 ? (
        <DataTable
          columns={columns}
          data={tickets}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      ) : (
        !isLoading && (
          <div className="text-center py-12 text-slate-500">
            <TicketIcon className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>No tickets found for the selected date range.</p>
          </div>
        )
      )}
    </div>
  );
}

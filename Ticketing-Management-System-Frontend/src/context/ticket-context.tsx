"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import axios from "axios";
import { Ticket, Department } from "@/types/tickets";

type TicketContextType = {
  departments: Department[];
  markets: Market[];
  myTickets: Ticket[];
  assignTickets: Ticket[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
  setMarkets: React.Dispatch<React.SetStateAction<Market[]>>;
  setMyTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  setAssignTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  addTicket?: (ticket: Ticket) => void;
  viewTicket?: Ticket;
  setViewTicket?: React.Dispatch<React.SetStateAction<Ticket>>;
  fetchUsers?: () => Promise<void>;
  createDepartment?: (name: string) => Promise<void>;
  createMarket?: (name: string) => Promise<void>;
};

type Market = {
  _id: string;
  name: string;
  currentReport?: string;
};

const TicketContext = createContext<TicketContextType>({} as TicketContextType);

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [assignTickets, setAssignTickets] = useState<Ticket[]>([]);
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [viewTicket, setViewTicket] = useState<Ticket>({} as Ticket);

  // ✅ Fetch departments + markets
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/department/get-all-departments");
        const marketsRes = await api.get("/market/get-all-markets");
        setDepartments(res?.data?.data?.departments);
        setMarkets(marketsRes?.data?.data?.markets);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error?.response?.data?.message || "Failed to fetch departments/markets"
          );
        }
      }
    };

    fetchDepartments();
  }, []);

  // ✅ Fetch users (only when needed, e.g. for superadmin)
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users/getallusers");
      return res.data.data.users;
    } catch {
      toast.error("Failed to fetch users");
      return [];
    }
  };

  // ✅ Create Department
  const createDepartment = async (name: string) => {
    if (!name) {
      toast.error("Department name is required");
      return;
    }
    try {
      const { data } = await api.post("department/create-department", { name });
      setDepartments((prev) => [...prev, data.data]);
      toast.success("Department created successfully!");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to create department";
      toast.error(message);
    }
  };

  // ✅ Create Market
  const createMarket = async (name: string) => {
    if (!name) {
      toast.error("Market name is required");
      return;
    }
    try {
      const { data } = await api.post("market/create-market", { name });
      setMarkets((prev) => [...prev, data.data]);
      toast.success("Market created successfully!");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to create market";
      toast.error(message);
    }
  };

  // ✅ Add ticket
  const addTicket = (ticket: Ticket) => {
    setMyTickets((prev) => [ticket, ...prev]);
    setAssignTickets((prev) => [ticket, ...prev]);
  };

  return (
    <TicketContext.Provider
      value={{
        departments,
        myTickets,
        assignTickets,
        setDepartments,
        setMyTickets,
        setAssignTickets,
        markets,
        addTicket,
        viewTicket,
        setViewTicket,
        setMarkets,
        fetchUsers,
        createDepartment,
        createMarket,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTicket = () => useContext(TicketContext);

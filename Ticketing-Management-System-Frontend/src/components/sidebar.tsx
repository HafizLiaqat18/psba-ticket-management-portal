"use client";

import type * as React from "react";
import {
  Ticket,
  BarChart3,
  ChartAreaIcon,
  Users,
  FolderClosed,
  ChartLineIcon,
  ChevronDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

// Navigation items with department restrictions (excluding Tickets filters; rendered as dropdown)
const navItems = [
  {
    title: "My Tickets",
    icon: Ticket,
    url: "/user-tickets",
    superAdminOnly: false,
    allowedDepartments: ["all"],
  },
  {
    title: "Closed Tickets",
    icon: FolderClosed,
    url: "/closed-tickets",
    superAdminOnly: false,
    allowedDepartments: ["all"],
  },
  {
    title: "Reports and Analytics",
    icon: ChartAreaIcon,
    url: "/reports",
    superAdminOnly: false,
    allowedDepartments: [
      "IT Department",
      "Monitoring Department",
      "Operations Department",
    ],
  },
  {
    title: "Old Weekly Reports",
    icon: ChartLineIcon,
    url: "/closed-reports",
    superAdminOnly: false,
    allowedDepartments: [
      "IT Department",
      "Monitoring Department",
      "Operations Department",
    ],
  },

  {
    title: "User Mangement",
    icon: Users,
    url: "/user-management",
    superAdminOnly: true,
    allowedDepartments: ["all"],
  },
];

export default function AppSidebar() {
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const statusParam = (searchParams.get("status") || "all").toLowerCase();
  const [ticketsOpen, setTicketsOpen] = useState(pathname.startsWith("/dashboard"));
  const isOnDashboard = pathname.startsWith("/dashboard");

  if (!isAuthenticated) {
    return <></>;
  }

  // Helper function to check if user can access a route
  const canAccessRoute = (item: (typeof navItems)[0]) => {
    // Check superadmin access first
    if (item.superAdminOnly && user?.role !== "superadmin") {
      return false;
    }

    // If allowedDepartments includes "all", everyone can access
    if (item.allowedDepartments.includes("all")) {
      return true;
    }

    // Check if user's department is in allowed departments
    const userDepartment = user?.assignedTo?.name;
    if (!userDepartment) {
      return false;
    }
    console.log(userDepartment);
    console.log(item.allowedDepartments.includes(userDepartment));

    return item.allowedDepartments.includes(userDepartment);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex">
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="font-semibold">
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <Image
                    src={
                      "https://psba.gop.pk/wp-content/uploads/2025/03/cropped-SAHULAT-BAZAAR-LOGO.png"
                    }
                    alt="Company Logo"
                    width={60}
                    height={60}
                    className="mt-5 object-contain mb-4"
                    priority
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">PSBA</span>
                  <span className="text-xs">Complaint Management System</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mt-4 font-bold text-md">
            {/* Navigation */}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-5">
              {/* Tickets dropdown */}
              <SidebarMenuItem className="hover:bg-green-50">
                <SidebarMenuButton
                  isActive={isOnDashboard}
                  className="hover:bg-green-100 flex items-center justify-between"
                  onClick={() => setTicketsOpen((v) => !v)}
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 />
                    <span className="text-base">Tickets</span>
                  </div>
                  <ChevronDown className={`${ticketsOpen ? "rotate-180" : ""} transition-transform`} />
                </SidebarMenuButton>
                {ticketsOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    <SidebarMenuButton
                      asChild
                      isActive={isOnDashboard && statusParam === "all"}
                      className="hover:bg-green-100"
                    >
                      <Link href="/dashboard">
                        <span className="text-base">All Tickets</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuButton
                      asChild
                      isActive={isOnDashboard && statusParam === "open"}
                      className="hover:bg-green-100"
                    >
                      <Link href="/dashboard?status=open">
                        <span className="text-base">Open Tickets</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuButton
                      asChild
                      isActive={isOnDashboard && statusParam === "in-progress"}
                      className="hover:bg-green-100"
                    >
                      <Link href="/dashboard?status=in-progress">
                        <span className="text-base">In Progress Tickets</span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuButton
                      asChild
                      isActive={isOnDashboard && statusParam === "resolved"}
                      className="hover:bg-green-100"
                    >
                      <Link href="/dashboard?status=resolved">
                        <span className="text-base">Resolved Tickets</span>
                      </Link>
                    </SidebarMenuButton>
                  </div>
                )}
              </SidebarMenuItem>

              {navItems.map((item) => {
                // Check if user can access this route
                if (!canAccessRoute(item)) {
                  return null;
                }


                return (
                  <SidebarMenuItem key={item.title} className="hover:bg-green-100">
                    <SidebarMenuButton
                      asChild
                      isActive={(() => {
                        const [path, query] = item.url.split("?");
                        if (!pathname.includes(path)) return false;
                        if (!query) {
                          // Special-case dashboard root (All Tickets shouldn't be highlighted when a filter is active)
                          if (path === "/dashboard") {
                            return statusParam === "all";
                          }
                          return true;
                        }
                        const urlParams = new URLSearchParams(query);
                        const key = Array.from(urlParams.keys())[0];
                        const val = urlParams.get(key || "");
                        return searchParams.get(key || "") === val;
                      })()}
                      className="hover:bg-green-100"
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span className="text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      
      {/* Security Report Dialog */}
      {/* <SecurityReportDialog 
        open={securityDialogOpen} 
        onOpenChange={setSecurityDialogOpen} 
      /> */}
    </Sidebar>
  );
}

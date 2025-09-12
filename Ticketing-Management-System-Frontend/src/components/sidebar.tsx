"use client";

import type * as React from "react";
import {
  Ticket,
  BarChart3,
  ChartAreaIcon,
  Users,
  FolderClosed,
  LucideGitGraph,
  ChartLineIcon,
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
import { usePathname } from "next/navigation";

// Navigation items with department restrictions
const navItems = [
  {
    title: "Assigned Tickets",
    icon: BarChart3,
    url: "/dashboard",
    superAdminOnly: false,
    allowedDepartments: ["all"],
  },
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
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-5">
              {navItems.map((item) => {
                // Check if user can access this route
                if (!canAccessRoute(item)) {
                  return null;
                }

                return (
                  <SidebarMenuItem key={item.title} className="hover:bg-green-100">
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.includes(item.url)}
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
    </Sidebar>
  );
}

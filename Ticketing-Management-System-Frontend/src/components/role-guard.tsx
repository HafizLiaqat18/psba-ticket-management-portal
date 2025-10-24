"use client";

import { useAuth } from "@/context/auth-context";
import { ReactNode } from "react";

interface RoleGuardProps {
  allowedRoles: string[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      fallback || (
        <div className="flex bg-gray-50 flex-1 flex-col gap-4 p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
              <p className="text-gray-600 mb-4">
                You don't have permission to access this page.
              </p>
              <p className="text-sm text-gray-500">
                This page requires one of the following roles: {allowedRoles.join(", ")}.
              </p>
            </div>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

// Convenience components for common role checks
export function SuperAdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <RoleGuard allowedRoles={["superadmin"]} fallback={fallback}>{children}</RoleGuard>;
}

export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <RoleGuard allowedRoles={["admin", "superadmin"]} fallback={fallback}>{children}</RoleGuard>;
}

export function MarketUserOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const { user } = useAuth();
  
  if (!user || user.assignedToType !== "Market") {
    return (
      fallback || (
        <div className="flex bg-gray-50 flex-1 flex-col gap-4 p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
              <p className="text-gray-600 mb-4">
                You don't have permission to access this page.
              </p>
              <p className="text-sm text-gray-500">
                This page is only available for users assigned to Sahulat Bazaars.
              </p>
            </div>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

"use client";
import React, { useEffect, useState } from "react";
import { User2Icon, Search as MagnifyingGlassIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateUserDialog } from "@/components/create-user-dialog";
import { CreateMarketDialog } from "@/components/create-market-dialog";
import { CreateDepartementDialog } from "@/components/create-department-dialog";
import { DataTable } from "@/components/ticketingDataTable/DataTable";
import { User } from "@/types/userType";
import { useTicket } from "@/context/ticket-context";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useAuth } from "@/context/auth-context";
import { userColumns } from "@/components/userTable/userColumn";
import { ConfirmDialog } from "@/components/ConfirmDelete";

export default function UserManagementSystem() {
  const [createUserDialog, setIsCreateUserDialog] = useState(false);
  const [createMarketOpen, setCreateMarketOpen] = useState(false);
  const [createDepartmentOpen, setCreateDepartmentOpen] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // form state (controlled by parent)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [assignedToType, setAssignedToType] = useState<
    "Department" | "Market" | ""
  >("");
  const [assignedTo, setAssignedTo] = useState<string>("");

  // which flow is active
  const [openDialog, setOpenDialog] = useState<"create" | "edit" | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);

  const [rowsPerPage, setRowsPerPage] = useState("10");
  const [loading, setLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { setDepartments, setMarkets } = useTicket();
  const { user } = useAuth();

  const clearForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setAssignedToType("");
    setAssignedTo("");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const usersRes = await api.get("/users/getallusers");
        setUsers(usersRes.data.data.users);
        setFilteredUsers(usersRes.data.data.users);

        const deptsRes = await api.get("/department/get-all-departments");
        setDepartments(deptsRes.data.data?.departments);

        const marketsRes = await api.get("/market/get-all-markets");
        setMarkets(marketsRes.data.data?.markets);
      } catch (error) {
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "superadmin") {
      fetchData();
    }
  }, [user, setDepartments, setMarkets]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }
    const lower = searchTerm.toLowerCase();
    const filtered = users.filter((u) => {
      const assignedName = u?.assignedTo?.name?.toLowerCase() || "";
      const assignedType = u?.assignedToType?.toLowerCase() || "";
      return assignedName.includes(lower) || assignedType.includes(lower);
    });
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const openEditDialog = (u: User) => {
    setEditUser(u);
    setName(u?.name || "");
    setEmail(u?.email || "");
    setAssignedToType(u?.assignedToType || "");
    setAssignedTo(u?.assignedTo?._id ?? "");
    setPassword("");
    setOpenDialog("edit");
    setIsCreateUserDialog(true);
  };

  const openCreateDialog = () => {
    setEditUser(null);
    clearForm();
    setOpenDialog("create");
    setIsCreateUserDialog(true);
  };

  const openDeleteDialog = (u: User) => {
    setSelectedUser(u);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await api.patch(`/users/deleteuser/${selectedUser._id}`);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectedUser._id ? { ...u, active: false } : u
        )
      );
      toast.success("User deactivated successfully!");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to deactivate user";
      toast.error(message);
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="flex bg-gray-50 flex-1 flex-col gap-4 p-6">
      <div className="flex justify-between ">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            User Management System
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Manage departments, Sahulat Bazaars, and user accounts across your organization
          </p>
        </div>
        <div>
          <Button
            onClick={openCreateDialog}
            className="h-8 bg-green-600 hover:bg-green-700 mr-2 text-white font-medium"
            size={"sm"}
          >
            <span className="flex items-center justify-center">
              <User2Icon className="h-4 w-4 mr-2" /> Create User
            </span>
          </Button>

          <Button
            onClick={() => setCreateMarketOpen(true)}
            className="h-8 bg-green-600 hover:bg-green-700 text-white font-medium"
            size={"sm"}
          >
            <span className="flex items-center mr-2 justify-center">
              <User2Icon className="h-4 w-4 mr-2" /> Create Sahulat Bazaar
            </span>
          </Button>

          <Button
            onClick={() => setCreateDepartmentOpen(true)}
            className="h-8 bg-green-600 hover:bg-green-700 ml-2 text-white font-medium"
            size={"sm"}
          >
            <span className="flex items-center justify-center">
              <User2Icon className="h-4 w-4 mr-2" /> Create Department
            </span>
          </Button>
        </div>
      </div>

      <div className="mt-5">
        <div className="relative w-80 ml-10 mb-3">
          <input
            type="text"
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Search by department or Sahulat Bazaar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        <DataTable
          columns={userColumns(openEditDialog, openDeleteDialog)}
          data={filteredUsers}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </div>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        title="Confirm Deactivation"
        description="Are you sure you want to deactivate"
        entityName={selectedUser?.name}
        confirmLabel="Yes, Deactivate"
        cancelLabel="Cancel"
        onConfirm={confirmDeleteUser}
      />

      <CreateUserDialog
        key={`${openDialog}-${editUser?._id ?? "new"}`}
        mode={openDialog === "edit" ? "edit" : "create"}
        createUserDialog={createUserDialog}
        setIsCreateUserDialog={setIsCreateUserDialog}
        name={name}
        users={users}
        setName={setName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        assignedTo={assignedTo}
        setAssignedTo={setAssignedTo}
        assignedToType={assignedToType}
        setAssignedToType={setAssignedToType}
        editUser={editUser || ({} as User)}
      />

      <CreateMarketDialog
        createMarketOpen={createMarketOpen}
        setCreateMarketOpen={setCreateMarketOpen}
      />
      <CreateDepartementDialog
        createDepartmentOpen={createDepartmentOpen}
        setCreateDepartmentOpen={setCreateDepartmentOpen}
      />
    </div>
  );
}

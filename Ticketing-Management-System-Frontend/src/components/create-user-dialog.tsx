"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { UserPlusIcon } from "lucide-react";
import api from "@/lib/api";
import { useTicket } from "@/context/ticket-context";
import { SearchableSelect } from "./ui/searchable-select";
import {
  AvatarIcon,
  EnvelopeClosedIcon,
  LockClosedIcon,
  MixerHorizontalIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { useAuth } from "@/context/auth-context";
import { User } from "@/types/userType";

interface CreateUserDialogProps {
  mode: string;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  assignedToType: "Department" | "Market" | "";
  setAssignedToType: React.Dispatch<
    React.SetStateAction<"Department" | "Market" | "">
  >;
  assignedTo: string;
  setAssignedTo: React.Dispatch<React.SetStateAction<string>>;
  createUserDialog: boolean;
  setIsCreateUserDialog: React.Dispatch<React.SetStateAction<boolean>>;
  users: User[];
  editUser: User;
}

export function CreateUserDialog({
  users,
  mode,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  assignedToType,
  setAssignedToType,
  assignedTo,
  setAssignedTo,
  createUserDialog,
  setIsCreateUserDialog,
  editUser,
}: CreateUserDialogProps) {
  const { user } = useAuth();
  const { departments, markets } = useTicket();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !email || !password || !assignedToType || !assignedTo) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      if (mode === "edit") {
        await api.patch(`/users/updateuser/${editUser?._id}`, {
          name,
          password,
        });

        toast.success("User updated successfully!");
      } else {
        await api.post("/users/createuser", {
          name,
          email,
          password,
          assignedToType,
          assignedTo,
        });

        toast.success("User created successfully!");
      }

      setIsCreateUserDialog(false);
      setName("");
      setEmail("");
      setPassword("");
      setAssignedToType("");
      setAssignedTo("");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          (mode === "edit"
            ? "Failed to update user."
            : "Failed to create user.")
      );
    }
  };

  const assignedToList =
    assignedToType === "Department"
      ? departments
      : assignedToType === "Market"
      ? markets
      : [];

  const assignedToLabel =
    assignedToType === "Department"
      ? "Department"
      : assignedToType === "Market"
      ? "Market"
      : "Select Type First";

  const filteredAssignedToList = assignedToList.filter((item) => {
    return !users?.some(
      (u) =>
        u.assignedToType === assignedToType && u.assignedTo?._id === item._id
    );
  });

  return (
    <Dialog open={createUserDialog} onOpenChange={setIsCreateUserDialog}>
      <DialogContent className="fixed  bg-white rounded-2xl shadow-2xl p-6 w-full sm:max-w-[700px]   max-h-[90vh] ">
        <div className="p-6 overflow-auto max-h-[80vh]">
          <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-800">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-gray-50">
              <UserPlusIcon className="h-7 w-7 text-primary" />
              {mode === "edit" ? "Edit User" : "Create User"}
            </DialogTitle>
            <DialogDescription className="text-md text-gray-600 dark:text-gray-400 mt-2">
              Fill in the details below to create a new user account.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4 py-6">
            {/* name */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                <AvatarIcon className="w-5 h-5 mr-2 text-blue-500" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    className="block text-sm font-medium mb-2 text-gray-700"
                    htmlFor="userName"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      id="userName"
                      className="w-full bg-white pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Johnathan Smith"
                    />
                    <PersonIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2 text-gray-700"
                    htmlFor="userEmail"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      className="w-full pl-10 bg-white pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john.smith@company.com"
                      disabled={mode !== "edit" ? false : true}
                    />
                    <EnvelopeClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label
                    className="block text-sm font-medium mb-2 text-gray-700"
                    htmlFor="userPassword"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="userPassword"
                      //  type={showPassword ? "text" : "password"}
                      className="w-full pl-10 bg-white pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                    <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {/* {showPassword ? "Hide" : "Show"} */}
                    </button>
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    <p>• Minimum 8 characters</p>
                    <p>• Include uppercase and lowercase letters</p>
                    <p>• Include at least one number</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Assign To Type */}
            {mode !== "edit" && (
              <div className="grid grid-cols-1 sm:grid-cols-1 bg-gray-50 p-5 rounded-xl border border-gray-200 gap-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                  <MixerHorizontalIcon className="w-5 h-5 mr-2 text-indigo-500" />
                  Role & Assignment
                </h3>
                {/* New Type dropdown */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid  gap-2">
                    <Label
                      htmlFor="assignedToType"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Assign To Type
                    </Label>
                    <Select
                      onValueChange={(value: "Department" | "Market") => {
                        setAssignedToType(value);
                        setAssignedTo("");
                      }}
                      value={assignedToType}
                      required
                      //    disabled={name?.assignedToType === "Market"}
                    >
                      <SelectTrigger
                        id="assignedToType"
                        className="w-full px-4 py-2 bg-white rounded-md border border-gray-300 dark:border-gray-700 0 text-gray-900 dark:text-gray-50 "
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-md border border-gray-200 dark:border-gray-800 bg-white  shadow-lg">
                        <SelectItem value="Department">Department</SelectItem>
                        <SelectItem value="Market">Market</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Assigned To dropdown (searchable) */}
                  <div className="grid gap-2">
                    <Label
                      htmlFor="assignedTo"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      {assignedToLabel}
                    </Label>
                    <SearchableSelect
                      className="bg-white"
                      items={filteredAssignedToList}
                      value={assignedTo}
                      onValueChange={setAssignedTo}
                      placeholder={`Select a ${assignedToType || "type"}...`}
                      disabled={!assignedToType}
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button
                type="submit"
                className="w-full bg-green-500 sm:w-auto px-6 py-3 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                {mode === "edit" ? "Update User" : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

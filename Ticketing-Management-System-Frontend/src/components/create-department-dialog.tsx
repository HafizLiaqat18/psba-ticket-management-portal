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
import { useTicket } from "@/context/ticket-context";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { UserPlusIcon } from "lucide-react";

interface CreateDepartementDialogProps {
    createDepartmentOpen: boolean;
    setCreateDepartmentOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export  function CreateDepartementDialog({ createDepartmentOpen, setCreateDepartmentOpen }: CreateDepartementDialogProps) {
    const [departmentName, setDepartement] = useState("")
    const createMarket = async () => {
        if (!departmentName) {
            toast.error("Market name is required");
            return;
        }
        try {
            const res = await api.post("department/create-department", { name:departmentName});
            toast.success("Market created successfully!");
            setDepartement("");
        } catch (error: any) {
            const message =
                error.response?.data?.message || "Failed to create market";
            toast.error(message);
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        createMarket()
    };

    return (
        <Dialog open={createDepartmentOpen} onOpenChange={setCreateDepartmentOpen}>
            <DialogContent>
                <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-800">
                    <DialogTitle className="text-2xl font-md flex items-center gap-3 text-gray-900 dark:text-gray-50">
                        <UserPlusIcon className="h-7 w-7 text-primary" /> Create Department
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Fill in the details below to create a new department .
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Departement Name</Label>
                        <Input
                            id="departmentName"
                            value={departmentName}
                            onChange={(e) => setDepartement(e.target.value)}
                            placeholder="Enter market name"
                            className="mt-2"
                            required
                        />
                    </div>
                    <DialogFooter className="pt-4  dark:border-gray-800">
                        <Button
                        onClick={()=> setCreateDepartmentOpen(!createDepartmentOpen)}
                            type="submit"
                            className="w-full bg-green-500 sm:w-auto px-6 py-3 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            Create Department
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

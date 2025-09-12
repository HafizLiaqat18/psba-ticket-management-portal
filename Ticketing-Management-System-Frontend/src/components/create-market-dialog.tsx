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

interface CreateMarketDialogProps {
    createMarketOpen: boolean;
    setCreateMarketOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export  function CreateMarketDialog({ createMarketOpen, setCreateMarketOpen }: CreateMarketDialogProps) {
    console.log(createMarketOpen)
    const [marketName, setMarketName] = useState("")
    const createMarket = async () => {
        if (!marketName) {
            toast.error("Market name is required");
            return;
        }
        try {
            await api.post("market/create-market", { name:marketName });
            toast.success("Market created successfully!");
        setMarketName("")
            
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
        <Dialog open={createMarketOpen} onOpenChange={setCreateMarketOpen}>
            <DialogContent>
                <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-800">
                    <DialogTitle className="text-2xl font-md flex items-center gap-3 text-gray-900 dark:text-gray-50">
                        <UserPlusIcon className="h-7 w-7 text-primary" /> Create Market
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Fill in the details below to create a new market .
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Market Name</Label>
                        <Input
                            id="marketName"
                            value={marketName}
                            onChange={(e) => setMarketName(e.target.value)}
                            placeholder="Enter market name"
                            className="mt-2"
                            required
                        />
                    </div>
                    <DialogFooter className="pt-4  dark:border-gray-800">
                        <Button
                        onClick={()=> setCreateMarketOpen(!createMarketOpen)}
                            type="submit"
                            className="w-full bg-green-500 sm:w-auto px-6 py-3 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            Create Market
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

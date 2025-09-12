"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Shield } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import showError from "./send-error";
import toast from "react-hot-toast";

interface SecurityReportData {
  totalCCTV: number;
  faultyCCTV: number;
  walkthroughGates: number;
  faultyWalkthroughGates: number;
  metalDetector: number;
  faultyMetalDetectors: number;
  biometricStatus: boolean;
}

export function SecurityReportDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState<SecurityReportData>({
    totalCCTV: 0,
    faultyCCTV: 0,
    walkthroughGates: 0,
    faultyWalkthroughGates: 0,
    metalDetector: 0,
    faultyMetalDetectors: 0,
    biometricStatus: true,
  });

  const handleInputChange = (
    field: keyof SecurityReportData,
    value: number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.patch(
        `report/update-security-report/${user?.assignedTo?.currentReport}`,
        formData
      );
      setOpen(false);
      toast.success("Security report submitted successfully!");
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "user") {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="px-6 py-3 text-lg bg-green-600 hover:bg-green-500 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
          <Shield className="mr-2 h-5 w-5" /> Security Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Security Report</DialogTitle>
          <DialogDescription>
            Submit your weekly security equipment status report.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalCCTV">Total CCTV</Label>
              <Input
                id="totalCCTV"
                type="number"
                min="0"
                value={formData.totalCCTV}
                onChange={(e) =>
                  handleInputChange(
                    "totalCCTV",
                    Number.parseInt(e.target.value) || 0
                  )
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faultyCCTV">Faulty CCTV</Label>
              <Input
                id="faultyCCTV"
                type="number"
                min="0"
                value={formData.faultyCCTV}
                onChange={(e) =>
                  handleInputChange(
                    "faultyCCTV",
                    Number.parseInt(e.target.value) || 0
                  )
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="walkthroughGates">Walkthrough Gates</Label>
              <Input
                id="walkthroughGates"
                type="number"
                min="0"
                value={formData.walkthroughGates}
                onChange={(e) =>
                  handleInputChange(
                    "walkthroughGates",
                    Number.parseInt(e.target.value) || 0
                  )
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faultyWalkthroughGates">Faulty Gates</Label>
              <Input
                id="faultyWalkthroughGates"
                type="number"
                min="0"
                value={formData.faultyWalkthroughGates}
                onChange={(e) =>
                  handleInputChange(
                    "faultyWalkthroughGates",
                    Number.parseInt(e.target.value) || 0
                  )
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="metalDetector">Metal Detectors</Label>
              <Input
                id="metalDetector"
                type="number"
                min="0"
                value={formData.metalDetector}
                onChange={(e) =>
                  handleInputChange(
                    "metalDetector",
                    Number.parseInt(e.target.value) || 0
                  )
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="faultyMetalDetectors">Faulty Detectors</Label>
              <Input
                id="faultyMetalDetectors"
                type="number"
                min="0"
                value={formData.faultyMetalDetectors}
                onChange={(e) =>
                  handleInputChange(
                    "faultyMetalDetectors",
                    Number.parseInt(e.target.value) || 0
                  )
                }
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="biometricStatus"
              checked={formData.biometricStatus}
              onCheckedChange={(checked) =>
                handleInputChange("biometricStatus", checked)
              }
            />
            <Label htmlFor="biometricStatus">Biometric System Active</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Report
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

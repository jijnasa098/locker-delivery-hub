
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { Package, Check, X } from "lucide-react";

interface PackageDetailsType {
  id: string;
  recipientName: string;
  recipientPhone: string;
  blockNumber: string;
  status: 'pending' | 'delivered' | 'collected';
  deliveryDate: string;
  collectionDate?: string;
  lockerId?: number;
  otp?: string;
  storedBy?: string;
}

interface PackageManagementProps {
  packages: PackageDetailsType[];
  currentUser: { name: string; role: string };
  onAcceptPackage: (packageId: string, lockerId: number) => void;
  onRejectPackage: (packageId: string) => void;
  onStorePackage: (packageId: string, lockerId: number, otp: string, storedBy: string) => void;
  availableLockers: { id: number; size: string }[];
}

const PackageManagement: React.FC<PackageManagementProps> = ({
  packages,
  currentUser,
  onAcceptPackage,
  onRejectPackage,
  onStorePackage,
  availableLockers
}) => {
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<PackageDetailsType | null>(null);
  const [showStoreDialog, setShowStoreDialog] = useState(false);
  const [selectedLockerId, setSelectedLockerId] = useState<number | null>(null);
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [showOTPDialog, setShowOTPDialog] = useState(false);

  // Filter packages that are pending
  const pendingPackages = packages.filter(pkg => pkg.status === 'pending');

  const handleAccept = (packageId: string) => {
    onAcceptPackage(packageId, 0); // LockerId will be assigned later
    toast({
      title: "Package Accepted",
      description: "The package has been accepted and is ready for storage.",
    });
  };

  const handleReject = (packageId: string) => {
    onRejectPackage(packageId);
    toast({
      title: "Package Rejected",
      description: "The package has been rejected.",
    });
  };

  const openStoreDialog = (pkg: PackageDetailsType) => {
    setSelectedPackage(pkg);
    setShowStoreDialog(true);
  };

  const handleStorePackage = () => {
    if (!selectedPackage || !selectedLockerId) {
      toast({
        title: "Error",
        description: "Please select a locker.",
        variant: "destructive",
      });
      return;
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);
    
    // Store the package with the OTP
    onStorePackage(
      selectedPackage.id, 
      selectedLockerId, 
      otp,
      currentUser.name
    );
    
    setShowStoreDialog(false);
    setShowOTPDialog(true);
  };

  const closeOTPDialog = () => {
    setShowOTPDialog(false);
    setSelectedPackage(null);
    setSelectedLockerId(null);
    setGeneratedOTP("");
    
    toast({
      title: "Package Stored",
      description: "The package has been stored and the OTP has been generated for the recipient.",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Package Management</h2>
      
      {pendingPackages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingPackages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  Package #{pkg.id.slice(-4)}
                  <Package className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>{pkg.deliveryDate}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Recipient:</span>
                    <span className="font-medium">{pkg.recipientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Phone:</span>
                    <span>{pkg.recipientPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Block:</span>
                    <span>{pkg.blockNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {pkg.status}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => handleReject(pkg.id)}
                >
                  <X className="mr-1 h-4 w-4" />
                  Reject
                </Button>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-green-200 text-green-600 hover:bg-green-50"
                    onClick={() => handleAccept(pkg.id)}
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Accept
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => openStoreDialog(pkg)}
                  >
                    <Package className="mr-1 h-4 w-4" />
                    Store Package
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No Pending Packages</h3>
          <p className="text-muted-foreground">
            There are no packages waiting to be processed.
          </p>
        </div>
      )}

      {/* Store Package Dialog */}
      <Dialog open={showStoreDialog} onOpenChange={setShowStoreDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Store Package</DialogTitle>
            <DialogDescription>
              Select a locker to store the package for {selectedPackage?.recipientName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Available Lockers</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedLockerId || ""}
                onChange={(e) => setSelectedLockerId(Number(e.target.value))}
              >
                <option value="">Select a locker</option>
                {availableLockers.map((locker) => (
                  <option key={locker.id} value={locker.id}>
                    Locker #{locker.id} - {locker.size}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowStoreDialog(false)}>Cancel</Button>
            <Button onClick={handleStorePackage}>Store Package</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* OTP Display Dialog */}
      <Dialog open={showOTPDialog} onOpenChange={setShowOTPDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Package Stored Successfully</DialogTitle>
            <DialogDescription>
              The package has been stored in Locker #{selectedLockerId}. Share this OTP with the recipient.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">One-Time Password (OTP)</p>
              <div className="flex items-center justify-center mb-4">
                <InputOTP maxLength={6} value={generatedOTP} readOnly>
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-sm text-muted-foreground">
                This OTP will be sent to {selectedPackage?.recipientPhone}
              </p>
            </div>
          </div>
          <Button onClick={closeOTPDialog} className="w-full">Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackageManagement;

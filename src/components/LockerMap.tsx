import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Box, Lock, Package, PackageOpen, Unlock, Key } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';

export interface PackageDetails {
  id: string;
  recipientName: string;
  productId: string;
  trackingNumber?: string;
  comments?: string;
  placedBy: string;
  placedAt: Date;
  retrievedBy?: string;
  retrievedAt?: Date;
  otp?: string; // Add OTP property
}

// Locker interface to match the one in LockerGrid
interface Locker {
  id: number;
  systemId: number;
  size: 'small' | 'medium' | 'large';
  status: 'available' | 'occupied';
  packageDetails?: PackageDetails;
  row?: number;
  column?: number;
}

interface LockerMapProps {
  lockers: Locker[];
  onLockerSelect?: (lockerId: number) => void;
  selectedLockerId?: number;
  onPackageStore?: (lockerId: number, packageDetails: PackageDetails) => void;
  onPackageRetrieve?: (lockerId: number, retrievedBy: string) => void;
  currentUser?: { name: string; role: string };
  rows?: number;
  columns?: number;
}

const LockerMap = ({ 
  lockers, 
  onLockerSelect, 
  selectedLockerId,
  onPackageStore,
  onPackageRetrieve,
  currentUser,
  rows = 5,
  columns = 6
}: LockerMapProps) => {
  const { toast } = useToast();
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [packageDetails, setPackageDetails] = useState<Partial<PackageDetails>>({
    recipientName: '',
    productId: '',
    trackingNumber: '',
    comments: '',
  });
  const [dialogMode, setDialogMode] = useState<'store' | 'retrieve' | 'otp-verify'>('store');
  const [otpInput, setOtpInput] = useState('');

  const getLockerSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'h-16 w-16';
      case 'medium': return 'h-20 w-20';
      case 'large': return 'h-24 w-24';
      default: return 'h-16 w-16';
    }
  };

  const getLockerIcon = (locker: Locker) => {
    if (locker.status === 'available') {
      return <Unlock className="h-6 w-6 text-green-500" />;
    } else {
      return <Lock className="h-6 w-6 text-red-500" />;
    }
  };

  const handleLockerClick = (locker: Locker) => {
    setSelectedLocker(locker);
    
    if (locker.status === 'available') {
      // If the locker is available, we're storing a package
      setDialogMode('store');
      setPackageDetails({
        recipientName: '',
        productId: '',
        trackingNumber: '',
        comments: '',
      });
      setShowDialog(true);
    } else if (locker.status === 'occupied' && locker.packageDetails) {
      // If the locker is occupied and has package details, we're retrieving the package
      setDialogMode('retrieve');
      setShowDialog(true);
    }

    if (onLockerSelect) {
      onLockerSelect(locker.id);
    }
  };

  // Create a grid representation for displaying lockers
  const organizeLockersByGrid = () => {
    const grid: (Locker | null)[][] = Array(rows).fill(null).map(() => Array(columns).fill(null));
    
    lockers.forEach(locker => {
      // If locker has explicit row/column values, use those
      if (locker.row !== undefined && locker.column !== undefined) {
        if (locker.row < rows && locker.column < columns) {
          grid[locker.row][locker.column] = locker;
        }
      } else {
        // Otherwise compute position from ID (legacy support)
        const row = Math.floor((locker.id - 1) / columns);
        const col = (locker.id - 1) % columns;
        
        if (row < rows && col < columns) {
          grid[row][col] = locker;
        }
      }
    });
    
    return grid;
  };

  const lockerGrid = organizeLockersByGrid();
  
  // Format locker number to show row/column format (e.g., "01-02")
  const formatLockerNumber = (locker: Locker): string => {
    if (locker.row !== undefined && locker.column !== undefined) {
      return `${(locker.row + 1).toString().padStart(2, '0')}-${(locker.column + 1).toString().padStart(2, '0')}`;
    } else {
      // Legacy support
      const row = Math.floor((locker.id - 1) / columns) + 1;
      const col = ((locker.id - 1) % columns) + 1;
      return `${row.toString().padStart(2, '0')}-${col.toString().padStart(2, '0')}`;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Locker Map</h3>
        <div className="flex gap-4">
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm">Occupied</span>
          </div>
        </div>
      </div>
      
      <div className="bg-secondary/50 rounded-lg p-4">
        {lockerGrid.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex mb-4 last:mb-0">
            {row.map((locker, colIndex) => (
              <div key={`col-${colIndex}`} className="flex-1 px-2 first:pl-0 last:pr-0">
                {locker ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div 
                          className={cn(
                            getLockerSizeClass(locker.size),
                            'border rounded-md flex flex-col items-center justify-center p-2 cursor-pointer transition-all mx-auto',
                            locker.status === 'available' 
                              ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                              : 'bg-red-50 border-red-200 hover:bg-red-100',
                            selectedLockerId === locker.id && 'ring-2 ring-primary'
                          )}
                          onClick={() => handleLockerClick(locker)}
                        >
                          <div className="flex justify-center mb-1">
                            {getLockerIcon(locker)}
                          </div>
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            {formatLockerNumber(locker)}
                          </Badge>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-sm">
                          <p>Locker #{formatLockerNumber(locker)}</p>
                          <p className="capitalize">Size: {locker.size}</p>
                          <p>Status: {locker.status}</p>
                          {locker.status === 'occupied' && locker.packageDetails && (
                            <>
                              <p className="mt-1">Recipient: {locker.packageDetails.recipientName}</p>
                              <p>Product ID: {locker.packageDetails.productId}</p>
                            </>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <div className={`h-16 w-16 border border-dashed border-gray-200 rounded-md mx-auto`}></div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Dialog for package details */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'store' && 'Store Package in Locker'}
              {dialogMode === 'retrieve' && 'Retrieve Package from Locker'}
              {dialogMode === 'otp-verify' && 'Enter OTP to Retrieve Package'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'store' && selectedLocker
                ? `Enter the package details to store in Locker #${formatLockerNumber(selectedLocker)}`
                : dialogMode === 'retrieve' && selectedLocker
                ? `Package details for Locker #${formatLockerNumber(selectedLocker)}`
                : dialogMode === 'otp-verify' && selectedLocker
                ? `Please enter the OTP sent to the recipient to unlock Locker #${formatLockerNumber(selectedLocker)}`
                : 'Loading locker details...'}
            </DialogDescription>
          </DialogHeader>
          
          {dialogMode === 'store' && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="recipientName">Recipient Name*</Label>
                <Input
                  id="recipientName"
                  value={packageDetails.recipientName}
                  onChange={(e) => setPackageDetails({ ...packageDetails, recipientName: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="productId">Product ID*</Label>
                <Input
                  id="productId"
                  value={packageDetails.productId}
                  onChange={(e) => setPackageDetails({ ...packageDetails, productId: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trackingNumber">Tracking Number</Label>
                <Input
                  id="trackingNumber"
                  value={packageDetails.trackingNumber}
                  onChange={(e) => setPackageDetails({ ...packageDetails, trackingNumber: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comments">Comments</Label>
                <Input
                  id="comments"
                  value={packageDetails.comments}
                  onChange={(e) => setPackageDetails({ ...packageDetails, comments: e.target.value })}
                />
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Stored by: {currentUser?.name || 'Unknown User'}</p>
                <p>Timestamp: {format(new Date(), 'PPpp')}</p>
              </div>
            </div>
          )}
          
          {dialogMode === 'retrieve' && (
            <div className="space-y-4 py-2">
              {selectedLocker?.packageDetails && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium">Recipient:</p>
                      <p>{selectedLocker.packageDetails.recipientName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Product ID:</p>
                      <p>{selectedLocker.packageDetails.productId}</p>
                    </div>
                    {selectedLocker.packageDetails.trackingNumber && (
                      <div>
                        <p className="text-sm font-medium">Tracking Number:</p>
                        <p>{selectedLocker.packageDetails.trackingNumber}</p>
                      </div>
                    )}
                    {selectedLocker.packageDetails.comments && (
                      <div className="col-span-2">
                        <p className="text-sm font-medium">Comments:</p>
                        <p>{selectedLocker.packageDetails.comments}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-2 border-t text-sm">
                    <p>
                      <span className="font-medium">Stored by:</span> {selectedLocker.packageDetails.placedBy}
                    </p>
                    <p>
                      <span className="font-medium">Stored at:</span> {format(new Date(selectedLocker.packageDetails.placedAt), 'PPpp')}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {dialogMode === 'otp-verify' && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter the 6-digit OTP</Label>
                <InputOTP 
                  value={otpInput} 
                  onChange={setOtpInput} 
                  maxLength={6} 
                  render={({ slots }) => (
                    <InputOTPGroup>
                      {slots.map((slot, i) => (
                        <InputOTPSlot key={i} {...slot} />
                      ))}
                    </InputOTPGroup>
                  )}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  The OTP was provided to the recipient when the package was stored.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            {dialogMode === 'store' && (
              <Button 
                onClick={handleStorePackage}
                disabled={!packageDetails.recipientName || !packageDetails.productId}
              >
                <Package className="mr-2 h-4 w-4" />
                Store Package
              </Button>
            )}
            {dialogMode === 'retrieve' && (
              <Button onClick={handleRetrieveRequest}>
                <Key className="mr-2 h-4 w-4" />
                Enter OTP to Retrieve
              </Button>
            )}
            {dialogMode === 'otp-verify' && (
              <Button onClick={handleVerifyOTP} disabled={otpInput.length !== 6}>
                <PackageOpen className="mr-2 h-4 w-4" />
                Verify & Retrieve
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LockerMap;

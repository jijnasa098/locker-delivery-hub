
import React, { useState } from 'react';
import { Locker } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Box, Lock, Package, PackageOpen, Unlock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

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
}

interface LockerMapProps {
  lockers: Locker[];
  onLockerSelect?: (lockerId: number) => void;
  selectedLockerId?: number;
  onPackageStore?: (lockerId: number, packageDetails: PackageDetails) => void;
  onPackageRetrieve?: (lockerId: number, retrievedBy: string) => void;
  currentUser?: { name: string; role: string };
}

const LockerMap = ({ 
  lockers, 
  onLockerSelect, 
  selectedLockerId,
  onPackageStore,
  onPackageRetrieve,
  currentUser
}: LockerMapProps) => {
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [packageDetails, setPackageDetails] = useState<Partial<PackageDetails>>({
    recipientName: '',
    productId: '',
    trackingNumber: '',
    comments: '',
  });
  const [dialogMode, setDialogMode] = useState<'store' | 'retrieve'>('store');

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

  const handleStorePackage = () => {
    if (!selectedLocker || !currentUser) return;

    const completePackageDetails: PackageDetails = {
      id: `pkg_${Date.now()}`,
      recipientName: packageDetails.recipientName || '',
      productId: packageDetails.productId || '',
      trackingNumber: packageDetails.trackingNumber || '',
      comments: packageDetails.comments || '',
      placedBy: currentUser.name,
      placedAt: new Date(),
    };

    if (onPackageStore) {
      onPackageStore(selectedLocker.id, completePackageDetails);
    }

    setShowDialog(false);
  };

  const handleRetrievePackage = () => {
    if (!selectedLocker || !currentUser) return;

    if (onPackageRetrieve) {
      onPackageRetrieve(selectedLocker.id, currentUser.name);
    }

    setShowDialog(false);
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
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 p-4 bg-secondary/50 rounded-lg">
        {lockers.map((locker) => (
          <TooltipProvider key={locker.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    getLockerSizeClass(locker.size),
                    'border rounded-md flex flex-col items-center justify-center p-2 cursor-pointer transition-all',
                    locker.status === 'available' ? 'bg-green-50 border-green-200 hover:bg-green-100' : 'bg-red-50 border-red-200 hover:bg-red-100',
                    selectedLockerId === locker.id && 'ring-2 ring-primary'
                  )}
                  onClick={() => handleLockerClick(locker)}
                >
                  <div className="flex justify-center mb-1">
                    {getLockerIcon(locker)}
                  </div>
                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                    #{locker.id}
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p>Locker #{locker.id}</p>
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
        ))}
      </div>

      {/* Dialog for package details */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'store' ? 'Store Package in Locker' : 'Retrieve Package from Locker'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'store'
                ? `Enter the package details to store in Locker #${selectedLocker?.id}`
                : `Package details for Locker #${selectedLocker?.id}`}
            </DialogDescription>
          </DialogHeader>
          
          {dialogMode === 'store' ? (
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
          ) : (
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
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            {dialogMode === 'store' ? (
              <Button 
                onClick={handleStorePackage}
                disabled={!packageDetails.recipientName || !packageDetails.productId}
              >
                <Package className="mr-2 h-4 w-4" />
                Store Package
              </Button>
            ) : (
              <Button onClick={handleRetrievePackage}>
                <PackageOpen className="mr-2 h-4 w-4" />
                Retrieve Package
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LockerMap;

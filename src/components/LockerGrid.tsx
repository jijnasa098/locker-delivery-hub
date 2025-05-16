
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, Package, Trash2 } from 'lucide-react';
import LockerMap, { PackageDetails } from '@/components/LockerMap';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Updated Locker interface to include packageDetails and systemId
interface Locker {
  id: number;
  systemId: number;
  size: 'small' | 'medium' | 'large';
  status: 'available' | 'occupied';
  packageDetails?: PackageDetails;
  row?: number;
  column?: number;
}

interface LockerGridProps {
  lockers: Locker[];
  lockerSystems: { id: number; name: string; location: string }[];
  selectedSystemId: number;
  onAddLockers: (count: number, size: 'small' | 'medium' | 'large', systemId: number, rows: number, columns: number) => void;
  onRemoveLockers: (count: number, size: 'small' | 'medium' | 'large', systemId: number) => void;
  onRemoveSingleLocker: (lockerId: number) => void;
  onPackageStore?: (lockerId: number, packageDetails: PackageDetails) => void;
  onPackageRetrieve?: (lockerId: number, retrievedBy: string) => void;
  currentUser?: { name: string; role: string };
}

const LockerGrid: React.FC<LockerGridProps> = ({
  lockers,
  lockerSystems,
  selectedSystemId,
  onAddLockers,
  onRemoveLockers,
  onRemoveSingleLocker,
  onPackageStore,
  onPackageRetrieve,
  currentUser
}) => {
  const { toast } = useToast();
  const [lockerSize, setLockerSize] = useState<'small' | 'medium' | 'large'>('small');
  const [showAddLockerDialog, setShowAddLockerDialog] = useState(false);
  const [showRemoveLockerDialog, setShowRemoveLockerDialog] = useState(false);
  const [rows, setRows] = useState(5);
  const [columns, setColumns] = useState(6);
  const [removeCount, setRemoveCount] = useState(1);
  
  const filteredLockers = lockers.filter(locker => locker.systemId === selectedSystemId);

  const handleAddLockers = () => {
    const totalLockers = rows * columns;
    if (totalLockers <= 0) {
      toast({
        title: "Invalid Configuration",
        description: "Number of rows and columns must be greater than zero.",
        variant: "destructive",
      });
      return;
    }
    
    onAddLockers(totalLockers, lockerSize, selectedSystemId, rows, columns);
    setShowAddLockerDialog(false);
    
    toast({
      title: "Success",
      description: `${rows}x${columns} grid of ${lockerSize} lockers have been added.`,
    });
  };

  const handleRemoveLockers = () => {
    if (removeCount <= 0) {
      toast({
        title: "Invalid Configuration",
        description: "Number of lockers to remove must be greater than zero.",
        variant: "destructive",
      });
      return;
    }
    
    onRemoveLockers(removeCount, lockerSize, selectedSystemId);
    setShowRemoveLockerDialog(false);
    
    toast({
      title: "Success",
      description: `${removeCount} ${lockerSize} lockers have been removed.`,
    });
  };

  const getLockerCounts = () => {
    return {
      small: filteredLockers.filter(locker => locker.size === 'small').length,
      medium: filteredLockers.filter(locker => locker.size === 'medium').length,
      large: filteredLockers.filter(locker => locker.size === 'large').length,
      total: filteredLockers.length,
      available: filteredLockers.filter(locker => locker.status === 'available').length,
      occupied: filteredLockers.filter(locker => locker.status === 'occupied').length,
    };
  };

  // Calculate grid container width based on columns
  const getGridStyle = () => {
    // This will create a responsive grid that adjusts based on column count
    // For larger grids (>10 columns), we'll use smaller locker sizes
    const lockerWidth = columns > 15 ? 40 : columns > 10 ? 50 : 60;
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, ${lockerWidth}px)`,
      gap: '4px',
      maxWidth: '100%',
      overflowX: 'auto',
    };
  };

  return (
    <div className="space-y-6">
      {filteredLockers.length > 0 ? (
        <>
          <div className="flex gap-4 mb-6 flex-wrap">
            <Button onClick={() => setShowAddLockerDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Lockers
            </Button>
            
            <Button 
              variant="outline" 
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => setShowRemoveLockerDialog(true)}
            >
              <Minus className="mr-2 h-4 w-4" />
              Remove Lockers
            </Button>
          </div>
          
          <div className="overflow-auto max-w-full border rounded-md p-4 bg-gray-50">
            <div style={getGridStyle()}>
              <LockerMap 
                lockers={filteredLockers} 
                onLockerSelect={(id) => {
                  const locker = lockers.find(l => l.id === id);
                  if (locker && locker.status === 'available') {
                    if (confirm(`Are you sure you want to remove locker #${id}?`)) {
                      onRemoveSingleLocker(id);
                    }
                  } else if (locker && locker.status === 'occupied') {
                    toast({
                      title: "Cannot Remove",
                      description: "You cannot remove an occupied locker.",
                      variant: "destructive",
                    });
                  }
                }}
                onPackageStore={onPackageStore}
                onPackageRetrieve={onPackageRetrieve}
                currentUser={currentUser}
                hideEmptySlots={false}
              />
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-md mt-4">
            <h3 className="font-medium mb-2">Locker Distribution:</h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span>Grid Size:</span>
                <span>{Math.ceil(filteredLockers.length / columns)} rows × {columns} columns</span>
              </div>
              <div className="flex justify-between">
                <span>Small Lockers:</span>
                <span>{getLockerCounts().small}</span>
              </div>
              <div className="flex justify-between">
                <span>Medium Lockers:</span>
                <span>{getLockerCounts().medium}</span>
              </div>
              <div className="flex justify-between">
                <span>Large Lockers:</span>
                <span>{getLockerCounts().large}</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Available:</span>
                <span>{getLockerCounts().available}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Occupied:</span>
                <span>{getLockerCounts().occupied}</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No Lockers</h3>
          <p className="text-muted-foreground mb-6">
            This locker system doesn't have any lockers yet.
          </p>
          <Button onClick={() => setShowAddLockerDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Lockers
          </Button>
        </div>
      )}
      
      {/* Add Lockers Dialog */}
      <Dialog open={showAddLockerDialog} onOpenChange={setShowAddLockerDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Lockers</DialogTitle>
            <DialogDescription>
              Specify the number of rows and columns for the locker grid.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rows">Number of Rows</Label>
                <Input
                  id="rows"
                  type="number"
                  min="1"
                  max="100"
                  value={rows}
                  onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="columns">Number of Columns</Label>
                <Input
                  id="columns"
                  type="number"
                  min="1"
                  max="100"
                  value={columns}
                  onChange={(e) => setColumns(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lockerSize">Locker Size</Label>
              <Select 
                value={lockerSize} 
                onValueChange={(value) => setLockerSize(value as 'small' | 'medium' | 'large')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Total lockers to be added: {rows * columns}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddLockerDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLockers}>
              Add Lockers
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Remove Lockers Dialog */}
      <Dialog open={showRemoveLockerDialog} onOpenChange={setShowRemoveLockerDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Lockers</DialogTitle>
            <DialogDescription>
              Select how many lockers you want to remove.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="removeCount">Number of Lockers to Remove</Label>
              <Input
                id="removeCount"
                type="number"
                min="1"
                max={filteredLockers.length}
                value={removeCount}
                onChange={(e) => setRemoveCount(parseInt(e.target.value) || 1)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="removeLockerSize">Locker Size</Label>
              <Select 
                value={lockerSize} 
                onValueChange={(value) => setLockerSize(value as 'small' | 'medium' | 'large')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Currently available {lockerSize} lockers: {filteredLockers.filter(l => l.size === lockerSize).length}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRemoveLockerDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRemoveLockers}
              disabled={filteredLockers.filter(l => l.size === lockerSize).length < removeCount}
            >
              Remove Lockers
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LockerGrid;


import React, { useState } from 'react';
import { Locker } from '@/lib/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, Package } from 'lucide-react';
import LockerMap, { PackageDetails } from '@/components/LockerMap';

interface LockerGridProps {
  lockers: Locker[];
  lockerSystems: { id: number; name: string; location: string }[];
  selectedSystemId: number;
  onAddLockers: (count: number, size: 'small' | 'medium' | 'large', systemId: number) => void;
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
  const [rows, setRows] = useState(5);
  const [columns, setColumns] = useState(6);
  const filteredLockers = lockers.filter(locker => locker.systemId === selectedSystemId);

  const handleRowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setRows(value);
    }
  };

  const handleColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setColumns(value);
    }
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

  return (
    <div>
      {filteredLockers.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rows">Grid Rows</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="rows" 
                  type="number" 
                  value={rows} 
                  onChange={handleRowChange}
                  min={1}
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">×</span>
                <Input 
                  id="columns" 
                  type="number" 
                  value={columns} 
                  onChange={handleColumnChange}
                  min={1} 
                  className="w-32"
                />
                <Label htmlFor="columns" className="ml-2">Columns</Label>
              </div>
              <p className="text-sm text-muted-foreground">Adjust grid layout to organize lockers</p>
            </div>
          </div>

          <LockerMap 
            lockers={filteredLockers} 
            rows={rows}
            columns={columns}
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
          />
          
          <div className="bg-muted p-4 rounded-md mt-4">
            <h3 className="font-medium mb-2">Locker Distribution:</h3>
            <div className="flex flex-col gap-2">
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
        </div>
      ) : (
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No Lockers</h3>
          <p className="text-muted-foreground mb-6">
            This locker system doesn't have any lockers yet.
          </p>
          <Button onClick={() => onAddLockers(1, 'small', selectedSystemId)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Lockers
          </Button>
        </div>
      )}
    </div>
  );
};

export default LockerGrid;

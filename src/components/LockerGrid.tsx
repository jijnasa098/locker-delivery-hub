
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, Package, Grid3x3, Trash } from 'lucide-react';
import LockerMap, { PackageDetails } from '@/components/LockerMap';

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
  onAddLockers: (rows: number, columns: number, size: 'small' | 'medium' | 'large', systemId: number) => void;
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
  const [lockerSize, setLockerSize] = useState<'small' | 'medium' | 'large'>('small');
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

  const handleAddLockers = () => {
    onAddLockers(rows, columns, lockerSize, selectedSystemId);
  };

  const handleRemoveLockers = (count: number) => {
    onRemoveLockers(count, lockerSize, selectedSystemId);
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
      <div className="space-y-6">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rows">Grid Layout</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="rows" 
                    type="number" 
                    value={rows} 
                    onChange={handleRowChange}
                    min={1}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">×</span>
                  <Input 
                    id="columns" 
                    type="number" 
                    value={columns} 
                    onChange={handleColumnChange}
                    min={1} 
                    className="w-24"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Rows × Columns</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lockerSize">Locker Size</Label>
                <Select 
                  value={lockerSize} 
                  onValueChange={(value) => setLockerSize(value as 'small' | 'medium' | 'large')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex flex-col">
                <Label className="mb-2">Actions</Label>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={handleAddLockers}
                    className="flex-1"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add {rows * columns} {lockerSize} Lockers
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-red-200 text-red-600 hover:bg-red-50 flex-1"
                    onClick={() => handleRemoveLockers(rows * columns)}
                  >
                    <Minus className="mr-2 h-4 w-4" />
                    Remove Lockers
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {filteredLockers.length > 0 ? (
          <>
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
          </>
        ) : (
          <div className="text-center py-8">
            <Grid3x3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Lockers</h3>
            <p className="text-muted-foreground mb-6">
              This locker system doesn't have any lockers yet.
            </p>
            <Button onClick={handleAddLockers}>
              <Plus className="mr-2 h-4 w-4" />
              Add {rows * columns} {lockerSize} Lockers
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LockerGrid;


import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, Building, Package } from 'lucide-react';
import LockerGrid from '@/components/LockerGrid';

// Type definitions
interface LockerSystem {
  id: number;
  name: string;
  location: string;
  description?: string;
}

interface Locker {
  id: number;
  systemId: number;
  size: 'small' | 'medium' | 'large';
  status: 'available' | 'occupied';
  packageDetails?: {
    id: string;
    recipientName: string;
    productId: string;
    trackingNumber?: string;
    comments?: string;
    placedBy: string;
    placedAt: Date;
    retrievedBy?: string;
    retrievedAt?: Date;
    otp?: string;
  };
  row?: number;
  column?: number;
}

const CommunityManager: React.FC = () => {
  // State management
  const { toast } = useToast();
  const [lockerSystems, setLockerSystems] = useState<LockerSystem[]>([
    { id: 1, name: 'Main Building', location: 'Lobby', description: 'Main building lobby lockers' },
    { id: 2, name: 'Residence Hall', location: 'First Floor', description: 'Residence hall lockers' },
    { id: 3, name: 'Gym', location: 'Entrance', description: 'Gym entrance lockers' }
  ]);
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [selectedSystemId, setSelectedSystemId] = useState<number>(1);
  const [nextLockerId, setNextLockerId] = useState<number>(1);
  const [showAddLockerSystemDialog, setShowAddLockerSystemDialog] = useState<boolean>(false);
  const [showAddLockerDialog, setShowAddLockerDialog] = useState<boolean>(false);
  const [newLockerSystemName, setNewLockerSystemName] = useState<string>('');
  const [newLockerSystemLocation, setNewLockerSystemLocation] = useState<string>('');
  const [newLockerSystemDescription, setNewLockerSystemDescription] = useState<string>('');
  const [lockerFormData, setLockerFormData] = useState<{
    rows: number;
    columns: number;
    size: 'small' | 'medium' | 'large';
    systemId: number;
  }>({
    rows: 3,
    columns: 4,
    size: 'small',
    systemId: selectedSystemId
  });

  // Initialize with some demo lockers
  useEffect(() => {
    // Empty dependency array means this effect runs once on mount
  }, []);

  // Handle form changes
  const handleLockerFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLockerFormData(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  // Add locker system
  const handleAddLockerSystem = () => {
    if (!newLockerSystemName || !newLockerSystemLocation) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and location for the locker system.",
        variant: "destructive"
      });
      return;
    }

    const newId = lockerSystems.length > 0 
      ? Math.max(...lockerSystems.map(system => system.id)) + 1 
      : 1;

    const newSystem: LockerSystem = {
      id: newId,
      name: newLockerSystemName,
      location: newLockerSystemLocation,
      description: newLockerSystemDescription || undefined
    };

    setLockerSystems([...lockerSystems, newSystem]);
    setSelectedSystemId(newId);
    setShowAddLockerSystemDialog(false);
    
    // Reset form
    setNewLockerSystemName('');
    setNewLockerSystemLocation('');
    setNewLockerSystemDescription('');

    toast({
      title: "Success",
      description: `${newLockerSystemName} locker system has been added.`
    });
  };

  // Add lockers
  const handleAddLockers = () => {
    const { rows, columns, size, systemId } = lockerFormData;
    const totalLockers = rows * columns;
    
    if (rows <= 0 || columns <= 0) {
      toast({
        title: "Invalid Configuration",
        description: "Rows and columns must be greater than zero.",
        variant: "destructive"
      });
      return;
    }

    const newLockers: Locker[] = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const newLocker: Locker = {
          id: nextLockerId + newLockers.length,
          systemId,
          size,
          status: 'available',
          row: row,
          column: col
        };
        newLockers.push(newLocker);
      }
    }

    setLockers([...lockers, ...newLockers]);
    setNextLockerId(nextLockerId + newLockers.length);
    setShowAddLockerDialog(false);
    
    toast({
      title: "Success",
      description: `${totalLockers} ${size} lockers have been added.`
    });
  };

  // Remove lockers
  const handleRemoveLockers = (count: number, size: 'small' | 'medium' | 'large', systemId: number) => {
    const systemLockers = lockers.filter(l => l.systemId === systemId && l.size === size);
    
    if (systemLockers.length === 0) {
      toast({
        title: "No Lockers",
        description: `There are no ${size} lockers in this system to remove.`,
        variant: "destructive"
      });
      return;
    }

    // Limit count to available lockers
    count = Math.min(count, systemLockers.length);
    
    // Filter out lockers that are occupied
    const availableLockers = systemLockers.filter(l => l.status === 'available');
    
    if (availableLockers.length === 0) {
      toast({
        title: "All Lockers Occupied",
        description: `All ${size} lockers in this system are currently occupied.`,
        variant: "destructive"
      });
      return;
    }

    // Limit count to available lockers
    count = Math.min(count, availableLockers.length);
    
    // Get IDs of lockers to remove
    const lockerIdsToRemove = availableLockers
      .slice(0, count)
      .map(l => l.id);
    
    // Remove the lockers
    setLockers(lockers.filter(l => !lockerIdsToRemove.includes(l.id)));
    
    toast({
      title: "Success",
      description: `${count} ${size} lockers have been removed.`
    });
  };

  // Remove a single locker
  const handleRemoveSingleLocker = (lockerId: number) => {
    const lockerToRemove = lockers.find(l => l.id === lockerId);
    
    if (!lockerToRemove) {
      toast({
        title: "Error",
        description: "Locker not found.",
        variant: "destructive"
      });
      return;
    }
    
    if (lockerToRemove.status === 'occupied') {
      toast({
        title: "Cannot Remove",
        description: "Cannot remove an occupied locker.",
        variant: "destructive"
      });
      return;
    }
    
    setLockers(lockers.filter(l => l.id !== lockerId));
    
    toast({
      title: "Success",
      description: `Locker #${lockerId} has been removed.`
    });
  };

  // Package operations
  const handlePackageStore = (lockerId: number, packageDetails: any) => {
    setLockers(lockers.map(locker => 
      locker.id === lockerId 
        ? { ...locker, status: 'occupied', packageDetails } 
        : locker
    ));
  };

  const handlePackageRetrieve = (lockerId: number, retrievedBy: string) => {
    setLockers(lockers.map(locker => 
      locker.id === lockerId 
        ? { 
            ...locker, 
            status: 'available', 
            packageDetails: locker.packageDetails 
              ? {
                  ...locker.packageDetails,
                  retrievedBy,
                  retrievedAt: new Date()
                } 
              : undefined
          } 
        : locker
    ));
  };

  // Helper to get the selected system
  const getSelectedSystem = () => {
    return lockerSystems.find(system => system.id === selectedSystemId) || lockerSystems[0];
  };

  // Render
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Community Manager Dashboard</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column */}
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Locker Systems</CardTitle>
              <CardDescription>Manage your locker systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Your Systems</h3>
                  <Button 
                    size="sm" 
                    onClick={() => setShowAddLockerSystemDialog(true)}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add System
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {lockerSystems.map(system => (
                    <div 
                      key={system.id} 
                      className={`
                        flex items-center p-3 rounded-md cursor-pointer 
                        ${selectedSystemId === system.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                      `}
                      onClick={() => setSelectedSystemId(system.id)}
                    >
                      <Building className="mr-3 h-5 w-5" />
                      <div>
                        <p className="font-medium">{system.name}</p>
                        <p className="text-xs opacity-80">{system.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column */}
        <div className="w-full md:w-2/3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{getSelectedSystem()?.name || 'Select a Locker System'}</CardTitle>
                  <CardDescription>{getSelectedSystem()?.location} - {getSelectedSystem()?.description}</CardDescription>
                </div>
                <Button onClick={() => setShowAddLockerDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Lockers
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <LockerGrid 
                lockers={lockers} 
                lockerSystems={lockerSystems}
                selectedSystemId={selectedSystemId}
                onAddLockers={handleAddLockers}
                onRemoveLockers={handleRemoveLockers}
                onRemoveSingleLocker={handleRemoveSingleLocker}
                onPackageStore={handlePackageStore}
                onPackageRetrieve={handlePackageRetrieve}
                currentUser={{ name: "Community Manager", role: "manager" }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add Locker System Dialog */}
      <Dialog open={showAddLockerSystemDialog} onOpenChange={setShowAddLockerSystemDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Locker System</DialogTitle>
            <DialogDescription>
              Create a new locker system for your community.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="systemName">System Name</Label>
              <Input
                id="systemName"
                placeholder="Main Building"
                value={newLockerSystemName}
                onChange={(e) => setNewLockerSystemName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Lobby"
                value={newLockerSystemLocation}
                onChange={(e) => setNewLockerSystemLocation(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Main building lobby lockers"
                value={newLockerSystemDescription}
                onChange={(e) => setNewLockerSystemDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddLockerSystemDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLockerSystem}>
              Add System
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Add Lockers Dialog */}
      <Dialog open={showAddLockerDialog} onOpenChange={setShowAddLockerDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Lockers</DialogTitle>
            <DialogDescription>
              Add new lockers to your community.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="systemId">Locker System</Label>
              <Select 
                value={lockerFormData.systemId.toString()}
                onValueChange={(value) => setLockerFormData(prev => ({ ...prev, systemId: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select locker system" />
                </SelectTrigger>
                <SelectContent>
                  {lockerSystems.map(system => (
                    <SelectItem key={system.id} value={system.id.toString()}>
                      {system.name} ({system.location})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rows">Rows</Label>
                <Input
                  id="rows"
                  name="rows"
                  type="number"
                  min="1"
                  value={lockerFormData.rows}
                  onChange={handleLockerFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="columns">Columns</Label>
                <Input
                  id="columns"
                  name="columns"
                  type="number"
                  min="1"
                  value={lockerFormData.columns}
                  onChange={handleLockerFormChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Locker Size</Label>
              <Select 
                value={lockerFormData.size}
                onValueChange={(value: 'small' | 'medium' | 'large') => 
                  setLockerFormData(prev => ({ ...prev, size: value }))
                }
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
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm">
                This will add {lockerFormData.rows * lockerFormData.columns} {lockerFormData.size} lockers in a {lockerFormData.rows}×{lockerFormData.columns} grid.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddLockerDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLockers}>
              Add {lockerFormData.rows * lockerFormData.columns} Lockers
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunityManager;

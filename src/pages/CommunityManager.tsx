import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, Building, Package, Users, User, History, FileText, Lock, Key } from 'lucide-react';
import LockerGrid from '@/components/LockerGrid';

// Type definitions
interface LockerSystem {
  id: number;
  name: string;
  location: string;
  communityId: string;
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
    { id: 1, name: 'Main Building', location: 'Lobby', communityId: 'COM001', description: 'Main building lobby lockers' },
    { id: 2, name: 'Residence Hall', location: 'First Floor', communityId: 'COM001', description: 'Residence hall lockers' },
    { id: 3, name: 'Gym', location: 'Entrance', communityId: 'COM002', description: 'Gym entrance lockers' }
  ]);
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [selectedSystemId, setSelectedSystemId] = useState<number>(1);
  const [nextLockerId, setNextLockerId] = useState<number>(1);
  const [showAddLockerSystemDialog, setShowAddLockerSystemDialog] = useState<boolean>(false);
  const [showAddLockerDialog, setShowAddLockerDialog] = useState<boolean>(false);
  const [newLockerSystemName, setNewLockerSystemName] = useState<string>('');
  const [newLockerSystemLocation, setNewLockerSystemLocation] = useState<string>('');
  const [newLockerSystemCommunityId, setNewLockerSystemCommunityId] = useState<string>('');
  const [newLockerSystemDescription, setNewLockerSystemDescription] = useState<string>('');
  const [communityId, setCommunityId] = useState<string>('COM001');
  
  // Staff management state
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [showAddStaffDialog, setShowAddStaffDialog] = useState<boolean>(false);
  const [newStaffData, setNewStaffData] = useState<any>({
    name: '',
    role: 'staff',
    email: '',
    phone: ''
  });
  
  // Residents management state
  const [residents, setResidents] = useState<any[]>([]);
  const [showAddResidentDialog, setShowAddResidentDialog] = useState<boolean>(false);
  const [newResidentData, setNewResidentData] = useState<any>({
    name: '',
    email: '',
    unit: '',
    phone: '',
    status: 'pending'
  });
  
  // Parcel history state
  const [parcelHistory, setParcelHistory] = useState<any[]>([]);

  // Initialize with some demo lockers
  useEffect(() => {
    // Empty dependency array means this effect runs once on mount
  }, []);

  // Add locker system
  const handleAddLockerSystem = () => {
    if (!newLockerSystemName || !newLockerSystemLocation || !newLockerSystemCommunityId) {
      toast({
        title: "Missing Information",
        description: "Please provide name, location, and community ID for the locker system.",
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
      communityId: newLockerSystemCommunityId,
      description: newLockerSystemDescription || undefined
    };

    setLockerSystems([...lockerSystems, newSystem]);
    setSelectedSystemId(newId);
    setShowAddLockerSystemDialog(false);
    
    // Reset form
    setNewLockerSystemName('');
    setNewLockerSystemLocation('');
    setNewLockerSystemCommunityId('');
    setNewLockerSystemDescription('');

    toast({
      title: "Success",
      description: `${newLockerSystemName} locker system has been added.`
    });
  };

  // Add lockers
  const handleAddLockers = (count: number, size: 'small' | 'medium' | 'large', systemId: number) => {
    if (count <= 0) {
      toast({
        title: "Invalid Configuration",
        description: "Number of lockers must be greater than zero.",
        variant: "destructive"
      });
      return;
    }

    const newLockers: Locker[] = [];
    
    for (let i = 0; i < count; i++) {
      const newLocker: Locker = {
        id: nextLockerId + i,
        systemId,
        size,
        status: 'available',
        row: Math.floor(i / 4), // Example layout
        column: i % 4
      };
      newLockers.push(newLocker);
    }

    setLockers([...lockers, ...newLockers]);
    setNextLockerId(nextLockerId + count);
    
    toast({
      title: "Success",
      description: `${count} ${size} lockers have been added.`
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

    count = Math.min(count, systemLockers.length);
    
    const lockerIdsToRemove = systemLockers.slice(0, count).map(l => l.id);
    
    setLockers(lockers.filter(l => !lockerIdsToRemove.includes(l.id)));
    
    toast({
      title: "Success",
      description: `${count} ${size} lockers have been removed.`
    });
  };

  // Remove a single locker
  const handleRemoveSingleLocker = (lockerId: number) => {
    setLockers(lockers.filter(l => l.id !== lockerId));
    
    toast({
      title: "Success",
      description: `Locker #${lockerId} has been removed.`
    });
  };

  // Render
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Community Manager Dashboard</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Community ID</p>
              <Select value={communityId} onValueChange={setCommunityId}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select Community" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COM001">COM001</SelectItem>
                  <SelectItem value="COM002">COM002</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="lockers" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="lockers" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Locker Management</span>
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Staff</span>
          </TabsTrigger>
          <TabsTrigger value="residents" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Residents</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Parcel History</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Locker Management Tab */}
        <TabsContent value="lockers">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column */}
            <div className="w-full md:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle>Locker Systems</CardTitle>
                  <CardDescription>Manage your locker systems for community {communityId}</CardDescription>
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
                      {lockerSystems.filter(system => system.communityId === communityId).map(system => (
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
                      <CardTitle>{lockerSystems.find(system => system.id === selectedSystemId)?.name || 'Select a Locker System'}</CardTitle>
                      <CardDescription>{lockerSystems.find(system => system.id === selectedSystemId)?.location} - {lockerSystems.find(system => system.id === selectedSystemId)?.description}</CardDescription>
                    </div>
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
                    currentUser={{ name: "Community Manager", role: "manager" }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Staff Management Tab */}
        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Staff Management</CardTitle>
                <Button onClick={() => setShowAddStaffDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Staff Member
                </Button>
              </div>
              <CardDescription>Manage staff members who have access to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left">Name</th>
                      <th className="py-3 px-4 text-left">Role</th>
                      <th className="py-3 px-4 text-left">Email</th>
                      <th className="py-3 px-4 text-left">Phone</th>
                      <th className="py-3 px-4 text-left">Join Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffMembers.map(staff => (
                      <tr key={staff.id} className="border-b">
                        <td className="py-3 px-4">{staff.name}</td>
                        <td className="py-3 px-4 capitalize">{staff.role}</td>
                        <td className="py-3 px-4">{staff.email}</td>
                        <td className="py-3 px-4">{staff.phone || '-'}</td>
                        <td className="py-3 px-4">{staff.joinDate.toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-right">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRemoveStaff(staff.id)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {staffMembers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-4 px-4 text-center text-muted-foreground">
                          No staff members found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Residents Tab */}
        <TabsContent value="residents">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Resident Management</CardTitle>
                <Button onClick={() => setShowAddResidentDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Resident
                </Button>
              </div>
              <CardDescription>Manage residents who can receive parcels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left">Name</th>
                      <th className="py-3 px-4 text-left">Unit</th>
                      <th className="py-3 px-4 text-left">Email</th>
                      <th className="py-3 px-4 text-left">Phone</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Join Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {residents.map(resident => (
                      <tr key={resident.id} className="border-b">
                        <td className="py-3 px-4">{resident.name}</td>
                        <td className="py-3 px-4">{resident.unit}</td>
                        <td className="py-3 px-4">{resident.email}</td>
                        <td className="py-3 px-4">{resident.phone || '-'}</td>
                        <td className="py-3 px-4">
                          <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            resident.status === 'active' ? 'bg-green-100 text-green-800' :
                            resident.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {resident.status}
                          </div>
                        </td>
                        <td className="py-3 px-4">{resident.joinDate.toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex gap-2 justify-end">
                            {resident.status !== 'active' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUpdateResidentStatus(resident.id, 'active')}
                                className="text-green-600 border-green-200 hover:bg-green-50"
                              >
                                Approve
                              </Button>
                            )}
                            {resident.status === 'active' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUpdateResidentStatus(resident.id, 'inactive')}
                                className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                              >
                                Deactivate
                              </Button>
                            )}
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleRemoveResident(resident.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {residents.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-4 px-4 text-center text-muted-foreground">
                          No residents found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Parcel History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Parcel History</CardTitle>
              <CardDescription>View all package deliveries and collections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left">Tracking #</th>
                      <th className="py-3 px-4 text-left">Recipient</th>
                      <th className="py-3 px-4 text-left">Locker #</th>
                      <th className="py-3 px-4 text-left">Delivered By</th>
                      <th className="py-3 px-4 text-left">Delivered At</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Collected By</th>
                      <th className="py-3 px-4 text-left">Collected At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parcelHistory.map(parcel => (
                      <tr key={parcel.id} className="border-b">
                        <td className="py-3 px-4">{parcel.trackingNumber}</td>
                        <td className="py-3 px-4">{parcel.recipientName}</td>
                        <td className="py-3 px-4">{parcel.lockerNumber}</td>
                        <td className="py-3 px-4">{parcel.placedBy}</td>
                        <td className="py-3 px-4">{parcel.placedAt.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            parcel.status === 'delivered' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {parcel.status}
                          </div>
                        </td>
                        <td className="py-3 px-4">{parcel.retrievedBy || '-'}</td>
                        <td className="py-3 px-4">{parcel.retrievedAt ? parcel.retrievedAt.toLocaleString() : '-'}</td>
                      </tr>
                    ))}
                    {parcelHistory.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-4 px-4 text-center text-muted-foreground">
                          No parcel history found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
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
              <Label htmlFor="communityId">Community ID</Label>
              <Input
                id="communityId"
                placeholder="COM001"
                value={newLockerSystemCommunityId}
                onChange={(e) => setNewLockerSystemCommunityId(e.target.value)}
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
                value={selectedSystemId.toString()}
                onValueChange={(value) => setSelectedSystemId(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select locker system" />
                </SelectTrigger>
                <SelectContent>
                  {lockerSystems.filter(system => system.communityId === communityId).map(system => (
                    <SelectItem key={system.id} value={system.id.toString()}>
                      {system.name} ({system.location})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="count">Number of Lockers</Label>
              <Input
                id="count"
                type="number"
                min="1"
                value={1}
                onChange={(e) => handleAddLockers(parseInt(e.target.value), 'small', selectedSystemId)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Locker Size</Label>
              <Select 
                value={'small'}
                onValueChange={(value: 'small' | 'medium' | 'large') => 
                  handleAddLockers(1, value, selectedSystemId)
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
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddLockerDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleAddLockers(1, 'small', selectedSystemId)}>
              Add Locker
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Add Staff Dialog */}
      <Dialog open={showAddStaffDialog} onOpenChange={setShowAddStaffDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Staff Member</DialogTitle>
            <DialogDescription>
              Add a new staff member to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="staffName">Name</Label>
              <Input
                id="staffName"
                placeholder="John Doe"
                value={newStaffData.name}
                onChange={(e) => setNewStaffData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="staffEmail">Email</Label>
              <Input
                id="staffEmail"
                placeholder="john@example.com"
                type="email"
                value={newStaffData.email}
                onChange={(e) => setNewStaffData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="staffPhone">Phone (Optional)</Label>
              <Input
                id="staffPhone"
                placeholder="555-1234"
                value={newStaffData.phone}
                onChange={(e) => setNewStaffData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="staffRole">Role</Label>
              <Select 
                value={newStaffData.role}
                onValueChange={(value: 'manager' | 'staff') => 
                  setNewStaffData(prev => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddStaffDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStaff}>
              Add Staff Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Add Resident Dialog */}
      <Dialog open={showAddResidentDialog} onOpenChange={setShowAddResidentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Resident</DialogTitle>
            <DialogDescription>
              Add a new resident to the community.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="residentName">Name</Label>
              <Input
                id="residentName"
                placeholder="Jane Doe"
                value={newResidentData.name}
                onChange={(e) => setNewResidentData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="residentEmail">Email</Label>
              <Input
                id="residentEmail"
                placeholder="jane@example.com"
                type="email"
                value={newResidentData.email}
                onChange={(e) => setNewResidentData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="residentUnit">Unit</Label>
              <Input
                id="residentUnit"
                placeholder="A101"
                value={newResidentData.unit}
                onChange={(e) => setNewResidentData(prev => ({ ...prev, unit: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="residentPhone">Phone (Optional)</Label>
              <Input
                id="residentPhone"
                placeholder="555-5678"
                value={newResidentData.phone}
                onChange={(e) => setNewResidentData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="residentStatus">Status</Label>
              <Select 
                value={newResidentData.status}
                onValueChange={(value: 'active' | 'pending' | 'inactive') => 
                  setNewResidentData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddResidentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddResident}>
              Add Resident
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunityManager;

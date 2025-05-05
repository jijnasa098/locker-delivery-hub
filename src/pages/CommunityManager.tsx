
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, User, Lock, Plus, Trash, Edit, UserPlus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import LockerMap from '@/components/LockerMap';
import { lockers as initialLockers } from '@/lib/mockData';

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  communityId: string;
  role: 'staff';
}

interface LockerSettings {
  systems: Array<{
    id: number;
    name: string;
    location: string;
    lockers: {
      small: number;
      medium: number;
      large: number;
    };
  }>;
  totalLockers: number;
}

interface RegistrationData {
  name: string;
  email: string;
  communityId: string;
  userType: string;
  lockerSettings?: LockerSettings;
}

// Locker interface
interface Locker {
  id: number;
  systemId: number; // Added to track which system it belongs to
  size: 'small' | 'medium' | 'large';
  status: 'available' | 'occupied' | 'maintenance';
}

const CommunityManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock manager data - we'll try to get it from registration data if available
  const [manager, setManager] = useState({
    id: 'cm1',
    name: 'Community Manager',
    email: 'manager@example.com',
    role: 'manager',
    communityId: 'c1',
    communityName: 'Green Valley Apartments',
  });

  // Lockers state - now with systemId
  const [lockers, setLockers] = useState<Locker[]>([]);
  
  // Locker systems state
  const [lockerSystems, setLockerSystems] = useState<Array<{
    id: number;
    name: string;
    location: string;
  }>>([
    { id: 1, name: 'Main Building', location: 'Lobby' }
  ]);
  
  // Currently selected locker system for viewing
  const [selectedSystemId, setSelectedSystemId] = useState<number>(1);

  // Get registration data from localStorage if available
  useEffect(() => {
    const savedData = localStorage.getItem('registrationData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as RegistrationData;
        if (parsedData.userType === 'manager') {
          setManager({
            id: 'cm1', // Generate a real ID in a production app
            name: parsedData.name,
            email: parsedData.email,
            role: 'manager',
            communityId: parsedData.communityId,
            communityName: parsedData.communityId, // Using the community ID as the name for simplicity
          });
          
          // If we have locker settings, create the lockers based on that
          if (parsedData.lockerSettings && parsedData.lockerSettings.systems) {
            // Set the locker systems
            setLockerSystems(parsedData.lockerSettings.systems.map(system => ({
              id: system.id,
              name: system.name,
              location: system.location
            })));
            
            // Set the default selected system to the first one
            if (parsedData.lockerSettings.systems.length > 0) {
              setSelectedSystemId(parsedData.lockerSettings.systems[0].id);
            }
            
            // Generate all lockers from all systems
            const generatedLockers = generateLockersFromSettings(parsedData.lockerSettings);
            setLockers(generatedLockers);
          } else {
            // Fall back to initial lockers if no settings
            setLockers([...initialLockers]);
          }
        }
      } catch (error) {
        console.error("Error parsing registration data", error);
      }
    }
  }, []);
  
  // Generate lockers based on registration settings
  const generateLockersFromSettings = (settings: LockerSettings): Locker[] => {
    const newLockers: Locker[] = [];
    let globalLockerId = 1;
    
    // For each locker system
    settings.systems.forEach(system => {
      // Add small lockers
      for (let i = 0; i < system.lockers.small; i++) {
        newLockers.push({
          id: globalLockerId++,
          systemId: system.id,
          size: 'small',
          status: 'available'
        });
      }
      
      // Add medium lockers
      for (let i = 0; i < system.lockers.medium; i++) {
        newLockers.push({
          id: globalLockerId++,
          systemId: system.id,
          size: 'medium',
          status: 'available'
        });
      }
      
      // Add large lockers
      for (let i = 0; i < system.lockers.large; i++) {
        newLockers.push({
          id: globalLockerId++,
          systemId: system.id,
          size: 'large',
          status: 'available'
        });
      }
    });
    
    return newLockers;
  };
  
  // Filter lockers by selected system
  const filteredLockers = lockers.filter(locker => locker.systemId === selectedSystemId);
  
  // States
  const [staffMembers, setStaffMembers] = useState<Staff[]>([
    { 
      id: 'staff1', 
      name: 'John Staff', 
      email: 'john.staff@example.com', 
      phone: '555-1111', 
      username: 'jstaff',
      communityId: 'c1',
      role: 'staff' 
    },
    { 
      id: 'staff2', 
      name: 'Jane Staff', 
      email: 'jane.staff@example.com', 
      phone: '555-2222', 
      username: 'janestaff',
      communityId: 'c1',
      role: 'staff' 
    }
  ]);

  // Dialog states
  const [showAddStaffDialog, setShowAddStaffDialog] = useState(false);
  const [showAddLockerDialog, setShowAddLockerDialog] = useState(false);
  const [staffFormData, setStaffFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    communityId: manager.communityId,
  });
  const [lockerFormData, setLockerFormData] = useState({
    count: 1,
    size: 'small' as 'small' | 'medium' | 'large',
    systemId: selectedSystemId,
  });

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate('/');
  };

  const handleStaffFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStaffFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLockerFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLockerFormData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleAddStaff = () => {
    // Validate required fields
    if (!staffFormData.name || !staffFormData.email || !staffFormData.username) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const newStaff: Staff = {
      id: `staff${staffMembers.length + 1}`,
      name: staffFormData.name,
      email: staffFormData.email,
      phone: staffFormData.phone,
      username: staffFormData.username,
      communityId: staffFormData.communityId,
      role: 'staff'
    };

    setStaffMembers([...staffMembers, newStaff]);
    setShowAddStaffDialog(false);
    setStaffFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      username: '',
      communityId: manager.communityId 
    });
    
    toast({
      title: "Staff Added",
      description: `${staffFormData.name} has been added as staff with username ${staffFormData.username}.`,
    });
  };

  const handleRemoveStaff = (staffId: string) => {
    setStaffMembers(staffMembers.filter(staff => staff.id !== staffId));
    toast({
      title: "Staff Removed",
      description: "The staff member has been removed.",
    });
  };

  const handleAddLockers = () => {
    // Get the current highest locker ID
    const currentHighestId = lockers.length > 0 ? Math.max(...lockers.map(locker => locker.id)) : 0;
    
    // Create new lockers with the selected system ID
    const newLockers = Array.from({ length: lockerFormData.count }, (_, index) => ({
      id: currentHighestId + index + 1,
      systemId: lockerFormData.systemId,
      size: lockerFormData.size,
      status: 'available' as const
    }));

    // Add the new lockers to the existing ones
    setLockers([...lockers, ...newLockers]);
    setShowAddLockerDialog(false);
    setLockerFormData({ count: 1, size: 'small', systemId: selectedSystemId });
    
    toast({
      title: "Lockers Added",
      description: `${lockerFormData.count} new ${lockerFormData.size} lockers have been added to ${lockerSystems.find(s => s.id === lockerFormData.systemId)?.name}.`,
    });
  };

  const handleRemoveLocker = (lockerId: number) => {
    setLockers(lockers.filter(locker => locker.id !== lockerId));
    toast({
      title: "Locker Removed",
      description: `Locker #${lockerId} has been removed.`,
    });
  };

  // Get locker counts by system and size
  const getLockerCounts = (systemId: number) => {
    const systemLockers = lockers.filter(locker => locker.systemId === systemId);
    return {
      small: systemLockers.filter(locker => locker.size === 'small').length,
      medium: systemLockers.filter(locker => locker.size === 'medium').length,
      large: systemLockers.filter(locker => locker.size === 'large').length,
      total: systemLockers.length,
      available: systemLockers.filter(locker => locker.status === 'available').length,
      occupied: systemLockers.filter(locker => locker.status === 'occupied').length,
    };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        user={{ name: manager.name, role: manager.role }}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 container px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Community Manager Dashboard</h1>
            <p className="text-muted-foreground">
              Manage lockers and staff for {manager.communityName} (ID: {manager.communityId})
            </p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Locker Systems</CardTitle>
              <CardDescription>Number of locker locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{lockerSystems.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Lockers</CardTitle>
              <CardDescription>All lockers in the community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{lockers.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Available</CardTitle>
              <CardDescription>Empty lockers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                {lockers.filter(locker => locker.status === 'available').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Staff</CardTitle>
              <CardDescription>Total staff members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{staffMembers.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="lockers" className="mb-8">
          <TabsList>
            <TabsTrigger value="lockers">Locker Management</TabsTrigger>
            <TabsTrigger value="staff">Staff Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="lockers">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Locker Systems</CardTitle>
                    <CardDescription>Manage all lockers in the community</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddLockerDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Lockers
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Locker System Selector */}
                  <div className="mb-6">
                    <Label htmlFor="systemSelector">Select Locker System:</Label>
                    <div className="flex gap-4 flex-wrap mt-2">
                      {lockerSystems.map(system => (
                        <Card 
                          key={system.id} 
                          className={`cursor-pointer border transition-colors ${selectedSystemId === system.id ? 'border-primary bg-primary/10' : ''}`}
                          onClick={() => setSelectedSystemId(system.id)}
                        >
                          <CardContent className="p-4">
                            <h3 className="font-medium">{system.name}</h3>
                            <p className="text-sm text-muted-foreground">{system.location}</p>
                            <p className="text-sm mt-1">
                              {getLockerCounts(system.id).total} lockers
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  {/* Selected System Details */}
                  {selectedSystemId && (
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        {lockerSystems.find(s => s.id === selectedSystemId)?.name} Lockers
                      </h3>
                      
                      {filteredLockers.length > 0 ? (
                        <LockerMap 
                          lockers={filteredLockers} 
                          onLockerSelect={(id) => {
                            const locker = lockers.find(l => l.id === id);
                            if (locker && locker.status === 'available') {
                              if (confirm(`Are you sure you want to remove locker #${id}?`)) {
                                handleRemoveLocker(id);
                              }
                            } else {
                              toast({
                                title: "Cannot Remove",
                                description: "You cannot remove an occupied locker.",
                                variant: "destructive",
                              });
                            }
                          }}
                        />
                      ) : (
                        <div className="text-center py-8">
                          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-xl font-medium mb-2">No Lockers</h3>
                          <p className="text-muted-foreground mb-6">
                            This locker system doesn't have any lockers yet.
                          </p>
                          <Button onClick={() => {
                            setLockerFormData(prev => ({ ...prev, systemId: selectedSystemId }));
                            setShowAddLockerDialog(true);
                          }}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Lockers
                          </Button>
                        </div>
                      )}
                      
                      {filteredLockers.length > 0 && (
                        <div className="bg-muted p-4 rounded-md mt-4">
                          <h3 className="font-medium mb-2">Locker Distribution:</h3>
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between">
                              <span>Small Lockers:</span>
                              <span>{filteredLockers.filter(l => l.size === 'small').length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Medium Lockers:</span>
                              <span>{filteredLockers.filter(l => l.size === 'medium').length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Large Lockers:</span>
                              <span>{filteredLockers.filter(l => l.size === 'large').length}</span>
                            </div>
                            <div className="flex justify-between font-medium pt-2 border-t">
                              <span>Available:</span>
                              <span>{filteredLockers.filter(l => l.status === 'available').length}</span>
                            </div>
                            <div className="flex justify-between font-medium">
                              <span>Occupied:</span>
                              <span>{filteredLockers.filter(l => l.status === 'occupied').length}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Staff Members</CardTitle>
                    <CardDescription>Manage staff for your community</CardDescription>
                  </div>
                  <Button onClick={() => setShowAddStaffDialog(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Staff
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {staffMembers.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Community ID</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staffMembers.map(staff => (
                        <TableRow key={staff.id}>
                          <TableCell className="font-medium">{staff.name}</TableCell>
                          <TableCell>{staff.username}</TableCell>
                          <TableCell>{staff.email}</TableCell>
                          <TableCell>{staff.phone}</TableCell>
                          <TableCell>{staff.communityId}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveStaff(staff.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Staff Members</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't added any staff members yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add Staff Dialog */}
      <Dialog open={showAddStaffDialog} onOpenChange={setShowAddStaffDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Staff</DialogTitle>
            <DialogDescription>
              Add a new staff member to your community.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={staffFormData.name}
                onChange={handleStaffFormChange}
                placeholder="Enter full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={staffFormData.username}
                onChange={handleStaffFormChange}
                placeholder="Enter username for login"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={staffFormData.email}
                onChange={handleStaffFormChange}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={staffFormData.phone}
                onChange={handleStaffFormChange}
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="communityId">Community ID</Label>
              <Input
                id="communityId"
                name="communityId"
                value={staffFormData.communityId}
                onChange={handleStaffFormChange}
                placeholder="Enter community ID"
                disabled
              />
              <p className="text-xs text-muted-foreground">Staff will be assigned to your community.</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddStaffDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStaff} disabled={!staffFormData.name || !staffFormData.email || !staffFormData.username}>
              Add Staff
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
            <div className="space-y-2">
              <Label htmlFor="count">Number of Lockers</Label>
              <Input
                id="count"
                name="count"
                type="number"
                min="1"
                value={lockerFormData.count}
                onChange={handleLockerFormChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Locker Size</Label>
              <Select 
                value={lockerFormData.size} 
                onValueChange={(value) => setLockerFormData(prev => ({ ...prev, size: value as any }))}
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
            <Button onClick={handleAddLockers}>
              Add Lockers
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunityManager;

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
  totalLockers: number;
  lockSizes: {
    small: number;
    medium: number;
    large: number;
  };
}

interface RegistrationData {
  name: string;
  email: string;
  communityId: string;
  userType: string;
  lockerSettings?: LockerSettings;
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
          if (parsedData.lockerSettings) {
            const newLockers = generateLockersFromSettings(parsedData.lockerSettings);
            setLockers(newLockers);
          }
        }
      } catch (error) {
        console.error("Error parsing registration data", error);
      }
    }
  }, []);
  
  // Generate lockers based on registration settings
  const generateLockersFromSettings = (settings: LockerSettings) => {
    const newLockers = [];
    let lockerId = 1;
    
    // Add small lockers
    for (let i = 0; i < settings.lockSizes.small; i++) {
      newLockers.push({
        id: lockerId++,
        size: 'small' as const,
        status: 'available' as const
      });
    }
    
    // Add medium lockers
    for (let i = 0; i < settings.lockSizes.medium; i++) {
      newLockers.push({
        id: lockerId++,
        size: 'medium' as const,
        status: 'available' as const
      });
    }
    
    // Add large lockers
    for (let i = 0; i < settings.lockSizes.large; i++) {
      newLockers.push({
        id: lockerId++,
        size: 'large' as const,
        status: 'available' as const
      });
    }
    
    return newLockers;
  };
  
  // States
  const [lockers, setLockers] = useState<typeof initialLockers>([...initialLockers]);
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
    communityId: manager.communityId, // Default to manager's community ID
  });
  const [lockerFormData, setLockerFormData] = useState({
    count: 1,
    size: 'small' as 'small' | 'medium' | 'large',
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
    const currentHighestId = lockers.length > 0 ? Math.max(...lockers.map(locker => locker.id)) : 0;
    const newLockers = Array.from({ length: lockerFormData.count }, (_, index) => ({
      id: currentHighestId + index + 1,
      size: lockerFormData.size,
      status: 'available' as const
    }));

    setLockers([...lockers, ...newLockers]);
    setShowAddLockerDialog(false);
    setLockerFormData({ count: 1, size: 'small' });
    
    toast({
      title: "Lockers Added",
      description: `${lockerFormData.count} new ${lockerFormData.size} lockers have been added.`,
    });
  };

  const handleRemoveLocker = (lockerId: number) => {
    setLockers(lockers.filter(locker => locker.id !== lockerId));
    toast({
      title: "Locker Removed",
      description: `Locker #${lockerId} has been removed.`,
    });
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
              <CardTitle className="text-lg">Occupied</CardTitle>
              <CardDescription>Lockers in use</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">
                {lockers.filter(locker => locker.status === 'occupied').length}
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
                    <CardTitle>Lockers</CardTitle>
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
                  {lockers.length > 0 ? (
                    <LockerMap 
                      lockers={lockers} 
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
                        You haven't added any lockers yet.
                      </p>
                      <Button onClick={() => setShowAddLockerDialog(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Lockers
                      </Button>
                    </div>
                  )}
                  
                  {lockers.length > 0 && (
                    <div className="bg-muted p-4 rounded-md">
                      <h3 className="font-medium mb-2">Locker Distribution:</h3>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                          <span>Small Lockers:</span>
                          <span>{lockers.filter(l => l.size === 'small').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Medium Lockers:</span>
                          <span>{lockers.filter(l => l.size === 'medium').length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Large Lockers:</span>
                          <span>{lockers.filter(l => l.size === 'large').length}</span>
                        </div>
                      </div>
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

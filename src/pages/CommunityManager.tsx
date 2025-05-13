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
import { Package, User, Lock, Plus, Trash, Edit, UserPlus, Check, X, Minus, PackageOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import LockerMap, { PackageDetails } from '@/components/LockerMap';
import LockerGrid from '@/components/LockerGrid';
import { lockers as mockLockers } from '@/lib/mockData';

// Define consistent interfaces
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
  phone?: string;
  apartment?: string;
}

// Updated resident interface with pending approval status
interface Resident {
  id: string;
  name: string;
  email: string;
  phone: string;
  apartment: string;
  communityId: string;
  status: 'pending' | 'approved' | 'rejected';
  role: 'resident';
}

// Updated Locker interface with systemId and fixed status type to match mockData
interface Locker {
  id: number;
  systemId: number;
  size: 'small' | 'medium' | 'large';
  status: 'available' | 'occupied';
}

// Interface for the locker system
interface LockerSystem {
  id: number;
  name: string;
  location: string;
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
  
  // Pending residents awaiting approval
  const [pendingResidents, setPendingResidents] = useState<Resident[]>([
    { 
      id: 'res1', 
      name: 'John Resident', 
      email: 'john@example.com',
      phone: '555-1234',
      apartment: 'A101',
      communityId: 'c1',
      status: 'pending',
      role: 'resident'
    }
  ]);
  
  // Approved residents
  const [residents, setResidents] = useState<Resident[]>([
    { 
      id: 'res2', 
      name: 'Jane Resident', 
      email: 'jane@example.com',
      phone: '555-5678',
      apartment: 'B202',
      communityId: 'c1',
      status: 'approved',
      role: 'resident'
    }
  ]);
  
  // Locker systems state
  const [lockerSystems, setLockerSystems] = useState<LockerSystem[]>([
    { id: 1, name: 'Main Building', location: 'Lobby' }
  ]);
  
  // Currently selected locker system for viewing
  const [selectedSystemId, setSelectedSystemId] = useState<number>(1);

  // Dialog states
  const [showAddLockerSystemDialog, setShowAddLockerSystemDialog] = useState(false);
  const [showRemoveLockerDialog, setShowRemoveLockerDialog] = useState(false);
  
  // System form data
  const [systemFormData, setSystemFormData] = useState({
    name: '',
    location: ''
  });

  // Package history state
  const [packageHistory, setPackageHistory] = useState<PackageDetails[]>([]);
  
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
          
          // We're now using mockLockers as default initial data
          // We need to convert mockLockers to match our Locker interface by adding systemId
          const convertedLockers: Locker[] = mockLockers.map(locker => ({
            ...locker,
            systemId: 1, // Assign all to default system ID
            status: locker.status as 'available' | 'occupied'
          }));
          setLockers(convertedLockers);
        }
        
        // Check if there's a pending resident registration to add
        if (parsedData.userType === 'resident') {
          const newResident: Resident = {
            id: `res${pendingResidents.length + residents.length + 1}`,
            name: parsedData.name,
            email: parsedData.email,
            phone: parsedData.phone || '',
            apartment: parsedData.apartment || '',
            communityId: parsedData.communityId,
            status: 'pending',
            role: 'resident'
          };
          
          // Check if this resident is already in our lists
          const existingPending = pendingResidents.find(r => r.email === parsedData.email);
          const existingApproved = residents.find(r => r.email === parsedData.email);
          
          if (!existingPending && !existingApproved) {
            setPendingResidents(prev => [...prev, newResident]);
            
            // Store the updated resident data
            localStorage.setItem('pendingResidents', JSON.stringify([...pendingResidents, newResident]));
            
            // Remove registration data to prevent duplicate additions
            localStorage.removeItem('registrationData');
          }
        }
      } catch (error) {
        console.error("Error parsing registration data", error);
      }
    }
    
    // Load pending residents from localStorage if available
    const savedPendingResidents = localStorage.getItem('pendingResidents');
    if (savedPendingResidents) {
      try {
        const parsedPendingResidents = JSON.parse(savedPendingResidents) as Resident[];
        setPendingResidents(parsedPendingResidents);
      } catch (error) {
        console.error("Error parsing pending residents", error);
      }
    }
    
    // Load approved residents from localStorage if available
    const savedResidents = localStorage.getItem('approvedResidents');
    if (savedResidents) {
      try {
        const parsedResidents = JSON.parse(savedResidents) as Resident[];
        setResidents(parsedResidents);
      } catch (error) {
        console.error("Error parsing approved residents", error);
      }
    }
  }, []);
  
  // Filter lockers by selected system
  const filteredLockers = lockers.filter(locker => locker.systemId === selectedSystemId);
  
  // States for staff management
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

  // Add the missing removeLockerFormData state
  const [removeLockerFormData, setRemoveLockerFormData] = useState({
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

  // Add the missing handler for remove locker form
  const handleRemoveLockerFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRemoveLockerFormData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleSystemFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSystemFormData(prev => ({ ...prev, [name]: value }));
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

  const handleAddLockerSystem = () => {
    // Validate required fields
    if (!systemFormData.name || !systemFormData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Get the next system ID
    const nextId = lockerSystems.length > 0 
      ? Math.max(...lockerSystems.map(system => system.id)) + 1 
      : 1;

    const newSystem: LockerSystem = {
      id: nextId,
      name: systemFormData.name,
      location: systemFormData.location
    };

    setLockerSystems([...lockerSystems, newSystem]);
    setSelectedSystemId(nextId); // Select the new system
    setShowAddLockerSystemDialog(false);
    setSystemFormData({ name: '', location: '' });

    toast({
      title: "Locker System Added",
      description: `${systemFormData.name} has been added. You can now add lockers to this system.`,
    });
  };

  const handleRemoveLocker = (lockerId: number) => {
    setLockers(lockers.filter(locker => locker.id !== lockerId));
    toast({
      title: "Locker Removed",
      description: `Locker #${lockerId} has been removed.`,
    });
  };

  const handleRemoveLockers = () => {
    const { count, size, systemId } = removeLockerFormData;
    
    // Filter to get lockers of the specified size and system
    const matchingLockers = lockers.filter(
      locker => locker.systemId === systemId && 
                locker.size === size && 
                locker.status === 'available'
    );
    
    // Check if there are enough lockers to remove
    if (matchingLockers.length < count) {
      toast({
        title: "Not Enough Lockers",
        description: `There are only ${matchingLockers.length} available ${size} lockers in this system.`,
        variant: "destructive",
      });
      return;
    }
    
    // Sort by ID so we remove the highest ID lockers first (assuming these were added last)
    const lockersToRemove = matchingLockers
      .sort((a, b) => b.id - a.id)
      .slice(0, count)
      .map(locker => locker.id);
    
    // Remove the lockers
    setLockers(prevLockers => prevLockers.filter(locker => !lockersToRemove.includes(locker.id)));
    
    setShowRemoveLockerDialog(false);
    
    toast({
      title: "Lockers Removed",
      description: `${count} ${size} lockers have been removed from ${lockerSystems.find(s => s.id === systemId)?.name}.`,
    });
  };

  // Handle resident approval
  const handleResidentApproval = (residentId: string, approved: boolean) => {
    // Find the resident
    const resident = pendingResidents.find(r => r.id === residentId);
    
    if (resident) {
      // Remove from pending list
      const updatedPending = pendingResidents.filter(r => r.id !== residentId);
      setPendingResidents(updatedPending);
      localStorage.setItem('pendingResidents', JSON.stringify(updatedPending));
      
      if (approved) {
        // Add to approved list
        const updatedResident = {...resident, status: 'approved' as const};
        const updatedResidents = [...residents, updatedResident];
        setResidents(updatedResidents);
        localStorage.setItem('approvedResidents', JSON.stringify(updatedResidents));
        
        toast({
          title: "Resident Approved",
          description: `${resident.name} has been approved and can now access the system.`,
        });
      } else {
        toast({
          title: "Resident Rejected",
          description: `${resident.name}'s registration has been rejected.`,
        });
      }
    }
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

  // Handle package storage with OTP generation
  const handlePackageStore = (lockerId: number, packageDetails: PackageDetails) => {
    // Update the locker with package details
    setLockers(prevLockers => 
      prevLockers.map(locker => 
        locker.id === lockerId 
          ? { ...locker, status: 'occupied', packageDetails } 
          : locker
      )
    );
    
    // Add to package history
    setPackageHistory(prev => [...prev, packageDetails]);
    
    toast({
      title: "Package Stored",
      description: `Package for ${packageDetails.recipientName} has been stored in locker #${lockerId}. OTP: ${packageDetails.otp}`,
    });
  };
  
  // Handle package retrieval
  const handlePackageRetrieve = (lockerId: number, retrievedBy: string) => {
    // Find the locker
    const locker = lockers.find(l => l.id === lockerId);
    if (!locker || !locker.packageDetails) return;
    
    // Update package details with retrieval information
    const updatedPackageDetails = {
      ...locker.packageDetails,
      retrievedBy,
      retrievedAt: new Date()
    };
    
    // Update package history
    setPackageHistory(prev => 
      prev.map(pkg => 
        pkg.id === locker.packageDetails?.id
          ? updatedPackageDetails
          : pkg
      )
    );
    
    // Mark locker as available again
    setLockers(prevLockers => 
      prevLockers.map(l => 
        l.id === lockerId 
          ? { ...l, status: 'available', packageDetails: undefined } 
          : l
      )
    );
    
    toast({
      title: "Package Retrieved",
      description: `Package has been successfully retrieved by ${retrievedBy}.`,
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
              <CardTitle className="text-lg">Residents</CardTitle>
              <CardDescription>Approved residents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{residents.length}</div>
              {pendingResidents.length > 0 && (
                <div className="text-sm text-amber-500 mt-1">
                  {pendingResidents.length} pending approval
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="lockers" className="mb-8">
          <TabsList>
            <TabsTrigger value="lockers">Locker Management</TabsTrigger>
            <TabsTrigger value="staff">Staff Management</TabsTrigger>
            <TabsTrigger value="residents">Resident Management</TabsTrigger>
            <TabsTrigger value="packages">Package History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="lockers">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Locker Systems</CardTitle>
                    <CardDescription>Manage all lockers in the community</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setShowAddLockerSystemDialog(true)} variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Locker System
                    </Button>
                    <Button onClick={() => setShowAddLockerDialog(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Lockers
                    </Button>
                    <Button 
                      onClick={() => {
                        setRemoveLockerFormData(prev => ({ ...prev, systemId: selectedSystemId }));
                        setShowRemoveLockerDialog(true);
                      }} 
                      variant="outline" 
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Minus className="mr-2 h-4 w-4" />
                      Remove Lockers
                    </Button>
                  </div>
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
                      
                      <LockerGrid 
                        lockers={lockers}
                        lockerSystems={lockerSystems}
                        selectedSystemId={selectedSystemId}
                        onAddLockers={(count, size, systemId) => {
                          setLockerFormData({ count, size, systemId });
                          handleAddLockers();
                        }}
                        onRemoveLockers={(count, size, systemId) => {
                          setRemoveLockerFormData({ count, size, systemId });
                          handleRemoveLockers();
                        }}
                        onRemoveSingleLocker={handleRemoveLocker}
                        onPackageStore={handlePackageStore}
                        onPackageRetrieve={handlePackageRetrieve}
                        currentUser={{ name: manager.name, role: manager.role }}
                      />
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
          
          <TabsContent value="residents">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Resident Management</CardTitle>
                    <CardDescription>Approve or reject resident registrations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Pending Residents Section */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Pending Approval</h3>
                  {pendingResidents.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Apartment</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingResidents.map(resident => (
                          <TableRow key={resident.id}>
                            <TableCell className="font-medium">{resident.name}</TableCell>
                            <TableCell>{resident.email}</TableCell>
                            <TableCell>{resident.phone}</TableCell>
                            <TableCell>{resident.apartment}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-green-500 text-green-500 hover:bg-green-50"
                                onClick={() => handleResidentApproval(resident.id, true)}
                              >
                                <Check className="h-4 w-4 mr-1" /> Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-red-500 text-red-500 hover:bg-red-50"
                                onClick={() => handleResidentApproval(resident.id, false)}
                              >
                                <X className="h-4 w-4 mr-1" /> Reject
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-4 bg-muted/30 rounded-md">
                      <p className="text-muted-foreground">No pending resident applications</p>
                    </div>
                  )}
                </div>
                
                {/* Approved Residents Section */}
                <div>
                  <h3 className="text-lg font-medium mb-2">Approved Residents</h3>
                  {residents.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Apartment</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {residents.map(resident => (
                          <TableRow key={resident.id}>
                            <TableCell className="font-medium">{resident.name}</TableCell>
                            <TableCell>{resident.email}</TableCell>
                            <TableCell>{resident.phone}</TableCell>
                            <TableCell>{resident.apartment}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-4 bg-muted/30 rounded-md">
                      <p className="text-muted-foreground">No approved residents yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="packages">
            <Card>
              <CardHeader>
                <CardTitle>Package History</CardTitle>
                <CardDescription>Track all package activity in the community</CardDescription>
              </CardHeader>
              <CardContent>
                {packageHistory.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Package ID</TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Product ID</TableHead>
                        <TableHead>Placed By</TableHead>
                        <TableHead>Placed At</TableHead>
                        <TableHead>Retrieved By</TableHead>
                        <TableHead>Retrieved At</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {packageHistory.map(pkg => (
                        <TableRow key={pkg.id}>
                          <TableCell className="font-mono">{pkg.id}</TableCell>
                          <TableCell>{pkg.recipientName}</TableCell>
                          <TableCell>{pkg.productId}</TableCell>
                          <TableCell>{pkg.placedBy}</TableCell>
                          <TableCell>{format(new Date(pkg.placedAt), 'MMM d, h:mm a')}</TableCell>
                          <TableCell>{pkg.retrievedBy || '-'}</TableCell>
                          <TableCell>
                            {pkg.retrievedAt 
                              ? format(new Date(pkg.retrievedAt), 'MMM d, h:mm a')
                              : '-'
                            }
                          </TableCell>
                          <TableCell>
                            {pkg.retrievedAt 
                              ? <Badge variant="outline" className="bg-green-50 text-green-700">Retrieved</Badge>
                              : <Badge variant="outline" className="bg-blue-50 text-blue-700">Stored</Badge>
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <PackageOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Package History</h3>
                    <p className="text-muted-foreground">
                      When packages are stored or retrieved, they will appear here.
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

      {/* Add Locker System Dialog */}
      <Dialog open={showAddLockerSystemDialog} onOpenChange={setShowAddLockerSystemDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Locker System</DialogTitle>
            <DialogDescription>
              Create a new locker system location for your community.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">System Name</Label>
              <Input
                id="name"
                name="name"
                value={systemFormData.name}
                onChange={handleSystemFormChange}
                placeholder="e.g., Main Building, Pool House, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={systemFormData.location}
                onChange={handleSystemFormChange}
                placeholder="e.g., Lobby, North Entrance, etc."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddLockerSystemDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLockerSystem} disabled={!systemFormData.name || !systemFormData.location}>
              Add System
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Remove Lockers Dialog */}
      <Dialog open={showRemoveLockerDialog} onOpenChange={setShowRemoveLockerDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Lockers</DialogTitle>
            <DialogDescription>
              Remove lockers from your community.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="remove-systemId">Locker System</Label>
              <Select 
                value={removeLockerFormData.systemId.toString()}
                onValueChange={(value) => setRemoveLockerFormData(prev => ({ ...prev, systemId: parseInt(value) }))}
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
              <Label htmlFor="remove-count">Number of Lockers to Remove</Label>
              <Input
                id="remove-count"
                name="count"
                type="number"
                min="1"
                value={removeLockerFormData.count}
                onChange={handleRemoveLockerFormChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remove-size">Locker Size</Label>
              <Select 
                value={removeLockerFormData.size} 
                onValueChange={(value) => setRemoveLockerFormData(prev => ({ ...prev, size: value as any }))}
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
              <p className="text-xs text-muted-foreground mt-1">
                Only available lockers can be removed. Occupied lockers must be freed first.
              </p>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <h3 className="text-sm font-medium mb-2">Available Lockers:</h3>
              {removeLockerFormData.systemId && (
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span>Small:</span>
                    <span>{lockers.filter(l => l.systemId === removeLockerFormData.systemId && 
                                              l.size === 'small' && 
                                              l.status === 'available').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medium:</span>
                    <span>{lockers.filter(l => l.systemId === removeLockerFormData.systemId && 
                                              l.size === 'medium' && 
                                              l.status === 'available').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Large:</span>
                    <span>{lockers.filter(l => l.systemId === removeLockerFormData.systemId && 
                                              l.size === 'large' && 
                                              l.status === 'available').length}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowRemoveLockerDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRemoveLockers}
              variant="destructive"
              disabled={removeLockerFormData.count < 1}
            >
              Remove Lockers
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunityManager;

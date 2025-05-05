
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, User, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import PackageCard from '@/components/PackageCard';
import LockerMap from '@/components/LockerMap';
import { packages, users, lockers, getAvailableLockers } from '@/lib/mockData';

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock admin data
  const [admin] = useState({
    id: 'u3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
  });
  
  // States
  const [allPackages, setAllPackages] = useState([...packages]);
  const [allLockers, setAllLockers] = useState([...lockers]);
  const [showNewPackageDialog, setShowNewPackageDialog] = useState(false);
  const [showAssignLockerDialog, setShowAssignLockerDialog] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [selectedLocker, setSelectedLocker] = useState<number | null>(null);
  
  // New package form state
  const [newPackage, setNewPackage] = useState({
    trackingNumber: '',
    recipient: '',
    recipientId: '',
    courier: '',
    description: '',
    size: 'small',
  });
  
  // Filter packages by status
  const pendingPackages = allPackages.filter(pkg => pkg.status === 'pending');
  const deliveredPackages = allPackages.filter(pkg => pkg.status === 'delivered');
  const collectedPackages = allPackages.filter(pkg => pkg.status === 'collected');
  
  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate('/');
  };
  
  const handleAssignLocker = (packageId: string) => {
    const pkg = allPackages.find(p => p.id === packageId);
    setSelectedPackage(pkg);
    setShowAssignLockerDialog(true);
  };
  
  const handleLockerSelect = (lockerId: number) => {
    setSelectedLocker(lockerId);
  };
  
  const handleConfirmAssignment = () => {
    if (!selectedPackage || selectedLocker === null) return;
    
    // Update package status and assign locker
    const updatedPackages = allPackages.map(pkg => 
      pkg.id === selectedPackage.id 
        ? { 
            ...pkg, 
            status: 'delivered' as const, // Fix the type issue by using 'as const'
            lockerNumber: selectedLocker,
            deliveredAt: new Date()
          } 
        : pkg
    );
    
    // Update locker status
    const updatedLockers = allLockers.map(locker => 
      locker.id === selectedLocker 
        ? { 
            ...locker, 
            status: 'occupied' as const, // Fix the type issue by using 'as const'
            packageId: selectedPackage.id 
          } 
        : locker
    );
    
    setAllPackages(updatedPackages);
    setAllLockers(updatedLockers);
    
    setShowAssignLockerDialog(false);
    setSelectedLocker(null);
    setSelectedPackage(null);
    
    toast({
      title: "Package Assigned",
      description: `Package has been assigned to locker #${selectedLocker}.`,
    });
  };
  
  const handleNewPackageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPackage(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSizeChange = (value: string) => {
    setNewPackage(prev => ({ ...prev, size: value }));
  };
  
  const handleRecipientChange = (value: string) => {
    const recipient = users.find(u => u.id === value);
    if (recipient) {
      setNewPackage(prev => ({ 
        ...prev, 
        recipientId: value,
        recipient: recipient.name
      }));
    }
  };
  
  const handleAddPackage = () => {
    const newPackageObj = {
      id: `p${allPackages.length + 1}`,
      trackingNumber: newPackage.trackingNumber,
      recipient: newPackage.recipient,
      recipientId: newPackage.recipientId,
      courier: newPackage.courier,
      description: newPackage.description,
      status: 'pending' as const, // Fix the type issue by using 'as const'
      size: newPackage.size as 'small' | 'medium' | 'large',
    };
    
    setAllPackages([newPackageObj, ...allPackages]);
    setShowNewPackageDialog(false);
    
    // Reset form
    setNewPackage({
      trackingNumber: '',
      recipient: '',
      recipientId: '',
      courier: '',
      description: '',
      size: 'small',
    });
    
    toast({
      title: "Package Added",
      description: "The new package has been added successfully.",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        user={{ name: admin.name, role: admin.role }}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 container px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage packages and lockers
            </p>
          </div>
          <Button onClick={() => setShowNewPackageDialog(true)}>
            <Package className="mr-2 h-4 w-4" />
            Add New Package
          </Button>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending</CardTitle>
              <CardDescription>Packages waiting to be delivered</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500">{pendingPackages.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">In Lockers</CardTitle>
              <CardDescription>Packages in the lockers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{deliveredPackages.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Collected</CardTitle>
              <CardDescription>Collected packages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{collectedPackages.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Available Lockers</CardTitle>
              <CardDescription>Empty lockers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {allLockers.filter(locker => locker.status === 'available').length}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Locker Map */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Locker Status</CardTitle>
            <CardDescription>
              View and manage locker availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LockerMap lockers={allLockers} />
          </CardContent>
        </Card>
        
        {/* Packages Tab View */}
        <Card>
          <CardHeader>
            <CardTitle>Package Management</CardTitle>
            <CardDescription>
              View and manage all packages in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="pending">
                  Pending 
                  {pendingPackages.length > 0 && (
                    <span className="ml-2 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {pendingPackages.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="delivered">
                  In Lockers
                  {deliveredPackages.length > 0 && (
                    <span className="ml-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {deliveredPackages.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="collected">Collected</TabsTrigger>
                <TabsTrigger value="all">All Packages</TabsTrigger>
              </TabsList>
              
              {/* Pending Packages Tab */}
              <TabsContent value="pending">
                {pendingPackages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {pendingPackages.map(pkg => (
                      <PackageCard
                        key={pkg.id}
                        packageData={pkg}
                        onAssignLocker={handleAssignLocker}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Pending Packages</h3>
                    <p className="text-muted-foreground mb-6">
                      There are no packages waiting to be assigned to lockers.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              {/* In Lockers Tab */}
              <TabsContent value="delivered">
                {deliveredPackages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {deliveredPackages.map(pkg => (
                      <PackageCard
                        key={pkg.id}
                        packageData={pkg}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Packages In Lockers</h3>
                    <p className="text-muted-foreground mb-6">
                      There are no packages currently stored in lockers.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              {/* Collected Tab */}
              <TabsContent value="collected">
                {collectedPackages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {collectedPackages.map(pkg => (
                      <PackageCard
                        key={pkg.id}
                        packageData={pkg}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Collected Packages</h3>
                    <p className="text-muted-foreground mb-6">
                      No packages have been collected yet.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              {/* All Packages Tab */}
              <TabsContent value="all">
                {allPackages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {allPackages.map(pkg => (
                      <PackageCard
                        key={pkg.id}
                        packageData={pkg}
                        onAssignLocker={pkg.status === 'pending' ? handleAssignLocker : undefined}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Packages</h3>
                    <p className="text-muted-foreground mb-6">
                      There are no packages in the system.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* New Package Dialog */}
        <Dialog open={showNewPackageDialog} onOpenChange={setShowNewPackageDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Package</DialogTitle>
              <DialogDescription>
                Enter the details of the new package.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trackingNumber">Tracking Number</Label>
                  <Input
                    id="trackingNumber"
                    name="trackingNumber"
                    value={newPackage.trackingNumber}
                    onChange={handleNewPackageChange}
                    placeholder="Enter tracking number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient</Label>
                  <Select onValueChange={handleRecipientChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.filter(u => u.role === 'user').map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} {user.apartment ? `(${user.apartment})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="courier">Courier</Label>
                  <Input
                    id="courier"
                    name="courier"
                    value={newPackage.courier}
                    onChange={handleNewPackageChange}
                    placeholder="Enter courier name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    name="description"
                    value={newPackage.description}
                    onChange={handleNewPackageChange}
                    placeholder="Enter package description"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="size">Package Size</Label>
                  <Select defaultValue="small" onValueChange={handleSizeChange}>
                    <SelectTrigger id="size">
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
                <Button variant="outline" onClick={() => setShowNewPackageDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPackage}>
                  Add Package
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Assign Locker Dialog */}
        <Dialog open={showAssignLockerDialog} onOpenChange={setShowAssignLockerDialog}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Assign Locker</DialogTitle>
              <DialogDescription>
                Select an available locker for this package.
              </DialogDescription>
            </DialogHeader>
            {selectedPackage && (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Package Details:</h3>
                  <p><span className="text-muted-foreground">Tracking:</span> {selectedPackage.trackingNumber}</p>
                  <p><span className="text-muted-foreground">Recipient:</span> {selectedPackage.recipient}</p>
                  <p><span className="text-muted-foreground">Size:</span> {selectedPackage.size}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Select a Locker:</h3>
                  <div className="border rounded-md overflow-hidden">
                    <LockerMap 
                      lockers={allLockers.filter(locker => 
                        locker.status === 'available' && locker.size === selectedPackage.size
                      )}
                      onLockerSelect={handleLockerSelect}
                      selectedLockerId={selectedLocker}
                    />
                  </div>
                  {allLockers.filter(locker => 
                    locker.status === 'available' && locker.size === selectedPackage.size
                  ).length === 0 && (
                    <p className="text-destructive text-sm">
                      No lockers of this size ({selectedPackage.size}) are currently available.
                    </p>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => {
                    setShowAssignLockerDialog(false);
                    setSelectedLocker(null);
                  }}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleConfirmAssignment}
                    disabled={selectedLocker === null}
                  >
                    Confirm Assignment
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Admin;

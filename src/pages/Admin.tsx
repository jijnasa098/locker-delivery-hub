
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Box, LogOut, User, Building, Check, X } from 'lucide-react';
import Navbar from '@/components/Navbar';

// Mock data
const mockLockerSystems = [
  { id: 1, name: 'Main Building', location: 'Lobby', communityId: 'COM001' },
  { id: 2, name: 'Residence Hall', location: 'First Floor', communityId: 'COM001' },
  { id: 3, name: 'Gym', location: 'Entrance', communityId: 'COM001' }
];

const mockLockers = [
  { id: 1, systemId: 1, size: 'small', status: 'available', row: 0, column: 0 },
  { id: 2, systemId: 1, size: 'medium', status: 'available', row: 0, column: 1 },
  { id: 3, systemId: 1, size: 'large', status: 'available', row: 0, column: 2 },
  { id: 4, systemId: 2, size: 'small', status: 'available', row: 0, column: 0 },
  { id: 5, systemId: 2, size: 'medium', status: 'available', row: 0, column: 1 }
];

const mockPendingResidents = [
  { id: 1, username: 'john_doe', blockNumber: 'A-101', phoneNumber: '9876543210', status: 'pending', communityId: 'COM001' },
  { id: 2, username: 'jane_smith', blockNumber: 'B-205', phoneNumber: '9876543211', status: 'pending', communityId: 'COM001' }
];

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const Staff = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSystemId, setSelectedSystemId] = useState<number | null>(null);
  const [availableLockers, setAvailableLockers] = useState<any[]>([]);
  const [showStorePackageDialog, setShowStorePackageDialog] = useState(false);
  const [pendingResidents, setPendingResidents] = useState(mockPendingResidents);
  
  // Package details state
  const [packageDetails, setPackageDetails] = useState({
    recipientPhone: '',
    recipientName: '',
    trackingNumber: '',
    size: 'small',
    carrier: '',
    comments: ''
  });
  
  // Selected locker for storage
  const [selectedLockerId, setSelectedLockerId] = useState<number | null>(null);
  
  // Generated OTP
  const [generatedOTP, setGeneratedOTP] = useState<string | null>(null);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  
  // Staff info
  const [user] = useState({
    name: 'Staff User',
    role: 'staff'
  });

  // Effect to filter available lockers when system changes
  useEffect(() => {
    if (selectedSystemId) {
      const filtered = mockLockers.filter(
        locker => locker.systemId === selectedSystemId && locker.status === 'available'
      );
      setAvailableLockers(filtered);
    } else {
      setAvailableLockers([]);
    }
  }, [selectedSystemId]);

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully."
    });
    navigate('/');
  };

  const handleStorePackage = () => {
    // Validate form fields
    if (!packageDetails.recipientPhone || !packageDetails.recipientName || !selectedLockerId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a locker.",
        variant: "destructive"
      });
      return;
    }
    
    // Generate OTP
    const otp = generateOTP();
    setGeneratedOTP(otp);
    
    // Close store dialog and open OTP dialog
    setShowStorePackageDialog(false);
    setShowOTPDialog(true);
    
    // In a real app, we would update the locker status in the database
    // and send an SMS notification with the OTP to the recipient
  };

  const handleAcceptResident = (residentId: number) => {
    setPendingResidents(pendingResidents.filter(resident => resident.id !== residentId));
    toast({
      title: "Resident Approved",
      description: "The resident has been approved successfully."
    });
  };
  
  const handleRejectResident = (residentId: number) => {
    setPendingResidents(pendingResidents.filter(resident => resident.id !== residentId));
    toast({
      title: "Resident Rejected",
      description: "The resident has been rejected."
    });
  };

  const handleCloseOTPDialog = () => {
    setShowOTPDialog(false);
    setGeneratedOTP(null);
    setSelectedLockerId(null);
    
    // Reset package details form
    setPackageDetails({
      recipientPhone: '',
      recipientName: '',
      trackingNumber: '',
      size: 'small',
      carrier: '',
      comments: ''
    });
    
    toast({
      title: "Package Stored",
      description: "The package has been stored successfully and an OTP has been sent to the recipient."
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="flex-1 container px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Staff Dashboard</h1>
        
        <Tabs defaultValue="packages" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="packages" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Package Management</span>
            </TabsTrigger>
            <TabsTrigger value="residents" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Resident Requests</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Package Management Tab */}
          <TabsContent value="packages">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Locker Systems List */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Locker Systems</CardTitle>
                  <CardDescription>Select a locker system to manage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockLockerSystems.map(system => (
                    <div 
                      key={system.id}
                      className={`p-4 rounded-lg cursor-pointer transition ${
                        selectedSystemId === system.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-card hover:bg-muted'
                      }`}
                      onClick={() => setSelectedSystemId(system.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5" />
                        <div>
                          <h3 className="font-medium">{system.name}</h3>
                          <p className="text-sm opacity-80">{system.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              {/* Available Lockers */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Available Lockers</CardTitle>
                      <CardDescription>
                        {selectedSystemId 
                          ? `${mockLockerSystems.find(s => s.id === selectedSystemId)?.name} - ${availableLockers.length} lockers available`
                          : 'Select a locker system to view available lockers'}
                      </CardDescription>
                    </div>
                    
                    {selectedSystemId && (
                      <Button onClick={() => setShowStorePackageDialog(true)}>
                        <Box className="mr-2 h-4 w-4" />
                        Store Package
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {!selectedSystemId ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Building className="mx-auto h-12 w-12 mb-4 opacity-30" />
                      <p>Select a locker system from the left to view available lockers</p>
                    </div>
                  ) : availableLockers.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Package className="mx-auto h-12 w-12 mb-4 opacity-30" />
                      <p>No available lockers in this system</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {availableLockers.map(locker => (
                        <div 
                          key={locker.id}
                          className={`border rounded-lg p-3 text-center cursor-pointer transition ${
                            selectedLockerId === locker.id
                              ? 'border-primary bg-primary/10'
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedLockerId(locker.id)}
                        >
                          <div className="text-lg font-medium">#{locker.id}</div>
                          <Badge variant="outline" className="capitalize">
                            {locker.size}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Resident Requests Tab */}
          <TabsContent value="residents">
            <Card>
              <CardHeader>
                <CardTitle>Pending Resident Requests</CardTitle>
                <CardDescription>Approve or reject new resident registration requests</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingResidents.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <User className="mx-auto h-12 w-12 mb-4 opacity-30" />
                    <p>No pending resident requests</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted">
                          <th className="text-left py-3 px-4 text-muted-foreground">Username</th>
                          <th className="text-left py-3 px-4 text-muted-foreground">Block Number</th>
                          <th className="text-left py-3 px-4 text-muted-foreground">Phone</th>
                          <th className="text-right py-3 px-4 text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingResidents.map(resident => (
                          <tr key={resident.id} className="border-b">
                            <td className="py-4 px-4">{resident.username}</td>
                            <td className="py-4 px-4">{resident.blockNumber}</td>
                            <td className="py-4 px-4">{resident.phoneNumber}</td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-green-500 text-green-500 hover:bg-green-50"
                                  onClick={() => handleAcceptResident(resident.id)}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Accept
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-red-500 text-red-500 hover:bg-red-50"
                                  onClick={() => handleRejectResident(resident.id)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Store Package Dialog */}
      <Dialog open={showStorePackageDialog} onOpenChange={setShowStorePackageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Store New Package</DialogTitle>
            <DialogDescription>
              Enter package details and select a locker to store the package.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="recipientPhone">Recipient Phone *</Label>
              <Input
                id="recipientPhone"
                placeholder="9876543210"
                value={packageDetails.recipientPhone}
                onChange={(e) => setPackageDetails({...packageDetails, recipientPhone: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="recipientName">Recipient Name *</Label>
              <Input
                id="recipientName"
                placeholder="John Doe"
                value={packageDetails.recipientName}
                onChange={(e) => setPackageDetails({...packageDetails, recipientName: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="trackingNumber">Tracking Number</Label>
              <Input
                id="trackingNumber"
                placeholder="ABC123456789"
                value={packageDetails.trackingNumber}
                onChange={(e) => setPackageDetails({...packageDetails, trackingNumber: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="packageSize">Package Size</Label>
              <Select 
                value={packageDetails.size}
                onValueChange={(value) => setPackageDetails({...packageDetails, size: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select package size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="carrier">Carrier (Optional)</Label>
              <Input
                id="carrier"
                placeholder="FedEx, UPS, etc."
                value={packageDetails.carrier}
                onChange={(e) => setPackageDetails({...packageDetails, carrier: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="comments">Comments (Optional)</Label>
              <Input
                id="comments"
                placeholder="Any special instructions"
                value={packageDetails.comments}
                onChange={(e) => setPackageDetails({...packageDetails, comments: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Selected Locker</Label>
              {selectedLockerId ? (
                <div className="p-2 border rounded-md bg-muted">
                  Locker #{selectedLockerId} in {mockLockerSystems.find(s => s.id === selectedSystemId)?.name}
                </div>
              ) : (
                <div className="p-2 border rounded-md text-muted-foreground">
                  No locker selected. Please select a locker from the available lockers.
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStorePackageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleStorePackage} disabled={!selectedLockerId}>
              Store Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* OTP Dialog */}
      <Dialog open={showOTPDialog} onOpenChange={setShowOTPDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Package Stored Successfully</DialogTitle>
            <DialogDescription>
              The package for {packageDetails.recipientName} has been stored in Locker #{selectedLockerId}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <div className="bg-muted rounded-lg p-6 text-center">
              <h3 className="text-sm font-medium mb-2">Collection OTP</h3>
              <p className="text-3xl font-bold tracking-wider">{generatedOTP}</p>
              <p className="text-sm text-muted-foreground mt-2">
                This OTP has been sent to the recipient's phone number.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={handleCloseOTPDialog}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Staff;

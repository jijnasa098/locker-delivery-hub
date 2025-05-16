
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, User, Bell, Phone } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import Navbar from '@/components/Navbar';
import PackageCard from '@/components/PackageCard';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { getUserPackages, packages as allPackages } from '@/lib/mockData';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock user data - in a real app this would come from authentication
  const [user] = useState({
    id: 'u1',
    name: 'John Doe',
    username: 'resident',
    phone: '9876543210',
    role: 'resident',
    apartment: 'A201',
    blockNumber: 'A-101',
  });
  
  const [showQRCode, setShowQRCode] = useState(false);
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [enteredOTP, setEnteredOTP] = useState("");
  
  // Get user packages based on user phone number
  const userPackages = allPackages.filter(pkg => pkg.recipientPhone === user.phone);
  
  // Filter packages by status
  const pendingPackages = userPackages.filter(pkg => pkg.status === 'pending');
  const deliveredPackages = userPackages.filter(pkg => pkg.status === 'delivered');
  const collectedPackages = userPackages.filter(pkg => pkg.status === 'collected');
  
  const handleCollectPackage = (packageId: string) => {
    setSelectedPackage(userPackages.find(pkg => pkg.id === packageId));
    setShowOTPDialog(true);
  };
  
  const handleVerifyOTP = () => {
    if (selectedPackage && selectedPackage.otp === enteredOTP) {
      setShowOTPDialog(false);
      setShowQRCode(true);
    } else {
      toast({
        title: "Invalid OTP",
        description: "The OTP you entered is incorrect. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleCollectComplete = () => {
    setShowQRCode(false);
    setEnteredOTP("");
    toast({
      title: "Package Collected",
      description: "You have successfully collected your package.",
    });
  };
  
  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate('/');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        user={{ name: user.name, role: user.role }}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">
            Manage your deliveries and track your packages
          </p>
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 mr-1" /> 
            <span>{user.phone}</span>
            <span className="mx-2">•</span>
            <span>Block: {user.blockNumber}</span>
          </div>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
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
              <CardTitle className="text-lg">Ready for Collection</CardTitle>
              <CardDescription>Packages in the lockers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{deliveredPackages.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Collected</CardTitle>
              <CardDescription>Your collected packages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">{collectedPackages.length}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Packages Tab View */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="all">All Packages</TabsTrigger>
            <TabsTrigger value="delivered">
              Ready for Collection 
              {deliveredPackages.length > 0 && (
                <span className="ml-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {deliveredPackages.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          {/* All Packages Tab */}
          <TabsContent value="all">
            {userPackages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userPackages.map(pkg => (
                  <PackageCard
                    key={pkg.id}
                    packageData={pkg}
                    onCollect={pkg.status === 'delivered' ? handleCollectPackage : undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No Packages</h3>
                <p className="text-muted-foreground mb-6">
                  You don't have any packages in the system yet.
                </p>
              </div>
            )}
          </TabsContent>
          
          {/* Ready for Collection Tab */}
          <TabsContent value="delivered">
            {deliveredPackages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deliveredPackages.map(pkg => (
                  <PackageCard
                    key={pkg.id}
                    packageData={pkg}
                    onCollect={handleCollectPackage}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No Packages Ready</h3>
                <p className="text-muted-foreground mb-6">
                  You don't have any packages ready for collection.
                </p>
              </div>
            )}
          </TabsContent>
          
          {/* History Tab */}
          <TabsContent value="history">
            {collectedPackages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <h3 className="text-xl font-medium mb-2">No History</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't collected any packages yet.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* OTP Verification Dialog */}
        <Dialog open={showOTPDialog} onOpenChange={setShowOTPDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Enter Collection OTP</DialogTitle>
              <DialogDescription>
                Please enter the OTP sent to your phone to collect your package.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center py-4">
              <InputOTP maxLength={6} value={enteredOTP} onChange={setEnteredOTP}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button className="w-full" onClick={handleVerifyOTP}>
              Verify OTP
            </Button>
          </DialogContent>
        </Dialog>
        
        {/* QR Code Dialog */}
        <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Package Collection</DialogTitle>
              <DialogDescription>
                Show this QR code to the locker system to collect your package.
              </DialogDescription>
            </DialogHeader>
            {selectedPackage && (
              <QRCodeGenerator
                packageData={selectedPackage}
                onClose={() => setShowQRCode(false)}
              />
            )}
            <Button className="w-full" onClick={handleCollectComplete}>
              Complete Collection
            </Button>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Dashboard;

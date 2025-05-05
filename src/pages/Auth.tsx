import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, User, Building, Plus, Trash } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { users } from '@/lib/mockData';

// Define interface for locker system
interface LockerSystem {
  id: number;
  name: string;
  location: string;
  lockers: {
    small: number;
    medium: number;
    large: number;
  };
}

const Auth = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('mode') || 'login';
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [communityId, setCommunityId] = useState('');
  const [name, setName] = useState('');
  const [apartment, setApartment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('resident');
  
  // Updated to handle multiple locker systems
  const [lockerSystems, setLockerSystems] = useState<LockerSystem[]>([{
    id: 1,
    name: 'Main Building',
    location: 'Lobby',
    lockers: {
      small: 5,
      medium: 3,
      large: 2
    }
  }]);
  
  // Function to add a new locker system
  const addLockerSystem = () => {
    const newId = lockerSystems.length > 0 ? Math.max(...lockerSystems.map(ls => ls.id)) + 1 : 1;
    setLockerSystems([...lockerSystems, {
      id: newId,
      name: `Locker System ${newId}`,
      location: '',
      lockers: {
        small: 5,
        medium: 3,
        large: 2
      }
    }]);
  };
  
  // Function to remove a locker system
  const removeLockerSystem = (id: number) => {
    // Don't allow removing the last locker system
    if (lockerSystems.length <= 1) {
      toast({
        title: "Cannot Remove",
        description: "You need at least one locker system.",
        variant: "destructive",
      });
      return;
    }
    setLockerSystems(lockerSystems.filter(ls => ls.id !== id));
  };
  
  // Function to update locker system details
  const updateLockerSystem = (id: number, field: string, value: string) => {
    setLockerSystems(lockerSystems.map(ls => 
      ls.id === id ? { ...ls, [field]: value } : ls
    ));
  };
  
  // Function to update locker counts within a system
  const updateLockerCount = (systemId: number, size: 'small' | 'medium' | 'large', value: string) => {
    const numValue = parseInt(value) || 0;
    setLockerSystems(lockerSystems.map(ls => 
      ls.id === systemId ? { 
        ...ls, 
        lockers: { 
          ...ls.lockers, 
          [size]: numValue 
        } 
      } : ls
    ));
  };
  
  // Calculate total locker count
  const totalLockerCount = lockerSystems.reduce((total, system) => {
    const { small, medium, large } = system.lockers;
    return total + small + medium + large;
  }, 0);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login - in a real app this would call an API
    setTimeout(() => {
      const user = users.find(user => user.email === email);
      
      if (user && communityId) {
        // In a real app, we would verify the password and communityId
        if (email === 'admin@example.com') {
          toast({
            title: "Logged in as Admin",
            description: "You have been logged in as an administrator.",
          });
          navigate('/admin');
        } else if (email === 'manager@example.com') {
          toast({
            title: "Logged in as Community Manager",
            description: "You have been logged in as a community manager.",
          });
          navigate('/community-manager');
        } else if (userType === 'staff') {
          toast({
            title: "Logged in as Staff",
            description: "You have been logged in as a staff member.",
          });
          navigate('/community-manager'); // Staff currently goes to same page as manager
        } else {
          toast({
            title: "Login Successful",
            description: "Welcome back to LockerHub!",
          });
          navigate('/dashboard');
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials or Community ID. Please try again.",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Updated registration data to include multiple locker systems
    const registrationData = {
      name,
      email,
      communityId,
      userType,
      apartment: userType === 'resident' ? apartment : '',
      ...(userType === 'manager' && {
        lockerSettings: {
          systems: lockerSystems.map(system => ({
            id: system.id,
            name: system.name,
            location: system.location,
            lockers: {
              small: system.lockers.small,
              medium: system.lockers.medium,
              large: system.lockers.large
            }
          })),
          totalLockers: totalLockerCount
        }
      })
    };
    
    console.log('Registration data:', registrationData);
    
    // Mock registration - in a real app this would call an API
    setTimeout(() => {
      // Store the registration data in localStorage so we can use it later
      localStorage.setItem('registrationData', JSON.stringify(registrationData));
      
      toast({
        title: "Registration Successful",
        description: userType === 'manager' 
          ? `Your community with ${totalLockerCount} lockers across ${lockerSystems.length} locker systems has been created.`
          : "Your account has been created. You can now log in.",
      });
      
      // If they're registering as a manager, navigate them to the community manager page
      if (userType === 'manager') {
        navigate('/community-manager');
      } else {
        // Otherwise, just switch to login tab
        setActiveTab('login');
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  // Demo account login
  const handleDemoLogin = (role) => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (role === 'user') {
        toast({
          title: "Demo User Login",
          description: "You have been logged in to the demo user account.",
        });
        navigate('/dashboard');
      } else if (role === 'admin') {
        toast({
          title: "Demo Admin Login",
          description: "You have been logged in as an administrator.",
        });
        navigate('/admin');
      } else if (role === 'manager') {
        toast({
          title: "Demo Manager Login",
          description: "You have been logged in as a community manager.",
        });
        navigate('/community-manager');
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center">
              <Package className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mt-4">Welcome to LockerHub</h1>
            <p className="text-muted-foreground mt-2">Secure package management made easy</p>
          </div>
          
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="communityId">Community ID</Label>
                      <Input 
                        id="communityId" 
                        placeholder="Enter your community ID"
                        value={communityId}
                        onChange={(e) => setCommunityId(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <a 
                          href="#" 
                          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                        >
                          Forgot password?
                        </a>
                      </div>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="loginType">Login As</Label>
                      <Select 
                        defaultValue="resident" 
                        onValueChange={(value) => setUserType(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="resident">Resident</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="manager">Community Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="w-full relative flex items-center justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-muted"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 w-full">
                    <Button variant="outline" onClick={() => handleDemoLogin('user')} disabled={isLoading}>
                      <User className="mr-2 h-4 w-4" />
                      Demo User
                    </Button>
                    <Button variant="outline" onClick={() => handleDemoLogin('admin')} disabled={isLoading}>
                      <User className="mr-2 h-4 w-4" />
                      Demo Admin
                    </Button>
                    <Button variant="outline" onClick={() => handleDemoLogin('manager')} disabled={isLoading}>
                      <Building className="mr-2 h-4 w-4" />
                      Manager
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Enter your information to create an account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-type">Register As</Label>
                      <Select 
                        defaultValue="resident"
                        onValueChange={(value) => setUserType(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="resident">Resident</SelectItem>
                          <SelectItem value="manager">Community Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {userType === 'manager' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="community-id">Community Name/ID</Label>
                          <Input 
                            id="community-id"
                            value={communityId}
                            onChange={(e) => setCommunityId(e.target.value)}
                            placeholder="E.g., Green Valley Apartments"
                            required
                          />
                        </div>
                        
                        <div className="border rounded-md p-4 bg-muted/20 space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-sm font-medium">Locker Systems Setup</h3>
                            <Button 
                              type="button" 
                              size="sm" 
                              variant="outline" 
                              onClick={addLockerSystem}
                            >
                              <Plus className="h-4 w-4 mr-1" /> Add System
                            </Button>
                          </div>
                          
                          <div className="space-y-6">
                            {lockerSystems.map((system) => (
                              <div key={system.id} className="border rounded p-3 space-y-3 bg-background">
                                <div className="flex justify-between items-center">
                                  <h4 className="font-medium">System #{system.id}</h4>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeLockerSystem(system.id)}
                                  >
                                    <Trash className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                                
                                <div className="space-y-3">
                                  <div>
                                    <Label htmlFor={`system-name-${system.id}`}>Name</Label>
                                    <Input 
                                      id={`system-name-${system.id}`}
                                      value={system.name}
                                      onChange={(e) => updateLockerSystem(system.id, 'name', e.target.value)}
                                      placeholder="System name"
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor={`system-location-${system.id}`}>Location</Label>
                                    <Input 
                                      id={`system-location-${system.id}`}
                                      value={system.location}
                                      onChange={(e) => updateLockerSystem(system.id, 'location', e.target.value)}
                                      placeholder="Where this locker system is located"
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label>Locker Distribution</Label>
                                    <div className="grid grid-cols-3 gap-3 mt-2">
                                      <div>
                                        <Label htmlFor={`small-lockers-${system.id}`} className="text-xs">Small</Label>
                                        <Input 
                                          id={`small-lockers-${system.id}`}
                                          type="number"
                                          min="0"
                                          value={system.lockers.small}
                                          onChange={(e) => updateLockerCount(system.id, 'small', e.target.value)}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor={`medium-lockers-${system.id}`} className="text-xs">Medium</Label>
                                        <Input 
                                          id={`medium-lockers-${system.id}`}
                                          type="number"
                                          min="0"
                                          value={system.lockers.medium}
                                          onChange={(e) => updateLockerCount(system.id, 'medium', e.target.value)}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor={`large-lockers-${system.id}`} className="text-xs">Large</Label>
                                        <Input 
                                          id={`large-lockers-${system.id}`}
                                          type="number"
                                          min="0"
                                          value={system.lockers.large}
                                          onChange={(e) => updateLockerCount(system.id, 'large', e.target.value)}
                                        />
                                      </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      System Total: {system.lockers.small + system.lockers.medium + system.lockers.large} lockers
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <p className="text-sm font-medium mt-2">
                            Total Lockers: {totalLockerCount}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input 
                        id="register-email" 
                        type="email" 
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input 
                        id="register-password" 
                        type="password" 
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    
                    {userType === 'resident' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="community-id-resident">Community ID</Label>
                          <Input 
                            id="community-id-resident"
                            value={communityId}
                            onChange={(e) => setCommunityId(e.target.value)}
                            placeholder="Enter your community ID"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="apartment">Apartment/Room Number</Label>
                          <Input 
                            id="apartment" 
                            placeholder="A201"
                            value={apartment}
                            onChange={(e) => setApartment(e.target.value)}
                            required
                          />
                        </div>
                      </>
                    )}
                    
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                    
                    <p className="text-center text-xs text-muted-foreground px-4">
                      By creating an account, you agree to our{" "}
                      <a href="#" className="underline underline-offset-4 hover:text-primary">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="underline underline-offset-4 hover:text-primary">
                        Privacy Policy
                      </a>.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Auth;

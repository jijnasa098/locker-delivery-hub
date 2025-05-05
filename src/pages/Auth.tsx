
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { users } from '@/lib/mockData';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('mode') || 'login';
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [apartment, setApartment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login - in a real app this would call an API
    setTimeout(() => {
      const user = users.find(user => user.email === email);
      
      if (user) {
        // In a real app, we would verify the password
        if (email === 'admin@example.com') {
          toast({
            title: "Logged in as Admin",
            description: "You have been logged in as an administrator.",
          });
          navigate('/admin');
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
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock registration - in a real app this would call an API
    setTimeout(() => {
      toast({
        title: "Registration Successful",
        description: "Your account has been created. You can now log in.",
      });
      
      setActiveTab('login');
      setIsLoading(false);
    }, 1000);
  };
  
  // Demo account login
  const handleDemoLogin = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      toast({
        title: "Demo Login",
        description: "You have been logged in to the demo account.",
      });
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };
  
  const handleDemoAdminLogin = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      toast({
        title: "Demo Admin Login",
        description: "You have been logged in as an administrator.",
      });
      navigate('/admin');
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
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <Button variant="outline" onClick={handleDemoLogin} disabled={isLoading}>
                      <User className="mr-2 h-4 w-4" />
                      Demo User
                    </Button>
                    <Button variant="outline" onClick={handleDemoAdminLogin} disabled={isLoading}>
                      <User className="mr-2 h-4 w-4" />
                      Demo Admin
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
                    <div className="space-y-2">
                      <Label htmlFor="apartment">Apartment/Room Number</Label>
                      <Input 
                        id="apartment" 
                        placeholder="A201"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                      />
                    </div>
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

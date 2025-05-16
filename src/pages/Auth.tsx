
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, Building, UserPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [communityId, setCommunityId] = useState('');
  const [userRole, setUserRole] = useState('resident');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!username || !password) {
      toast({
        title: "Login Failed",
        description: "Please provide both username and password.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!communityId) {
      toast({
        title: "Login Failed",
        description: "Please provide a community ID.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Demo login for different user roles
      if (userRole === "manager" && username === "manager" && password === "password") {
        toast({
          title: "Login Successful",
          description: "Welcome back to the Community Manager dashboard.",
        });
        navigate("/community-manager");
      } else if (userRole === "staff" && username === "staff" && password === "password") {
        toast({
          title: "Login Successful",
          description: "Welcome back to the Staff dashboard.",
        });
        navigate("/staff"); 
      } else if (userRole === "resident" && username === "resident" && password === "password") {
        toast({
          title: "Login Successful",
          description: `Welcome back to your Resident dashboard.`,
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
      setIsSubmitting(false);
    }, 1000);
  };

  const toggleDemo = () => {
    setShowDemo(!showDemo);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <div className="rounded-full bg-primary p-2">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">Login to your account</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userRole">User Type</Label>
                <Select 
                  value={userRole} 
                  onValueChange={setUserRole}
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
              
              <div className="space-y-2">
                <Label htmlFor="communityId">Community ID</Label>
                <Input 
                  id="communityId" 
                  type="text" 
                  placeholder="Enter your community ID" 
                  value={communityId}
                  onChange={(e) => setCommunityId(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Enter your username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <div className="text-right">
                  <Link 
                    to="#" 
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <Button type="button" variant="outline" className="w-full" onClick={toggleDemo}>
                {showDemo ? "Hide Demo Credentials" : "Show Demo Credentials"}
              </Button>
              
              {showDemo && (
                <Alert>
                  <AlertDescription>
                    <div className="text-sm space-y-1">
                      <p className="font-bold">Demo Credentials:</p>
                      <p>Community ID: <span className="font-medium">COM001</span> (for all users)</p>
                      <p>Manager: username: <span className="font-medium">manager</span>, password: <span className="font-medium">password</span></p>
                      <p>Staff: username: <span className="font-medium">staff</span>, password: <span className="font-medium">password</span></p>
                      <p>Resident: username: <span className="font-medium">resident</span>, password: <span className="font-medium">password</span></p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/register")}>
                Sign up
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Auth;

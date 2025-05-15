
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, Building } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    communityId: '',
    userRole: 'resident',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, userRole: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Registration Failed",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (formData.userRole !== 'manager' && !formData.communityId) {
      toast({
        title: "Registration Failed",
        description: "Please provide a community ID.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Registration Failed",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Registration Successful",
        description: `Your ${formData.userRole} account has been created.`,
      });
      setIsSubmitting(false);
      navigate("/auth"); // Redirect to login page
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="border-border shadow-lg">
          <CardHeader className="space-y-1 text-center">
            {formData.userRole === 'manager' ? (
              <div className="flex justify-center mb-2">
                <div className="rounded-full bg-primary p-2">
                  <Building className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-2">
                <div className="rounded-full bg-primary p-2">
                  <User className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            )}
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              Register as a resident or community manager
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userRole">Register as</Label>
                <Select 
                  value={formData.userRole} 
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resident">Resident</SelectItem>
                    <SelectItem value="manager">Community Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.userRole !== 'manager' && (
                <div className="space-y-2">
                  <Label htmlFor="communityId">Community ID</Label>
                  <Input 
                    id="communityId" 
                    name="communityId" 
                    type="text" 
                    placeholder="Enter your community ID" 
                    required={formData.userRole !== 'manager'}
                    value={formData.communityId} 
                    onChange={handleChange}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  type="text" 
                  placeholder="John Doe" 
                  required 
                  value={formData.name} 
                  onChange={handleChange} 
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="john.doe@example.com" 
                  required 
                  value={formData.email} 
                  onChange={handleChange} 
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  value={formData.password} 
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password" 
                  required 
                  value={formData.confirmPassword} 
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : `Register as ${formData.userRole === 'manager' ? 'Community Manager' : 'Resident'}`}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/auth" className="text-primary underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;

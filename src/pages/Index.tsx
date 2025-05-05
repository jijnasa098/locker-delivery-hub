
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, MapPin, Lock, UserCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-gradient text-white py-20 md:py-28">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur mb-8">
                <Package className="h-8 w-8" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6 animate-fade-in">
                Smart Parcel Locker System
              </h1>
              <p className="text-xl md:text-2xl max-w-3xl mb-8 text-white/90 animate-fade-in">
                Secure package deliveries for your community or hostel. 
                No more lost or misplaced packages.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90" 
                  onClick={() => navigate('/auth?mode=register')}
                >
                  Get Started
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10" 
                  onClick={() => navigate('/how-it-works')}
                >
                  How It Works
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose LockerHub?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our smart parcel locker system solves delivery problems without expensive IoT hardware.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-background rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Secure Package Storage</h3>
                <p className="text-muted-foreground">
                  Packages are securely stored in designated lockers until you're ready to collect them.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-background rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Easy Collection</h3>
                <p className="text-muted-foreground">
                  Collect your packages anytime with a simple QR code or collection code.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-background rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Automated Notifications</h3>
                <p className="text-muted-foreground">
                  Get instant notifications when your package is delivered and ready for collection.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our system is designed to be simple and efficient for both residents and administrators.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="bg-background border rounded-lg p-6 h-full">
                  <div className="absolute -top-4 left-6 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-medium mt-4 mb-4">Package Arrival</h3>
                  <p className="text-muted-foreground">
                    When a package arrives, the admin registers it in our system and assigns it to a locker.
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative">
                <div className="bg-background border rounded-lg p-6 h-full">
                  <div className="absolute -top-4 left-6 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-medium mt-4 mb-4">Notification</h3>
                  <p className="text-muted-foreground">
                    You receive an instant notification with your package details and locker number.
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative">
                <div className="bg-background border rounded-lg p-6 h-full">
                  <div className="absolute -top-4 left-6 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-medium mt-4 mb-4">Collection</h3>
                  <p className="text-muted-foreground">
                    Use the generated QR code in the app to collect your package at your convenience.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Button
                size="lg"
                onClick={() => navigate('/auth?mode=register')}
              >
                Get Started Now
              </Button>
            </div>
          </div>
        </section>
        
        {/* Testimonial Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See how LockerHub has helped communities and hostels manage their deliveries.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-background rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                    <span className="text-primary font-bold">JD</span>
                  </div>
                  <div>
                    <h4 className="font-medium">John Doe</h4>
                    <p className="text-sm text-muted-foreground">Resident</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                  "Since our community started using LockerHub, I've never had to worry about missing packages. It's incredibly convenient!"
                </p>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-background rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                    <span className="text-primary font-bold">SA</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Sarah Adams</h4>
                    <p className="text-sm text-muted-foreground">Property Manager</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                  "Managing deliveries used to take hours of our staff's time. LockerHub has streamlined the entire process for us."
                </p>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-background rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                    <span className="text-primary font-bold">RM</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Robert Miller</h4>
                    <p className="text-sm text-muted-foreground">Hostel Director</p>
                  </div>
                </div>
                <p className="italic text-muted-foreground">
                  "Our students love the flexibility of collecting packages on their own schedule. It's been a game-changer for our campus."
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="bg-primary/10 rounded-xl p-8 md:p-12">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to improve package management?</h2>
                <p className="text-lg mb-8">
                  Join hundreds of communities and hostels that have streamlined their delivery process with LockerHub.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/auth?mode=register')}
                  >
                    Sign Up Now
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={() => navigate('/contact')}
                  >
                    Contact Sales
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-muted py-12 mt-auto">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Package className="h-6 w-6 text-primary mr-2" />
                <span className="font-bold text-xl">LockerHub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Smart parcel locker solution for communities and hostels.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">How It Works</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LockerHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

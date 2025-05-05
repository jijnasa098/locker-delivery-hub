
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Package, User } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface NavbarProps {
  user?: {
    name: string;
    role: string;
  } | null;
  onLogout?: () => void;
}

const Navbar = ({ user, onLogout }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center mr-4">
          <Package className="h-6 w-6 text-primary mr-2" />
          <Link to="/" className="font-bold text-xl">LockerHub</Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className={cn(
                  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                )}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/50 to-primary p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <Package className="h-6 w-6 text-white" />
                        <div className="mb-2 mt-4 text-lg font-medium text-white">
                          LockerHub
                        </div>
                        <p className="text-sm leading-tight text-white/90">
                          Secure and convenient package management for your community
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <Link to="/how-it-works" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">How It Works</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Learn about our smart locker system
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/pricing" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Pricing</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Affordable plans for communities and hostels
                      </p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Contact</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Get in touch with our support team
                      </p>
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/about">
                <NavigationMenuLink className={cn(
                  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                )}>
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <>
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button variant="ghost" onClick={onLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/auth?mode=login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/auth?mode=register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <Link to="/how-it-works" className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
              How It Works
            </Link>
            <Link to="/pricing" className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
              Pricing
            </Link>
            <Link to="/about" className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
              About
            </Link>
            <Link to="/contact" className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md" onClick={() => setIsMobileMenuOpen(false)}>
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

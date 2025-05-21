
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import {  useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { authState, signOut } = useAuth();
  const isAuthenticated = !!authState.user;
 const navigate = useNavigate();


   const handleSignOut = async () => {
    await signOut();
    navigate("/"); // <-- redirect to home
  };


  return (
    <header className="w-full py-3 bg-white shadow-md fixed top-0 left-0 right-0 z-40">
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-deep-blue font-semibold text-xl">MindEase</div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-neutral-dark hover:text-deep-blue transition-colors">Features</a>
          <a href="#how-it-works" className="text-neutral-dark hover:text-deep-blue transition-colors">How It Works</a>
          <a href="#technology" className="text-neutral-dark hover:text-deep-blue transition-colors">Technology</a>
          <a href="#resources" className="text-neutral-dark hover:text-deep-blue transition-colors">Resources</a>
          
          {isAuthenticated ? (
            <>
              <Button variant="ghost" className="text-neutral-dark hover:text-deep-blue transition-colors" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <Button variant="default" className="ml-4" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="p-2 rounded-md md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <Menu className="h-6 w-6 text-neutral-dark" />
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white shadow-lg">
          <div className="container px-4 py-6">
            <div className="flex justify-end mb-4">
              <button
                className="p-2 rounded-md focus:outline-none"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6 text-neutral-dark" />
              </button>
            </div>

            <nav className="flex flex-col space-y-6 text-center">
              <a 
                href="#features" 
                className="text-lg font-medium text-neutral-dark hover:text-deep-blue"
                onClick={() => setIsOpen(false)}
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className="text-lg font-medium text-neutral-dark hover:text-deep-blue"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </a>
              <a 
                href="#technology" 
                className="text-lg font-medium text-neutral-dark hover:text-deep-blue"
                onClick={() => setIsOpen(false)}
              >
                Technology
              </a>
              <a 
                href="#resources" 
                className="text-lg font-medium text-neutral-dark hover:text-deep-blue"
                onClick={() => setIsOpen(false)}
              >
                Resources
              </a>
              
                   {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-lg font-medium text-neutral-dark hover:text-deep-blue"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Button
                  variant="outline"
                  className="mt-6 w-full"
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                className="mt-6 w-full"
                onClick={() => setIsOpen(false)}
                asChild
              >
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </nav>

          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
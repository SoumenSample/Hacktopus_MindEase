
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
const Hero = () => {
  const { authState, signOut } = useAuth();
  const isAuthenticated = !!authState.user;

  return (
    <section className="pt-28 pb-20 gradient-bg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-12 md:mb-0 space-y-6 animate-fade-in">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-calm-blue text-deep-blue text-sm font-medium mb-4">
              <Brain className="h-4 w-4 mr-2" />
              <span>Stress Monitoring Technology</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-dark leading-tight">
              Monitor Your <span className="text-deep-blue">Mental Wellbeing</span>
            </h1>
            
            <p className="text-lg text-neutral-dark opacity-90 max-w-xl">
              The MindEase headband uses advanced biosensors to detect your stress levels and helps you stay mindful of your mental state.
            </p>
                        {isAuthenticated ? (
              <>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
             <Button size="lg" className="px-8" asChild>
             <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                Learn More
              </Button>
            </div>
            </>
            ): (
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="px-8" asChild>
  <Link to="/auth">Get Started</Link>
</Button>
                <Button size="lg" variant="outline" className="px-8">
                  Learn More
                </Button>
              </div>
            )}
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-72 md:w-96 h-72 md:h-96 animate-pulse-gentle">
              <div className="absolute inset-0 bg-white shadow-xl rounded-full opacity-30 blur-xl"></div>
              <div className="relative bg-white shadow-lg rounded-full p-8 md:p-12 flex items-center justify-center">
                <div className="w-full max-w-[250px]">
                  <div className="w-full aspect-square rounded-full bg-calm-blue flex items-center justify-center">
                    <div className="w-3/4 h-2/3 border-2 border-deep-blue rounded-full flex items-center justify-center relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-soft-green animate-pulse-gentle"></div>
                      <div className="w-full h-full border-t-2 border-deep-blue rounded-full transform rotate-45"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

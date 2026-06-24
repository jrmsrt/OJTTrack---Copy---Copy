import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

export function BrandedHeader() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-[#D4AF37] shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left branding */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img 
            src="/pup-logo.png" 
            alt="PUP Logo" 
            className="h-14 w-14 object-contain"
          />
          <div className="flex flex-col text-left">
            <span className="font-bold text-[#800000] text-sm sm:text-base leading-tight tracking-tight uppercase">
              Polytechnic University of the Philippines
            </span>
            <span className="text-xs sm:text-sm text-slate-500 font-medium">
              OJT Monitoring System
            </span>
          </div>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link 
            to="/login" 
            className="text-[#800000] font-semibold text-sm sm:text-base hover:text-[#6b0000] transition-colors"
          >
            Login
          </Link>
          <Button 
            onClick={() => navigate('/register')} 
            className="bg-[#800000] hover:bg-[#6b0000] text-white font-bold text-sm sm:text-base px-5 py-2.5 rounded shadow transition-all duration-150"
          >
            Register
          </Button>
        </div>
      </div>
    </header>
  );
}

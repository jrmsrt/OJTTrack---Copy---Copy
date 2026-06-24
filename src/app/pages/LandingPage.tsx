import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { BrandedHeader } from '../components/BrandedHeader';

export function LandingPage() {
  const navigate = useNavigate();

  const stats = [
    { count: '128', label: 'Students' },
    { count: '24', label: 'Supervisors' },
    { count: '6', label: 'Coordinators' },
    { count: '18', label: 'Partner HTEs' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <BrandedHeader />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8 justify-center">
        {/* Centered Hero Card */}
        <div 
          className="relative w-full overflow-hidden rounded-2xl bg-cover bg-center min-h-[350px] sm:min-h-[480px] flex items-center shadow-lg"
          style={{ backgroundImage: "url('https://www.pup.edu.ph/about/images/pylon2022.jpg')" }}
        >
          {/* Deep Maroon Transparent Overlay */}
          <div className="absolute inset-0 bg-[#800000]/85 mix-blend-multiply" />
          
          {/* Hero Content */}
          <div className="relative z-10 w-full px-6 sm:px-12 py-12 sm:py-20 text-white flex flex-col items-start max-w-3xl">
            <span className="text-[#D4AF37] font-semibold text-xs sm:text-sm tracking-widest uppercase mb-3">
              Polytechnic University of the Philippines
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
              OJT Monitoring System
            </h1>
            <p className="text-sm sm:text-lg text-white/90 font-light leading-relaxed mb-8 max-w-2xl">
              Manage student attendance, deployment requirements, task progress, reports, and internship compliance in one centralized platform.
            </p>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-[#800000] hover:bg-[#6b0000] text-white font-bold text-sm sm:text-base px-6 py-3 rounded border border-[#D4AF37] shadow-md transition-all duration-150"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Statistic Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between items-start transition-all hover:shadow-md"
            >
              <span className="text-4xl sm:text-5xl font-extrabold text-[#800000] tracking-tight mb-1">
                {stat.count}
              </span>
              <span className="text-sm sm:text-base font-semibold text-slate-500">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs sm:text-sm text-slate-400">
        <div className="max-w-7xl mx-auto px-4">
          &copy; {new Date().getFullYear()} Polytechnic University of the Philippines. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

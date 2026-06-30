import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { BrandedHeader } from '../components/BrandedHeader';
import {
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  const stats = [
    { count: '128', label: 'Students' },
    { count: '24', label: 'Supervisors' },
    { count: '6', label: 'Coordinators' },
    { count: '18', label: 'Partner HTEs' },
  ];

  const roleHighlights = [
    {
      icon: Users,
      title: 'Students',
      description: 'Track deployment clearance, attendance logs, daily tasks, weekly journals, DTR records, and portfolio completion.',
    },
    {
      icon: ClipboardCheck,
      title: 'Advisers',
      description: 'Review submitted requirements, monitor attendance, evaluate journals, and provide remarks throughout the OJT period.',
    },
    {
      icon: Building2,
      title: 'Coordinators',
      description: 'Manage student masterlists, host companies, templates, MOA progress, evaluation forms, and program-wide compliance.',
    },
  ];

  const workflowItems = [
    { icon: FileText, label: 'Pre-OJT requirements and MOA routing' },
    { icon: MapPin, label: 'Location-aware attendance and DTR generation' },
    { icon: ClipboardCheck, label: 'Daily task logs and weekly journal review' },
    { icon: BarChart3, label: 'Dashboards, reports, and export-ready records' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <BrandedHeader />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-8">
        <div 
          className="relative w-full overflow-hidden rounded-2xl bg-cover bg-center min-h-[350px] sm:min-h-[480px] flex items-center shadow-lg"
          style={{ backgroundImage: "url('https://www.pup.edu.ph/about/images/pylon2022.jpg')" }}
        >
          <div className="absolute inset-0 bg-[#800000]/85 mix-blend-multiply" />
          
          <div className="relative z-10 w-full px-6 sm:px-12 py-12 sm:py-20 text-white flex flex-col items-start max-w-3xl">
            <span className="text-[#D4AF37] font-semibold text-xs sm:text-sm tracking-widest uppercase mb-3">
              Polytechnic University of the Philippines
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
              InTrack - OJT Monitoring System
            </h1>
            <p className="text-sm sm:text-lg text-white/90 font-light leading-relaxed mb-8 max-w-2xl">
              A centralized internship tracking portal for student deployment, host training establishment coordination, adviser review, attendance validation, task documentation, and completion reporting.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => navigate('/login')}
                className="bg-[#800000] hover:bg-[#6b0000] text-white font-bold text-sm sm:text-base px-6 py-3 rounded border border-[#D4AF37] shadow-md transition-all duration-150"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                onClick={() => document.getElementById('intrack-overview')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white/10 hover:bg-white/20 text-white border-white/60 font-semibold text-sm sm:text-base px-6 py-3 rounded"
              >
                View Overview
              </Button>
            </div>
          </div>
        </div>

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

        <section id="intrack-overview" className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start py-4">
          <div>
            <span className="text-[#800000] text-xs font-bold uppercase tracking-widest">About InTrack</span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Built for the full OJT lifecycle
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              InTrack brings together the major records needed before, during, and after on-the-job training. It helps departments maintain a clearer view of each intern's clearance status, company assignment, rendered hours, adviser feedback, submitted forms, and final portfolio progress.
            </p>
            <p className="mt-3 text-slate-600 leading-relaxed">
              The system supports students, advisers, and coordinators with shared records so approvals, revisions, and monitoring updates are easier to follow from one place.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#800000]/10 text-[#800000] flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Centralized records</h3>
                <p className="text-sm text-slate-500">Student files, attendance logs, and review remarks stay tied to the internship profile.</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {workflowItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <Icon className="h-4 w-4 text-[#800000] mt-0.5 shrink-0" />
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {roleHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="h-11 w-11 rounded-lg bg-[#800000]/10 text-[#800000] flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm mb-4">
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 items-start">
            <div>
              <span className="text-[#800000] text-xs font-bold uppercase tracking-widest">Program Coverage</span>
              <h2 className="mt-3 text-2xl font-bold text-slate-900 tracking-tight">
                From deployment clearance to final completion
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                InTrack organizes internship records into clear stages so every role can see what is pending, submitted, approved, or needing revision.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Authorized student masterlist and account activation',
                'Company deployment profiles and GPS boundary details',
                'MOA status tracking and document review history',
                'Pre-OJT, During-OJT, and Post-OJT checklist monitoring',
                'Attendance logs, rendered hours, and DTR compilation',
                'Weekly journals, evaluations, announcements, and messages',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-lg bg-slate-50 border border-slate-100 p-3">
                  <CheckCircle2 className="h-4 w-4 text-green-700 mt-0.5 shrink-0" />
                  <span className="text-sm font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs sm:text-sm text-slate-400">
        <div className="max-w-7xl mx-auto px-4">
          &copy; {new Date().getFullYear()} InTrack - OJT Monitoring System. Polytechnic University of the Philippines.
        </div>
      </footer>
    </div>
  );
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { GraduationCap, Users, ArrowLeft } from 'lucide-react';
import { BrandedHeader } from '../../components/BrandedHeader';

export function RegisterSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <BrandedHeader />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-8 max-w-4xl mx-auto w-full gap-6">
        {/* Back navigation */}
        <div className="w-full flex justify-start">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-[#800000] text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Create an Account
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Choose the portal that corresponds to your academic role.
          </p>
        </div>

        {/* Selection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-2">
          {/* Student Card */}
          <Card className="border border-slate-200 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-red-50 text-[#800000] h-14 w-14 rounded-full flex items-center justify-center mb-3">
                <GraduationCap className="h-8 w-8" />
              </div>
              <CardTitle className="text-lg sm:text-xl font-bold text-slate-900">Student Portal</CardTitle>
              <CardDescription className="text-xs sm:text-sm">For active interns and OJT students</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between gap-6 pb-6 text-center">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Register as a student to trace attendance coordinates, check pre/post document requirements, upload task sheets, and compile weekly reflection reports.
              </p>
              <Button 
                onClick={() => navigate('/register/student')} 
                className="w-full bg-[#800000] hover:bg-[#6b0000] text-white font-bold py-2.5 rounded shadow transition-all cursor-pointer"
              >
                Register as Student
              </Button>
            </CardContent>
          </Card>

          {/* Adviser Card */}
          <Card className="border border-slate-200 shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-amber-50 text-[#D4AF37] h-14 w-14 rounded-full flex items-center justify-center mb-3">
                <Users className="h-7 w-7" />
              </div>
              <CardTitle className="text-lg sm:text-xl font-bold text-slate-900">Adviser Portal</CardTitle>
              <CardDescription className="text-xs sm:text-sm">For section advisers & faculty mentors</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between gap-6 pb-6 text-center">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Register as an academic section adviser to monitor your assigned student cohorts, review logs, verify attendance, grade midterm/final metrics, and verify portfolios.
              </p>
              <Button 
                onClick={() => navigate('/register/adviser')} 
                className="w-full bg-slate-900 hover:bg-[#800000] text-white font-bold py-2.5 rounded shadow transition-all cursor-pointer"
              >
                Register as OJT Adviser
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer info */}
        <div className="text-center mt-4">
          <p className="text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-[#800000] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

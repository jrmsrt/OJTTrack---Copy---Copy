import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { BrandedHeader } from '../../components/BrandedHeader';
import { useAuth } from '../../context/AuthContext';

export function ForgotPassword() {
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = requestPasswordReset(email);

    if (!result.requiresOtp) {
      setError(result.error || 'Unable to start password reset. Please try again.');
      return;
    }

    setError('');
    navigate('/verify-otp');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <BrandedHeader />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-8">
        <div className="w-full max-w-[400px]">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader className="text-center px-6 pt-7 pb-3 gap-1">
              <CardTitle className="text-2xl font-bold leading-tight text-slate-900">Reset Password</CardTitle>
              <CardDescription className="text-xs text-slate-500">Enter your activated student PUP Webmail to receive an OTP.</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-3 flex gap-2 text-xs text-red-700">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">PUP Webmail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="yourname@iskolarngbayan.pup.edu.ph"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10 rounded-lg border-slate-200 bg-slate-50 px-3 text-sm"
                      required
                    />
                  </div>
 
                  <Button type="submit" className="h-11 w-full rounded-lg bg-[#800000] hover:bg-[#6b0000] text-sm font-bold text-white shadow-sm cursor-pointer transition-colors mt-2">
                    Send OTP
                  </Button>
 
                  <Link to="/login" className="block w-full">
                    <Button variant="ghost" className="h-9 w-full rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700">
                      <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                      Back to Login
                    </Button>
                  </Link>
                </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

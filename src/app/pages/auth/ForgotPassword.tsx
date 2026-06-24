import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { BrandedHeader } from '../../components/BrandedHeader';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <BrandedHeader />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-8">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border border-slate-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-900">Reset Password</CardTitle>
              <CardDescription>
                {submitted
                  ? 'Check your email for reset instructions'
                  : 'Enter your email to receive a password reset link'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-green-800">
                      A password reset link has been sent to <strong>{email}</strong>
                    </p>
                  </div>
                  <Link to="/login" className="block w-full">
                    <Button variant="outline" className="w-full">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Login
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-[#800000] hover:bg-[#6b0000] text-white font-bold">
                    Send Reset Link
                  </Button>

                  <Link to="/login" className="block w-full">
                    <Button variant="ghost" className="w-full text-slate-600">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Login
                    </Button>
                  </Link>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

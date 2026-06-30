import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { AlertCircle, BriefcaseBusiness, Eye, EyeOff, GraduationCap, Info, ShieldCheck } from 'lucide-react';
import { BrandedHeader } from '../../components/BrandedHeader';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(email, password, role);

    if (!result.success) {
      if (result.requiresOtp) {
        navigate('/verify-otp');
        return;
      }

      setError(result.error || 'Unable to sign in. Please try again.');
      return;
    }

    setError('');
    navigate('/dashboard');
  };

  const handleRoleChange = (value: string) => {
    setRole(value as UserRole);
    setEmail('');
    setPassword('');
    setError('');
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <BrandedHeader />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-8">
        <div className="w-full max-w-[420px]">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader className="text-center px-6 pt-7 pb-3 gap-1">
              <CardTitle className="text-2xl font-bold leading-tight text-slate-900">Welcome Back</CardTitle>
              <CardDescription className="text-xs text-slate-500">Sign in to continue to the OJT monitoring system.</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <Tabs value={role} onValueChange={handleRoleChange}>
                <TabsList className="grid w-full grid-cols-3 mb-4 h-10 rounded-xl bg-slate-100 p-0.5">
                  <TabsTrigger value="student" className="h-full rounded-[9px] px-1 text-xs font-semibold text-slate-600 data-[state=active]:bg-white data-[state=active]:text-[#990000] data-[state=active]:shadow-sm">
                    <GraduationCap className="h-3.5 w-3.5" />
                    Student
                  </TabsTrigger>
                  <TabsTrigger value="adviser" className="h-full rounded-[9px] px-1 text-xs font-semibold text-slate-600 data-[state=active]:bg-white data-[state=active]:text-[#990000] data-[state=active]:shadow-sm">
                    <BriefcaseBusiness className="h-3.5 w-3.5" />
                    Adviser
                  </TabsTrigger>
                  <TabsTrigger value="coordinator" className="h-full rounded-[9px] px-1 text-xs font-semibold text-slate-600 data-[state=active]:bg-white data-[state=active]:text-[#990000] data-[state=active]:shadow-sm">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Coordinator
                  </TabsTrigger>
                </TabsList>

                {error && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 flex gap-2 text-xs text-red-700">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <TabsContent value="student">
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</Label>
                        <Link to="/forgot-password" className="text-xs text-[#990000] font-semibold hover:underline">
                          Forgot Password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-10 rounded-lg border-slate-200 bg-slate-50 px-3 pr-10 text-sm"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#800000] focus:outline-none transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="h-11 w-full rounded-lg bg-[#800000] hover:bg-[#6b0000] text-sm font-bold text-white shadow-sm cursor-pointer transition-colors mt-2">
                      Login
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="adviser">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="adviser-email" className="text-xs font-bold uppercase tracking-wider text-slate-500">PUP Webmail</Label>
                      <Input
                        id="adviser-email"
                        type="email"
                        placeholder="faculty@pup.edu.ph"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-10 rounded-lg border-slate-200 bg-slate-50 px-3 text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="adviser-password" className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</Label>
                        <Link to="/forgot-password" className="text-xs text-[#990000] font-semibold hover:underline">
                          Forgot Password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="adviser-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-10 rounded-lg border-slate-200 bg-slate-50 px-3 pr-10 text-sm"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#800000] focus:outline-none transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="h-11 w-full rounded-lg bg-[#800000] hover:bg-[#6b0000] text-sm font-bold text-white shadow-sm cursor-pointer transition-colors mt-2">
                      Login
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="coordinator">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="coordinator-email" className="text-xs font-bold uppercase tracking-wider text-slate-500">Username or Admin Email</Label>
                      <Input
                        id="coordinator-email"
                        type="text"
                        placeholder="admin"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-10 rounded-lg border-slate-200 bg-slate-50 px-3 text-sm"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div>
                        <Label htmlFor="coordinator-password" className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</Label>
                      </div>
                      <div className="relative">
                        <Input
                          id="coordinator-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-10 rounded-lg border-slate-200 bg-slate-50 px-3 pr-10 text-sm"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#800000] focus:outline-none transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="h-11 w-full rounded-lg bg-[#800000] hover:bg-[#6b0000] text-sm font-bold text-white shadow-sm cursor-pointer transition-colors mt-2">
                      Login
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 rounded-lg border border-cyan-200 bg-cyan-50/50 px-3.5 py-2.5 text-center text-xs leading-relaxed text-cyan-900">
                <div className="flex justify-center gap-2">
                  <Info className="h-4 w-4 mt-0.5 shrink-0 fill-cyan-900/10 text-cyan-700" />
                  <p>
                    Users must activate their account before first use.<br />
                    Use your PUP Webmail and the default password provided by the administrator.
                  </p>
                </div>
              </div>

              <p className="text-center text-[10px] text-slate-400 mt-6 leading-relaxed">
                By using this service, you understood and agree to the PUP Online Services{' '}
                <a href="https://www.pup.edu.ph/terms/" target="_blank" rel="noreferrer" className="text-blue-600 font-medium hover:underline">
                  Terms of Use
                </a>{' '}
                and{' '}
                <a href="https://www.pup.edu.ph/privacy/" target="_blank" rel="noreferrer" className="text-blue-600 font-medium hover:underline">
                  Privacy Statement
                </a>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

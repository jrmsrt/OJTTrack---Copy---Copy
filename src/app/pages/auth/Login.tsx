import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Checkbox } from '../../components/ui/checkbox';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
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
        <div className="w-full max-w-md">
          <Card className="shadow-lg border border-slate-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-slate-900">Welcome Back</CardTitle>
              <CardDescription>Select your role and sign in to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={role} onValueChange={handleRoleChange}>
                <TabsList className="grid w-full grid-cols-3 mb-6 h-auto">
                  <TabsTrigger value="student" className="min-h-10 text-xs sm:text-sm">Student</TabsTrigger>
                  <TabsTrigger value="adviser" className="min-h-10 text-xs sm:text-sm">Adviser</TabsTrigger>
                  <TabsTrigger value="coordinator" className="min-h-10 text-xs sm:text-sm">Coordinator</TabsTrigger>
                </TabsList>

                {error && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 flex gap-2 text-sm text-red-700">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <TabsContent value="student">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="student@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pr-10"
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember" className="text-sm cursor-pointer">
                          Remember me
                        </Label>
                      </div>
                      <Link to="/forgot-password" className="text-sm text-[#800000] font-semibold hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Button type="submit" className="w-full bg-[#800000] hover:bg-[#6b0000] cursor-pointer text-white">
                      Sign In
                    </Button>
                    <p className="text-center text-sm text-slate-600">
                      Need a student account?{' '}
                      <Link to="/register/student" className="text-[#800000] font-semibold hover:underline">
                        Register
                      </Link>
                    </p>
                  </form>
                </TabsContent>

                <TabsContent value="adviser">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="adviser-email">Email</Label>
                      <Input
                        id="adviser-email"
                        type="email"
                        placeholder="adviser@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adviser-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="adviser-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pr-10"
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="adviser-remember" />
                        <Label htmlFor="adviser-remember" className="text-sm cursor-pointer">
                          Remember me
                        </Label>
                      </div>
                      <Link to="/forgot-password" className="text-sm text-[#800000] font-semibold hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Button type="submit" className="w-full bg-[#800000] hover:bg-[#6b0000] text-white">
                      Sign In
                    </Button>
                    <p className="text-center text-sm text-slate-600">
                      Need an adviser account?{' '}
                      <Link to="/register/adviser" className="text-[#800000] font-semibold hover:underline">
                        Register
                      </Link>
                    </p>
                  </form>
                </TabsContent>

                <TabsContent value="coordinator">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="coordinator-email">Email</Label>
                      <Input
                        id="coordinator-email"
                        type="email"
                        placeholder="coordinator@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coordinator-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="coordinator-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pr-10"
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="coordinator-remember" />
                        <Label htmlFor="coordinator-remember" className="text-sm cursor-pointer">
                          Remember me
                        </Label>
                      </div>
                      <Link to="/forgot-password" className="text-sm text-[#800000] font-semibold hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Button type="submit" className="w-full bg-[#800000] hover:bg-[#6b0000] text-white">
                      Sign In
                    </Button>
                    <p className="text-center text-xs text-slate-500">
                      Coordinator accounts are created by system administrators.
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-slate-500 mt-6">
            Demo accounts remain available; new Student and Adviser accounts require email verification.
          </p>

          <Card className="mt-4 bg-red-50 border-red-200 shadow-sm">
            <CardContent className="p-4 text-left">
              <h3 className="font-semibold text-[#800000] mb-2 text-sm">Login Options</h3>
              <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
                <li>Student Login: track attendance, upload requirements, and submit reports</li>
                <li>Adviser Login: monitor assigned interns, review journals, and submit grades</li>
                <li>OJT Coordinator Login: manage programs, templates, and document reviews</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

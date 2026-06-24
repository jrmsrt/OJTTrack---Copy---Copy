import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOJT, OJTStage } from '../context/OJTContext';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  ClipboardCheck,
  CheckSquare,
  FileText,
  Files,
  BarChart3,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  User,
  Users,
  Lock,
  Unlock,
  Building,
  GraduationCap,
  MapPin,
  RefreshCw,
  Sliders,
  HelpCircle,
  Award,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, login, logout } = useAuth();
  const { 
    students, 
    companies, 
    mockLocation, 
    setMockLocation, 
    forceUnlockStage, 
    resetAllDemoData 
  } = useOJT();
  
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [simPanelOpen, setSimPanelOpen] = useState(false);

  const studentProfile = students.find(s => s.studentId === user?.id || s.email === user?.email);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavigationItems = () => {
    if (user?.role === 'student') {
      const stage = studentProfile?.stage || 'Stage 1: Pre-OJT';
      
      // Determine what is locked based on student stage
      const isStage2Locked = stage === 'Stage 1: Pre-OJT';
      const isStage3Locked = stage === 'Stage 1: Pre-OJT' || stage === 'Stage 2: During OJT';
      
      return [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', locked: false, stage: 'Stage 1' },
        { path: '/forms-templates', icon: Files, label: 'Forms & Templates', locked: false, stage: 'Stage 1' },
        { path: '/pre-ojt', icon: ClipboardCheck, label: 'Pre-OJT Requirements', locked: false, stage: 'Stage 1' },
        { path: '/moa', icon: FileText, label: 'MOA Tracking', locked: false, stage: 'Stage 1' },
        
        { path: '/attendance', icon: MapPin, label: 'Attendance & DTR', locked: isStage2Locked, stage: 'Stage 2' },
        { path: '/tasks', icon: CheckSquare, label: 'Daily Task Logs', locked: isStage2Locked, stage: 'Stage 2' },
        { path: '/weekly-journal', icon: FileText, label: 'Weekly Journals', locked: isStage2Locked, stage: 'Stage 2' },
        { path: '/during-ojt', icon: Files, label: 'During-OJT Checklist', locked: isStage2Locked, stage: 'Stage 2' },
        
        { path: '/post-ojt', icon: ClipboardCheck, label: 'Post-OJT Checklist', locked: isStage3Locked, stage: 'Stage 3' },
        { path: '/portfolio', icon: Award, label: 'Portfolio Builder', locked: isStage3Locked, stage: 'Stage 4' },
        { path: '/messages', icon: MessageSquare, label: 'Messages & Alerts', locked: false },
        { path: '/settings', icon: Settings, label: 'Profile & Settings', locked: false },
      ];
    }

    if (user?.role === 'adviser') {
      return [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Adviser Dashboard' },
        { path: '/adviser/students', icon: Users, label: 'Student Monitoring' },
        { path: '/adviser/attendance', icon: ClipboardCheck, label: 'Attendance Monitoring' },
        { path: '/adviser/tasks', icon: CheckSquare, label: 'Daily Task Review' },
        { path: '/adviser/journals', icon: FileText, label: 'Weekly Journal Review' },
        { path: '/adviser/during-ojt', icon: Files, label: 'During-OJT Reviews' },
        { path: '/adviser/post-ojt', icon: ClipboardCheck, label: 'Post-OJT Reviews' },
        { path: '/adviser/evaluation', icon: Award, label: 'Evaluations (Grading)' },
        { path: '/adviser/portfolio', icon: Files, label: 'Portfolio Reviews' },
        { path: '/messages', icon: MessageSquare, label: 'Messages' },
        { path: '/settings', icon: Settings, label: 'Settings' },
      ];
    }

    if (user?.role === 'coordinator') {
      return [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Coordinator Dashboard' },
        { path: '/coordinator/students', icon: GraduationCap, label: 'Student Management' },
        { path: '/coordinator/advisers', icon: Users, label: 'Adviser Management' },
        { path: '/coordinator/companies', icon: Building, label: 'Company Deployment' },
        { path: '/coordinator/pre-ojt', icon: ClipboardCheck, label: 'Pre-OJT Document Review' },
        { path: '/coordinator/moas', icon: FileText, label: 'MOA Management' },
        { path: '/coordinator/templates', icon: Files, label: 'Template Management' },
        { path: '/coordinator/evaluation-forms', icon: Award, label: 'Evaluation Form Builder' },
        { path: '/coordinator/database', icon: FileText, label: 'OJT Database & Export' },
        { path: '/coordinator/portfolios', icon: Files, label: 'Portfolio Review Board' },
        { path: '/coordinator/announcements', icon: Bell, label: 'Announcements Editor' },
        { path: '/coordinator/settings', icon: Settings, label: 'System Configuration' },
        { path: '/messages', icon: MessageSquare, label: 'Messages' },
        { path: '/settings', icon: Settings, label: 'Settings' },
      ];
    }

    return [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' }
    ];
  };

  const navItems = getNavigationItems();

  const handleLockedClick = (e: React.MouseEvent, label: string) => {
    e.preventDefault();
    toast.error(`"${label}" is locked. Complete the current OJT Stage requirements to unlock During-OJT and Post-OJT modules.`, {
      description: `Current Stage: ${studentProfile?.stage || 'Stage 1: Pre-OJT'}`
    });
  };

  // Demo shortcut login helper
  const handleDemoLogin = (role: 'student' | 'adviser' | 'coordinator') => {
    if (role === 'student') {
      login('sarah.johnson@university.edu', '', 'student');
    } else if (role === 'adviser') {
      login('michael.chen@techcorp.com', '', 'adviser');
    } else {
      login('emily.rodriguez@university.edu', '', 'coordinator');
    }
    toast.success(`Logged in as ${role === 'student' ? 'Sarah (Student)' : role === 'adviser' ? 'Michael (Adviser)' : 'Emily (Coordinator)'}`);
    navigate('/dashboard');
    setSimPanelOpen(false);
  };

  // Stage simulation helper
  const handleForceStage = (stage: OJTStage) => {
    if (!studentProfile) return;
    forceUnlockStage(studentProfile.studentId, stage);
    toast.success(`Sarah's profile forced to ${stage}. Checklists updated!`);
  };

  // Location simulation helper
  const handleSimulateLocation = (type: 'inside' | 'outside' | 'denied') => {
    if (type === 'inside') {
      // TechCorp Inc. (Makati Office: 14.5547, 121.0244)
      setMockLocation({ lat: 14.55472, lng: 121.02444, accuracy: 5 });
      toast.success("Location set inside TechCorp Office boundary.");
    } else if (type === 'outside') {
      // Set to random Makati landmark outside geofence (approx 5km away)
      setMockLocation({ lat: 14.5995, lng: 120.9842, accuracy: 10 });
      toast.error("Location set outside company deployment radius.");
    } else {
      setMockLocation({ lat: 0, lng: 0, accuracy: 99999 });
      toast.error("Location permission disabled (Invalid Location).");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between px-4 lg:px-6 h-16">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link to="/dashboard" className="flex items-center gap-2">
              <img 
                src="/pup-logo.png" 
                alt="PUP Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="font-semibold text-lg hidden sm:inline text-[#800000] tracking-tight">
                PUP OJT Portal
              </span>
            </Link>
          </div>

          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search metrics, reports..."
                className="pl-10 bg-slate-50 border-slate-200 rounded-lg focus-visible:ring-[#800000]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Simulation Indicator */}
            {user?.role === 'student' && studentProfile && (
              <Badge className="bg-gradient-to-r from-red-700 to-maroon-800 text-white font-medium text-xs px-3 py-1 mr-2 hidden md:inline-flex items-center gap-1.5 rounded-full shadow-sm">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                {studentProfile.stage}
              </Badge>
            )}

            {/* Notification Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-slate-600 hover:bg-slate-100 rounded-full">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>System Alerts</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto p-1">
                  <div className="p-3 rounded-lg hover:bg-slate-50 cursor-pointer text-xs transition-colors">
                    <p className="font-semibold text-slate-800">Pre-Deployment Checklists</p>
                    <p className="text-slate-600 mt-0.5">Please review your Consent and Waiver status. Needs Adviser review.</p>
                    <p className="text-[10px] text-slate-400 mt-1">2 hours ago</p>
                  </div>
                  <div className="p-3 rounded-lg hover:bg-slate-50 cursor-pointer text-xs transition-colors">
                    <p className="font-semibold text-slate-800">Coordinator Notice</p>
                    <p className="text-slate-600 mt-0.5">Academic details for Term 2 have been published.</p>
                    <p className="text-[10px] text-slate-400 mt-1">1 day ago</p>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Account Details */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2 hover:bg-slate-100 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-[#800000] text-white flex items-center justify-center font-bold text-sm">
                    {user?.name.charAt(0)}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-semibold text-slate-800 leading-none">{user?.name}</p>
                    <span className="text-[10px] text-slate-500 font-medium capitalize mt-1 block">
                      {user?.role === 'adviser' ? 'OJT Adviser' : user?.role}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Account Panel</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-80 bg-white border-r border-slate-200 
            transition-transform duration-200 ease-in-out
            flex flex-col justify-between
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
            {user?.role === 'student' && studentProfile && (
              <div className="px-3 py-2 bg-slate-50 rounded-lg mb-3">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">OJT Stage Progress</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#800000] h-full rounded-full transition-all duration-300"
                      style={{
                        width: 
                          studentProfile.stage.includes('Stage 1') ? '25%' :
                          studentProfile.stage.includes('Stage 2') ? '50%' :
                          studentProfile.stage.includes('Stage 3') ? '75%' : '100%'
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[#800000]">
                    {studentProfile.stage.includes('Stage 1') ? '1/4' :
                     studentProfile.stage.includes('Stage 2') ? '2/4' :
                     studentProfile.stage.includes('Stage 3') ? '3/4' : '4/4'}
                  </span>
                </div>
              </div>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const isLocked = 'locked' in item && item.locked;
              
              return (
                <Link
                  key={item.path}
                  to={isLocked ? '#' : item.path}
                  onClick={(e) => {
                    if (isLocked) {
                      handleLockedClick(e, item.label);
                    } else {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`
                    flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all
                    ${
                      isActive
                        ? 'bg-red-50 text-[#800000] font-bold shadow-sm border-l-4 border-[#800000]'
                        : isLocked
                        ? 'text-slate-300 cursor-not-allowed bg-slate-50/50'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${isLocked ? 'text-slate-300' : isActive ? 'text-[#800000]' : 'text-slate-500'}`} />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </div>
                  {isLocked && <Lock className="h-3.5 w-3.5 text-slate-300" />}
                  {!isLocked && 'stage' in item && (
                    <Badge variant="outline" className="text-[9px] scale-90 border-slate-200 text-slate-400">
                      {item.stage}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Bottom Details */}
          <div className="p-4 border-t border-slate-200">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-semibold cursor-pointer"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout Account</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to end your current session? You will need to re-verify credentials to access data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </aside>

        {/* Backdrop overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* FLOATING SIMULATION CONTROL PANEL (Stunning developer aid for validation) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setSimPanelOpen(!simPanelOpen)}
          className="h-12 w-12 rounded-full bg-slate-900 text-white hover:bg-slate-800 shadow-xl border border-slate-700 hover:scale-105 transition-all flex items-center justify-center p-0"
          title="OJT Simulation Controls"
        >
          <Sliders className="h-5 w-5 animate-pulse" />
        </Button>

        {simPanelOpen && (
          <div className="absolute bottom-14 right-0 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl p-5 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-1.5">
                <Sliders className="h-4.5 w-4.5 text-[#800000]" />
                <h4 className="font-bold text-sm text-slate-800">OJT Scenario Simulator</h4>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-slate-400 hover:text-slate-600 rounded-full"
                onClick={() => setSimPanelOpen(false)}
              >
                <X className="h-4.5 w-4.5" />
              </Button>
            </div>

            {/* Quick Account Switcher */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Quick Role Swapper
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <Button
                  onClick={() => handleDemoLogin('student')}
                  variant={user?.role === 'student' ? 'default' : 'outline'}
                  className={`text-[10px] font-bold h-8 px-1 truncate ${user?.role === 'student' ? 'bg-[#800000]' : ''}`}
                >
                  Intern (Sarah)
                </Button>
                <Button
                  onClick={() => handleDemoLogin('adviser')}
                  variant={user?.role === 'adviser' ? 'default' : 'outline'}
                  className={`text-[10px] font-bold h-8 px-1 truncate ${user?.role === 'adviser' ? 'bg-slate-900' : ''}`}
                >
                  Adviser (Mich)
                </Button>
                <Button
                  onClick={() => handleDemoLogin('coordinator')}
                  variant={user?.role === 'coordinator' ? 'default' : 'outline'}
                  className={`text-[10px] font-bold h-8 px-1 truncate ${user?.role === 'coordinator' ? 'bg-teal-700 hover:bg-teal-800' : ''}`}
                >
                  Coord (Emily)
                </Button>
              </div>
            </div>

            {/* Stage Progress Override for Student Sarah */}
            {studentProfile && (
              <div className="space-y-1.5 border-t border-slate-100 pt-3">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Force Sarah's OJT Stage
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <Button
                    onClick={() => handleForceStage('Stage 1: Pre-OJT')}
                    variant="outline"
                    className="text-[10px] h-7 font-medium px-2 justify-start truncate"
                  >
                    Reset (Pre-OJT)
                  </Button>
                  <Button
                    onClick={() => handleForceStage('Stage 2: During OJT')}
                    variant="outline"
                    className="text-[10px] h-7 font-medium px-2 justify-start truncate text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100"
                  >
                    Stage 2 (During-OJT)
                  </Button>
                  <Button
                    onClick={() => handleForceStage('Stage 3: Post-OJT')}
                    variant="outline"
                    className="text-[10px] h-7 font-medium px-2 justify-start truncate text-indigo-700 border-indigo-200 bg-indigo-50 hover:bg-indigo-100"
                  >
                    Stage 3 (Post-OJT)
                  </Button>
                  <Button
                    onClick={() => handleForceStage('Stage 4: Portfolio Completion')}
                    variant="outline"
                    className="text-[10px] h-7 font-medium px-2 justify-start truncate text-green-700 border-green-200 bg-green-50 hover:bg-green-100"
                  >
                    Stage 4 (Portfolio)
                  </Button>
                </div>
              </div>
            )}

            {/* Geofence GPS Simulation */}
            <div className="space-y-1.5 border-t border-slate-100 pt-3">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Mock Student GPS coordinates
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <Button
                  onClick={() => handleSimulateLocation('inside')}
                  variant="outline"
                  className="text-[10px] h-7 font-medium px-1 flex items-center justify-center gap-1 text-green-600 border-green-100 bg-green-50 hover:bg-green-100"
                >
                  <MapPin className="h-3 w-3" />
                  Inside
                </Button>
                <Button
                  onClick={() => handleSimulateLocation('outside')}
                  variant="outline"
                  className="text-[10px] h-7 font-medium px-1 flex items-center justify-center gap-1 text-red-600 border-red-100 bg-red-50 hover:bg-red-100"
                >
                  <MapPin className="h-3 w-3" />
                  Outside
                </Button>
                <Button
                  onClick={() => handleSimulateLocation('denied')}
                  variant="outline"
                  className="text-[10px] h-7 font-medium px-1 flex items-center justify-center gap-1 text-slate-500 border-slate-200 bg-slate-50 hover:bg-slate-100"
                >
                  Denied
                </Button>
              </div>
              <div className="bg-slate-50 p-2 rounded text-[10px] text-slate-500 leading-tight">
                <span className="font-semibold">Mock Coordinates:</span> {mockLocation.lat === 0 && mockLocation.lng === 0 ? 'Disabled / Denied' : `${mockLocation.lat.toFixed(5)}, ${mockLocation.lng.toFixed(5)}`}
                {mockLocation.lat === 14.55472 && <span className="text-green-600 block font-semibold mt-0.5">Matches TechCorp Inc. (Verified)</span>}
                {mockLocation.lat === 14.5995 && <span className="text-red-600 block font-semibold mt-0.5">5.2km away (Outside boundary)</span>}
              </div>
            </div>

            {/* Database resetting */}
            <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
              <span className="text-[9px] text-slate-400">Restructured OJT Engine v1.0</span>
              <Button
                variant="ghost"
                className="text-[10px] h-7 px-2 font-bold text-red-600 hover:bg-red-50 flex items-center gap-1 cursor-pointer"
                onClick={resetAllDemoData}
              >
                <RefreshCw className="h-3 w-3 animate-spin" />
                Reset Mock DB
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

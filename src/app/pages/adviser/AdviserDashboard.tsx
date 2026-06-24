import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOJT } from '../../context/OJTContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Users, 
  Clock, 
  FileCheck, 
  Award, 
  ArrowRight, 
  Calendar,
  AlertTriangle,
  ClipboardList
} from 'lucide-react';

export function AdviserDashboard() {
  const { user } = useAuth();
  const { students } = useOJT();
  const navigate = useNavigate();

  // Filter student profiles assigned to this adviser
  const assignedStudents = students.filter(s => s.adviserId === user?.id || s.adviserName === user?.name);

  // Compute metrics
  const totalCount = assignedStudents.length;
  
  // Pending approvals
  let pendingTaskCount = 0;
  let pendingJournalCount = 0;
  let pendingPortfolioCount = 0;
  let completedHoursCount = 0;

  assignedStudents.forEach(s => {
    pendingTaskCount += s.dailyTasks.filter(t => t.status === 'Submitted').length;
    pendingJournalCount += s.weeklyJournals.filter(j => j.status === 'Submitted').length;
    if (s.portfolioSubmitted && !s.portfolioApproved) {
      pendingPortfolioCount++;
    }
    if (s.totalHoursRendered >= s.requiredHours) {
      completedHoursCount++;
    }
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Adviser Welcome */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider">Faculty Portal</span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mt-1">Hello, Prof. {user?.name}!</h1>
          <p className="text-slate-350 text-sm mt-1 font-light">
            Monitor and endorse clearances for your assigned OJT section groups.
          </p>
        </div>
        <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/20 text-xs">
          <p className="text-slate-350">Academic Oversight:</p>
          <p className="font-bold text-slate-100 text-sm mt-0.5">Section BSIT 4A & BSCpE 4A</p>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Interns */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              Assigned Interns
              <Users className="h-4.5 w-4.5 text-slate-400" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-extrabold text-slate-900">{totalCount}</span>
            <span className="text-xs text-slate-500 font-medium ml-1">students</span>
            <p className="text-[10px] text-slate-400 mt-4 font-medium">Monitoring BSIT and BSCpE cohorts</p>
          </CardContent>
        </Card>

        {/* Pending Journals */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              Pending Journals
              <Clock className="h-4.5 w-4.5 text-slate-400" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-extrabold text-slate-900">{pendingJournalCount}</span>
            <span className="text-xs text-slate-500 font-medium ml-1">to review</span>
            {pendingJournalCount > 0 && (
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 text-[9px] scale-90 mt-3.5 block font-bold text-center w-24">
                Needs Review
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Completed Hours */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              Hours Completed
              <FileCheck className="h-4.5 w-4.5 text-slate-400" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-extrabold text-slate-900">{completedHoursCount}</span>
            <span className="text-xs text-slate-500 font-medium ml-1">interns</span>
            <p className="text-[10px] text-slate-400 mt-4 font-medium">Met 480 hours required duration</p>
          </CardContent>
        </Card>

        {/* Portfolios for Review */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              Portfolio Reviews
              <Award className="h-4.5 w-4.5 text-slate-400" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-extrabold text-slate-900">{pendingPortfolioCount}</span>
            <span className="text-xs text-slate-500 font-medium ml-1">awaiting</span>
            {pendingPortfolioCount > 0 && (
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-250 text-[9px] scale-90 mt-3.5 block font-bold text-center w-24">
                Awaiting Endorsement
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Task Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Actions Feed */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800">Pending Review Queue</CardTitle>
            <CardDescription>Actions requiring your review and endorsement signature.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            {pendingJournalCount === 0 && pendingPortfolioCount === 0 && pendingTaskCount === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                All queues clear! No pending submissions.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {assignedStudents.map((s) => {
                  const sTasks = s.dailyTasks.filter(t => t.status === 'Submitted');
                  const sJournals = s.weeklyJournals.filter(j => j.status === 'Submitted');
                  const needsPortfolio = s.portfolioSubmitted && !s.portfolioApproved;

                  if (sTasks.length === 0 && sJournals.length === 0 && !needsPortfolio) return null;

                  return (
                    <div key={s.studentId} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{s.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{s.program} | {s.section}</p>
                      </div>
                      <div className="flex gap-2.5 items-center">
                        {sTasks.length > 0 && (
                          <Badge variant="outline" className="text-[10px] font-semibold text-blue-600 border-blue-200 bg-blue-50">
                            {sTasks.length} Daily Logs
                          </Badge>
                        )}
                        {sJournals.length > 0 && (
                          <Badge variant="outline" className="text-[10px] font-semibold text-amber-700 border-amber-200 bg-amber-50">
                            {sJournals.length} Weekly Journals
                          </Badge>
                        )}
                        {needsPortfolio && (
                          <Badge variant="outline" className="text-[10px] font-semibold text-purple-700 border-purple-200 bg-purple-50">
                            Portfolio Submission
                          </Badge>
                        )}
                        <Button 
                          size="sm"
                          onClick={() => {
                            if (sJournals.length > 0) navigate('/adviser/journals');
                            else if (needsPortfolio) navigate('/adviser/portfolio');
                            else navigate('/adviser/tasks');
                          }}
                          className="bg-[#800000] hover:bg-[#6b0000] text-white text-[10px] h-7 font-semibold"
                        >
                          Review <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick links to monitors */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800">Quick Navigation</CardTitle>
            <CardDescription>Shortcut access to monitoring panels.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              onClick={() => navigate('/adviser/students')}
              className="w-full text-xs h-11 border-slate-200 text-slate-700 flex justify-between items-center px-4 hover:bg-slate-50 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-500" />
                Student Monitoring Board
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/adviser/attendance')}
              className="w-full text-xs h-11 border-slate-200 text-slate-700 flex justify-between items-center px-4 hover:bg-slate-50 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                Attendance Monitor Calendar
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/adviser/evaluation')}
              className="w-full text-xs h-11 border-slate-200 text-slate-700 flex justify-between items-center px-4 hover:bg-slate-50 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Award className="h-4 w-4 text-slate-500" />
                Intern Midterm & Final Grades
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return <ArrowRight className={className} />;
}
